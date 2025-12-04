(() => {

  const CHECK_INTERVAL_MS = 10000;

  async function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (e) {}
    }
  }

  function sendDesktopNotification(title, body) {

    console.log(`[Reminder] Attempting notification: ${title} - ${body}`);

    if (!("Notification" in window)) {
      console.log('[Reminder] Notifications not supported');
      return;
    }

    console.log(`[Reminder] Notification permission: ${Notification.permission}`);

    if (Notification.permission === "granted") {

      try { 
        const notification = new Notification(title, { 
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📅</text></svg>',
          requireInteraction: true
        });
        console.log('[Reminder] Notification sent successfully');
      } catch (e) {
        console.error('[Reminder] Notification error:', e);
      }

    } else {
      console.log('[Reminder] Notification permission not granted');
    }

  }



  function parseServerDateTime(datetimeStr) {
    // Convert "Y-m-d H:i:s" to JavaScript Date
    if (!datetimeStr) return null;
    
    // Split the date and time parts
    const [datePart, timePart] = datetimeStr.split(' ');
    if (!datePart || !timePart) return null;
    
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    
    // Create date in local timezone
    return new Date(year, month - 1, day, hour, minute, second || 0);
  }

  function checkRemindersNow() {

    const now = new Date();

    const checkList = (window.tasks || []).concat(window.completedTasks || []);

    console.log(`[Reminder] Checking ${checkList.length} tasks at ${now.toLocaleString()}`);

    checkList.forEach((task, index) => {

      console.log(`[Reminder] Task ${index + 1}: "${task.text}" - datetime: ${task.datetime}, reminded: ${task.reminded}`);
      console.log(`[Reminder] Task object:`, JSON.stringify(task, null, 2));
      console.log(`[Reminder] !task.datetime: ${!task.datetime}, task.reminded: ${task.reminded}`);

      // Only skip if explicitly reminded (true, 1, or "1")
      const isReminded = task.reminded === true || task.reminded === 1 || task.reminded === "1";
      
      if (!task.datetime || isReminded) {
        console.log(`[Reminder] Skipping task ${index + 1}: no datetime (${!task.datetime}) or already reminded (${isReminded})`);
        return;
      }

      const taskTime = parseServerDateTime(task.datetime);
      
      if (!taskTime) {
        console.log(`[Reminder] Failed to parse datetime for task ${index + 1}: ${task.datetime}`);
        return;
      }

      console.log(`[Reminder] Task "${task.text}": ${taskTime.toLocaleString()} vs ${now.toLocaleString()}`);

      const timeDiff = now - taskTime;
      console.log(`[Reminder] Time difference: ${timeDiff}ms (${timeDiff/1000}s)`);

      if (now >= taskTime) {

        const msg = `Reminder: ${task.text}`;

        console.log(`[Reminder] TRIGGERED: ${msg}`);

        if (typeof window.showPopup === "function") {
          console.log('[Reminder] Calling showPopup...');
          window.showPopup(msg);
          console.log('[Reminder] showPopup called successfully');
        } else {
          console.error('[Reminder] showPopup function not available');
        }

        console.log('[Reminder] Sending desktop notification...');
        sendDesktopNotification("Smart Task Manager", msg);

        task.reminded = true;

        if (typeof window.saveAll === "function") window.saveAll();

        try { window.completeSound?.play(); } catch(e) {}

        // Also notify backend that task was reminded (optional)

        if (typeof api !== "undefined" && task.id) {

          api.updateTask({ id: task.id, reminded: 1 }).catch((e)=>{ console.error('[Reminder] Failed to update task:', e); });

        }

      } else {
        console.log(`[Reminder] Task not yet due: ${task.text}`);
      }

    });

  }



  window.addEventListener("DOMContentLoaded", () => {
    console.log('[Reminder] DOM loaded, initializing...');
    
    // Request notification permission immediately
    requestNotificationPermission();
    
    // Also request on first user interaction as fallback
    document.addEventListener('click', requestNotificationPermission, { once: true });
    
    // Wait a bit for tasks to load, then start checking
    setTimeout(() => {
      console.log('[Reminder] Starting reminder checks...');
      checkRemindersNow();
      setInterval(checkRemindersNow, CHECK_INTERVAL_MS);
    }, 2000);

  });



  // Expose functions for manual testing
  window.checkRemindersNow = checkRemindersNow;
  
  window.testReminderPopup = function() {
    console.log('[Reminder] Testing popup function...');
    if (typeof window.showPopup === "function") {
      console.log('[Reminder] showPopup function exists, calling it...');
      window.showPopup("Test reminder popup!");
      console.log('[Reminder] showPopup called');
    } else {
      console.error('[Reminder] showPopup function not found');
    }
  };
  
  window.forceReminderTest = function() {
    console.log('[Reminder] Forcing reminder test...');
    if (typeof window.showPopup === "function") {
      window.showPopup("Forced Test Reminder!");
    }
    sendDesktopNotification("Smart Task Manager", "Forced Test Reminder!");
  };

})();
