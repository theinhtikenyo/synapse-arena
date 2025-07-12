import 'dotenv/config';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Log to check if the environment variable is loaded at all
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.log('Firebase service account key FOUND.');
  } else {
    console.error('Firebase service account key NOT FOUND in environment variables.');
  }

  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export default admin;
