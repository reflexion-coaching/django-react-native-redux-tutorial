import React from 'react';
import { View, Button, Text } from "react-native"
import { Provider } from 'react-redux';
import { store } from './src/reducers/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookListScreen from './src/screens/BookListScreen';
import HomeScreen from './src/screens/HomeScreen'
import { SignIn } from './src/features/authentification/SignIn';
import Ionicons from '@expo/vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'home-outline';
                } else if (route.name === 'Books') {
                  iconName = focused
                    ? 'book'
                    : 'book-outline';
                } else if (route.name === 'Sign-In') {
                  iconName = focused
                    ? 'log-in'
                    : 'log-in-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            })}
          >
            <Tab.Screen name="Sign-In" component={SignIn} options={{ title: 'Sign In' }} />
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="Books" component={BookListScreen} options={{ title: 'Books' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

