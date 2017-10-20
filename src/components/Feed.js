import React, { Component } from 'react';
import firebase from 'firebase';
import Video from 'react-native-video';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import HeaderComponent from './HeaderComponent';
import VideoRender from './VideoRender';


class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.userId = firebase.auth().currentUser.uid;
    this.ref = firebase.database().ref(`timeline/${this.userId}`);
    this.storageRef = firebase.storage().ref();
    this.uri = '';
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    this.listenForItems();
  }

  listenForItems() {
    this.ref.on('value', (snap) => {
      const items = [];
      snap.forEach((child) => {
        const newRef = firebase.database().ref(`timeline/${this.userId}/${child.key}`);
        newRef.on('value', (snapshot) => {
          snapshot.forEach((children) => {
            items.push({
              uri: children.val().uri,
              user: children.val().name,
              question: children.val().question,
              paused: true
            });
          });
        });
      });
      this.setState({
        data: items
      });
    });
  }


  renderItem(item) {
    return (
        <VideoRender
          uri={item.uri}
          user={item.user}
          question={item.question}
          paused={item.paused}
        />
    );
  }

  render() {
    return (
      <View>
      <HeaderComponent
        onPress={() => this.props.navigation.navigate('DrawerOpen')}
        onPressRight={() => this.props.navigation.navigate('Search')}
      />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            this.renderItem(item)
          )}
          style={{ marginTop: 80 }}
          initialNumToRender={0}
        />
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

export default Feed;
