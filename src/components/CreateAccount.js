import React, { Component } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Button, FormInput } from 'react-native-elements';
import firebase from 'firebase';

class CreateAccount extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      loading: false,
      initial: true
    };
  }

  componentDidMount() {

  }

  login() {
    this.setState({ loading: true });
    const { email, password, initial } = this.state;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        if (initial === false) {
          if (errorCode === 'auth/email-already-in-use') {
            Alert.alert(
              '',
              'Email already in use.'
            );
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert(
              'Invalid Email'
            );
          } else if (errorCode === 'auth/weak-password') {
            Alert.alert(
              'Weak password.'
            );
          }
        }
    // ...
  }).then(() => {
      const userId = firebase.auth().currentUser.uid;
      this.ref = firebase.database().ref(`users/${userId}`);
      this.ref.set({
        username: this.state.username,
      });
      this.checkForUser();
    });
    this.setState({ initial: false });
  }

  checkForUser() {
    this.setState({ loading: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.username
        });
        this.props.navigation.navigate('Feed');
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
          containerStyle={styles.usernameStyle}
          inputStyle={styles.text}
          placeholder='Username'
          placeholderTextColor='#fff'
          onChangeText={(username) => {
            this.setState({ username });
          }}
          value={this.state.username}
        />
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
            title='Create Account'
            backgroundColor='#CD878F'
            borderRadius={20}
            containerViewStyle={styles.button}
            onPress={this.login.bind(this)}
          />
          <Button
            title='Already have an account?'
            backgroundColor='#CD878F'
            borderRadius={20}
            containerViewStyle={styles.button}
            onPress={() => {
              this.props.navigation.navigate('LoginForm');
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
  usernameStyle: {
    backgroundColor: '#CD878F',
    borderRadius: 20,
    paddingLeft: 5,
    marginBottom: 30,
    marginTop: 100,
    width: 350
  },
  emailStyle: {
    backgroundColor: '#CD878F',
    borderRadius: 20,
    paddingLeft: 5,
    marginBottom: 30,
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

export default CreateAccount;
