import SignIn from '../features/authentification/SignIn';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignInScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SignIn />
    </SafeAreaView>
  )
}

export default SignInScreen;