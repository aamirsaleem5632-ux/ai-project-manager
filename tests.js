
"use strict";

const assert = require("node:assert/strict");
const { createTaskStore } = require("./task-store");

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    }
  };
}

function isValidTitle(title) {
  return typeof title === "string" &&
    title.trim().length > 0 &&
    title.trim().length <= 100;
}

function isValidStatus(status) {
  return ["todo", "progress", "done"].includes(status);
}

function isValidPriority(priority) {
  return ["low", "medium", "high"].includes(priority);
}

function isValidDate(date) {
  if (!date) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);

  return parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day;
}

function countByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status).length;
}

function filterTasks(tasks, query, status) {
  const normalizedQuery = query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesText =
      task.title.toLowerCase().includes(normalizedQuery) ||
      (task.description || "").toLowerCase().includes(normalizedQuery);

    const matchesStatus = status === "all" || task.status === status;

    return matchesText && matchesStatus;
  });
}

const sampleTasks = [
  {
    id: "1",
    title: "Build dashboard",
    description: "Create the home page",
    status: "todo",
    priority: "high"
  },
  {
    id: "2",
    title: "Test application",
    description: "Check task creation",
    status: "progress",
    priority: "medium"
  },
  {
    id: "3",
    title: "Write README",
    description: "Document setup",
    status: "done",
    priority: "low"
  }
];

let passed = 0;

function test(name, callback) {
  try {
    callback();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (error) {
    console.error(`FAIL: ${name}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

test("Accepts a valid task title", () => {
  assert.equal(isValidTitle("Build dashboard"), true);
});

test("Rejects an empty task title", () => {
  assert.equal(isValidTitle("   "), false);
});

test("Rejects a title longer than 100 characters", () => {
  assert.equal(isValidTitle("a".repeat(101)), false);
});

test("Accepts valid task statuses", () => {
  assert.equal(isValidStatus("todo"), true);
  assert.equal(isValidStatus("progress"), true);
  assert.equal(isValidStatus("done"), true);
});

test("Rejects an unknown task status", () => {
  assert.equal(isValidStatus("waiting"), false);
});

test("Accepts valid priorities", () => {
  assert.equal(isValidPriority("low"), true);
  assert.equal(isValidPriority("medium"), true);
  assert.equal(isValidPriority("high"), true);
});

test("Rejects an unknown priority", () => {
  assert.equal(isValidPriority("urgent"), false);
});

test("Accepts a real calendar date", () => {
  assert.equal(isValidDate("2026-11-01"), true);
});

test("Rejects an impossible calendar date", () => {
  assert.equal(isValidDate("2026-02-30"), false);
});

test("Allows an optional empty due date", () => {
  assert.equal(isValidDate(""), true);
});

test("Counts tasks by status correctly", () => {
  assert.equal(countByStatus(sampleTasks, "todo"), 1);
  assert.equal(countByStatus(sampleTasks, "progress"), 1);
  assert.equal(countByStatus(sampleTasks, "done"), 1);
});

test("Searches task titles without case sensitivity", () => {
  const results = filterTasks(sampleTasks, "BUILD", "all");
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "1");
});

test("Searches task descriptions", () => {
  const results = filterTasks(sampleTasks, "document", "all");
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "3");
});

test("Filters tasks by status", () => {
  const results = filterTasks(sampleTasks, "", "done");
  assert.equal(results.length, 1);
  assert.equal(results[0].title, "Write README");
});

test("Returns no results for an unmatched search", () => {
  assert.equal(filterTasks(sampleTasks, "not found", "all").length, 0);
});

test("Creates tasks and restores them from persisted storage", () => {
  const storage = createMemoryStorage();
  const store = createTaskStore(storage, "tasks", assert.fail);
  const taskData = {
    title: "Test persistence",
    description: "Reload the task store",
    priority: "high",
    dueDate: "2026-11-01",
    status: "todo"
  };

  assert.equal(store.create(taskData), true);
  const [created] = store.getTasks();
  assert.equal(created.title, taskData.title);
  assert.equal(typeof created.id, "string");

  const reloadedStore = createTaskStore(storage, "tasks", assert.fail);
  assert.deepEqual(reloadedStore.getTasks(), [created]);
});

test("Updates an existing task and persists its changes", () => {
  const storage = createMemoryStorage();
  const store = createTaskStore(storage, "tasks", assert.fail);
  store.create({ title: "Before edit", status: "todo", priority: "medium" });
  const [created] = store.getTasks();

  assert.equal(store.update(created.id, {
    title: "After edit",
    status: "progress"
  }), true);
  assert.equal(store.getTasks()[0].title, "After edit");

  const reloadedStore = createTaskStore(storage, "tasks", assert.fail);
  assert.equal(reloadedStore.getTasks()[0].status, "progress");
});

test("Deletes an existing task and persists the deletion", () => {
  const storage = createMemoryStorage();
  const store = createTaskStore(storage, "tasks", assert.fail);
  store.create({ title: "Remove me", status: "todo", priority: "low" });
  const [created] = store.getTasks();

  assert.equal(store.delete(created.id), true);
  assert.deepEqual(store.getTasks(), []);

  const reloadedStore = createTaskStore(storage, "tasks", assert.fail);
  assert.deepEqual(reloadedStore.getTasks(), []);
});

test("Clears tasks and persists the empty list", () => {
  const storage = createMemoryStorage();
  const store = createTaskStore(storage, "tasks", assert.fail);
  store.create({ title: "Clear me", status: "done", priority: "low" });

  assert.equal(store.clear(), true);
  assert.deepEqual(store.getTasks(), []);
  assert.deepEqual(
    JSON.parse(storage.getItem("tasks")),
    []
  );
});

test("Keeps in-memory tasks unchanged when saving fails", () => {
  const storage = createMemoryStorage();
  const errors = [];
  const store = createTaskStore(storage, "tasks", (error, operation) => {
    errors.push({ error, operation });
  });
  store.create({ title: "Saved task", status: "todo", priority: "medium" });
  const originalTasks = store.getTasks();
  storage.setItem = () => {
    throw new Error("Storage is full");
  };

  assert.equal(store.delete(originalTasks[0].id), false);
  assert.deepEqual(store.getTasks(), originalTasks);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].operation, "save");
});

test("Does not overwrite storage after a failed initial read", () => {
  let writeAttempts = 0;
  const errors = [];
  const storage = {
    getItem() {
      throw new Error("Storage is unavailable");
    },
    setItem() {
      writeAttempts++;
    }
  };
  const store = createTaskStore(storage, "tasks", (error, operation) => {
    errors.push({ error, operation });
  });

  assert.deepEqual(store.getTasks(), []);
  assert.equal(store.create({
    title: "Do not overwrite existing data",
    status: "todo",
    priority: "medium"
  }), false);
  assert.equal(writeAttempts, 0);
  assert.deepEqual(errors.map(({ operation }) => operation), ["load", "save"]);
});

console.log(`\n${passed} tests passed.`);
