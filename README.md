# Food Donation Dashboard

A beautiful, modern dashboard for tracking food donations in a non-profit organization.

## Features

- 🔐 Password-protected access
- 📊 Interactive charts (Pie and Bar charts)
- 🎯 Click-to-add functionality for tracking items
- ☁️ **Cloud sync with Firebase** - Data syncs across all devices automatically!
- 💾 Fallback to localStorage if Firebase is not configured
- 🎨 Modern, top-tier design with Tailwind CSS
- 📱 Responsive design for all devices

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. **Set up Firebase (Optional but Recommended for Multi-Device Sync)**

   The app works with localStorage by default, but to sync data across multiple devices/computers, you need to set up Firebase:

   a. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
   
   b. Enable Firestore Database:
      - Click "Firestore Database" in the left menu
      - Click "Create database"
      - Start in "test mode" (for now - you can secure it later)
      - Choose a location close to you
   
   c. Get your Firebase config:
      - Click the gear icon ⚙️ next to "Project Overview"
      - Select "Project settings"
      - Scroll down to "Your apps" and click the web icon `</>`
      - Register your app (you can use any name)
      - Copy the `firebaseConfig` object
   
   d. Update `src/config/firebase.js`:
      - Replace the placeholder values with your actual Firebase config
      - The file will automatically detect when Firebase is configured

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Default Password

The default password is: `ines2024`

You can change this in `src/components/Login.jsx` by modifying the `CORRECT_PASSWORD` constant.

### Data Storage

- **With Firebase**: Data syncs in real-time across all devices. All team members see the same data instantly.
- **Without Firebase**: Data is stored locally in the browser (localStorage). Each device has its own data.

**Note**: Even with Firebase configured, the app still saves to localStorage as a backup.

## Usage

1. **Login**: Enter the password to access the dashboard
2. **Add Items**: Click on any food item card to add one unit
3. **View Charts**: Switch between pie chart and bar chart views
4. **Reset**: Use the "Resetar Contadores" button to reset all counters
5. **Logout**: Click "Sair" to logout

## Available Food Items

- Arroz (Rice) 🌾
- Leite (Milk) 🥛
- Água (Water) 💧
- Feijão (Beans) 🫘
- Biscoitos (Cookies) 🍪
- Massa (Pasta) 🍝
- Óleo (Oil) 🫒
- Açúcar (Sugar) 🍬

## Customization

You can easily customize the items by editing the `INITIAL_ITEMS` array in `src/components/Dashboard.jsx`.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React 18
- Vite
- React Router
- Recharts
- Tailwind CSS
- Firebase (Firestore) - Optional, for cloud sync

## Firebase Setup Details

If you want to enable cloud sync (highly recommended for team use):

1. **Create Firebase Project**: Visit https://console.firebase.google.com/
2. **Enable Firestore**: Create a Firestore database in test mode
3. **Get Config**: Copy your Firebase config from project settings
4. **Update Config**: Paste it into `src/config/firebase.js`

Once configured, you'll see a green "Sincronizado" badge in the dashboard header, and all changes will sync automatically across all devices!

### Security Note

For production use, you should:
- Set up Firestore security rules to restrict access
- Consider adding authentication (the app currently uses a simple password)
- Review Firebase security best practices

