/**
 * Student View Controller
 * Handles Student Dashboard, Activity Submissions, Live AI Verification, and Records
 */

class StudentViewController {
    constructor() {
        this.currentFilter = "ALL";
        this.searchQuery = "";
        this.selectedFile = null;
    }

    async render(container) {
        const currentUser = apiService.getCurrentUser();
        const activities = await apiService.getActivities({ studentId: currentUser.id });
        
        const total = activities.length;
        const verified = activities.filter(a => a.verification?.status === "AUTO_APPROVED" || a.verification?.status === "FACULTY_APPROVED").length;
        const pending = activities.filter(a => a.verification?.status === "PENDING_FACULTY").length;
        const totalHours = activities
            .filter(a => a.verification?.status === "AUTO_APPROVED" || a.verification?.status === "FACULTY_APPROVED")
            .reduce((sum, a) => sum + (a.hoursSpent || 0), 0);

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Student Dashboard</h1>
                    <p class="page-subtitle">Welcome back, <strong>${currentUser.name}</strong> (${currentUser.rollNumber}) &bull; ${currentUser.department}</p>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-secondary" onclick="window.app.openPortfolio('${currentUser.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        View Verified e-Portfolio
                    </button>
                    <button class="btn btn-primary" onclick="window.studentView.openSubmitModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        Upload & Verify Activity
                    </button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon indigo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <div>
                        <div class="stat-value">${total}</div>
                        <div class="stat-label">Total Submissions</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div>
                        <div class="stat-value">${verified}</div>
                        <div class="stat-label">AI / Faculty Verified</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon amber">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                        <div class="stat-value">${pending}</div>
                        <div class="stat-label">In Faculty Queue</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                    <div>
                        <div class="stat-value">${totalHours} hrs</div>
                        <div class="stat-label">Activity Credits Earned</div>
                    </div>
                </div>
            </div>

            <!-- Activity Table Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        Your Registered Activities & Verification Status
                    </div>
                    <div class="filter-bar">
                        <input type="text" id="studentSearch" class="search-input" placeholder="Search activity, title, org..." oninput="window.studentView.onSearch(this.value)">
                        <select class="filter-select" id="categoryFilter" onchange="window.studentView.onFilterChange(this.value)">
                            <option value="ALL">All Categories</option>
                            ${CONFIG.CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Activity / Event</th>
                                    <th>Category</th>
                                    <th>Issuing Organization</th>
                                    <th>Date</th>
                                    <th>AI Score</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="studentActivityTableBody">
                                ${this.renderActivityRows(activities)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderActivityRows(activities) {
        let filtered = activities;
        if (this.currentFilter !== "ALL") {
            filtered = filtered.filter(a => a.category === this.currentFilter);
        }
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            filtered = filtered.filter(a => 
                a.title.toLowerCase().includes(q) || 
                a.organization.toLowerCase().includes(q) ||
                a.category.toLowerCase().includes(q)
            );
        }

        if (filtered.length === 0) {
            return `<tr><td colspan="7" class="text-center" style="padding: 2.5rem; color: var(--gray-400);">No matching activities found. Click <strong>Upload & Verify Activity</strong> to add one!</td></tr>`;
        }

        return filtered.map(a => {
            const statusBadge = this.getStatusBadge(a.verification?.status);
            const score = a.verification?.confidenceScore || 0;
            let scoreClass = "score-high";
            if (score < 50) scoreClass = "score-low";
            else if (score < 85) scoreClass = "score-medium";

            return `
                <tr>
                    <td>
                        <div style="font-weight: 700; color: var(--gray-900);">${a.title}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 2px;">
                            ${a.hoursSpent ? `${a.hoursSpent} hrs &bull; ` : ''}${a.certificate?.fileName || 'Attached Certificate'}
                        </div>
                    </td>
                    <td>
                        <span style="font-size: 0.8rem; font-weight: 500; color: var(--gray-700);">${a.category}</span>
                    </td>
                    <td>${a.organization}</td>
                    <td>${a.eventDate}</td>
                    <td>
                        <span class="score-tag ${scoreClass}">${score}%</span>
                    </td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="window.app.viewActivityDetails('${a.id}')">
                            Inspect
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getStatusBadge(status) {
        switch(status) {
            case "AUTO_APPROVED":
                return `<span class="badge badge-auto-approved"><span class="pulse-dot"></span> AI Verified</span>`;
            case "FACULTY_APPROVED":
                return `<span class="badge badge-faculty-approved">&check; Faculty Approved</span>`;
            case "PENDING_FACULTY":
                return `<span class="badge badge-pending-faculty"><span class="pulse-dot"></span> Faculty Review</span>`;
            case "DUPLICATE_FLAGGED":
                return `<span class="badge badge-duplicate">&times; Duplicate Hash</span>`;
            case "REJECTED":
                return `<span class="badge badge-rejected">&times; Rejected</span>`;
            default:
                return `<span class="badge">${status || 'Pending'}</span>`;
        }
    }

    onFilterChange(category) {
        this.currentFilter = category;
        this.refreshTable();
    }

    onSearch(query) {
        this.searchQuery = query;
        this.refreshTable();
    }

    async refreshTable() {
        const currentUser = apiService.getCurrentUser();
        const activities = await apiService.getActivities({ studentId: currentUser.id });
        const tbody = document.getElementById("studentActivityTableBody");
        if (tbody) {
            tbody.innerHTML = this.renderActivityRows(activities);
        }
    }

    openSubmitModal() {
        const modal = document.getElementById("submitModal");
        if (modal) modal.classList.add("active");
    }

    closeSubmitModal() {
        const modal = document.getElementById("submitModal");
        if (modal) modal.classList.remove("active");
        this.selectedFile = null;
    }

    handleFileSelect(input) {
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            const nameEl = document.getElementById("selectedFileName");
            if (nameEl) {
                nameEl.innerHTML = `<strong>Selected:</strong> ${this.selectedFile.name} (${(this.selectedFile.size / 1024).toFixed(1)} KB)`;
                nameEl.style.display = "block";
            }
        }
    }

    /**
     * Trigger the full 6-step AI Verification Pipeline
     */
    async handleUploadAndVerify(event) {
        event.preventDefault();
        const currentUser = apiService.getCurrentUser();
        
        const title = document.getElementById("formTitle").value;
        const category = document.getElementById("formCategory").value;
        const organization = document.getElementById("formOrganization").value;
        const eventDate = document.getElementById("formEventDate").value;
        const hoursSpent = parseInt(document.getElementById("formHours").value || "10", 10);
        const description = document.getElementById("formDescription").value;

        if (!this.selectedFile) {
            // Generate a dummy File object if user didn't pick from disk for ease of demo
            const dummyBlob = new Blob([`Sample institutional certificate for ${currentUser.name} - ${title}`], { type: 'text/plain' });
            this.selectedFile = new File([dummyBlob], `${title.replace(/\s+/g, '_')}_Certificate.pdf`, { type: 'application/pdf' });
        }

        // Close submit modal and open live pipeline modal
        this.closeSubmitModal();
        window.app.openPipelineModal();

        const formMetadata = { title, category, organization, eventDate };
        const allActivities = await apiService.getActivities();

        // Run Verification Engine with UI callbacks
        const verificationResult = await window.aiEngine.verifyCertificate(
            this.selectedFile,
            currentUser,
            formMetadata,
            allActivities,
            (stepIndex, stepName, details) => {
                window.app.updatePipelineStep(stepIndex, stepName, details);
            }
        );

        // Store new activity in system
        const newActivity = await apiService.createActivity({
            studentId: currentUser.id,
            studentName: currentUser.name,
            rollNumber: currentUser.rollNumber,
            department: currentUser.department,
            title,
            category,
            organization,
            eventDate,
            hoursSpent,
            description,
            certificate: {
                fileName: this.selectedFile.name,
                fileSize: `${(this.selectedFile.size / 1024).toFixed(1)} KB`,
                fileHash: verificationResult.fileHash,
                fileUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80"
            },
            verification: verificationResult
        });

        // Show final result in pipeline modal
        window.app.finishPipelineStep(verificationResult, newActivity);
        
        // Refresh table in background
        await this.refreshTable();
    }
}

window.studentView = new StudentViewController();
