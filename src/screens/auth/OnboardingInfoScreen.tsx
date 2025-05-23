import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import Card from '../../components/Card';
type OnboardingInfoScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OnboardingInfo'>;
type OnboardingInfoScreenRouteProp = RouteProp<AuthStackParamList, 'OnboardingInfo'>;
const OnboardingInfoScreen = () => {
  const navigation = useNavigation<OnboardingInfoScreenNavigationProp>();
  const route = useRoute<OnboardingInfoScreenRouteProp>();
  // Get data passed from register screen
  const { email, password, nickname } = route.params || {};
  // Gender selection
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const handleContinue = () => {
    // Navigate to next onboarding step with the collected data
    navigation.navigate('OnboardingMeasurements', {
      email,
      password,
      nickname,
      gender,
    });
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
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 3</Text>
        </View>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          We'll use this information to create a personalized experience for you
        </Text>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>I am</Text>
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
                size={32}
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
                size={32}
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
                size={32}
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
        </View>
        <View style={styles.infoCard}>
          <Card>
            <View style={styles.infoCardContent}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
              <Text style={styles.infoCardText}>
                Your gender helps us provide more accurate fitness recommendations and calorie calculations.
              </Text>
            </View>
          </Card>
        </View>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
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
  formSection: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.md,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    width: '30%',
    height: 110,
    borderRadius: SIZES.borderRadiusMd,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  selectedGender: {
    backgroundColor: COLORS.primary,
  },
  genderText: {
    marginTop: SIZES.sm,
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.primary,
  },
  selectedGenderText: {
    color: COLORS.white,
  },
  infoCard: {
    marginBottom: SIZES.xl,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardText: {
    marginLeft: SIZES.sm,
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    flex: 1,
  },
  continueButton: {
    marginTop: 'auto',
  },
});
export default OnboardingInfoScreen;

