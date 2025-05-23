import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchWorkoutPlan, updateExerciseCompletion, generateNextDayWorkout } from '../../redux/workoutSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import ScreenContainer from '../../components/ScreenContainer';
import { Exercise } from '../../types';
import { getRandomQuote } from '../../data/motivationalQuotes';
const WorkoutScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { workoutPlan, isLoading, error } = useSelector((state: RootState) => state.workout);
  const [totalExercises, setTotalExercises] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [motivationalQuote, setMotivationalQuote] = useState({ quote: '', author: '' });
  const { darkMode } = useSelector((state: RootState) => state.settings);
  useEffect(() => {
    if (user) {
      dispatch(fetchWorkoutPlan(user.id));
    }
  }, [dispatch, user]);
  useEffect(() => {
    if (workoutPlan) {
      setTotalExercises(workoutPlan.exercises.length);
      const completed = workoutPlan.exercises.filter(ex => ex.completed).length;
      setCompletedExercises(completed);
      // Set a new motivational quote when workout is completed
      if (completed === workoutPlan.exercises.length && completed > 0) {
        setMotivationalQuote(getRandomQuote());
      }
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
      <View style={styles.mainContainer}>
        {}
        <View style={[styles.stickyHeader, darkMode && styles.darkStickyHeader]}>
          <View style={styles.headerContent}>
            <Text style={[
              styles.title,
              darkMode && styles.darkText
            ]}>Today's Workout</Text>
          </View>
        </View>
        <ScreenContainer style={styles.container} scrollable={false}>
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
        </ScreenContainer>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.mainContainer}>
        {}
        <View style={[styles.stickyHeader, darkMode && styles.darkStickyHeader]}>
          <View style={styles.headerContent}>
            <Text style={[
              styles.title,
              darkMode && styles.darkText
            ]}>Today's Workout</Text>
          </View>
        </View>
        <ScreenContainer style={styles.container} scrollable={false}>
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
        </ScreenContainer>
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      {}
      <View style={[styles.stickyHeader, darkMode && styles.darkStickyHeader]}>
        <View style={styles.headerContent}>
          <Text style={[
            styles.title,
            darkMode && styles.darkText
          ]}>Today's Workout</Text>
        </View>
      </View>
      {}
      <ScreenContainer
        style={styles.container}
        scrollable={false}
      >
        {}
        <View style={styles.contentPadding} />
        {workoutPlan ? (
          <>
            {}
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
            {}
            <FlatList
              data={workoutPlan.exercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.exerciseList}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 100 }} />}
            />
          </>
        ) : (
          renderEmptyState()
        )}
        {}
        {workoutPlan && workoutPlan.completed && (
          <View style={styles.congratsOverlay}>
            <View style={styles.congratsCard}>
              <Ionicons name="trophy" size={60} color={COLORS.accent} />
              <Text style={styles.congratsTitle}>Congratulations!</Text>
              <Text style={styles.congratsSubtitle}>Workout Complete</Text>
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>"{motivationalQuote.quote}"</Text>
                <Text style={styles.quoteAuthor}>- {motivationalQuote.author}</Text>
              </View>
              <TouchableOpacity
                style={styles.generateNextButton}
                onPress={() => {
                  if (user) {
                    dispatch(generateNextDayWorkout());
                  }
                }}
              >
                <Text style={styles.generateNextButtonText}>Generate Next Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScreenContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    zIndex: 1,
  },
  contentContainer: {
    padding: SIZES.md,
    paddingTop: 0, // No top padding as we have the sticky header
    paddingBottom: SIZES.xl, // Extra padding at the bottom for the floating utility tool
  },
  contentPadding: {
    height: 90, // Height to account for the sticky header
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.md,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: SIZES.md,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkStickyHeader: {
    backgroundColor: COLORS.darkBackground,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    paddingTop: SIZES.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  exerciseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.darkGray,
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
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.md,
    ...SHADOWS.medium,
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: 'bold',
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
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.error,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  errorDescription: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.md,
    ...SHADOWS.small,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: 'bold',
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl,
    paddingHorizontal: SIZES.xl,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  completedText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: 'bold',
    marginLeft: SIZES.xs,
  },
  newWorkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.md,
    marginTop: SIZES.md,
    ...SHADOWS.medium,
  },
  newWorkoutButtonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  congratsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  congratsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.lg,
    padding: SIZES.xl,
    width: '85%',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  congratsTitle: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.md,
  },
  congratsSubtitle: {
    fontSize: FONTS.h4,
    color: COLORS.darkGray,
    marginBottom: SIZES.lg,
  },
  quoteContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginVertical: SIZES.md,
    width: '100%',
  },
  quoteText: {
    fontSize: FONTS.body,
    fontStyle: 'italic',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  quoteAuthor: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    textAlign: 'right',
  },
  generateNextButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.md,
    marginTop: SIZES.lg,
    width: '100%',
    ...SHADOWS.medium,
  },
  generateNextButtonText: {
    color: COLORS.white,
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default WorkoutScreen;

