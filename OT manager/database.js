// ==============================================
// Database Simulation for Overtime Tracker
// ==============================================

class Database {
    constructor() {
        this.initializeStorage();
    }

    // Initialize localStorage with default structure
    initializeStorage() {
        if (!localStorage.getItem('overtime_users')) {
            localStorage.setItem('overtime_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('overtime_entries')) {
            localStorage.setItem('overtime_entries', JSON.stringify([]));
        }
        if (!localStorage.getItem('overtime_shared')) {
            localStorage.setItem('overtime_shared', JSON.stringify([]));
        }
    }

    // User Management
    createUser(userData) {
        const users = JSON.parse(localStorage.getItem('overtime_users'));
        
        // Check if email already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: this.generateId(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // In real app, this would be hashed
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('overtime_users', JSON.stringify(users));
        return { id: newUser.id, name: newUser.name, email: newUser.email };
    }

    authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem('overtime_users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        return { id: user.id, name: user.name, email: user.email };
    }

    getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('overtime_users'));
        const user = users.find(u => u.id === userId);
        return user ? { id: user.id, name: user.name, email: user.email } : null;
    }

    // Entry Management
    createEntry(userId, entryData) {
        const entries = JSON.parse(localStorage.getItem('overtime_entries'));
        
        const newEntry = {
            id: this.generateId(),
            userId: userId,
            projectLink: entryData.projectLink,
            hoursWorked: parseFloat(entryData.hoursWorked),
            supervisor: entryData.supervisor,
            date: entryData.date,
            notes: entryData.notes || '',
            createdAt: new Date().toISOString()
        };

        entries.push(newEntry);
        localStorage.setItem('overtime_entries', JSON.stringify(entries));
        return newEntry;
    }

    getUserEntries(userId, month = null) {
        const entries = JSON.parse(localStorage.getItem('overtime_entries'));
        let userEntries = entries.filter(entry => entry.userId === userId);
        
        if (month) {
            const [year, monthNum] = month.split('-');
            userEntries = userEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getFullYear() == year && (entryDate.getMonth() + 1) == monthNum;
            });
        }

        return userEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    updateEntry(entryId, userId, updateData) {
        const entries = JSON.parse(localStorage.getItem('overtime_entries'));
        const index = entries.findIndex(entry => entry.id === entryId && entry.userId === userId);
        
        if (index === -1) {
            throw new Error('Entry not found');
        }

        entries[index] = {
            ...entries[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('overtime_entries', JSON.stringify(entries));
        return entries[index];
    }

    deleteEntry(entryId, userId) {
        const entries = JSON.parse(localStorage.getItem('overtime_entries'));
        const filteredEntries = entries.filter(entry => !(entry.id === entryId && entry.userId === userId));
        
        if (entries.length === filteredEntries.length) {
            throw new Error('Entry not found');
        }

        localStorage.setItem('overtime_entries', JSON.stringify(filteredEntries));
        return true;
    }

    // Monthly Statistics
    getMonthlyStats(userId, month) {
        const entries = this.getUserEntries(userId, month);
        
        const totalHours = entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
        const uniqueDays = new Set(entries.map(entry => entry.date)).size;
        const avgPerDay = uniqueDays > 0 ? (totalHours / uniqueDays).toFixed(1) : 0;
        
        // Group by date for chart data
        const dailyHours = {};
        entries.forEach(entry => {
            if (!dailyHours[entry.date]) {
                dailyHours[entry.date] = 0;
            }
            dailyHours[entry.date] += entry.hoursWorked;
        });

        const chartData = Object.entries(dailyHours)
            .map(([date, hours]) => ({ date, hours }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            totalHours: totalHours.toFixed(1),
            entriesCount: entries.length,
            uniqueDays,
            avgPerDay,
            chartData
        };
    }

    // Sharing Functionality
    createSharedReport(userId, month) {
        const user = this.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const shared = JSON.parse(localStorage.getItem('overtime_shared'));
        
        // Check if shared report already exists
        const existingReport = shared.find(share => share.userId === userId && share.month === month);
        if (existingReport) {
            return existingReport;
        }

        const stats = this.getMonthlyStats(userId, month);
        const entries = this.getUserEntries(userId, month);
        
        const shareData = {
            id: this.generateId(),
            userId: userId,
            month: month,
            userName: user.name,
            stats: stats,
            entries: entries.map(entry => ({
                projectLink: entry.projectLink,
                hoursWorked: entry.hoursWorked,
                supervisor: entry.supervisor,
                date: entry.date,
                notes: entry.notes
            })),
            createdAt: new Date().toISOString()
        };

        shared.push(shareData);
        localStorage.setItem('overtime_shared', JSON.stringify(shared));
        return shareData;
    }

    getSharedReport(shareId) {
        const shared = JSON.parse(localStorage.getItem('overtime_shared'));
        return shared.find(share => share.id === shareId);
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Data export/import for backup
    exportUserData(userId) {
        const user = this.getUserById(userId);
        const entries = this.getUserEntries(userId);
        
        return {
            user,
            entries,
            exportedAt: new Date().toISOString()
        };
    }

    importUserData(userId, data) {
        if (data.user && data.user.id === userId) {
            const entries = JSON.parse(localStorage.getItem('overtime_entries'));
            const existingEntries = entries.filter(entry => entry.userId !== userId);
            
            const importedEntries = data.entries.map(entry => ({
                ...entry,
                id: this.generateId(),
                userId: userId,
                importedAt: new Date().toISOString()
            }));

            localStorage.setItem('overtime_entries', JSON.stringify([...existingEntries, ...importedEntries]));
            return importedEntries.length;
        }
        throw new Error('Invalid data format');
    }

    // Clear all data (for development/testing)
    clearAllData() {
        localStorage.setItem('overtime_users', JSON.stringify([]));
        localStorage.setItem('overtime_entries', JSON.stringify([]));
        localStorage.setItem('overtime_shared', JSON.stringify([]));
    }

    // Get statistics for all users (admin functionality)
    getAllUsersStats() {
        const users = JSON.parse(localStorage.getItem('overtime_users'));
        const entries = JSON.parse(localStorage.getItem('overtime_entries'));
        
        return users.map(user => {
            const userEntries = entries.filter(entry => entry.userId === user.id);
            const totalHours = userEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
            
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                totalEntries: userEntries.length,
                totalHours: totalHours.toFixed(1),
                lastEntry: userEntries.length > 0 ? 
                    userEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt : null
            };
        });
    }
}

// Export for use in other files
window.Database = Database;