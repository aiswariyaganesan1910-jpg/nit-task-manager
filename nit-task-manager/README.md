# Task Manager Backend

## Features
- User Registration & Login (JWT)
- Password hashing using bcrypt
- Role-based access (ADMIN / USER)
- Multi-tenant system (Organization-based)
- Task CRUD APIs

## Tech Stack
- Node.js
- Express.js
- Prisma ORM
- SQLite

## API Endpoints

### Auth
POST /register  
POST /login  

### Tasks
POST /tasks (ADMIN only)  
GET /tasks  
PUT /tasks/:id  
DELETE /tasks/:id  

## Run Project

npm install  
npx prisma migrate dev  
node app.js  

Server runs on http://localhost:3000