/**
 * Application Configuration
 * Centralised Digital Platform for Comprehensive Student Activity Record (HEIs)
 * with AI-Assisted Certificate Verification
 */
const CONFIG = {
    APP_NAME: "EduRecord AI",
    APP_FULL_TITLE: "Centralised Digital Platform for Student Activity Records with AI Verification",
    INSTITUTION_NAME: "National Institute of Technology & Engineering",
    ACCREDITATION_INFO: "Accredited with 'A++' Grade by NAAC | NBA Tier-1 Programs",
    
    // API Configuration
    // Set USE_MOCK_API to false when connecting to your Java Spring Boot backend
    USE_MOCK_API: true,
    API_BASE_URL: "http://localhost:8080/api",
    
    // Verification Decision Thresholds (Configurable by Admin)
    THRESHOLDS: {
        AUTO_APPROVE_MIN: 85,    // Score >= 85 -> Auto-Approved
        FACULTY_REVIEW_MIN: 50,  // 50 <= Score < 85 -> Faculty Review Queue
        AUTO_REJECT_BELOW: 50    // Score < 50 or Duplicates -> Flagged / Rejected
    },

    // Activity Categories as per NAAC / Higher Education Guidelines
    CATEGORIES: [
        { id: "TECHNICAL", label: "Technical Competitions & Hackathons", icon: "code", naacCriteria: "Criterion 5.3.1" },
        { id: "COURSES", label: "Certifications & MOOCs (NPTEL/Coursera)", icon: "award", naacCriteria: "Criterion 1.2.1" },
        { id: "INTERNSHIP", label: "Internships & Industrial Training", icon: "briefcase", naacCriteria: "Criterion 1.3.4" },
        { id: "SPORTS", label: "Sports & Athletics Competitions", icon: "activity", naacCriteria: "Criterion 5.3.1" },
        { id: "CULTURAL", label: "Cultural & Arts Activities", icon: "music", naacCriteria: "Criterion 5.3.1" },
        { id: "VOLUNTEERING", label: "Volunteering & Community Outreach (NSS/NCC)", icon: "heart", naacCriteria: "Criterion 3.4.3" },
        { id: "RESEARCH", label: "Research Publications & Patents", icon: "book-open", naacCriteria: "Criterion 3.2.2" }
    ],

    // Verification Statuses
    STATUS: {
        AUTO_APPROVED: "AUTO_APPROVED",
        PENDING_FACULTY: "PENDING_FACULTY",
        FACULTY_APPROVED: "FACULTY_APPROVED",
        REJECTED: "REJECTED",
        DUPLICATE_FLAGGED: "DUPLICATE_FLAGGED"
    }
};

window.CONFIG = CONFIG;
