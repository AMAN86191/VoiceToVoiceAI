import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SplashScreen from './src/SplashScreen';
import HomeScreen from './src/HomeScreen'

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  if (isSplashVisible) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
   <>
   <HomeScreen />
   </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
