# Cursor AI Prompts Guide for Todo App Enhancement

This guide provides ready-to-use prompts for enhancing your Vue 2 Todo application using Cursor AI.

## How to Use These Prompts

1. Open your project in Cursor
2. Open the Cursor chat (Ctrl+L or Cmd+L)
3. Copy and paste any prompt below
4. Let Cursor implement the feature for you
5. Review and test the changes

---

## Basic Features

### 1. Add Filtering

```
Add filter buttons to show all/active/completed todos. 
Add three buttons above the todo list: "All", "Active", and "Completed".
Update the Vue app to filter todos based on the selected filter.
Style the active filter button to show which filter is selected.
Log filter changes in the console.
```

### 2. Add Search Functionality

```
Add a search bar above the todo list to filter todos by title or description.
The search should be case-insensitive and work in real-time as the user types.
Show a count of filtered results.
Log search actions in the console.
Clear the search when clicking a clear button.
```

### 3. Add Sort Options

```
Add a dropdown to sort todos by:
- Date Created (newest/oldest)
- Title (A-Z, Z-A)
- Status (completed first/pending first)
Style the dropdown to match the existing design.
Log sort actions in the console.
```

---

## Enhanced Logging

### 4. Add Visual Log Viewer

```
Create a collapsible log viewer panel at the bottom of the page.
Display the last 50 frontend logs in a scrollable list.
Color-code logs by level (INFO=blue, WARN=orange, ERROR=red).
Add a "Clear Logs" button and a "Download Logs" button.
The panel should be toggleable with a floating button.
```

### 5. Send Logs to Backend

```
Create a new backend endpoint POST /api/logs to receive frontend logs.
Update the frontend logger to optionally send ERROR level logs to the backend.
Store logs in memory on the backend (similar to todos).
Add a backend route GET /api/logs to retrieve stored logs.
Log the log-sending action in the console (meta-logging!).
```

### 6. Add Log Filtering

```
In the log viewer panel, add filter buttons to show:
- All logs
- INFO only
- WARN only
- ERROR only
Add a search box to filter logs by message text.
```

---

## UI/UX Improvements

### 7. Add Loading Spinners

```
Replace the "Loading..." text with an animated CSS spinner.
Show a spinner on each button during its specific action.
Add a subtle loading bar at the top of the page during API calls.
Make sure spinners match the app's color scheme.
```

### 8. Add Toast Notifications

```
Create a toast notification system for success/error messages.
Show toasts for: todo added, updated, deleted, and errors.
Toasts should auto-dismiss after 3 seconds.
Stack multiple toasts vertically.
Add smooth slide-in and fade-out animations.
Use the existing color scheme (purple gradient for success, red for errors).
```

### 9. Add Animations

```
Add smooth CSS animations for:
- Adding todos (slide in from top)
- Removing todos (fade out and shrink)
- Completing todos (checkmark animation)
- Editing mode (smooth expand)
Use CSS transitions and keyframe animations.
Keep animations subtle and under 300ms.
```

### 10. Add Dark Mode

```
Implement a dark mode toggle in the top-right corner.
Use CSS variables for colors to easily switch themes.
Save the user's preference in localStorage.
Update the gradient background for dark mode.
Ensure all text is readable in both modes.
Add a smooth transition between modes.
Log the theme change in the console.
```

### 11. Add Confirmation Modals

```
Replace browser confirm() dialogs with custom modal dialogs.
Create a reusable modal component in Vue.
Style the modal with a backdrop and smooth animations.
Use for delete confirmations and other destructive actions.
Add keyboard support (Escape to close, Enter to confirm).
```

---

## Advanced Features

### 12. Add Due Dates

```
Add a due date field to the todo form and edit form.
Use an HTML5 date input with a calendar picker.
Display due dates in the todo list.
Highlight overdue todos in red.
Add a "Due Soon" badge for todos due in the next 24 hours.
Update the backend API to accept and store due dates.
Sort todos by due date when selected.
```

### 13. Add Priority Levels

```
Add a priority dropdown (High, Medium, Low) to the todo form.
Color-code todos by priority:
- High: red border
- Medium: orange border  
- Low: green border
Add priority badges to todos.
Allow sorting by priority.
Update the backend to store priority.
Log priority changes.
```

### 14. Add Categories/Tags

```
Add a multi-select dropdown for categories (Work, Personal, Shopping, etc).
Display category tags as colored badges on todos.
Allow filtering by category.
Store categories as an array in the todo object.
Update backend to handle categories.
Add a category manager to add/edit/delete categories.
Use localStorage for categories list.
```

### 15. Add Subtasks

```
Add the ability to create subtasks for each todo.
Show subtasks as a nested list with checkboxes.
Track subtask completion separately.
Show a progress bar for subtask completion.
Update the API to handle nested subtasks.
Log subtask actions in the console.
```

### 16. Add Drag & Drop

```
Implement drag and drop to reorder todos.
Use the HTML5 Drag and Drop API or a library like Vue.Draggable.
Show visual feedback while dragging (ghost element).
Save the order in localStorage or backend.
Add smooth animations during reordering.
Log reorder actions in the console.
```

### 17. Add Local Storage Backup

```
Automatically save todos to localStorage as backup.
Load from localStorage if the API is unavailable.
Show a warning banner when in offline mode.
Sync with API when it becomes available.
Add a "Sync Now" button to manually trigger sync.
Log all sync operations.
```

### 18. Add Export/Import

```
Add buttons to export todos as JSON or CSV.
Add an import button to upload and parse JSON files.
Validate imported data before adding to the list.
Show a preview modal before importing.
Log export/import actions.
Use browser download API for exports.
```

---

## Data Visualization

### 19. Add Completion Chart

```
Add a pie chart showing completed vs pending todos.
Use the Chart.js library via CDN.
Place the chart in a new card above the stats.
Make it responsive and match the app's colors.
Update the chart when todos change.
```

### 20. Add Activity Timeline

```
Create a timeline view showing recent todo activities.
Display: "Added X", "Completed Y", "Deleted Z" with timestamps.
Limit to last 10 activities.
Store activity history in localStorage.
Style as a vertical timeline with icons.
```

---

## Multi-Page Features

### 21. Add Vue Router

```
Install Vue Router 3.x (compatible with Vue 2).
Create separate views:
- Home (dashboard with stats)
- Todos (current todo list)
- Archive (completed todos)
- Settings
Add a navigation menu.
Update the build to use Vue Router from CDN.
Maintain logging across all pages.
```

### 22. Add Settings Page

```
Create a settings page with options for:
- Default view (all/active/completed)
- Items per page
- Theme (light/dark/auto)
- Logging level (all/errors only/off)
- Auto-save interval
Store settings in localStorage.
Apply settings throughout the app.
```

---

## Performance & Optimization

### 23. Add Pagination

```
Implement pagination for the todo list.
Show 10 todos per page by default.
Add next/previous buttons and page numbers.
Show "X-Y of Z todos" indicator.
Make items per page configurable.
Keep pagination state when filtering/sorting.
Log page changes.
```

### 24. Add Virtual Scrolling

```
Implement virtual scrolling for large todo lists (100+ items).
Only render visible todos plus a buffer.
Use a library like vue-virtual-scroller.
Maintain smooth scrolling performance.
Keep existing features working (edit, delete, etc).
```

---

## Accessibility

### 25. Add Keyboard Shortcuts

```
Implement keyboard shortcuts:
- N: New todo (focus on title input)
- S: Focus search
- /: Focus search (like GitHub)
- Escape: Cancel editing/close modals
- Ctrl+Enter: Save todo
Show a help modal (?) listing all shortcuts.
Log keyboard shortcut usage.
```

### 26. Improve Accessibility

```
Add ARIA labels to all interactive elements.
Ensure all actions are keyboard accessible.
Add focus styles to all focusable elements.
Use semantic HTML (main, nav, article, etc).
Add alt text to any images/icons.
Ensure color contrast meets WCAG AA standards.
Test with screen reader and fix issues.
```

---

## Testing & Quality

### 27. Add Error Boundaries

```
Implement Vue error handling to catch component errors.
Show a friendly error message instead of breaking the app.
Log all errors to the console with full details.
Add a "Reload App" button on error screens.
Preserve user data when possible.
```

### 28. Add Input Validation

```
Add real-time validation to forms:
- Title: required, max 100 characters
- Description: max 500 characters
Show character count and validation messages.
Disable submit button when invalid.
Show validation errors in red.
Log validation failures.
```

---

## Progressive Web App

### 29. Convert to PWA

```
Create a manifest.json for the app.
Add icons for different sizes.
Implement a service worker for offline support.
Add an "Install App" button.
Cache API responses for offline use.
Show online/offline status indicator.
Make the app installable on mobile devices.
```

### 30. Add Push Notifications

```
Implement browser push notifications for:
- Todo reminders (for todos with due dates)
- Daily summary
Request permission on first visit.
Add notification preferences in settings.
Use the Web Notifications API.
Log notification actions.
```

---

## Integration Features

### 31. Add User Authentication

```
Add a simple login/signup form.
Store user token in localStorage.
Add authentication to all API calls.
Show user info in the header.
Add a logout button.
Protect routes that require authentication.
Log authentication events.
```

### 32. Add Multi-User Support

```
Update backend to support multiple users.
Each user sees only their own todos.
Add user registration and login endpoints.
Store user ID with each todo.
Update frontend to handle user sessions.
Add user profile page.
```

---

## Fun Features

### 33. Add Emoji Picker

```
Add an emoji picker button to the title field.
Use a simple emoji picker library or create a custom one.
Common emojis: ✅ 📝 🎯 💡 🚀 ⭐ 🔥 💰 🏠 🎨
Insert emoji at cursor position.
Make the picker keyboard navigable.
```

### 34. Add Themes

```
Add multiple color themes (not just light/dark):
- Ocean (blues)
- Forest (greens)
- Sunset (oranges/reds)
- Lavender (purples - current)
- Minimal (grays)
Allow users to select in settings.
Use CSS variables for easy switching.
Store preference in localStorage.
```

### 35. Add Gamification

```
Add achievement badges for:
- First todo completed
- 10 todos completed
- Completed all todos
- 7-day streak
Show badges in a trophy case.
Add celebratory animations when earning badges.
Store achievements in localStorage.
Log achievement unlocks.
```

---

## Tips for Using These Prompts

1. **Start Simple**: Begin with basic features before advanced ones
2. **Test Each Feature**: Test thoroughly before moving to the next
3. **One at a Time**: Implement one feature per prompt
4. **Customize**: Feel free to modify prompts to fit your needs
5. **Combine Features**: Some features work great together (e.g., dark mode + themes)
6. **Keep Logging**: Maintain the logging system as you add features
7. **Stay Consistent**: Keep the same design language and code style

## Example Workflow

```
Session 1: Basic Improvements
- Add filtering
- Add search
- Add sort options

Session 2: UI Enhancement
- Add toast notifications
- Add animations
- Add dark mode

Session 3: Advanced Features  
- Add due dates
- Add priority levels
- Add categories

Session 4: Polish
- Add keyboard shortcuts
- Improve accessibility
- Add error handling
```

---

**Happy Coding! 🚀**

Remember: The best way to learn is by building. Start with simple features and gradually add complexity!

