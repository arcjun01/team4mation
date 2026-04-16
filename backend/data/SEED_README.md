# Database Seeding Guide

## Overview

The `seed.js` file populates the database with test data for three distinct survey configurations. Each configuration demonstrates different team-formation constraints.

## Survey Configurations

### Survey 1: Female-Only Class
- **ID**: `SURVEY-FEMALE-ONLY-001`
- **Course**: Advanced Algorithms
- **Class Size**: 1
- **Constraint**: Only 1 female student
- **Purpose**: Test edge case with minimal class size

### Survey 2: Maximum Group Size Constraint
- **ID**: `SURVEY-MAX-GROUP-4-001`
- **Course**: Web Development
- **Class Size**: 23 students
- **Team Limit**: 4 (maximum group size)
- **Limit Type**: `max`
- **Student Breakdown**: 
  - 8 Males (GPA range: 1.8 - 4.0)
  - 13 Females (GPA range: 1.6 - 3.9)
  - 2 Other (GPA range: 2.8 - 4.0)
- **Purpose**: Test team formation with max group size constraint, ensuring groups don't exceed 4 members

### Survey 3: Minimum Group Size Constraint
- **ID**: `SURVEY-MIN-GROUP-2-001`
- **Course**: Data Structures
- **Class Size**: 19 students
- **Team Limit**: 2 (minimum group size)
- **Limit Type**: `min`
- **Student Breakdown**:
  - 9 Males (GPA range: 1.8 - 4.0)
  - 9 Females (GPA range: 1.6 - 4.0)
  - 1 Other (GPA: 2.8)
- **Purpose**: Test team formation with min group size constraint, ensuring groups have at least 2 members

## Setup Instructions

### 1. Create .env File

Copy `.env.example` to `.env` and configure your database connection:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=team4mation
DB_PORT=3306
```

### 2. Run Migrations

First, ensure the database tables are created:

```bash
npm run migrate:up
```

This will create:
- `students` table
- `availability` table
- `survey_configurations` table
- `student_survey_entries` table

### 3. Seed the Database

Run the seed script to populate test data:

```bash
npm run seed
```

**Expected Output**:
```
🌱 Starting database seed...

📝 Creating Survey Configuration 1: SURVEY-FEMALE-ONLY-001
✓ Survey configuration 1 created
✓ 1 female student added to survey 1

📝 Creating Survey Configuration 2: SURVEY-MAX-GROUP-4-001
✓ Survey configuration 2 created
✓ 23 students added to survey 2

📝 Creating Survey Configuration 3: SURVEY-MIN-GROUP-2-001
✓ Survey configuration 3 created
✓ 19 students added to survey 3

✅ Database seeding completed successfully!

📊 Summary:
   - Survey 1 (Female Only): 1 student
   - Survey 2 (Max Group 4): 23 students
   - Survey 3 (Min Group 2): 19 students
   - Total: 43 students seeded
```

## Database Structure

### survey_configurations Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) | Unique survey identifier (PRIMARY KEY) |
| `course_name` | VARCHAR(255) | Name of the course |
| `class_size` | INT | Total number of students in the class |
| `team_limit` | INT | Either min or max group size |
| `limit_type` | VARCHAR(20) | Either 'min' or 'max' |
| `use_gpa` | BOOLEAN | Whether to consider GPA in team formation |
| `prev_course` | VARCHAR(255) | Previous course (nullable) |
| `encryption_salt` | VARCHAR(255) | Salt for encryption (nullable) |
| `status` | VARCHAR(20) | Survey status (default: 'open') |
| `created_at` | TIMESTAMP | Creation timestamp |

### student_survey_entries Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-increment primary key |
| `encrypted_name` | VARCHAR(255) | Encrypted student name |
| `iv` | VARCHAR(255) | Initialization vector for encryption |
| `gender` | VARCHAR(50) | Student gender ('Male', 'Female', 'Other') |
| `gpa` | DOUBLE | Student GPA |
| `survey_id` | VARCHAR(255) | Foreign key to survey_configurations |
| `created_at` | TIMESTAMP | Creation timestamp |

## Verification in MySQL Workbench

### View Survey Configurations:
```sql
SELECT * FROM survey_configurations;
```

### View Students by Survey:
```sql
SELECT * FROM student_survey_entries WHERE survey_id = 'SURVEY-MAX-GROUP-4-001';
```

### Count Students by Survey:
```sql
SELECT survey_id, COUNT(*) as student_count, gender, COUNT(*) as gender_count
FROM student_survey_entries
GROUP BY survey_id, gender;
```

### Check Survey Details:
```sql
SELECT 
  id, 
  course_name, 
  class_size, 
  team_limit, 
  limit_type,
  (SELECT COUNT(*) FROM student_survey_entries WHERE survey_id = survey_configurations.id) as actual_students
FROM survey_configurations;
```

## Resetting the Database

To clear all data and start fresh:

```bash
npm run migrate:down
npm run migrate:up
npm run seed
```

## Notes

- All student names are encrypted placeholders (e.g., `encrypted_f1`, `encrypted_m1`)
- GPA values are varied to simulate realistic student data
- Gender distribution is intentionally varied to test grouping algorithms
- Each survey is independent and can be tested in isolation
