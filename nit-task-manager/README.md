# Task Manager Backend

##  Features

* User Registration & Login (JWT Authentication)
* Password hashing using bcrypt
* Role-based access control (ADMIN / USER)
* Multi-tenant system (Organization-based)
* Task CRUD APIs (Create, Read, Update, Delete)

---

##  Tech Stack

* Node.js
* Express.js
* Prisma ORM
* SQLite

---

##  Authentication

* JWT-based authentication
* Token must be passed in headers for protected routes

Example:
Authorization: Bearer <your_token>

---

##  API Endpoints

###  Auth

#### Register

POST /register

#### Login

POST /login

---

###  Tasks

#### Create Task (ADMIN only)

POST /tasks

#### Get Tasks

GET /tasks

#### Update Task

PUT /tasks/:id

#### Delete Task

DELETE /tasks/:id

---

## 🧪 Sample Requests

### Register (Admin)

{
"email": "[admin@gmail.com](mailto:admin@gmail.com)",
"password": "123",
"orgName": "Org1",
"role": "ADMIN"
}

### Register (User)

{
"email": "[user@gmail.com](mailto:user@gmail.com)",
"password": "123",
"orgName": "Org1"
}

### Login

{
"email": "[admin@gmail.com](mailto:admin@gmail.com)",
"password": "123"
}

### Create Task (Admin only)

{
"title": "Task 1"
}

---

##  Notes

* Email must be unique
* Only ADMIN can create tasks
* Users can only view tasks within their organization
* Authorization header is required for all task routes

---

##  Project Structure

* app.js
* prisma/

  * schema.prisma
  * migrations/
* package.json
* README.md

---

##  Run Project

npm install
npx prisma generate
npx prisma migrate dev
node app.js

---

##  Server

Server runs on: http://localhost:3000

---

##  Status

✔ Backend Completed
✔ Authentication Working
✔ APIs Tested
✔ GitHub Ready

---
