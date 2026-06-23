# 📝 Task Manager — MERN Stack

A simple beginner-friendly Task Manager built with **MongoDB, Express, React, and Node.js**.

## Project Structure

```
task management/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose schema
│   ├── routes/
│   │   └── tasks.js         # REST API routes
│   ├── server.js            # Express server entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js           # Main React component
    │   ├── App.css          # All styles
    │   ├── index.js         # ReactDOM entry point
    │   └── index.css        # Global reset
    └── package.json
```

## API Endpoints

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | /api/tasks        | Get all tasks         |
| POST   | /api/tasks        | Create a new task     |
| PATCH  | /api/tasks/:id    | Toggle complete/incomplete |
| DELETE | /api/tasks/:id    | Delete a task         |

## ⚙️ Setup & Run

### 1. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. Create a database user and whitelist your IP (or use 0.0.0.0/0 for dev).
3. Copy your connection string.

### 2. Set Up Backend

```bash
cd backend

# Copy and fill in your MongoDB URI
copy .env.example .env
# Edit .env and replace the placeholder with your real MongoDB URI

# Start the backend
npm run dev
```

The API will run on **http://localhost:5000**

### 3. Start Frontend

Open a **second terminal**:

```bash
cd frontend
npm start
```

The React app will open at **http://localhost:3000**

## ✨ Features

- ✅ Add tasks with a title
- 📋 View all tasks (newest first)
- ☑️ Mark tasks as complete / incomplete
- 🗑️ Delete tasks
- 💾 All data persisted in MongoDB Atlas
