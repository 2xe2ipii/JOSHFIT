import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import StepAnimation from './StepAnimation';
interface StepCounterCardProps {
  steps: number;
  weeklySteps: number[];
  isPedometerAvailable: boolean;
  darkMode?: boolean;
  onRefresh?: () => void;
}
const StepCounterCard: React.FC<StepCounterCardProps> = ({ 
  steps, 
  weeklySteps, 
  isPedometerAvailable, 
  darkMode = false,
  onRefresh 
}) => {
  // State to track previous step count for animation
  const [prevSteps, setPrevSteps] = useState(steps);
  const [isStepDetected, setIsStepDetected] = useState(false);
  const stepDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationValue = useRef(new Animated.Value(0)).current;
  // Check if steps have increased and trigger animation
  useEffect(() => {
    if (steps > prevSteps) {
      // Steps increased - show animation
      setIsStepDetected(true);
      // Animate the step counter with a subtle pulse
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
      // Clear any existing timeout
      if (stepDetectionTimeoutRef.current) {
        clearTimeout(stepDetectionTimeoutRef.current);
      }
      // Set timeout to hide animation after just 800ms for a brief appearance
      stepDetectionTimeoutRef.current = setTimeout(() => {
        setIsStepDetected(false);
      }, 800);
    }
    // Update previous steps
    setPrevSteps(steps);
    // Cleanup timeout on unmount
    return () => {
      if (stepDetectionTimeoutRef.current) {
        clearTimeout(stepDetectionTimeoutRef.current);
      }
    };
  }, [steps, animationValue, prevSteps]);
  // Calculate the daily step goal (10,000 steps is a common goal)
  const stepGoal = 10000;
  const progress = Math.min((steps / stepGoal) * 100, 100);
  // Get day names for the weekly chart
  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const targetDay = (today - (6 - dayIndex)) % 7;
    return days[targetDay < 0 ? targetDay + 7 : targetDay];
  };
  // Find the max steps in the weekly data for scaling the chart
  const maxWeeklySteps = Math.max(...weeklySteps, stepGoal / 2);
  return (
    <Card style={[styles.card, darkMode && styles.darkCard]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name="footsteps-outline" 
            size={24} 
            color={darkMode ? COLORS.lightGray : COLORS.primary} 
          />
          <Text style={[styles.title, darkMode && styles.darkText]}>Step Counter</Text>
        </View>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons 
              name="refresh" 
              size={20} 
              color={darkMode ? COLORS.lightGray : COLORS.darkGray} 
            />
          </TouchableOpacity>
        )}
      </View>
      {!isPedometerAvailable ? (
        <View style={styles.unavailableContainer}>
          <Ionicons name="alert-circle-outline" size={32} color={COLORS.warning} />
          <Text style={[styles.unavailableText, darkMode && styles.darkText]}>
            Step counter is not available on this device
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.stepCountContainer}>
            <Animated.View
              style={[
                styles.stepCountWrapper,
                {
                  transform: [
                    {
                      scale: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1]
                      })
                    }
                  ]
                }
              ]}
            >
              <Text style={[styles.stepCount, darkMode && styles.darkText]}>
                {steps.toLocaleString()}
              </Text>
              <Text style={[styles.stepGoalText, darkMode && styles.darkDescription]}>
                / {stepGoal.toLocaleString()} steps
              </Text>
            </Animated.View>
            <View style={styles.stepIndicatorContainer}>
              <StepAnimation 
                isActive={isStepDetected} 
                size={24} 
                speed={1.5} 
                color={COLORS.primary} 
              />
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                  progress >= 100 && styles.goalReached
                ]} 
              />
            </View>
            <Text style={[styles.progressText, darkMode && styles.darkDescription]}>
              {progress.toFixed(0)}% of daily goal
            </Text>
          </View>
          <View style={styles.weeklyContainer}>
            <Text style={[styles.weeklyTitle, darkMode && styles.darkText]}>Weekly Activity</Text>
            <View style={styles.chartContainer}>
              {weeklySteps.map((daySteps, index) => {
                // Calculate height percentage for the bar
                const dayHeight = Math.max((daySteps / maxWeeklySteps) * 100, 5);
                const isToday = index === weeklySteps.length - 1;
                return (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar, 
                          { height: `${dayHeight}%` },
                          isToday && styles.todayBar,
                          darkMode && styles.darkBar
                        ]} 
                      />
                    </View>
                    <Text style={[styles.dayLabel, darkMode && styles.darkDescription]}>
                      {getDayName(index)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.md,
    padding: SIZES.md,
    paddingVertical: SIZES.lg,
  },
  darkCard: {
    backgroundColor: COLORS.darkSurface,
  },
  darkText: {
    color: COLORS.darkText,
  },
  darkDescription: {
    color: COLORS.gray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.black,
    marginLeft: SIZES.sm,
  },
  refreshButton: {
    padding: SIZES.xs,
  },
  unavailableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  unavailableText: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
  stepCountContainer: {
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  stepCountWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  stepCount: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stepGoalText: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    marginBottom: 8,
    marginLeft: 4,
  },
  stepIndicatorContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  progressContainer: {
    marginBottom: SIZES.md,
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
  goalReached: {
    backgroundColor: COLORS.success,
  },
  progressText: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginTop: SIZES.xs,
  },
  weeklyContainer: {
    marginTop: SIZES.md,
  },
  weeklyTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    marginTop: SIZES.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 80,
    width: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  todayBar: {
    backgroundColor: COLORS.primary,
  },
  darkBar: {
    backgroundColor: COLORS.primaryDark,
  },
  dayLabel: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginTop: SIZES.xs,
  },
});
export default StepCounterCard;

