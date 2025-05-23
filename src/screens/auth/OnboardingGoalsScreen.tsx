import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import { register } from '../../redux/authSlice';
type OnboardingGoalsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OnboardingGoals'>;
type OnboardingGoalsScreenRouteProp = RouteProp<AuthStackParamList, 'OnboardingGoals'>;
const OnboardingGoalsScreen = () => {
  const navigation = useNavigation<OnboardingGoalsScreenNavigationProp>();
  const route = useRoute<OnboardingGoalsScreenRouteProp>();
  const dispatch = useAppDispatch();
  // Get all data passed from previous screens
  const { email, password, nickname, gender, height, weight, bodyType } = route.params || {};
  // Fitness goal
  const [fitnessGoal, setFitnessGoal] = useState<'lose_weight' | 'gain_muscle' | 'improve_endurance' | 'maintain'>('maintain');
  // Ensure gender is one of the valid options for the User type
  const validateGender = (gender: string | undefined): 'male' | 'female' | 'other' | undefined => {
    if (gender === 'male' || gender === 'female' || gender === 'other') {
      return gender;
    }
    return 'other'; // Default value if invalid
  };
  // Ensure bodyType is one of the valid options for the User type
  const validateBodyType = (bodyType: string | undefined): 'ectomorph' | 'mesomorph' | 'endomorph' | undefined => {
    if (bodyType === 'ectomorph' || bodyType === 'mesomorph' || bodyType === 'endomorph') {
      return bodyType;
    }
    return 'mesomorph'; // Default value if invalid
  };
  // Ensure password is a string
  const validatePassword = (password: string | undefined): string => {
    return password || '';
  };
  const handleComplete = () => {
    // Register user with all collected data
    dispatch(register({
      email,
      password: validatePassword(password),
      nickname,
      gender: validateGender(gender),
      height,
      weight,
      bodyType: validateBodyType(bodyType),
      fitnessGoal,
    }));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 3</Text>
        </View>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={styles.subtitle}>
          Select your primary fitness goal to get a workout plan tailored for you
        </Text>
        <View style={styles.goalsContainer}>
          <TouchableOpacity
            style={[
              styles.goalOption,
              fitnessGoal === 'lose_weight' && styles.selectedGoal,
            ]}
            onPress={() => setFitnessGoal('lose_weight')}
          >
            <View style={styles.goalContent}>
              <Ionicons
                name="flame-outline"
                size={32}
                color={fitnessGoal === 'lose_weight' ? COLORS.white : COLORS.primary}
              />
              <View style={styles.goalTextContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    fitnessGoal === 'lose_weight' && styles.selectedGoalText,
                  ]}
                >
                  Lose Weight
                </Text>
                <Text
                  style={[
                    styles.goalDesc,
                    fitnessGoal === 'lose_weight' && styles.selectedGoalDesc,
                  ]}
                >
                  Burn calories and reduce body fat
                </Text>
              </View>
            </View>
            {fitnessGoal === 'lose_weight' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalOption,
              fitnessGoal === 'gain_muscle' && styles.selectedGoal,
            ]}
            onPress={() => setFitnessGoal('gain_muscle')}
          >
            <View style={styles.goalContent}>
              <Ionicons
                name="barbell-outline"
                size={32}
                color={fitnessGoal === 'gain_muscle' ? COLORS.white : COLORS.primary}
              />
              <View style={styles.goalTextContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    fitnessGoal === 'gain_muscle' && styles.selectedGoalText,
                  ]}
                >
                  Gain Muscle
                </Text>
                <Text
                  style={[
                    styles.goalDesc,
                    fitnessGoal === 'gain_muscle' && styles.selectedGoalDesc,
                  ]}
                >
                  Build strength and muscle mass
                </Text>
              </View>
            </View>
            {fitnessGoal === 'gain_muscle' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalOption,
              fitnessGoal === 'improve_endurance' && styles.selectedGoal,
            ]}
            onPress={() => setFitnessGoal('improve_endurance')}
          >
            <View style={styles.goalContent}>
              <Ionicons
                name="heart-outline"
                size={32}
                color={fitnessGoal === 'improve_endurance' ? COLORS.white : COLORS.primary}
              />
              <View style={styles.goalTextContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    fitnessGoal === 'improve_endurance' && styles.selectedGoalText,
                  ]}
                >
                  Improve Endurance
                </Text>
                <Text
                  style={[
                    styles.goalDesc,
                    fitnessGoal === 'improve_endurance' && styles.selectedGoalDesc,
                  ]}
                >
                  Enhance cardiovascular fitness
                </Text>
              </View>
            </View>
            {fitnessGoal === 'improve_endurance' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalOption,
              fitnessGoal === 'maintain' && styles.selectedGoal,
            ]}
            onPress={() => setFitnessGoal('maintain')}
          >
            <View style={styles.goalContent}>
              <Ionicons
                name="fitness-outline"
                size={32}
                color={fitnessGoal === 'maintain' ? COLORS.white : COLORS.primary}
              />
              <View style={styles.goalTextContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    fitnessGoal === 'maintain' && styles.selectedGoalText,
                  ]}
                >
                  Maintain Fitness
                </Text>
                <Text
                  style={[
                    styles.goalDesc,
                    fitnessGoal === 'maintain' && styles.selectedGoalDesc,
                  ]}
                >
                  Stay active and maintain current level
                </Text>
              </View>
            </View>
            {fitnessGoal === 'maintain' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Based on your selections, we'll create a personalized workout plan designed 
            specifically for your goal of {fitnessGoal === 'lose_weight' 
              ? 'losing weight' 
              : fitnessGoal === 'gain_muscle' 
                ? 'gaining muscle' 
                : fitnessGoal === 'improve_endurance' 
                  ? 'improving endurance' 
                  : 'maintaining fitness'}.
          </Text>
        </View>
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          style={styles.completeButton}
        />
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
  progressContainer: {
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    marginTop: SIZES.xs,
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    textAlign: 'right',
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    marginBottom: SIZES.xl,
  },
  goalsContainer: {
    marginBottom: SIZES.xl,
  },
  goalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.borderRadiusMd,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.md,
  },
  selectedGoal: {
    backgroundColor: COLORS.primary,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalTextContainer: {
    marginLeft: SIZES.md,
    flex: 1,
  },
  goalTitle: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.black,
  },
  selectedGoalText: {
    color: COLORS.white,
  },
  goalDesc: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginTop: SIZES.xs,
  },
  selectedGoalDesc: {
    color: COLORS.lightGray,
  },
  noteContainer: {
    marginBottom: SIZES.xl,
  },
  noteText: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  completeButton: {
    marginTop: 'auto',
  },
});
export default OnboardingGoalsScreen;

