// ZYNTRIX Blocking Engine
// Core logic for real-time threat blocking and decision making

class BlockingEngine {
    constructor() {
        this.API_URL = 'http://localhost:8000';
        this.threatCache = new Map(); // URL -> {riskLevel, riskScore, timestamp}
        this.whitelist = new Set();
        this.blacklist = new Set();
        this.settings = {
            protectionEnabled: true,
            blockThreshold: 70, // Block if risk score >= 70
            warnThreshold: 40,  // Warn if risk score >= 40
            autoBlock: true,    // Auto-block dangerous sites
            cacheExpiry: 3600000 // 1 hour in ms
        };
        this.statistics = {
            totalBlocked: 0,
            totalWarned: 0,
            totalScanned: 0,
            lastReset: Date.now()
        };

        this.loadSettings();
        this.loadLists();
        this.loadStatistics();
    }

    // Load settings from storage
    async loadSettings() {
        const stored = await chrome.storage.local.get('zyntrix_settings');
        if (stored.zyntrix_settings) {
            this.settings = { ...this.settings, ...stored.zyntrix_settings };
        }
    }

    // Save settings to storage
    async saveSettings() {
        await chrome.storage.local.set({ zyntrix_settings: this.settings });
    }

    // Load whitelist and blacklist
    async loadLists() {
        const stored = await chrome.storage.local.get(['zyntrix_whitelist', 'zyntrix_blacklist']);
        if (stored.zyntrix_whitelist) {
            this.whitelist = new Set(stored.zyntrix_whitelist);
        }
        if (stored.zyntrix_blacklist) {
            this.blacklist = new Set(stored.zyntrix_blacklist);
        }
    }

    // Save lists to storage
    async saveLists() {
        await chrome.storage.local.set({
            zyntrix_whitelist: Array.from(this.whitelist),
            zyntrix_blacklist: Array.from(this.blacklist)
        });
    }

    // Load statistics
    async loadStatistics() {
        const stored = await chrome.storage.local.get('zyntrix_stats');
        if (stored.zyntrix_stats) {
            this.statistics = { ...this.statistics, ...stored.zyntrix_stats };
        }
    }

    // Save statistics
    async saveStatistics() {
        await chrome.storage.local.set({ zyntrix_stats: this.statistics });
    }

    // Extract domain from URL
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return null;
        }
    }

    // Check if URL is in whitelist
    isWhitelisted(url) {
        const domain = this.extractDomain(url);
        return domain && this.whitelist.has(domain);
    }

    // Check if URL is in blacklist
    isBlacklisted(url) {
        const domain = this.extractDomain(url);
        return domain && this.blacklist.has(domain);
    }

    // Add to whitelist
    async addToWhitelist(url) {
        const domain = this.extractDomain(url);
        if (domain) {
            this.whitelist.add(domain);
            await this.saveLists();
            return true;
        }
        return false;
    }

    // Add to blacklist
    async addToBlacklist(url) {
        const domain = this.extractDomain(url);
        if (domain) {
            this.blacklist.add(domain);
            await this.saveLists();
            return true;
        }
        return false;
    }

    // Remove from whitelist
    async removeFromWhitelist(domain) {
        this.whitelist.delete(domain);
        await this.saveLists();
    }

    // Remove from blacklist
    async removeFromBlacklist(domain) {
        this.blacklist.delete(domain);
        await this.saveLists();
    }

    // Check cache for URL
    getCachedThreat(url) {
        const cached = this.threatCache.get(url);
        if (cached) {
            const age = Date.now() - cached.timestamp;
            if (age < this.settings.cacheExpiry) {
                return cached;
            } else {
                this.threatCache.delete(url);
            }
        }
        return null;
    }

    // Cache threat result
    cacheThreat(url, riskLevel, riskScore) {
        this.threatCache.set(url, {
            riskLevel,
            riskScore,
            timestamp: Date.now()
        });
    }

    // Analyze URL for threats
    async analyzeURL(url) {
        // Skip internal URLs
        if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
            url.startsWith('about:') || url.startsWith('edge://')) {
            return { action: 'allow', reason: 'internal_url' };
        }

        // Check whitelist first
        if (this.isWhitelisted(url)) {
            return { action: 'allow', reason: 'whitelisted' };
        }

        // Check blacklist
        if (this.isBlacklisted(url)) {
            this.statistics.totalBlocked++;
            await this.saveStatistics();
            return {
                action: 'block',
                reason: 'blacklisted',
                riskLevel: 'dangerous',
                riskScore: 100
            };
        }

        // Check cache
        const cached = this.getCachedThreat(url);
        if (cached) {
            return this.makeDecision(url, cached.riskLevel, cached.riskScore, true);
        }

        // Call API for analysis
        try {
            const response = await fetch(`${this.API_URL}/api/analyze/url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                console.error('API error:', response.status);
                return { action: 'allow', reason: 'api_error' };
            }

            const result = await response.json();

            if (result.success && result.data) {
                const { risk_level, risk_score } = result.data;

                // Cache the result
                this.cacheThreat(url, risk_level, risk_score);

                // Make blocking decision
                return this.makeDecision(url, risk_level, risk_score, false);
            }
        } catch (error) {
            console.error('Error analyzing URL:', error);
            return { action: 'allow', reason: 'api_error' };
        }

        return { action: 'allow', reason: 'no_threat' };
    }

    // Make blocking decision based on risk
    makeDecision(url, riskLevel, riskScore, fromCache) {
        this.statistics.totalScanned++;

        const decision = {
            url,
            riskLevel,
            riskScore,
            fromCache,
            timestamp: Date.now()
        };

        // Auto-block dangerous sites if enabled
        if (this.settings.autoBlock && riskScore >= this.settings.blockThreshold) {
            this.statistics.totalBlocked++;
            this.saveStatistics();
            return { ...decision, action: 'block', reason: 'high_risk' };
        }

        // Warn for suspicious sites
        if (riskScore >= this.settings.warnThreshold) {
            this.statistics.totalWarned++;
            this.saveStatistics();
            return { ...decision, action: 'warn', reason: 'suspicious' };
        }

        // Allow safe sites
        return { ...decision, action: 'allow', reason: 'safe' };
    }

    // Update settings
    async updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        await this.saveSettings();
    }

    // Get current settings
    getSettings() {
        return { ...this.settings };
    }

    // Get statistics
    getStatistics() {
        return { ...this.statistics };
    }

    // Reset statistics
    async resetStatistics() {
        this.statistics = {
            totalBlocked: 0,
            totalWarned: 0,
            totalScanned: 0,
            lastReset: Date.now()
        };
        await this.saveStatistics();
    }

    // Get today's statistics
    getTodayStatistics() {
        const today = new Date().setHours(0, 0, 0, 0);
        if (this.statistics.lastReset < today) {
            return {
                totalBlocked: 0,
                totalWarned: 0,
                totalScanned: 0
            };
        }
        return this.getStatistics();
    }

    // Clear cache
    clearCache() {
        this.threatCache.clear();
    }

    // Get whitelist
    getWhitelist() {
        return Array.from(this.whitelist);
    }

    // Get blacklist
    getBlacklist() {
        return Array.from(this.blacklist);
    }
}

// Create singleton instance
const blockingEngine = new BlockingEngine();
