import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/reducers/store';
import DefaultScreen from './src/screens/DefaultScreen';


export default function App() {

  return (
    <Provider store={store}>
      <DefaultScreen />
    </Provider>
  );
}

