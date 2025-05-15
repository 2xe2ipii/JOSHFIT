import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminStackParamList } from '../../navigation/types';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/authSlice';
import { fetchAllUsers } from '../../redux/adminSlice';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { UserRole } from '../../types';
import { AnyAction } from 'redux';

type AddUserScreenNavigationProp = StackNavigationProp<AdminStackParamList, 'AddUser'>;

const AddUserScreen = () => {
  const navigation = useNavigation<AddUserScreenNavigationProp>();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [bodyType, setBodyType] = useState<'ectomorph' | 'mesomorph' | 'endomorph'>('mesomorph');
  const [fitnessGoal, setFitnessGoal] = useState<'lose_weight' | 'gain_muscle' | 'improve_endurance' | 'maintain'>('maintain');
  const [role, setRole] = useState<UserRole>(UserRole.REGULAR);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
  });

  // Calculate top padding for Android if SafeAreaView inset is 0
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      height: '',
      weight: '',
    };

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Nickname validation
    if (!nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
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

    // Height validation
    if (!height.trim()) {
      newErrors.height = 'Height is required';
      isValid = false;
    } else if (isNaN(Number(height)) || Number(height) < 100 || Number(height) > 250) {
      newErrors.height = 'Enter a valid height in cm (100-250)';
      isValid = false;
    }

    // Weight validation
    if (!weight.trim()) {
      newErrors.weight = 'Weight is required';
      isValid = false;
    } else if (isNaN(Number(weight)) || Number(weight) < 30 || Number(weight) > 250) {
      newErrors.weight = 'Enter a valid weight in kg (30-250)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddUser = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await dispatch(register({
          email,
          password,
          nickname,
          gender,
          height: Number(height),
          weight: Number(weight),
          bodyType,
          fitnessGoal,
          role,
        }) as unknown as AnyAction);
        
        // Refresh the user list
        await dispatch(fetchAllUsers() as unknown as AnyAction);
        
        Alert.alert(
          'Success',
          'User added successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to add user. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New User</Text>
        <Text style={styles.subtitle}>Enter user details to create a new account</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <Input
            label="Email"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.gray} />}
          />
          
          <Input
            label="Nickname"
            placeholder="Enter nickname"
            value={nickname}
            onChangeText={setNickname}
            error={errors.nickname}
            leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.gray} />}
          />
          
          <Input
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderSelection}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'male' && styles.selectedGender,
              ]}
              onPress={() => setGender('male')}
            >
              <Ionicons
                name="male"
                size={24}
                color={gender === 'male' ? COLORS.white : COLORS.primary}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'male' && styles.selectedGenderText,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'female' && styles.selectedGender,
              ]}
              onPress={() => setGender('female')}
            >
              <Ionicons
                name="female"
                size={24}
                color={gender === 'female' ? COLORS.white : COLORS.primary}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'female' && styles.selectedGenderText,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'other' && styles.selectedGender,
              ]}
              onPress={() => setGender('other')}
            >
              <Ionicons
                name="person"
                size={24}
                color={gender === 'other' ? COLORS.white : COLORS.primary}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'other' && styles.selectedGenderText,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Input
                label="Height"
                placeholder="cm"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                error={errors.height}
                rightIcon={<Text style={styles.inputUnit}>cm</Text>}
              />
            </View>
            <View style={styles.inputHalf}>
              <Input
                label="Weight"
                placeholder="kg"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                error={errors.weight}
                rightIcon={<Text style={styles.inputUnit}>kg</Text>}
              />
            </View>
          </View>
          
          <Text style={styles.label}>Body Type</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                bodyType === 'ectomorph' && styles.selectedOption,
              ]}
              onPress={() => setBodyType('ectomorph')}
            >
              <Text
                style={[
                  styles.optionText,
                  bodyType === 'ectomorph' && styles.selectedOptionText,
                ]}
              >
                Ectomorph
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                bodyType === 'mesomorph' && styles.selectedOption,
              ]}
              onPress={() => setBodyType('mesomorph')}
            >
              <Text
                style={[
                  styles.optionText,
                  bodyType === 'mesomorph' && styles.selectedOptionText,
                ]}
              >
                Mesomorph
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                bodyType === 'endomorph' && styles.selectedOption,
              ]}
              onPress={() => setBodyType('endomorph')}
            >
              <Text
                style={[
                  styles.optionText,
                  bodyType === 'endomorph' && styles.selectedOptionText,
                ]}
              >
                Endomorph
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Fitness Goal</Text>
          <View style={styles.goalOptions}>
            <TouchableOpacity
              style={[
                styles.goalOption,
                fitnessGoal === 'lose_weight' && styles.selectedGoal,
              ]}
              onPress={() => setFitnessGoal('lose_weight')}
            >
              <Text
                style={[
                  styles.goalText,
                  fitnessGoal === 'lose_weight' && styles.selectedGoalText,
                ]}
              >
                Lose Weight
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.goalOption,
                fitnessGoal === 'gain_muscle' && styles.selectedGoal,
              ]}
              onPress={() => setFitnessGoal('gain_muscle')}
            >
              <Text
                style={[
                  styles.goalText,
                  fitnessGoal === 'gain_muscle' && styles.selectedGoalText,
                ]}
              >
                Gain Muscle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.goalOption,
                fitnessGoal === 'improve_endurance' && styles.selectedGoal,
              ]}
              onPress={() => setFitnessGoal('improve_endurance')}
            >
              <Text
                style={[
                  styles.goalText,
                  fitnessGoal === 'improve_endurance' && styles.selectedGoalText,
                ]}
              >
                Improve Endurance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.goalOption,
                fitnessGoal === 'maintain' && styles.selectedGoal,
              ]}
              onPress={() => setFitnessGoal('maintain')}
            >
              <Text
                style={[
                  styles.goalText,
                  fitnessGoal === 'maintain' && styles.selectedGoalText,
                ]}
              >
                Maintain Fitness
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === UserRole.REGULAR && styles.selectedRole,
              ]}
              onPress={() => setRole(UserRole.REGULAR)}
            >
              <View style={styles.roleHeader}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={role === UserRole.REGULAR ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.roleTitle,
                    role === UserRole.REGULAR && styles.selectedRoleText,
                  ]}
                >
                  Regular
                </Text>
              </View>
              <Text
                style={[
                  styles.roleDescription,
                  role === UserRole.REGULAR && styles.selectedRoleDescription,
                ]}
              >
                Basic access to workouts and tracking features
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === UserRole.PREMIUM && styles.selectedRole,
              ]}
              onPress={() => setRole(UserRole.PREMIUM)}
            >
              <View style={styles.roleHeader}>
                <Ionicons
                  name="star-outline"
                  size={24}
                  color={role === UserRole.PREMIUM ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.roleTitle,
                    role === UserRole.PREMIUM && styles.selectedRoleText,
                  ]}
                >
                  Premium
                </Text>
              </View>
              <Text
                style={[
                  styles.roleDescription,
                  role === UserRole.PREMIUM && styles.selectedRoleDescription,
                ]}
              >
                Full access including food and calorie logging features
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === UserRole.ADMIN && styles.selectedRole,
              ]}
              onPress={() => setRole(UserRole.ADMIN)}
            >
              <View style={styles.roleHeader}>
                <Ionicons
                  name="shield-outline"
                  size={24}
                  color={role === UserRole.ADMIN ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.roleTitle,
                    role === UserRole.ADMIN && styles.selectedRoleText,
                  ]}
                >
                  Admin
                </Text>
              </View>
              <Text
                style={[
                  styles.roleDescription,
                  role === UserRole.ADMIN && styles.selectedRoleDescription,
                ]}
              >
                Full access with user management capabilities
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Create User"
            onPress={handleAddUser}
            loading={isLoading}
            style={styles.createButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            type="outline"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    marginBottom: SIZES.xl,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
  },
  selectedGender: {
    backgroundColor: COLORS.primary,
  },
  genderText: {
    marginLeft: SIZES.xs,
    fontSize: FONTS.body,
    color: COLORS.primary,
  },
  selectedGenderText: {
    color: COLORS.white,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  inputHalf: {
    width: '48%',
  },
  inputUnit: {
    color: COLORS.darkGray,
    fontSize: FONTS.body,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
    marginHorizontal: SIZES.xs,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  goalOptions: {
    flexDirection: 'column',
    marginBottom: SIZES.sm,
  },
  goalOption: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
    marginBottom: SIZES.sm,
  },
  selectedGoal: {
    backgroundColor: COLORS.primary,
  },
  goalText: {
    fontSize: FONTS.body,
    color: COLORS.primary,
  },
  selectedGoalText: {
    color: COLORS.white,
  },
  roleContainer: {
    marginTop: SIZES.sm,
  },
  roleOption: {
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
    marginBottom: SIZES.sm,
  },
  selectedRole: {
    backgroundColor: COLORS.primary,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  roleTitle: {
    marginLeft: SIZES.sm,
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.primary,
  },
  selectedRoleText: {
    color: COLORS.white,
  },
  roleDescription: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginLeft: SIZES.xl,
  },
  selectedRoleDescription: {
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: SIZES.lg,
  },
  createButton: {
    marginBottom: SIZES.md,
  },
  cancelButton: {
    borderColor: COLORS.gray,
  },
});

export default AddUserScreen;
