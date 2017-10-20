import React, { Component } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import firebase from 'firebase';

class LoginForm extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      initial: true
    };
  }

  componentDidMount() {
    this.login();
  }

  login() {
    this.setState({ loading: true });
    const { email, password, initial } = this.state;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        if (initial === false) {
          if (errorCode === 'auth/invalid-email') {
            Alert.alert(
              '',
              'Invalid email.'
            );
          } else if (errorCode === 'auth/user-not-found') {
            Alert.alert(
              'User not found.'
            );
          } else if (errorCode === 'auth/wrong-password') {
            Alert.alert(
              'Wrong password.'
            );
          }
        }
    // ...
  }).then(() => {
      this.checkForUser();
    });
    this.setState({ initial: false });
  }

  checkForUser() {
    this.setState({ loading: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('Menu');
      }
    });
    this.setState({ loading: false });
  }

  renderIf() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          size='large'
          color='#fff'
          style={styles.activity}
        />
      );
    }
    return (
        <View>
          <FormInput
            containerStyle={styles.emailStyle}
            inputStyle={styles.text}
            placeholder='Email'
            keyboardType='email-address'
            placeholderTextColor='#fff'
            onChangeText={(email) => {
              this.setState({ email });
            }}
            value={this.state.email}
          />
          <FormInput
            containerStyle={styles.passwordStyle}
            inputStyle={styles.text}
            placeholder='Password'
            secureTextEntry
            placeholderTextColor='#fff'
            onChangeText={(password) => {
              this.setState({ password });
            }}
            value={this.state.password}
          />

          <Button
            title='Login'
            backgroundColor='#CD878F'
            borderRadius={20}
            containerViewStyle={styles.button}
            onPress={this.login.bind(this)}
          />
          <Button
            title='Create Account'
            backgroundColor='#CD878F'
            borderRadius={20}
            containerViewStyle={styles.button}
            onPress={() => {
              this.props.navigation.navigate('CreateAccount');
            }}
          />
          </View>
        );
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        {this.renderIf()}
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#C97B84',
    alignItems: 'center'
  },
  emailStyle: {
    backgroundColor: '#CD878F',
    borderRadius: 20,
    paddingLeft: 5,
    marginBottom: 30,
    marginTop: 100,
    width: 350
  },
  passwordStyle: {
    backgroundColor: '#CD878F',
    borderRadius: 20,
    paddingLeft: 5,
    marginBottom: 80,
    width: 350
  },
  text: {
    color: '#fff',
    width: 340
  },
  button: {
    width: 350,
    marginBottom: 30
  },
  activity: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
};

export default LoginForm;
