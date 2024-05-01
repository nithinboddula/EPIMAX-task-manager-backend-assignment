const express = require("express"); //importing express module
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authMiddleware.js");

const app = express(); //creating app instance
app.use(express.json()); // for parsing application/json

const dbPath = path.join(__dirname, "epimax.db");

let db = null;

// Initialize DB and Start server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Sign Up API
app.post("/signup/", async (request, response) => {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
        INSERT INTO
          users (username, password_hash)
        VALUES
          (
            '${username}',
            '${hashedPassword}'
          );`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.status(201);
    response.send(`Created new user with userid ${newUserId}`);
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

//login API
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const userDetailsQuery = `
    SELECT
      *
     FROM
      users
     WHERE
      username = "${username}" ;`;

  const dbUser = await db.get(userDetailsQuery);
  // console.log(dbUser.id);

  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      dbUser.password_hash
    );
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
        userId: dbUser.id,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//API ENDPOINT 1
app.post("/tasks", authenticateToken, async (request, response) => {
  const { userId } = request;
  const { title, description, status } = request.body;
  const moment = require("moment");
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  const createNewTaskQuery = `
        INSERT INTO
            tasks (title, description, status, assignee_id, created_at)
        VALUES ("${title}", "${description}", "${status}", ${userId}, "${currentTime}");
                   `;
  await db.run(createNewTaskQuery);
  response.status(201);
  response.send("Successfully created new task");
});

//API ENDPOINT 2
app.get("/tasks", authenticateToken, async (request, response) => {
  const { userId } = request;
  // console.log(userId);
  const allTasksQuery = `
  SELECT
    *
  FROM
    tasks
  WHERE
    assignee_id = ${userId};
    `;
  const dbResponse = await db.all(allTasksQuery);
  response.status(200);
  response.send(dbResponse);
});

//API ENDPOINT 3
app.get("/tasks/:id", authenticateToken, async (request, response) => {
  //get specified task by ID
  const { userId } = request;
  const { id } = request.params;
  const specificTaskQuery = `
  SELECT
    *
  FROM
    tasks
  WHERE
    assignee_id = ${userId} and id = ${id};
    `;
  const dbResponse = await db.get(specificTaskQuery);
  response.status(200);
  response.send(dbResponse);
});

//API ENDPOINT 4
app.put("/tasks/:id", authenticateToken, async (request, response) => {
  // update task by ID
  const { userId } = request;
  const { id } = request.params;
  const { updatedTitle, updatedDescription, updatedStatus } = request.body;
  const moment = require("moment");
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  const updateTaskQuery = `UPDATE
        tasks
    SET
        title = '${updatedTitle}',
        description = '${updatedDescription}',
        status = '${updatedStatus}',
        updated_at = '${currentTime}'
    WHERE
      assignee_id = ${userId} and id = ${id}; `;
  await db.run(updateTaskQuery);
  response.status(201);
  response.send("Task Updated Successfully");
});

//API ENDPOINT 5
app.delete("/tasks/:id", authenticateToken, async (request, response) => {
  //delete task by ID
  const { userId } = request;
  const { id } = request.params;
  const deleteSpecificTaskQuery = `
  DELETE FROM
    tasks
  WHERE
  assignee_id = ${userId} and id = ${id};
  `;
  await db.run(deleteSpecificTaskQuery);
  response.status(200);
  response.send("Task Deleted Successfully");
});

module.exports = app;
