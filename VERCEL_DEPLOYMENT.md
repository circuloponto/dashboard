# Vercel Deployment Guide

## Environment Variables Setup

When deploying to Vercel, you need to add all Firebase environment variables in the Vercel dashboard.

### Steps:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each of the following variables:

### Required Environment Variables:

```
VITE_FIREBASE_API_KEY=AIzaSyB7GwjUtnIbwAYBrMwY9_YQY4N7QiIUW20
VITE_FIREBASE_AUTH_DOMAIN=inventary-donations.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=inventary-donations
VITE_FIREBASE_STORAGE_BUCKET=inventary-donations.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=278513112462
VITE_FIREBASE_APP_ID=1:278513112462:web:ca7bda44def555d9b580df
VITE_FIREBASE_DATABASE_URL=https://inventary-donations-default-rtdb.europe-west1.firebasedatabase.app
```

### Important Notes:

- **Environment**: Select all environments (Production, Preview, Development) or just Production
- **Variable Names**: Must start with `VITE_` prefix (Vite requirement)
- **After Adding**: Redeploy your application for changes to take effect

### Quick Copy-Paste Format:

For each variable, click "Add" and enter:
- **Name**: `VITE_FIREBASE_API_KEY` (and so on for each)
- **Value**: The corresponding value from above
- **Environment**: Select Production (and Preview/Development if needed)

### Verification:

After deployment, check the browser console on your live site. You should see:
- `✅ Firebase connected - Data will sync across all devices!`

If you see `ℹ️ Firebase not configured`, the environment variables weren't loaded correctly.

