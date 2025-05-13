import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminStackParamList } from '../../navigation/types';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserRole, deleteUser } from '../../redux/adminSlice';
import { RootState } from '../../redux/store';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { UserRole } from '../../types';

type UserDetailScreenRouteProp = RouteProp<AdminStackParamList, 'UserDetail'>;
type UserDetailScreenNavigationProp = StackNavigationProp<AdminStackParamList, 'UserDetail'>;

const UserDetailScreen = () => {
  const route = useRoute<UserDetailScreenRouteProp>();
  const navigation = useNavigation<UserDetailScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const { userId } = route.params;
  const { users, isLoading } = useSelector((state: RootState) => state.admin);
  
  const user = users.find(u => u.id === userId);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);
  
  const handleUpdateRole = () => {
    if (user && selectedRole && selectedRole !== user.role) {
      Alert.alert(
        'Update User Role',
        `Are you sure you want to change ${user.nickname}'s role to ${selectedRole.toUpperCase()}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Update',
            onPress: () => {
              dispatch(updateUserRole({ userId, role: selectedRole }));
              Alert.alert('Success', 'User role updated successfully');
            },
          },
        ]
      );
    }
  };
  
  const handleDeleteUser = () => {
    if (user) {
      Alert.alert(
        'Delete User',
        `Are you sure you want to delete ${user.nickname}? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(deleteUser(userId));
              navigation.goBack();
            },
          },
        ]
      );
    }
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.nickname.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user.nickname}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
          </View>
        </View>
        
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>User Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{user.height} cm</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{user.weight} kg</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Body Type</Text>
            <Text style={styles.infoValue}>{user.bodyType.charAt(0).toUpperCase() + user.bodyType.slice(1)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fitness Goal</Text>
            <Text style={styles.infoValue}>
              {user.fitnessGoal === 'lose_weight' ? 'Lose Weight' :
               user.fitnessGoal === 'gain_muscle' ? 'Gain Muscle' :
               user.fitnessGoal === 'improve_endurance' ? 'Improve Endurance' : 'Maintain Fitness'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
          </View>
        </Card>
        
        <Card style={styles.roleCard}>
          <Text style={styles.sectionTitle}>Change User Role</Text>
          <Text style={styles.roleDescription}>
            Changing a user's role will affect their access to features within the app.
          </Text>
          
          <View style={styles.roleOptions}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === UserRole.REGULAR && styles.selectedRoleOption,
              ]}
              onPress={() => setSelectedRole(UserRole.REGULAR)}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === UserRole.REGULAR && styles.selectedRoleOptionText,
                ]}
              >
                Regular
              </Text>
              <Text
                style={[
                  styles.roleDescription,
                  selectedRole === UserRole.REGULAR && styles.selectedRoleDescription,
                ]}
              >
                Basic access to workouts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === UserRole.PREMIUM && styles.selectedRoleOption,
              ]}
              onPress={() => setSelectedRole(UserRole.PREMIUM)}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === UserRole.PREMIUM && styles.selectedRoleOptionText,
                ]}
              >
                Premium
              </Text>
              <Text
                style={[
                  styles.roleDescription,
                  selectedRole === UserRole.PREMIUM && styles.selectedRoleDescription,
                ]}
              >
                Full access including food logging
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === UserRole.ADMIN && styles.selectedRoleOption,
              ]}
              onPress={() => setSelectedRole(UserRole.ADMIN)}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === UserRole.ADMIN && styles.selectedRoleOptionText,
                ]}
              >
                Admin
              </Text>
              <Text
                style={[
                  styles.roleDescription,
                  selectedRole === UserRole.ADMIN && styles.selectedRoleDescription,
                ]}
              >
                Full access and user management
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title="Update Role"
            onPress={handleUpdateRole}
            disabled={!selectedRole || selectedRole === user.role}
            style={styles.updateButton}
          />
        </Card>
        
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <Button
            title="Delete User"
            onPress={handleDeleteUser}
            type="outline"
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>
      </ScrollView>
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
  backButton: {
    width: 120,
  },
  userHeader: {
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
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  userEmail: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  roleBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
  },
  roleText: {
    color: COLORS.white,
    fontSize: FONTS.small,
    fontWeight: 'bold',
  },
  infoCard: {
    marginBottom: SIZES.lg,
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
  roleCard: {
    marginBottom: SIZES.lg,
  },
  roleDescription: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
  },
  roleOptions: {
    marginBottom: SIZES.md,
  },
  roleOption: {
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
    marginBottom: SIZES.sm,
  },
  selectedRoleOption: {
    backgroundColor: COLORS.primary,
  },
  roleOptionText: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  selectedRoleOptionText: {
    color: COLORS.white,
  },
  selectedRoleDescription: {
    color: COLORS.white,
  },
  updateButton: {
    marginTop: SIZES.sm,
  },
  dangerZone: {
    backgroundColor: COLORS.error + '10', // 10% opacity
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.xl,
  },
  dangerZoneTitle: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.error,
    marginBottom: SIZES.md,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
  },
});

export default UserDetailScreen;
