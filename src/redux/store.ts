import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice';
import workoutReducer from './workoutSlice';
import foodLogReducer from './foodLogSlice';
import adminReducer from './adminSlice';
import settingsReducer from './settingsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  workout: workoutReducer,
  foodLog: foodLogReducer,
  admin: adminReducer,
  settings: settingsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
