/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Navigator from 'react-native-deprecated-custom-components';
import Init from './pages/Init';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
    };
  }
  _renderScene(route, navigator) {
      let Component = route.component;
      return (
          <Component {...route.params} navigator={navigator}/>
      );
  }
  render() {
      return (
          <Navigator.Navigator
              initialRoute={{
                  name: 'Init',
                  component:Init
              }}
              renderScene={(e, i)=>this._renderScene(e, i)} // e = route, i = navigator
          />
      );
  }
}