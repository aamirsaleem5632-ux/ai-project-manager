
"use strict";

const assert = require("node:assert/strict");

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

console.log(`\n${passed} tests passed.`);
