import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen({onFinish}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ग्रेडिएंट के लिए fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Pulse एनिमेशन (scale up/down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {toValue: 1.2, duration: 800, useNativeDriver: true}),
        Animated.timing(scaleAnim, {toValue: 1, duration: 800, useNativeDriver: true}),
      ]),
    ).start();

    // 2 सेकंड तक दिखाएं फिर खत्म करें
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [  ]);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <Animated.Text style={[styles.emoji, {transform: [{scale: scaleAnim}]}]}>
          🎤🎧🤖
        </Animated.Text>
        <Text style={styles.text}>Welcome to VoiceToVoice AI</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
