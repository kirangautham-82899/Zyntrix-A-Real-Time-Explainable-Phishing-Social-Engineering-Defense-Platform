// ZYNTRIX Content Script

console.log('ZYNTRIX Shield Active');

// Check the current URL when page loads
const currentUrl = window.location.href;

chrome.runtime.sendMessage({ action: 'check_url', url: currentUrl }, (response) => {
  if (response && response.status === 'dangerous') {
    showWarning(response.score, response.details);
  }
});

function showWarning(score, details) {
  const renderOverlay = () => {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'zyntrix-warning-overlay';

    overlay.innerHTML = `
        <div class="zyntrix-content">
          <div class="zyntrix-icon">⚠️</div>
          <h1 class="zyntrix-title">ZYNTRIX BLOCKED THIS SITE</h1>
          <p class="zyntrix-message">
            This website has been flagged as dangerous by Zyntrix's real-time protection system.
            It may be attempting to steal your personal information or install malware.
            <br><br>
            <span class="zyntrix-score">Risk Score: ${score}/100</span>
          </p>
          <div class="zyntrix-actions">
            <button id="zyntrix-leave-btn" class="zyntrix-btn zyntrix-btn-safe">Back to Safety</button>
            <button id="zyntrix-proceed-btn" class="zyntrix-btn zyntrix-btn-danger">Proceed Anyway (Unsafe)</button>
          </div>
        </div>
      `;

    document.body.appendChild(overlay);

    // Disable scrolling on body
    document.body.style.overflow = 'hidden';

    // Add event listeners
    document.getElementById('zyntrix-leave-btn').addEventListener('click', () => {
      window.history.back();
    });

    document.getElementById('zyntrix-proceed-btn').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = 'auto';
    });
  };

  if (document.body) {
    renderOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', renderOverlay);
  }
}
