import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import firebase from 'firebase';
import { Button } from 'react-native-elements';
import HeaderComponent from './HeaderComponent';

class AskQuestion extends Component {
  static navigationOptions = {
    drawerLabel: <View />
  }

  constructor() {
    super();
    this.time = Date.now();
    this.state = {
      text: ''
    };
  }

  AskQuestion(key) {
    const ref = firebase.database().ref(`users/${key}/unansweredQuestions`);

    const updates = {};
    updates[`${this.time}`] = this.state.text;
    ref.update(updates)
      .then(this.props.navigation.navigate('Feed'));
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View>
        <HeaderComponent
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          onPressRight={() => this.props.navigation.navigate('Search')}
        />
        <View style={styles.textContainerStyle}>
          <Text style={styles.textStyle}>Ask {params.name} a question</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => {
              this.setState({ text });
            }}
            value={this.state.text}
            placeholder='Ask Here'
          />
          <Button
            raised
            backgroundColor='skyblue'
            title='Ask'
            containerViewStyle={styles.buttonStyle}
            onPress={() => {
              this.AskQuestion(params.key);
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  textContainerStyle: {
    flexDirection: 'column',
    marginTop: 100,
    alignItems: 'center',
  },
  inputStyle: {
    marginTop: 55,
    height: 60,
    width: 400
  },
  textStyle: {
    fontSize: 24
  },
  buttonStyle: {
    marginTop: 300,
    width: 500
  }
};

export default AskQuestion;
