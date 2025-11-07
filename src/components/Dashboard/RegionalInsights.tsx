import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { combinedHealthData, regions } from '../../data/combinedData';
import { TrendingUp, Globe, Activity, Users } from 'lucide-react';

export const RegionalInsights: React.FC = () => {
  const formatHoursAndMinutes = (hours: number): string => {
    const totalMinutes = hours * 60;
    const hoursPart = Math.floor(totalMinutes / 60);
    const minutesPart = Math.round(totalMinutes % 60);
    return `${hoursPart}h ${minutesPart}m`;
  };

  const convertToPercentage = (score: number, maxScore: number = 6): string => {
    const percentage = (score / maxScore) * 100;
    return `${percentage.toFixed(1)}%`;
  };
  // Calculate comprehensive country statistics using combined data
  const countryInsights = regions.map(region => {
    const countryData = combinedHealthData.filter(d => d.countryCode === region.code);
    
    if (countryData.length === 0) {
      return {
        name: region.name,
        code: region.code,
        avgAge: 0,
        avgIncome: 0,
        avgSES: 0,
        healthApps: 0,
        wearables: 0,
        physicalHealth: 0,
        emotional: 0,
        psychological: 0,
        social: 0,
        bmi: 0,
        phyActivity: 0,
        totalTech: 0,
        overallWellbeing: 0,
        color: region.color
      };
    }

    const avgAge = countryData.reduce((sum, d) => sum + d.age, 0) / countryData.length;
    const avgIncome = countryData.reduce((sum, d) => sum + d.income, 0) / countryData.length;
    const avgHealthApps = countryData.reduce((sum, d) => sum + d.healthAppsHours, 0) / countryData.length;
    const avgWearables = countryData.reduce((sum, d) => sum + d.wearablesHours, 0) / countryData.length;
    const avgPhysicalHealth = countryData.reduce((sum, d) => sum + d.physicalHealth, 0) / countryData.length;
    const avgEmotional = countryData.reduce((sum, d) => sum + d.emotional, 0) / countryData.length;
    const avgPsychological = countryData.reduce((sum, d) => sum + d.psychological, 0) / countryData.length;
    const avgSocial = countryData.reduce((sum, d) => sum + d.social, 0) / countryData.length;
    
    // Note: BMI and Physical Activity data might not be available in combinedData
    // You may need to adjust these based on what's available
    const avgBMI = 0; // Not available in combinedData
    const avgPhyActivity = 0; // Not available in combinedData
    
    return {
      name: region.name,
      code: region.code,
      avgAge: Number(avgAge.toFixed(1)),
      avgIncome: Number(avgIncome.toFixed(0)),
      avgSES: Number((avgIncome / 1000).toFixed(1)), // Using income as proxy for SES
      healthApps: Number(avgHealthApps.toFixed(2)),
      wearables: Number(avgWearables.toFixed(2)),
      physicalHealth: Number(avgPhysicalHealth.toFixed(2)),
      emotional: Number(avgEmotional.toFixed(2)),
      psychological: Number(avgPsychological.toFixed(2)),
      social: Number(avgSocial.toFixed(2)),
      bmi: Number(avgBMI.toFixed(1)),
      phyActivity: Number(avgPhyActivity.toFixed(1)),
      totalTech: Number((avgHealthApps + avgWearables).toFixed(2)),
      overallWellbeing: Number(((avgEmotional + avgPsychological + avgSocial) / 3).toFixed(2)),
      color: region.color
    };
  }).filter(country => country.avgAge > 0); // Filter out regions with no data

  // Radar chart data
  const radarData = [
    {
      metric: 'Tech Usage',
      ...Object.fromEntries(countryInsights.map(c => [c.name, (c.totalTech / 20 * 100).toFixed(0)]))
    },
    {
      metric: 'Physical Health',
      ...Object.fromEntries(countryInsights.map(c => [c.name, (c.physicalHealth / 5 * 100).toFixed(0)]))
    },
    {
      metric: 'Mental Health',
      ...Object.fromEntries(countryInsights.map(c => [c.name, (c.overallWellbeing / 6 * 100).toFixed(0)]))
    },
    {
      metric: 'Socioeconomic Status',
      ...Object.fromEntries(countryInsights.map(c => [c.name, Math.min((c.avgSES / 10 * 100), 100).toFixed(0)]))
    },
    {
      metric: 'Health Apps',
      ...Object.fromEntries(countryInsights.map(c => [c.name, (c.healthApps / 10 * 100).toFixed(0)]))
    },
    {
      metric: 'Wearables',
      ...Object.fromEntries(countryInsights.map(c => [c.name, (c.wearables / 10 * 100).toFixed(0)]))
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Regional Health Technology Insights</h2>
        <p className="text-lg text-gray-600">
          Comprehensive comparison of health technology adoption and outcomes across Hong Kong, Greater Bay Area, and Southeast Asia
        </p>
      </div>

      {/* Regional Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
          <TrendingUp className="w-8 h-8 mb-3 mx-auto" />
          <div className="text-2xl font-bold">
            {formatHoursAndMinutes(
              countryInsights.reduce((sum, c) => sum + c.totalTech, 0) / countryInsights.length
            )}
          </div>
          <div className="text-blue-100">Regional Avg Tech Usage</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl text-center">
          <Activity className="w-8 h-8 mb-3 mx-auto" />
          <div className="text-2xl font-bold">
            {convertToPercentage(
              countryInsights.reduce((sum, c) => sum + c.physicalHealth, 0) / countryInsights.length,
              5
            )}
          </div>
          <div className="text-green-100">Regional Physical Health</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
          <Globe className="w-8 h-8 mb-3 mx-auto" />
          <div className="text-2xl font-bold">
            {convertToPercentage(
              countryInsights.reduce((sum, c) => sum + c.overallWellbeing, 0) / countryInsights.length,
              6
            )}
          </div>
          <div className="text-purple-100">Regional Mental Wellbeing</div>
        </div>
      </div>

      {/* Comprehensive Country Comparison */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Health Technology Adoption Comparison</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryInsights} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                angle={-45}
                textAnchor="end"
                height={80}
              />
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
              <Bar dataKey="healthApps" fill="#3b82f6" name="Health Apps (h/day)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="wearables" fill="#10b981" name="Wearables (h/day)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-dimensional Analysis */}
      {/* <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Multi-Dimensional Health Profile</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#64748b' }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickCount={6}
              />
              {countryInsights.slice(0, 4).map((country, index) => (
                <Radar
                  key={country.code}
                  name={country.name}
                  dataKey={country.name}
                  stroke={country.color}
                  fill={country.color}
                  fillOpacity={0.1}
                  strokeWidth={3}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          * Values normalized to 0-100 scale for comparison. Showing top 4 countries for clarity.
        </div>
      </div> */}

      {/* Country Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Technology Adoption Rankings</h4>
          <div className="space-y-3">
            {countryInsights
              .sort((a, b) => b.totalTech - a.totalTech)
              .map((country, index) => (
                <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: country.color }}
                    ></div>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{country.totalTech}h/day</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Wellbeing Rankings</h4>
          <div className="space-y-3">
            {countryInsights
              .sort((a, b) => b.overallWellbeing - a.overallWellbeing)
              .map((country, index) => (
                <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: country.color }}
                    ></div>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{country.overallWellbeing.toFixed(1)}/6</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};