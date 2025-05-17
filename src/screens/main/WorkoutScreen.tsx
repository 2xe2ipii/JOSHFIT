import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchWorkoutPlan, updateExerciseCompletion } from '../../redux/workoutSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import FloatingUtilityTool from '../../components/FloatingUtilityTool';
import { Exercise } from '../../types';
import { State } from 'react-native-gesture-handler';

const WorkoutScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { workoutPlan, isLoading, error } = useSelector((state: RootState) => state.workout);
  const [totalExercises, setTotalExercises] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const { darkMode } = useSelector((state: RootState) => state.settings);

  // Calculate top padding for Android if SafeAreaView inset is 0
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

  useEffect(() => {
    if (user) {
      dispatch(fetchWorkoutPlan(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (workoutPlan) {
      setTotalExercises(workoutPlan.exercises.length);
      setCompletedExercises(workoutPlan.exercises.filter(ex => ex.completed).length);
    }
  }, [workoutPlan]);

  const handleToggleExercise = (exerciseId: string, completed: boolean) => {
    dispatch(updateExerciseCompletion({ exerciseId, completed }));
  };

  const calculateProgress = () => {
    if (totalExercises === 0) return 0;
    return (completedExercises / totalExercises) * 100;
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    return (
      <Card style={[
        styles.exerciseCard,
        darkMode && styles.darkCard
      ]}>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseTitleContainer}>
            <Text style={[
              styles.exerciseName,
              darkMode && styles.darkText
              ]}>{item.name}</Text>
            <Text style={[
              styles.exerciseDescription,
              darkMode && styles.darkDescription
            ]}>
              {item.description}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              darkMode && { backgroundColor: COLORS.darkSurface },
              item.completed && styles.checkboxChecked,
            ]}
            onPress={() => handleToggleExercise(item.id, !item.completed)}
          >
            {item.completed && (
              <Ionicons name="checkmark" size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseDetailItem}>
            <Ionicons name="repeat-outline" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.sets} sets</Text>
          </View>

          <View style={styles.exerciseDetailItem}>
            <Ionicons name="fitness-outline" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.reps} reps</Text>
          </View>

          <View style={styles.exerciseDetailItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.restTime}s rest</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="fitness-outline" size={80} color={COLORS.lightGray} />
        <Text style={styles.emptyTitle}>No Workout Plan</Text>
        <Text style={styles.emptyDescription}>
          You don't have a workout plan for today. Create one to start your fitness journey.
        </Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => {
            if (user) {
              Alert.alert('Generate Workout', 'Do you want to generate a new workout plan?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Generate',
                  onPress: () => dispatch(fetchWorkoutPlan(user.id)),
                },
              ]);
            }
          }}
        >
          <Text style={styles.generateButtonText}>Generate Workout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container,{ paddingTop: topPadding }]}>
        <View style={[
          styles.loadingContainer,
          darkMode && styles.darkContainer
          ]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[
            styles.loadingText,
            darkMode && styles.darkText
          ]}>Loading your workout plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (user) {
                dispatch(fetchWorkoutPlan(user.id));
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
    styles.container, 
    darkMode && styles.darkContainer,
    { paddingTop: topPadding }
    ]}>

      <View style={styles.header}>
        <Text style={[
        styles.title,
        darkMode && styles.darkText
        ]}>Today's Workout</Text>
      </View>

      {workoutPlan ? (
        <>
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={[
              styles.progressTitle,
              darkMode && styles.darkText
              ]}>Your Progress</Text>
              <Text style={[
              styles.progressStats,
              darkMode && styles.darkDescription
              ]}>
                {completedExercises} of {totalExercises} exercises completed
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${calculateProgress()}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {calculateProgress().toFixed(0)}%
              </Text>
            </View>
          </View>

          <FlatList
            data={workoutPlan.exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.exerciseList}
            showsVerticalScrollIndicator={false}
          />

          {workoutPlan.completed ? (
            <View style={styles.completedContainer}>
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
                <Text style={styles.completedText}>Workout Completed!</Text>
              </View>
              <TouchableOpacity
                style={styles.newWorkoutButton}
                onPress={() => {
                  if (user) {
                    Alert.alert('Generate Workout', 'Do you want to generate a new workout plan?', [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Generate',
                        onPress: () => dispatch(fetchWorkoutPlan(user.id)),
                      },
                    ]);
                  }
                }}
              >
                <Text style={styles.newWorkoutButtonText}>Generate New Workout</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      ) : (
        renderEmptyState()
      )}

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
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  darkCard: {
    backgroundColor: COLORS.darkSurface,
  },
  darkDescription: {
    color: COLORS.gray,
  },
  darkText: {
    color: COLORS.darkText,
  },
//  shareButton: {
//    width: 40,
//    height: 40,
//    justifyContent: 'center',
//   alignItems: 'center',
//    borderRadius: 20,
//    backgroundColor: COLORS.white,
//    ...SHADOWS.small,
//  },
  progressSection: {
    marginHorizontal: SIZES.xl,
    marginBottom: SIZES.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  progressTitle: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.black,
  },
  progressStats: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
    width: 40,
    textAlign: 'right',
  },
  exerciseList: {
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xxl,
  },
  exerciseCard: {
    marginBottom: SIZES.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseTitleContainer: {
    flex: 1,
    marginRight: SIZES.md,
  },
  exerciseName: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  exerciseDescription: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  exerciseDetails: {
    flexDirection: 'row',
    marginTop: SIZES.md,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  exerciseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.xl,
  },
  detailText: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginLeft: SIZES.xs,
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
    marginBottom: SIZES.xl,
  },
  generateButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
  },
  generateButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
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
  completedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.lg,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.borderRadiusLg,
    borderTopRightRadius: SIZES.borderRadiusLg,
    ...SHADOWS.large,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: SIZES.borderRadiusMd,
    paddingVertical: SIZES.sm,
    marginBottom: SIZES.md,
  },
  completedText: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: SIZES.sm,
  },
  newWorkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
    paddingVertical: SIZES.md,
    alignItems: 'center',
  },
  newWorkoutButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default WorkoutScreen;
