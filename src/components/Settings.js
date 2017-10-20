import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { Button } from 'react-native-elements';
import HeaderComponent from './HeaderComponent';


class Settings extends Component {

  static navigationOptions = {
    header: null
  }

  logout() {
    firebase.auth().signOut()
      .then(() => {
        this.props.navigation.navigate('LoginForm');
      });
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <HeaderComponent
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          onPressRight={() => this.props.navigation.navigate('Search')}
        />
        <View>
          <Button
            title='Sign Out'
            buttonStyle={styles.buttonStyle}
            onPress={() => this.logout()}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonStyle: {
    backgroundColor: 'skyblue'
  }
};

export default Settings;
