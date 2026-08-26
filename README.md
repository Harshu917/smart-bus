# 🚍 Smart Bus Real-Time Tracking & Fleet Management System

A modern, full-stack real-time transit tracking and fleet operations platform built with **React (Tailwind CSS v4)**, **Node.js (Express + Socket.io)**, and **Leaflet Map Radar**.

---

## 📁 Project Architecture & Folder Structure

The project is structured with complete separation of client and server:

```
smart-bus/
├── backend/                        # Node.js + Express + Socket.io Backend
│   ├── .env                        # Environment configuration
│   ├── .env.example                # Environment template
│   ├── package.json                # Backend dependencies & scripts
│   ├── server.js                   # Server entrypoint with Socket.io & REST
│   └── src/
│       ├── config/
│       │   ├── env.js              # Environment variable loader
│       │   └── transitData.js      # In-memory transit data state (buses, routes, tickets)
│       ├── controllers/            # Controller handlers for all entities
│       │   ├── alertController.js
│       │   ├── analyticsController.js
│       │   ├── busController.js
│       │   ├── driverController.js
│       │   ├── routeController.js
│       │   ├── stopController.js
│       │   └── ticketController.js
│       ├── routes/                 # Express REST route modules
│       │   ├── alertRoutes.js
│       │   ├── analyticsRoutes.js
│       │   ├── busRoutes.js
│       │   ├── driverRoutes.js
│       │   ├── routeRoutes.js
│       │   ├── stopRoutes.js
│       │   └── ticketRoutes.js
│       └── services/
│           ├── gpsSimulator.js     # Autonomous GPS telemetry engine (2s broadcast)
│           └── socketService.js    # Bi-directional WebSocket event handlers
│
├── frontend/                       # React 19 + Tailwind CSS v4 Frontend
│   ├── .env                        # Frontend environment variables
│   ├── .env.example                # Frontend template
│   ├── index.html                  # HTML template with Google Fonts
│   ├── package.json                # Frontend dependencies & scripts
│   ├── vite.config.js              # Vite config with Tailwind v4 & API proxy
│   └── src/
│       ├── App.jsx                 # Main application layout & portal switcher
│       ├── main.jsx                # React DOM root
│       ├── index.css               # Tailwind v4 import & Glassmorphic dark theme
│       ├── context/
│       │   └── TransitContext.jsx  # Global state manager for WebSocket & REST
│       ├── services/
│       │   ├── api.js              # REST API client
│       │   └── socket.js           # Socket.io client
│       └── components/
│           ├── Navbar.jsx          # Top navigation with portal switcher
│           ├── Map/
│           │   └── LiveTransitMap.jsx      # Leaflet radar map with animated buses
│           ├── Passenger/
│           │   ├── BusScheduleList.jsx     # Live bus search, ETAs & details
│           │   ├── TicketBookingModal.jsx  # Seat picker & confetti booking
│           │   └── DigitalTicketCard.jsx   # Scannable QR transit boarding pass
│           ├── Driver/
│           │   └── DriverConsole.jsx       # Telemetry HUD, speed & passenger controls
│           ├── Admin/
│           │   ├── AdminDashboard.jsx      # Fleet management grid & controls
│           │   ├── AlertBroadcaster.jsx    # Live transit emergency alerts
│           │   └── AnalyticsCharts.jsx     # Commuter traffic & fuel charts
│           └── Common/
│               ├── LiveAlertBanner.jsx     # Real-time scrolling broadcast bar
│               └── StatCard.jsx            # KPI metric cards
│
├── start-all.bat                   # 1-Click launcher for both Backend and Frontend
├── start-backend.bat               # 1-Click backend launcher
├── start-frontend.bat              # 1-Click frontend launcher
├── run-dev-backend.cmd             # CMD launcher for backend
├── run-dev-frontend.cmd            # CMD launcher for frontend
└── README.md                       # Project documentation & startup guide
```

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
SIMULATION_INTERVAL_MS=2000
JWT_SECRET=smart_bus_transit_secret_key_2026
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 How to Run the Application on Your Laptop

You have two convenient ways to run the project:

### Option A: 1-Click Start (Recommended for Windows)
Simply double-click the batch file in the root folder:
- **`start-all.bat`** &rarr; Automatically launches both the **Node.js Backend** and **React Frontend** in separate terminal windows!
- Then open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

### Option B: Running via Terminal / VS Code

#### Step 1: Start the Backend Server
Open a terminal in the `backend` folder:
```powershell
cd backend
npm run dev
```
> The backend server starts at **`http://localhost:5000`** with real-time GPS simulation and Socket.io active.

#### Step 2: Start the React Frontend
Open a second terminal in the `frontend` folder:
```powershell
cd frontend
npm run dev
```
> The frontend will start at **`http://localhost:5173`**.

---

## 🌟 Key Application Features

1. **🗺️ Interactive Real-time GPS Radar Map**:
   - Live Leaflet map with dark theme styling.
   - Smooth animated bus markers updating every 2 seconds.
   - Click any bus to view route polylines, upcoming stops, driver info, and instant ticket booking.

2. **🎫 Passenger Portal & Digital QR Ticketing**:
   - Live bus timetable with real-time delay tags, search, and route filter.
   - Interactive seat selection modal with animated confirmation and confetti effect.
   - Scannable digital QR boarding passes.

3. **🎛️ Driver Telemetry HUD Console**:
   - Live speed gauge & trip progress tracker.
   - Real-time passenger occupancy controls (`+1`, `-1`, `Reset`).
   - Stop-by-stop waypoint checklist.
   - Emergency alert broadcasting.

4. **📊 Fleet Admin Command Center**:
   - Fleet overview with status metrics (Active Buses, On-time Rate, Fuel Levels).
   - Real-time Alert Broadcaster for passenger notices.
   - Interactive visual analytics charts for commuter peak times and fleet performance.
