import { Exercise } from '../types';
// Define workout template types
export interface WorkoutTemplate {
  name: string;
  description: string;
  days: WorkoutDay[];
  targetBodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | 'all';
  targetGender: 'male' | 'female' | 'all';
  targetGoal: 'lose_weight' | 'gain_muscle' | 'improve_endurance' | 'maintain';
}
export interface WorkoutDay {
  day: number;
  focus: string;
  exercises: Exercise[];
}
// Helper function to create exercise objects
const createExercise = (
  id: string,
  name: string,
  description: string,
  sets: number,
  reps: number,
  restTime: number,
  imageUrl?: string
): Exercise => ({
  id,
  name,
  description,
  sets,
  reps,
  restTime,
  completed: false,
  imageUrl
});
// ============= WORKOUT TEMPLATES =============
// ECTOMORPH TEMPLATES
const ectoMaleGainMuscle: WorkoutTemplate = {
  name: 'Ectomorph Male Muscle Builder',
  description: 'Designed for ectomorph males looking to build muscle mass with higher volume and longer rest periods.',
  targetBodyType: 'ectomorph',
  targetGender: 'male',
  targetGoal: 'gain_muscle',
  days: [
    {
      day: 1,
      focus: 'Chest and Triceps',
      exercises: [
        createExercise('1', 'Bench Press', 'Compound exercise for chest development', 4, 8, 120),
        createExercise('2', 'Incline Dumbbell Press', 'Upper chest development', 3, 10, 120),
        createExercise('3', 'Chest Dips', 'Lower chest and triceps', 3, 12, 120),
        createExercise('4', 'Tricep Pushdowns', 'Isolation exercise for triceps', 3, 12, 90),
        createExercise('5', 'Overhead Tricep Extension', 'Targets long head of triceps', 3, 12, 90)
      ]
    },
    {
      day: 2,
      focus: 'Back and Biceps',
      exercises: [
        createExercise('6', 'Deadlifts', 'Compound exercise for overall back strength', 4, 6, 180),
        createExercise('7', 'Pull-ups', 'Upper back and lats', 3, 8, 120),
        createExercise('8', 'Bent Over Rows', 'Mid-back thickness', 3, 10, 120),
        createExercise('9', 'Barbell Curls', 'Bicep mass builder', 3, 10, 90),
        createExercise('10', 'Hammer Curls', 'Targets brachialis and forearms', 3, 12, 90)
      ]
    },
    {
      day: 3,
      focus: 'Legs and Shoulders',
      exercises: [
        createExercise('11', 'Squats', 'Compound exercise for leg development', 4, 8, 180),
        createExercise('12', 'Romanian Deadlifts', 'Hamstring and glute development', 3, 10, 120),
        createExercise('13', 'Leg Press', 'Overall leg development', 3, 12, 120),
        createExercise('14', 'Military Press', 'Compound shoulder exercise', 3, 8, 120),
        createExercise('15', 'Lateral Raises', 'Targets lateral deltoids', 3, 12, 90)
      ]
    }
  ]
};
const ectoFemaleGainMuscle: WorkoutTemplate = {
  name: 'Ectomorph Female Muscle Builder',
  description: 'Designed for ectomorph females looking to build lean muscle with moderate volume and adequate rest.',
  targetBodyType: 'ectomorph',
  targetGender: 'female',
  targetGoal: 'gain_muscle',
  days: [
    {
      day: 1,
      focus: 'Full Body Strength',
      exercises: [
        createExercise('1', 'Goblet Squats', 'Lower body compound movement', 3, 12, 90),
        createExercise('2', 'Dumbbell Rows', 'Back development', 3, 12, 90),
        createExercise('3', 'Push-ups', 'Upper body pushing movement', 3, 10, 90),
        createExercise('4', 'Glute Bridges', 'Glute activation and strength', 3, 15, 60),
        createExercise('5', 'Dumbbell Shoulder Press', 'Shoulder development', 3, 10, 90)
      ]
    },
    {
      day: 2,
      focus: 'Lower Body Focus',
      exercises: [
        createExercise('6', 'Romanian Deadlifts', 'Posterior chain development', 3, 12, 90),
        createExercise('7', 'Bulgarian Split Squats', 'Unilateral leg development', 3, 10, 90),
        createExercise('8', 'Hip Thrusts', 'Glute hypertrophy', 3, 15, 90),
        createExercise('9', 'Leg Press', 'Quad development', 3, 12, 90),
        createExercise('10', 'Calf Raises', 'Calf development', 3, 15, 60)
      ]
    },
    {
      day: 3,
      focus: 'Upper Body Focus',
      exercises: [
        createExercise('11', 'Assisted Pull-ups', 'Back and bicep development', 3, 8, 90),
        createExercise('12', 'Incline Dumbbell Press', 'Upper chest development', 3, 10, 90),
        createExercise('13', 'Lateral Raises', 'Shoulder width', 3, 12, 60),
        createExercise('14', 'Tricep Dips', 'Tricep development', 3, 10, 60),
        createExercise('15', 'Bicep Curls', 'Bicep isolation', 3, 12, 60)
      ]
    }
  ]
};
// MESOMORPH TEMPLATES
const mesoMaleGainMuscle: WorkoutTemplate = {
  name: 'Mesomorph Male Muscle Builder',
  description: 'High-intensity program for mesomorph males to maximize muscle growth with balanced volume and intensity.',
  targetBodyType: 'mesomorph',
  targetGender: 'male',
  targetGoal: 'gain_muscle',
  days: [
    {
      day: 1,
      focus: 'Chest and Back',
      exercises: [
        createExercise('1', 'Barbell Bench Press', 'Compound chest exercise', 4, 10, 90),
        createExercise('2', 'Incline Dumbbell Press', 'Upper chest development', 3, 12, 90),
        createExercise('3', 'Bent Over Rows', 'Back thickness', 4, 10, 90),
        createExercise('4', 'Pull-ups', 'Back width', 3, 10, 90),
        createExercise('5', 'Cable Flyes', 'Chest isolation', 3, 15, 60)
      ]
    },
    {
      day: 2,
      focus: 'Legs',
      exercises: [
        createExercise('6', 'Barbell Squats', 'Compound leg exercise', 4, 10, 120),
        createExercise('7', 'Leg Press', 'Quad development', 3, 12, 90),
        createExercise('8', 'Romanian Deadlifts', 'Hamstring development', 3, 12, 90),
        createExercise('9', 'Walking Lunges', 'Functional leg exercise', 3, 10, 60),
        createExercise('10', 'Calf Raises', 'Calf development', 4, 15, 60)
      ]
    },
    {
      day: 3,
      focus: 'Arms and Shoulders',
      exercises: [
        createExercise('11', 'Overhead Press', 'Compound shoulder exercise', 4, 10, 90),
        createExercise('12', 'Lateral Raises', 'Shoulder width', 3, 15, 60),
        createExercise('13', 'EZ Bar Curls', 'Bicep mass', 3, 12, 60),
        createExercise('14', 'Skull Crushers', 'Tricep development', 3, 12, 60),
        createExercise('15', 'Face Pulls', 'Rear deltoid and rotator cuff', 3, 15, 60)
      ]
    }
  ]
};
// Export the initial templates
export const initialWorkoutTemplates: WorkoutTemplate[] = [
  ectoMaleGainMuscle,
  ectoFemaleGainMuscle,
  mesoMaleGainMuscle
];

