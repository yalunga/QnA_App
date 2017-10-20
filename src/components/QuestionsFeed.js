import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import firebase from 'firebase';
import HeaderComponent from './HeaderComponent';

class QuestionsFeed extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    const userId = firebase.auth().currentUser.uid;
    this.ref = firebase.database().ref(`users/${userId}/unansweredQuestions`);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    this.listenForQuestions();
  }

  listenForQuestions() {
    this.ref.on('value', (snap) => {
      const questions = [];
      snap.forEach((child) => {
        questions.push({
          question: child.val()
        });
      });
      this.setState({
        data: questions
      });
    });
  }

  renderItem(item) {
    return (
      <ListItem
        roundAvatar
        title={item.question}
        onPress={() => this.props.navigation.navigate('AnswerPage', { question: item.question })}
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
        <List containerStyle={styles.listContainer}>
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
  listContainer: {
    marginTop: 60
  }
};

export default QuestionsFeed;
