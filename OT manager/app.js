// ==============================================
// Main Application Logic for Overtime Tracker
// ==============================================

class OvertimeApp {
    constructor() {
        this.db = new Database();
        this.auth = new AuthManager(this.db);
        this.currentMonth = this.getCurrentMonth();
        this.currentView = 'list'; // 'list' or 'table'
        this.monthlyChart = null;
        
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.bindEventListeners();
        this.populateMonthSelector();
        this.auth.checkAuthStatus();
        
        // Set up periodic data refresh
        setInterval(() => {
            if (this.auth.isAuthenticated()) {
                this.refreshDashboardData();
            }
        }, 30000); // Refresh every 30 seconds
    }

    // Bind all event listeners
    bindEventListeners() {
        // Authentication forms
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.auth.switchAuthTab(e.target.dataset.tab);
            });
        });

        // Dashboard functionality
        document.getElementById('log-entry-form').addEventListener('submit', (e) => this.handleLogEntry(e));
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        document.getElementById('month-selector').addEventListener('change', (e) => this.handleMonthChange(e));
        document.getElementById('share-monthly-btn').addEventListener('click', () => this.handleShareMonthly());

        // View switching
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewSwitch(e));
        });

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('entry-date').value = today;
    }

    // Handle user login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');
        
        try {
            const result = await this.auth.login(email, password);
            
            if (result.success) {
                // Clear any previous errors
                errorElement.style.display = 'none';
                // Dashboard will be shown automatically by auth manager
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }

    // Handle user registration
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorElement = document.getElementById('register-error');
        
        try {
            const result = await this.auth.register({ name, email, password });
            
            if (result.success) {
                // Clear any previous errors
                errorElement.style.display = 'none';
                // Dashboard will be shown automatically by auth manager
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }

    // Handle logout
    handleLogout() {
        this.auth.logout();
    }

    // Handle new entry logging
    handleLogEntry(e) {
        e.preventDefault();
        
        const formData = {
            projectLink: document.getElementById('project-link').value,
            hoursWorked: document.getElementById('hours-worked').value,
            supervisor: document.getElementById('supervisor').value,
            date: document.getElementById('entry-date').value,
            notes: document.getElementById('entry-notes').value
        };

        const messageElement = document.getElementById('log-entry-message');
        
        try {
            // Validate inputs
            this.validateEntryData(formData);
            
            // Create entry
            this.db.createEntry(this.auth.getCurrentUser().id, formData);
            
            // Show success message
            messageElement.textContent = 'Entry logged successfully!';
            messageElement.style.display = 'block';
            messageElement.style.color = 'var(--success)';
            
            // Clear form
            document.getElementById('log-entry-form').reset();
            document.getElementById('entry-date').value = new Date().toISOString().split('T')[0];
            
            // Refresh dashboard data
            this.loadDashboardData();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            messageElement.textContent = error.message;
            messageElement.style.display = 'block';
            messageElement.style.color = 'var(--error)';
        }
    }

    // Validate entry data
    validateEntryData(data) {
        if (!data.projectLink || !this.isValidUrl(data.projectLink)) {
            throw new Error('Please enter a valid project URL');
        }
        
        if (!data.hoursWorked || parseFloat(data.hoursWorked) <= 0) {
            throw new Error('Hours worked must be greater than 0');
        }
        
        if (!data.supervisor || data.supervisor.trim().length < 2) {
            throw new Error('Supervisor name must be at least 2 characters');
        }
        
        if (!data.date) {
            throw new Error('Please select a date');
        }
        
        // Check if date is not in the future
        const entryDate = new Date(data.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        if (entryDate > today) {
            throw new Error('Entry date cannot be in the future');
        }
    }

    // Validate URL
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Handle month selection change
    handleMonthChange(e) {
        this.currentMonth = e.target.value;
        this.loadMonthlyStats();
        this.loadEntries();
    }

    // Handle view switching (list/table)
    handleViewSwitch(e) {
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentView = e.target.dataset.view;
        this.loadEntries();
    }

    // Handle monthly sharing
    handleShareMonthly() {
        try {
            const shareData = this.db.createSharedReport(
                this.auth.getCurrentUser().id, 
                this.currentMonth
            );
            
            const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareData.id}`;
            
            // Copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Share link copied to clipboard!');
            }).catch(() => {
                // Fallback: show prompt
                prompt('Copy this link to share your monthly report:', shareUrl);
            });
            
        } catch (error) {
            alert('Error creating share link: ' + error.message);
        }
    }

    // Load dashboard data
    loadDashboardData() {
        this.loadMonthlyStats();
        this.loadEntries();
    }

    // Refresh dashboard data
    refreshDashboardData() {
        if (this.auth.isAuthenticated() && document.getElementById('dashboard-section').style.display !== 'none') {
            this.loadDashboardData();
        }
    }

    // Load monthly statistics
    loadMonthlyStats() {
        const stats = this.db.getMonthlyStats(this.auth.getCurrentUser().id, this.currentMonth);
        
        document.getElementById('monthly-total-hours').textContent = stats.totalHours;
        document.getElementById('monthly-entries').textContent = stats.entriesCount;
        document.getElementById('monthly-avg').textContent = stats.avgPerDay;
        
        // Create or update chart
        this.createMonthlyChart(stats.chartData);
    }

    // Create monthly chart
    createMonthlyChart(chartData) {
        const ctx = document.getElementById('monthly-chart').getContext('2d');
        
        // Destroy existing chart
        if (this.monthlyChart) {
            this.monthlyChart.destroy();
        }
        
        this.monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(d => new Date(d.date).getDate()),
                datasets: [{
                    label: 'Hours Worked',
                    data: chartData.map(d => d.hours),
                    backgroundColor: 'rgba(0, 87, 255, 0.8)',
                    borderColor: 'rgba(0, 87, 255, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'h';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Day of Month'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const date = new Date(chartData[context.dataIndex].date);
                                return `${context.parsed.y} hours on ${date.toLocaleDateString()}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Load user entries
    loadEntries() {
        const entries = this.db.getUserEntries(this.auth.getCurrentUser().id, this.currentMonth);
        
        if (this.currentView === 'table') {
            this.renderEntriesTable(entries);
        } else {
            this.renderEntriesList(entries);
        }
    }

    // Render entries as list view
    renderEntriesList(entries) {
        const container = document.getElementById('entries-container');
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="text-secondary">No entries for this month yet.</p>';
            return;
        }
        
        let html = '<div class="entries-list">';
        entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            html += `
                <div class="entry-card">
                    <div class="entry-header">
                        <a href="${entry.projectLink}" target="_blank" class="entry-title">View Project</a>
                        <span class="entry-hours">${entry.hoursWorked}h</span>
                    </div>
                    <div class="entry-meta">
                        <span>📅 ${date}</span>
                        <span>👤 ${entry.supervisor}</span>
                    </div>
                    ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
                    <div class="entry-actions" style="margin-top: 12px;">
                        <button onclick="app.editEntry('${entry.id}')" class="btn btn-secondary" style="margin-right: 8px; padding: 8px 16px; font-size: 14px;">Edit</button>
                        <button onclick="app.deleteEntry('${entry.id}')" class="btn btn-secondary" style="padding: 8px 16px; font-size: 14px; color: var(--error);">Delete</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    // Render entries as table view
    renderEntriesTable(entries) {
        const container = document.getElementById('entries-container');
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="text-secondary">No entries for this month yet.</p>';
            return;
        }
        
        let html = `
            <table class="entries-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Project</th>
                        <th>Hours</th>
                        <th>Supervisor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            html += `
                <tr>
                    <td>${date}</td>
                    <td><a href="${entry.projectLink}" target="_blank">View Project</a></td>
                    <td>${entry.hoursWorked}h</td>
                    <td>${entry.supervisor}</td>
                    <td>
                        <button onclick="app.editEntry('${entry.id}')" class="btn btn-secondary" style="margin-right: 8px; padding: 4px 8px; font-size: 12px;">Edit</button>
                        <button onclick="app.deleteEntry('${entry.id}')" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px; color: var(--error);">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    }

    // Edit entry (placeholder - would need modal in real app)
    editEntry(entryId) {
        const entries = this.db.getUserEntries(this.auth.getCurrentUser().id);
        const entry = entries.find(e => e.id === entryId);
        
        if (entry) {
            // For demo purposes, just show an alert
            alert(`Edit functionality would open a modal here.\nEntry ID: ${entryId}\nProject: ${entry.projectLink}\nHours: ${entry.hoursWorked}`);
        }
    }

    // Delete entry
    deleteEntry(entryId) {
        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                this.db.deleteEntry(entryId, this.auth.getCurrentUser().id);
                this.loadDashboardData();
            } catch (error) {
                alert('Error deleting entry: ' + error.message);
            }
        }
    }

    // Get current month in YYYY-MM format
    getCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    // Populate month selector
    populateMonthSelector() {
        const selector = document.getElementById('month-selector');
        selector.innerHTML = '';
        
        // Generate last 12 months
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            
            if (i === 0) {
                option.selected = true;
            }
            
            selector.appendChild(option);
        }
    }

    // Export user data
    exportData() {
        try {
            const data = this.db.exportUserData(this.auth.getCurrentUser().id);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `overtime-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            alert('Error exporting data: ' + error.message);
        }
    }

    // Get application statistics
    getAppStats() {
        return this.db.getAllUsersStats();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OvertimeApp();
});

// Handle page visibility changes for better UX
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.app) {
        window.app.refreshDashboardData();
    }
});