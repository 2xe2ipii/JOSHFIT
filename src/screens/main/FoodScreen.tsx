import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchFoodLogs, addFoodLog, deleteFoodLog } from '../../redux/foodLogSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import { FoodLog, UserRole } from '../../types';
import FloatingUtilityTool from '../../components/FloatingUtilityTool';

const FoodScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { foodLogs, isLoading, error } = useSelector((state: RootState) => state.foodLog);
  const [foodInput, setFoodInput] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  
  // Check if user has access to this premium feature
  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;
  
  useEffect(() => {
    if (user && isPremium) {
      dispatch(fetchFoodLogs(user.id));
    }
  }, [dispatch, user, isPremium]);
  
  useEffect(() => {
    // Calculate total calories consumed
    const total = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    setTotalCalories(total);
  }, [foodLogs]);
  
  const handleAddFoodLog = () => {
    if (!foodInput.trim()) {
      Alert.alert('Error', 'Please enter a food item');
      return;
    }
    
    if (user) {
      dispatch(addFoodLog({ 
        userId: user.id,
        foodDescription: foodInput
      }));
      setFoodInput('');
    }
  };
  
  const handleDeleteFoodLog = (logId: string) => {
    Alert.alert(
      'Delete Food Entry',
      'Are you sure you want to delete this food entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteFoodLog(logId)),
        },
      ]
    );
  };
  
  const renderFoodLogItem = ({ item }: { item: FoodLog }) => {
    return (
      <Card style={styles.foodLogCard}>
        <View style={styles.foodLogHeader}>
          <View>
            <Text style={styles.foodName}>{item.foodName}</Text>
            <Text style={styles.servingSize}>{item.servingSize}</Text>
          </View>
          <View style={styles.calorieContainer}>
            <Text style={styles.calories}>{item.calories}</Text>
            <Text style={styles.caloriesLabel}>cal</Text>
          </View>
        </View>
        
        <View style={styles.foodLogFooter}>
          <Text style={styles.timeText}>
            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteFoodLog(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };
  
  const renderAccessDenied = () => {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed" size={64} color={COLORS.gray} />
        <Text style={styles.accessDeniedTitle}>Premium Feature</Text>
        <Text style={styles.accessDeniedText}>
          Food and calorie logging is available only for Premium and Admin users.
        </Text>
      </View>
    );
  };
  
  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="restaurant-outline" size={64} color={COLORS.lightGray} />
        <Text style={styles.emptyTitle}>No Food Entries</Text>
        <Text style={styles.emptyDescription}>
          Start logging your meals using the input field below to track your calories.
        </Text>
      </View>
    );
  };
  
  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        {renderAccessDenied()}
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Log</Text>
        <View style={styles.calorieCounter}>
          <Ionicons name="flame-outline" size={20} color={COLORS.white} />
          <Text style={styles.calorieCounterText}>{totalCalories} cal</Text>
        </View>
      </View>
      
      {isLoading && foodLogs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your food logs...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (user) {
                dispatch(fetchFoodLogs(user.id));
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={foodLogs}
          renderItem={renderFoodLogItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.foodLogList}
          ListEmptyComponent={renderEmptyList}
        />
      )}
      
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter food (e.g. 1 apple, chicken salad)"
            value={foodInput}
            onChangeText={setFoodInput}
            onSubmitEditing={handleAddFoodLog}
          />
          {isLoading && (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.inputLoader} />
          )}
        </View>
        <TouchableOpacity
          style={[styles.addButton, !foodInput.trim() && styles.disabledButton]}
          onPress={handleAddFoodLog}
          disabled={!foodInput.trim() || isLoading}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      <FloatingUtilityTool />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  calorieCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.borderRadiusMd,
  },
  calorieCounterText: {
    marginLeft: SIZES.xs,
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  foodLogList: {
    padding: SIZES.md,
    paddingBottom: 100, // Extra padding for input bar
  },
  foodLogCard: {
    marginBottom: SIZES.md,
  },
  foodLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  servingSize: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calories: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  caloriesLabel: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginLeft: SIZES.xs,
  },
  foodLogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.sm,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  timeText: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10', // 10% opacity
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderTopLeftRadius: SIZES.borderRadiusLg,
    borderTopRightRadius: SIZES.borderRadiusLg,
    ...SHADOWS.large,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadiusMd,
    paddingHorizontal: SIZES.md,
    marginRight: SIZES.md,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: FONTS.body,
    color: COLORS.black,
  },
  inputLoader: {
    marginLeft: SIZES.sm,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: FONTS.body,
    color: COLORS.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.error,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  errorDescription: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  retryButton: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
  },
  retryButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyTitle: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyDescription: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  accessDeniedTitle: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  accessDeniedText: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    paddingHorizontal: SIZES.xl,
  },
});

export default FoodScreen;
