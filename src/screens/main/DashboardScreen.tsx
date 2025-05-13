import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchDashboardData } from '../../redux/dashboardSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import FloatingUtilityTool from '../../components/FloatingUtilityTool';
import { UserRole } from '../../types';

const DashboardScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { steps, caloriesBurned, caloriesConsumed, weather, isLoading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { darkMode } = useSelector((state: RootState) => state.settings);
  
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  
  // Check if user is premium or admin
  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;
  
  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardData(user.id));
    }
  }, [dispatch, user]);
  
  useEffect(() => {
    // Set greeting based on time of day
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
    
    // Update time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const renderWeatherInfo = () => {
    if (!weather) return null;
    
    return (
      <Card style={styles.weatherCard}>
        <View style={styles.weatherContent}>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Ionicons name="water-outline" size={16} color={COLORS.primary} />
              <Text style={styles.weatherDetailText}>{weather.humidity}%</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="speedometer-outline" size={16} color={COLORS.primary} />
              <Text style={styles.weatherDetailText}>{weather.windSpeed} km/h</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };
  
  const calculateCalorieProgress = () => {
    // For this simple example, we'll aim for 2000 calories burned daily
    const goal = 2000;
    const progress = (caloriesBurned / goal) * 100;
    return progress > 100 ? 100 : progress;
  };
  
  const renderCalorieInfo = () => {
    const progress = calculateCalorieProgress();
    
    return (
      <Card style={styles.calorieCard}>
        <View style={styles.calorieHeader}>
          <Text style={styles.cardTitle}>Calories</Text>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.darkGray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calorieContent}>
          <View style={styles.calorieItem}>
            <View style={styles.calorieIconContainer}>
              <Ionicons name="flame-outline" size={24} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.calorieValue}>{caloriesBurned}</Text>
              <Text style={styles.calorieLabel}>Burned</Text>
            </View>
          </View>
          
          {isPremium && (
            <View style={styles.calorieItem}>
              <View style={[styles.calorieIconContainer, styles.intakeIcon]}>
                <Ionicons name="restaurant-outline" size={24} color={COLORS.white} />
              </View>
              <View>
                <Text style={styles.calorieValue}>{caloriesConsumed}</Text>
                <Text style={styles.calorieLabel}>Consumed</Text>
              </View>
            </View>
          )}
          
          <View style={styles.calorieItem}>
            <View style={[styles.calorieIconContainer, styles.netIcon]}>
              <Ionicons name="pulse-outline" size={24} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.calorieValue}>
                {isPremium ? caloriesBurned - caloriesConsumed : '-'}
              </Text>
              <Text style={styles.calorieLabel}>Net</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.toFixed(0)}% of daily goal
          </Text>
        </View>
      </Card>
    );
  };
  
  const renderStepsInfo = () => {
    return (
      <Card style={styles.stepsCard}>
        <View style={styles.stepsHeader}>
          <Text style={styles.cardTitle}>Today's Steps</Text>
          <Text style={styles.stepCount}>{steps.toLocaleString()}</Text>
        </View>
        
        <View style={styles.stepsIconContainer}>
          <Ionicons name="footsteps-outline" size={64} color={COLORS.primary} />
        </View>
        
        <TouchableOpacity style={styles.syncButton}>
          <Ionicons name="sync-outline" size={16} color={COLORS.primary} />
          <Text style={styles.syncText}>Sync Steps</Text>
        </TouchableOpacity>
      </Card>
    );
  };
  
  const renderAdminButton = () => {
    if (user?.role === UserRole.ADMIN) {
      return (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('Admin' as never)}
        >
          <Ionicons name="people" size={20} color={COLORS.white} />
          <Text style={styles.adminButtonText}>Manage Users</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{user?.nickname || 'User'}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <Text style={styles.currentTime}>{currentTime}</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings' as never)}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
        
        {renderWeatherInfo()}
        {renderCalorieInfo()}
        {renderStepsInfo()}
        {renderAdminButton()}
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
  greeting: {
    fontSize: FONTS.h4,
    color: COLORS.darkGray,
  },
  userName: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  currentTime: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  settingsButton: {
    padding: SIZES.xs,
  },
  weatherCard: {
    marginBottom: SIZES.md,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flexDirection: 'column',
  },
  temperature: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  weatherCondition: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
  },
  weatherDetails: {
    flexDirection: 'column',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  weatherDetailText: {
    marginLeft: SIZES.xs,
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  calorieCard: {
    marginBottom: SIZES.md,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  cardTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  calorieContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  calorieItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  intakeIcon: {
    backgroundColor: COLORS.accent,
  },
  netIcon: {
    backgroundColor: COLORS.info,
  },
  calorieValue: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  calorieLabel: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  progressContainer: {
    marginTop: SIZES.sm,
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
  stepsCard: {
    marginBottom: SIZES.md,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  stepCount: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stepsIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.md,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.primary + '10', // 10% opacity
    borderRadius: SIZES.borderRadiusMd,
  },
  syncText: {
    marginLeft: SIZES.xs,
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadiusMd,
    marginTop: SIZES.sm,
  },
  adminButtonText: {
    marginLeft: SIZES.sm,
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default DashboardScreen;
