const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const completeSound = new Audio("assets/sounds/task-done.mp3");
const deleteSound = new Audio("assets/sounds/delete-done.mp3");

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    showPopup("Please enter a task first!");
    return;
  }

  const li = document.createElement("li");
  li.classList.add("fade-in");

  const span = document.createElement("span");
  span.textContent = taskText;
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

  taskInput.value = "";

  showPopup("Task Added!");
});

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    event.target.parentElement.classList.add("fade-out");
    setTimeout(() => event.target.parentElement.remove(), 300);
    deleteSound.play();
    showPopup("Task Deleted!");
  }

  if (event.target.classList.contains("complete-btn")) {
    const taskItem = event.target.parentElement;
    taskItem.classList.toggle("completed");
    completeSound.play();
    showPopup(
      taskItem.classList.contains("completed")
        ? "Task Marked Complete!"
        : "Task Marked Incomplete!"
    );
  }
});

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