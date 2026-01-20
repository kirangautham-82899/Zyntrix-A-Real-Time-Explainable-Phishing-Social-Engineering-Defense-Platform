# ZYNTRIX Real-Time Shield Extension

This is a real-time protection extension for Microsoft Edge and Google Chrome. It monitors the URLs you visit and blocks dangerous sites using the ZYNTRIX Global Threat Engine.

## 🚀 How to Install in Microsoft Edge

1. Open Microsoft Edge.
2. Type `edge://extensions` in the address bar and press Enter.
3. Enable **"Developer mode"** (toggle in the bottom left or top right sidebar).
4. Click **"Load unpacked"**.
5. Select this `browser-extension` folder.
6. The compiled extension will appear in your toolbar (look for a puzzle piece icon if not visible).

## 🛡️ How to Test

1. Ensure your ZYNTRIX backend is running:
   ```bash
   cd backend
   ./start.sh
   ```
2. Click the ZYNTRIX extension icon in the toolbar and ensure "Real-time Monitoring" is ON.
3. Visit a test dangerous URL (or simulate one by modifying the backend logic to flag specifics).
   - Currently, it checks every URL against your local ZYNTRIX API.
   - If the API returns a risk score > 60, a full-screen warning overlay will appear.

## ⚙️ Troubleshooting

- **"API Error"**: Ensure the backend is running at `http://localhost:8000`.
- **Extension not working**: Click "Reload" on the extension card in `edge://extensions` if you make changes.
