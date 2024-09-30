# Task Manager

Task Manager is a full-stack web application designed for efficient task management. It features a React frontend and a Node.js backend with MongoDB for data storage. The application includes user authentication, secured routes, password hashing, JWT-based authentication, and advanced task management functionalities.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Task Management](#task-management)
- [Authentication](#authentication)
- [Additional Notes](#additional-notes)
- [Future Improvements](#future-improvements)

---

## Project Structure

```
TaskManager/
├── frontend/       # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── dashboard_components/ # Components related to the dashboard
│   │   │   │   ├── Dashboard.js   # Main dashboard component
│   │   │   │   ├── Edit.js        # Component for editing tasks
│   │   │   │   └── Add.js         # Component for adding tasks
│   │   │   ├── utils/          # Utility functions and helpers
│   │   │   │   ├── DateUtil.js   # Date utility functions
│   │   │   │   ├── FilterContext.js # Context for task filtering
│   │   │   │   ├── ProtectedRoute.js # Component for protected routes
│   │   │   │   └── ValidationUtil.js # Utility functions for validation
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # Entry point for React
│   │   └── style.css          # Global styles
│   ├── package.json
│   └── Dockerfile
├── backend/        # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js   # Main server file
│   ├── .env
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml  # Docker configuration (not fully implemented)

```

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22.8.0 or higher)
- [MongoDB](https://www.mongodb.com/) (installed locally or via cloud)
- (Optional) [Docker](https://www.docker.com/) (for containerization)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/TaskManager.git
   cd TaskManager
   ```

2. **Open two separate terminal windows**:
   - One for the `frontend`
   - One for the `backend`

3. **Backend Setup**:
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend:
     ```bash
     npm start
     ```
   - The backend will run on `http://localhost:3001` and depends on MongoDB to store and retrieve task-related data.

4. **Frontend Setup**:
   - Navigate to the `frontend` folder in the second terminal:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend:
     ```bash
     npm start
     ```
   - The frontend will be accessible at `http://localhost:3000`.

---

## Running the Application

1. **Start the backend first**:
   - Open a terminal in the `backend` folder.
   - Run `npm start` to launch the Node.js server on port `3001`.

2. **Start the frontend**:
   - Open another terminal in the `frontend` folder.
   - Run `npm start` to launch the React application on port `3000`.

Both the frontend and backend should now be running and able to communicate with each other.

---

## Technologies Used

- **Frontend**: React (v18.31)
- **Backend**: Node.js (v22.8.0), Express
- **Database**: MongoDB (local or cloud)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt for password hashing
- **Package Manager**: npm

---

## Features

- **Task Management**: Add, edit, delete, and view detailed tasks.
- **Authentication**: User login and registration with JWT-based authentication and password hashing stored in MongoDB.
- **Secured Routes**: Access to the dashboard is protected and requires authentication.
- **Task Filtering**: Filter tasks based on priority and status, clear filters, and sort tasks based on various attributes.
- **Multi-User Login Rerouting**: If a user is logged in and tries to access the login or signup page, they are automatically redirected to the dashboard.

---

## Task Management

- **Dashboard**: After successful login, users are directed to the dashboard where they can see a list of tasks.
- **Add Task**: If no tasks exist, the user can add a new task using the "Add Task" feature.
- **View Task Details**: Click on a task to view its full details, including options to edit or delete the task.
- **Edit and Delete**: Tasks can be edited or deleted directly from the dashboard.
- **Toggle Task Details**: Close task details by clicking on the task again.

---

## Authentication

- **Password Protection**: User passwords are hashed using Bcrypt before being stored in MongoDB.
- **JWT Implementation**: The backend implements JWT to authenticate users. Secured routes ensure that only logged-in users can access the dashboard and task management functionalities.
- **Multi-User Login Rerouting**: Users who are already logged in are redirected to the dashboard if they attempt to access the login or signup page.

---

## Additional Notes

- Docker configuration was started but not completed due to time constraints.
- Future improvements can include completing the Docker setup to containerize the frontend and backend services.

---

## Future Improvements

- Complete Docker integration for the entire application.
- Implement user-specific task management (e.g., assigning tasks to different users).
- Improve UI/UX little more.
