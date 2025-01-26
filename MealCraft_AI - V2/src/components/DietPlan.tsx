import React from 'react';
import { Recipe } from '../types';
import { Utensils } from 'lucide-react';

interface DietPlanProps {
  recipes: Recipe[];
}

export default function DietPlan({ recipes }: DietPlanProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Utensils className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Your Personalized Diet Plan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{recipe.title}</h3>
              <p className="text-gray-600 mb-4">{recipe.calories} calories</p>
              <a
                href={recipe.recipeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Full Recipe →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}