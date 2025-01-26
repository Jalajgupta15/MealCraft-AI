export interface UserDetails {
  age: number;
  weight: number;
  height: number;
  gender: 'Male' | 'Female' | 'Other';
  activityLevel: ActivityLevel;
  conditions: string[];
  allergies: string[];
  dietType: 'Veg' | 'Non-Veg' | 'Both';
}

export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';

export interface Recipe {
  id: number;
  title: string;
  calories: number;
  image: string;
  recipeUrl: string;
}

export interface HealthReport {
  bmi: number;
  status: string;
}