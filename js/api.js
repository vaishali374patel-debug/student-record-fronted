/**
 * API Service Layer
 * Supports both standalone Mock Mode (localStorage persistence) and Spring Boot REST API integration.
 */

class ApiService {
    constructor() {
        this.useMock = CONFIG.USE_MOCK_API;
        this.baseUrl = CONFIG.API_BASE_URL;
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem("edurecord_users")) {
            localStorage.setItem("edurecord_users", JSON.stringify(INITIAL_DATA.users));
        }
        if (!localStorage.getItem("edurecord_activities")) {
            localStorage.setItem("edurecord_activities", JSON.stringify(INITIAL_DATA.activities));
        }
        if (!localStorage.getItem("edurecord_departments")) {
            localStorage.setItem("edurecord_departments", JSON.stringify(INITIAL_DATA.departments));
        }
        if (!localStorage.getItem("edurecord_thresholds")) {
            localStorage.setItem("edurecord_thresholds", JSON.stringify(CONFIG.THRESHOLDS));
        }
    }

    getStoredUsers() {
        return JSON.parse(localStorage.getItem("edurecord_users") || "[]");
    }

    getStoredActivities() {
        return JSON.parse(localStorage.getItem("edurecord_activities") || "[]");
    }

    saveActivities(activities) {
        localStorage.setItem("edurecord_activities", JSON.stringify(activities));
    }

    // --- Authentication ---
    async login(email, password) {
        if (!this.useMock) {
            const resp = await fetch(`${this.baseUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!resp.ok) throw new Error("Invalid credentials");
            const data = await resp.json();
            localStorage.setItem("edurecord_token", data.token);
            localStorage.setItem("edurecord_current_user", JSON.stringify(data.user));
            return data.user;
        }

        // Mock Login
        const users = this.getStoredUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user || user.password !== password) {
            throw new Error("Invalid email or password");
        }
        localStorage.setItem("edurecord_current_user", JSON.stringify(user));
        return user;
    }

    getCurrentUser() {
        const stored = localStorage.getItem("edurecord_current_user");
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        // Default to student Aarav Sharma if not logged in
        return this.getStoredUsers()[0];
    }

    setCurrentUser(user) {
        localStorage.setItem("edurecord_current_user", JSON.stringify(user));
    }

    logout() {
        localStorage.removeItem("edurecord_current_user");
        localStorage.removeItem("edurecord_token");
    }

    // --- Activities ---
    async getActivities(filter = {}) {
        if (!this.useMock) {
            const token = localStorage.getItem("edurecord_token");
            const query = new URLSearchParams(filter).toString();
            const resp = await fetch(`${this.baseUrl}/activities?${query}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            return await resp.json();
        }

        let activities = this.getStoredActivities();
        if (filter.studentId) {
            activities = activities.filter(a => a.studentId === filter.studentId);
        }
        if (filter.category && filter.category !== "ALL") {
            activities = activities.filter(a => a.category === filter.category);
        }
        if (filter.status && filter.status !== "ALL") {
            activities = activities.filter(a => a.verification && a.verification.status === filter.status);
        }
        if (filter.department && filter.department !== "ALL") {
            activities = activities.filter(a => a.department === filter.department);
        }
        return activities;
    }

    async getActivityById(id) {
        if (!this.useMock) {
            const resp = await fetch(`${this.baseUrl}/activities/${id}`);
            return await resp.json();
        }
        const activities = this.getStoredActivities();
        return activities.find(a => a.id === id) || null;
    }

    async createActivity(activityData) {
        if (!this.useMock) {
            const token = localStorage.getItem("edurecord_token");
            const resp = await fetch(`${this.baseUrl}/activities`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(activityData)
            });
            return await resp.json();
        }

        const activities = this.getStoredActivities();
        const newId = "ACT-" + (1000 + activities.length + 1);
        const newRecord = {
            id: newId,
            ...activityData,
            submissionDate: new Date().toISOString().split('T')[0]
        };
        activities.unshift(newRecord);
        this.saveActivities(activities);
        return newRecord;
    }

    async facultyReview(activityId, newStatus, comments, facultyUser) {
        if (!this.useMock) {
            const token = localStorage.getItem("edurecord_token");
            const resp = await fetch(`${this.baseUrl}/faculty/verify/${activityId}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus, comments })
            });
            return await resp.json();
        }

        const activities = this.getStoredActivities();
        const index = activities.findIndex(a => a.id === activityId);
        if (index === -1) throw new Error("Record not found");

        activities[index].verification.status = newStatus;
        activities[index].verification.facultyReview = {
            reviewedBy: facultyUser.name,
            reviewedAt: new Date().toISOString(),
            comments: comments
        };
        this.saveActivities(activities);
        return activities[index];
    }

    // --- Analytics for NAAC / NBA ---
    async getAnalytics() {
        const activities = this.getStoredActivities();
        const users = this.getStoredUsers();
        const students = users.filter(u => u.role === "STUDENT");

        const totalSubmissions = activities.length;
        const autoApproved = activities.filter(a => a.verification?.status === "AUTO_APPROVED").length;
        const facultyApproved = activities.filter(a => a.verification?.status === "FACULTY_APPROVED").length;
        const pendingFaculty = activities.filter(a => a.verification?.status === "PENDING_FACULTY").length;
        const rejectedOrDuplicate = activities.filter(a => 
            a.verification?.status === "REJECTED" || a.verification?.status === "DUPLICATE_FLAGGED"
        ).length;

        const aiAutomationRate = totalSubmissions > 0 ? Math.round((autoApproved / totalSubmissions) * 100) : 0;
        
        // Category counts
        const categoryCounts = {};
        CONFIG.CATEGORIES.forEach(c => categoryCounts[c.id] = 0);
        activities.forEach(a => {
            if (categoryCounts[a.category] !== undefined) {
                categoryCounts[a.category]++;
            }
        });

        // NAAC Metric mapping
        const naacMetrics = {
            "Criterion 1 (Curricular Aspects)": activities.filter(a => a.category === "COURSES" || a.category === "INTERNSHIP").length,
            "Criterion 3 (Research & Extension)": activities.filter(a => a.category === "RESEARCH" || a.category === "VOLUNTEERING").length,
            "Criterion 5 (Student Support & Sports)": activities.filter(a => a.category === "TECHNICAL" || a.category === "SPORTS" || a.category === "CULTURAL").length
        };

        return {
            totalStudents: students.length + 120, // include cohort sample
            totalSubmissions,
            autoApproved,
            facultyApproved,
            pendingFaculty,
            rejectedOrDuplicate,
            aiAutomationRate,
            avgVerificationTimeSeconds: 3.2,
            manualVerificationTimeDays: 4.5,
            workloadReductionPercent: 78,
            categoryCounts,
            naacMetrics
        };
    }

    // --- System Thresholds Config ---
    getThresholds() {
        return JSON.parse(localStorage.getItem("edurecord_thresholds") || JSON.stringify(CONFIG.THRESHOLDS));
    }

    updateThresholds(newThresholds) {
        localStorage.setItem("edurecord_thresholds", JSON.stringify(newThresholds));
        CONFIG.THRESHOLDS = newThresholds;
        if (window.aiEngine) {
            window.aiEngine.thresholds = newThresholds;
        }
        return newThresholds;
    }

    resetDemoData() {
        localStorage.setItem("edurecord_users", JSON.stringify(INITIAL_DATA.users));
        localStorage.setItem("edurecord_activities", JSON.stringify(INITIAL_DATA.activities));
        localStorage.setItem("edurecord_departments", JSON.stringify(INITIAL_DATA.departments));
        localStorage.setItem("edurecord_thresholds", JSON.stringify(CONFIG.THRESHOLDS));
    }
}

window.apiService = new ApiService();
