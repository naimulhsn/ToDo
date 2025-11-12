# Vue 2 Todo Frontend with Logging

A simple, clean Vue 2 frontend for the Todo API with comprehensive console logging capabilities.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time statistics (Total, Pending, Completed tasks)
- ✅ Inline editing with cancel option
- ✅ Toggle completion status
- ✅ Comprehensive logging (INFO, WARN, ERROR levels)
- ✅ Minimal, clean design with gradient background
- ✅ Responsive layout for mobile devices
- ✅ No build process required (Vue CDN)
- ✅ Color-coded console logs

## Project Structure

```
logging-api-frontend/
├── index.html          # Main HTML file with Vue app
├── css/
│   └── styles.css      # Minimal, clean styling
└── js/
    ├── logger.js       # Frontend logging utility
    └── app.js          # Vue app instance and logic
```

## Getting Started

### Prerequisites

1. Backend API must be running on `http://localhost:3000`
2. Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

No installation needed! Just open the HTML file.

### Running the Application

1. **Start the backend server:**
   ```bash
   cd ../logging-api
   npm start
   ```

2. **Open the frontend:**
   - Simply open `index.html` in your web browser
   - Or use: `start index.html` (Windows) or `open index.html` (Mac)

3. **Check the console:**
   - Press `F12` to open browser developer tools
   - Go to the Console tab to see detailed logs

## Logging Features

The application includes a custom logging utility with the following capabilities:

### Log Levels

- **INFO** (Blue) - General information, user actions, successful operations
- **WARN** (Orange) - Warnings, validation issues
- **ERROR** (Red) - Errors, failed API calls

### What Gets Logged

1. **Application Lifecycle**
   - App initialization
   - Vue mounting

2. **User Actions**
   - Add todo
   - Edit todo
   - Delete todo (including cancellations)
   - Toggle completion status

3. **API Calls**
   - Request details (method, URL, payload)
   - Response details (status, data)
   - Error responses

4. **Data Operations**
   - Number of todos loaded
   - Todo updates
   - Validation failures

### Logger API

The logger is available globally as `window.Logger`:

```javascript
// Basic logging
Logger.info('Message', { data: 'optional' });
Logger.warn('Warning message', { details: 'optional' });
Logger.error('Error message', { error: errorObject });

// Specific use cases
Logger.logUserAction('Action Name', { details });
Logger.logApiRequest('GET', '/api/todos');
Logger.logApiResponse('GET', '/api/todos', 200, responseData);
```

## Features & Usage

### Add a Todo

1. Fill in the "Title" field (required)
2. Optionally add a description
3. Click "Add Task"
4. Check console for logs

### View Todos

- All todos are displayed in a list
- See status badges (Pending/Completed)
- View timestamps for creation and updates

### Edit a Todo

1. Click the "Edit" button on any todo
2. Modify the title and/or description
3. Click "Save Changes" or "Cancel"
4. Check console for edit logs

### Mark as Complete/Incomplete

1. Click the "Mark Complete" button (or "Mark Incomplete" for completed tasks)
2. Todo status updates instantly
3. Check console for toggle logs

### Delete a Todo

1. Click the "Delete" button
2. Confirm the deletion in the prompt
3. Todo is removed from the list
4. Check console for deletion logs

## API Integration

The frontend connects to the backend API at:

```
http://localhost:3000/api/todos
```

### Endpoints Used

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Styling

The application uses a minimal, modern design with:

- **Gradient Background**: Purple to pink gradient
- **Card-based Layout**: Clean white cards for content
- **Responsive Design**: Mobile-friendly layout
- **Color Coding**: Different colors for different actions
- **Smooth Transitions**: Hover effects and animations

## Browser Console Example

When you open the console, you'll see logs like:

```
[2025-10-07 14:30:00] [INFO] Application initializing...
[2025-10-07 14:30:00] [INFO] Vue app mounted
[2025-10-07 14:30:00] [INFO] API Request: GET http://localhost:3000/api/todos
[2025-10-07 14:30:01] [INFO] API Response: GET http://localhost:3000/api/todos - 200
[2025-10-07 14:30:01] [INFO] Loaded 5 todos
[2025-10-07 14:30:15] [INFO] User Action: Add Todo
[2025-10-07 14:30:15] [INFO] API Request: POST http://localhost:3000/api/todos
[2025-10-07 14:30:15] [INFO] API Response: POST http://localhost:3000/api/todos - 201
[2025-10-07 14:30:15] [INFO] Todo added successfully
```

## Troubleshooting

### Frontend can't connect to backend

**Issue**: CORS errors or network errors

**Solution**:
1. Make sure backend is running: `cd ../logging-api && npm start`
2. Check that CORS is enabled in backend `index.js`
3. Verify backend is on `http://localhost:3000`

### No logs appearing in console

**Issue**: Console is empty

**Solution**:
1. Open Developer Tools (F12)
2. Go to the Console tab
3. Check if there are any JavaScript errors
4. Refresh the page

### Styles not loading

**Issue**: Page looks unstyled

**Solution**:
1. Check that `css/styles.css` exists
2. Verify the path in `index.html` is correct
3. Try hard refresh (Ctrl + F5)

### Vue not loading

**Issue**: "Vue is not defined" error

**Solution**:
1. Check internet connection (Vue is loaded from CDN)
2. Try opening `https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js` directly
3. Wait a moment for CDN to load

## Future Enhancement Ideas

Use these prompts in Cursor to add more features:

1. **Filtering**: "Add filter buttons to show all/active/completed todos"
2. **Search**: "Add a search bar to filter todos by title or description"
3. **Log Viewer**: "Add a log viewer panel that displays frontend logs in the UI"
4. **Animations**: "Add smooth CSS transitions when adding/removing todos"
5. **Local Storage**: "Save todos to localStorage as backup"
6. **Toast Notifications**: "Add toast notifications for success/error messages"
7. **Loading Spinners**: "Add loading spinners during API calls"
8. **Pagination**: "Add pagination for todo list"
9. **Dark Mode**: "Add a dark mode toggle"
10. **Due Dates**: "Add due date field to todos with date picker"
11. **Priority Levels**: "Add priority levels (high/medium/low)"
12. **Categories**: "Add category tags to todos"
13. **Backend Logging**: "Send frontend logs to backend API"
14. **Vue Router**: "Add Vue Router for multi-page app"
15. **Drag & Drop**: "Add drag and drop to reorder todos"

## Technologies Used

- **Vue.js 2.6.14** - Progressive JavaScript framework
- **Axios 1.6.0** - HTTP client for API calls
- **Vanilla CSS** - No CSS framework, custom styling
- **Custom Logger** - Built-in logging utility

## License

ISC

## Support

For issues or questions:
1. Check the console for error messages
2. Verify backend is running
3. Check browser compatibility
4. Review the troubleshooting section

---

Made with ❤️ using Vue 2 and modern web standards

