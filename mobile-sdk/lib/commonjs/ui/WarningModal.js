"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WarningModal = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const WarningModal = ({
  visible,
  type,
  details,
  onProceed,
  onGoBack
}) => {
  const isDangerous = type === 'dangerous';
  const bgColor = isDangerous ? '#ef4444' : '#f59e0b';
  const title = isDangerous ? 'DANGEROUS SITE BLOCKED' : 'SUSPICIOUS SITE DETECTED';
  return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    animationType: "slide",
    transparent: true,
    visible: visible,
    onRequestClose: onGoBack
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.centeredView
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.modalView
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.header, {
      backgroundColor: bgColor
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.icon
  }, "\u26A0\uFE0F")), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.content
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.title, {
      color: bgColor
    }]
  }, title), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.description
  }, "ZYNTRIX has identified potential threats on this page."), details && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.details
  }, details), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.button, styles.primaryButton, {
      backgroundColor: bgColor
    }],
    onPress: onGoBack
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.buttonText
  }, "Go Back to Safety")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.textButton,
    onPress: onProceed
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.textButtonText, {
      color: '#6b7280'
    }]
  }, "I understand the risk, proceed anyway"))))));
};
exports.WarningModal = WarningModal;
const styles = _reactNative.StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalView: {
    width: '85%',
    backgroundColor: '#1f2937',
    // Dark gray
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: 40
  },
  content: {
    padding: 20,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  details: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  button: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10
  },
  primaryButton: {
    elevation: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  textButton: {
    padding: 10
  },
  textButtonText: {
    fontSize: 12,
    textDecorationLine: 'underline'
  }
});
//# sourceMappingURL=WarningModal.js.map