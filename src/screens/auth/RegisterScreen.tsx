import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      email: '', 
      password: '', 
      confirmPassword: '', 
      nickname: '' 
    };

    // Nickname validation
    if (!nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleRegister = () => {
    if (validateForm()) {
      // Move to onboarding step 1 with the basic user info
      navigation.navigate('OnboardingInfo', {
        email,
        password,
        nickname
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start your fitness journey</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nickname"
              placeholder="Enter your nickname"
              value={nickname}
              onChangeText={setNickname}
              error={validationErrors.nickname}
              leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.gray} />}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={validationErrors.email}
              leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.gray} />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={validationErrors.password}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={validationErrors.confirmPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />}
            />

            <Button
              title="Continue"
              onPress={handleRegister}
              style={styles.button}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xxl,
  },
  backButton: {
    marginTop: SIZES.xl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginTop: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
  },
  form: {
    marginTop: SIZES.sm,
  },
  button: {
    marginTop: SIZES.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.xl,
  },
  loginText: {
    color: COLORS.darkGray,
    fontSize: FONTS.body,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: FONTS.body,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
