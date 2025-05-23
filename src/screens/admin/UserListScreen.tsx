import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminStackParamList, RootStackParamList } from '../../navigation/types';
import { useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../../redux/adminSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { User, UserRole } from '../../types';
type UserListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdminStackParamList, 'UserList'>,
  StackNavigationProp<RootStackParamList>
>;
const UserListScreen = () => {
  const navigation = useNavigation<UserListScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useSelector((state: RootState) => state.admin);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  useEffect(() => {
    // Fetch all users when the component mounts
    dispatch(fetchAllUsers());
  }, [dispatch]);
  useEffect(() => {
    // Filter users based on search query
    if (users) {
      if (searchQuery.trim() === '') {
        setFilteredUsers(users);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = users.filter(
          user =>
            user.nickname.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
      }
    }
  }, [users, searchQuery]);
  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
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
          },
        },
      ]
    );
  };
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return { bg: COLORS.error, text: COLORS.white };
      case UserRole.PREMIUM:
        return { bg: COLORS.accent, text: COLORS.white };
      case UserRole.REGULAR:
      default:
        return { bg: COLORS.primaryLight, text: COLORS.primary };
    }
  };
  const renderUserItem = ({ item }: { item: User }) => {
    const roleColors = getRoleBadgeColor(item.role);
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => navigation.navigate('Admin', { screen: 'UserDetail', params: { userId: item.id } })}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.nickname.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.nickname}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: roleColors.bg }]}>
              <Text style={[styles.roleText, { color: roleColors.text }]}>
                {item.role.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('Admin', { screen: 'UserDetail', params: { userId: item.id } })}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  // Render different content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchAllUsers())}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filteredUsers.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="people-outline" size={64} color={COLORS.lightGray} />
          <Text style={styles.noUsersText}>No users found</Text>
          <TouchableOpacity
            style={styles.addUserButton}
            onPress={() => navigation.navigate('Admin', { screen: 'AddUser' })}
          >
            <Text style={styles.addUserText}>Add New User</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  return (
    <ScreenContainer style={styles.container} scrollable={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Admin', { screen: 'AddUser' })}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.darkGray} />
          <TouchableOpacity style={styles.searchInputContainer}>
            <Text style={styles.searchPlaceholder}>Search users...</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderContent()}
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 15 : 25,
    paddingBottom: SIZES.md,
    marginBottom: SIZES.sm,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginRight: SIZES.sm,
  },
  searchInputContainer: {
    flex: 1,
    marginLeft: SIZES.sm,
  },
  searchPlaceholder: {
    color: COLORS.darkGray,
    fontSize: FONTS.body,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  list: {
    padding: SIZES.md,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONTS.h3,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadiusSm,
  },
  roleText: {
    fontSize: FONTS.tiny,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  editButton: {
    backgroundColor: COLORS.primary + '20', // 20% opacity
  },
  deleteButton: {
    backgroundColor: COLORS.error + '20', // 20% opacity
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorText: {
    fontSize: FONTS.h5,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  retryButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
  },
  retryText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: '600',
  },
  noUsersText: {
    fontSize: FONTS.h5,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
  },
  addUserButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
  },
  addUserText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: '600',
  },
});
export default UserListScreen;

