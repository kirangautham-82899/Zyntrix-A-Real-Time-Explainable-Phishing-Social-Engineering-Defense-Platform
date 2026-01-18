// ZYNTRIX Enhanced Popup Script
// Displays protection status, statistics, and settings

document.addEventListener('DOMContentLoaded', async () => {
  await loadPopup();
});

async function loadPopup() {
  const contentDiv = document.getElementById('content');

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      showError('Unable to access current tab');
      return;
    }

    // Skip chrome:// URLs
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') ||
      tab.url.startsWith('about:') || tab.url.startsWith('edge://')) {
      showInfo('Internal pages are not scanned');
      return;
    }

    // Get current decision
    chrome.runtime.sendMessage(
      { action: 'getCurrentDecision' },
      async (decision) => {
        // Get statistics
        chrome.runtime.sendMessage(
          { action: 'getStatistics' },
          (statsResponse) => {
            const stats = statsResponse?.statistics || {
              totalBlocked: 0,
              totalWarned: 0,
              totalScanned: 0
            };

            displayResult(decision, tab.url, stats);
          }
        );
      }
    );

  } catch (error) {
    console.error('Error:', error);
    showError('Failed to load protection status');
  }
}

function displayResult(decision, url, stats) {
  const contentDiv = document.getElementById('content');

  const riskClass = decision?.riskLevel || 'unknown';
  const riskScore = decision?.riskScore || 0;

  const riskIcon = {
    'safe': '✅',
    'suspicious': '⚠️',
    'dangerous': '❌',
    'unknown': '🔍'
  }[riskClass] || '❓';

  const riskText = {
    'safe': 'Safe to Browse',
    'suspicious': 'Proceed with Caution',
    'dangerous': 'DANGER: Blocked',
    'unknown': 'Analyzing...'
  }[riskClass] || 'Unknown';

  const riskColor = {
    'safe': '#10b981',
    'suspicious': '#f59e0b',
    'dangerous': '#ef4444',
    'unknown': '#6b7280'
  }[riskClass] || '#6b7280';

  const domain = new URL(url).hostname;

  contentDiv.innerHTML = `
        <!-- Protection Status -->
        <div class="status-card ${riskClass}">
            <div class="status-icon">${riskIcon}</div>
            <div class="status-text" style="color: ${riskColor}">${riskText}</div>
            <div class="risk-score">Risk Score: ${riskScore}/100</div>
            ${decision?.fromCache ? '<div class="cache-badge">⚡ Cached Result</div>' : ''}
        </div>

        <!-- Current URL -->
        <div class="url-display">
            <strong>Current Domain:</strong><br>
            <span class="domain-text">${domain}</span>
        </div>

        <!-- Today's Statistics -->
        <div class="stats-header">📊 Today's Protection</div>
        <div class="stats">
            <div class="stat-box blocked">
                <div class="stat-value">${stats.totalBlocked || 0}</div>
                <div class="stat-label">Blocked</div>
            </div>
            <div class="stat-box warned">
                <div class="stat-value">${stats.totalWarned || 0}</div>
                <div class="stat-label">Warned</div>
            </div>
            <div class="stat-box scanned">
                <div class="stat-value">${stats.totalScanned || 0}</div>
                <div class="stat-label">Scanned</div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions">
            <button class="btn btn-primary" id="rescan-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                Rescan Page
            </button>
            
            ${riskClass === 'dangerous' || riskClass === 'suspicious' ? `
                <button class="btn btn-success" id="whitelist-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    Trust This Site
                </button>
            ` : ''}
            
            ${riskClass === 'safe' ? `
                <button class="btn btn-danger" id="blacklist-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Block This Site
                </button>
            ` : ''}
        </div>

        <!-- Quick Links -->
        <div class="quick-links">
            <button class="link-btn" id="dashboard-btn">
                📊 Dashboard
            </button>
            <button class="link-btn" id="settings-btn">
                ⚙️ Settings
            </button>
            <button class="link-btn" id="history-btn">
                📜 History
            </button>
        </div>

        <!-- Settings Toggle -->
        <div class="settings-section" id="settings-section" style="display: none;">
            <div class="settings-header">⚙️ Protection Settings</div>
            
            <div class="setting-item">
                <label class="toggle-label">
                    <input type="checkbox" id="protection-toggle" checked>
                    <span class="toggle-slider"></span>
                    <span class="toggle-text">Real-time Protection</span>
                </label>
            </div>
            
            <div class="setting-item">
                <label class="toggle-label">
                    <input type="checkbox" id="autoblock-toggle" checked>
                    <span class="toggle-slider"></span>
                    <span class="toggle-text">Auto-block Dangerous Sites</span>
                </label>
            </div>
            
            <div class="setting-item">
                <label for="threshold-slider">Block Threshold: <span id="threshold-value">70</span></label>
                <input type="range" id="threshold-slider" min="0" max="100" value="70" class="slider">
            </div>
            
            <button class="btn btn-secondary" id="save-settings-btn">
                Save Settings
            </button>
        </div>
    `;

  // Add event listeners
  setupEventListeners(url);
}

function setupEventListeners(url) {
  // Rescan button
  const rescanBtn = document.getElementById('rescan-btn');
  if (rescanBtn) {
    rescanBtn.addEventListener('click', async () => {
      rescanBtn.disabled = true;
      rescanBtn.innerHTML = '<div class="btn-spinner"></div> Scanning...';

      chrome.runtime.sendMessage(
        { action: 'analyzeURL', url: url },
        () => {
          setTimeout(() => loadPopup(), 500);
        }
      );
    });
  }

  // Whitelist button
  const whitelistBtn = document.getElementById('whitelist-btn');
  if (whitelistBtn) {
    whitelistBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage(
        { action: 'addToWhitelist', url: url },
        (response) => {
          if (response?.success) {
            showSuccess('Site added to whitelist');
            setTimeout(() => loadPopup(), 1000);
          }
        }
      );
    });
  }

  // Blacklist button
  const blacklistBtn = document.getElementById('blacklist-btn');
  if (blacklistBtn) {
    blacklistBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to block this site?')) {
        chrome.runtime.sendMessage(
          { action: 'addToBlacklist', url: url },
          (response) => {
            if (response?.success) {
              showSuccess('Site added to blacklist');
              setTimeout(() => loadPopup(), 1000);
            }
          }
        );
      }
    });
  }

  // Dashboard button
  const dashboardBtn = document.getElementById('dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    });
  }

  // Settings button
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      const settingsSection = document.getElementById('settings-section');
      if (settingsSection.style.display === 'none') {
        settingsSection.style.display = 'block';
        loadSettings();
      } else {
        settingsSection.style.display = 'none';
      }
    });
  }

  // History button
  const historyBtn = document.getElementById('history-btn');
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:3000/history' });
    });
  }

  // Threshold slider
  const thresholdSlider = document.getElementById('threshold-slider');
  const thresholdValue = document.getElementById('threshold-value');
  if (thresholdSlider && thresholdValue) {
    thresholdSlider.addEventListener('input', (e) => {
      thresholdValue.textContent = e.target.value;
    });
  }

  // Save settings button
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveSettings);
  }
}

function loadSettings() {
  chrome.runtime.sendMessage(
    { action: 'getSettings' },
    (response) => {
      if (response?.success) {
        const settings = response.settings;

        document.getElementById('protection-toggle').checked = settings.protectionEnabled;
        document.getElementById('autoblock-toggle').checked = settings.autoBlock;
        document.getElementById('threshold-slider').value = settings.blockThreshold;
        document.getElementById('threshold-value').textContent = settings.blockThreshold;
      }
    }
  );
}

function saveSettings() {
  const settings = {
    protectionEnabled: document.getElementById('protection-toggle').checked,
    autoBlock: document.getElementById('autoblock-toggle').checked,
    blockThreshold: parseInt(document.getElementById('threshold-slider').value)
  };

  chrome.runtime.sendMessage(
    { action: 'updateSettings', settings: settings },
    (response) => {
      if (response?.success) {
        showSuccess('Settings saved successfully');
      }
    }
  );
}

function showInfo(message) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = `
        <div class="status-card">
            <div class="status-icon">ℹ️</div>
            <div class="status-text">${message}</div>
        </div>
    `;
}

function showError(message) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = `
        <div class="status-card dangerous">
            <div class="status-icon">⚠️</div>
            <div class="status-text">Error</div>
            <div class="risk-score">${message}</div>
        </div>
    `;
}

function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}
