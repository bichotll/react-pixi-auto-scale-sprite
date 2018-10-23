"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactPixi = require("@inlet/react-pixi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AutoScaleSprite extends _react.default.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      visible: false,
      height: 0,
      width: 0
    });
  }

  componentWillMount() {
    this.checkTexture();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.visible && this.state.visible) {
      if (typeof this.props.onTextureScale === 'function') {
        this.props.onTextureScale();
      }
    }
  }

  checkTexture() {
    const {
      texture
    } = this.props;

    if (texture.baseTexture.hasLoaded) {
      this.setTextureScale();
    } else {
      texture.baseTexture.on('load', () => {
        this.setTextureScale();
      });
      texture.baseTexture.on('update', () => {
        this.setTextureScale();
      });
    }
  }

  setTextureScale() {
    const {
      texture,
      height,
      width,
      maxHeight,
      maxWidth
    } = this.props;
    let newState;

    if (typeof height !== 'undefined' && typeof width !== 'undefined') {
      newState = {
        height: Math.min(maxHeight ? maxHeight : height, height),
        width: Math.min(maxWidth ? maxWidth : width, width)
      };
    } else {
      if (typeof height !== 'undefined') {
        let calculatedDimensions = {
          height,
          width: texture.baseTexture.realWidth * (height / texture.baseTexture.realHeight)
        };

        if (typeof maxWidth !== 'undefined' && calculatedDimensions.width > maxWidth) {
          calculatedDimensions.width = maxWidth;
          calculatedDimensions.height = texture.baseTexture.realHeight * (maxWidth / texture.baseTexture.realWidth);
        }

        newState = calculatedDimensions;
      }

      if (typeof width !== 'undefined') {
        let calculatedDimensions = {
          width,
          height: texture.baseTexture.realHeight * (width / texture.baseTexture.realWidth)
        };

        if (typeof maxHeight !== 'undefined' && calculatedDimensions.height > maxHeight) {
          calculatedDimensions.height = maxHeight;
          calculatedDimensions.width = texture.baseTexture.realWidth * (maxHeight / texture.baseTexture.realHeight);
        }

        newState = calculatedDimensions;
      }
    }

    this.setState({ ...newState,
      visible: true
    });
  }

  render() {
    const {
      texture
    } = this.props;
    return _react.default.createElement(_reactPixi.Sprite, _extends({}, this.props, {
      texture: texture,
      height: this.state.height,
      width: this.state.width,
      visible: this.state.visible
    }));
  }

}

var _default = AutoScaleSprite;
exports.default = _default;