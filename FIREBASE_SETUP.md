# Firebase Authentication Setup Guide

This project now includes Firebase authentication. Follow these steps to set it up:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "eventify-app")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" from the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and add your project's support email
   - **Facebook**: Click, toggle "Enable", and add your App ID and App Secret from Facebook Developers

## 3. Create a Web App

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click the "</>" icon to add a web app
4. Register your app with a nickname (e.g., "eventify-web")
5. Copy the Firebase configuration object

## 4. Set up Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Replace the values with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 5. Set up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred location

## 6. Features Included

### Authentication Methods

- ✅ Email and Password registration/login
- ✅ Google Sign-in
- ✅ Facebook Sign-in (requires Facebook App setup)
- ✅ Password reset functionality
- ✅ User profile management

### Security Features

- ✅ Protected routes (require authentication)
- ✅ User data stored in Firestore
- ✅ Authentication state management
- ✅ Auto-redirect on login/logout

### Protected Pages

- Profile
- Create Event
- Interested Events
- Album

### Available Authentication Functions

```javascript
// Import from services/authService.js
import {
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  logOut,
  resetPassword,
  getUserData,
} from "./services/authService";

// Import authentication context
import { useAuth } from "./contexts/AuthContext";

// In your component
const { currentUser, userData, loading } = useAuth();
```

## 7. Development

After setting up the environment variables, you can start the development server:

```bash
npm run dev
```

The authentication system will be fully functional with:

- User registration and login forms
- Social authentication buttons
- Protected route navigation
- User profile management
- Automatic session management

## 8. Production Setup

For production deployment:

1. Set up Firebase hosting or your preferred hosting platform
2. Configure environment variables in your hosting platform
3. Update Firebase security rules for production
4. Set up proper domain authorization in Firebase Authentication settings

## Troubleshooting

### Common Issues

1. **"Firebase API key not found"**

   - Ensure `.env` file exists and variables are properly set
   - Restart development server after adding environment variables

2. **"Auth domain not authorized"**

   - Add your domain to authorized domains in Firebase Authentication settings

3. **"Google Sign-in not working"**

   - Ensure Google provider is enabled in Firebase Authentication
   - Check that you've added the support email in Google provider settings

4. **"Facebook Sign-in not working"**
   - Set up Facebook App in Facebook Developers Console
   - Add App ID and App Secret to Firebase Facebook provider
   - Configure redirect URLs in Facebook App settings
