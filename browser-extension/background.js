// ZYNTRIX Background Service Worker

// Configuration
const API_URL = 'http://localhost:8000/api/analyze/url';
let isEnabled = true;

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'check_url') {
        handleUrlCheck(request.url, sendResponse);
        return true; // Will respond asynchronously
    } else if (request.action === 'get_status') {
        sendResponse({ enabled: isEnabled });
    } else if (request.action === 'toggle_status') {
        isEnabled = request.enabled;
        // Save to storage
        chrome.storage.local.set({ enabled: isEnabled });
        sendResponse({ success: true, enabled: isEnabled });
    }
});

// Load initial status
chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled !== undefined) {
        isEnabled = result.enabled;
    }
});

async function handleUrlCheck(url, sendResponse) {
    if (!isEnabled) {
        sendResponse({ status: 'disabled' });
        return;
    }

    // Skip analyzing internal pages
    if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:') || url.includes('localhost:3000') || url.includes('localhost:3001')) {
        console.log('⏭️ Skipping internal URL:', url);
        sendResponse({ status: 'safe', score: 0 });
        return;
    }

    console.log('🔍 Checking URL:', url);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        if (!response.ok) {
            console.error('❌ API Error:', response.statusText);
            sendResponse({ status: 'error' });
            return;
        }

        const data = await response.json();
        console.log('📊 API Response:', data);
        console.log('⚠️ Risk Score:', data.data?.risk_score);

        // LOW THRESHOLD: Block if score > 15
        // This makes extension block ALL suspicious and dangerous URLs
        if (data.data && data.data.risk_score > 15) {
            console.log('🚫 BLOCKING - Risk score too high!');
            sendResponse({
                status: 'dangerous', // Treat both suspicious and dangerous as "dangerous" for blocking
                score: data.data.risk_score,
                details: data.data
            });
        } else {
            console.log('✅ ALLOWING - Risk score acceptable');
            sendResponse({
                status: 'safe',
                score: data.data ? data.data.risk_score : 0
            });
        }

    } catch (error) {
        console.error('❌ Network Error:', error);
        sendResponse({ status: 'error', message: error.message });
    }
}
