import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { countries, sampleData } from '../../data/sampleData';

export const CountryComparison: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'apps' | 'wearables' | 'physical' | 'mental'>('apps');

  // Calculate correlation data between technology usage and health outcomes
  const correlationData = countries.map(country => {
    const countryData = sampleData.filter(d => d.Country === country.code);
    
    return countryData.slice(0, 100).map(d => ({ // Sample 100 points per country for clarity
      name: country.name,
      techUsage: parseFloat(d.HealthAppsHours) + parseFloat(d.WearablesHours),
      physicalHealth: parseFloat(d.PhysicalHealth),
      mentalHealth: parseFloat(d.MentalHealth_Emotional),
      country: country.code,
      fill: country.color
    }));
  }).flat();

  // Calculate age group statistics
  const ageGroups = ['25-34', '35-44', '45-54', '55-64', '65+'];
  const ageGroupData = ageGroups.map(ageGroup => {
    const result = { ageGroup };
    
    countries.forEach(country => {
      const countryData = sampleData.filter(d => d.Country === country.code);
      let filteredData;
      
      switch (ageGroup) {
        case '25-34':
          filteredData = countryData.filter(d => parseInt(d.Age) >= 25 && parseInt(d.Age) <= 34);
          break;
        case '35-44':
          filteredData = countryData.filter(d => parseInt(d.Age) >= 35 && parseInt(d.Age) <= 44);
          break;
        case '45-54':
          filteredData = countryData.filter(d => parseInt(d.Age) >= 45 && parseInt(d.Age) <= 54);
          break;
        case '55-64':
          filteredData = countryData.filter(d => parseInt(d.Age) >= 55 && parseInt(d.Age) <= 64);
          break;
        default:
          filteredData = countryData.filter(d => parseInt(d.Age) >= 65);
      }
      
      if (filteredData.length > 0) {
        const avgUsage = filteredData.reduce((sum, d) => 
          sum + parseFloat(d.HealthAppsHours), 0) / filteredData.length;
        result[country.name] = Number(avgUsage.toFixed(2));
      } else {
        result[country.name] = 0;
      }
    });
    
    return result;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Country Comparisons</h2>
        <p className="text-lg text-gray-600">
          Detailed analysis of health technology adoption and outcomes across regions
        </p>
      </div>

      {/* Metric Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { key: 'apps', label: 'Health Apps Usage', color: 'blue' },
            { key: 'wearables', label: 'Wearables Usage', color: 'green' },
            { key: 'physical', label: 'Physical Health', color: 'orange' },
            { key: 'mental', label: 'Mental Health', color: 'purple' }
          ].map(metric => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedMetric === metric.key
                  ? `bg-${metric.color}-600 text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age Group Analysis */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Health App Usage by Age Group</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ageGroupData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ageGroup" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  color: '#f8fafc',
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {countries.map(country => (
                <Line 
                  key={country.code}
                  type="monotone" 
                  dataKey={country.name} 
                  stroke={country.color}
                  strokeWidth={3}
                  dot={{ fill: country.color, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technology vs Health Correlation */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Technology Usage vs Health Outcomes</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="techUsage" 
                name="Technology Usage" 
                unit="h/day"
                stroke="#64748b"
              />
              <YAxis 
                type="number" 
                dataKey="physicalHealth" 
                name="Physical Health" 
                unit="/5"
                stroke="#64748b"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  color: '#f8fafc',
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
              {countries.map(country => {
                const countryPoints = correlationData.filter(d => d.country === country.code);
                return (
                  <Scatter 
                    key={country.code}
                    name={country.name}
                    data={countryPoints}
                    fill={country.color}
                    opacity={0.6}
                  />
                );
              })}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Technology Adoption Leaders</h4>
          <div className="space-y-2">
            {countryStats
              .sort((a, b) => (b.healthApps + b.wearables) - (a.healthApps + a.wearables))
              .slice(0, 3)
              .map((country, index) => (
                <div key={country.code} className="flex items-center justify-between">
                  <span className="text-blue-800">{index + 1}. {country.name}</span>
                  <span className="font-semibold text-blue-900">
                    {(country.healthApps + country.wearables).toFixed(1)}h
                  </span>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border">
          <h4 className="text-lg font-semibold text-green-900 mb-3">Highest Wellbeing Scores</h4>
          <div className="space-y-2">
            {countryStats
              .sort((a, b) => (b.physicalHealth + b.mentalHealth) - (a.physicalHealth + a.mentalHealth))
              .slice(0, 3)
              .map((country, index) => (
                <div key={country.code} className="flex items-center justify-between">
                  <span className="text-green-800">{index + 1}. {country.name}</span>
                  <span className="font-semibold text-green-900">
                    {((country.physicalHealth + country.mentalHealth) / 2).toFixed(1)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};