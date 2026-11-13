# EduRecord AI - Frontend
## Centralised Digital Platform for Comprehensive Student Activity Record in Higher Education Institutions (HEIs) with AI-Assisted Certificate Verification

This frontend is designed and developed according to the research paper specification for Higher Education Institutions (HEIs), featuring an **AI-Assisted Certificate Verification Pipeline** and **NAAC / NBA Accreditation Reporting**.

---

### 🌟 Key Features & Research Implementation

1. **Role-Based Access & Dashboards (RBAC)**:
   - **Student Portal**:
     - Complete student profile view (Roll Number, Branch, CGPA, Activity Credits).
     - Activity submission form with drag-and-drop document upload (PDF, PNG, JPG).
     - Live **6-Step AI Verification Pipeline** visualizer.
     - Activity record ledger with status filters (AI Verified, Faculty Review, Duplicate Flagged).
     - One-click exportable & printable **Official Verified e-Portfolio** with institutional QR stamp.
   - **Faculty / Coordinator Review Queue (Human-in-the-Loop)**:
     - Dedicated queue filtering low/medium confidence submissions (scores between 50% - 84%).
     - Side-by-side verification inspector: Document image & SHA-256 hash preview on the left, OCR extracted fields vs student profile comparison on the right.
     - Actions: **Approve & Award NAAC Credits**, **Reject Submission**, or add coordinator notes.
   - **Administrator & Accreditation Desk**:
     - Institution-wide metrics: Total Student Cohort, Auto-Approval Rate, Verification Speed (3.2s vs 4.5 days manual), Faculty Workload Saved (78%).
     - **NAAC / NBA Criteria Mapping**:
       - *Criterion 1*: Curricular Aspects (MOOCs, NPTEL, Internships)
       - *Criterion 3*: Research & Extension (Patents, NSS, Outreach)
       - *Criterion 5*: Student Progression & Sports (Hackathons, Sports, Cultural)
     - **Dynamic AI Threshold Tuner**: Configurable sliders for Auto-Approval threshold (>= 85%) and Faculty Queue threshold (>= 50%).
     - Exportable Institutional NAAC / NBA Audit Summary Report.

2. **Core 6-Step AI Verification Pipeline (`js/aiVerification.js`)**:
   - **Step 1: Duplicate Detection**: Uses Web Crypto API to calculate real cryptographic SHA-256 checksums and compare against existing certificates to prevent fraudulent re-uploads.
   - **Step 2: Text Extraction**: Simulates OCR (Tesseract / Tess4J) and PDF stream parsing (Apache PDFBox).
   - **Step 3: AI Information Extraction**: Extracts structured fields (Student Name, Event/Course Title, Issuing Authority, Date, QR Link).
   - **Step 4: Rule-Based Validation**: Fuzzy matches extracted candidate name with student profile using Levenshtein distance, checks date validity within enrollment terms, and validates digital seal.
   - **Step 5: Multi-Factor Confidence Scoring**: Calculates combined confidence score (0-100%).
   - **Step 6: Decision Routing**:
     - High Confidence (>= 85%): Auto-Approved.
     - Medium Confidence (50% - 84%): Sent to Faculty Review Queue.
     - Low Confidence (< 50%) or Duplicate Hash: Flagged / Rejected with reason.

---

### 📂 Directory Structure

```
student-record-frontend/
├── index.html                 # Main web application with instant role switching
├── portfolio.html             # Verified student e-Portfolio & NAAC audit view
├── README.md                  # Complete documentation and setup guide
├── css/
│   ├── style.css              # Design tokens, typography, badges, buttons, modals, toasts
│   ├── dashboard.css          # Sidebar, topbar, cards, stat grids, responsive tables
│   ├── verification.css       # 6-step pipeline steps, confidence circle gauge, side-by-side inspection
│   └── print.css              # Formal printable layout for e-portfolios and audit reports
└── js/
    ├── config.js              # Application settings, Spring Boot API baseUrl, thresholds
    ├── mockData.js            # Initial realistic academic dataset (Students, Activities, Departments)
    ├── api.js                 # Unified API layer (LocalStorage mock & Spring Boot REST client)
    ├── aiVerification.js      # Client-side 6-step AI verification engine & SHA-256 calculator
    ├── studentView.js         # Student UI, submission modal, table filters
    ├── facultyView.js         # Faculty review queue and side-by-side inspector
    ├── adminView.js           # Admin NAAC analytics, threshold tuner, user table
    └── app.js                 # App coordinator, routing, modals, and toasts
```

---

### 🚀 How to Run the Frontend

1. **Option A: Direct Browser Launch (Zero Installation Required)**:
   - Simply double click `index.html` in file explorer or open it directly in Google Chrome, Microsoft Edge, or Firefox.
   - Everything runs natively in standard HTML5, CSS3, and JavaScript!

2. **Option B: Using Any Local Server (Optional)**:
   - Using VS Code: Right-click `index.html` -> "Open with Live Server".
   - Or with Python: `python -m http.server 3000`
   - Open `http://localhost:3000` in your browser.

---

### 🔄 Connecting with Java Spring Boot Backend

When your backend team provides the Spring Boot REST API:

1. Open `js/config.js`:
   ```javascript
   const CONFIG = {
       // Change USE_MOCK_API to false
       USE_MOCK_API: false,
       API_BASE_URL: "http://localhost:8080/api",
       ...
   };
   ```
2. The frontend already expects these Spring Boot Controller endpoints:
   - `POST /api/auth/login` -> `{ email, password }`
   - `GET /api/activities` -> returns activity list
   - `GET /api/activities/{id}` -> returns single activity with verification details
   - `POST /api/activities` -> creates new activity record
   - `POST /api/faculty/verify/{id}` -> `{ status: "FACULTY_APPROVED"|"REJECTED", comments: "..." }`
   - `GET /api/admin/analytics` -> returns NAAC / NBA aggregated statistics
