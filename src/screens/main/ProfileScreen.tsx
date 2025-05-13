import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { updateUserProfile, logout } from '../../redux/authSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { UserRole } from '../../types';
import FloatingUtilityTool from '../../components/FloatingUtilityTool';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [height, setHeight] = useState(user?.height.toString() || '');
  const [weight, setWeight] = useState(user?.weight.toString() || '');
  const [bodyType, setBodyType] = useState(user?.bodyType || 'mesomorph');
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'maintain');
  
  const calculateBMI = () => {
    if (!user) return '-';
    
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  const handleSaveProfile = () => {
    if (!user) return;
    
    // Validate inputs
    if (!nickname.trim()) {
      Alert.alert('Error', 'Nickname is required');
      return;
    }
    
    const heightNum = parseFloat(height);
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      Alert.alert('Error', 'Please enter a valid height in cm (100-250)');
      return;
    }
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 250) {
      Alert.alert('Error', 'Please enter a valid weight in kg (30-250)');
      return;
    }
    
    dispatch(updateUserProfile({
      nickname,
      height: heightNum,
      weight: weightNum,
      bodyType,
      fitnessGoal,
    }));
    
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };
  
  const renderUserRoleBadge = () => {
    let badgeColor, textColor;
    
    switch(user?.role) {
      case UserRole.ADMIN:
        badgeColor = COLORS.error;
        textColor = COLORS.white;
        break;
      case UserRole.PREMIUM:
        badgeColor = COLORS.accent;
        textColor = COLORS.white;
        break;
      case UserRole.REGULAR:
      default:
        badgeColor = COLORS.primaryLight;
        textColor = COLORS.primary;
    }
    
    return (
      <View style={[styles.roleBadge, { backgroundColor: badgeColor }]}>
        <Text style={[styles.roleText, { color: textColor }]}>
          {user?.role.toUpperCase()}
        </Text>
      </View>
    );
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <Button
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.nickname.charAt(0).toUpperCase()}
            </Text>
          </View>
          {isEditing ? (
            <Input
              value={nickname}
              onChangeText={setNickname}
              containerStyle={styles.nicknameInput}
            />
          ) : (
            <Text style={styles.userName}>{user.nickname}</Text>
          )}
          <Text style={styles.userEmail}>{user.email}</Text>
          {renderUserRoleBadge()}
        </View>
        
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height</Text>
            {isEditing ? (
              <Input
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                containerStyle={styles.smallInput}
                rightIcon={<Text style={styles.inputUnit}>cm</Text>}
              />
            ) : (
              <Text style={styles.infoValue}>{user.height} cm</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight</Text>
            {isEditing ? (
              <Input
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                containerStyle={styles.smallInput}
                rightIcon={<Text style={styles.inputUnit}>kg</Text>}
              />
            ) : (
              <Text style={styles.infoValue}>{user.weight} kg</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>BMI</Text>
            <Text style={styles.infoValue}>
              {calculateBMI()} ({getBMICategory()})
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Body Type</Text>
            {isEditing ? (
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
            ) : (
              <Text style={styles.infoValue}>
                {user.bodyType.charAt(0).toUpperCase() + user.bodyType.slice(1)}
              </Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fitness Goal</Text>
            {isEditing ? (
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
                    Endurance
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
                    Maintain
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.infoValue}>
                {user.fitnessGoal === 'lose_weight'
                  ? 'Lose Weight'
                  : user.fitnessGoal === 'gain_muscle'
                  ? 'Gain Muscle'
                  : user.fitnessGoal === 'improve_endurance'
                  ? 'Improve Endurance'
                  : 'Maintain Fitness'}
              </Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          {isEditing && (
            <View style={styles.editActions}>
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                loading={isLoading}
                style={styles.saveButton}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setNickname(user.nickname);
                  setHeight(user.height.toString());
                  setWeight(user.weight.toString());
                  setBodyType(user.bodyType);
                  setFitnessGoal(user.fitnessGoal);
                }}
                type="outline"
                style={styles.cancelButton}
              />
            </View>
          )}
        </Card>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          type="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </ScrollView>
      
      <FloatingUtilityTool />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollContent: {
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20', // 20% opacity
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONTS.h1,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  userEmail: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  nicknameInput: {
    width: '80%',
    marginBottom: SIZES.xs,
  },
  roleBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadiusMd,
  },
  roleText: {
    fontSize: FONTS.small,
    fontWeight: 'bold',
  },
  infoCard: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoLabel: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
  },
  infoValue: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.black,
  },
  smallInput: {
    width: 120,
    marginBottom: 0,
  },
  inputUnit: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusSm,
    marginLeft: SIZES.xs,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONTS.tiny,
    color: COLORS.primary,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  goalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  goalOption: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusSm,
    marginLeft: SIZES.xs,
    marginBottom: SIZES.xs,
  },
  selectedGoal: {
    backgroundColor: COLORS.primary,
  },
  goalText: {
    fontSize: FONTS.tiny,
    color: COLORS.primary,
  },
  selectedGoalText: {
    color: COLORS.white,
  },
  editActions: {
    marginTop: SIZES.lg,
  },
  saveButton: {
    marginBottom: SIZES.sm,
  },
  cancelButton: {
    borderColor: COLORS.gray,
  },
  logoutButton: {
    marginBottom: SIZES.xl,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.error,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorText: {
    fontSize: FONTS.h4,
    color: COLORS.error,
    marginBottom: SIZES.lg,
  },
});

export default ProfileScreen;
