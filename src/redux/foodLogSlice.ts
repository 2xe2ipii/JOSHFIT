import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FoodLogState, FoodLog } from '../types';

// Mock API calls for demonstration - In a real app, we would connect to Nutritionix API
export const fetchFoodLogs = createAsyncThunk(
  'foodLog/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock food log data
      const foodLogs: FoodLog[] = [
        {
          id: '1',
          userId,
          foodName: 'Oatmeal with banana',
          calories: 350,
          servingSize: '1 bowl',
          date: new Date().toISOString()
        },
        {
          id: '2',
          userId,
          foodName: 'Grilled chicken salad',
          calories: 450,
          servingSize: '1 plate',
          date: new Date().toISOString()
        },
        {
          id: '3',
          userId,
          foodName: 'Protein shake',
          calories: 200,
          servingSize: '1 glass',
          date: new Date().toISOString()
        }
      ];
      
      return foodLogs;
    } catch (error) {
      return rejectWithValue('Failed to fetch food logs. Please try again.');
    }
  }
);

export const addFoodLog = createAsyncThunk(
  'foodLog/add',
  async ({ userId, foodDescription }: { userId: string; foodDescription: string }, { rejectWithValue }) => {
    try {
      // Simulating API call to Nutritionix
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would call the Nutritionix API to get food data
      // For the mock, we'll generate some reasonable values
      const foodItems = [
        { name: 'Apple', calories: 95, serving: '1 medium' },
        { name: 'Banana', calories: 105, serving: '1 medium' },
        { name: 'Chicken Breast', calories: 165, serving: '3 oz' },
        { name: 'Salad', calories: 20, serving: '1 cup' },
        { name: 'Rice', calories: 200, serving: '1 cup' },
        { name: 'Pasta', calories: 220, serving: '1 cup' },
        { name: 'Protein Shake', calories: 150, serving: '1 scoop' },
        { name: 'Greek Yogurt', calories: 100, serving: '6 oz' },
        { name: 'Sandwich', calories: 350, serving: '1 sandwich' },
        { name: 'Pizza', calories: 285, serving: '1 slice' }
      ];
      
      // Generate random food item
      const randomIndex = Math.floor(Math.random() * foodItems.length);
      const foodItem = foodItems[randomIndex];
      
      // Create new food log
      const newFoodLog: FoodLog = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        foodName: foodDescription || foodItem.name,
        calories: foodItem.calories,
        servingSize: foodItem.serving,
        date: new Date().toISOString()
      };
      
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
  isLoading: false,
  error: null
};

const foodLogSlice = createSlice({
  name: 'foodLog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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

export const { clearError } = foodLogSlice.actions;
export default foodLogSlice.reducer;
