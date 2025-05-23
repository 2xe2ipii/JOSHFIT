import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, WeatherData } from '../types';
import axios from 'axios';
import { RootState } from './store';
// Get real weather data for a city
const fetchWeatherForCity = async (city: string = 'Lipa City'): Promise<WeatherData> => {
  try {
    // Get weather data using OpenWeatherMap API
    const apiKey = '8d2de98e089f1c28e1a22fc19a24ef04'; // This is a placeholder API key
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );
    return {
      temperature: Math.round(weatherResponse.data.main.temp),
      condition: weatherResponse.data.weather[0].main,
      location: weatherResponse.data.name + ', ' + weatherResponse.data.sys.country,
      icon: `https://openweathermap.org/img/wn/${weatherResponse.data.weather[0].icon}@2x.png`,
      humidity: weatherResponse.data.main.humidity,
      windSpeed: weatherResponse.data.wind.speed
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return default weather data if API call fails
    return {
      temperature: 28,
      condition: 'Sunny',
      location: 'Lipa City, PH',
      icon: 'https://openweathermap.org/img/wn/01d@2x.png',
      humidity: 65,
      windSpeed: 5
    };
  }
};
// Fetch dashboard data with real weather
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      // Generate mock fitness data
      const steps = Math.floor(Math.random() * 5000) + 3000; // Random steps between 3000-8000
      const caloriesBurned = Math.floor(steps * 0.04); // Simple calculation based on steps
      // Get the current state to access food logs
      const state = getState() as RootState;
      // Calculate calories consumed from food logs
      const foodLogs = state.foodLog.foodLogs;
      const caloriesConsumed = foodLogs.reduce((total, log) => total + log.calories, 0);
      // Get real weather data
      const weatherData = await fetchWeatherForCity();
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
      const state = getState() as { dashboard: DashboardState, steps: { dailySteps: number } };
      const currentSteps = state.steps.dailySteps;
      const previousSteps = state.dashboard.steps;
      // Calculate only the calories from new steps
      const newSteps = currentSteps - previousSteps;
      const additionalCalories = Math.max(0, Math.floor(newSteps * 0.04)); // Only count positive step changes
      // Add these new calories to the existing calories burned
      const updatedCaloriesBurned = state.dashboard.caloriesBurned + additionalCalories;
      console.log(`Steps updated: ${previousSteps} -> ${currentSteps}, Added ${additionalCalories} calories, Total: ${updatedCaloriesBurned}`);
      return {
        steps: currentSteps,
        caloriesBurned: updatedCaloriesBurned,
        caloriesConsumed: state.dashboard.caloriesConsumed,
        weather: state.dashboard.weather
      };
    } catch (error) {
      return rejectWithValue('Failed to update steps. Please try again.');
    }
  }
);
// Update weather data for a specific city
export const updateWeather = createAsyncThunk(
  'dashboard/updateWeather',
  async (city: string, { rejectWithValue }) => {
    try {
      const weatherData = await fetchWeatherForCity(city);
      return weatherData;
    } catch (error) {
      return rejectWithValue('Failed to update weather data. Please try again.');
    }
  }
);
// Update calories burned when a workout is completed
export const updateCaloriesBurned = createAsyncThunk(
  'dashboard/updateCaloriesBurned',
  async (additionalCalories: number, { getState, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const state = getState() as { dashboard: DashboardState };
      const currentCaloriesBurned = state.dashboard.caloriesBurned;
      const newCaloriesBurned = currentCaloriesBurned + additionalCalories;
      return {
        caloriesBurned: newCaloriesBurned,
        steps: state.dashboard.steps,
        caloriesConsumed: state.dashboard.caloriesConsumed,
        weather: state.dashboard.weather
      };
    } catch (error) {
      return rejectWithValue('Failed to update calories burned. Please try again.');
    }
  }
);
// Update calories consumed when food is logged
export const updateCaloriesConsumed = createAsyncThunk(
  'dashboard/updateCaloriesConsumed',
  async (additionalCalories: number, { getState, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const state = getState() as { dashboard: DashboardState };
      const currentCaloriesConsumed = state.dashboard.caloriesConsumed;
      const newCaloriesConsumed = currentCaloriesConsumed + additionalCalories;
      return {
        caloriesConsumed: newCaloriesConsumed,
        steps: state.dashboard.steps,
        caloriesBurned: state.dashboard.caloriesBurned,
        weather: state.dashboard.weather
      };
    } catch (error) {
      return rejectWithValue('Failed to update calories consumed. Please try again.');
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
      })
      // Update Weather
      .addCase(updateWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weather = action.payload;
      })
      .addCase(updateWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Calories Burned
      .addCase(updateCaloriesBurned.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCaloriesBurned.fulfilled, (state, action) => {
        state.isLoading = false;
        state.caloriesBurned = action.payload.caloriesBurned;
        state.steps = action.payload.steps;
        state.caloriesConsumed = action.payload.caloriesConsumed;
        state.weather = action.payload.weather;
      })
      .addCase(updateCaloriesBurned.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Calories Consumed
      .addCase(updateCaloriesConsumed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCaloriesConsumed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.caloriesConsumed = action.payload.caloriesConsumed;
      })
      .addCase(updateCaloriesConsumed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});
export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

