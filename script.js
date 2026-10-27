
"use strict";

const STORAGE_KEY = "aiProjectManagerTasks";

const taskForm = document.getElementById("task-form");
const taskFormSection = document.getElementById("task-form-section");
const formHeading = document.getElementById("form-heading");
const formError = document.getElementById("form-error");

const taskIdInput = document.getElementById("task-id");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const priorityInput = document.getElementById("task-priority");
const dueDateInput = document.getElementById("task-due-date");
const statusInput = document.getElementById("task-status");

const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");

const addTaskButton = document.getElementById("add-task-btn");
const cancelButton = document.getElementById("cancel-btn");
const clearDemoButton = document.getElementById("clear-demo-btn");

const totalCount = document.getElementById("total-count");
const todoCount = document.getElementById("todo-count");
const progressCount = document.getElementById("progress-count");
const doneCount = document.getElementById("done-count");

const browserStorage = {
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, value);
  }
};
const taskStore = TaskStore.createTaskStore(browserStorage, STORAGE_KEY, (error, operation) => {
  console.error(`Could not ${operation} saved tasks:`, error);

  if (operation === "load") {
    alert("Saved tasks could not be loaded. Existing data is protected; refresh the page to try again.");
  } else if (operation === "save") {
    alert("Tasks could not be saved. Check your browser storage.");
  }
});
let tasks = taskStore.getTasks();

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function getStatusLabel(status) {
  const labels = {
    todo: "To Do",
    progress: "In Progress",
    done: "Done"
  };

  return labels[status] || "To Do";
}

function getPriorityLabel(priority) {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High"
  };

  return labels[priority] || "Medium";
}

function formatDueDate(date) {
  if (!date) {
    return "No due date";
  }

  const parts = date.split("-");

  if (parts.length !== 3) {
    return "Invalid date";
  }

  const parsedDate = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function updateDashboard() {
  totalCount.textContent = tasks.length;
  todoCount.textContent = tasks.filter((task) => task.status === "todo").length;
  progressCount.textContent = tasks.filter(
    (task) => task.status === "progress"
  ).length;
  doneCount.textContent = tasks.filter((task) => task.status === "done").length;
}

function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      (task.description || "").toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  taskList.replaceChildren();

  filteredTasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";

    card.innerHTML = `
      <div class="task-card-top">
        <div>
          <h3>${escapeHTML(task.title)}</h3>
          <p class="task-description">${escapeHTML(task.description || "No description provided.")}</p>
        </div>
        <span class="badge status-${task.status}">${getStatusLabel(task.status)}</span>
      </div>

      <div class="task-card-bottom">
        <div class="task-meta">
          <span class="badge priority-${task.priority}">
            ${getPriorityLabel(task.priority)} priority
          </span>
          <span>Due: ${escapeHTML(formatDueDate(task.dueDate || ""))}</span>
        </div>

        <div class="task-actions">
          <button type="button" data-action="edit" data-id="${escapeHTML(task.id)}">Edit</button>
          <button type="button" data-action="delete" data-id="${escapeHTML(task.id)}">Delete</button>
        </div>
      </div>
    `;

    taskList.appendChild(card);
  });

  emptyMessage.hidden = filteredTasks.length > 0;

  if (filteredTasks.length === 0) {
    emptyMessage.textContent = tasks.length === 0
      ? "No tasks yet. Select Add New Task to get started."
      : "No matching tasks. Try changing your search or filter.";
  }

  updateDashboard();
}

function openForm(task = null) {
  taskForm.reset();
  formError.textContent = "";
  taskIdInput.value = "";

  if (task) {
    formHeading.textContent = "Edit Task";
    taskIdInput.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description || "";
    priorityInput.value = task.priority;
    dueDateInput.value = task.dueDate || "";
    statusInput.value = task.status;
  } else {
    formHeading.textContent = "Create a Task";
    priorityInput.value = "medium";
    statusInput.value = "todo";
  }

  taskFormSection.hidden = false;
  taskFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
  titleInput.focus();
}

function closeForm() {
  taskForm.reset();
  taskIdInput.value = "";
  formError.textContent = "";
  taskFormSection.hidden = true;
}

function isValidDate(date) {
  if (!date) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parts = date.split("-").map(Number);
  const parsed = new Date(parts[0], parts[1] - 1, parts[2]);

  return (
    parsed.getFullYear() === parts[0] &&
    parsed.getMonth() === parts[1] - 1 &&
    parsed.getDate() === parts[2]
  );
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;
  const status = statusInput.value;
  const existingId = taskIdInput.value;

  if (!title) {
    formError.textContent = "Please enter a task title.";
    titleInput.focus();
    return;
  }

  if (title.length > 100 || description.length > 1000) {
    formError.textContent = "Please keep the title and description within their limits.";
    return;
  }

  if (!["low", "medium", "high"].includes(priority)) {
    formError.textContent = "Please select a valid priority.";
    return;
  }

  if (!["todo", "progress", "done"].includes(status)) {
    formError.textContent = "Please select a valid status.";
    return;
  }

  if (!isValidDate(dueDate)) {
    formError.textContent = "Please enter a valid due date.";
    return;
  }

  const taskData = {
    title,
    description,
    priority,
    dueDate,
    status
  };

  let saved;
  if (existingId) {
    saved = taskStore.update(existingId, taskData);

    if (!saved && !tasks.some((task) => task.id === existingId)) {
      formError.textContent = "This task could not be found. Please refresh and try again.";
      return;
    }
  } else {
    saved = taskStore.create(taskData);
  }

  if (!saved) {
    return;
  }

  tasks = taskStore.getTasks();
  closeForm();
  renderTasks();
});

addTaskButton.addEventListener("click", () => {
  openForm();
});

cancelButton.addEventListener("click", closeForm);

searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const task = tasks.find((item) => item.id === button.dataset.id);

  if (!task) {
    alert("Task not found. Please refresh the page.");
    return;
  }

  if (button.dataset.action === "edit") {
    openForm(task);
    return;
  }

  if (button.dataset.action === "delete") {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    if (!taskStore.delete(task.id)) {
      return;
    }

    tasks = taskStore.getTasks();
    renderTasks();
  }
});

clearDemoButton.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("There are no tasks to clear.");
    return;
  }

  const confirmed = window.confirm(
    "This will delete all tasks saved in this project manager. Continue?"
  );

  if (!confirmed) {
    return;
  }

  if (!taskStore.clear()) {
    return;
  }

  tasks = taskStore.getTasks();
  renderTasks();
});

renderTasks();
