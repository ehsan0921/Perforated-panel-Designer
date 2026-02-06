# Firebase Setup Requirements

## What You Need to Provide

### 1. Firebase Project Configuration

After creating your Firebase project, you need to provide these values from your Firebase Console:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create a new one)
3. **Go to Project Settings** (gear icon → Project settings)
4. **Scroll to "Your apps"** section
5. **Click on the web app** (or add one if you haven't)
6. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 2. Enable Authentication Methods

1. **Go to Authentication** → **Sign-in method**
2. **Enable Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
3. **Enable Google Sign-in** (optional but recommended):
   - Click on "Google"
   - Toggle "Enable"
   - Enter your project support email
   - Click "Save"

### 3. Create Firestore Database

1. **Go to Firestore Database**
2. **Create database**:
   - Choose "Start in test mode" (for development)
   - Select a location (choose closest to your users)
   - Click "Enable"
3. **Add Security Rules** (copy and paste these):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      // Allow admins to read all users
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Anyone authenticated can write to loginLogs and downloads
    match /loginLogs/{logId} {
      allow read, write: if request.auth != null;
    }
    
    match /downloads/{downloadId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. What to Share With Me

Please provide:
1. The complete `firebaseConfig` object (all 6 values)
2. Confirmation that Email/Password auth is enabled
3. Confirmation that Firestore is created
4. The Firestore database location you chose

**Note**: Keep your Firebase API keys secure. While they're visible in client-side code, make sure to set up proper security rules.
