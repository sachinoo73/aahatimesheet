# AAHA Timesheet Application

A modern timesheet management system built with React, Node.js, and MongoDB.

## Architecture

See [architecture.md](./architecture.md) for a detailed system architecture diagram and documentation.

## Features

- User Authentication (Local + Google OAuth)
- Time Entry Management
- Calendar Integration
- Admin Dashboard
- Role-based Access Control
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials (for Google Sign-in)
- Git

## Getting Started

### Frontend Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd aahatimesheet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
```

4. Start the server:
```bash
npm start
```

The backend API will be available at `http://localhost:5000`

## Project Structure

```
aahatimesheet/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── lib/               # Utility functions
│   └── mocks/             # Testing mocks
├── server/                # Backend source code
│   ├── config/           # Server configuration
│   ├── models/           # MongoDB models
│   └── tests/            # Backend tests
└── public/               # Static assets
```

## Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd server
npm test
```

## CI/CD

The project uses Jenkins for continuous integration and deployment. See `Jenkinsfile` for the pipeline configuration.

## Environment Variables

### Frontend (.env)
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_API_URL`: Backend API URL

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `PORT`: Server port number

## Available Scripts

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm test`: Run tests

### Backend
- `npm start`: Start the server
- `npm test`: Run backend tests
- `npm run dev`: Start server with nodemon

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
