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
import Input from '../../components/Input';

type OnboardingMeasurementsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OnboardingMeasurements'>;
type OnboardingMeasurementsScreenRouteProp = RouteProp<AuthStackParamList, 'OnboardingMeasurements'>;

const OnboardingMeasurementsScreen = () => {
  const navigation = useNavigation<OnboardingMeasurementsScreenNavigationProp>();
  const route = useRoute<OnboardingMeasurementsScreenRouteProp>();

  // Get data passed from previous screen
  const { email, password, nickname, gender } = route.params || {};

  // Height and weight
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyType, setBodyType] = useState<'ectomorph' | 'mesomorph' | 'endomorph'>('mesomorph');
  const [validationErrors, setValidationErrors] = useState({
    height: '',
    weight: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { height: '', weight: '' };

    if (!height.trim()) {
      newErrors.height = 'Height is required';
      isValid = false;
    } else if (isNaN(Number(height)) || Number(height) < 100 || Number(height) > 250) {
      newErrors.height = 'Enter a valid height in cm (100-250)';
      isValid = false;
    }

    if (!weight.trim()) {
      newErrors.weight = 'Weight is required';
      isValid = false;
    } else if (isNaN(Number(weight)) || Number(weight) < 30 || Number(weight) > 250) {
      newErrors.weight = 'Enter a valid weight in kg (30-250)';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Navigate to next onboarding step with all collected data
      navigation.navigate('OnboardingGoals', {
        email,
        password,
        nickname,
        gender,
        height: Number(height),
        weight: Number(weight),
        bodyType,
      });
    }
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
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 3</Text>
        </View>

        <Text style={styles.title}>Your measurements</Text>
        <Text style={styles.subtitle}>
          These help us calculate your ideal workout plan and track your progress
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Height & Weight</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Input
                label="Height"
                placeholder="cm"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                error={validationErrors.height}
                rightIcon={<Text style={styles.inputUnit}>cm</Text>}
              />
            </View>
            <View style={styles.inputContainer}>
              <Input
                label="Weight"
                placeholder="kg"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                error={validationErrors.weight}
                rightIcon={<Text style={styles.inputUnit}>kg</Text>}
              />
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Body Type</Text>
          <View style={styles.bodyTypeContainer}>
            <TouchableOpacity
              style={[
                styles.bodyTypeOption,
                bodyType === 'ectomorph' && styles.selectedBodyType,
              ]}
              onPress={() => setBodyType('ectomorph')}
            >
              <View style={styles.bodyTypeIconContainer}>
                <Ionicons
                  name="body-outline"
                  size={32}
                  color={bodyType === 'ectomorph' ? COLORS.white : COLORS.primary}
                />
              </View>
              <Text
                style={[
                  styles.bodyTypeName,
                  bodyType === 'ectomorph' && styles.selectedBodyTypeName,
                ]}
              >
                Ectomorph
              </Text>
              <Text
                style={[
                  styles.bodyTypeDesc,
                  bodyType === 'ectomorph' && styles.selectedBodyTypeDesc,
                ]}
              >
                Lean & Long
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bodyTypeOption,
                bodyType === 'mesomorph' && styles.selectedBodyType,
              ]}
              onPress={() => setBodyType('mesomorph')}
            >
              <View style={styles.bodyTypeIconContainer}>
                <Ionicons
                  name="body-outline"
                  size={32}
                  color={bodyType === 'mesomorph' ? COLORS.white : COLORS.primary}
                />
              </View>
              <Text
                style={[
                  styles.bodyTypeName,
                  bodyType === 'mesomorph' && styles.selectedBodyTypeName,
                ]}
              >
                Mesomorph
              </Text>
              <Text
                style={[
                  styles.bodyTypeDesc,
                  bodyType === 'mesomorph' && styles.selectedBodyTypeDesc,
                ]}
              >
                Athletic & Strong
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bodyTypeOption,
                bodyType === 'endomorph' && styles.selectedBodyType,
              ]}
              onPress={() => setBodyType('endomorph')}
            >
              <View style={styles.bodyTypeIconContainer}>
                <Ionicons
                  name="body-outline"
                  size={32}
                  color={bodyType === 'endomorph' ? COLORS.white : COLORS.primary}
                />
              </View>
              <Text
                style={[
                  styles.bodyTypeName,
                  bodyType === 'endomorph' && styles.selectedBodyTypeName,
                ]}
              >
                Endomorph
              </Text>
              <Text
                style={[
                  styles.bodyTypeDesc,
                  bodyType === 'endomorph' && styles.selectedBodyTypeDesc,
                ]}
              >
                Soft & Round
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Card>
            <View style={styles.infoCardContent}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
              <Text style={styles.infoCardText}>
                Your body type helps us tailor workouts to your natural physiology.
                Everyone is unique and might be a combination of types.
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
  },
  inputUnit: {
    color: COLORS.darkGray,
    fontSize: FONTS.body,
  },
  bodyTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyTypeOption: {
    width: '31%',
    borderRadius: SIZES.borderRadiusMd,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SIZES.sm,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  selectedBodyType: {
    backgroundColor: COLORS.primary,
  },
  bodyTypeIconContainer: {
    marginBottom: SIZES.sm,
  },
  bodyTypeName: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  selectedBodyTypeName: {
    color: COLORS.white,
  },
  bodyTypeDesc: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  selectedBodyTypeDesc: {
    color: COLORS.lightGray,
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

export default OnboardingMeasurementsScreen;
