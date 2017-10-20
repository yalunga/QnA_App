import React, { Component } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import firebase from 'firebase';

class Search extends Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super();
    this.ref = firebase.database().ref('users/');
    this.currentUser = firebase.auth().currentUser.uid;
    this.state = {
      text: '',
      data: [],
    };
  }

  componentDidMount() {
    this.listenForUsers();
  }

  listenForUsers() {
    this.ref.on('value', (snap) => {
      const users = [];
      snap.forEach((child) => {
        if (child.val().username === this.state.text) {
          const followRef = firebase.database().ref(`followers/${child.key}/${this.currentUser}`);
          followRef.on('value', (snapshot) => {
            users.push({
              user: child.val(),
              key: child.key,
              isFollowing: snapshot.val()
            });
            this.setState({
              data: users
            });
          });
        }
      });
    });
  }

  followUser(item) {
    const currentUser = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`followers/${item.key}/`);
    const updates = {};
    updates[`${currentUser}`] = true;
    ref.update(updates);
  }

  renderButton() {
    return (
      <Button
        title='Ask Question'
      />
    );
  }

  askButton(key, name) {
    console.log(key);
    this.props.navigation.navigate('AskQuestion', { key, name });
  }

  renderItem(item) {
    const ref = firebase.database().ref(`followers/${item.key}/${firebase.auth().currentUser.uid}`);
    console.log(ref);
      if (item.isFollowing === true) {
        return (
          <ListItem
            leftIcon={<Button
              title='Ask'
              raised backgroundColor='skyblue'
              borderRadius={2}
              onPress={() => this.askButton(item.key, item.user.username)}
            />
            }
            title={item.user.username}
            rightIcon={{ name: 'user-following', type: 'simple-line-icon' }}
            onPressRightIcon={() => this.followUser(item)}
          />
        );
      }
      return (
        <ListItem
          title={item.user.username}
          rightIcon={{ name: 'user-follow', type: 'simple-line-icon' }}
          onPressRightIcon={() => this.followUser(item)}
        />
      );
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => {
            this.setState({ text }, () => this.listenForUsers());
          }}
          value={this.state.text}
          placeholder='Search'
        />
        <List>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => this.renderItem(item)}
          />
        </List>
      </View>
    );
  }
}

const styles = {
  inputStyle: {
    marginTop: 5,
    height: 60,
  }
};

export default Search;
