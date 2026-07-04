# Deployment Guide - GearGuard

This guide covers deploying GearGuard to **Vercel** (frontend) and **Render** (backend).

## Prerequisites

- Firebase project configured with authentication providers
- MongoDB Atlas cluster
- Git repository with the code
- Accounts on Vercel and Render

## Backend Deployment (Render)

### 1. Prepare Environment Variables

Get the following values and convert them to single-line JSON strings:

#### Firebase Service Account Key
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file
4. Convert to single-line string (remove newlines, escape quotes)
5. Example: `{"type":"service_account","project_id":"gearguard-2026reserved",...}`

#### MongoDB URI
1. Go to MongoDB Atlas > Database > Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

#### JWT Secret
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Deploy to Render

1. **Create a new Web Service** on Render
2. **Connect your repository** (GitHub/GitLab/Bitbucket)
3. **Configure build settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   PORT=5000
   JWT_SECRET=<your-generated-secret>
   NODE_ENV=production
   JWT_EXPIRES_IN=7d
   FIREBASE_SERVICE_ACCOUNT_KEY=<single-line-json-string>
   ```

5. **Deploy** - Render will build and deploy your backend

6. **Note the backend URL** (e.g., `https://gearguard-backend.onrender.com`)

### 3. Update Frontend API URL

After backend deployment, update the frontend to use the production backend URL:
- In production, the frontend will need to call the Render backend directly
- Update API base URL in production builds

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables

Get Firebase config from Firebase Console > Project Settings > General > Your Apps:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=gearguard-2026reserved.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gearguard-2026reserved
VITE_FIREBASE_STORAGE_BUCKET=gearguard-2026reserved.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Deploy to Vercel

1. **Create a new project** on Vercel
2. **Import your repository**
3. **Configure build settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `/` (project root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables:**
   Add all the Firebase config variables from above

5. **Deploy** - Vercel will build and deploy your frontend

6. **Note the frontend URL** (e.g., `https://gear-guard.vercel.app`)

### 3. Update Backend CORS

Add your Vercel frontend URL to the backend CORS configuration in `backend/server.js`:

```javascript
const allowedOrigins = [
  'https://gear-guard.vercel.app', // Add your Vercel URL here
  // ... other origins
];
```

## Post-Deployment Steps

### 1. Seed Admin User

After backend deployment, seed the admin user:

```bash
# SSH into Render or use Render CLI
cd backend
npm run seed:admin
```

Or create an admin user via the API once the system is running.

### 2. Update Firebase Console

Add your deployed domains to Firebase Console:
1. Go to Firebase Console > Authentication > Sign-in method
2. Add authorized domains:
   - `gear-guard.vercel.app`
   - `gearguard-backend.onrender.com`

### 3. Test Authentication

1. Visit your Vercel frontend URL
2. Try Google sign-in with the admin email
3. Verify you can access the admin dashboard

## Environment Variables Summary

### Backend (Render)
- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Server port (Render sets this automatically)
- `JWT_SECRET` - Secure random string for JWT signing
- `NODE_ENV` - Set to `production`
- `JWT_EXPIRES_IN` - Token expiration time
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON (single-line)

### Frontend (Vercel)
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

## Troubleshooting

### Backend Issues

**Firebase initialization error:**
- Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is properly formatted as single-line JSON
- Check that the JSON is valid and not escaped incorrectly

**MongoDB connection error:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (allow Render's IP)
- Ensure database user has correct permissions

**CORS errors:**
- Verify frontend URL is in `allowedOrigins` in `backend/server.js`
- Check that environment variables are set correctly

### Frontend Issues

**Firebase config error:**
- Ensure all Firebase config variables are set in Vercel
- Verify variables start with `VITE_` prefix
- Check Firebase Console for correct values

**API connection error:**
- Update API base URL to point to Render backend
- Verify backend is running and accessible
- Check CORS configuration on backend

## Local Development

For local development, use the `.env` files:
- `backend/.env` for backend configuration
- `.env` in project root for frontend Firebase config
- `serviceAccountKey.json` in project root for Firebase Admin SDK

The system automatically detects environment and uses appropriate configuration method.
