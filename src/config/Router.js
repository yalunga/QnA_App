import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import LoginForm from '../components/LoginForm';
import Feed from '../components/Feed';
import CreateAccount from '../components/CreateAccount';
import QuestionsFeed from '../components/QuestionsFeed';
import AnswerPage from '../components/AnswerPage';
import Search from '../components/Search';
import Settings from '../components/Settings';
import AskQuestion from '../components/AskQuestion';

export const Drawer = DrawerNavigator({
  Feed: {
    screen: Feed
  },
  Questions: {
    screen: QuestionsFeed
  },
  AnswerPage: {
    screen: AnswerPage
  },
  Search: {
    screen: Search
  },
  Settings: {
    screen: Settings
  },
  AskQuestion: {
    screen: AskQuestion
  }
}, {
  headerMode: 'none'
});

export const Stack = StackNavigator({
  LoginForm: {
    screen: LoginForm
  },
  CreateAccount: {
    screen: CreateAccount
  },
  Menu: {
    screen: Drawer
  },
  Questions: {
    screen: QuestionsFeed
  }
}, {
    headerMode: 'none'
});
