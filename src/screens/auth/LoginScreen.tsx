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
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import { login } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

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

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(login({ email, password }));
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
          </View>

          <View style={styles.form}>
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.button}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
    marginTop: SIZES.xxl,
    marginBottom: SIZES.xl,
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
    marginTop: SIZES.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20', // 20% opacity
    padding: SIZES.sm,
    borderRadius: SIZES.borderRadiusSm,
    marginBottom: SIZES.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.small,
  },
  button: {
    marginTop: SIZES.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.xl,
  },
  registerText: {
    color: COLORS.darkGray,
    fontSize: FONTS.body,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: FONTS.body,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
