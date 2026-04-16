# Team4mation Development & Deployment Guide

Complete guide for developers and DevOps team on running and maintaining Team4mation.


## Development Setup

### Initial Clone & Setup

```bash
# Clone repository
git clone https://github.com/arcjun01/team4mation.git
cd team4mation

# Backend setup
cd backend
cp .env.example .env
npm install

# Frontend setup
cd ../frontend
npm install

# Return to root
cd ..
```

### Development Dependencies Verification

```bash
# Backend
cd backend
npm list --depth=0

# Frontend
cd ../frontend
npm list --depth=0
```

Expected packages:
- **Backend**: express, mysql2, cors, dotenv, nodemon, jest
- **Frontend**: react, react-dom, react-router-dom, vite

---

## Running Locally

### Prerequisites

- ✓ Node.js v16+ installed
- ✓ MySQL running and accessible
- ✓ `.env` configured with database credentials
- ✓ Ports 3001 and 5173 available

### Step-by-Step Startup

#### Step 1: Database Setup

```bash
cd backend

# Run migrations to create tables
node migrate.js up

# (Optional) Seed test data
npm run seed
```

#### Step 2: Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
```

#### Step 3: Start Frontend Development Server

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
➜  press h to show help
```

#### Step 4: Open Application

Open browser: **http://localhost:5173**

### Shutdown

- Backend: `Ctrl+C` in Terminal 1
- Frontend: `Ctrl+C` in Terminal 2

---

## Testing

### Running Tests

#### Backend Tests

```bash
cd backend

# Run all tests
npm test
```

#### Frontend Tests (if implemented)

```bash
cd frontend


# No frontend tests currently implemented
# Framework ready: Jest/React Testing Library
```

### Test Structure

```
backend/
└── tests/
    └── Grouper.test.js    # Team grouping algorithm tests
```

## Code Structure & Standards

### Backend Structure

```
backend/
├── server.js                 # Express app & routes setup
├── db.js                     # Database connection pool
├── migrate.js                # Migration runner
├── package.json              # Dependencies & scripts
├── routes/
│   ├── config.js            # Survey configuration endpoints
│   ├── survey.js            # Survey submission endpoints
│   ├── teams.js             # Team endpoints
│   └── grouper.js           # Team grouping algorithm
├── data/
│   ├── seed.js              # Database seeding
│   ├── students.js          # Student test data
│   └── availibility.js      # Availability test data
├── migrations/
│   └── 001_create_students_table.js
└── tests/
    └── Grouper.test.js
```

### Frontend Structure

```
frontend/src/
├── main.jsx                 # React entry point
├── App.jsx                  # Root component & routing
├── StudentSurvey.jsx        # Student survey page
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── LandingPage.jsx
│   ├── LinkGeneration.jsx
│   ├── InstructorTeamSetup.jsx
│   ├── InstructorDecryption.jsx
│   ├── SurveySubmissions.jsx
│   ├── ViewSurveys.jsx
│   ├── FormingGroups.jsx
│   ├── ConfirmationModal.jsx
│   ├── PurgeModal.jsx
│   └── studentSurvey/      # Student survey sub-components
│       ├── FullNameQuestion.jsx
│       ├── GenderQuestion.jsx
│       ├── GpaQuestion.jsx
│       ├── CommitmentQuestion.jsx
│       └── AvailabilityQuestion.jsx
└── css/                     # Component styles

**Last Updated**: 2026-03-23
**Maintainers**: Brady, Beza, Juno, Liza
