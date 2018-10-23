/* global PIXI */

import React from 'react';
import { Sprite } from '@inlet/react-pixi';

class AutoScaleSprite extends React.PureComponent {
  state = {
    visible: false,
    height: 0,
    width: 0,
  }

  componentWillMount() {
    this.checkTexture();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.props.onTextureScal();
    }
  }

  checkTexture() {
    const { texture } = this.props;

    if (texture.baseTexture.hasLoaded) {
      this.setTextureScale();
    } else {
      texture.baseTexture.on('load', () => { this.setTextureScale() });
      texture.baseTexture.on('update', () => { this.setTextureScale() });
    }
  }

  setTextureScale() {
    const { texture, height, width, maxHeight, maxWidth } = this.props;

    let newState;

    if (typeof height !== 'undefined' && typeof width !== 'undefined') {
      newState = {
        height: Math.min((maxHeight ? maxHeight : height), height),
        width: Math.min((maxWidth ? maxWidth : width), width),
      }
    } else {
      if (typeof height !== 'undefined') {
        let calculatedDimensions = {
          height,
          width: texture.baseTexture.realWidth * (height / texture.baseTexture.realHeight),
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
          height: texture.baseTexture.realHeight * (width / texture.baseTexture.realWidth),
        }

        if (typeof maxHeight !== 'undefined' && calculatedDimensions.height > maxHeight) {
          calculatedDimensions.height = maxHeight;
          calculatedDimensions.width = texture.baseTexture.realWidth * (maxHeight / texture.baseTexture.realHeight);
        }

        newState = calculatedDimensions;
      }
    }

    this.setState({
      ...newState,
      visible: true,
    });
  }

  render() {
    const { texture } = this.props;

    return (
      <Sprite
        {...this.props}
        texture={texture}
        height={this.state.height}
        width={this.state.width}
        visible={this.state.visible}
      />
    );
  }
}

export default AutoScaleSprite;
