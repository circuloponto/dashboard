# Firebase Security Best Practices

## API Key Security

**Important**: Firebase API keys are **meant to be public**. They identify your Firebase project but don't grant access by themselves.

### Why API Keys Are Safe to Expose:

1. **They're Public by Design**: Firebase API keys are included in client-side code and are visible to anyone
2. **Security Comes from Rules**: Real security comes from Firestore Security Rules, not hiding the API key
3. **They're Not Secrets**: The API key alone cannot access your data - Firestore rules control access

### Best Practice: Restrict API Key (Optional but Recommended)

You can add an extra layer of security by restricting your API key to specific domains:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your Firebase API key and click **Edit**
5. Under **Application restrictions**, select **HTTP referrers (web sites)**
6. Add your domains:
   - `https://your-vercel-domain.vercel.app/*`
   - `http://localhost:*` (for development)
   - `https://your-custom-domain.com/*` (if you have one)
7. Click **Save**

This prevents the API key from being used on unauthorized domains, but it's still visible in your code.

## Firestore Security Rules (REQUIRED)

The real security comes from Firestore Security Rules. Make sure you have proper rules set up:

1. Go to Firebase Console → Firestore Database → Rules
2. Set up rules based on your needs

### Example Rules:

**For password-protected app (current setup):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /foodItems/{document} {
      // Allow read/write for now (since you're using password auth)
      // In production, consider adding more restrictions
      allow read, write: if true;
    }
  }
}
```

**For Firebase Authentication (more secure):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /foodItems/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Summary

✅ **Safe to expose**: API Key, Auth Domain, Project ID, etc.  
✅ **Use**: Firestore Security Rules for real security  
✅ **Optional**: Restrict API key to your domains  
❌ **Don't worry**: About exposing Firebase config - it's designed to be public

