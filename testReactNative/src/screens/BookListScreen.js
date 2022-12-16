import BookList from '../features/book/BookList';
import BookPost from '../features/book/BookPost';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookListScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BookList />
      <BookPost />
    </SafeAreaView>
  )
}

export default BookListScreen;