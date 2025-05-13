import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardState, WeatherData } from '../types';

// Mock API calls for demonstration
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock dashboard data
      const steps = Math.floor(Math.random() * 5000) + 3000; // Random steps between 3000-8000
      const caloriesBurned = Math.floor(steps * 0.04); // Simple calculation based on steps
      const caloriesConsumed = Math.floor(Math.random() * 1000) + 1000; // Random calories between 1000-2000
      
      // Mock weather data
      const weatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 15) + 15, // Random temperature between 15-30°C
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        icon: 'https://example.com/weather-icon.png',
        humidity: Math.floor(Math.random() * 50) + 30, // Random humidity between 30-80%
        windSpeed: Math.floor(Math.random() * 20) + 5 // Random wind speed between 5-25 km/h
      };
      
      return {
        steps,
        caloriesBurned,
        caloriesConsumed,
        weather: weatherData
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch dashboard data. Please try again.');
    }
  }
);

export const updateSteps = createAsyncThunk(
  'dashboard/updateSteps',
  async (steps: number, { getState, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getState() as { dashboard: DashboardState };
      const caloriesBurned = Math.floor(steps * 0.04); // Simple calculation based on steps
      
      return {
        steps,
        caloriesBurned,
        caloriesConsumed: state.dashboard.caloriesConsumed,
        weather: state.dashboard.weather
      };
    } catch (error) {
      return rejectWithValue('Failed to update steps. Please try again.');
    }
  }
);

const initialState: DashboardState = {
  steps: 0,
  caloriesBurned: 0,
  caloriesConsumed: 0,
  weather: null,
  isLoading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.steps = action.payload.steps;
        state.caloriesBurned = action.payload.caloriesBurned;
        state.caloriesConsumed = action.payload.caloriesConsumed;
        state.weather = action.payload.weather;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Steps
      .addCase(updateSteps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSteps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.steps = action.payload.steps;
        state.caloriesBurned = action.payload.caloriesBurned;
      })
      .addCase(updateSteps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
