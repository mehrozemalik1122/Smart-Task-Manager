# Smart Task Manager

A full-stack task management application with user authentication, real-time reminders, and a responsive web interface.

## Features

- **User Authentication**: Secure signup/login with session management
- **Task Management**: Create, read, update, delete tasks with soft delete
- **Reminders**: Desktop notifications and in-app alerts for scheduled tasks
- **Real-time Updates**: Server-synchronized task states
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: PHP 7+ with MySQL
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: MySQL 5.7+

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database named `task_manager`
2. Run the schema file to create tables:
   ```sql
   mysql -u root -p task_manager < php/sql/schema.sql
   ```

### 2. Configuration

Update database credentials in `php/db/db.php`:
```php
$host = "localhost";
$user = "your_db_user";
$pass = "your_db_password";
$dbname = "task_manager";
```

### 3. Web Server Setup

Serve the project root directory via a web server (Apache/Nginx) with PHP support.

For Apache, ensure `.htaccess` allows PHP execution in the project directory.

### 4. File Permissions

Ensure the web server can write session files:
```bash
chmod 755 /path/to/session/save/path
```

## API Endpoints

### Authentication
- `POST /php/auth/signup.php` - User registration
- `POST /php/auth/login.php` - User login
- `GET /php/auth/logout.php` - User logout
- `GET /php/auth/validate.php` - Session validation

### Tasks
- `GET /php/tasks/get.php` - Get user's tasks
- `POST /php/tasks/add.php` - Create new task
- `POST /php/tasks/update.php` - Update task
- `POST /php/tasks/delete.php` - Soft delete task

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- User-specific data isolation
- SQL injection prevention with prepared statements
- XSS protection with input sanitization

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The application uses a modular architecture:
- `js/api.js` - API wrapper functions
- `js/main.js` - Task creation and initialization
- `js/tasks.js` - Task rendering and event handling
- `js/reminder.js` - Reminder system

All PHP endpoints include proper error handling and authentication checks.
