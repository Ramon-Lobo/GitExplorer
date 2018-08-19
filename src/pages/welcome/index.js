import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import api from '../../services/api';
import styles from './styles';
import { colors } from '../../styles';

export default class Welcome extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
  };

  state = {
    username: null,
    loading: false,
    errorMessage: null,
  };

  checkUserExists = async (username) => {
    const user = await api.get(`/users/${username}`);

    return user;
  };

  saveUser = async (username) => {
    await AsyncStorage.setItem('@GitExplorer:username', username);
  }

  signIn = async () => {
    const { username } = this.state;

    if (username.length === 0) return;

    this.setState({ loading: true });

    try {
      await this.checkUserExists(username);

      await this.saveUser(username);

      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'User' }),
        ],
      });

      this.props.navigation.dispatch(resetAction);
    } catch (err) {
      this.setState({ loading: false, errorMessage: 'User not found' });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.text}>
          To continue, please insert your username
        </Text>

        { !!this.state.errorMessage
          && <Text style={styles.error}>{this.state.errorMessage}</Text>
        }

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username"
            underlineColorAndroid="rgba(0, 0, 0, 0)"
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
          />

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={this.signIn}
          >
            {
              this.state.loading
                ? <ActivityIndicator size="small" color={colors.white} />
                : <Text style={styles.buttonText}>Proceed</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
