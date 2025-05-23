import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  SafeAreaView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  Notification
} from '../redux/notificationsSlice';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
interface NotificationPanelProps {
  visible: boolean;
  onClose: () => void;
}
const NotificationPanel: React.FC<NotificationPanelProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, hasUnreadNotifications } = useSelector((state: RootState) => state.notifications);
  const { darkMode } = useSelector((state: RootState) => state.settings);
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };
  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };
  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const formattedDate = new Date(item.timestamp).toLocaleString();
    let iconName: any = 'alert-circle-outline';
    let iconColor = COLORS.primary;
    switch (item.type) {
      case 'calories':
        iconName = 'flame-outline';
        iconColor = COLORS.accent;
        break;
      case 'steps':
        iconName = 'walk-outline'; // Changed from footsteps-outline which may not exist
        iconColor = COLORS.success;
        break;
      case 'workout':
        iconName = 'fitness-outline';
        iconColor = COLORS.primary;
        break;
      default:
        iconName = 'alert-circle-outline';
        iconColor = COLORS.info;
    }
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          !item.read && styles.unreadNotification,
          darkMode && styles.darkNotificationItem
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.notificationTitle, darkMode && styles.darkText]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationMessage, darkMode && styles.darkText]}>
            {item.message}
          </Text>
          <Text style={[styles.notificationTime, darkMode && styles.darkSubText]}>
            {formattedDate}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => dispatch(deleteNotification(item.id))}
        >
          <Ionicons name="close-circle" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  const renderEmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={60} color={COLORS.lightGray} />
      <Text style={[styles.emptyText, darkMode && styles.darkText]}>
        No notifications yet
      </Text>
    </View>
  );
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
        <View style={[styles.header, darkMode && styles.darkHeader]}>
          <Text style={[styles.title, darkMode && styles.darkText]}>Notifications</Text>
          <View style={styles.headerButtons}>
            {hasUnreadNotifications && (
              <TouchableOpacity style={styles.headerButton} onPress={handleMarkAllAsRead}>
                <Text style={styles.headerButtonText}>Mark all as read</Text>
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity style={styles.headerButton} onPress={handleClearAll}>
                <Text style={[styles.headerButtonText, { color: COLORS.error }]}>Clear all</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={darkMode ? COLORS.white : COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          ListEmptyComponent={renderEmptyNotifications}
        />
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  darkHeader: {
    backgroundColor: COLORS.darkSurface,
    borderBottomColor: COLORS.darkBorder,
  },
  title: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  darkText: {
    color: COLORS.white,
  },
  darkSubText: {
    color: COLORS.lightGray,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: SIZES.md,
  },
  headerButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.body,
  },
  closeButton: {
    padding: SIZES.xs,
  },
  notificationsList: {
    padding: SIZES.md,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    marginBottom: SIZES.sm,
    padding: SIZES.md,
    ...SHADOWS.small,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  darkNotificationItem: {
    backgroundColor: COLORS.darkSurface,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    marginBottom: 2,
    color: COLORS.black,
  },
  notificationMessage: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: FONTS.small,
    color: COLORS.gray,
  },
  deleteButton: {
    padding: SIZES.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyText: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    marginTop: SIZES.md,
  },
});
export default NotificationPanel;

