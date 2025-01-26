export const calculateBMI = (weight: number, height: number): number => {
  return Number((weight / Math.pow(height / 100, 2)).toFixed(2));
};

export const getHealthStatus = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 24.9) return "Healthy";
  if (bmi >= 25 && bmi < 29.9) return "Overweight";
  return "Obese";
};