import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WorkoutState, WorkoutPlan, Exercise, User } from '../types';
import { selectWorkoutTemplate } from '../data/combinedWorkoutTemplates';
import { updateCaloriesBurned } from './dashboardSlice';
// Mock API calls for demonstration
export const fetchWorkoutPlan = createAsyncThunk(
  'workout/fetchWorkoutPlan',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, we would fetch the user's workout plan from a database
      // For now, we'll use the state to get the user information
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;
      if (!user) {
        return rejectWithValue('User not found');
      }
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      // Select the appropriate workout template based on user's body type, gender, and fitness goal
      const selectedTemplate = selectWorkoutTemplate(
        user.bodyType,
        user.gender,
        user.fitnessGoal
      );
      // Determine which day's workout to use (based on a rotation)
      // This creates a rotating schedule of workouts from the template
      const dayIndex = new Date().getDay() % selectedTemplate.days.length;
      const dayWorkout = selectedTemplate.days[dayIndex];
      // Assign unique IDs to exercises and mark them as not completed
      const exercises = dayWorkout.exercises.map((exercise, index) => ({
        ...exercise,
        id: `${today}-${index}`, // Create unique IDs based on date and index
        completed: false
      }));
      // Create the workout plan
      const workoutPlan: WorkoutPlan = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        exercises,
        date: today,
        completed: false
      };
      return workoutPlan;
    } catch (error) {
      return rejectWithValue('Failed to fetch workout plan. Please try again.');
    }
  }
);
export const generateWorkoutPlan = createAsyncThunk(
  'workout/generateWorkoutPlan',
  async (user: User, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      // Select the appropriate workout template based on user's body type, gender, and fitness goal
      const selectedTemplate = selectWorkoutTemplate(
        user.bodyType,
        user.gender,
        user.fitnessGoal
      );
      // Determine which day's workout to use (based on a rotation)
      // This creates a rotating schedule of workouts from the template
      const dayIndex = new Date().getDay() % selectedTemplate.days.length;
      const dayWorkout = selectedTemplate.days[dayIndex];
      // Assign unique IDs to exercises and mark them as not completed
      const exercises = dayWorkout.exercises.map((exercise, index) => ({
        ...exercise,
        id: `${today}-${index}`, // Create unique IDs based on date and index
        completed: false
      }));
      // Create the workout plan
      const workoutPlan: WorkoutPlan = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        exercises,
        date: today,
        completed: false
      };
      return workoutPlan;
    } catch (error) {
      return rejectWithValue('Failed to generate workout plan. Please try again.');
    }
  }
);
export const updateExerciseCompletion = createAsyncThunk(
  'workout/updateExerciseCompletion',
  async ({ exerciseId, completed }: { exerciseId: string; completed: boolean }, { getState, dispatch, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const state = getState() as { workout: WorkoutState };
      const workoutPlan = state.workout.workoutPlan;
      if (!workoutPlan) {
        return rejectWithValue('No workout plan found');
      }
      const updatedExercises = workoutPlan.exercises.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, completed } : exercise
      );
      // Check if all exercises are completed
      const allCompleted = updatedExercises.every(exercise => exercise.completed);
      const updatedWorkoutPlan: WorkoutPlan = {
        ...workoutPlan,
        exercises: updatedExercises,
        completed: allCompleted
      };
      // Calculate calories burned for the current exercise if it's being marked as completed
      if (completed) {
        const exercise = workoutPlan.exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
          // Calculate calories for this specific exercise: 10 calories per rep
          const exerciseCalories = exercise.sets * exercise.reps * 10;
          // Update calories burned in dashboard
          dispatch(updateCaloriesBurned(exerciseCalories));
        }
      }
      // If all exercises are now completed and the workout wasn't previously completed
      if (allCompleted && !workoutPlan.completed) {
        // Add a completion bonus (50 calories)
        dispatch(updateCaloriesBurned(50));
      }
      return updatedWorkoutPlan;
    } catch (error) {
      return rejectWithValue('Failed to update exercise. Please try again.');
    }
  }
);
// Generate the next day's workout
export const generateNextDayWorkout = createAsyncThunk(
  'workout/generateNextDayWorkout',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const state = getState() as { auth: { user: User | null }, workout: WorkoutState };
      const user = state.auth.user;
      const currentWorkoutPlan = state.workout.workoutPlan;
      if (!user) {
        return rejectWithValue('User not found');
      }
      if (!currentWorkoutPlan) {
        return rejectWithValue('No current workout plan found');
      }
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      // Select the appropriate workout template based on user's body type, gender, and fitness goal
      const selectedTemplate = selectWorkoutTemplate(
        user.bodyType,
        user.gender,
        user.fitnessGoal
      );
      // Determine the current day index from the workout plan
      // Extract day index from the first exercise's focus or description
      const currentDayIndex = getCurrentDayIndex(currentWorkoutPlan);
      // Calculate the next day index (cycling through the available days)
      const nextDayIndex = (currentDayIndex + 1) % selectedTemplate.days.length;
      const dayWorkout = selectedTemplate.days[nextDayIndex];
      // Assign unique IDs to exercises and mark them as not completed
      const exercises = dayWorkout.exercises.map((exercise, index) => ({
        ...exercise,
        id: `${today}-${index}`, // Create unique IDs based on date and index
        completed: false
      }));
      // Create the workout plan
      const workoutPlan: WorkoutPlan = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        exercises,
        date: today,
        completed: false
      };
      return workoutPlan;
    } catch (error) {
      return rejectWithValue('Failed to generate next day workout. Please try again.');
    }
  }
);
// Helper function to determine the current day index from the workout plan
function getCurrentDayIndex(workoutPlan: WorkoutPlan): number {
  // In a real app, you would store the day index in the workout plan
  // For this implementation, we'll use a simple approach based on the current date
  const dayOfWeek = new Date().getDay();
  return dayOfWeek % 3; // Assuming we have 3 days in our workout templates
}
const initialState: WorkoutState = {
  workoutPlan: null,
  isLoading: false,
  error: null
};
const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workout Plan
      .addCase(fetchWorkoutPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutPlan = action.payload;
      })
      .addCase(fetchWorkoutPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate Workout Plan
      .addCase(generateWorkoutPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateWorkoutPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutPlan = action.payload;
      })
      .addCase(generateWorkoutPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Exercise Completion
      .addCase(updateExerciseCompletion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExerciseCompletion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutPlan = action.payload;
      })
      .addCase(updateExerciseCompletion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate Next Day Workout
      .addCase(generateNextDayWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateNextDayWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutPlan = action.payload;
      })
      .addCase(generateNextDayWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});
export const { clearError } = workoutSlice.actions;
export default workoutSlice.reducer;

