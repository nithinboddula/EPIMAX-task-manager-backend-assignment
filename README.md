# EpiMax Backend Assignment Reference Document

### 1. API Design

**Objective:** Define RESTful API endpoints for CRUD operations on tasks.

**Steps:**

- **Identify Key Actions:** Determine the CRUD operations needed: Create, Read, Update, Delete for tasks.
- **Define Routes:**
    - POST `/tasks` - Create a new task
    - GET `/tasks` - Retrieve all tasks
    - GET `/tasks/:id` - Retrieve a specific task by ID
    - PUT `/tasks/:id` - Update a specific task by ID
    - DELETE `/tasks/:id` - Delete a specific task by ID
- **Specify JSON Body and Responses:** Detail the JSON format for requests (what to send) and responses (what to expect back).
- **Document Authentication Requirements:** Note which endpoints require user authentication.

**Tools:** Use tools like Swagger or Postman for documenting these API endpoints.

### 2. Database Schema

**Objective:** Design a database schema for task management.

**Steps:**

- **Define Tables:**
    - `Tasks` table with columns: `id` (primary key), `title`, `description`, `status`, `assignee_id`, `created_at`, `updated_at`.
    - `Users` table for handling authentication with columns: `id`, `username`, `password_hash`.
- **Relationships:** Link `Users` to `Tasks` through `assignee_id` to show which user is responsible for a task.
- **Write SQL Scripts:** Create SQL scripts to set up these tables. For SQLite, use:
    
    ```sql
    CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password_hash TEXT);
    
    CREATE TABLE Tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, status TEXT, assignee_id INTEGER, created_at DATETIME, updated_at DATETIME, FOREIGN KEY(assignee_id) REFERENCES Users(id));
    
    ```
    

### 3. Backend Logic

**Objective:** Implement business logic for task management.

**Steps:**

- **Set Up Node.js Project:** Initialize a Node.js project with `npm init`.
- **Install Dependencies:** Use `npm install express sqlite3 body-parser`.
- **Implement Endpoints:** Use Express.js to setup routes that correspond to your API design.
    - For each route, connect to the SQLite database and execute the appropriate SQL query.
- **Error Handling:** Ensure your API handles errors gracefully and returns appropriate error messages.

### 4. Authentication and Authorization

**Objective:** Secure the API using authentication and role-based access control.

**Steps:**

- **Implement User Authentication:** Use JSON Web Tokens (JWT) for authentication.
    - Install JWT library: `npm install jsonwebtoken`.
    - Create login and register endpoints that handle token creation and user authentication.
- **Role-Based Access Control:** Implement middleware that checks if the authenticated user has the correct permissions to perform certain actions.

### 5. Testing and Debugging (Optional)

**Objective:** Write tests and debug the backend.

**Steps:**

- **Unit Testing:** Use a testing framework like Jest.
    - Install Jest: `npm install --save-dev jest`.
    - Write tests for each API endpoint to ensure they perform as expected.
- **Integration Testing:** Test the integration of your API with the frontend.
- **Debugging:** Use console logs and Node.js debugging tools to trace and fix issues.