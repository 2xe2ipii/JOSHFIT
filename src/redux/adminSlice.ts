import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, User, UserRole } from '../types';

// Mock API calls for demonstration - In a real app, these would connect to a backend
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const users: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          nickname: 'User One',
          gender: 'male',
          height: 175,
          weight: 70,
          bodyType: 'mesomorph',
          fitnessGoal: 'gain_muscle',
          role: UserRole.REGULAR,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          nickname: 'User Two',
          gender: 'female',
          height: 165,
          weight: 55,
          bodyType: 'ectomorph',
          fitnessGoal: 'improve_endurance',
          role: UserRole.PREMIUM,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'admin@example.com',
          nickname: 'Admin User',
          gender: 'other',
          height: 180,
          weight: 75,
          bodyType: 'mesomorph',
          fitnessGoal: 'maintain',
          role: UserRole.ADMIN,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      return users;
    } catch (error) {
      return rejectWithValue('Failed to fetch users. Please try again.');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }: { userId: string; role: UserRole }, { rejectWithValue, getState }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const state = getState() as { admin: AdminState };
      const users = [...state.admin.users];
      
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        return rejectWithValue('User not found');
      }
      
      // Update user role
      users[userIndex] = {
        ...users[userIndex],
        role,
        updatedAt: new Date().toISOString()
      };
      
      return users;
    } catch (error) {
      return rejectWithValue('Failed to update user role. Please try again.');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const state = getState() as { admin: AdminState };
      const users = [...state.admin.users];
      
      const filteredUsers = users.filter(user => user.id !== userId);
      
      if (filteredUsers.length === users.length) {
        return rejectWithValue('User not found');
      }
      
      return filteredUsers;
    } catch (error) {
      return rejectWithValue('Failed to delete user. Please try again.');
    }
  }
);

const initialState: AdminState = {
  users: [],
  isLoading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
