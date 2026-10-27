"use strict";

(function (root, factory) {
  const taskStore = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = taskStore;
  } else {
    root.TaskStore = taskStore;
  }
})(typeof globalThis === "object" ? globalThis : this, function () {
  const VALID_STATUSES = ["todo", "progress", "done"];
  const VALID_PRIORITIES = ["low", "medium", "high"];

  function createTaskStore(storage, storageKey, onError) {
    let tasks = [];
    let loaded = true;

    try {
      const saved = storage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          tasks = parsed.filter((task) => {
            return task &&
              typeof task.id === "string" &&
              typeof task.title === "string" &&
              VALID_STATUSES.includes(task.status) &&
              VALID_PRIORITIES.includes(task.priority);
          });
        }
      }
    } catch (error) {
      loaded = false;
      onError(error, "load");
    }

    function save(nextTasks) {
      if (!loaded) {
        onError(new Error("Tasks could not be loaded; storage is protected."), "save");
        return false;
      }

      try {
        storage.setItem(storageKey, JSON.stringify(nextTasks));
        tasks = nextTasks;
        return true;
      } catch (error) {
        onError(error, "save");
        return false;
      }
    }

    return {
      getTasks() {
        return tasks.slice();
      },

      create(taskData) {
        const task = {
          id: createId(),
          ...taskData,
          createdAt: new Date().toISOString()
        };

        return save([task, ...tasks]);
      },

      update(id, taskData) {
        const index = tasks.findIndex((task) => task.id === id);

        if (index === -1) {
          return false;
        }

        const nextTasks = tasks.slice();
        nextTasks[index] = { ...nextTasks[index], ...taskData };
        return save(nextTasks);
      },

      delete(id) {
        const nextTasks = tasks.filter((task) => task.id !== id);

        if (nextTasks.length === tasks.length) {
          return false;
        }

        return save(nextTasks);
      },

      clear() {
        if (tasks.length === 0) {
          return false;
        }

        return save([]);
      }
    };
  }

  function createId() {
    if (typeof globalThis.crypto !== "undefined" &&
        typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  return { createTaskStore };
});
