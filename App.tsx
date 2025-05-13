import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { SIZES } from './src/constants/theme';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Update screen dimensions for responsive design
  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      SIZES.width = width;
      SIZES.height = height;
    };

    updateLayout();
    
    // Listen for dimension changes (orientation changes)
    Dimensions.addEventListener('change', updateLayout);
    
    // Hide splash screen after we're done loading resources
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="auto" />
        <RootNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
