import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { COLORS, SIZES } from '../constants/theme';
interface NotificationButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
  showDot?: boolean;
}
const NotificationButton: React.FC<NotificationButtonProps> = ({
  onPress,
  color = COLORS.primary,
  size = 24,
  showDot,
}) => {
  const { hasUnreadNotifications } = useSelector((state: RootState) => state.notifications);
  const { notifications } = useSelector((state: RootState) => state.settings);
  // Only show notification dot if notifications are enabled and there are unread notifications
  const shouldShowDot = showDot !== undefined ? showDot : (notifications && hasUnreadNotifications);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!notifications}>
      <Ionicons 
        name={notifications ? "notifications" : "notifications-off"} 
        size={size} 
        color={notifications ? color : COLORS.gray} 
      />
      {shouldShowDot && (
        <View style={styles.notificationDot} />
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: SIZES.xs,
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
});
export default NotificationButton;

