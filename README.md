# Online Asset Tracking Dashboard

A full-stack web application designed for tracking company assets, assigning them to employees, and generating reports. Built with a React/Tailwind frontend and Node.js/Express/MongoDB backend.

## Project Structure
- `frontend/`: React application using Vite, TailwindCSS, React Router, and Recharts.
- `backend/`: Express.js API, MongoDB Mongoose Models, JWT Auth.

## Features Included
1. **Dashboard Overview**: Asset statistics and pie chart representing available vs assigned assets.
2. **Assets Management**: Add, View, Edit, and Delete Assets with unique tags.
3. **Employee Directory**: Keep track of employees by departments.
4. **Assignments Management**: Assign available assets to specific employees and mark them as returned.
5. **System Reports**: Overall tracking logs with a CSV export functionality.
6. **Authentication**: JWT-based login for securing the admin paths.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

## Installation Steps

### 1. Database Setup
Ensure MongoDB is running locally on port `27017` or update the `MONGO_URI` in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Application will run on http://localhost:5173
```

## First Time Usage (Sample Data)
To view the dashboard, you must first register an admin user.
Use a tool like Postman or run a `curl` to create the first admin:
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin","email":"admin@example.com","password":"password123"}'
```

Afterward, use `admin@example.com` and `password123` to log into the frontend.

## Technologies Used
- Frontend: React 18, Vite, Tailwind CSS, Lucide React (Icons), Recharts (Charts).
- Backend: express, mongoose, bcrypt, jsonwebtoken.
