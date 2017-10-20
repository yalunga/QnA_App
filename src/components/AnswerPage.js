import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Platform } from 'react-native';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class AnswerPage extends Component {
  static navigationOptions = {
    drawerLabel: <View />
  }

  constructor(props) {
    super(props);

    this.userId = firebase.auth().currentUser.uid;
    this.time = Date.now();
    this.imageRef = firebase.storage().ref(`${this.userId}`).child(`${this.time}`);
    this.followersRef = firebase.database().ref(`followers/${this.userId}`);
    this.rootRef = firebase.database().ref();
    this.state = {
      cameraType: 'back',
      followers: {},
      postUri: '',
      name: ''
    };
  }

  componentWillMount() {
    const ref = firebase.database().ref(`users/${this.userId}`);
    ref.once('value', (snap) => {
      this.setState({
        name: snap.val().username
      });
    });
  }

  fanoutPost({ uid, followersSnapshot, post }) {
    const followers = Object.keys(followersSnapshot);
    const fanoutObj = {};

    followers.forEach((key) => {
      fanoutObj[`/timeline/${key}/${uid}/${this.time}`] = post;
    });
    return fanoutObj;
  }

  uploadImage(uri, mime = 'video/mp4') {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      let uploadBlob = null;

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then((blob) => {
          uploadBlob = blob;
          return this.imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return this.imageRef.getDownloadURL();
        })
        .then((url) => {
          this.sendPost(url);
          resolve(url);
        })
        .catch((error) => {
          reject(error);
      });
    });
  }

  startRecording() {
    const options = {
      mode: Camera.constants.CaptureMode.video,
    };
    //options.location = ...
    this.camera.capture({ metadata: options })
      .then((data) => {
        this.uploadImage(data.path);
      })
      .catch(err => console.error(err));
    }


  stopRecording() {
    this.camera.stopCapture();
  }

  switchCamera() {
    if (this.state.cameraType === 'back') {
      this.setState({ cameraType: 'front' });
    } else {
      this.setState({ cameraType: 'back' });
    }
  }

  sendPost(uri) {
    this.followersRef.on('value', (snap) => {
      const followers = snap.val();
      const post = {
        uri,
        question: this.props.navigation.state.params.question,
        name: this.state.name
      };
      const fanoutObj = this.fanoutPost({
        uid: firebase.auth().currentUser.uid,
        followersSnapshot: followers,
        post
      });
      this.rootRef.update(fanoutObj);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect='fill'
          captureMode={Camera.constants.CaptureMode.video}
          type={this.state.cameraType}
        >
          <Icon
            name='ios-reverse-camera-outline'
            size={48}
            color='#fff'
            type='ionicon'
            containerStyle={styles.switchButton}
            onPress={() => this.switchCamera()}
          />
          <TouchableHighlight
            onPressIn={this.startRecording.bind(this)}
            onPressOut={this.stopRecording.bind(this)}
            style={styles.recordButton}
          >
            <Text />
          </TouchableHighlight>
        </Camera>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  switchButton: {
    position: 'absolute',
    top: 0,
    right: 10
  },
  recordButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 75,
    width: 75,
    height: 75,
    marginBottom: 10
  }
};

export default AnswerPage;
