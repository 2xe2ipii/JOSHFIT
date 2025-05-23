import { initialWorkoutTemplates } from './workoutTemplates';
import { additionalWorkoutTemplates } from './workoutTemplates2';
import { WorkoutTemplate } from './workoutTemplates';
// Combine all workout templates
export const workoutTemplates: WorkoutTemplate[] = [
  ...initialWorkoutTemplates,
  ...additionalWorkoutTemplates
];
// Function to select the appropriate workout template based on user characteristics
export const selectWorkoutTemplate = (
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph',
  gender: 'male' | 'female' | 'other',
  goal: 'lose_weight' | 'gain_muscle' | 'improve_endurance' | 'maintain'
): WorkoutTemplate => {
  // If gender is 'other', ignore gender-specific templates
  const effectiveGender = gender === 'other' ? 'all' : gender;
  // Find the most specific template that matches the criteria
  const specificTemplate = workoutTemplates.find(template => 
    (template.targetBodyType === bodyType || template.targetBodyType === 'all') &&
    (template.targetGender === effectiveGender || template.targetGender === 'all') &&
    template.targetGoal === goal
  );
  if (specificTemplate) {
    return specificTemplate;
  }
  // If no specific template is found, find a template that matches the goal
  const goalTemplate = workoutTemplates.find(template => 
    template.targetGoal === goal
  );
  if (goalTemplate) {
    return goalTemplate;
  }
  // If no template matches, return a default template (first in the array)
  return workoutTemplates[0];
};

