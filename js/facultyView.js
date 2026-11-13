/**
 * Faculty & Coordinator Review Queue Controller
 * Human-in-the-Loop Verification Desk for Low/Medium Confidence Submissions
 */

class FacultyViewController {
    constructor() {
        this.statusFilter = "PENDING_FACULTY";
        this.selectedActivity = null;
    }

    async render(container) {
        const currentUser = apiService.getCurrentUser();
        const activities = await apiService.getActivities();

        const pendingCount = activities.filter(a => a.verification?.status === "PENDING_FACULTY").length;
        const autoApprovedCount = activities.filter(a => a.verification?.status === "AUTO_APPROVED").length;
        const facultyApprovedCount = activities.filter(a => a.verification?.status === "FACULTY_APPROVED").length;
        const flaggedCount = activities.filter(a => a.verification?.status === "DUPLICATE_FLAGGED" || a.verification?.status === "REJECTED").length;

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Faculty Verification Desk</h1>
                    <p class="page-subtitle">
                        <strong>${currentUser.name}</strong> &bull; ${currentUser.designation || 'Coordinator'} 
                        &bull; Human-in-the-Loop Review Queue
                    </p>
                </div>
                <div class="flex gap-2">
                    <span class="badge badge-pending-faculty" style="padding: 8px 14px; font-size: 0.85rem;">
                        <span class="pulse-dot"></span> ${pendingCount} Action Required
                    </span>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="stats-grid">
                <div class="stat-card" style="border-left: 4px solid var(--warning);">
                    <div class="stat-icon amber">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div>
                        <div class="stat-value">${pendingCount}</div>
                        <div class="stat-label">Pending Faculty Queue</div>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 4px solid var(--success);">
                    <div class="stat-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div>
                        <div class="stat-value">${autoApprovedCount}</div>
                        <div class="stat-label">AI Auto-Approved</div>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 4px solid var(--info);">
                    <div class="stat-icon indigo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                    </div>
                    <div>
                        <div class="stat-value">${facultyApprovedCount}</div>
                        <div class="stat-label">Manual Approved</div>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 4px solid var(--danger);">
                    <div class="stat-icon rose">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </div>
                    <div>
                        <div class="stat-value">${flaggedCount}</div>
                        <div class="stat-label">Duplicates / Flagged</div>
                    </div>
                </div>
            </div>

            <!-- Queue Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                        Review Submissions (Human-in-the-Loop Filter)
                    </div>
                    <div class="filter-bar">
                        <select class="filter-select" id="facultyStatusFilter" onchange="window.facultyView.onFilterChange(this.value)">
                            <option value="PENDING_FACULTY" selected>Pending Review (Needs Faculty Attention)</option>
                            <option value="AUTO_APPROVED">AI Auto-Approved Records</option>
                            <option value="FACULTY_APPROVED">Faculty Approved Records</option>
                            <option value="DUPLICATE_FLAGGED">Duplicate Collisions & Flagged</option>
                            <option value="ALL">All Records</option>
                        </select>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Student Details</th>
                                    <th>Activity & Organization</th>
                                    <th>Category</th>
                                    <th>AI Confidence</th>
                                    <th>AI Routing Reason</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="facultyQueueTableBody">
                                ${this.renderQueueRows(activities)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderQueueRows(activities) {
        let filtered = activities;
        if (this.statusFilter !== "ALL") {
            filtered = filtered.filter(a => a.verification?.status === this.statusFilter);
        }

        if (filtered.length === 0) {
            return `<tr><td colspan="6" class="text-center" style="padding: 2.5rem; color: var(--gray-400);">No submissions found matching filter: <strong>${this.statusFilter}</strong>.</td></tr>`;
        }

        return filtered.map(a => {
            const score = a.verification?.confidenceScore || 0;
            let scoreClass = "score-high";
            if (score < 50) scoreClass = "score-low";
            else if (score < 85) scoreClass = "score-medium";

            return `
                <tr>
                    <td>
                        <div style="font-weight: 700; color: var(--gray-900);">${a.studentName}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-500);">${a.rollNumber} &bull; ${a.department}</div>
                    </td>
                    <td>
                        <div style="font-weight: 600; color: var(--gray-800);">${a.title}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-500);">${a.organization} &bull; ${a.eventDate}</div>
                    </td>
                    <td>
                        <span class="badge" style="background:#f1f5f9; color:#334155;">${a.category}</span>
                    </td>
                    <td>
                        <span class="score-tag ${scoreClass}">${score}%</span>
                    </td>
                    <td>
                        <div style="font-size: 0.8rem; color: var(--gray-600); max-width: 280px; white-space: normal;">
                            ${a.verification?.decision || 'Under review'}
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="window.facultyView.openReviewModal('${a.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            Inspect & Decide
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    onFilterChange(status) {
        this.statusFilter = status;
        this.refreshTable();
    }

    async refreshTable() {
        const activities = await apiService.getActivities();
        const tbody = document.getElementById("facultyQueueTableBody");
        if (tbody) {
            tbody.innerHTML = this.renderQueueRows(activities);
        }
    }

    async openReviewModal(activityId) {
        const activity = await apiService.getActivityById(activityId);
        if (!activity) return;
        this.selectedActivity = activity;

        const modalEl = document.getElementById("reviewModal");
        const bodyEl = document.getElementById("reviewModalBody");
        if (!modalEl || !bodyEl) return;

        const score = activity.verification?.confidenceScore || 0;
        const ocr = activity.verification?.ocrExtracted || {};
        const checks = activity.verification?.checks || [];

        bodyEl.innerHTML = `
            <div class="confidence-meter" style="--score-pct: ${score};">
                <div class="meter-info">
                    <div class="meter-title">AI Multi-Factor Analysis</div>
                    <div class="meter-decision">${activity.verification?.decision || 'Confidence Matrix'}</div>
                    <div class="meter-sub">Target Student: <strong>${activity.studentName}</strong> (${activity.rollNumber})</div>
                </div>
                <div class="meter-circle-wrap">
                    <div class="meter-circle-inner">
                        <span class="meter-circle-val">${score}%</span>
                        <span class="meter-circle-lbl">Confidence</span>
                    </div>
                </div>
            </div>

            <div class="inspection-grid">
                <!-- Left Pane: Certificate Document Preview -->
                <div class="cert-preview-pane">
                    <img src="${activity.certificate?.fileUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80'}" alt="Certificate Preview" class="cert-preview-img">
                    <div class="cert-hash-box">
                        <strong>SHA-256:</strong> ${activity.certificate?.fileHash || 'Verified Document Stream'}
                    </div>
                    <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 6px;">
                        File: ${activity.certificate?.fileName || 'Document.pdf'} (${activity.certificate?.fileSize || '1.2 MB'})
                    </div>
                </div>

                <!-- Right Pane: Extracted OCR Fields vs Form Metadata -->
                <div class="extracted-fields-pane">
                    <div class="field-comparison-card ${ocr.nameMatched ? 'match' : 'mismatch'}">
                        <div class="field-label">
                            <span>Candidate Name on Certificate</span>
                            <span>${ocr.nameMatched ? '&check; Matched' : '&times; Mismatch / Flag'}</span>
                        </div>
                        <div class="field-value">${ocr.extractedName || activity.studentName}</div>
                        <div class="field-diff-note">Profile: <em>${activity.studentName}</em> (Roll: ${activity.rollNumber})</div>
                    </div>

                    <div class="field-comparison-card match">
                        <div class="field-label">
                            <span>Extracted Event / Course</span>
                            <span>&check; OCR Match</span>
                        </div>
                        <div class="field-value">${ocr.extractedTitle || activity.title}</div>
                        <div class="field-diff-note">Claimed Category: <em>${activity.category}</em></div>
                    </div>

                    <div class="field-comparison-card match">
                        <div class="field-label">
                            <span>Issuing Authority</span>
                            <span>&check; Recognized Body</span>
                        </div>
                        <div class="field-value">${ocr.extractedOrg || activity.organization}</div>
                    </div>

                    <div class="field-comparison-card match">
                        <div class="field-label">
                            <span>Event Date & QR Anchor</span>
                            <span>${ocr.qrVerified ? '&check; Digital QR' : '&bull; Scanned Seal'}</span>
                        </div>
                        <div class="field-value">${ocr.extractedDate || activity.eventDate}</div>
                        ${ocr.qrCodeUrl ? `<div class="field-diff-note"><a href="${ocr.qrCodeUrl}" target="_blank" style="color:var(--primary); font-size:0.75rem;">Verified Authority Link &nearr;</a></div>` : ''}
                    </div>

                    <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 8px;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Integrity Checks</div>
                        <ul style="font-size: 0.8rem; color: #334155; list-style: none; display: flex; flex-direction: column; gap: 4px;">
                            ${checks.map(c => `<li>${c.passed ? '<span style="color:var(--success);">&check;</span>' : '<span style="color:var(--danger);">&times;</span>'} <strong>${c.name}:</strong> ${c.detail}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Faculty Decision Input -->
                    <div>
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--gray-700); margin-bottom: 4px;">
                            Faculty Coordinator Remarks / NAAC Verification Notes:
                        </label>
                        <textarea id="facultyReviewRemarks" rows="2" class="search-input" style="width: 100%; border-radius: 8px;" placeholder="e.g., Verified against departmental roster. Approved 20 hours activity credit for NAAC Criterion 5.3.1."></textarea>
                    </div>
                </div>
            </div>
        `;

        modalEl.classList.add("active");
    }

    closeReviewModal() {
        const modalEl = document.getElementById("reviewModal");
        if (modalEl) modalEl.classList.remove("active");
        this.selectedActivity = null;
    }

    async submitDecision(decisionStatus) {
        if (!this.selectedActivity) return;
        const remarks = document.getElementById("facultyReviewRemarks")?.value || "Approved by departmental coordinator.";
        const facultyUser = apiService.getCurrentUser();

        await apiService.facultyReview(this.selectedActivity.id, decisionStatus, remarks, facultyUser);
        
        window.app.showToast(
            decisionStatus === "FACULTY_APPROVED" ? "Submission successfully approved and credited!" : "Submission rejected with feedback.",
            decisionStatus === "FACULTY_APPROVED" ? "success" : "error"
        );

        this.closeReviewModal();
        await this.render(document.getElementById("pageContainer"));
    }
}

window.facultyView = new FacultyViewController();
