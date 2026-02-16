# 🚀 Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js installed (v16+)
- [ ] npm installed
- [ ] Firebase project created
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firebase Storage enabled
- [ ] Test user created in Firebase Auth

## Installation Steps

### 1. Install Dependencies

```powershell
# If you get execution policy errors on Windows:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Install packages:
npm install
```

### 2. Firebase Console Setup

#### Enable Authentication:
1. Go to https://console.firebase.google.com/
2. Select project: **phasetracker-b3bcf**
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password**
5. Add a test user:
   - Email: `contractor@test.com`
   - Password: `Test@123`

#### Create Firestore Database:
1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Test mode**
4. Choose your region
5. Click **Enable**

#### Enable Storage:
1. Go to **Storage**
2. Click **Get started**
3. Select **Test mode**
4. Click **Done**

### 3. Run the Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

### 4. Login

Use the test credentials:
- **Email:** `contractor@test.com`
- **Password:** `Test@123`

## Project Structure

```
Track/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Auth)
│   ├── pages/            # Page components
│   ├── services/         # Firebase services
│   ├── config/           # Firebase config
│   └── styles/           # Global styles
├── docs/                 # Documentation
└── package.json
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Implemented

✅ Firebase Authentication
✅ Firestore Database integration
✅ Firebase Storage integration
✅ Dark theme UI
✅ Responsive layout (Desktop + Mobile)
✅ Login page
✅ Dashboard skeleton
✅ Add Project page skeleton
✅ Project Detail page skeleton
✅ Phase Detail page skeleton

## Next Development Steps

1. ✅ Firebase integration (COMPLETE)
2. ⏭️ Implement Dashboard with real data
3. ⏭️ Implement Add Project functionality
4. ⏭️ Implement Project Detail with phases
5. ⏭️ Implement Phase management
6. ⏭️ Implement Daily Logs

## Troubleshooting

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Firebase Not Initialized
- Check `src/config/firebase.config.js` has correct credentials
- Check browser console for errors

### Authentication Not Working
- Ensure Email/Password is enabled in Firebase Console
- Ensure test user is created
- Check browser console for auth errors

### Port Already in Use
```bash
# Change port in vite.config.js or kill process using port 3000
```

## Support

- Design Doc: `docs/design.md`
- Tech Stack: `docs/techstack.md`
- Task List: `docs/development-tasks.md`
- Firebase Setup: `FIREBASE_SETUP.md`
- Progress: `PROGRESS.md`

---

**Happy Coding! 🏗️**
