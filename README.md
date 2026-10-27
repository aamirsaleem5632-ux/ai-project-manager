# AI-Powered Project Management System

## Project Overview
The AI-Powered Project Management System is a simple web application for managing development tasks. It allows users to create, view, edit, delete, search, and filter tasks through a clean dashboard.

This project is being developed to demonstrate task management, code quality, testing, and AI-assisted development workflows.

## Features
- Create tasks with a title and description.
- Set task priority: Low, Medium, or High.
- Track task status: To Do, In Progress, or Done.
- Edit and delete tasks.
- Search tasks by title or description.
- Filter tasks by status.
- View dashboard counts for task statuses.
- Store tasks in the browser using localStorage.
- Validate task information and handle storage errors.
- Responsive layout for different screen sizes.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Browser localStorage
- Node.js for running helper tests

## Project Structure
- `index.html` — Application structure.
- `style.css` — Layout and styling.
- `script.js` — Task management functionality.
- `task-store.js` — Shared task CRUD and localStorage persistence logic, used by the app and Node tests.
- `tests.js` — Helper tests and task-store CRUD/persistence tests.
- `README.md` — Project documentation.

## Setup and Usage
1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a web browser, or use the VS Code Live Server extension.
4. Click **Add New Task** to create a task.
5. Enter the task details and save it.
6. Use the search field and status filter to find tasks.
7. Edit or delete tasks using the available task controls.

Tasks are stored in the current browser's localStorage. Clearing browser data may remove saved tasks.

## Testing
Node.js is required to run the helper tests.

Open a terminal in the project folder and run:

```bash
node tests.js
```

The test suite contains 23 tests covering:
- Task title validation
- Task status and priority validation
- Date validation
- Task counting
- Case-insensitive searching
- Description searching
- Status filtering
- Empty search results
- Creating, editing, deleting, and clearing tasks through the same task store used by the app
- Restoring persisted tasks after creating a new store instance
- Preserving in-memory data when a localStorage write fails
- Preventing writes when saved tasks fail to load or contain invalid data

**Current local test result:** 23 tests passed.

The task-store tests exercise the production CRUD and persistence module with an in-memory localStorage substitute. They do not simulate browser DOM events or replace full browser end-to-end testing.
Manual browser testing completed successfully: task creation, editing, deletion, search, status filtering, and persistence after page refresh all worked. Automated browser end-to-end tests were not run.

## Integrations and Limitations
During development, the connected Atlassian Rovo MCP tools were used to read Jira issues, and the GitHub MCP tools were used to inspect repository commit details. The task-store data-loss fix is recorded in commit `f66ef9c`. These were read-only development-time tool interactions; the web application itself does not connect to Jira, GitHub, or MCP services.

The MCP tools were configured in the development environment; their configuration is separate from this web application's source files.

The current application stores tasks in one browser and does not use a shared database or user authentication.

## Future Improvements
- Add browser end-to-end tests for the application's user interface.
- Add a shared database so tasks can be accessed across browsers or devices.
- Add user authentication and account-specific task storage.
- Optionally add runtime Jira and GitHub integrations to the web application.

## Development Notes
The application and helper tests should be reviewed and tested before submission. Generated code should be checked for correctness, security, and maintainability.
