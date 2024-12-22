graph TB
    subgraph "Frontend - React + Vite"
        App[App.jsx]
        
        subgraph "Authentication"
            AuthContext[AuthContext]
            GoogleAuth[GoogleAuthProvider]
            Login[Login Page]
            Register[Register Page]
        end
        
        subgraph "Components"
            Navbar[Navbar]
            Calendar[Calendar]
            UI[UI Components]
        end
        
        subgraph "Pages"
            Home[Home]
            Dashboard[Dashboard]
            AdminDash[Admin Dashboard]
            TimeEntry[Time Entry]
            Services[Services]
            AboutUs[About Us]
            Contact[Contact]
            Blog[Blog]
        end
        
        App --> AuthContext
        AuthContext --> GoogleAuth
        AuthContext --> Login
        AuthContext --> Register
        App --> Navbar
        App --> Pages
        Dashboard --> Calendar
        Dashboard --> TimeEntry
    end
    
    subgraph "Backend - Node.js"
        Server[Express Server]
        
        subgraph "API Routes"
            AuthAPI[Auth Routes]
            TimesheetAPI[Timesheet Routes]
            AdminAPI[Admin Routes]
        end
        
        subgraph "Models"
            UserModel[User Model]
            TimesheetModel[Timesheet Model]
        end
        
        Server --> AuthAPI
        Server --> TimesheetAPI
        Server --> AdminAPI
        AuthAPI --> UserModel
        TimesheetAPI --> TimesheetModel
    end
    
    subgraph "Database"
        MongoDB[(MongoDB)]
    end
    
    subgraph "External Services"
        GoogleOAuth[Google OAuth]
    end
    
    %% Connections between major components
    Frontend --> Server
    Server --> MongoDB
    GoogleAuth --> GoogleOAuth
    
    %% Testing Infrastructure
    subgraph "Testing"
        Jest[Jest]
        MockServer[Mock Server]
        Tests[Component & API Tests]
    end
    
    Frontend --> MockServer
    Server --> Tests
    
    %% Styling
    style Frontend fill:#f9f,stroke:#333,stroke-width:2px
    style Backend fill:#bbf,stroke:#333,stroke-width:2px
    style Database fill:#dfd,stroke:#333,stroke-width:2px
    style Testing fill:#ffd,stroke:#333,stroke-width:2px
    
    %% Flow Descriptions
    classDef default fill:#fff,stroke:#333,stroke-width:1px
    classDef external fill:#fcf,stroke:#333,stroke-width:1px
    class GoogleOAuth external
```

# Architecture Overview

## Frontend Layer
- **React + Vite**: Main frontend framework and build tool
- **Components**: Reusable UI elements (Navbar, Calendar, etc.)
- **Pages**: Different views/routes of the application
- **Context**: State management using React Context (Auth, Google Auth)
- **UI Components**: Shared UI elements using Tailwind CSS

## Backend Layer
- **Express Server**: Main backend server handling API requests
- **API Routes**: 
  - Auth Routes: Handle user authentication
  - Timesheet Routes: Manage timesheet operations
  - Admin Routes: Administrative functions
- **Models**: MongoDB schemas for data structure

## Database Layer
- **MongoDB**: Main database storing user and timesheet data

## Authentication
- **Local Auth**: Username/password authentication
- **Google OAuth**: Integration with Google for authentication
- **JWT**: Token-based authentication for API requests

## Testing Infrastructure
- **Jest**: Testing framework
- **Mock Server**: For frontend testing
- **API Tests**: Backend endpoint testing
- **Component Tests**: Frontend component testing

## External Services
- **Google OAuth**: For authentication
- **Other potential integrations**: Payment gateways, email services, etc.

## Security Features
- JWT-based authentication
- Protected routes
- Role-based access control
- Environment variable configuration

## Development & Deployment
- **CI/CD**: Jenkins pipeline
- **Environment Management**: .env files for configuration
- **Build Tools**: Vite for frontend, Node.js for backend
