# Timesheet Application

A full-stack timesheet application for tracking work hours and managing employee time entries.

## Project Structure

The project is organized into two main parts:

### Frontend (React + Vite)
- `src/` - Contains all React components, contexts, and pages
  - `components/` - Reusable UI components
  - `context/` - React context providers
  - `pages/` - Application pages/routes
  - `lib/` - Utility functions
  - `assets/` - Static assets like images
  - `mocks/` - Mock data for testing

### Backend (Node.js + Express)
- `server/` - Contains all server-side code
  - `config/` - Configuration files (database connection)
  - `middleware/` - Express middleware
  - `models/` - Mongoose models
  - `routes/` - API route handlers
  - `tests/` - Server tests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

### Installation

1. Clone the repository
```
git clone <repository-url>
cd timesheet-app
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd server
npm install
cd ..
```

4. Set up environment variables
   - Create a `.env` file in the root directory for frontend variables
   - Create a `.env` file in the server directory for backend variables

5. Start the development server
```
# Start the frontend
npm run dev

# In a separate terminal, start the backend
cd server
npm run dev
```

## Features

- User authentication (login/register)
- Time entry tracking
- Admin dashboard for managing users
- Calendar view for timesheet entries
- Responsive design

## Database Structure

The application uses MongoDB with the following structure:

### Main Databases
1. **aahatimesheet**
   - Primary application database
   - Collections:
     - `customers`: Stores customer/client information
     - `users`: Stores user accounts with embedded timesheet entries

2. **admin**
   - MongoDB system database for administrative functions

3. **calendar_updater**
   - Collections:
     - `events`: Stores calendar events for the application

4. **local**
   - MongoDB system database for local operations

5. **test**
   - Test database
   - Collections:
     - `users`: Test user accounts

6. **timesheet**
   - Collections:
     - `aahatimesheet`: Alternative storage for timesheet data

### Data Models

#### User Model
- Schema includes:
  - `name`: String (required)
  - `email`: String (required, unique)
  - `password`: String (required, hashed using bcrypt)
  - `isAdmin`: Boolean (default: false)
  - `hourlyRate`: Number (required, default: 0)
  - `timesheets`: Array of embedded timesheet entries
  - Timestamps: createdAt, updatedAt

#### Timesheet Entry Schema (Embedded in User)
- Schema includes:
  - `date`: Date (required)
  - `location`: String (required)
  - `startTime`: String (required)
  - `endTime`: String (required)
  - `hoursWorked`: Number (required)
  - Timestamps: createdAt, updatedAt

## Technologies Used

### Frontend
- React
- React Router
- Tailwind CSS
- Radix UI
- FullCalendar
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## API Documentation

A Postman collection is included in the repository to help test and interact with the API endpoints:

- **File**: `aahatimesheet-postman-collection.json`
- **Import**: Open Postman and import the collection file
- **Environment Setup**: 
  - Set the `baseUrl` variable to your server URL (default: `http://localhost:5001`)
  - The collection automatically saves authentication tokens from login/register responses

### Available Endpoints

#### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/admin-token` - Generate admin token (for initial setup)

#### Timesheet
- `GET /api/timesheet` - Get all timesheet entries
- `POST /api/timesheet` - Create a new timesheet entry

#### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users/admin` - Create a new admin user (admin only)

## Testing

```
# Run frontend tests
npm test

# Run backend tests
cd server
npm test
