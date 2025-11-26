// ==============================================
// Authentication Module for Overtime Tracker
// ==============================================

class AuthManager {
    constructor(database) {
        this.db = database;
        this.currentUser = null;
        this.sessionKey = 'overtime_current_user';
        this.initializeAuth();
    }

    // Initialize authentication state
    initializeAuth() {
        const savedUser = localStorage.getItem(this.sessionKey);
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                // Verify user still exists in database
                const userInDb = this.db.getUserById(this.currentUser.id);
                if (!userInDb) {
                    this.logout();
                } else {
                    this.currentUser = userInDb;
                }
            } catch (error) {
                this.logout();
            }
        }
    }

    // Register new user
    async register(userData) {
        try {
            // Validate input
            this.validateRegistrationData(userData);
            
            // Create user in database
            const user = this.db.createUser(userData);
            
            // Auto-login after registration
            this.setCurrentUser(user);
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            // Validate input
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Authenticate user
            const user = this.db.authenticateUser(email, password);
            
            // Set current user
            this.setCurrentUser(user);
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        
        // Redirect to auth page
        this.showAuthPage();
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Set current user and save to session
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(this.sessionKey, JSON.stringify(user));
        this.showDashboard();
    }

    // Show authentication page
    showAuthPage() {
        document.getElementById('auth-section').style.display = 'flex';
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('shared-section').style.display = 'none';
        
        // Clear forms
        this.clearAuthForms();
    }

    // Show dashboard
    showDashboard() {
        if (!this.currentUser) return;
        
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'flex';
        document.getElementById('shared-section').style.display = 'none';
        
        // Update user name in dashboard
        document.getElementById('user-name').textContent = this.currentUser.name;
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('entry-date').value = today;
        
        // Load dashboard data
        if (window.app && window.app.loadDashboardData) {
            window.app.loadDashboardData();
        } else {
            // If app is not yet initialized, wait a bit and try again
            setTimeout(() => {
                if (window.app && window.app.loadDashboardData) {
                    window.app.loadDashboardData();
                }
            }, 100);
        }
    }

    // Show shared report page
    showSharedReport(shareData) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('shared-section').style.display = 'flex';
        
        // Populate shared report data
        this.populateSharedReport(shareData);
    }

    // Populate shared report data
    populateSharedReport(shareData) {
        document.getElementById('shared-user-name').textContent = shareData.userName;
        
        const [year, month] = shareData.month.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('shared-month-info').textContent = `${monthNames[parseInt(month) - 1]} ${year}`;
        
        document.getElementById('shared-total-hours').textContent = shareData.stats.totalHours;
        document.getElementById('shared-entries').textContent = shareData.stats.entriesCount;
        document.getElementById('shared-projects').textContent = new Set(shareData.entries.map(e => e.projectLink)).size;
        
        // Populate entries
        this.renderSharedEntries(shareData.entries);
        
        // Create chart
        this.createSharedChart(shareData.stats.chartData);
    }

    // Render shared entries
    renderSharedEntries(entries) {
        const container = document.getElementById('shared-entries-container');
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="text-secondary">No entries for this month.</p>';
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
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    // Create chart for shared report
    createSharedChart(chartData) {
        const ctx = document.getElementById('shared-chart').getContext('2d');
        
        new Chart(ctx, {
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
                                return `${context.parsed.y} hours`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Clear authentication forms
    clearAuthForms() {
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
        document.getElementById('login-error').style.display = 'none';
        document.getElementById('register-error').style.display = 'none';
    }

    // Validate registration data
    validateRegistrationData(data) {
        if (!data.name || data.name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (!data.password || data.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Please enter a valid email address');
        }
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle tab switching in auth forms
    switchAuthTab(tabName) {
        // Remove active class from all tabs and forms
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        // Add active class to selected tab and form
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-form`).classList.add('active');
        
        // Clear any error messages
        document.getElementById('login-error').style.display = 'none';
        document.getElementById('register-error').style.display = 'none';
    }

    // Check authentication status on page load
    checkAuthStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedId = urlParams.get('share');
        
        if (sharedId) {
            // Show shared report
            const shareData = this.db.getSharedReport(sharedId);
            if (shareData) {
                this.showSharedReport(shareData);
            } else {
                // Invalid share link, redirect to home
                window.location.href = '/';
            }
        } else if (this.isAuthenticated()) {
            this.showDashboard();
        } else {
            this.showAuthPage();
        }
    }
}

// Export for use in other files
window.AuthManager = AuthManager;