# Frontend - Zero Waste & Community Hygiene Platform

React + Vite + Tailwind CSS frontend application for the Zero Waste Food Redistribution and Community Hygiene platform.

## Features (Phase 1)
- React 18 with Vite fast HMR
- Tailwind CSS v3 styling setup
- Configured Axios instance with baseURL and error interceptors (`src/services/api.js`)
- Reusable `MainLayout` with header and footer
- Phase 1 validation `Home.jsx` page displaying real-time Express & MongoDB Atlas connection status

---

## Directory Structure
```
frontend/
├── src/
│   ├── assets/              # Static images/icons placeholder
│   ├── components/
│   │   └── common/          # Reusable UI components placeholder (.gitkeep)
│   ├── layouts/
│   │   └── MainLayout.jsx   # Layout wrapper with header/footer
│   ├── pages/
│   │   └── Home.jsx         # Validation screen checking /api/health
│   ├── services/
│   │   └── api.js           # Configured Axios instance
│   ├── App.jsx              # App component root
│   ├── main.jsx             # React DOM root entry
│   └── index.css            # Tailwind directives & base styles
├── .env.example             # Example environment variables
├── .gitignore
├── index.html               # Main HTML entry
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Environment Configuration

1. In the `frontend/` directory, create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Specify your backend API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

---

## Installation & Running

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The application will be accessible at: `http://localhost:5173`

---

## Phase 1 Validation
When you open `http://localhost:5173`:
- If backend and MongoDB Atlas are running and connected, the badge will show **"Connected"** (in green).
- If backend is stopped or DB URI is invalid, the badge will show **"Disconnected"** (in red) with diagnostic details.
