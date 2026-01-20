// Popup Logic requests status from background script
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle-switch');
    const statusText = document.getElementById('status-text');
    const statusIcon = document.getElementById('status-icon');
    const statusCard = document.getElementById('status-card');

    // Get initial status
    chrome.runtime.sendMessage({ action: 'get_status' }, (response) => {
        if (response) {
            updateUI(response.enabled);
        }
    });

    // Handle toggle change
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.runtime.sendMessage({ action: 'toggle_status', enabled: isEnabled }, (response) => {
            if (response && response.success) {
                updateUI(isEnabled);
            }
        });
    });

    function updateUI(enabled) {
        toggle.checked = enabled;
        if (enabled) {
            statusText.textContent = 'Protection Active';
            statusIcon.textContent = '🛡️';
            statusText.style.color = '#10b981';
            statusCard.style.borderColor = '#10b981';
            statusCard.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.1)';
        } else {
            statusText.textContent = 'Protection Paused';
            statusIcon.textContent = '⚠️';
            statusText.style.color = '#f59e0b';
            statusCard.style.borderColor = '#f59e0b';
            statusCard.style.boxShadow = 'none';
        }
    }
});
