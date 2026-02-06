# Firebase Configuration Required

## Before Deployment, You Need:

### 1. Firebase Project Setup

1. **Create Firebase Project**: https://console.firebase.google.com/
2. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional)
3. **Create Firestore Database**:
   - Go to Firestore Database
   - Create database in test mode
   - Add security rules (see below)

### 2. Firebase Config Values

After setup, provide these 6 values from Firebase Console → Project Settings → Your apps:

```javascript
apiKey: "YOUR_API_KEY"
authDomain: "YOUR_PROJECT_ID.firebaseapp.com"
projectId: "YOUR_PROJECT_ID"
storageBucket: "YOUR_PROJECT_ID.appspot.com"
messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
appId: "YOUR_APP_ID"
```

### 3. Firestore Security Rules

Add these rules to your Firestore database:

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
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Authenticated users can write to loginLogs and downloads
    match /loginLogs/{logId} {
      allow read, write: if request.auth != null;
    }
    
    match /downloads/{downloadId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Share Your Firebase Config

Once you have the config, I'll update `index.html` with your Firebase credentials before deployment.
