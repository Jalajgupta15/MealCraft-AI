import React from 'react';
import { HealthReport } from '../types';
import { ActivitySquare } from 'lucide-react';

interface HealthReportProps {
  report: HealthReport;
}

export default function HealthReport({ report }: HealthReportProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Underweight': return 'text-yellow-600';
      case 'Healthy': return 'text-green-600';
      case 'Overweight': return 'text-orange-600';
      case 'Obese': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ActivitySquare className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Health Report</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Your BMI</p>
          <p className="text-3xl font-bold text-indigo-600">{report.bmi}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Status</p>
          <p className={`text-3xl font-bold ${getStatusColor(report.status)}`}>
            {report.status}
          </p>
        </div>
      </div>
    </div>
  );
}