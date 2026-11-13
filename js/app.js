/**
 * Main Application Coordinator & Routing
 */

class AppController {
    constructor() {
        this.currentView = "student"; // 'student' | 'faculty' | 'admin'
    }

    async init() {
        this.bindEvents();
        this.updateRoleUI();
        await this.renderCurrentView();
    }

    bindEvents() {
        // Quick Role Switcher
        const roleSelect = document.getElementById("demoRoleSelect");
        if (roleSelect) {
            roleSelect.addEventListener("change", (e) => {
                this.switchUserRole(e.target.value);
            });
        }
    }

    switchUserRole(role) {
        const users = apiService.getStoredUsers();
        let targetUser = users.find(u => u.role === role);
        if (!targetUser) targetUser = users[0];

        apiService.setCurrentUser(targetUser);
        this.currentView = role.toLowerCase();
        this.updateRoleUI();
        this.renderCurrentView();
        this.showToast(`Switched view to ${targetUser.name} (${role})`, "info");
    }

    updateRoleUI() {
        const currentUser = apiService.getCurrentUser();
        const roleBadge = document.getElementById("topbarRoleBadge");
        const userName = document.getElementById("topbarUserName");
        const userDept = document.getElementById("topbarUserDept");
        const roleSelect = document.getElementById("demoRoleSelect");

        if (roleBadge) {
            roleBadge.className = `role-badge-pill role-badge-${currentUser.role.toLowerCase()}`;
            roleBadge.innerHTML = `<span class="pulse-dot"></span> ${currentUser.role} PORTAL`;
        }

        if (userName) userName.textContent = currentUser.name;
        if (userDept) userDept.textContent = currentUser.rollNumber ? `${currentUser.rollNumber} - ${currentUser.department}` : currentUser.department;
        if (roleSelect) roleSelect.value = currentUser.role;

        // Update nav items
        document.querySelectorAll(".nav-item").forEach(item => {
            if (item.getAttribute("data-view") === currentUser.role.toLowerCase()) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }

    async renderCurrentView() {
        const container = document.getElementById("pageContainer");
        if (!container) return;

        const currentUser = apiService.getCurrentUser();
        if (currentUser.role === "STUDENT") {
            await window.studentView.render(container);
        } else if (currentUser.role === "FACULTY") {
            await window.facultyView.render(container);
        } else if (currentUser.role === "ADMIN") {
            await window.adminView.render(container);
        }
    }

    // --- Pipeline Modal Management ---
    openPipelineModal() {
        const modal = document.getElementById("pipelineModal");
        const container = document.getElementById("pipelineStepsContainer");
        const finishContainer = document.getElementById("pipelineResultArea");

        if (finishContainer) finishContainer.style.display = "none";
        if (container) {
            container.innerHTML = `
                <div class="pipeline-step-item active" id="pipeStep1">
                    <div class="step-circle">1</div>
                    <div class="step-details">
                        <div class="step-title">SHA-256 Duplicate Check</div>
                        <div class="step-desc">Computing cryptographic checksum and querying document hashes...</div>
                    </div>
                </div>
                <div class="pipeline-step-item" id="pipeStep2">
                    <div class="step-circle">2</div>
                    <div class="step-details">
                        <div class="step-title">Text Extraction (OCR & PDFBox)</div>
                        <div class="step-desc">Awaiting OCR stream extraction...</div>
                    </div>
                </div>
                <div class="pipeline-step-item" id="pipeStep3">
                    <div class="step-circle">3</div>
                    <div class="step-details">
                        <div class="step-title">Information Extraction with AI</div>
                        <div class="step-desc">Awaiting structured entity analysis...</div>
                    </div>
                </div>
                <div class="pipeline-step-item" id="pipeStep4">
                    <div class="step-circle">4</div>
                    <div class="step-details">
                        <div class="step-title">Rule-Based Profile Validation</div>
                        <div class="step-desc">Awaiting student name and date validation...</div>
                    </div>
                </div>
                <div class="pipeline-step-item" id="pipeStep5">
                    <div class="step-circle">5</div>
                    <div class="step-details">
                        <div class="step-title">Confidence Scoring Matrix</div>
                        <div class="step-desc">Synthesizing verification parameters...</div>
                    </div>
                </div>
                <div class="pipeline-step-item" id="pipeStep6">
                    <div class="step-circle">6</div>
                    <div class="step-details">
                        <div class="step-title">Decision Routing Policy</div>
                        <div class="step-desc">Applying institutional thresholds...</div>
                    </div>
                </div>
            `;
        }

        if (modal) modal.classList.add("active");
    }

    updatePipelineStep(stepNum, title, desc) {
        for (let i = 1; i <= 6; i++) {
            const stepEl = document.getElementById(`pipeStep${i}`);
            if (!stepEl) continue;

            if (i < stepNum) {
                stepEl.className = "pipeline-step-item completed";
                stepEl.querySelector(".step-circle").innerHTML = "&check;";
            } else if (i === stepNum) {
                stepEl.className = "pipeline-step-item active";
                stepEl.querySelector(".step-title").textContent = title;
                stepEl.querySelector(".step-desc").textContent = desc;
            } else {
                stepEl.className = "pipeline-step-item";
            }
        }
    }

    finishPipelineStep(result, activity) {
        // Mark all steps completed
        for (let i = 1; i <= 6; i++) {
            const stepEl = document.getElementById(`pipeStep${i}`);
            if (stepEl) {
                stepEl.className = result.status === "DUPLICATE_FLAGGED" ? (i === 1 ? "pipeline-step-item failed" : "pipeline-step-item") : "pipeline-step-item completed";
                if (result.status !== "DUPLICATE_FLAGGED" || i !== 1) {
                    stepEl.querySelector(".step-circle").innerHTML = "&check;";
                } else {
                    stepEl.querySelector(".step-circle").innerHTML = "&times;";
                }
            }
        }

        const finishContainer = document.getElementById("pipelineResultArea");
        if (finishContainer) {
            const isAutoApproved = result.status === "AUTO_APPROVED";
            const isDuplicate = result.status === "DUPLICATE_FLAGGED";

            finishContainer.innerHTML = `
                <div style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 12px; background: ${isAutoApproved ? '#ecfdf5' : (isDuplicate ? '#fdf2f8' : '#fffbeb')}; border: 1px solid ${isAutoApproved ? '#a7f3d0' : (isDuplicate ? '#fbcfe8' : '#fde68a')};">
                    <div class="flex items-center justify-between">
                        <div style="font-size: 1.1rem; font-weight: 800; color: ${isAutoApproved ? '#065f46' : (isDuplicate ? '#9d174d' : '#92400e')};">
                            ${result.decision}
                        </div>
                        <span class="score-tag ${result.confidenceScore >= 85 ? 'score-high' : (result.confidenceScore >= 50 ? 'score-medium' : 'score-low')}" style="font-size: 1rem; width: 50px; height: 32px;">
                            ${result.confidenceScore}%
                        </span>
                    </div>
                    <div style="font-size: 0.85rem; color: #475569; margin-top: 6px;">
                        ${isAutoApproved ? 'This submission met all automated verification criteria and has been added directly to your verified academic record.' : (isDuplicate ? 'File checksum was found in the database under another record. This certificate cannot be re-uploaded.' : 'This submission had an average confidence score or missing digital seal and has been forwarded to your Departmental Faculty Review Queue.')}
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 8px; justify-content: flex-end;">
                        <button class="btn btn-secondary btn-sm" onclick="window.app.closePipelineModal()">Close</button>
                        <button class="btn btn-primary btn-sm" onclick="window.app.closePipelineModal(); window.app.viewActivityDetails('${activity.id}')">View Full Audit Details</button>
                    </div>
                </div>
            `;
            finishContainer.style.display = "block";
        }
    }

    closePipelineModal() {
        const modal = document.getElementById("pipelineModal");
        if (modal) modal.classList.remove("active");
    }

    // --- Detail Inspection Modal ---
    async viewActivityDetails(activityId) {
        const activity = await apiService.getActivityById(activityId);
        if (!activity) return;

        const modal = document.getElementById("inspectModal");
        const body = document.getElementById("inspectModalBody");
        if (!modal || !body) return;

        const score = activity.verification?.confidenceScore || 0;
        const checks = activity.verification?.checks || [];

        body.innerHTML = `
            <div class="flex justify-between items-center" style="margin-bottom: 1.25rem;">
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">${activity.title}</h2>
                    <div style="font-size: 0.8rem; color: #64748b;">${activity.studentName} (${activity.rollNumber}) &bull; ${activity.department}</div>
                </div>
                <div>
                    ${window.studentView.getStatusBadge(activity.verification?.status)}
                </div>
            </div>

            <div class="confidence-meter" style="--score-pct: ${score};">
                <div class="meter-info">
                    <div class="meter-title">AI Multi-Factor Analysis</div>
                    <div class="meter-decision">${activity.verification?.decision || 'Status Verified'}</div>
                    <div class="meter-sub">Verified at: ${new Date(activity.verification?.verifiedAt || Date.now()).toLocaleString()}</div>
                </div>
                <div class="meter-circle-wrap">
                    <div class="meter-circle-inner">
                        <span class="meter-circle-val">${score}%</span>
                        <span class="meter-circle-lbl">Confidence</span>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid var(--gray-200);">
                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Issuing Organization</div>
                    <div style="font-size: 0.95rem; font-weight: 600; color: #1e293b; margin-top: 2px;">${activity.organization}</div>
                </div>
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid var(--gray-200);">
                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Event Date & Category</div>
                    <div style="font-size: 0.95rem; font-weight: 600; color: #1e293b; margin-top: 2px;">${activity.eventDate} (${activity.category})</div>
                </div>
            </div>

            <div style="background: #0f172a; padding: 12px; border-radius: 8px; color: #38bdf8; font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 1.25rem;">
                <strong>Document SHA-256 Checksum:</strong> ${activity.certificate?.fileHash || 'Verified'}
            </div>

            <div style="font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Pipeline Integrity Checks:</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                ${checks.map(c => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px; font-size: 0.8rem; border: 1px solid var(--gray-200);">
                        <span>${c.passed ? '<span style="color:var(--success); font-weight:bold;">&check;</span>' : '<span style="color:var(--danger); font-weight:bold;">&times;</span>'} <strong>${c.name}</strong></span>
                        <span style="color: #64748b;">${c.detail}</span>
                    </div>
                `).join('')}
            </div>

            ${activity.verification?.facultyReview ? `
                <div style="margin-top: 1.25rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px;">
                    <div style="font-weight: 700; color: #1e40af; font-size: 0.85rem;">Faculty Review Sign-Off:</div>
                    <div style="font-size: 0.8rem; color: #1e3a8a; margin-top: 2px;">Reviewed by: <strong>${activity.verification.facultyReview.reviewedBy}</strong></div>
                    <div style="font-size: 0.8rem; color: #3b82f6; margin-top: 4px; font-style: italic;">"${activity.verification.facultyReview.comments}"</div>
                </div>
            ` : ''}
        `;

        modal.classList.add("active");
    }

    closeInspectModal() {
        const modal = document.getElementById("inspectModal");
        if (modal) modal.classList.remove("active");
    }

    openPortfolio(studentId) {
        window.open(`portfolio.html?studentId=${studentId}`, '_blank');
    }

    showToast(message, type = "info") {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div style="flex: 1;">${message}</div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
}

window.app = new AppController();
window.addEventListener("DOMContentLoaded", () => {
    window.app.init();
});
