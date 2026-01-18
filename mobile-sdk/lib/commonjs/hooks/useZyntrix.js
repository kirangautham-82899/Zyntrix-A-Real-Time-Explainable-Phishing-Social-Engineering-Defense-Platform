"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useZyntrix = void 0;
var _react = require("react");
var _Zyntrix = _interopRequireDefault(require("../core/Zyntrix"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useZyntrix = () => {
  const [loading, setLoading] = (0, _react.useState)(false);
  const scanUrl = (0, _react.useCallback)(async url => {
    setLoading(true);
    const result = await _Zyntrix.default.getClient().scanUrl(url);
    setLoading(false);
    return result;
  }, []);
  const scanMessage = (0, _react.useCallback)(async text => {
    setLoading(true);
    const result = await _Zyntrix.default.getClient().scanMessage(text);
    setLoading(false);
    return result;
  }, []);
  return {
    scanUrl,
    scanMessage,
    loading
  };
};
exports.useZyntrix = useZyntrix;
//# sourceMappingURL=useZyntrix.js.map