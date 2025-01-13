# Planner API

## Overview

The Planner API is a Node.js and Express application designed to manage planner data. It provides a RESTful interface for interacting with planner resources such as calendars and tasks. The API supports user authentication and authorization using JWT (JSON Web Tokens) and Passport.js. Users can create, read, update, and delete their calendars and tasks, and these resources are associated with the authenticated user.

## Features

- User Authentication: Secure user authentication using JWT and Passport.js.
- User Management: Endpoints for user registration and login.
- Calendar Management: Create, read, update, and delete calendars associated with users.
- Task Management: Create, read, update, and delete tasks associated with calendars.
- Data Validation: Input validation using express-validator.
- Database Integration: MongoDB for data storage, with Mongoose for object data modeling.

## Project Structure

```
planner-api
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore file
├── package.json             # npm configuration file
├── README.md                # Project documentation
└── src
    ├── app.js               # Entry point of the application
    ├── config               # Configuration files
    │   ├── db.js            # Database connection
    │   └── passport.js      # Passport configuration
    ├── controllers          # Contains controller files
    │   ├── calendar.js      # Calendar controller
    │   ├── task.js          # Task controller
    │   └── users.js         # User controller
    ├── models               # Contains model definitions
    │   ├── calendar.js      # Calendar model
    │   ├── task.js          # Task model
    │   └── users.js         # User model
    └── routes               # Contains route definitions
        ├── auth.js          # Authentication routes
        └── index.js         # Exports setRoutes function
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/TheaWin/planner-api
   ```
2. Navigate to the project directory:
   ```
   cd planner-api
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:

```
npm start
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a .env file in the root directory and add the following environment variables:

```
MONGO_URI=<your_mongodb_connection_string>
PORT=3000
SECRET_KEY=<your_jwt_secret_key>
```

## API Endpoints

# Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login a user and return a JWT

# User

- `GET /users`: Get user details

# Calendar

- `POST /calendars`: Create a new calendar
- `GET /calendars`: Get all calendars
- `GET /calendars/:calendarName`: Get a specific calendar
- `PUT /calendars/:calendarName`: Update a specific calendar
- `DELETE /calendars/:calendarName`: Delete a specific calendar

# Task

- `POST /tasks`: Create a new task
- `GET /tasks`: Get all tasks
- `GET /tasks/namesearch/:taskName`: Get tasks by name
- `GET /tasks/idsearch/:taskId`: Get a specific task by ID
- `PUT /tasks/:taskId`: Update a specific task
- `GET /tasks/:calendarName`: Get tasks by calendar name
- `GET /tasks/date/:dueDate`: Get tasks by due date
- `PATCH /tasks/:taskId`: Toggle task completion
- `DELETE /tasks/:taskId`: Delete a specific task

## Development Challenge

This project was developed using GitHub Copilot as part of [GitHub Copilot 1-Day Build Challenge](https://dev.to/challenges/github).

```

This section provides a clear declaration that the project was developed using GitHub Copilot for a Dev Challenge.
This section provides a clear declaration that the project was developed using GitHub Copilot for a Dev Challenge.
```
