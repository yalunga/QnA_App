import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Drawer } from '../config/Router';

class Menu extends Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return (
      <Drawer />
    );
  }
}

export default Menu;
