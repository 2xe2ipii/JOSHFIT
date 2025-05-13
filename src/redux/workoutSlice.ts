import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WorkoutState, WorkoutPlan, Exercise, User } from '../types';

// Mock API calls for demonstration
export const fetchWorkoutPlan = createAsyncThunk(
  'workout/fetchWorkoutPlan',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock workout plan based on today's date
      const today = new Date().toISOString().split('T')[0];
      
      const exercises: Exercise[] = [
        {
          id: '1',
          name: 'Push-ups',
          description: 'Standard push-ups to build chest and arm strength',
          sets: 3,
          reps: 15,
          restTime: 60,
          completed: false,
          imageUrl: 'https://example.com/images/pushup.jpg',
        },
        {
          id: '2',
          name: 'Squats',
          description: 'Basic squats to strengthen legs and glutes',
          sets: 3,
          reps: 20,
          restTime: 60,
          completed: false,
          imageUrl: 'https://example.com/images/squat.jpg',
        },
        {
          id: '3',
          name: 'Plank',
          description: 'Core strengthening exercise',
          sets: 3,
          reps: 1,
          restTime: 60,
          completed: false,
          imageUrl: 'https://example.com/images/plank.jpg',
        },
        {
          id: '4',
          name: 'Jumping Jacks',
          description: 'Cardio exercise to increase heart rate',
          sets: 3,
          reps: 30,
          restTime: 45,
          completed: false,
          imageUrl: 'https://example.com/images/jumpingjacks.jpg',
        },
        {
          id: '5',
          name: 'Mountain Climbers',
          description: 'Full body exercise for strength and cardio',
          sets: 3,
          reps: 20,
          restTime: 45,
          completed: false,
          imageUrl: 'https://example.com/images/mountainclimbers.jpg',
        }
      ];
      
      const workoutPlan: WorkoutPlan = {
        id: '1',
        userId,
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
      
      // In a real app, this would use the user's profile data to generate a personalized workout
      // Here we're using a simple mock implementation
      const today = new Date().toISOString().split('T')[0];
      let exercises: Exercise[] = [];
      
      // Generate different exercises based on fitness goal
      switch(user.fitnessGoal) {
        case 'lose_weight':
          exercises = [
            {
              id: '1',
              name: 'Jumping Jacks',
              description: 'Cardio exercise to increase heart rate',
              sets: 3,
              reps: 40,
              restTime: 30,
              completed: false,
            },
            {
              id: '2',
              name: 'Mountain Climbers',
              description: 'Full body exercise for cardio',
              sets: 3,
              reps: 30,
              restTime: 30,
              completed: false,
            },
            {
              id: '3',
              name: 'Burpees',
              description: 'High-intensity exercise for weight loss',
              sets: 3,
              reps: 15,
              restTime: 60,
              completed: false,
            },
            {
              id: '4',
              name: 'High Knees',
              description: 'Cardio exercise targeting legs and core',
              sets: 3,
              reps: 30,
              restTime: 30,
              completed: false,
            },
            {
              id: '5',
              name: 'Plank',
              description: 'Core strengthening exercise',
              sets: 3,
              reps: 1,
              restTime: 60,
              completed: false,
            }
          ];
          break;
        case 'gain_muscle':
          exercises = [
            {
              id: '1',
              name: 'Push-ups',
              description: 'Standard push-ups to build chest and arm strength',
              sets: 4,
              reps: 12,
              restTime: 90,
              completed: false,
            },
            {
              id: '2',
              name: 'Squats',
              description: 'Basic squats to strengthen legs and glutes',
              sets: 4,
              reps: 15,
              restTime: 90,
              completed: false,
            },
            {
              id: '3',
              name: 'Dumbbell Rows',
              description: 'Back strengthening exercise',
              sets: 4,
              reps: 12,
              restTime: 90,
              completed: false,
            },
            {
              id: '4',
              name: 'Lunges',
              description: 'Lower body strength exercise',
              sets: 3,
              reps: 10,
              restTime: 60,
              completed: false,
            },
            {
              id: '5',
              name: 'Bicep Curls',
              description: 'Arm strengthening exercise',
              sets: 3,
              reps: 12,
              restTime: 60,
              completed: false,
            }
          ];
          break;
        case 'improve_endurance':
          exercises = [
            {
              id: '1',
              name: 'Jogging in Place',
              description: 'Basic endurance exercise',
              sets: 3,
              reps: 100,
              restTime: 60,
              completed: false,
            },
            {
              id: '2',
              name: 'Jumping Rope',
              description: 'Cardio exercise for endurance',
              sets: 3,
              reps: 100,
              restTime: 60,
              completed: false,
            },
            {
              id: '3',
              name: 'Mountain Climbers',
              description: 'Full body exercise for endurance',
              sets: 3,
              reps: 40,
              restTime: 45,
              completed: false,
            },
            {
              id: '4',
              name: 'Plank',
              description: 'Core endurance exercise',
              sets: 3,
              reps: 1,
              restTime: 45,
              completed: false,
            },
            {
              id: '5',
              name: 'Bicycle Crunches',
              description: 'Core exercise for endurance',
              sets: 3,
              reps: 20,
              restTime: 30,
              completed: false,
            }
          ];
          break;
        case 'maintain':
        default:
          exercises = [
            {
              id: '1',
              name: 'Push-ups',
              description: 'Standard push-ups',
              sets: 3,
              reps: 10,
              restTime: 60,
              completed: false,
            },
            {
              id: '2',
              name: 'Squats',
              description: 'Basic squats',
              sets: 3,
              reps: 15,
              restTime: 60,
              completed: false,
            },
            {
              id: '3',
              name: 'Jumping Jacks',
              description: 'Cardio exercise',
              sets: 2,
              reps: 30,
              restTime: 30,
              completed: false,
            },
            {
              id: '4',
              name: 'Plank',
              description: 'Core exercise',
              sets: 2,
              reps: 1,
              restTime: 45,
              completed: false,
            },
            {
              id: '5',
              name: 'Lunges',
              description: 'Lower body exercise',
              sets: 2,
              reps: 10,
              restTime: 45,
              completed: false,
            }
          ];
      }
      
      // Adjust exercise intensity based on body type
      if (user.bodyType === 'ectomorph') {
        // Increase rest time for ectomorphs
        exercises = exercises.map(ex => ({
          ...ex,
          restTime: ex.restTime + 15
        }));
      } else if (user.bodyType === 'endomorph') {
        // Increase reps for endomorphs
        exercises = exercises.map(ex => ({
          ...ex,
          reps: Math.round(ex.reps * 1.2)
        }));
      }
      
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
  async ({ exerciseId, completed }: { exerciseId: string; completed: boolean }, { getState, rejectWithValue }) => {
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
      
      return updatedWorkoutPlan;
    } catch (error) {
      return rejectWithValue('Failed to update exercise. Please try again.');
    }
  }
);

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
      });
  }
});

export const { clearError } = workoutSlice.actions;
export default workoutSlice.reducer;
