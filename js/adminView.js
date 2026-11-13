/**
 * Administrator View Controller
 * Institutional Analytics, NAAC / NBA Accreditation Metrics, System Threshold Tuning, and User Management
 */

class AdminViewController {
    constructor() {
        this.activeTab = "analytics";
    }

    async render(container) {
        const currentUser = apiService.getCurrentUser();
        const analytics = await apiService.getAnalytics();
        const thresholds = apiService.getThresholds();
        const users = apiService.getStoredUsers();

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Institution Administration & NAAC Analytics</h1>
                    <p class="page-subtitle">
                        ${CONFIG.INSTITUTION_NAME} &bull; <strong>${currentUser.name}</strong> (${currentUser.designation})
                    </p>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-secondary" onclick="window.adminView.exportAccreditationReport()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export NAAC / NBA Report
                    </button>
                    <button class="btn btn-primary" onclick="window.adminView.openThresholdModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Tune AI Thresholds
                    </button>
                </div>
            </div>

            <!-- Key Metric Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon indigo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <div>
                        <div class="stat-value">${analytics.totalStudents}</div>
                        <div class="stat-label">Enrolled Student Cohort</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <div>
                        <div class="stat-value">${analytics.totalSubmissions}</div>
                        <div class="stat-label">Total Verified Submissions</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    </div>
                    <div>
                        <div class="stat-value">${analytics.aiAutomationRate}%</div>
                        <div class="stat-label">AI Auto-Approval Rate</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon amber">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                    </div>
                    <div>
                        <div class="stat-value">3.2 sec</div>
                        <div class="stat-label">Avg AI Verification Speed</div>
                    </div>
                </div>
            </div>

            <!-- Accreditation Summary & Research Evaluation Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        NAAC Criterion-wise Activity Record Mapping & NBA Audit Readiness
                    </div>
                    <span class="badge badge-auto-approved">NAAC A++ Compliance</span>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div style="background: #f8fafc; border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.25rem;">
                            <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">Criterion 1: Curricular Aspects</div>
                            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">Value-added MOOCs, NPTEL & Industrial Internships</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-top: 8px;">
                                ${analytics.naacMetrics["Criterion 1 (Curricular Aspects)"]} <span style="font-size: 0.8rem; font-weight: 500; color: #64748b;">Records</span>
                            </div>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.25rem;">
                            <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">Criterion 3: Research & Extension</div>
                            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">Research Papers, NSS & Community Outreach</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: #10b981; margin-top: 8px;">
                                ${analytics.naacMetrics["Criterion 3 (Research & Extension)"]} <span style="font-size: 0.8rem; font-weight: 500; color: #64748b;">Records</span>
                            </div>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid var(--gray-200); border-radius: 12px; padding: 1.25rem;">
                            <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">Criterion 5: Student Progression</div>
                            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">National Hackathons, Technical Fests & Sports</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: #06b6d4; margin-top: 8px;">
                                ${analytics.naacMetrics["Criterion 5 (Student Support & Sports)"]} <span style="font-size: 0.8rem; font-weight: 500; color: #64748b;">Records</span>
                            </div>
                        </div>
                    </div>

                    <!-- Pipeline Evaluation vs Manual Benchmarking (Section 11 in Research Paper) -->
                    <div style="background: #f1f5f9; border-radius: 12px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <div style="font-size: 0.9rem; font-weight: 700; color: #0f172a;">Research Benchmark: AI vs Manual Verification Workload</div>
                            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
                                Manual verification baseline: ~4.5 business days per cohort. AI pipeline completes routine approvals in &lt; 4 seconds.
                            </div>
                        </div>
                        <div class="flex gap-4 items-center">
                            <div class="text-right">
                                <div style="font-size: 1.2rem; font-weight: 800; color: #065f46;">78% Workload Saved</div>
                                <div style="font-size: 0.75rem; color: #64748b;">Faculty Time Saved</div>
                            </div>
                            <div class="text-right">
                                <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">98.4% Accuracy</div>
                                <div style="font-size: 0.75rem; color: #64748b;">Field Extraction Precision</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Directory Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Institutional Role Directory (RBAC Entities)
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="window.adminView.resetDemoData()">
                        Reset All Demo Records
                    </button>
                </div>
                <div class="card-body" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>User & Identifier</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 700; color: var(--gray-900);">${u.name}</div>
                                            <div style="font-size: 0.75rem; color: var(--gray-500);">${u.rollNumber || u.facultyId || u.id}</div>
                                        </td>
                                        <td>
                                            <span class="badge ${u.role === 'STUDENT' ? 'badge-auto-approved' : (u.role === 'FACULTY' ? 'badge-faculty-approved' : 'badge-pending-faculty')}">
                                                ${u.role}
                                            </span>
                                        </td>
                                        <td>${u.department}</td>
                                        <td><code>${u.email}</code></td>
                                        <td><span class="badge badge-auto-approved">&bull; Active</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    openThresholdModal() {
        const modal = document.getElementById("thresholdModal");
        const thresholds = apiService.getThresholds();
        if (modal) {
            document.getElementById("autoApproveSlider").value = thresholds.AUTO_APPROVE_MIN;
            document.getElementById("autoApproveVal").innerText = thresholds.AUTO_APPROVE_MIN + "%";
            document.getElementById("facultyQueueSlider").value = thresholds.FACULTY_REVIEW_MIN;
            document.getElementById("facultyQueueVal").innerText = thresholds.FACULTY_REVIEW_MIN + "%";
            modal.classList.add("active");
        }
    }

    closeThresholdModal() {
        const modal = document.getElementById("thresholdModal");
        if (modal) modal.classList.remove("active");
    }

    saveThresholds() {
        const autoMin = parseInt(document.getElementById("autoApproveSlider").value, 10);
        const facultyMin = parseInt(document.getElementById("facultyQueueSlider").value, 10);

        if (autoMin <= facultyMin) {
            alert("Auto-Approve Threshold must be strictly higher than Faculty Review threshold!");
            return;
        }

        apiService.updateThresholds({
            AUTO_APPROVE_MIN: autoMin,
            FACULTY_REVIEW_MIN: facultyMin,
            AUTO_REJECT_BELOW: facultyMin
        });

        window.app.showToast(`Updated AI thresholds: Auto-Approve >= ${autoMin}%, Faculty Queue >= ${facultyMin}%`, "success");
        this.closeThresholdModal();
    }

    resetDemoData() {
        if (confirm("Reset all student and faculty records to default test dataset?")) {
            apiService.resetDemoData();
            window.app.showToast("Demo dataset successfully restored!", "success");
            this.render(document.getElementById("pageContainer"));
        }
    }

    exportAccreditationReport() {
        window.open("portfolio.html?export=naac_report", "_blank");
    }
}

window.adminView = new AdminViewController();
