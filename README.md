# Waste-Food-Management
### Zero Waste Food Redistribution & Community Hygiene Network

A production-ready full-stack web platform connecting food donors (restaurants, caterers, banquet halls, households) with verified NGOs and citizen volunteers for surplus food redistribution, while coordinating and tracking community hygiene initiatives (lake cleanups, sanitation campaigns, and waste segregation drives).

---

## 🌟 Key Features

### 1. 🍱 Surplus Food Redistribution
- **Real-Time Surplus Listings**: Donors can post surplus cooked meals, bakery products, raw produce, and packaged goods in seconds.
- **Smart Countdown & Expiry Tracking**: Dynamic timers calculate food freshness and safe consumption windows.
- **Dietary & Category Filtering**: Filter by cuisine, dietary tags (Vegetarian, Vegan, Non-Vegetarian, Halal), and radius/city.
- **Food Claim & Pickup Logistics**: NGOs and volunteers claim food batches, select transport vehicle types (van, auto, two-wheeler), set pickup ETAs, and specify destination shelters.
- **Multi-Stage Delivery Workflow**: Real-time status advancement (`Pending` ➔ `Accepted` ➔ `In Transit` ➔ `Delivered`).

### 2. 🧼 Community Hygiene & Cleanliness Drives
- **Event Organizing**: NGOs and community leaders can schedule neighborhood cleanups, lake plastic segregation drives, and sanitation campaigns.
- **Live Volunteer RSVP**: Interactive participant capacity meter (`X / Y spots filled`) with 1-click registration.
- **Safety & Equipment Checklists**: Details on provided protective gear (gloves, bio-degradable sacks, metal pickers, masks).

### 3. 📊 Role-Aware Dashboards & Analytics
- **Tailored Dashboards**: Custom interfaces for **Donors**, **Volunteers**, **NGOs**, and **Admins**.
- **Environmental Impact Simulator**: Interactive calculation of CO2 emissions averted, meals provided, and virtual water conserved based on surplus food kg.
- **Real-Time Impact Metrics**: Platform-wide statistics on total meals redistributed, waste diverted from landfills, and active partner organizations.

### 4. 🔑 1-Click Demo Persona Switcher
- Instant pre-configured demo logins for testing:
  - 🍱 **Demo Donor** (`donor@zerowaste.org` / `password123`)
  - 🤝 **Demo Volunteer** (`volunteer@zerowaste.org` / `password123`)
  - 🏢 **Demo NGO** (`ngo@zerowaste.org` / `password123`)
  - ⚡ **Demo Admin** (`admin@zerowaste.org` / `password123`)

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, React Hot Toast, Canvas Confetti.
- **Backend**: Node.js, Express.js (ES Modules), MongoDB Atlas, Mongoose ODM.
- **Authentication**: JWT (JSON Web Tokens), BCrypt.js password hashing, Role-Based Access Control (RBAC).

---

## 📁 Repository Structure

```
Waste-Food-Management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Atlas Mongoose connection & DNS fallback
│   │   ├── controllers/         # Auth, Food, Hygiene, Pickup, Stats controllers
│   │   ├── middlewares/         # JWT protect, Role authorize, Central error handler
│   │   ├── models/              # User, FoodListing, HygieneEvent, PickupRequest
│   │   ├── routes/              # Express API route declarations
│   │   ├── seeders/             # Database seeder with realistic test data
│   │   ├── utils/               # JWT token generator & response helpers
│   │   ├── app.js               # Express application middleware & route mounting
│   │   └── server.js            # Server boot & cluster listener
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (FoodCard, HygieneCard, Navbar, Footer, etc.)
│   │   ├── context/             # AuthContext & Demo Persona Switcher
│   │   ├── layouts/             # MainLayout wrapper
│   │   ├── pages/               # Home, FoodListings, HygieneEvents, Dashboard, Login, etc.
│   │   ├── services/            # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Application router
│   │   ├── index.css            # Custom design tokens & glassmorphism styling
│   │   └── main.jsx             # React DOM root entry
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)

---

### 1. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Add your MongoDB Atlas URI:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```
4. Seed demo data (Optional but recommended):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend runs on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Ensure it points to the Express API:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Frontend runs on `http://localhost:5173`.*

---

## 🧪 Production Build & Verification

```bash
# Verify frontend production build (0 errors)
cd frontend
npm run build
```

---

## 📜 License

This project is licensed under the MIT License - open source and community-driven.
