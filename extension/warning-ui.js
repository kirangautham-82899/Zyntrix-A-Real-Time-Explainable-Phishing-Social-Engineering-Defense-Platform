// ZYNTRIX Warning UI
// Injects beautiful warning overlays and modals into pages

class WarningUI {
    constructor() {
        this.activeWarnings = new Set();
    }

    // Show full-page blocking warning
    showBlockingWarning(data) {
        const warningId = `zyntrix-warning-${Date.now()}`;

        if (this.activeWarnings.has('blocking')) {
            return; // Don't show multiple blocking warnings
        }

        const overlay = document.createElement('div');
        overlay.id = warningId;
        overlay.className = 'zyntrix-warning-overlay';

        overlay.innerHTML = `
            <div class="zyntrix-warning-backdrop"></div>
            <div class="zyntrix-warning-modal blocking">
                <div class="zyntrix-warning-header">
                    <div class="zyntrix-warning-icon danger">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h1 class="zyntrix-warning-title">⛔ DANGER: Threat Detected!</h1>
                    <p class="zyntrix-warning-subtitle">ZYNTRIX AI has blocked this dangerous website</p>
                </div>

                <div class="zyntrix-warning-content">
                    <div class="zyntrix-risk-badge dangerous">
                        <span class="zyntrix-risk-label">Risk Score</span>
                        <span class="zyntrix-risk-score">${data.riskScore}/100</span>
                    </div>

                    <div class="zyntrix-explanation">
                        <h3>Why was this blocked?</h3>
                        <p>${data.explanation || 'This website exhibits multiple characteristics of phishing and malicious content.'}</p>
                    </div>

                    <div class="zyntrix-threat-factors">
                        <h3>🚨 Detected Threats:</h3>
                        <ul>
                            ${(data.factors || []).slice(0, 5).map(factor =>
            `<li><strong>${factor.factor}:</strong> ${factor.description || ''}</li>`
        ).join('')}
                        </ul>
                    </div>

                    <div class="zyntrix-warnings-list">
                        <h3>⚠️ DO NOT:</h3>
                        <ul>
                            <li>Enter passwords or personal information</li>
                            <li>Download any files from this site</li>
                            <li>Click on any links or buttons</li>
                            <li>Provide credit card or banking details</li>
                            <li>Trust any messages or offers</li>
                        </ul>
                    </div>

                    <div class="zyntrix-recommendations">
                        <h3>✅ Recommended Actions:</h3>
                        <ul>
                            ${(data.recommendations || [
                'Return to the previous page immediately',
                'Report this URL to your IT security team',
                'Clear your browser cache and cookies',
                'Run a security scan if you entered any information'
            ]).map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="zyntrix-warning-actions">
                    <button class="zyntrix-btn primary" data-action="go-back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Go Back to Safety
                    </button>
                    <button class="zyntrix-btn secondary" data-action="whitelist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        Trust This Site
                    </button>
                    <button class="zyntrix-btn ghost" data-action="proceed">
                        I Understand the Risks
                    </button>
                </div>

                <div class="zyntrix-warning-footer">
                    <small>🛡️ Protected by ZYNTRIX Cyber Safety Shield</small>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.activeWarnings.add('blocking');

        // Add event listeners
        this.attachEventListeners(overlay, warningId, data);
    }

    // Show inline warning for suspicious links
    showInlineWarning(element, data) {
        const warningId = `zyntrix-inline-${Date.now()}`;

        const warning = document.createElement('div');
        warning.id = warningId;
        warning.className = 'zyntrix-inline-warning';
        warning.innerHTML = `
            <div class="zyntrix-inline-content">
                <div class="zyntrix-inline-icon">⚠️</div>
                <div class="zyntrix-inline-text">
                    <strong>Suspicious Link Detected</strong>
                    <span>Risk Score: ${data.riskScore}/100</span>
                </div>
                <button class="zyntrix-inline-details" data-action="show-details">Details</button>
                <button class="zyntrix-inline-close" data-action="close">×</button>
            </div>
        `;

        element.parentNode.insertBefore(warning, element.nextSibling);

        // Add event listeners
        warning.querySelector('[data-action="close"]').addEventListener('click', () => {
            warning.remove();
        });

        warning.querySelector('[data-action="show-details"]').addEventListener('click', () => {
            this.showDetailModal(data);
        });
    }

    // Show form submission warning
    showFormWarning(formElement, data) {
        return new Promise((resolve) => {
            const warningId = `zyntrix-form-warning-${Date.now()}`;

            const overlay = document.createElement('div');
            overlay.id = warningId;
            overlay.className = 'zyntrix-warning-overlay';

            overlay.innerHTML = `
                <div class="zyntrix-warning-backdrop"></div>
                <div class="zyntrix-warning-modal form-warning">
                    <div class="zyntrix-warning-header">
                        <div class="zyntrix-warning-icon warning">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h1 class="zyntrix-warning-title">⚠️ Suspicious Form Detected</h1>
                        <p class="zyntrix-warning-subtitle">This form may be attempting to steal your information</p>
                    </div>

                    <div class="zyntrix-warning-content">
                        <div class="zyntrix-risk-badge suspicious">
                            <span class="zyntrix-risk-label">Risk Score</span>
                            <span class="zyntrix-risk-score">${data.riskScore}/100</span>
                        </div>

                        <div class="zyntrix-explanation">
                            <p>You're about to submit information to a potentially dangerous website. Are you sure you want to continue?</p>
                        </div>

                        <div class="zyntrix-form-details">
                            <h3>Form Details:</h3>
                            <ul>
                                <li><strong>Action URL:</strong> <code>${formElement.action || 'Unknown'}</code></li>
                                <li><strong>Method:</strong> ${formElement.method || 'GET'}</li>
                                <li><strong>Fields:</strong> ${formElement.elements.length} input fields</li>
                            </ul>
                        </div>
                    </div>

                    <div class="zyntrix-warning-actions">
                        <button class="zyntrix-btn primary" data-action="cancel">
                            Cancel Submission
                        </button>
                        <button class="zyntrix-btn ghost" data-action="proceed">
                            Submit Anyway
                        </button>
                    </div>

                    <div class="zyntrix-warning-footer">
                        <small>🛡️ Protected by ZYNTRIX</small>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                overlay.remove();
                resolve(false);
            });

            overlay.querySelector('[data-action="proceed"]').addEventListener('click', () => {
                overlay.remove();
                resolve(true);
            });
        });
    }

    // Show detail modal for inline warnings
    showDetailModal(data) {
        const modal = document.createElement('div');
        modal.className = 'zyntrix-warning-overlay';
        modal.innerHTML = `
            <div class="zyntrix-warning-backdrop"></div>
            <div class="zyntrix-warning-modal detail-modal">
                <div class="zyntrix-warning-header">
                    <h2>Threat Analysis Details</h2>
                    <button class="zyntrix-close-btn" data-action="close">×</button>
                </div>
                <div class="zyntrix-warning-content">
                    <div class="zyntrix-risk-badge ${data.riskLevel}">
                        <span class="zyntrix-risk-label">Risk Level</span>
                        <span class="zyntrix-risk-score">${data.riskScore}/100</span>
                    </div>
                    <div class="zyntrix-explanation">
                        <h3>Analysis:</h3>
                        <p>${data.explanation || 'No detailed explanation available.'}</p>
                    </div>
                    ${data.factors && data.factors.length > 0 ? `
                        <div class="zyntrix-threat-factors">
                            <h3>Detected Factors:</h3>
                            <ul>
                                ${data.factors.map(f => `<li>${f.factor}: ${f.description || ''}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="zyntrix-warning-actions">
                    <button class="zyntrix-btn primary" data-action="close">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
    }

    // Attach event listeners to warning overlay
    attachEventListeners(overlay, warningId, data) {
        const goBackBtn = overlay.querySelector('[data-action="go-back"]');
        const whitelistBtn = overlay.querySelector('[data-action="whitelist"]');
        const proceedBtn = overlay.querySelector('[data-action="proceed"]');

        if (goBackBtn) {
            goBackBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

        if (whitelistBtn) {
            whitelistBtn.addEventListener('click', async () => {
                // Send message to background to whitelist
                chrome.runtime.sendMessage({
                    action: 'addToWhitelist',
                    url: window.location.href
                }, (response) => {
                    if (response && response.success) {
                        overlay.remove();
                        this.activeWarnings.delete('blocking');
                        window.location.reload();
                    }
                });
            });
        }

        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                // Show confirmation
                if (confirm('Are you absolutely sure you want to proceed? This site has been identified as dangerous.')) {
                    overlay.remove();
                    this.activeWarnings.delete('blocking');
                }
            });
        }
    }

    // Remove all warnings
    clearWarnings() {
        document.querySelectorAll('.zyntrix-warning-overlay, .zyntrix-inline-warning').forEach(el => {
            el.remove();
        });
        this.activeWarnings.clear();
    }
}

// Create singleton instance
const warningUI = new WarningUI();
