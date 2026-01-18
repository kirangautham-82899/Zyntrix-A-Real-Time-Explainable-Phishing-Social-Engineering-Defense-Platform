"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkProtector = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _Zyntrix = _interopRequireDefault(require("../core/Zyntrix"));
var _WarningModal = require("./WarningModal");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const LinkProtector = ({
  url,
  children,
  style
}) => {
  const [modalVisible, setModalVisible] = (0, _react.useState)(false);
  const [threatType, setThreatType] = (0, _react.useState)('suspicious');
  const handlePress = async () => {
    // 1. Scan URL
    const result = await _Zyntrix.default.getClient().scanUrl(url);

    // 2. Check result
    if (result.risk_level === 'dangerous' || result.risk_level === 'suspicious') {
      setThreatType(result.risk_level);
      setModalVisible(true);
    } else {
      // Safe -> Open URL
      _reactNative.Linking.openURL(url);
    }
  };
  const handleProceed = () => {
    setModalVisible(false);
    _reactNative.Linking.openURL(url);
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onPress: handlePress,
    style: style
  }, children), /*#__PURE__*/_react.default.createElement(_WarningModal.WarningModal, {
    visible: modalVisible,
    type: threatType,
    onProceed: handleProceed,
    onGoBack: () => setModalVisible(false)
  }));
};
exports.LinkProtector = LinkProtector;
//# sourceMappingURL=LinkProtector.js.map