const API_BASE = "php"; 


const api = {

  async getTasks() {

    const res = await fetch(`${API_BASE}/tasks/get.php`, {
      credentials: 'include'
    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async addTask(task) {

    const res = await fetch(`${API_BASE}/tasks/add.php`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(task),

      credentials: 'include'

    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async updateTask(payload) {

    const res = await fetch(`${API_BASE}/tasks/update.php`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

      credentials: 'include'

    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async deleteTask(id) {

    const res = await fetch(`${API_BASE}/tasks/delete.php`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ id }),

      credentials: 'include'

    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

  async removeTask(id) {

    const res = await fetch(`${API_BASE}/tasks/remove.php`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ id }),

      credentials: 'include'

    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async signup(payload) {

    const res = await fetch(`${API_BASE}/auth/signup.php`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

      credentials: 'include'

    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async login(payload) {

    const res = await fetch(`${API_BASE}/auth/login.php`, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

      credentials: 'include'

    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async logout() {

    const res = await fetch(`${API_BASE}/auth/logout.php`, {
      credentials: 'include'
    });

    if (!res.ok) throw await res.json();

    return res.json();

  },

async validateSession() {

    const res = await fetch(`${API_BASE}/auth/validate.php`, {
      credentials: 'include'
    });

    return res.json();

  }

};
