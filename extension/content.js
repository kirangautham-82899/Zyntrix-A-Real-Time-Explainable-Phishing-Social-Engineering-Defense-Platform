// ZYNTRIX Enhanced Content Script
// Real-time protection on every webpage

console.log('🛡️ ZYNTRIX Content Script loaded on:', window.location.href);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Content script received:', request.action);

  switch (request.action) {
    case 'showBlockingWarning':
      warningUI.showBlockingWarning(request.data);
      break;
    case 'showWarning':
      showPageWarning(request.data);
      break;
  }
});

// Monitor all link clicks
document.addEventListener('click', async (e) => {
  const link = e.target.closest('a');

  if (!link || !link.href) return;

  // Skip internal links
  if (link.href.startsWith('#') || link.href.startsWith('javascript:')) return;

  // Skip same-domain links
  try {
    const linkURL = new URL(link.href);
    const currentURL = new URL(window.location.href);
    if (linkURL.hostname === currentURL.hostname) return;
  } catch {
    return;
  }

  console.log('🔗 Link clicked:', link.href);

  // Analyze link
  chrome.runtime.sendMessage({
    action: 'analyzeURL',
    url: link.href
  }, (response) => {
    if (response && response.success) {
      const decision = response.decision;

      if (decision.action === 'block') {
        // Prevent navigation
        e.preventDefault();
        e.stopPropagation();

        // Show blocking warning
        warningUI.showBlockingWarning({
          ...decision,
          url: link.href,
          explanation: `This link leads to a dangerous website (${new URL(link.href).hostname}). ZYNTRIX has blocked it to protect you.`,
          factors: decision.factors || [],
          recommendations: decision.recommendations || []
        });
      } else if (decision.action === 'warn') {
        // Show inline warning but allow click
        warningUI.showInlineWarning(link, {
          riskScore: decision.riskScore,
          riskLevel: decision.riskLevel,
          explanation: decision.explanation,
          factors: decision.factors || []
        });
      }
    }
  });
}, true); // Use capture phase to intercept before other handlers

// Monitor form submissions
document.addEventListener('submit', async (e) => {
  const form = e.target;

  if (!form || !form.action) return;

  console.log('📝 Form submission detected:', form.action);

  // Prevent default submission
  e.preventDefault();
  e.stopPropagation();

  // Analyze form action URL
  chrome.runtime.sendMessage({
    action: 'checkFormSubmission',
    formData: {
      action: form.action,
      method: form.method,
      fieldCount: form.elements.length
    }
  }, async (response) => {
    if (response && response.success) {
      const decision = response.decision;

      if (decision.action === 'block' || decision.action === 'warn') {
        // Show form warning and ask for confirmation
        const shouldProceed = await warningUI.showFormWarning(form, {
          riskScore: decision.riskScore,
          riskLevel: decision.riskLevel,
          explanation: decision.explanation
        });

        if (shouldProceed) {
          // User confirmed, submit form
          form.submit();
        }
      } else {
        // Safe form, submit normally
        form.submit();
      }
    } else {
      // Error or no response, allow submission
      form.submit();
    }
  });
}, true);

// Detect and analyze QR codes on the page
function detectQRCodes() {
  // Look for images that might be QR codes
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    // Check if image looks like a QR code (square, reasonable size)
    if (img.width > 50 && img.height > 50 &&
      Math.abs(img.width - img.height) < 20) {

      // Add visual indicator
      if (!img.dataset.zyntrixScanned) {
        img.dataset.zyntrixScanned = 'true';
        img.style.outline = '2px dashed #06b6d4';
        img.title = 'ZYNTRIX: Potential QR code detected. Click to scan.';

        img.addEventListener('click', () => {
          analyzeQRCode(img);
        });
      }
    }
  });
}

// Analyze QR code image
async function analyzeQRCode(img) {
  console.log('📷 Analyzing QR code:', img.src);

  // In a real implementation, we would:
  // 1. Extract the image data
  // 2. Use a QR code library to decode it
  // 3. Analyze the extracted URL

  // For now, show a placeholder
  const notification = document.createElement('div');
  notification.className = 'zyntrix-inline-warning';
  notification.innerHTML = `
        <div class="zyntrix-inline-content">
            <div class="zyntrix-inline-icon">📷</div>
            <div class="zyntrix-inline-text">
                <strong>QR Code Detected</strong>
                <span>Click the ZYNTRIX extension icon to scan this QR code</span>
            </div>
            <button class="zyntrix-inline-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

  img.parentNode.insertBefore(notification, img.nextSibling);
}

// Monitor for dynamically added content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        // Check for new links
        if (node.tagName === 'A' && node.href) {
          // Link monitoring is handled by click event
        }

        // Check for new images (potential QR codes)
        if (node.tagName === 'IMG') {
          setTimeout(() => detectQRCodes(), 500);
        }

        // Check for new forms
        if (node.tagName === 'FORM') {
          // Form monitoring is handled by submit event
        }
      }
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial QR code detection
setTimeout(() => detectQRCodes(), 2000);

// Monitor for fake customer support chats
function detectFakeSupportChats() {
  // Look for common chat widget patterns
  const chatSelectors = [
    '[class*="chat"]',
    '[id*="chat"]',
    '[class*="support"]',
    '[id*="support"]',
    '[class*="messenger"]',
    '[class*="livechat"]'
  ];

  chatSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Check if it's a chat interface
      if (el.offsetHeight > 100 && el.offsetWidth > 200) {
        // Monitor for suspicious patterns in chat
        monitorChatWidget(el);
      }
    });
  });
}

// Monitor chat widget for suspicious behavior
function monitorChatWidget(chatElement) {
  if (chatElement.dataset.zyntrixMonitored) return;
  chatElement.dataset.zyntrixMonitored = 'true';

  console.log('💬 Monitoring chat widget for suspicious activity');

  // Watch for text changes in the chat
  const chatObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        const text = chatElement.textContent.toLowerCase();

        // Check for urgency keywords
        const urgencyKeywords = [
          'urgent', 'immediately', 'right now', 'expire',
          'suspended', 'locked', 'verify now', 'act fast',
          'limited time', 'click here now'
        ];

        const hasUrgency = urgencyKeywords.some(keyword => text.includes(keyword));

        if (hasUrgency) {
          console.log('⚠️ Urgency detected in chat widget');

          // Add warning banner
          if (!chatElement.querySelector('.zyntrix-chat-warning')) {
            const warning = document.createElement('div');
            warning.className = 'zyntrix-chat-warning';
            warning.style.cssText = `
                            background: #f59e0b;
                            color: white;
                            padding: 10px;
                            font-weight: bold;
                            text-align: center;
                            font-size: 12px;
                            border-radius: 4px;
                            margin: 5px;
                        `;
            warning.textContent = '⚠️ ZYNTRIX: This chat is using urgency tactics. Be cautious!';

            chatElement.insertBefore(warning, chatElement.firstChild);
          }
        }
      }
    });
  });

  chatObserver.observe(chatElement, {
    characterData: true,
    childList: true,
    subtree: true
  });
}

// Detect fake support chats periodically
setInterval(() => detectFakeSupportChats(), 5000);

// Show page warning (legacy function for compatibility)
function showPageWarning(data) {
  warningUI.showBlockingWarning(data);
}

// Keyboard shortcut to manually scan current page
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+S or Cmd+Shift+S to scan
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
    e.preventDefault();

    chrome.runtime.sendMessage({
      action: 'analyzeURL',
      url: window.location.href
    }, (response) => {
      if (response && response.success) {
        const decision = response.decision;

        // Show result in a small notification
        const notification = document.createElement('div');
        notification.className = 'zyntrix-inline-warning';
        notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 2147483647;
                    max-width: 400px;
                `;

        const riskColor = decision.riskScore >= 70 ? '#ef4444' :
          decision.riskScore >= 40 ? '#f59e0b' : '#10b981';

        notification.innerHTML = `
                    <div class="zyntrix-inline-content">
                        <div class="zyntrix-inline-icon">🛡️</div>
                        <div class="zyntrix-inline-text">
                            <strong>Page Scan Complete</strong>
                            <span style="color: ${riskColor}">Risk Score: ${decision.riskScore}/100 - ${decision.riskLevel.toUpperCase()}</span>
                        </div>
                        <button class="zyntrix-inline-close" onclick="this.parentElement.parentElement.remove()">×</button>
                    </div>
                `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => notification.remove(), 5000);
      }
    });
  }
});

console.log('✅ ZYNTRIX protection active. Press Ctrl+Shift+S to scan current page.');
