// ZYNTRIX Enhanced Background Service Worker
// Real-time threat interception and blocking

// Import blocking engine
importScripts('blocking-engine.js');

const API_URL = 'http://localhost:8000';

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
    console.log('🛡️ ZYNTRIX Cyber Safety Shield installed');

    // Set default badge
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });

    // Initialize storage
    chrome.storage.local.set({
        zyntrix_enabled: true,
        zyntrix_stats: {
            totalBlocked: 0,
            totalWarned: 0,
            totalScanned: 0,
            lastReset: Date.now()
        }
    });
});

// Listen for web navigation (before page loads)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    // Only check main frame navigations
    if (details.frameId !== 0) return;

    const url = details.url;

    // Skip internal URLs
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
        url.startsWith('about:') || url.startsWith('edge://')) {
        return;
    }

    console.log('🔍 Checking navigation to:', url);

    // Analyze URL
    const decision = await blockingEngine.analyzeURL(url);

    // Store decision for tab
    await chrome.storage.local.set({
        [`decision_${details.tabId}`]: decision
    });

    // Update badge
    updateBadge(details.tabId, decision);

    // If blocking, inject warning immediately
    if (decision.action === 'block') {
        console.log('🚫 Blocking dangerous URL:', url);

        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '🚫 Dangerous Website Blocked',
            message: `ZYNTRIX blocked ${new URL(url).hostname}\nRisk Score: ${decision.riskScore}/100`,
            priority: 2
        });

        // Inject blocking warning
        setTimeout(() => {
            chrome.tabs.sendMessage(details.tabId, {
                action: 'showBlockingWarning',
                data: decision
            }).catch(err => console.log('Tab not ready yet:', err));
        }, 100);
    } else if (decision.action === 'warn') {
        console.log('⚠️ Warning about suspicious URL:', url);

        // Show warning notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '⚠️ Suspicious Website Detected',
            message: `Be cautious on ${new URL(url).hostname}\nRisk Score: ${decision.riskScore}/100`,
            priority: 1
        });
    }
});

// Listen for tab updates (URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Get stored decision
        const stored = await chrome.storage.local.get(`decision_${tabId}`);
        const decision = stored[`decision_${tabId}`];

        if (decision) {
            updateBadge(tabId, decision);
        }
    }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const stored = await chrome.storage.local.get(`decision_${activeInfo.tabId}`);
    const decision = stored[`decision_${activeInfo.tabId}`];

    if (decision) {
        updateBadge(activeInfo.tabId, decision);
    } else {
        chrome.action.setBadgeText({ text: '✓', tabId: activeInfo.tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId: activeInfo.tabId });
    }
});

// Update extension badge
function updateBadge(tabId, decision) {
    let color, text;

    if (!decision) {
        color = '#6B7280';
        text = '?';
    } else if (decision.action === 'block') {
        color = '#ef4444';
        text = '✗';
    } else if (decision.action === 'warn') {
        color = '#f59e0b';
        text = '⚠';
    } else {
        color = '#10b981';
        text = '✓';
    }

    chrome.action.setBadgeText({ text, tabId });
    chrome.action.setBadgeBackgroundColor({ color, tabId });
}

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request.action);

    switch (request.action) {
        case 'getCurrentDecision':
            handleGetCurrentDecision(sender.tab.id, sendResponse);
            return true;

        case 'analyzeURL':
            handleAnalyzeURL(request.url, sendResponse);
            return true;

        case 'addToWhitelist':
            handleAddToWhitelist(request.url, sendResponse);
            return true;

        case 'addToBlacklist':
            handleAddToBlacklist(request.url, sendResponse);
            return true;

        case 'getStatistics':
            handleGetStatistics(sendResponse);
            return true;

        case 'getSettings':
            handleGetSettings(sendResponse);
            return true;

        case 'updateSettings':
            handleUpdateSettings(request.settings, sendResponse);
            return true;

        case 'getLists':
            handleGetLists(sendResponse);
            return true;

        case 'removeFromWhitelist':
            handleRemoveFromWhitelist(request.domain, sendResponse);
            return true;

        case 'removeFromBlacklist':
            handleRemoveFromBlacklist(request.domain, sendResponse);
            return true;

        case 'checkFormSubmission':
            handleCheckFormSubmission(request.formData, sendResponse);
            return true;
    }
});

// Handler functions
async function handleGetCurrentDecision(tabId, sendResponse) {
    const stored = await chrome.storage.local.get(`decision_${tabId}`);
    sendResponse(stored[`decision_${tabId}`] || null);
}

async function handleAnalyzeURL(url, sendResponse) {
    try {
        const decision = await blockingEngine.analyzeURL(url);
        sendResponse({ success: true, decision });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function handleAddToWhitelist(url, sendResponse) {
    try {
        await blockingEngine.addToWhitelist(url);
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function handleAddToBlacklist(url, sendResponse) {
    try {
        await blockingEngine.addToBlacklist(url);
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function handleGetStatistics(sendResponse) {
    const stats = blockingEngine.getStatistics();
    sendResponse({ success: true, statistics: stats });
}

async function handleGetSettings(sendResponse) {
    const settings = blockingEngine.getSettings();
    sendResponse({ success: true, settings });
}

async function handleUpdateSettings(settings, sendResponse) {
    try {
        await blockingEngine.updateSettings(settings);
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function handleGetLists(sendResponse) {
    const whitelist = blockingEngine.getWhitelist();
    const blacklist = blockingEngine.getBlacklist();
    sendResponse({ success: true, whitelist, blacklist });
}

async function handleRemoveFromWhitelist(domain, sendResponse) {
    try {
        await blockingEngine.removeFromWhitelist(domain);
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function handleRemoveFromBlacklist(domain, sendResponse) {
    try {
        await blockingEngine.removeFromBlacklist(domain);
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

async function handleCheckFormSubmission(formData, sendResponse) {
    try {
        const decision = await blockingEngine.analyzeURL(formData.action);
        sendResponse({ success: true, decision });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

console.log('🛡️ ZYNTRIX Background Service Worker loaded');
