import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
const initialState: AppSettings = {
  darkMode: false,
  notifications: true,
  language: 'en'
};
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      AsyncStorage.setItem('settings', JSON.stringify(state)).catch(console.error);
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
      AsyncStorage.setItem('settings', JSON.stringify(state)).catch(console.error);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      AsyncStorage.setItem('settings', JSON.stringify(state)).catch(console.error);
    },
    loadSettings: (state, action: PayloadAction<AppSettings>) => {
      return { ...state, ...action.payload };
    }
  }
});
export const { toggleDarkMode, toggleNotifications, setLanguage, loadSettings } = settingsSlice.actions;
export default settingsSlice.reducer;

