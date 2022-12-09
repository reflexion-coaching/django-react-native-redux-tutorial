import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { BookList } from "./src/features/book/BookList"
import { Provider } from 'react-redux';
import { store } from './src/reducers/store';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <BookList />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
