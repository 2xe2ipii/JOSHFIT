import { Exercise } from '../types';
import { WorkoutTemplate, initialWorkoutTemplates } from './workoutTemplates';
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
// MESOMORPH TEMPLATES (CONTINUED)
const mesoFemaleGainMuscle: WorkoutTemplate = {
  name: 'Mesomorph Female Muscle Builder',
  description: 'Balanced program for mesomorph females to build lean muscle with moderate volume and intensity.',
  targetBodyType: 'mesomorph',
  targetGender: 'female',
  targetGoal: 'gain_muscle',
  days: [
    {
      day: 1,
      focus: 'Full Body Strength',
      exercises: [
        createExercise('1', 'Barbell Squats', 'Compound leg exercise', 4, 10, 90),
        createExercise('2', 'Push-ups', 'Upper body pushing movement', 3, 12, 60),
        createExercise('3', 'Dumbbell Rows', 'Back development', 3, 12, 60),
        createExercise('4', 'Shoulder Press', 'Shoulder development', 3, 10, 60),
        createExercise('5', 'Glute Bridges', 'Glute activation and strength', 3, 15, 60)
      ]
    },
    {
      day: 2,
      focus: 'Lower Body and Core',
      exercises: [
        createExercise('6', 'Deadlifts', 'Posterior chain development', 4, 8, 90),
        createExercise('7', 'Walking Lunges', 'Functional leg exercise', 3, 12, 60),
        createExercise('8', 'Hip Thrusts', 'Glute development', 3, 15, 60),
        createExercise('9', 'Plank', 'Core stability', 3, 45, 60, 'seconds'),
        createExercise('10', 'Russian Twists', 'Oblique development', 3, 20, 45)
      ]
    },
    {
      day: 3,
      focus: 'Upper Body Focus',
      exercises: [
        createExercise('11', 'Pull-ups or Lat Pulldowns', 'Back width', 3, 10, 60),
        createExercise('12', 'Bench Press', 'Chest development', 3, 10, 60),
        createExercise('13', 'Lateral Raises', 'Shoulder width', 3, 15, 45),
        createExercise('14', 'Tricep Dips', 'Tricep development', 3, 12, 45),
        createExercise('15', 'Bicep Curls', 'Bicep isolation', 3, 12, 45)
      ]
    }
  ]
};
// ENDOMORPH TEMPLATES
const endoMaleGainMuscle: WorkoutTemplate = {
  name: 'Endomorph Male Muscle Builder',
  description: 'High-volume program for endomorph males to build muscle while supporting fat loss.',
  targetBodyType: 'endomorph',
  targetGender: 'male',
  targetGoal: 'gain_muscle',
  days: [
    {
      day: 1,
      focus: 'Push Day (Chest, Shoulders, Triceps)',
      exercises: [
        createExercise('1', 'Bench Press', 'Compound chest exercise', 4, 12, 60),
        createExercise('2', 'Incline Dumbbell Press', 'Upper chest development', 3, 15, 60),
        createExercise('3', 'Shoulder Press', 'Compound shoulder exercise', 3, 12, 60),
        createExercise('4', 'Lateral Raises', 'Shoulder width', 3, 15, 45),
        createExercise('5', 'Tricep Pushdowns', 'Tricep isolation', 3, 15, 45)
      ]
    },
    {
      day: 2,
      focus: 'Pull Day (Back and Biceps)',
      exercises: [
        createExercise('6', 'Lat Pulldowns', 'Back width', 4, 12, 60),
        createExercise('7', 'Seated Rows', 'Back thickness', 3, 15, 60),
        createExercise('8', 'Face Pulls', 'Rear deltoid and upper back', 3, 15, 45),
        createExercise('9', 'Bicep Curls', 'Bicep development', 3, 12, 45),
        createExercise('10', 'Hammer Curls', 'Forearm and brachialis', 3, 12, 45)
      ]
    },
    {
      day: 3,
      focus: 'Legs and Core',
      exercises: [
        createExercise('11', 'Leg Press', 'Quad development', 4, 15, 60),
        createExercise('12', 'Romanian Deadlifts', 'Hamstring development', 3, 12, 60),
        createExercise('13', 'Walking Lunges', 'Functional leg exercise', 3, 10, 45),
        createExercise('14', 'Leg Extensions', 'Quad isolation', 3, 15, 45),
        createExercise('15', 'Plank', 'Core stability', 3, 45, 45, 'seconds')
      ]
    }
  ]
};
const endoFemaleGainMuscle: WorkoutTemplate = {
  name: 'Endomorph Female Muscle Builder',
  description: 'Balanced program for endomorph females to build muscle while supporting fat loss.',
  targetBodyType: 'endomorph',
  targetGender: 'female',
  targetGoal: 'gain_muscle',
  days: [
    {
      day: 1,
      focus: 'Full Body Circuit',
      exercises: [
        createExercise('1', 'Goblet Squats', 'Lower body compound movement', 3, 15, 45),
        createExercise('2', 'Push-ups (Modified if needed)', 'Upper body pushing movement', 3, 12, 45),
        createExercise('3', 'Dumbbell Rows', 'Back development', 3, 15, 45),
        createExercise('4', 'Glute Bridges', 'Glute activation and strength', 3, 20, 30),
        createExercise('5', 'Mountain Climbers', 'Core and cardio', 3, 30, 30, 'seconds')
      ]
    },
    {
      day: 2,
      focus: 'Lower Body Focus',
      exercises: [
        createExercise('6', 'Sumo Squats', 'Inner thigh and glute focus', 3, 15, 45),
        createExercise('7', 'Step-ups', 'Unilateral leg development', 3, 12, 45),
        createExercise('8', 'Hip Thrusts', 'Glute development', 3, 15, 45),
        createExercise('9', 'Curtsy Lunges', 'Outer thigh and glute focus', 3, 12, 30),
        createExercise('10', 'Calf Raises', 'Calf development', 3, 20, 30)
      ]
    },
    {
      day: 3,
      focus: 'Upper Body and Core',
      exercises: [
        createExercise('11', 'Lat Pulldowns', 'Back width', 3, 15, 45),
        createExercise('12', 'Chest Press', 'Chest development', 3, 15, 45),
        createExercise('13', 'Lateral Raises', 'Shoulder width', 3, 15, 30),
        createExercise('14', 'Tricep Dips', 'Tricep development', 3, 12, 30),
        createExercise('15', 'Plank with Shoulder Taps', 'Core stability with rotation', 3, 20, 30, 'seconds')
      ]
    }
  ]
};
// WEIGHT LOSS TEMPLATES
const weightLossTemplate: WorkoutTemplate = {
  name: 'Weight Loss Program',
  description: 'High-intensity circuit training designed for maximum calorie burn and fat loss.',
  targetBodyType: 'all',
  targetGender: 'all',
  targetGoal: 'lose_weight',
  days: [
    {
      day: 1,
      focus: 'Full Body HIIT',
      exercises: [
        createExercise('1', 'Burpees', 'Full body explosive movement', 4, 15, 30),
        createExercise('2', 'Mountain Climbers', 'Core and cardio', 4, 30, 30, 'seconds'),
        createExercise('3', 'Jumping Jacks', 'Cardio movement', 4, 30, 30),
        createExercise('4', 'Push-ups', 'Upper body strength', 4, 12, 30),
        createExercise('5', 'Bodyweight Squats', 'Lower body movement', 4, 20, 30)
      ]
    },
    {
      day: 2,
      focus: 'Cardio and Core',
      exercises: [
        createExercise('6', 'High Knees', 'Cardio movement', 4, 30, 30, 'seconds'),
        createExercise('7', 'Plank', 'Core stability', 4, 45, 30, 'seconds'),
        createExercise('8', 'Bicycle Crunches', 'Core with rotation', 4, 20, 30),
        createExercise('9', 'Jumping Lunges', 'Lower body plyometric', 4, 12, 30),
        createExercise('10', 'Russian Twists', 'Oblique focus', 4, 20, 30)
      ]
    },
    {
      day: 3,
      focus: 'Metabolic Conditioning',
      exercises: [
        createExercise('11', 'Kettlebell Swings', 'Posterior chain and cardio', 4, 15, 30),
        createExercise('12', 'Box Jumps or Step-ups', 'Lower body power', 4, 12, 30),
        createExercise('13', 'Battle Ropes', 'Upper body and cardio', 4, 30, 30, 'seconds'),
        createExercise('14', 'Medicine Ball Slams', 'Full body power', 4, 15, 30),
        createExercise('15', 'Burpee to Pull-up', 'Advanced full body movement', 4, 10, 30)
      ]
    }
  ]
};
// ENDURANCE TEMPLATES
const enduranceTemplate: WorkoutTemplate = {
  name: 'Endurance Builder',
  description: 'Program designed to improve cardiovascular endurance and muscular stamina.',
  targetBodyType: 'all',
  targetGender: 'all',
  targetGoal: 'improve_endurance',
  days: [
    {
      day: 1,
      focus: 'Cardio Endurance',
      exercises: [
        createExercise('1', 'Jogging or Running', 'Steady-state cardio', 1, 20, 60, 'minutes'),
        createExercise('2', 'Jump Rope', 'Coordination and cardio', 3, 3, 60, 'minutes'),
        createExercise('3', 'Bodyweight Squats', 'Lower body endurance', 3, 25, 45),
        createExercise('4', 'Push-ups', 'Upper body endurance', 3, 15, 45),
        createExercise('5', 'Plank', 'Core endurance', 3, 60, 45, 'seconds')
      ]
    },
    {
      day: 2,
      focus: 'Circuit Training',
      exercises: [
        createExercise('6', 'Jumping Jacks', 'Warm-up cardio', 3, 50, 30),
        createExercise('7', 'Mountain Climbers', 'Core and cardio', 3, 50, 30),
        createExercise('8', 'Bodyweight Lunges', 'Lower body endurance', 3, 20, 30),
        createExercise('9', 'Dips', 'Upper body endurance', 3, 15, 30),
        createExercise('10', 'High Knees', 'Cardio movement', 3, 50, 30)
      ]
    },
    {
      day: 3,
      focus: 'Interval Training',
      exercises: [
        createExercise('11', 'Sprint Intervals', '30 seconds sprint, 30 seconds rest', 10, 1, 30, 'set'),
        createExercise('12', 'Burpees', 'Full body movement', 3, 15, 45),
        createExercise('13', 'Box Jumps', 'Lower body power and endurance', 3, 15, 45),
        createExercise('14', 'Pull-ups or Rows', 'Upper body pulling endurance', 3, 10, 45),
        createExercise('15', 'Bicycle Crunches', 'Core endurance with rotation', 3, 30, 30)
      ]
    }
  ]
};
// MAINTENANCE TEMPLATES
const maintenanceTemplate: WorkoutTemplate = {
  name: 'Fitness Maintenance',
  description: 'Balanced program to maintain current fitness levels and overall health.',
  targetBodyType: 'all',
  targetGender: 'all',
  targetGoal: 'maintain',
  days: [
    {
      day: 1,
      focus: 'Full Body Strength',
      exercises: [
        createExercise('1', 'Push-ups', 'Upper body pushing movement', 3, 12, 60),
        createExercise('2', 'Bodyweight Squats', 'Lower body movement', 3, 15, 60),
        createExercise('3', 'Dumbbell Rows', 'Upper body pulling movement', 3, 12, 60),
        createExercise('4', 'Plank', 'Core stability', 3, 45, 45, 'seconds'),
        createExercise('5', 'Glute Bridges', 'Posterior chain activation', 3, 15, 45)
      ]
    },
    {
      day: 2,
      focus: 'Cardio and Mobility',
      exercises: [
        createExercise('6', 'Brisk Walking or Light Jogging', 'Cardiovascular health', 1, 20, 0, 'minutes'),
        createExercise('7', 'Dynamic Stretching', 'Mobility improvement', 2, 10, 30, 'minutes'),
        createExercise('8', 'Jumping Jacks', 'Cardio movement', 3, 25, 45),
        createExercise('9', 'Bodyweight Lunges', 'Lower body mobility', 3, 10, 30),
        createExercise('10', 'Arm Circles', 'Shoulder mobility', 3, 15, 30)
      ]
    },
    {
      day: 3,
      focus: 'Functional Fitness',
      exercises: [
        createExercise('11', 'Step-ups', 'Functional lower body movement', 3, 12, 45),
        createExercise('12', 'Bird Dogs', 'Core stability and coordination', 3, 10, 30),
        createExercise('13', 'Bodyweight Squats to Press', 'Full body movement', 3, 12, 45),
        createExercise('14', 'Side Planks', 'Lateral core strength', 3, 30, 30, 'seconds'),
        createExercise('15', 'Supermans', 'Back extension', 3, 12, 30)
      ]
    }
  ]
};
// Export the additional templates
export const additionalWorkoutTemplates: WorkoutTemplate[] = [
  mesoFemaleGainMuscle,
  endoMaleGainMuscle,
  endoFemaleGainMuscle,
  weightLossTemplate,
  enduranceTemplate,
  maintenanceTemplate
];

