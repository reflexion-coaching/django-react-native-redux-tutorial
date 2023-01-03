import SignUp from '../features/authentification/SignUp';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SignUp />
    </SafeAreaView>
  )
}

export default SignUpScreen;