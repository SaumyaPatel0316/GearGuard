# Firebase Authentication Setup Guide

This guide explains how to set up Firebase authentication for GearGuard's admin login system.

## Overview

The authentication system uses Firebase for identity providers (Google, Microsoft, Email) with an invite-only model. Only users invited by an administrator can access the system.

## Backend Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
   - Enable Microsoft sign-in
   - Enable Email/Password (for email link)

### 2. Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll down to "Your apps" section
3. Add a web app
4. Copy the firebaseConfig object

### 3. Get Service Account Key

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file
4. Convert the JSON to a single-line string for the environment variable

### 4. Update Backend Environment Variables

Add to `backend/.env`:

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

## Frontend Setup

### 1. Update Frontend Environment Variables

Create or update `.env` in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Update Firebase Configuration

Edit `src/firebase/firebase.js` with your actual Firebase config values.

## Authentication Flow

### User Login Process

1. User clicks "Continue with Google/Microsoft" on login page
2. Firebase authenticates the user and returns user data
3. Frontend sends Firebase ID token to backend `/api/auth/firebase-login`
4. Backend verifies token with Firebase Admin SDK
5. Backend searches for user by email in MongoDB
6. If user exists and is approved:
   - Links Firebase UID to user account (if not already linked)
   - Returns JWT token and user data
7. If user doesn't exist or isn't approved:
   - Returns error message

### Admin User Management

Admins can:
- **Invite Users**: Create user accounts with email, name, role, and department
- **Assign Roles**: Change user roles (USER, TECHNICIAN, MANAGER, ADMIN)
- **Delete Users**: Remove user accounts
- **Toggle Status**: Activate/deactivate user accounts
- **View All Users**: See all users in the system

## User Model

The User model includes:
- `firebaseUid`: Firebase user ID (linked on first login)
- `provider`: Authentication provider (google, microsoft, email, local)
- `photo`: Profile photo URL
- `isApproved`: Whether user is approved by admin
- `role`: User role (USER, TECHNICIAN, MANAGER, ADMIN)
- `active`: Whether account is active

## Role-Based Access Control

- **ADMIN**: Full access to admin dashboard, can manage all users
- **MANAGER**: Access to reports and teams
- **TECHNICIAN**: Access to reports and teams
- **USER**: Basic dashboard access

## Creating the First Admin

Since the system is invite-only, you need to create the first admin user directly in MongoDB:

```javascript
// In MongoDB shell or using a script
db.users.insertOne({
  name: "Admin Name",
  email: "admin@example.com",
  role: "ADMIN",
  isApproved: true,
  active: true,
  passwordHash: "", // Not needed for Firebase auth
  createdAt: new Date()
})
```

Or use the backend API after setting up a temporary local auth endpoint.

## Security Notes

1. **Firebase Service Account Key**: Keep this secret. Never commit it to version control.
2. **Environment Variables**: Use `.env` files and add them to `.gitignore`.
3. **Invite-Only Model**: Only approved users can access the system.
4. **Role-Based Access**: All admin routes are protected with middleware.

## Testing

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Navigate to `/auth/login`
4. Try signing in with Google/Microsoft (you'll get "Account not approved" if not invited)
5. Create an admin user in MongoDB
6. Sign in with the admin email
7. Navigate to `/admin` to manage users

## Troubleshooting

### "Invalid or expired token"
- Check Firebase service account key is correct
- Ensure Firebase project is properly configured

### "Account not approved"
- User needs to be invited by admin first
- Check user exists in MongoDB with `isApproved: true`

### CORS errors
- Check backend CORS configuration includes your frontend URL
- Ensure environment variables are set correctly

## Files Created/Modified

### Backend
- `backend/models/User.js` - Added Firebase fields
- `backend/middleware/verifyFirebase.js` - Firebase token verification
- `backend/middleware/authorizeRole.js` - Role-based authorization
- `backend/routes/authRoutes.js` - Added Firebase login endpoint
- `backend/routes/adminRoutes.js` - Admin user management routes
- `backend/server.js` - Added admin routes
- `backend/.env.example` - Added Firebase configuration

### Frontend
- `src/firebase/firebase.js` - Firebase configuration and auth functions
- `src/context/AuthContext.jsx` - Authentication context
- `src/pages/auth/Login.jsx` - Updated with Firebase auth UI
- `src/components/ProtectedRoute.jsx` - Updated to use AuthContext
- `src/components/RoleProtectedRoute.jsx` - Updated to use AuthContext
- `src/pages/Admin.jsx` - Admin dashboard with user management
- `src/App.jsx` - Added AuthProvider and admin route
