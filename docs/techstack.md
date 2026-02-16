# 🛠 TECH STACK & FIREBASE DATABASE DOCUMENT (V1 – CORE FEATURES ONLY)

**Project:** Construction Project Tracking System
**Scope:** Only Project → Phase → Daily Logs

---

# 1. TECH STACK (SIMPLE & STABLE)

## Frontend

* React.js
* Vite
* CSS Modules / SCSS (No Tailwind)
* Material UI (MUI) OR simple custom UI components

---

## Backend (Serverless)

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

---

## Hosting

* Firebase Hosting OR Vercel

---

# 2. WHY FIREBASE

* Fast development
* No backend server required
* Real-time updates
* Secure authentication
* Scalable

---

# 3. SYSTEM ARCHITECTURE

```
React UI
   ↓
Firebase Auth
   ↓
Firestore Database ←→ Firebase Storage
```

---

# 4. FIRESTORE DATABASE DESIGN (ONLY CORE FEATURES)

```
projects (collection)
  └── projectId (document)
       ├── name
       ├── estimatedCost
       ├── startDate
       ├── image
       ├── status
       └── phases (subcollection)
            └── phaseId
                 ├── phaseName
                 ├── workType
                 ├── startDate
                 ├── phaseCost
                 ├── totalQuantity
                 └── logs (subcollection)
                      └── logId
                           ├── date
                           ├── workDoneToday
                           ├── remainingWork
                           ├── costToday
                           ├── notes
                           ├── image
```

---

# 5. FIREBASE STORAGE STRUCTURE

```
/project-images/{projectId}
/log-images/{projectId}/{phaseId}/{logId}
```

---

# 6. AUTHENTICATION DESIGN

* Simple Email + Password login
* Single user system (contractor login only)

---

# 7. PERFORMANCE & SCALABILITY

* Pagination for projects
* Lazy loading for images
* Indexed queries in Firestore

---

# 8. GRAVITY AI – FEATURE EXPLANATION PROMPT

Use this to explain features clearly to Gravity:

"""
Build a Construction Project Tracking Web App using React and Firebase.

Core Features Only:

1. Project Management

* Add project with name, estimated cost, start date, and image upload.
* List all projects in dashboard.

2. Phase Tracking

* Each project can have multiple phases.
* Each phase has: phase name, work type, phase cost, start date, and total quantity.

3. Daily Logs

* Each phase supports daily progress logs.
* Log fields: date, work done today, remaining work, today cost, notes, image upload.

4. Firebase

* Use Firebase Auth, Firestore, and Storage.
* Follow hierarchical structure: Project → Phase → Logs.

5. UI

* Dark theme, professional dashboard style.
* Mobile responsive.

Build only these features. Do not add advanced features now.
"""

---

# 9. VERSION CONTROL STRATEGY

* V1 → Core tracking
* V2 → Analytics + reports
* V3 → Client portal

---

This document strictly covers **ONLY your current required system**, clean and upgrade-ready.