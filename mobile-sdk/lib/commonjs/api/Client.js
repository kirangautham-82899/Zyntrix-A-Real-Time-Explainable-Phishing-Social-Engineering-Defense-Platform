"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APIClient = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class APIClient {
  constructor(baseUrl, apiKey) {
    this.apiKey = apiKey;
    this.client = _axios.default.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  async scanUrl(url) {
    try {
      const response = await this.client.post('/api/analyze/url', {
        url
      });
      return {
        risk_level: response.data.risk_level,
        score: response.data.risk_score,
        details: 'Analysis completed successfully'
      };
    } catch (error) {
      console.warn('Zyntrix SDK: URL Scan failed', error);
      // Fail open (assume safe if API fails) to not block user flow unless strict mode
      return {
        risk_level: 'safe',
        score: 0,
        details: 'Scan failed, defaulting to safe'
      };
    }
  }
  async scanMessage(content) {
    try {
      const response = await this.client.post('/api/analyze/sms', {
        sms_content: content
      });
      return {
        risk_level: response.data.risk_level,
        score: response.data.risk_score,
        details: 'Message analysis completed'
      };
    } catch (error) {
      console.warn('Zyntrix SDK: Message Scan failed', error);
      return {
        risk_level: 'safe',
        score: 0,
        details: 'Scan failed, defaulting to safe'
      };
    }
  }
}
exports.APIClient = APIClient;
//# sourceMappingURL=Client.js.map