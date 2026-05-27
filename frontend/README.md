# Expense Tracker Web Application

## Project Description

This project is a single-page Expense Tracker web application developed for 32516 Assignment 2. The application allows users to register, log in, manage their own expense records, search expense items in real time, and interact with the system through a dynamic React interface.

The project uses a React frontend, a Node.js/Express backend, and a MongoDB database. It includes three main entities:

1. `user`
2. `expense_item`
3. `user_activity`

The application supports user authentication with password hashing and JWT, full CRUD operations for expense items, live search for expense records, and admin functions for managing user accounts and viewing user activity records.

## Main Features

### User Authentication

- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- Logout activity logging

### Expense Item CRUD

Authenticated users can:

- Create expense items
- Read their own expense items
- Update existing expense items
- Delete expense items

### Live Search

The expense list includes a live search bar. Expense items are filtered in real time as the user types. The search can match expense title, category, date, amount, and description/note.

### Admin Functions

Admin users can:

- View all registered user accounts
- Edit user profile information
- Delete user accounts
- View user activity records

### User Activity Records

The system records important user activities, including:

- Register
- Login
- Logout
- Create expense
- Update expense
- Delete expense
- Admin update user profile
- Admin delete user

## Technical Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Mongoose
- bcrypt
- JSON Web Token
- dotenv
- cors

### Database

- MongoDB

## Folder Structure

```txt
32516A2/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── UserActivity.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── logActivity.js
│   ├── scripts/
│   │   ├── makeAdmin.js
│   │   └── exportDatabase.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
├── database/
│   ├── users.json
│   ├── expenses.json
│   └── useractivities.json
│
├── README.md
└── .gitignore
## How to Run the Application

1. Backend Setup
Go to the backend folder:
cd backend
npm install
Create a .env file inside the backend folder:
PORT=5001
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key
Start the backend server:
npm run dev
The backend runs on:
http://localhost:5001
2. Frontend Setup
Open a second terminal and go to the frontend folder:
cd frontend
npm install
npm run dev
The frontend runs on:
http://localhost:5173