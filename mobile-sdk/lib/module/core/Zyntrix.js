import { APIClient } from '../api/Client';
class Zyntrix {
  client = null;
  config = null;
  constructor() {}
  static getInstance() {
    if (!Zyntrix.instance) {
      Zyntrix.instance = new Zyntrix();
    }
    return Zyntrix.instance;
  }
  initialize(config) {
    this.config = {
      baseUrl: 'http://localhost:8000',
      // Default relative to where it runs, likely needs IP in real RN app
      ...config
    };
    this.client = new APIClient(this.config.baseUrl, this.config.apiKey);
    if (this.config.debug) {
      console.log('Zyntrix SDK Initialized with config:', this.config);
    }
  }
  getClient() {
    if (!this.client) {
      throw new Error("Zyntrix SDK not initialized. Call Zyntrix.getInstance().initialize() first.");
    }
    return this.client;
  }
}
export default Zyntrix.getInstance();
//# sourceMappingURL=Zyntrix.js.map