# Backend - Zero Waste & Community Hygiene Platform

Express.js REST API with MongoDB Atlas (via Mongoose) for the Zero Waste Food Redistribution and Community Hygiene platform.

## Features (Phase 1)
- ES Modules (`import`/`export`) architecture
- Centralized MongoDB Atlas connection with timeout & retry handling
- Clean modular directory structure (`config`, `controllers`, `models`, `routes`, `middlewares`)
- Centralized error handling
- CORS support for frontend dev server (`http://localhost:5173`)
- Health check endpoint (`GET /api/health`) verifying server & database status

---

## Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js            # MongoDB Atlas connection logic using Mongoose
│   ├── controllers/         # Empty placeholder for business logic (Phase 2+)
│   ├── models/              # Empty placeholder for Mongoose schemas (Phase 2+)
│   ├── routes/
│   │   └── health.routes.js # GET /api/health verification endpoint
│   ├── middlewares/
│   │   └── errorHandler.js  # Centralized error handler
│   ├── app.js               # Express app configuration & middleware
│   └── server.js            # Entry point, connects DB & boots server
├── .env.example             # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites
- Node.js (v18.x or higher recommended)
- MongoDB Atlas account and provisioned cluster

---

## Environment Configuration

1. In the `backend/` directory, create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your connection variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/zero_waste_db?retryWrites=true&w=majority
   CLIENT_URL=http://localhost:5173
   ```

### How to obtain `MONGO_URI` from MongoDB Atlas:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to **Database** (under Deployment in left sidebar).
3. Click the **Connect** button on your cluster.
4. Select **Drivers** (under "Connect your application").
5. Select Driver: `Node.js` and latest version.
6. Copy the connection string provided, for example:
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
7. Replace `<username>` and `<password>` with your database user credentials.
8. (Optional) Append the database name before the query string:
   `mongodb+srv://admin:mySecretPass123@cluster0.abcde.mongodb.net/zero_waste_db?retryWrites=true&w=majority`
9. Make sure your IP address is whitelisted under **Network Access** (or add `0.0.0.0/0` for development).

---

## Installation & Running

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run in development mode (with nodemon auto-restart)
npm run dev

# Run in production mode
npm start
```

---

## Verification
Once started, visit:
- `http://localhost:5000/api/health`

Expected response:
```json
{
  "status": "ok",
  "db": "connected",
  "message": "Zero Waste Platform API is operational",
  "timestamp": "2026-09-18T09:00:00.000Z"
}
```
