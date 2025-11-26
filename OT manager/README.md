# Overtime Tracker

A comprehensive web application for tracking overtime work hours with user authentication, project logging, and shareable monthly reports.

## Features

### 🔐 User Authentication
- Secure user registration and login
- Session management with persistent storage
- Password validation and email format checking

### 📝 Work Entry Logging
- Log overtime entries with:
  - Project link/URL
  - Hours worked (supports decimal hours)
  - Supervising account name
  - Date selection
  - Optional notes
- Real-time validation and error handling

### 📊 Dashboard & Analytics
- Monthly summary with key statistics:
  - Total hours worked
  - Number of entries
  - Average hours per day
- Visual charts showing daily work distribution
- Responsive design for mobile and desktop

### 📱 Multiple View Options
- List view for detailed card-based display
- Table view for compact tabular format
- Easy switching between views

### 🔗 Monthly Sharing
- Generate shareable links for monthly reports
- Public view of overtime data without login required
- Secure token-based sharing system

### 💾 Data Management
- Local storage for demonstration (easily replaceable with database)
- Data export functionality
- Entry editing and deletion capabilities

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide icon library
- **Fonts**: Inter typography system
- **Storage**: Browser localStorage (demo)

## Design System

The application uses a modern minimalism design approach with:

- **Color Scheme**: Professional blue-based palette with high contrast
- **Typography**: Inter font family with defined hierarchy
- **Components**: Consistent spacing (4px grid system)
- **Accessibility**: WCAG AA compliant color contrasts and focus states
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

## File Structure

```
/workspace/
├── index.html          # Main application HTML
├── styles.css          # Complete CSS styling
├── database.js         # Data management and storage
├── auth.js             # Authentication functionality
├── app.js              # Main application logic
└── README.md           # This documentation
```

## Usage Instructions

### Getting Started

1. **Open the Application**: Load `index.html` in your web browser
2. **Register**: Create a new account using the Sign Up tab
3. **Login**: Use your credentials to sign in
4. **Start Logging**: Add your first overtime entry

### Logging Work Entries

1. Navigate to the "Log New Entry" section
2. Fill in the required information:
   - **Project Link**: Enter a valid URL to the project
   - **Hours Worked**: Enter hours as decimal (e.g., 8.5 for 8.5 hours)
   - **Supervisor**: Name of the supervising account
   - **Date**: Select the work date (defaults to today)
   - **Notes**: Optional additional details
3. Click "Log Entry" to save

### Viewing Monthly Data

1. Use the month selector to choose which month to view
2. Statistics will update automatically showing:
   - Total hours for the selected month
   - Number of entries
   - Average hours per day
3. View the chart to see daily distribution of hours

### Sharing Monthly Reports

1. Select the desired month from the dropdown
2. Click "Share Month" button
3. A shareable link will be generated and copied to clipboard
4. Share this link with others to view your monthly report

### Data Management

- **View Options**: Switch between List and Table views using the buttons
- **Edit Entries**: Click "Edit" on any entry (demo functionality)
- **Delete Entries**: Click "Delete" to remove entries (with confirmation)
- **Export Data**: Download your complete work history as JSON

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Development Notes

### Local Storage Structure

The application uses browser localStorage with the following keys:
- `overtime_users`: User account data
- `overtime_entries`: Work entry records
- `overtime_shared`: Shared report links
- `overtime_current_user`: Current session data

### Data Schema

**User Object:**
```javascript
{
  id: "unique_identifier",
  name: "Full Name",
  email: "user@example.com",
  password: "hashed_password",
  createdAt: "ISO_timestamp"
}
```

**Entry Object:**
```javascript
{
  id: "unique_identifier",
  userId: "user_id",
  projectLink: "https://project-url.com",
  hoursWorked: 8.5,
  supervisor: "Supervisor Name",
  date: "YYYY-MM-DD",
  notes: "Optional notes",
  createdAt: "ISO_timestamp"
}
```

### Extending the Application

To integrate with a real backend:

1. Replace localStorage calls in `database.js` with API endpoints
2. Implement proper password hashing
3. Add server-side session management
4. Integrate with a proper database (PostgreSQL, MongoDB, etc.)
5. Add input sanitization and validation on the server side

### Security Considerations

For production deployment:
- Implement proper password hashing (bcrypt, Argon2)
- Add CSRF protection
- Implement rate limiting
- Use HTTPS for all communications
- Add input validation and sanitization
- Implement proper session management

## Demo Data

The application includes sample data structures for testing. You can clear all data using the `clearAllData()` method in the Database class during development.

## Future Enhancements

Potential features for future development:
- Timer functionality for real-time hour tracking
- Project categorization and tagging
- Team management and supervisor views
- Advanced reporting and analytics
- Calendar integration
- Mobile app version
- Integration with project management tools (Jira, Asana, etc.)

## License

This is a demonstration application. Feel free to use and modify for your needs.

## Support

For questions or issues, please refer to the code comments or create an issue in your project repository.