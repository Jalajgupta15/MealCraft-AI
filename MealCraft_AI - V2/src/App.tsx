import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import UserForm from './components/UserForm';
import HealthReport from './components/HealthReport';
import DietPlan from './components/DietPlan';
import { calculateBMI, getHealthStatus } from './utils/health';
import type { UserDetails, Recipe, HealthReport as HealthReportType } from './types';

const SPOONACULAR_API_KEY = '87a614b4d79b40b4b95babd76e33093c';

function App() {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'Male',
    activityLevel: 'Moderately Active',
    conditions: [],
    allergies: [],
    dietType: 'Both'
  });

  const [healthReport, setHealthReport] = useState<HealthReportType | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCalorieTarget = (details: UserDetails, bmi: number): number => {
    // Base metabolic rate using Harris-Benedict equation
    const bmr = details.gender === 'Male'
      ? 88.362 + (13.397 * details.weight) + (4.799 * details.height) - (5.677 * details.age)
      : 447.593 + (9.247 * details.weight) + (3.098 * details.height) - (4.330 * details.age);

    // Activity level multipliers
    const activityMultipliers = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
      'Extra Active': 1.9
    };

    let calories = bmr * activityMultipliers[details.activityLevel];

    // Adjust based on BMI status
    if (bmi > 25) {
      calories *= 0.85; // Reduction for weight loss
    } else if (bmi < 18.5) {
      calories *= 1.15; // Increase for weight gain
    }

    return Math.round(calories);
  };

  const fetchDietPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const bmi = calculateBMI(userDetails.weight, userDetails.height);
      const calorieTarget = calculateCalorieTarget(userDetails, bmi);
      
      // Build query parameters
      const dietParams = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        number: '6',
        addRecipeNutrition: 'true',
        maxCalories: calorieTarget.toString()
      });

      // Add diet restrictions
      if (userDetails.dietType === 'Veg') {
        dietParams.append('diet', 'vegetarian');
      }

      // Add intolerances
      if (userDetails.allergies.length) {
        const allergiesMap: { [key: string]: string } = {
          'Lactose Intolerance': 'dairy',
          'Gluten Intolerance': 'gluten',
          'Nut Allergy': 'peanut,tree-nut',
          'Shellfish Allergy': 'shellfish'
        };
        const intolerances = userDetails.allergies
          .map(allergy => allergiesMap[allergy])
          .filter(Boolean)
          .join(',');
        if (intolerances) {
          dietParams.append('intolerances', intolerances);
        }
      }

      // Add health conditions
      if (userDetails.conditions.length) {
        const tags = [];
        if (userDetails.conditions.includes('Diabetes')) tags.push('low-sugar');
        if (userDetails.conditions.includes('Heart Problems')) tags.push('low-fat');
        if (userDetails.conditions.includes('Hypertension')) tags.push('low-sodium');
        if (userDetails.conditions.includes('Obesity')) tags.push('low-calorie');
        if (tags.length) {
          dietParams.append('tags', tags.join(','));
        }
      }

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${dietParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      
      if (!data.results || !data.results.length) {
        throw new Error('No recipes found matching your criteria');
      }

      setRecipes(
        data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          calories: recipe.nutrition.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0,
          image: recipe.image,
          recipeUrl: `https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${recipe.id}`
        }))
      );
    } catch (err) {
      console.error('Error fetching diet plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate diet plan');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const bmi = calculateBMI(userDetails.weight, userDetails.height);
    setHealthReport({
      bmi,
      status: getHealthStatus(bmi)
    });
    fetchDietPlan();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ChefHat className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MealCraft AI</h1>
          <p className="text-xl text-gray-600">Your Personalized Diet Planner</p>
        </div>

        <div className="space-y-8">
          <UserForm
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            onSubmit={handleSubmit}
          />

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating your personalized diet plan...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {healthReport && !loading && (
            <HealthReport report={healthReport} />
          )}

          {recipes.length > 0 && !loading && (
            <DietPlan recipes={recipes} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;