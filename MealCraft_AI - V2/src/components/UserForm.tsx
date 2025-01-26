import React from 'react';
import { UserDetails, ActivityLevel } from '../types';
import { ClipboardList, Activity, Apple, AlertCircle } from 'lucide-react';

interface UserFormProps {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
  onSubmit: () => void;
}

const CONDITIONS = ["Diabetes", "Heart Problems", "Asthma", "Cancer", "Hypertension", "Obesity"];
const ALLERGIES = ["Lactose Intolerance", "Gluten Intolerance", "Nut Allergy", "Shellfish Allergy"];
const ACTIVITY_LEVELS: ActivityLevel[] = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extra Active"];

export default function UserForm({ userDetails, setUserDetails, onSubmit }: UserFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <ClipboardList className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Enter Your Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={userDetails.age}
            onChange={(e) => setUserDetails(prev => ({ ...prev, age: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={userDetails.weight}
            onChange={(e) => setUserDetails(prev => ({ ...prev, weight: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            step="0.1"
            value={userDetails.height}
            onChange={(e) => setUserDetails(prev => ({ ...prev, height: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={userDetails.gender}
            onChange={(e) => setUserDetails(prev => ({ ...prev, gender: e.target.value as 'Male' | 'Female' | 'Other' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Activity Level</span>
            </div>
          </label>
          <select
            value={userDetails.activityLevel}
            onChange={(e) => setUserDetails(prev => ({ ...prev, activityLevel: e.target.value as ActivityLevel }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {ACTIVITY_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <span>Medical Conditions</span>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(condition => (
              <label key={condition} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userDetails.conditions.includes(condition)}
                  onChange={(e) => {
                    setUserDetails(prev => ({
                      ...prev,
                      conditions: e.target.checked
                        ? [...prev.conditions, condition]
                        : prev.conditions.filter(c => c !== condition)
                    }));
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <span>Allergies</span>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ALLERGIES.map(allergy => (
              <label key={allergy} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userDetails.allergies.includes(allergy)}
                  onChange={(e) => {
                    setUserDetails(prev => ({
                      ...prev,
                      allergies: e.target.checked
                        ? [...prev.allergies, allergy]
                        : prev.allergies.filter(a => a !== allergy)
                    }));
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Apple className="w-5 h-5 text-indigo-600" />
              <span>Diet Preference</span>
            </div>
          </label>
          <div className="flex space-x-4">
            {['Veg', 'Non-Veg', 'Both'].map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={userDetails.dietType === type}
                  onChange={() => setUserDetails(prev => ({ ...prev, dietType: type as 'Veg' | 'Non-Veg' | 'Both' }))}
                  className="rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Calculate BMI & Generate Diet Plan
      </button>
    </div>
  );
}