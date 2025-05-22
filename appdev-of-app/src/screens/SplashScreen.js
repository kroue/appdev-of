/*
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OnlyFriends</Text>
      <Image
        source={require('../assets/OnlyFriends-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#105BA4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
    bottom: -80,
    fontFamily: 'Rasa-Bold',
  },
  logo: {
    width: 380,
    height: 380,
    marginTop: 40,
  },
  loader: {
    marginTop: 50,
  },
});

export default SplashScreen;
  
  */