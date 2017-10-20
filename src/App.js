import React, { Component } from 'react';
import firebase from 'firebase';
import { Stack } from './config/Router';

class App extends Component {
  componentWillMount() {
    const config = {
     apiKey: 'AIzaSyCr17wQ-q6l-Np_eJ8S0O4aZS94_HDGy-c',
     authDomain: 'question-9967c.firebaseapp.com',
     databaseURL: 'https://question-9967c.firebaseio.com',
     projectId: 'question-9967c',
     storageBucket: 'question-9967c.appspot.com',
     messagingSenderId: '672983240516'
   };
    firebase.initializeApp(config);
  }
  render() {
    return (
      <Stack />
    );
  }
}

export default App;
