import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Button from '../../components/Button';
type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;
const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1470&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>JOSHFIT</Text>
              <Text style={styles.tagline}>Your path to fitness consistency</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button 
                title="Get Started" 
                onPress={() => navigation.navigate('Register')}
                type="primary"
                size="large"
                style={styles.button}
              />
              <Button 
                title="I already have an account" 
                onPress={() => navigation.navigate('Login')}
                type="outline"
                size="large"
                style={[styles.button, styles.loginButton]}
                textStyle={styles.loginButtonText}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONTS.h4,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SIZES.sm,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: SIZES.md,
    width: '100%',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.white,
  },
  loginButtonText: {
    color: COLORS.white,
  },
});
export default WelcomeScreen;

