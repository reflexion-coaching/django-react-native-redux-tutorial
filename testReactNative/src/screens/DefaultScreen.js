import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookListScreen from './BookListScreen';
import HomeScreen from './HomeScreen'
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import { selectIsSignIn } from '../features/api/authentificationSlice';

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

export default function DefaultScreen() {

  const isSignedIn = useSelector(selectIsSignIn);
  //const isSignedIn = false;

  return (
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
            {useSelector(selectIsSignIn)? (
              <>
                <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
                <Tab.Screen name="Books" component={BookListScreen} options={{ title: 'Books' }} />
              </>
            ) : (
              <Tab.Screen name="Welcome Nav" component={WelcomeNavigation} options={{ title: 'Welcome', headerShown: false }} />
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

