// ==============================================
// Sample Data for Overtime Tracker Demo
// ==============================================

// Sample users for testing
const sampleUsers = [
    {
        id: "demo_user_1",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "demo123",
        createdAt: "2025-01-01T10:00:00.000Z"
    },
    {
        id: "demo_user_2", 
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "demo123",
        createdAt: "2025-01-01T10:00:00.000Z"
    }
];

// Sample work entries
const sampleEntries = [
    // John's entries for November 2025
    {
        id: "entry_1",
        userId: "demo_user_1",
        projectLink: "https://github.com/company/website-redesign",
        hoursWorked: 8.5,
        supervisor: "Sarah Johnson",
        date: "2025-11-01",
        notes: "Fixed mobile responsive issues and updated CSS",
        createdAt: "2025-11-01T18:00:00.000Z"
    },
    {
        id: "entry_2",
        userId: "demo_user_1",
        projectLink: "https://jira.company.com/browse/API-123",
        hoursWorked: 6.0,
        supervisor: "Mike Chen",
        date: "2025-11-03",
        notes: "Implemented authentication middleware",
        createdAt: "2025-11-03T16:30:00.000Z"
    },
    {
        id: "entry_3",
        userId: "demo_user_1",
        projectLink: "https://github.com/company/mobile-app",
        hoursWorked: 9.25,
        supervisor: "Sarah Johnson",
        date: "2025-11-05",
        notes: "Database optimization and performance tuning",
        createdAt: "2025-11-05T19:15:00.000Z"
    },
    {
        id: "entry_4",
        userId: "demo_user_1",
        projectLink: "https://trello.com/b/abc123/project-tasks",
        hoursWorked: 7.5,
        supervisor: "David Wilson",
        date: "2025-11-07",
        notes: "Code review and documentation updates",
        createdAt: "2025-11-07T17:45:00.000Z"
    },
    {
        id: "entry_5",
        userId: "demo_user_1",
        projectLink: "https://github.com/company/website-redesign",
        hoursWorked: 10.0,
        supervisor: "Sarah Johnson",
        date: "2025-11-10",
        notes: "Weekend work - critical bug fixes for production",
        createdAt: "2025-11-10T20:00:00.000Z"
    },
    {
        id: "entry_6",
        userId: "demo_user_1",
        projectLink: "https://jira.company.com/browse/API-456",
        hoursWorked: 8.0,
        supervisor: "Mike Chen",
        date: "2025-11-12",
        notes: "Integration testing and debugging",
        createdAt: "2025-11-12T18:20:00.000Z"
    },
    {
        id: "entry_7",
        userId: "demo_user_1",
        projectLink: "https://github.com/company/mobile-app",
        hoursWorked: 6.75,
        supervisor: "Sarah Johnson",
        date: "2025-11-14",
        notes: "UI component refactoring",
        createdAt: "2025-11-14T16:50:00.000Z"
    },
    {
        id: "entry_8",
        userId: "demo_user_1",
        projectLink: "https://trello.com/b/abc123/project-tasks",
        hoursWorked: 9.5,
        supervisor: "David Wilson",
        date: "2025-11-17",
        notes: "User acceptance testing preparation",
        createdAt: "2025-11-17T19:30:00.000Z"
    },
    {
        id: "entry_9",
        userId: "demo_user_1",
        projectLink: "https://github.com/company/website-redesign",
        hoursWorked: 8.25,
        supervisor: "Sarah Johnson",
        date: "2025-11-19",
        notes: "Performance optimization and caching implementation",
        createdAt: "2025-11-19T18:15:00.000Z"
    },
    {
        id: "entry_10",
        userId: "demo_user_1",
        projectLink: "https://jira.company.com/browse/API-789",
        hoursWorked: 7.0,
        supervisor: "Mike Chen",
        date: "2025-11-21",
        notes: "API documentation and examples",
        createdAt: "2025-11-21T17:00:00.000Z"
    },
    {
        id: "entry_11",
        userId: "demo_user_1",
        projectLink: "https://github.com/company/mobile-app",
        hoursWorked: 10.5,
        supervisor: "Sarah Johnson",
        date: "2025-11-24",
        notes: "Weekend deployment support and monitoring",
        createdAt: "2025-11-24T21:00:00.000Z"
    },

    // Jane's entries for November 2025
    {
        id: "entry_12",
        userId: "demo_user_2",
        projectLink: "https://github.com/company/design-system",
        hoursWorked: 8.0,
        supervisor: "Tom Anderson",
        date: "2025-11-02",
        notes: "Component library updates and testing",
        createdAt: "2025-11-02T17:30:00.000Z"
    },
    {
        id: "entry_13",
        userId: "demo_user_2",
        projectLink: "https://figma.com/file/abc/design-specs",
        hoursWorked: 6.5,
        supervisor: "Lisa Park",
        date: "2025-11-04",
        notes: "UI mockup revisions based on feedback",
        createdAt: "2025-11-04T16:45:00.000Z"
    },
    {
        id: "entry_14",
        userId: "demo_user_2",
        projectLink: "https://github.com/company/design-system",
        hoursWorked: 9.0,
        supervisor: "Tom Anderson",
        date: "2025-11-06",
        notes: "Accessibility improvements and WCAG compliance",
        createdAt: "2025-11-06T19:00:00.000Z"
    },
    {
        id: "entry_15",
        userId: "demo_user_2",
        projectLink: "https://trello.com/b/xyz789/design-tasks",
        hoursWorked: 7.25,
        supervisor: "Lisa Park",
        date: "2025-11-08",
        notes: "Brand guideline documentation",
        createdAt: "2025-11-08T17:15:00.000Z"
    },
    {
        id: "entry_16",
        userId: "demo_user_2",
        projectLink: "https://figma.com/file/abc/design-specs",
        hoursWorked: 8.75,
        supervisor: "Tom Anderson",
        date: "2025-11-11",
        notes: "Weekend design review and finalization",
        createdAt: "2025-11-11T20:30:00.000Z"
    },
    {
        id: "entry_17",
        userId: "demo_user_2",
        projectLink: "https://github.com/company/design-system",
        hoursWorked: 6.0,
        supervisor: "Lisa Park",
        date: "2025-11-13",
        notes: "Code cleanup and documentation",
        createdAt: "2025-11-13T16:00:00.000Z"
    },
    {
        id: "entry_18",
        userId: "demo_user_2",
        projectLink: "https://trello.com/b/xyz789/design-tasks",
        hoursWorked: 8.5,
        supervisor: "Tom Anderson",
        date: "2025-11-15",
        notes: "Cross-browser testing and fixes",
        createdAt: "2025-11-15T18:45:00.000Z"
    },
    {
        id: "entry_19",
        userId: "demo_user_2",
        projectLink: "https://figma.com/file/abc/design-specs",
        hoursWorked: 7.75,
        supervisor: "Lisa Park",
        date: "2025-11-18",
        notes: "Design system handoff to development team",
        createdAt: "2025-11-18T17:30:00.000Z"
    },
    {
        id: "entry_20",
        userId: "demo_user_2",
        projectLink: "https://github.com/company/design-system",
        hoursWorked: 9.25,
        supervisor: "Tom Anderson",
        date: "2025-11-20",
        notes: "Performance optimization for design components",
        createdAt: "2025-11-20T19:45:00.000Z"
    },
    {
        id: "entry_21",
        userId: "demo_user_2",
        projectLink: "https://trello.com/b/xyz789/design-tasks",
        hoursWorked: 8.0,
        supervisor: "Lisa Park",
        date: "2025-11-22",
        notes: "User testing preparation and setup",
        createdAt: "2025-11-22T18:00:00.000Z"
    },
    {
        id: "entry_22",
        userId: "demo_user_2",
        projectLink: "https://figma.com/file/abc/design-specs",
        hoursWorked: 10.0,
        supervisor: "Tom Anderson",
        date: "2025-11-25",
        notes: "Weekend final testing and quality assurance",
        createdAt: "2025-11-25T20:00:00.000Z"
    }
];

// Function to load sample data
function loadSampleData() {
    try {
        // Load users
        const existingUsers = JSON.parse(localStorage.getItem('overtime_users') || '[]');
        if (existingUsers.length === 0) {
            localStorage.setItem('overtime_users', JSON.stringify(sampleUsers));
        }

        // Load entries
        const existingEntries = JSON.parse(localStorage.getItem('overtime_entries') || '[]');
        if (existingEntries.length === 0) {
            localStorage.setItem('overtime_entries', JSON.stringify(sampleEntries));
        }

        // Clear any existing shared data
        localStorage.setItem('overtime_shared', JSON.stringify([]));

        console.log('Sample data loaded successfully!');
        console.log('Demo accounts:');
        console.log('1. john.doe@example.com / demo123');
        console.log('2. jane.smith@example.com / demo123');
        
        alert('Sample data loaded!\n\nYou can now login with:\n• john.doe@example.com / demo123\n• jane.smith@example.com / demo123');
        
    } catch (error) {
        console.error('Error loading sample data:', error);
        alert('Error loading sample data: ' + error.message);
    }
}

// Function to clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem('overtime_users');
        localStorage.removeItem('overtime_entries');
        localStorage.removeItem('overtime_shared');
        localStorage.removeItem('overtime_current_user');
        
        console.log('All data cleared!');
        alert('All data cleared! The application will now show the login screen.');
        location.reload();
    }
}

// Make functions available globally
window.loadSampleData = loadSampleData;
window.clearAllData = clearAllData;

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sampleUsers, sampleEntries, loadSampleData, clearAllData };
}