import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin (should be done once in server.js, but we'll check here)
let firebaseAdminInitialized = false;

const initializeFirebaseAdmin = () => {
  if (firebaseAdminInitialized) return;

  try {
    console.log('Initializing Firebase Admin...');
    // For deployment (Render/Vercel), prioritize environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.log('Using FIREBASE_SERVICE_ACCOUNT_KEY from environment');
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        // Try to get existing app, if it fails, initialize new one
        try {
          admin.app();
          console.log('Firebase Admin app already exists');
        } catch (e) {
          console.log('Initializing new Firebase Admin app');
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }
        firebaseAdminInitialized = true;
        console.log('Firebase Admin initialized from environment variable (deployment mode)');
        return;
      } catch (parseError) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
        throw parseError;
      }
    }

    // Fallback to file-based loading for local development
    console.log('Falling back to file-based loading');
    const serviceAccountPath = join(__dirname, '../../serviceAccountKey.json');
    const serviceAccountBuffer = readFileSync(serviceAccountPath);
    const serviceAccount = JSON.parse(serviceAccountBuffer.toString());

    // Try to get existing app, if it fails, initialize new one
    try {
      admin.app();
      console.log('Firebase Admin app already exists');
    } catch (e) {
      console.log('Initializing new Firebase Admin app');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firebaseAdminInitialized = true;
    console.log('Firebase Admin initialized from serviceAccountKey.json (local development)');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    console.error('Error details:', error);
  }
};

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    console.log('Starting Firebase token verification...');
    initializeFirebaseAdmin();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No token provided or invalid format');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received, length:', token.length);

    // Check if Firebase app is initialized
    try {
      admin.app();
    } catch (e) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ message: 'Firebase Admin not initialized' });
    }

    const auth = getAuth();
    console.log('Verifying token with Firebase...');
    const decoded = await auth.verifyIdToken(token);
    console.log('Token verified successfully for user:', decoded.email);

    // Attach Firebase user data to request
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error.message);
    console.error('Error code:', error.code);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export const verifyFirebaseAndLinkUser = async (req, res, next) => {
  try {
    await verifyFirebaseToken(req, res, () => {});

    const { email, uid, name, picture } = req.firebaseUser;

    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({ 
        message: 'Account not approved. Please contact your administrator.' 
      });
    }

    // Check if user is approved
    if (!user.isApproved) {
      return res.status(403).json({ 
        message: 'Your account is pending approval. Please contact your administrator.' 
      });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({ 
        message: 'Your account has been deactivated. Please contact your administrator.' 
      });
    }

    // Link Firebase UID if not already linked
    if (!user.firebaseUid) {
      user.firebaseUid = uid;
      user.provider = req.body.provider || 'google';
      if (picture) {
        user.photo = picture;
      }
      if (name && !user.name) {
        user.name = name;
      }
      await user.save();
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Firebase user linking error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};
