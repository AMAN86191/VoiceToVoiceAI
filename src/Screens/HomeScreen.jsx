import React, { useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

const HomeScreen = () => {
  // Animation reference
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <SafeAreaView style={{flex:1}}>
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="share-social-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>AI JARVIS</Text>

        <TouchableOpacity>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Welcome to Your AI Assistant</Text>
        <Text style={styles.subtitle}>
          Experience the power of communication redefined with two interactive modes:
        </Text>

        <TouchableOpacity style={styles.modeButton}>
          <LinearGradient
            colors={['#ff9966', '#ff5e62']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Text to Text AI</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton}>
          <LinearGradient
            colors={['#56ab2f', '#a8e063']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Voice to Voice AI</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1, justifyContent: 'flex-start' },
  header: {
    
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 26, color: '#fff', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  modeButton: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 6,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default HomeScreen
