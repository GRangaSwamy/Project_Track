# 🏗️ Construction Project Tracking System (V1)

A modern, dark-themed web application for tracking construction projects, phases, and daily progress logs.

## 📋 Project Overview

**Scope:** Project → Phases → Daily Logs tracking system  
**Tech Stack:** React.js + Vite + Firebase (Auth, Firestore, Storage)  
**Design:** Dark theme, mobile-responsive, professional UI

## 🚀 Current Status

✅ **Phase 1 Complete: Project Setup**
- ✅ Vite + React project structure
- ✅ Folder organization
- ✅ Package.json with dependencies
- ✅ Vite configuration with path aliases

✅ **Phase 2 Complete: Base UI Layout**
- ✅ Global styles with dark theme
- ✅ CSS variables for design system
- ✅ Responsive layout structure
- ✅ Sidebar (Desktop)
- ✅ Top Bar + Bottom Navigation (Mobile)

✅ **Phase 3 Complete: Routing**
- ✅ React Router setup
- ✅ All routes defined
- ✅ PrivateRoute component
- ✅ AuthContext placeholder

✅ **Phase 4 Complete: Reusable Components**
- ✅ Button component (multiple variants)
- ✅ Card component
- ✅ Input component (text, textarea, select)
- ✅ Layout components

✅ **Phase 5 Complete: Page Skeletons**
- ✅ Login page
- ✅ Dashboard page
- ✅ Add Project page
- ✅ Project Detail page
- ✅ Phase Detail page

⏸️ **Waiting for Firebase Configuration**

## 📁 Project Structure

```
Track/
├── docs/                          # Documentation
│   ├── design.md                  # Design specifications
│   ├── techstack.md              # Tech stack details
│   └── development-tasks.md      # Development task list
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── PrivateRoute.jsx  # Protected route wrapper
│   │   ├── common/
│   │   │   ├── Button.jsx        # Reusable button
│   │   │   ├── Card.jsx          # Reusable card
│   │   │   └── Input.jsx         # Reusable input
│   │   └── layout/
│   │       ├── MainLayout.jsx    # Main app layout
│   │       ├── Sidebar.jsx       # Desktop sidebar
│   │       ├── TopBar.jsx        # Mobile top bar
│   │       └── BottomNav.jsx     # Mobile bottom nav
│   ├── contexts/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx         # Login page
│   │   ├── projects/
│   │   │   ├── AddProject.jsx    # Add project form
│   │   │   └── ProjectDetail.jsx # Project details
│   │   ├── phases/
│   │   │   └── PhaseDetail.jsx   # Phase details
│   │   └── Dashboard.jsx         # Main dashboard
│   ├── services/
│   │   └── firebase.js           # Firebase initialization
│   ├── config/
│   │   └── firebase.config.js    # Firebase config (placeholder)
│   ├── styles/
│   │   └── global.css            # Global styles & theme
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
└── .gitignore                   # Git ignore rules
```

## 🎨 Design System

### Color Palette (Dark Theme)
- **Background Primary:** `#0B1220`
- **Background Secondary:** `#111827`
- **Primary Accent:** `#F59E0B` (Construction Gold)
- **Success:** `#22C55E`
- **Danger:** `#EF4444`
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#9CA3AF`

### Responsive Breakpoints
- **Desktop:** > 768px (Sidebar navigation)
- **Mobile:** ≤ 768px (Top bar + Bottom navigation)

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Step 1: Install Dependencies

**Note:** If you encounter PowerShell execution policy errors on Windows, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then install dependencies:
```bash
npm install
```

### Step 2: Firebase Configuration

⚠️ **REQUIRED BEFORE RUNNING THE APP**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage**
4. Get your Firebase config from Project Settings
5. Update `src/config/firebase.config.js` with your credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🔐 Firebase Setup Checklist

Before the app can function fully, complete these Firebase setup tasks:

- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Enable Firebase Storage
- [ ] Update firebase.config.js with credentials
- [ ] Set up Firestore security rules
- [ ] Set up Storage security rules

## 📱 Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | User authentication |
| `/` | Dashboard | Project overview & statistics |
| `/add-project` | Add Project | Create new project |
| `/project/:projectId` | Project Detail | View project & phases |
| `/project/:projectId/phase/:phaseId` | Phase Detail | View phase & daily logs |

## 🎯 Next Steps

1. **Provide Firebase Configuration** ← Current blocker
2. Integrate Firebase Authentication
3. Implement Firestore CRUD operations
4. Add Firebase Storage for images
5. Build project management features
6. Build phase tracking features
7. Build daily logs features
8. Testing & deployment

## 📝 Development Guidelines

- Follow the task list in `docs/development-tasks.md`
- Use CSS Modules for component styles
- Maintain dark theme consistency
- Ensure mobile responsiveness
- Write clean, commented code
- Use reusable components

## 🚫 Out of Scope (V1)

- Analytics & reports
- Client portal
- Multi-user support
- Advanced features

These will be considered for V2.

## 📞 Support

For questions or issues, refer to:
- Design Document: `docs/design.md`
- Tech Stack Document: `docs/techstack.md`
- Task List: `docs/development-tasks.md`

---

**Built with ❤️ for Construction Project Management**
