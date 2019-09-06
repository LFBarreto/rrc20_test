import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Home, AccountPage } from './views';
import store from './store';

import { Provider } from 'react-redux';

const MainNavigator = createStackNavigator({
  Home: { screen: Home, navigationOptions: { header: null } },
  AccountPage: { screen: AccountPage},
});

const App = createAppContainer(MainNavigator);

export default function Main() {
  return (
    <Provider store={store}>
        <App />
    </Provider>
  );
};