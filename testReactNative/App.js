import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/reducers/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookListScreen from './src/screens/BookListScreen';
import HomeScreen from './src/screens/HomeScreen'
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import WelcomeScreen from './src/screens/WelcomeScreen'
import Ionicons from '@expo/vector-icons/Ionicons'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function WelcomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Sign-In" component={SignInScreen} options={{ title: 'Sign In' }} />
      <Stack.Screen name="Sign-Up" component={SignUpScreen} options={{ title: 'Sign Up' }} />
    </Stack.Navigator>
  );
}

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
                } else if (route.name === 'Welcome Nav') {
                  iconName = focused
                    ? 'log-in'
                    : 'log-in-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            })}
          >
            <Tab.Screen name="Welcome Nav" component={WelcomeNavigation} options={{ title: 'Welcome', headerShown: false }} />
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="Books" component={BookListScreen} options={{ title: 'Books' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

