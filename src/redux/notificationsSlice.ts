import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'calories' | 'steps' | 'workout' | 'system';
}
interface NotificationsState {
  notifications: Notification[];
  hasUnreadNotifications: boolean;
  lastStepMilestone: number;
  calorieGoalReached: boolean;
}
const initialState: NotificationsState = {
  notifications: [],
  hasUnreadNotifications: false,
  lastStepMilestone: 0,
  calorieGoalReached: false
};
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
        ...action.payload
      };
      state.notifications.unshift(newNotification);
      state.hasUnreadNotifications = true;
      // Persist notifications
      AsyncStorage.setItem('notifications', JSON.stringify(state.notifications))
        .catch(error => console.error('Failed to save notifications', error));
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
      // Check if there are any unread notifications
      state.hasUnreadNotifications = state.notifications.some(n => !n.read);
      // Persist notifications
      AsyncStorage.setItem('notifications', JSON.stringify(state.notifications))
        .catch(error => console.error('Failed to save notifications', error));
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.hasUnreadNotifications = false;
      // Persist notifications
      AsyncStorage.setItem('notifications', JSON.stringify(state.notifications))
        .catch(error => console.error('Failed to save notifications', error));
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      // Check if there are any unread notifications
      state.hasUnreadNotifications = state.notifications.some(n => !n.read);
      // Persist notifications
      AsyncStorage.setItem('notifications', JSON.stringify(state.notifications))
        .catch(error => console.error('Failed to save notifications', error));
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.hasUnreadNotifications = false;
      // Persist notifications
      AsyncStorage.setItem('notifications', JSON.stringify(state.notifications))
        .catch(error => console.error('Failed to save notifications', error));
    },
    loadNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.hasUnreadNotifications = action.payload.some(n => !n.read);
    },
    updateStepMilestone: (state, action: PayloadAction<number>) => {
      state.lastStepMilestone = action.payload;
    },
    setCalorieGoalReached: (state, action: PayloadAction<boolean>) => {
      state.calorieGoalReached = action.payload;
    }
  }
});
export const { 
  addNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  loadNotifications,
  updateStepMilestone,
  setCalorieGoalReached
} = notificationsSlice.actions;
export default notificationsSlice.reducer;

