import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FoodLogState, FoodLog } from '../types';
import { searchFoodItems, getNutritionInfo, NutritionixFoodItem } from '../services/nutritionixApi';
import { updateCaloriesConsumed } from './dashboardSlice';
// Mock API calls for demonstration - In a real app, we would connect to Nutritionix API
export const fetchFoodLogs = createAsyncThunk(
  'foodLog/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, we would fetch food logs from a database or API
      // For now, we'll return an empty array to start with no food logs
      const foodLogs: FoodLog[] = [];
      return foodLogs;
    } catch (error) {
      return rejectWithValue('Failed to fetch food logs. Please try again.');
    }
  }
);
export const searchFood = createAsyncThunk(
  'foodLog/search',
  async (query: string, { rejectWithValue }) => {
    try {
      // Search for food items using Nutritionix API
      const foodItems = await searchFoodItems(query);
      return foodItems;
    } catch (error) {
      return rejectWithValue('Failed to search for food items. Please try again.');
    }
  }
);
export const addFoodLog = createAsyncThunk(
  'foodLog/add',
  async ({ userId, foodItem }: { userId: string; foodItem: NutritionixFoodItem }, { dispatch, rejectWithValue }) => {
    try {
      // The nf_calories value from the food item already includes the serving size adjustment
      // We don't need to multiply it again
      const calories = Math.round(foodItem.nf_calories);
      // Create new food log from the selected food item
      const newFoodLog: FoodLog = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        foodName: foodItem.food_name,
        calories: calories,
        servingSize: `${foodItem.serving_qty} ${foodItem.serving_unit}`,
        date: new Date().toISOString()
      };
      // Update calories consumed in the dashboard
      dispatch(updateCaloriesConsumed(calories));
      return newFoodLog;
    } catch (error) {
      return rejectWithValue('Failed to add food log. Please try again.');
    }
  }
);
export const deleteFoodLog = createAsyncThunk(
  'foodLog/delete',
  async (logId: string, { getState, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const state = getState() as { foodLog: FoodLogState };
      const foodLogs = [...state.foodLog.foodLogs];
      const filteredLogs = foodLogs.filter(log => log.id !== logId);
      if (filteredLogs.length === foodLogs.length) {
        return rejectWithValue('Food log not found');
      }
      return filteredLogs;
    } catch (error) {
      return rejectWithValue('Failed to delete food log. Please try again.');
    }
  }
);
const initialState: FoodLogState = {
  foodLogs: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null
};
const foodLogSlice = createSlice({
  name: 'foodLog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.isSearching = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Food Logs
      .addCase(fetchFoodLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFoodLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.foodLogs = action.payload;
      })
      .addCase(fetchFoodLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add Food Log
      .addCase(addFoodLog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFoodLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.foodLogs = [...state.foodLogs, action.payload];
      })
      .addCase(addFoodLog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Food
      .addCase(searchFood.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchFood.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
        console.log('Search results in reducer:', action.payload);
      })
      .addCase(searchFood.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      })
      // Delete Food Log
      .addCase(deleteFoodLog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFoodLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.foodLogs = action.payload;
      })
      .addCase(deleteFoodLog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});
export const { clearError, clearSearchResults } = foodLogSlice.actions;
export default foodLogSlice.reducer;

