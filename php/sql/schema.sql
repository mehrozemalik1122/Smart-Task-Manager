-- users table

CREATE TABLE IF NOT EXISTS users (

  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(200) NOT NULL,

  email VARCHAR(255) NOT NULL UNIQUE,

  password_hash VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Index for faster email lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- tasks table

CREATE TABLE IF NOT EXISTS tasks (

  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT DEFAULT NULL,

  text TEXT NOT NULL,

  datetime DATETIME NULL,

  completed TINYINT(1) DEFAULT 0,

  deleted TINYINT(1) DEFAULT 0,

  reminded TINYINT(1) DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL

);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_deleted ON tasks(user_id, deleted);
CREATE INDEX IF NOT EXISTS idx_tasks_datetime ON tasks(datetime);
