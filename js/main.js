const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const loader = document.getElementById("loader");

const completeSound = new Audio("assets/sounds/task-done.mp3");
const deleteSound = new Audio("assets/sounds/delete-done.mp3");

const API_URL = "/task-manager/php/task.php";
let tasks = [];

window.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
  try {
    showLoader(true);
    const response = await fetch(`${API_URL}?action=get`);
    tasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
    showPopup("Failed to load tasks.");
  } finally {
    showLoader(false);
  }
}

addTaskBtn.addEventListener("click", async () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    showPopup("Please enter a task first!");
    return;
  }

  try {
    showLoader(true);
    const response = await fetch(`${API_URL}?action=add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: taskText }),
    });
    const newTask = await response.json();
    tasks.unshift(newTask);
    renderTasks();
    taskInput.value = "";
    showPopup("Task Added!");
  } catch (error) {
    console.error("Error adding task:", error);
    showPopup("Failed to add task.");
  } finally {
    showLoader(false);
  }
});

taskList.addEventListener("click", async (event) => {
  const target = event.target;
  const taskId = target.closest("li").dataset.id;

  if (target.classList.contains("delete-btn")) {
    try {
      showLoader(true);
      const response = await fetch(`${API_URL}?action=delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });
      const data = await response.json();
      if (data.success) {
        tasks = tasks.filter((t) => t.id != taskId);
        renderTasks();
        deleteSound.play();
        showPopup("Task Deleted!");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showPopup("Failed to delete task.");
    } finally {
      showLoader(false);
    }
  }

  if (target.classList.contains("complete-btn")) {
    const task = tasks.find((t) => t.id == taskId);
    const newState = !task.completed;

    try {
      showLoader(true);
      const response = await fetch(`${API_URL}?action=update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completed: newState }),
      });
      const data = await response.json();
      if (data.success) {
        task.completed = newState;
        renderTasks();
        completeSound.play();
        showPopup(
          newState ? "Task Marked Complete!" : "Task Marked Incomplete!"
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showPopup("Failed to update task.");
    } finally {
      showLoader(false);
    }
  }
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.classList.add("fade-in");

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed == 1 || task.completed === true)
      span.classList.add("completed");
    li.appendChild(span);

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔️";
    completeBtn.className = "complete-btn";
    li.appendChild(completeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-btn";
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

function showLoader(state) {
  if (state) loader.classList.remove("hidden");
  else loader.classList.add("hidden");
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 10);
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 1500);
}
