# Reusable Skill: Code Review, Bug Fixing, and Testing

## Purpose
Use this skill when reviewing code, identifying bugs, making small fixes, testing application features, or updating project documentation.

## Instructions
1. Read the relevant source files before making changes.
2. Understand the existing behavior and identify the specific requirement.
3. Review the code for logic errors, invalid input, unsafe user-data rendering, and error-handling problems.
4. Reproduce or clearly describe the suspected bug before changing code.
5. Make the smallest reasonable fix. Do not add unrelated features or rewrite working code unnecessarily.
6. Run the available tests after making changes.
7. Test the affected feature manually in the browser when appropriate.
8. Check that existing functionality still works.
9. Update README.md if setup, behavior, or testing instructions change.
10. Review the final changes and explain what was changed and why.

## Testing Checklist
- Valid and invalid input is handled correctly.
- Task creation, editing, and deletion work.
- Search and status filtering return correct results.
- Data persists after refreshing the browser.
- Error messages are understandable.
- No secrets, passwords, or API tokens are committed.

## Reporting
After completing the work, report:
- The issue or requirement addressed.
- Files changed.
- Fixes implemented.
- Tests executed and their results.nod
- Any remaining limitations.

## Safety Rules
- Ask before destructive actions.
- Never expose or commit secrets.
- Do not claim a test or integration succeeded unless it was actually verified.
- Keep changes focused on the requested task.
