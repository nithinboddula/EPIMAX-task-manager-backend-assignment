const sqlite3 = require("sqlite3").verbose();


const createTable = new sqlite3.Database(
  "epimax.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

// creating users table
const createUsersTableQuery = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password_hash TEXT);
`;

createTable.run(createUsersTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Users Table created successfully!");
  }
});

// creating tasks table
const createTasksTableQuery = `
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT, description TEXT, status TEXT, assignee_id INTEGER,
      created_at DATETIME, updated_at DATETIME,
      FOREIGN KEY(assignee_id) REFERENCES Users(id));
`;

createTable.run(createTasksTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Tasks Table created successfully!");
  }
});
