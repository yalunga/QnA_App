import React, { Component } from 'react';
import { Header, Icon } from 'react-native-elements';

class HeaderComponent extends Component {

  renderRightComponent(onPressRight) {
    return (
      <Icon
        size={32}
        name='search'
        color='#fff'
        type='evilicon'
        onPress={onPressRight}
      />
    );
  }

  renderLeftComponent(onPress) {
    return (
      <Icon
        size={32}
        name='ios-menu'
        color='#fff'
        type='ionicon'
        onPress={onPress}
      />
    );
  }
  render() {
    return (
      <Header
        leftComponent={this.renderLeftComponent(this.props.onPress)}
        centerComponent={{ text: 'QnA', style: { color: '#fff' } }}
        rightComponent={this.renderRightComponent(this.props.onPressRight)}
        backgroundColor='#C97B84'
      />
    );
  }
}

export default HeaderComponent;
