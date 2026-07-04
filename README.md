# 📱 GearGuard – Maintenance Management System  
### AstraCore | Odoo × Adani Hack Innovate 2026

GearGuard is a **smart Maintenance Management System** built on **Odoo**, designed to streamline equipment maintenance, reduce downtime, and improve operational efficiency.  
It provides end-to-end tracking of **equipment, maintenance teams, repair requests, schedules, analytics, and audits**.

---

## 🚀 Key Objectives

- Centralize all company equipment data
- Simplify corrective & preventive maintenance workflows
- Improve technician productivity using Kanban & Calendar views
- Enable data-driven decisions with reports & analytics
- Ensure compliance with scrap tracking & audit logs

---

## 🏠 1. Dashboard (Home Page)

### Purpose
High-level operational visibility for **Managers** and **Technicians**.

### Features
**📊 KPIs**
- Total Equipment
- Open Maintenance Requests
- Overdue Requests
- Preventive vs Corrective Ratio

**📈 Visual Charts**
- Requests per Team
- Requests per Department

**⏰ Today’s Scheduled Maintenance**
- Quick overview of today’s tasks

---

## 🛠️ 2. Equipment Management

### Purpose
Acts as a **central asset registry** for all company equipment.

### Pages
- Equipment List Page
- Equipment Detail Page

### Equipment List Features
- 🔍 Search by:
  - Equipment Name
  - Serial Number
- 🗂️ Filter / Group by:
  - Department
  - Employee
  - Location
  - Status (Active / Scrapped)
- ⚡ Quick View:
  - Assigned Maintenance Team
  - Warranty Status (Active / Expired)

### Equipment Detail Features
- Equipment Information:
  - Name & Serial Number
  - Purchase Date
  - Warranty Period
  - Location & Department
  - Assigned Employee
  - Ownership & Responsibility
- Maintenance Defaults:
  - Default Maintenance Team
  - Default Technician
- Status:
  - Active / Under Maintenance / Scrapped

### Smart Features
- 🔘 **Smart Button – “Maintenance”**
  - Opens all maintenance requests linked to the equipment
  - Badge shows number of open requests
- 📝 Auto-log note when equipment is scrapped

---

## 👷 3. Maintenance Team Management

### Purpose
Define **who fixes what**.

### Pages
- Team List Page
- Team Detail Page

### Features
- Team Name (e.g., Mechanics, Electricians, IT Support)
- Team Type / Specialty
- Team Lead (Optional)
- Team Members Management
- Optional Technician Skill Tags
- 📊 Workload Indicator (Open requests count)

### Workflow Rules
- Only assigned team members can:
  - View requests
  - Assign technicians
  - Work on maintenance requests

---

## 🧾 4. Maintenance Request (Core Module)

### Purpose
Manage the **complete repair lifecycle**.

### Pages
- Request List
- Request Form
- Request Detail View

### Request Creation
- Request Type:
  - Corrective (Breakdown)
  - Preventive (Routine)
- Subject / Problem Description
- Equipment Selection
- Scheduled Date
- Priority (Low / Medium / High)

### Auto-Fill Logic
When equipment is selected:
- Equipment Category
- Default Maintenance Team
- Default Technician

### Request States
- New
- In Progress
- Repaired
- Scrap

### Execution Flow
- Assign Technician
- Start Work → *Moves to In Progress*
- Log Work Duration (Hours)
- Add Completion Notes

---

## 🗂️ 5. Maintenance Kanban Board

### Purpose
Primary **day-to-day workspace for technicians**.

### Features
- Columns:
  - New | In Progress | Repaired | Scrap
- Drag & Drop between stages
- Card Displays:
  - Equipment Name
  - Subject
  - Assigned Technician (Avatar)
  - Due Date

### Visual Indicators
- 🔴 Red highlight for overdue requests
- ⏳ Countdown for scheduled jobs

### Filters
- My Requests
- Team Requests
- Overdue Only

---

## 📆 6. Maintenance Calendar View

### Purpose
Visual planning of **preventive maintenance**.

### Features
- Displays only Preventive Requests
- Color-coded by:
  - Maintenance Team
  - Equipment Category
- Click on date → Create maintenance request
- Drag & drop to reschedule
- Views:
  - Daily
  - Weekly
  - Monthly

---

## 📊 7. Reports & Analytics (Optional / Advanced)

### Purpose
Support **decision-making and optimization**.

### Reports
- Requests per Team
- Requests per Equipment Category
- Preventive vs Corrective Ratio
- Average Repair Time
- Equipment with Highest Failure Rate

### Visuals
- Pivot Tables
- Bar Charts
- Pie Charts

---

## 🔐 8. User & Role Management

### Purpose
Enforce **access control and workflow security**.

### Roles
- User
- Manager
- Technician

### Permissions
- Create maintenance requests
- Assign requests
- Scrap equipment
- View analytics & reports

---

## 🗑️ 9. Scrap & Audit Log

### Purpose
Ensure **compliance, traceability, and transparency**.

### Features
- List of scrapped equipment
- Scrap reason
- Linked maintenance request
- Timestamp & technician details
- Complete equipment history timeline

---

## 🧠 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** React.js, JavaScript
- **Database:** MongoDB (Local Database)
- **Authentication:** Firebase (Google, Microsoft, Email Link)

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Firebase account (for authentication)

### Step 1: Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### Step 2: Set Up Environment Variables

**Backend (backend/.env):**
```bash
# Copy the template
cp backend/.env.template backend/.env

# Edit backend/.env with your values:
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
JWT_EXPIRES_IN=7d
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

**Frontend (.env):**
```bash
# Copy the template
cp .env.template .env

# Edit .env with your Firebase config:
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Step 3: Set Up Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
   - Enable Microsoft sign-in
   - Enable Email/Password (for email link)
4. Get Firebase config from Project Settings > General > Your Apps
5. Get Service Account Key from Project Settings > Service Accounts > Generate New Private Key
6. Add these values to your environment files

### Step 4: Start MongoDB

**Using local MongoDB:**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Compass to connect
```

**Using MongoDB Atlas:**
```bash
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

### Step 5: Seed Admin User

```bash
cd backend
npm run seed:admin
```

This creates an admin user with email: `admin@gearguard.local`

### Step 6: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Step 7: Access the Application

1. Open http://localhost:5173 in your browser
2. Navigate to http://localhost:5173/auth/login
3. Sign in with Google/Microsoft using the admin email: `admin@gearguard.local`
4. Access admin dashboard at http://localhost:5173/admin

### Authentication Flow

The system uses an **invite-only model**:
- Only users invited by an administrator can access the system
- Admin can invite users via the Admin Dashboard
- Users sign in with Firebase (Google/Microsoft/Email)
- Backend verifies Firebase token and checks if user is approved

### Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env

**Firebase Authentication Error:**
- Verify Firebase config in .env files
- Check Firebase Console that authentication providers are enabled
- Ensure service account key is correctly formatted

**CORS Error:**
- Backend already allows localhost origins (3000, 5173, 5174, 8080)
- Check backend is running on correct port

**"Account not approved" Error:**
- User must be invited by admin first
- Use admin dashboard to invite users
- Or seed admin user with `npm run seed:admin`

---

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment Overview

**Backend (Render):**
- Deploy backend to Render.com
- Set environment variables: MongoDB URI, JWT Secret, Firebase Service Account Key
- Backend will run on port 5000 (Render sets this automatically)

**Frontend (Vercel):**
- Deploy frontend to Vercel
- Set environment variables: Firebase config (VITE_FIREBASE_*)
- Frontend will be served from Vercel CDN

**Required Environment Variables:**

Backend:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secure random string
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON (single-line)

Frontend:
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- Other Firebase config variables

---

## 🏆 Hackathon Context

This project is developed for **Adani Hack Innovate 2026** under the **AstraCore** theme, focusing on **industrial asset optimization, predictive maintenance readiness, and operational efficiency**.

---

## 👥 Team

Built with ❤️ by **AstraCore Team**  
For innovation, reliability, and smarter maintenance.

---

## 📄 License
This project is developed for academic & hackathon purposes.
