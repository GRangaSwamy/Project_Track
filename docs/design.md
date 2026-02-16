# 🎨 DESIGN DOCUMENT (V1 – CORE FEATURES ONLY)

**Project:** Construction Project Tracking System
**Scope:** Only what is required now – Project → Phases → Daily Logs
**Theme:** Dark | Modern | Professional | Dribbble-style UI

---

# 1. DESIGN GOAL

To design a **simple, clean, fast, and mobile-friendly interface** that allows a contractor to:

* Add projects
* Track work phase-wise
* Add daily progress logs

Focus: **Speed, clarity, and ease of use in real construction environments.**

---

# 2. CORE FEATURES (ONLY INITIAL REQUIREMENT)

## A. Project Management

User can:

* Add a new project
* View all projects
* Open a project and see its progress

**Project Fields:**

* Project Name
* Estimated Cost
* Start Date
* Upload Initial Image

---

## B. Phase-wise Tracking

Inside each project, user can:

* Add multiple phases
* Track each phase separately

**Phase Fields:**

* Phase Name
* Work Type (gravel, weed removal, sand filling, etc.)
* Phase Start Date
* Phase Cost
* Total Quantity (e.g., 100 meters)

---

## C. Daily Work Logs (Most Important Feature)

Inside each phase, user can:

* Add daily progress notes

**Daily Log Fields:**

* Date
* Work Done Today (e.g., 50m sand filling)
* Remaining Work (e.g., 50m left)
* Cost Today
* Notes
* Upload Image

---

# 3. APP FLOW (USER JOURNEY)

```
Dashboard
   ↓
Projects List
   ↓
Project Detail Page
   ↓
Phase Detail Page
   ↓
Daily Logs
```

---

# 4. LAYOUT STRUCTURE

### Desktop

```
[ Sidebar ] | [ Main Content Area ]
```

### Mobile

```
[ Top Bar ]
[ Content ]
[ Bottom Navigation ]
```

---

# 5. COLOR THEME (DARK)

* Background → #0B1220
* Cards → #111827
* Primary Accent → #F59E0B (Construction Gold)
* Success → #22C55E
* Danger → #EF4444
* Text Primary → #FFFFFF
* Text Secondary → #9CA3AF

---

# 6. PAGE-WISE DESIGN

---

## A. Dashboard

**Cards:**

* Total Projects
* Ongoing Projects

**Projects Table / Grid:**

* Project Name
* Progress Bar
* View Button

---

## B. Add Project Page

**Form Fields:**

* Project Name
* Estimated Cost
* Start Date
* Upload Image

Buttons:

* Save Project
* Cancel

---

## C. Project Detail Page

**Top Card:**

* Project Name
* Estimated Cost
* Start Date
* Overall Progress Bar

**Phase List Section:**

* List of all phases

Button:
➕ Add Phase

---

## D. Add Phase Modal

**Fields:**

* Phase Name
* Work Type
* Start Date
* Phase Cost
* Total Quantity

---

## E. Phase Detail Page

**Top Summary Card:**

* Phase Name
* Work Type
* Total Quantity
* Completed Quantity
* Remaining Quantity
* Phase Progress Bar

**Daily Logs Timeline:**

* Vertical cards

Button:
➕ Add Daily Log

---

## F. Add Daily Log Modal

**Fields:**

* Date
* Work Done Today
* Remaining Work
* Cost Today
* Notes
* Upload Image

---

# 7. UI STYLE

* Rounded cards
* Soft shadows
* Smooth animations
* Minimal clutter
* Fast data entry forms

---

# 8. DESIGN REFERENCES (Dribbble Keywords)

```
Construction dashboard dark UI
Project tracking dashboard
ERP admin panel dark
SaaS dashboard UI dark
```

---

# 9. DESIGN PRIORITY

1. Very simple navigation
2. Fast data input
3. Clear progress visualization
4. Mobile friendly
