# ChronoMap

ChronoMap is a location tracking application that allows users to track their movements with different visual themes inspired by popular video games.

## Features

- **Real-time Location Tracking**: Track your position using the browser's Geolocation API
- **Multiple Visual Themes**: Choose between GTA V, Red Dead Redemption 2, Red Dead Redemption, and Cyberpunk 2077 themes
- **Timeline History**: View your location history with filtering options (Today/Yesterday/This Week)
- **Pin Notes**: Add notes to specific locations on the map
- **User Authentication**: Simple username-based authentication system

## Tech Stack

### Frontend
- React.js
- Leaflet.js for map rendering
- React-Leaflet for React bindings
- TailwindCSS for styling
- Axios for API calls
- Browser Geolocation API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB installed locally or a MongoDB Atlas account

### Quick Setup (Both Client & Server)
1. Install dependencies for both client and server:
   ```
   cd server && npm install && cd ../client && npm install && cd ..
   ```
2. Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chronomap
   JWT_SECRET=your_secret_key
   ```
3. Start both applications with a single command:
   ```
   npm start
   ```
   
   OR using the batch file (Windows):
   ```
   start.bat
   ```

### Manual Setup (Separate Client & Server)

#### Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the environment variables
4. Start the server: `npm run dev`

#### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Register/Login with a username
2. Allow location access when prompted
3. Your current location will be tracked and displayed on the map
4. Use the theme switcher to change the visual style
5. Click on the map to add notes/pins
6. Use the timeline filter to view your location history for different time periods 