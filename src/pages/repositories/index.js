import React, { Component } from 'react';
import { View, AsyncStorage, ActivityIndicator, FlatList, Text } from 'react-native';
import styles from './styles';

import Icon from 'react-native-vector-icons/FontAwesome';

import api from '../../services/api';

import RepositoryItem from './components/RepositoryItem/';

export default class Repositories extends Component {
  static navigationOptions = {
    title: 'Repositories',
    tabBarIcon: ({ tintColor }) => <Icon name="list-alt" size={20} color={tintColor} />,
  }

  state = {
    data: [],
    loading: true,
    refreshing: false,
  };

  componentDidMount() {
    this.loadRepositories();
  }

  loadRepositories = async () => {
    this.setState({ refreshing: false });
    const username = await AsyncStorage.getItem('@GitExplorer:username');
    const response = await api.get(`/users/${username}/repos`);

    this.setState({ data: response.data, loading: false, refreshing: false });
  }

  renderListItem = ({ item }) => <RepositoryItem repository={item} />;

  renderList = () => (
    <FlatList
      data={this.state.data}
      keyExtractor={item => String(item.id)}
      renderItem={this.renderListItem}
      onRefresh={this.loadRepositories}
      refreshing={this.state.refreshing}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.loading
            ? <ActivityIndicator style={styles.loading} />
            : this.renderList()
        }
      </View>
    );
  }
}
