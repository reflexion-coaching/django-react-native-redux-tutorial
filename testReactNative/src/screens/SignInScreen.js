import { SignIn } from '../features/authentification/SignIn';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookListScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SignIn />
    </SafeAreaView>
  )
}

export default BookListScreen;