import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode, toggleNotifications, loadSettings } from '../../redux/settingsSlice';
import { RootState } from '../../redux/store';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../components/Card';
const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { darkMode, notifications } = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);
  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        const settingsJson = await AsyncStorage.getItem('settings');
        if (settingsJson) {
          const settings = JSON.parse(settingsJson);
          dispatch(loadSettings(settings));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    loadSavedSettings();
  }, [dispatch]);
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };
  const handleNotificationsToggle = () => {
    dispatch(toggleNotifications());
  };
  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Appearance
          </Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={darkMode ? "moon" : "moon-outline"} 
                size={24} 
                color={darkMode ? COLORS.white : COLORS.primary} 
              />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '70' }}
              thumbColor={darkMode ? COLORS.primary : COLORS.white}
            />
          </View>
        </Card>
        <Card style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Notifications
          </Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={notifications ? "notifications" : "notifications-outline"} 
                size={24} 
                color={darkMode ? COLORS.white : COLORS.primary} 
              />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '70' }}
              thumbColor={notifications ? COLORS.primary : COLORS.white}
            />
          </View>
          <Text style={[styles.description, darkMode && styles.darkDescription]}>
            Receive notifications for workout reminders and achievements
          </Text>
        </Card>
        <Card style={[styles.card, darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            About
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, darkMode && styles.darkText]}>Version</Text>
            <Text style={[styles.infoValue, darkMode && styles.darkText]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, darkMode && styles.darkText]}>Account Type</Text>
            <Text style={[
              styles.infoValue, 
              darkMode && styles.darkText, 
              styles.accountType,
              user?.role === 'premium' && styles.premiumText,
              user?.role === 'admin' && styles.adminText
            ]}>
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Text>
          </View>
        </Card>
        <TouchableOpacity style={styles.supportButton}>
          <Ionicons name="help-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.supportButtonText}>Get Support</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={[styles.footerText, darkMode && styles.darkFooterText]}>
            © {new Date().getFullYear()} JOSHFIT Team
          </Text>
          <Text style={[styles.footerText, darkMode && styles.darkFooterText]}>
            All rights reserved
          </Text>
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
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  scrollContent: {
    padding: SIZES.md,
  },
  card: {
    marginBottom: SIZES.lg,
  },
  darkCard: {
    backgroundColor: COLORS.darkSurface,
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.md,
  },
  darkText: {
    color: COLORS.darkText,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FONTS.body,
    marginLeft: SIZES.md,
    color: COLORS.black,
  },
  description: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginTop: SIZES.xs,
  },
  darkDescription: {
    color: COLORS.gray,
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
  accountType: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  premiumText: {
    color: COLORS.accent,
  },
  adminText: {
    color: COLORS.error,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadiusMd,
    marginBottom: SIZES.xl,
  },
  supportButtonText: {
    marginLeft: SIZES.sm,
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.lg,
    marginBottom: SIZES.xxl,
  },
  footerText: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  darkFooterText: {
    color: COLORS.gray,
  },
});
export default SettingsScreen;

