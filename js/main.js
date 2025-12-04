(() => {

  // initialize arrays from localStorage (will be replaced by server data after API calls)

  window.tasks = JSON.parse(localStorage.getItem("stm_tasks") || "[]");

  window.completedTasks = JSON.parse(localStorage.getItem("stm_completed") || "[]");

  window.deletedTasks = JSON.parse(localStorage.getItem("stm_deleted") || "[]");



  // sounds

  window.completeSound = new Audio("assets/sounds/task-done.mp3");

  window.deleteSound = new Audio("assets/sounds/delete-done.mp3");



  // DOM elements (may be undefined on pages without these)

  const taskInput = document.getElementById("taskInput");

  const addTaskBtn = document.getElementById("addTaskBtn");

  const taskDate = document.getElementById("taskDate");

  const taskTime = document.getElementById("taskTime");

  const loader = document.getElementById("loader");



  window.saveAll = () => {

    localStorage.setItem("stm_tasks", JSON.stringify(window.tasks));

    localStorage.setItem("stm_completed", JSON.stringify(window.completedTasks));

    localStorage.setItem("stm_deleted", JSON.stringify(window.deletedTasks));

  };



  window.showPopup = (message) => {

    const popup = document.createElement("div");

    popup.className = "popup";

    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {

      popup.classList.remove("show");

      setTimeout(() => popup.remove(), 300);

    }, 1500);

  };



  function createTaskObject(text, dateStr, timeStr) {

    let datetime = null;

    if (dateStr) {

      const t = timeStr ? timeStr : "00:00";

      const d = new Date(`${dateStr}T${t}`);

      if (!isNaN(d.getTime())) datetime = d.toISOString();

    }

    return {

      id: Date.now().toString() + Math.floor(Math.random() * 1000),

      text,

      datetime,

      completed: false,

      deleted: false,

      reminded: false

    };

  }



  window.showLoader = function(state) {

    if (!loader) return;

    if (state) loader.classList.remove("hidden");

    else loader.classList.add("hidden");

  };



  // on add button click -> call API.addTask and then refresh tasks from server

  if (addTaskBtn) {

    addTaskBtn.addEventListener("click", async () => {

      const taskText = taskInput.value.trim();

      if (!taskText) {

        showPopup("Please enter a task first!");

        return;

      }

      const dateVal = taskDate?.value || "";

      const timeVal = taskTime?.value || "";

      if (!dateVal || !timeVal) {

        showPopup("Please select both date and time!");

        return;

      }

      const datetime = `${dateVal}T${timeVal}:00`;



      try {

        showLoader(true);

        await api.addTask({ text: taskText, datetime });

        const serverData = await api.getTasks();
        
        window.tasks = serverData.all || [];
        window.completedTasks = serverData.completed || [];
        window.deletedTasks = serverData.deleted || [];

        window.saveAll();

        if (typeof window.renderCurrentPage === "function") window.renderCurrentPage();

        showPopup("Task Added!");

      } catch (err) {

        console.error(err);

        showPopup("Failed to add task");

      } finally {

        showLoader(false);

        taskInput.value = "";

        if (taskDate) taskDate.value = "";

        if (taskTime) taskTime.value = "";

      }

    });

  }



  // helper to load initial tasks from server on page load

  window.loadFromServer = async function() {

    try {

      showLoader(true);

      const serverData = await api.getTasks();

      // server returns organized tasks by status
      window.tasks = serverData.all || [];
      window.completedTasks = serverData.completed || [];
      window.deletedTasks = serverData.deleted || [];

      window.saveAll();

      if (typeof window.renderCurrentPage === "function") {
        window.renderCurrentPage();
      }

    } catch (e) {

      console.error("Failed to load tasks from server", e);
      showPopup("Failed to load tasks");

    } finally {

      showLoader(false);

    }

  };



  // run on DOM ready

  window.addEventListener("DOMContentLoaded", async () => {

    // Check authentication on protected pages
    const currentPage = window.location.pathname.split('/').pop() || window.location.pathname;
    const isProtectedPage = currentPage.includes('dashboard.html') || 
                           currentPage.includes('all_tasks.html') || 
                           currentPage.includes('completed.html') || 
                           currentPage.includes('deleted.html');
    
    if (isProtectedPage && typeof api !== "undefined") {
      try {
        const authResponse = await api.validateSession();
        if (!authResponse.authenticated) {
          window.location.href = 'index.html';
          return;
        }
        // Only load tasks after successful authentication
        await window.loadFromServer();
        
      } catch (error) {
        window.location.href = 'index.html';
        return;
      }
    } else {
      // For non-protected pages or if api not available
      if (typeof api !== "undefined") {
        window.loadFromServer();
      } else {
        // fallback: just render whatever is in localStorage
        if (typeof window.renderCurrentPage === "function") window.renderCurrentPage();
      }
    }

  });



})();
