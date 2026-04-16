# Team4mation - Complete Setup & Access Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Dependencies & Installation](#dependencies--installation)
- [Database Configuration](#database-configuration)
- [Running the Project](#running-the-project)
- [API Endpoints Overview](#api-endpoints-overview)
- [Project Structure](#project-structure)
- [Database Migrations](#database-migrations)
- [Data Seeding](#data-seeding)
---

## Project Overview

**Team4mation** is a free team formation tool designed for instructors and students. The system helps instructors create fair and balanced student teams based on:
- GPA
- Schedule availability
- Skills and experience
- Commitment level

Students complete a short survey, and the system automatically forms teams that work well together. Team4mation is inspired by CATME but focuses on being **simple, accessible, and free** for educational purposes.

### Team Members
- Brady
- Beza
- Juno
- Liza

---

## Prerequisites

Before setting up Team4mation, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MySQL** (v5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use a managed MySQL service (e.g., MySQL Workbench, XAMPP, or cloud-based solutions)
   - Verify installation: `mysql --version`

3. **MySQL Client** (for running migrations)
   - Usually installed with MySQL Server
   - Or use MySQL Workbench GUI

### System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 2GB
- **Disk Space**: At least 500MB for node_modules
- **Port Availability**: 
  - Port 3001 (Backend API)
  - Port 5173 (Frontend Vite development server)
  - Port 3306 (MySQL)

---

## Environment Setup

### Step 1: Clone or Navigate to Project

```bash
cd c:\Users\lizaK\College\capstone\team4mation
```

### Step 2: Set Up Backend Environment Variables

Navigate to the backend directory and create a `.env` file:

```bash
cd backend
```

Copy the example environment file:

```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

Edit the `.env` file with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost          # MySQL server hostname
DB_USER=root              # MySQL username
DB_PASSWORD=              # MySQL password (empty if none)
DB_NAME=team4mation       # Database name to create
DB_PORT=3306              # Default MySQL port
```

**Example with credentials:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mypassword123
DB_NAME=team4mation
DB_PORT=3306
```

### Step 3: Verify MySQL Connection

Test your MySQL connection before proceeding:

```bash
# Windows with MySQL installed
mysql -h localhost -u root -p -e "SELECT 1;"

# Enter your password when prompted
```

---

## Dependencies & Installation

### Backend Dependencies

The backend uses the following packages:
- **express** (v5.2.1) - Web framework
- **mysql2** (v3.18.2) - MySQL database driver
- **cors** (v2.8.6) - Cross-Origin Resource Sharing
- **dotenv** (v17.2.3) - Environment variable management
- **nodemon** (v3.1.11) - Auto-reload development server
- **jest** (v30.2.0) - Testing framework

### Frontend Dependencies

The frontend uses the following packages:
- **react** (v19.2.0) - UI library
- **react-dom** (v19.2.0) - React DOM rendering
- **react-router-dom** (v7.13.0) - Client-side routing
- **vite** (v7.2.4) - Build tool and dev server

### Installation Steps

1. **Install Backend Dependencies**

```bash
cd backend
npm install
```

Expected output: `added XX packages`

2. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

Expected output: `added XX packages`

3. **Verify Installation**

```bash
# Go back to backend directory
cd ../backend

# Check for package installation
npm list

# Go to frontend
cd ../frontend
npm list
```

---

## Database Configuration

### Database Creation

MySQL will automatically create the database when you run migrations. However, you can manually create it:

```bash
mysql -h localhost -u root -p -e "CREATE DATABASE IF NOT EXISTS team4mation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Database Tables

The following tables are created during migration:

1. **survey_configurations** - Survey setup metadata
2. **student_survey_entries** - Student survey responses
3. **students** - Student information

See [Database Migrations](#database-migrations) for details.

---

## Running the Project

### Prerequisites Check

Before running, ensure:
- ✓ Node.js installed
- ✓ MySQL running
- ✓ `.env` file configured in `/backend`
- ✓ Dependencies installed (`npm install` ran in both directories)

### Option 1: Run Both Backend and Frontend in Separate Terminals

**Terminal 1 - Backend Server:**

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
```

**Terminal 2 - Frontend Development Server:**

```bash
cd frontend
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Option 2: Run in Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend Build & Preview:**
```bash
cd frontend
npm run build
npm run preview
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/*
- **Database**: localhost:3306 (MySQL)

---

## API Endpoints Overview

### Core API Routes

All API endpoints are prefixed with `/api/`

#### Survey Endpoints (`/api/survey`)
- `POST /api/survey/submit` - Submit student survey responses
- `GET /api/survey/stats/:surveyId` - Get survey statistics

#### Teams Endpoints (`/api/teams`)
- `GET /api/teams/:surveyId` - Get formed teams for a survey
- `POST /api/teams/generate` - Generate teams based on survey data

#### Configuration Endpoints (`/api/config`)
- `POST /api/config/save-setup` - Save survey configuration
- `GET /api/config/:surveyId` - Get survey configuration

#### Survey Management (`/api/surveys`)
- Various endpoints for survey management

### Example Requests

```bash
# Get survey statistics
curl http://localhost:3001/api/survey/stats/SURVEY-FEMALE-ONLY-001

# Save configuration
curl -X POST http://localhost:3001/api/config/save-setup \
  -H "Content-Type: application/json" \
  -d '{
    "uniqueId": "SURVEY-001",
    "courseName": "Web Development",
    "classSize": 30,
    "teamLimit": 4,
    "limitType": "Maximum"
  }'
```

---

## Project Structure

```
team4mation/
├── backend/                          # Node.js/Express server
│   ├── .env.example                 # Environment variable template
│   ├── .env                          # Environment variables (DO NOT COMMIT)
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Express server entry point
│   ├── db.js                        # MySQL connection pool
│   ├── migrate.js                   # Database migration runner
│   │
│   ├── routes/                      # API route handlers
│   │   ├── config.js               # Configuration endpoints
│   │   ├── survey.js               # Survey endpoints
│   │   ├── teams.js                # Team generation endpoints
│   │   └── grouper.js              # Grouping algorithm
│   │
│   ├── migrations/                 # Database migration files
│   │   └── 001_create_students_table.js
│   │
│   ├── data/                        # Database seed data
│   │   ├── seed.js                 # Seed data script
│   │   ├── students.js             # Student test data
│   │   ├── availibility.js         # Availability test data
│   │   └── SEED_README.md          # Seeding documentation
│   │
│   └── tests/                       # Test files
│       └── Grouper.test.js         # Team grouping tests
│
├── frontend/                        # React/Vite application
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # HTML entry point
│   │
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Main app component
│       ├── StudentSurvey.jsx       # Student survey page
│       │
│       ├── components/             # Reusable components
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── LandingPage.jsx
│       │   ├── LinkGeneration.jsx           # Survey link generation
│       │   ├── InstructorTeamSetup.jsx      # Instructor setup
│       │   ├── InstructorDecryption.jsx     # Team decryption
│       │   ├── FormingGroups.jsx
│       │   ├── SurveySubmissions.jsx        # View submissions
│       │   ├── ViewSurveys.jsx
│       │   ├── ConfirmationModal.jsx
│       │   ├── PurgeModal.jsx
│       │   └── studentSurvey/             # Student survey components
│       │       ├── FullNameQuestion.jsx
│       │       ├── GenderQuestion.jsx
│       │       ├── GpaQuestion.jsx
│       │       ├── CommitmentQuestion.jsx
│       │       └── AvailabilityQuestion.jsx
│       │
│       └── css/                    # Component styles
│           ├── App.css
│           ├── studentSurvey.css
│           ├── LandingPage.css
│           └── [other component styles]

└── README.md                        # This file
```

---

## Database Migrations

### Running Migrations

Migrations create and manage database schema changes.

#### Create Database Tables (First Time Setup)

```bash
cd backend
node migrate.js up
```

Expected output:
```
Running up for 001_create_students_table.js...
✓ All migrations up completed
```

#### Reverse Migrations (Development)

To drop tables and start fresh:

```bash
cd backend
node migrate.js down
```

⚠️ **Warning**: This will delete all data in the database!

### Available npm Scripts

In the backend directory:

```bash
npm run migrate:up      # Run migrations
npm run migrate:down    # Reverse migrations
npm run seed           # Populate with test data
npm run dev            # Run development server
npm run start          # Run production server
npm test               # Run tests
```

---

## Data Seeding

### Purpose

The seed script populates the database with test data for development and testing. It creates three survey configurations with realistic student data.

### Survey Configurations

#### Survey 1: Female-Only Class
- **ID**: `SURVEY-FEMALE-ONLY-001`
- **Course**: Advanced Algorithms
- **Class Size**: 1 student
- **Purpose**: Edge case testing

#### Survey 2: Maximum Group Size (4 students)
- **ID**: `SURVEY-MAX-GROUP-4-001`
- **Course**: Web Development
- **Class Size**: 23 students
- **Team Limit**: 4 (maximum group size)
- **Student Breakdown**: 8 Males, 13 Females, 2 Other
- **Purpose**: Test max group size constraints

#### Survey 3: Minimum Group Size (2 students)
- **ID**: `SURVEY-MIN-GROUP-2-001`
- **Course**: Data Structures
- **Class Size**: 19 students
- **Team Limit**: 2 (minimum group size)
- **Student Breakdown**: 9 Males, 9 Females, 1 Other
- **Purpose**: Test min group size constraints

### Running the Seed Script

```bash
cd backend

# First, create the database tables
node migrate.js up

# Then, populate with test data
npm run seed
```

Expected output:
```
✓ Seeded survey configurations
✓ Database populated with test data
```

### Resetting Seed Data

```bash
# Drop and recreate database
node migrate.js down
node migrate.js up

# Reseed data
npm run seed
```

---

## Configuration Files

### Backend Configuration (`.env`)

```env
# Database Configuration
DB_HOST=localhost              # MySQL server hostname/IP
DB_USER=root                   # MySQL username
DB_PASSWORD=                   # MySQL password (leave empty if none)
DB_NAME=team4mation            # Database name to create
DB_PORT=3306                   # MySQL port (default: 3306)
```

### Frontend Configuration (`vite.config.js`)

- **Base URL**: `/team4mation` (for GitHub Pages deployment)
- **Dev Server Port**: 5173
- **Backend API**: Configured to proxy to `http://localhost:3001`

### Express Server Configuration (`server.js`)

- **Port**: 3001
- **CORS**: Enabled for all origins
- **Middleware**: JSON body parsing, CORS headers

---

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Available Tests

- **Grouper.test.js** - Team grouping algorithm tests

---

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `/backend/routes`, `/backend/data`, etc.
   - `nodemon` will auto-reload the server
   - Test in postman or browser: `http://localhost:3001/api/...`

2. **Frontend Changes**
   - Edit files in `/frontend/src`
   - Vite will hot-reload the page automatically
   - Check browser console for errors

3. **Database Changes**
   - Create new migration file in `/backend/migrations/`
   - Follow naming: `002_description.js`
   - Run: `node migrate.js up`

### Git Workflow

Before committing, ensure:
```bash
# .gitignore should include:
node_modules/
.env
.DS_Store
dist/
```

---

## Deployment

### Building for Production

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

**Backend**:
```bash
cd backend
npm start
```

### Environment Variables for Production

Update `.env` with production database credentials:
```env
DB_HOST=your-production-db.hostname
DB_USER=production_user
DB_PASSWORD=secure_password_here
DB_NAME=team4mation_prod
DB_PORT=3306
```

---