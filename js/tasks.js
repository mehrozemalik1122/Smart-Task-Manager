(() => {

  const allListEl = document.getElementById("taskList");

  const completedListEl = document.getElementById("completedList");

  const deletedListEl = document.getElementById("deletedList");



  function formatTaskText(task) {

    if (task.datetime) {

      const dt = new Date(task.datetime);

      const datePart = dt.toLocaleDateString();

      const timePart = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return `${task.text} — ${datePart} ${timePart}`;

    }

    return task.text;

  }



  function createActionButtons(li) {

    const completeBtn = document.createElement("button");

    completeBtn.textContent = "✔️";

    completeBtn.className = "complete-btn";

    li.appendChild(completeBtn);



    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "🗑️";

    deleteBtn.className = "delete-btn";

    li.appendChild(deleteBtn);

  }



  function renderAllTasks() {

    if (!allListEl) return;

    allListEl.innerHTML = "";

    (window.tasks || []).forEach((task) => {

      if (task.deleted == 1 || task.deleted === true) return;

      const li = document.createElement("li");

      li.dataset.id = task.id;

      li.classList.add("fade-in");

      const span = document.createElement("span");

      span.textContent = formatTaskText(task);

      if (task.completed == 1 || task.completed === true) span.classList.add("completed");

      li.appendChild(span);

      createActionButtons(li);

      allListEl.appendChild(li);

    });

  }



  function renderCompletedTasks() {

    if (!completedListEl) return;

    completedListEl.innerHTML = "";

    (window.completedTasks || []).forEach((task) => {

      const li = document.createElement("li");

      li.dataset.id = task.id;

      li.classList.add("fade-in");

      const span = document.createElement("span");

      span.textContent = formatTaskText(task);

      span.classList.add("completed");

      li.appendChild(span);

      createActionButtons(li);

      completedListEl.appendChild(li);

    });

  }



  function renderDeletedTasks() {

    if (!deletedListEl) return;

    deletedListEl.innerHTML = "";

    (window.deletedTasks || []).forEach((task) => {

      const li = document.createElement("li");

      li.dataset.id = task.id;

      li.classList.add("fade-in");

      const span = document.createElement("span");

      span.textContent = formatTaskText(task);

      li.appendChild(span);



      const restoreBtn = document.createElement("button");

      restoreBtn.textContent = "↩️";

      restoreBtn.className = "restore-btn";

      li.appendChild(restoreBtn);



      const removeBtn = document.createElement("button");

      removeBtn.textContent = "❌";

      removeBtn.className = "remove-btn";

      li.appendChild(removeBtn);



      deletedListEl.appendChild(li);

    });

  }



  window.renderCurrentPage = function() {

    renderAllTasks();
    renderCompletedTasks();
    renderDeletedTasks();

  };



  // All tasks event delegation

  if (allListEl) {

    allListEl.addEventListener("click", async (event) => {

      const target = event.target;

      const li = target.closest("li");

      if (!li) return;

      const id = li.dataset.id;



      if (target.classList.contains("delete-btn")) {

        try {

          showLoader(true);

          await api.deleteTask(id);

          await window.loadFromServer();

          deleteSound?.play();

          showPopup("Task Deleted!");

        } catch (e) {

          console.error(e);

          showPopup("Failed to delete task");

        } finally {

          showLoader(false);

        }

      }



      if (target.classList.contains("complete-btn")) {

        try {

          showLoader(true);

          await api.updateTask({ id: id, completed: 1 });

          await window.loadFromServer();

          completeSound?.play();

          showPopup("Task Marked Complete!");

        } catch (e) {

          console.error(e);

          showPopup("Failed to update task");

        } finally {

          showLoader(false);

        }

      }

    });

  }



  // Completed tasks event delegation

  if (completedListEl) {

    completedListEl.addEventListener("click", async (event) => {

      const target = event.target;

      const li = target.closest("li");

      if (!li) return;

      const id = li.dataset.id;



      if (target.classList.contains("delete-btn") || target.classList.contains("remove-btn")) {

        try {

          showLoader(true);

          await api.updateTask({ id: id, deleted: 1 });

          await window.loadFromServer();

          deleteSound?.play();

          showPopup("Task Deleted!");

        } catch (e) {

          console.error(e);

          showPopup("Failed to delete task");

        } finally {

          showLoader(false);

        }

      }



      if (target.classList.contains("complete-btn")) {

        try {

          showLoader(true);

          await api.updateTask({ id: id, completed: 0 });

          await window.loadFromServer();

          showPopup("Marked Incomplete");

        } catch (e) {

          console.error(e);

          showPopup("Failed to update task");

        } finally {

          showLoader(false);

        }

      }

    });

  }



  // Deleted tasks event delegation (restore or permanent remove)

  if (deletedListEl) {

    deletedListEl.addEventListener("click", async (event) => {

      const target = event.target;

      const li = target.closest("li");

      if (!li) return;

      const id = li.dataset.id;



      if (target.classList.contains("restore-btn")) {

        try {

          showLoader(true);

          await api.updateTask({ id: id, deleted: 0, completed: 0 });

          await window.loadFromServer();

          showPopup("Task Restored");

        } catch (e) {

          console.error(e);

          showPopup("Failed to restore task");

        } finally {

          showLoader(false);

        }

      }



      if (target.classList.contains("remove-btn")) {

        // permanent delete via remove endpoint

        try {

          showLoader(true);

          await api.removeTask(id);

          await window.loadFromServer();

          showPopup("Task Permanently Removed");

        } catch (e) {

          console.error(e);

          showPopup("Failed to remove task");

        } finally {

          showLoader(false);

        }

      }

    });

  }







})();
