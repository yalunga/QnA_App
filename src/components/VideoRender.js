import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import Video from 'react-native-video';

class VideoRender extends Component {
  constructor() {
    super();

    this.state = {
      paused: true
    };
  }
  playVideo() {
    console.log(this.props.paused);
    if (this.state.paused) {
      this.setState({ paused: false });
    } else {
      this.setState({ paused: true });
    }
  }
  render() {
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.name}>
          {this.props.user}
        </Text>
        <TouchableOpacity
          style={styles.video}
          onPress={() => {
            this.playVideo();
          }}
        >
          <Video
            source={{ uri: this.props.uri }}
            ref={(ref) => {
              this.player = ref;
            }}
            repeat
            resizeMode="cover"
            style={styles.video}
            paused={this.state.paused}
          />
        </TouchableOpacity>
        <Text style={styles.question}>
          {this.props.question}
        </Text>
      </View>
    );
  }
}

const styles = {
  video: {
    flex: 10,
    alignSelf: 'stretch'
  },
  name: {
    flex: 0.5,
    marginLeft: 5,
    fontSize: 18,
  },
  question: {
    flex: 1,
    marginLeft: 5,
    marginTop: 5,
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    height: 600,
    justifyContent: 'flex-end',
    borderTopWidth: 2,
    borderColor: '#000',
    alignItems: 'flex-start'
  }
};

export default VideoRender;
