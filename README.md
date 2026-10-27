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
- `tests.js` — Helper tests for validation, counting, searching, and filtering.
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

The current helper test suite contains 15 tests covering:
- Task title validation
- Task status and priority validation
- Date validation
- Task counting
- Case-insensitive searching
- Description searching
- Status filtering
- Empty search results

**Current test result:** 15 tests passed.

Note: These are standalone helper tests; they do not replace full end-to-end testing of the browser application.

## Integrations and Limitations
The current version is a local web application. Jira, GitHub automation, and MCP server integration are not yet configured. These integrations must be set up and verified before they can be demonstrated as working features.

The current application stores tasks in one browser and does not use a shared database or user authentication.

## Future Improvements
- Connect Jira tasks through an MCP server.
- Integrate GitHub for repository and commit workflows.
- Create a reusable custom `SKILL.md` for code review and bug fixing.
- Add automated browser tests and improve error reporting.

## Development Notes
The application and helper tests should be reviewed and tested before submission. Generated code should be checked for correctness, security, and maintainability.
