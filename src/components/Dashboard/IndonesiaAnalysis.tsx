import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { getCountryData, HealthData, getCountryByCode } from '../../data/sampleDataAsean';
import { Users, Watch, Heart, Brain, TrendingUp, Award, MapPin, GraduationCap, DollarSign, Activity, Zap, Smartphone } from 'lucide-react';

export const IndonesiaAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'technology' | 'health'>('overview');
  
  // Filter Indonesia data
  const idCountry = getCountryByCode('id');
  const idData = idCountry ? getCountryData(idCountry.hqCode) : [];

  // Calculate key metrics
  const avgHealthApps = idData.reduce((sum, d) => sum + (d.B4 || 0), 0) / idData.length;
  const avgWearables = idData.reduce((sum, d) => sum + (d.B5 || 0), 0) / idData.length;
  const avgMentalHealth = idData.reduce((sum, d) => {
    const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
    const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
    const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
    return sum + (emotional + psychological + social) / 3;
  }, 0) / idData.length;
  const excellentHealthPercent = Math.round((idData.filter(d => d.B3 === 5 || d.B3 === 4).length / idData.length) * 100);

  // Demographics data
  const ethnicityLabels = { 
    '1': 'Javanese',
    '2': 'Sundanese', 
    '3': 'Malay',
    '4': 'Batak',
    '5': 'Madurese',
    '6': 'Betawi',
    '7': 'Minangkabau',
    '8': 'Buginese',
    '9': 'Bantenese',
    '10': 'Banjarese',
    '11': 'Balinese',
    '12': 'Acehnese',
    '13': 'Dayak',
    '14': 'Sasak',
    '15': 'Chinese Indonesian',
    '16': 'Others'
  };
  const genderLabels = { '1': 'Male', '2': 'Female', '3': 'Others' };
  
  const ethnicityData = Object.entries(ethnicityLabels).map(([code, label]) => ({
    name: label,
    value: idData.filter(d => d.A4 === parseInt(code)).length,
    percentage: parseFloat(((idData.filter(d => d.A4 === parseInt(code)).length / idData.length) * 100).toFixed(2))
  }));

  const calculateTechUsageStats = (data: HealthData[]): any => {
    if (data.length === 0) {
      return {
        dailyAppUsers: 0,
        wearableOwners: 0,
        avgDailyUsage: 0
      };
    }

    // Using B4 and B5 as proxies for technology usage
    const dailyAppUsers = Math.round(
      (data.filter(d => d.B4 > 2).length / data.length) * 100
    );

    const wearableOwners = Math.round(
      (data.filter(d => d.B5 > 2).length / data.length) * 100
    );

    const totalHealthApps = data.reduce((sum, d) => sum + d.B4, 0);
    const totalWearables = data.reduce((sum, d) => sum + d.B5, 0);
    const avgDailyUsage = Number(
      ((totalHealthApps + totalWearables) / data.length).toFixed(1)
    );

    return {
      dailyAppUsers,
      wearableOwners,
      avgDailyUsage
    };
  };

  const genderData = Object.entries(genderLabels).map(([code, label]) => ({
    name: label,
    value: idData.filter(d => d.A3 === parseInt(code)).length,
    percentage: parseFloat(((idData.filter(d => d.A3 === parseInt(code)).length / idData.length) * 100).toFixed(2))
  }));

  // High usage segments
  const highTechUsers = idData.filter(d => d.B4 > 3 || d.B5 > 3).length;
  const highTechPercent = Math.round((highTechUsers / idData.length) * 100);

  // Income distribution - A5 field
  // const highIncomeUsers = idData.filter(d => d.A5 > 15).length;
  // const highIncomePercent = Math.round((highIncomeUsers / idData.length) * 100);
  const nutritionAwarenessPercent = Math.round((idData.filter(d => d.B6 >= 4).length / idData.length) * 100);

  const calculateAgeStats = (data: HealthData[]) => {
    if (data.length === 0) return null;

    const ages = data.map(d => d.A1);
    const avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;
    
    // Find age group with highest activity (B4)
    const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const activityByGroup = ageGroups.map(group => {
      const [min, max] = group === '55+' ? [55, 100] : group.split('-').map(Number);
      const groupData = data.filter(d => group === '55+' ? d.A1 >= min : d.A1 >= min && d.A1 <= max);
      const avgActivity = groupData.reduce((sum, d) => sum + d.B4, 0) / groupData.length || 0;
      return { group, avgActivity, count: groupData.length };
    });

    const mostActiveGroup = activityByGroup.reduce((a, b) => a.avgActivity > b.avgActivity ? a : b).group;
    
    // Find age group with highest tech usage (B4 + B5)
    const techByGroup = ageGroups.map(group => {
      const [min, max] = group === '55+' ? [55, 100] : group.split('-').map(Number);
      const groupData = data.filter(d => group === '55+' ? d.A1 >= min : d.A1 >= min && d.A1 <= max);
      const avgTech = groupData.reduce((sum, d) => sum + d.B4 + d.B5, 0) / groupData.length || 0;
      return { group, avgTech };
    });

    const highestTechGroup = techByGroup.reduce((a, b) => a.avgTech > b.avgTech ? a : b).group;
    
    // Find largest age group
    const largestGroup = activityByGroup.reduce((a, b) => a.count > b.count ? a : b).group;

    return {
      mostActiveAgeGroup: mostActiveGroup,
      highestTechAgeGroup: highestTechGroup,
      largestAgeGroup: largestGroup,
      averageAge: avgAge.toFixed(1)
    };
  };

  const ageStats = calculateAgeStats(idData);

  // Education labels based on the survey
  const educationLabels: { [key: number]: string } = {
    1: 'No formal education',
    2: 'Primary education or below',
    3: 'Junior high school',
    4: 'Senior high school',
    5: 'Diploma',
    6: 'Bachelor',
    7: 'Master',
    8: 'Doctoral',
    9: 'Others'
  };

  // Calculate physical health distribution data for pie chart
  const physicalHealthData = [
    {
      name: 'Excellent',
      value: idData.filter(d => d.B3 === 5).length,
      percentage: Math.round((idData.filter(d => d.B3 === 5).length / idData.length) * 100),
      fill: '#10b981'
    },
    {
      name: 'Very Good',
      value: idData.filter(d => d.B3 === 4).length,
      percentage: Math.round((idData.filter(d => d.B3 === 4).length / idData.length) * 100),
      fill: '#3b82f6'
    },
    {
      name: 'Good',
      value: idData.filter(d => d.B3 === 3).length,
      percentage: Math.round((idData.filter(d => d.B3 === 3).length / idData.length) * 100),
      fill: '#f59e0b'
    },
    {
      name: 'Fair',
      value: idData.filter(d => d.B3 === 2).length,
      percentage: Math.round((idData.filter(d => d.B3 === 2).length / idData.length) * 100),
      fill: '#f97316'
    },
    {
      name: 'Poor',
      value: idData.filter(d => d.B3 === 1).length,
      percentage: Math.round((idData.filter(d => d.B3 === 1).length / idData.length) * 100),
      fill: '#ef4444'
    }
  ].filter(item => item.value > 0); // Only show categories that have data

  // Calculate education statistics for Indonesia
  const calculateEducationStats = (data: HealthData[]) => {
    if (data.length === 0) return { tertiaryPercent: 0, distribution: [] };

    // Tertiary education = A6 >= 5 (Diploma and above)
    const tertiaryEducationPercent = Math.round((data.filter(d => d.A6 >= 5).length / data.length) * 100);

    // Full education distribution
    const distribution = Object.entries(educationLabels).map(([code, label]) => ({
      level: label,
      code: parseInt(code),
      count: data.filter(d => d.A6 === parseInt(code)).length,
      percentage: parseFloat(((data.filter(d => d.A6 === parseInt(code)).length / data.length) * 100).toFixed(2))
    })).filter(item => item.count > 0); // Only show levels that have data

    return {
      tertiaryPercent: tertiaryEducationPercent,
      distribution
    };
  };

  const educationStats = calculateEducationStats(idData);

  // Calculate median income (A5 field - convert to approximate income values)
  const calculateMedianIncome = (data: HealthData[]) => {
    if (data.length === 0) return 0;
    
    // Map income codes to midpoint values of each range for Indonesia (IDR - millions)
    const incomeMap: { [key: number]: number } = {
      1: 0.5,    // Less than Rp 1.000.000 (midpoint: Rp 0.5 million)
      2: 1.5,    // Rp 1.000.000 – Rp 1.999.999 (midpoint: Rp 1.5 million)
      3: 2.5,    // Rp 2.000.000 – Rp 2.999.999 (midpoint: Rp 2.5 million)
      4: 3.5,    // Rp 3.000.000 – Rp 3.999.999 (midpoint: Rp 3.5 million)
      5: 4.5,    // Rp 4.000.000 – Rp 4.999.999 (midpoint: Rp 4.5 million)
      6: 5.5,    // Rp 5.000.000 – Rp 5.999.999 (midpoint: Rp 5.5 million)
      7: 6.5,    // Rp 6.000.000 – Rp 6.999.999 (midpoint: Rp 6.5 million)
      8: 7.5,    // Rp 7.000.000 – Rp 7.999.999 (midpoint: Rp 7.5 million)
      9: 8.5,    // Rp 8.000.000 – Rp 8.999.999 (midpoint: Rp 8.5 million)
      10: 9.5,   // Rp 9.000.000 – Rp 9.999.999 (midpoint: Rp 9.5 million)
      11: 12.5,  // Rp 10.000.000 – Rp 14.999.999 (midpoint: Rp 12.5 million)
      12: 17.5,  // Rp 15.000.000 – Rp 19.999.999 (midpoint: Rp 17.5 million)
      13: 22.5,  // Rp 20.000.000 – Rp 24.999.999 (midpoint: Rp 22.5 million)
      14: 27.5,  // Rp 25.000.000 – Rp 29.999.999 (midpoint: Rp 27.5 million)
      15: 32.5,  // Rp 30.000.000 – Rp 34.999.999 (midpoint: Rp 32.5 million)
      16: 37.5,  // Rp 35.000.000 – Rp 39.999.999 (midpoint: Rp 37.5 million)
      17: 42.5,  // Rp 40.000.000 – Rp 44.999.999 (midpoint: Rp 42.5 million)
      18: 47.5,  // Rp 45.000.000 – Rp 49.999.999 (midpoint: Rp 47.5 million)
      19: 75,    // Rp 50.000.000 – Rp 99.999.999 (midpoint: Rp 75 million)
      20: 125    // Rp 100.000.000 and above (estimated midpoint: Rp 125 million)
    };

    const incomes = data
      .map(d => incomeMap[d.A5] || 0)
      .sort((a, b) => a - b);
    
    const mid = Math.floor(incomes.length / 2);
    const median = incomes.length % 2 === 0 
      ? (incomes[mid - 1] + incomes[mid]) / 2 
      : incomes[mid];
    
    return parseFloat(median.toFixed(1)); // Return in millions of IDR with 1 decimal
  };

  const medianIncome = calculateMedianIncome(idData);

  // Health Metrics by Income with actual income ranges for Indonesia
  const calculateHealthMetricsByIncome = (data: HealthData[]) => {
    // Define income ranges with actual labels for Indonesia (IDR - millions)
    const incomeRanges = [
      { min: 1, max: 4, label: 'IDR<4M', description: 'Under IDR 4 million' },
      { min: 5, max: 8, label: 'IDR4M-8M', description: 'IDR 4 - 8 million' },
      { min: 9, max: 10, label: 'IDR8M-10M', description: 'IDR 8 - 10 million' },
      { min: 11, max: 13, label: 'IDR10M-25M', description: 'IDR 10 - 25 million' },
      { min: 14, max: 16, label: 'IDR25M-40M', description: 'IDR 25 - 40 million' },
      { min: 17, max: 20, label: 'IDR40M+', description: 'IDR 40 million and above' }
    ];

    const healthMetricsData = incomeRanges.map(range => {
      const groupData = data.filter(d => d.A5 >= range.min && d.A5 <= range.max);
      
      if (groupData.length === 0) return null;

      // Calculate mental health average and convert to percentage
      const avgMentalHealth = groupData.reduce((sum, d) => {
        const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
        const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
        const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
        return sum + (emotional + psychological + social) / 3;
      }, 0) / groupData.length;

      // Calculate physical health average and convert to percentage (B3 is 1-5 scale)
      const avgPhysicalHealth = groupData.reduce((sum, d) => sum + d.B3, 0) / groupData.length;

      // Convert to percentages (assuming max scores: mental health 6, physical health 5)
      const mentalHealthPercent = (avgMentalHealth / 6) * 100;
      const physicalHealthPercent = (avgPhysicalHealth / 5) * 100;
      
      return {
        income: range.label,
        description: range.description,
        mentalHealth: parseFloat(mentalHealthPercent.toFixed(1)),
        physicalHealth: parseFloat(physicalHealthPercent.toFixed(1)),
        participants: groupData.length,
        avgIncomeLevel: (range.min + range.max) / 2 // For sorting
      };
    })
    .filter(item => item !== null && item.participants >= 5)
    .sort((a, b) => a!.avgIncomeLevel - b!.avgIncomeLevel);

    return healthMetricsData;
  };

  const healthMetricsByIncome = calculateHealthMetricsByIncome(idData);

  // Technology impact proxies
  const calculateTechImpactProxies = (data: HealthData[]) => {
    if (data.length === 0) return { awarenessImpact: 0, behaviorImpact: 0, outcomesImpact: 0 };

    // Impact on Health Awareness (Nutrition + Activity knowledge)
    const awarenessImpact = Math.round(
      (data.filter(d => d.B6 >= 4 && d.B4 >= 3).length / data.length) * 100
    );

    // Impact on Health Behaviors (Multiple healthy behaviors)
    const behaviorImpact = Math.round(
      (data.filter(d => 
        d.B4 >= 3 && // Regular activity
        d.B6 >= 4 && // Good nutrition
        d.B8 === 1 && // Non-smoker
        d.B7 <= 2    // Low alcohol
      ).length / data.length) * 100
    );

    // Impact on Health Outcomes (Good mental + physical health)
    const outcomesImpact = Math.round(
      (data.filter(d => {
        const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
        const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
        const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
        const mentalHealth = (emotional + psychological + social) / 3;
        return mentalHealth >= 4 && d.B3 >= 4;
      }).length / data.length) * 100
    );

    return {
      awarenessImpact,
      behaviorImpact,
      outcomesImpact
    };
  };

  const techImpactProxies = calculateTechImpactProxies(idData);

  // Calculate key findings metrics
  const techAdoptionRate = calculateTechUsageStats(idData).dailyAppUsers;
  const highIncomePercent = Math.round((idData.filter(d => d.A5 >= 17).length / idData.length) * 100);
  const wearableAdoption = calculateTechUsageStats(idData).wearableOwners;
  const incomeHealthGap = healthMetricsByIncome.length > 0 
    && healthMetricsByIncome[0] != null
    && healthMetricsByIncome[healthMetricsByIncome.length - 1] != null
    ? Math.round(
        (healthMetricsByIncome[healthMetricsByIncome.length - 1]!.mentalHealth ?? 0) -
        (healthMetricsByIncome[0]!.mentalHealth ?? 0)
      )
    : 0;
  const mentalWellbeingPercent = ((idData.reduce((sum, d) => {
    const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
    const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
    const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
    return sum + (emotional + psychological + social) / 3;
  }, 0) / idData.length) / 6 * 100).toFixed(1);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'technology', label: 'Technology', icon: Smartphone },
    { id: 'health', label: 'Health', icon: Heart }
  ];

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

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
      {/* Header */}
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Indonesia</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Digital Health Technology Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Understanding how technology is transforming healthcare experiences across Indonesia's diverse population
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-6 px-4 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Hero Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{idData.length}</div>
                  <div className="text-blue-100 font-medium">Study Participants</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-green-600 hover:to-green-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{formatHoursAndMinutes(avgHealthApps)}</div>
                  <div className="text-green-100 font-medium">Daily App Usage</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Daily Health App Usage</div>
                      <div className="text-white text-sm">
                        Average time spent using health apps per day
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Scale: 0-24 hours per day
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Based on {idData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-purple-600 hover:to-purple-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Watch className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{formatHoursAndMinutes(avgWearables)}</div>
                  <div className="text-purple-100 font-medium">Wearable Usage</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Daily Wearable Usage</div>
                      <div className="text-white text-sm">
                        Average time spent using health wearables per day
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Scale: 0-24 hours per day
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Based on {idData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-orange-600 hover:to-orange-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{excellentHealthPercent}%</div>
                  <div className="text-orange-100 font-medium">Excellent Health</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2">1 = Very Poor<br/>2 = Poor<br/>3 = Fair<br/>4 = Good<br/>5 = Excellent<br/>This data includes those who are feeling "Good" and "Excellent"</span>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">Technology Adoption</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{highTechPercent}%</div>
                  <p className="text-gray-600">of participants are high-frequency technology users, significantly above regional average</p>
                </div>

                <div className="bg-white border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900">Health Outcomes</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{convertToPercentage(avgMentalHealth)}</div>
                  <p className="text-gray-600">average mental wellbeing score, indicating positive health technology impact</p>
                </div>
                <div className="bg-white border-l-4 border-orange-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-orange-500" />
                    <h3 className="text-xl font-bold text-gray-900">Nutrition Awareness</h3>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{nutritionAwarenessPercent}%</div>
                  <p className="text-gray-600">consume 3+ servings of fruits/vegetables daily, indicating strong nutritional habits</p>
                </div>
              </div>

              {/* Visual Health Journey */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">Indonesia's Digital Health Journey</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div className="font-semibold mb-1">Mobile First</div>
                    <div className="text-sm text-teal-100">Apps dominate health tech usage</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Watch className="w-8 h-8" />
                    </div>
                    <div className="font-semibold mb-1">Wearable Growth</div>
                    <div className="text-sm text-teal-100">Rising adoption across age groups</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-8 h-8" />
                    </div>
                    <div className="font-semibold mb-1">Holistic Wellness</div>
                    <div className="text-sm text-teal-100">Mental & physical health focus</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="font-semibold mb-1">Leading Region</div>
                    <div className="text-sm text-teal-100">Highest adoption in Southeast Asia</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demographics' && (
            <div className="space-y-8">
              {/* Population Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ethnicity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Population by Ethnicity</h4>
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ethnicityData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {ethnicityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {ethnicityData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{entry.name}</div>
                            <div className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                              {entry.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gender & Age Insights */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-2xl 
                transition-all duration-300 hover:from-pink-600 hover:to-rose-600 
                hover:shadow-lg cursor-pointer group relative">
                    <h4 className="text-xl font-bold mb-4">Gender Distribution</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {genderData.map((entry, index) => (
                        <div key={entry.name} className="text-center">
                          <div className="text-3xl font-bold mb-1">{entry.percentage}%</div>
                          <div className="text-pink-100">{entry.name}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Hover Tooltip with Percentage Bars */}
                    <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                      <div className="w-full space-y-4">
                        <div className="text-white font-bold text-center mb-3">Detailed Breakdown</div>
                        {genderData.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between text-white text-sm">
                            <span className="font-medium w-20 text-left">{entry.name}</span>
                            <div className="flex-1 mx-3">
                              <div className="bg-gray-600 rounded-full h-2">
                                <div 
                                  className="bg-white h-2 rounded-full" 
                                  style={{ width: `${entry.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="font-bold w-16 text-right">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-6 rounded-2xl 
                  transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 
                  hover:shadow-lg cursor-pointer group relative">
                    <h4 className="text-xl font-bold mb-4">Age Insights</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Most Active Age Group</span>
                        <span className="font-bold">{ageStats?.mostActiveAgeGroup || '25-34'} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Highest Tech Adoption</span>
                        <span className="font-bold">{ageStats?.highestTechAgeGroup || '25-34'} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Largest Segment</span>
                        <span className="font-bold">{ageStats?.largestAgeGroup || '25-34'} years</span>
                      </div>
                      <div className="flex justify-between border-t border-white/20 pt-2">
                        <span>Average Age</span>
                        <span className="font-bold">{ageStats?.averageAge || '32.5'} years</span>
                      </div>
                    </div>
                    
                    {/* Simple Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg mb-3">Age Distribution</div>
                        <div className="text-white text-sm space-y-2">
                          {(() => {
                            const ageGroups = {
                              '18-24': idData.filter(d => d.A1 >= 18 && d.A1 <= 24).length,
                              '25-34': idData.filter(d => d.A1 >= 25 && d.A1 <= 34).length,
                              '35-44': idData.filter(d => d.A1 >= 35 && d.A1 <= 44).length,
                              '45-54': idData.filter(d => d.A1 >= 45 && d.A1 <= 54).length,
                              '55+': idData.filter(d => d.A1 >= 55).length
                            };
                            
                            return Object.entries(ageGroups).map(([group, count]) => (
                              <div key={group} className="flex justify-between">
                                <span>{group} years:</span>
                                <span className="font-bold ml-4">
                                  {count} ({(count / idData.length * 100).toFixed(1)}%)
                                </span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Income */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border text-center 
                            transition-all duration-300 hover:shadow-lg cursor-pointer group relative">
                  <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Education Impact</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{educationStats.tertiaryPercent}%</div>
                  <p className="text-gray-600">have tertiary education or higher (A-level/Diploma+)</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-90 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                    <div className="w-full space-y-1.5 max-h-56 overflow-y-auto">
                      <div className="text-white font-bold text-center mb-1 text-xs">Education Breakdown</div>
                      {educationStats.distribution.map((item) => (
                        <div key={item.code} className="flex items-center justify-between text-white text-xs">
                          <span className="font-medium w-28 text-left truncate" title={item.level}>
                            {item.level}
                          </span>
                          <div className="flex-1 mx-1.5">
                            <div className="bg-gray-600 rounded-full h-1">
                              <div 
                                className="bg-blue-400 h-1 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="font-bold w-10 text-right text-xs">
                            {item.percentage}%
                          </span>
                        </div>
                      ))}
                      
                      <div className="border-t border-gray-600 pt-1 mt-1 text-[10px] text-gray-300">
                        <div className="flex justify-between">
                          <span>Highest:</span>
                          <span className="font-bold truncate ml-1 max-w-20" title={educationStats.distribution.reduce((max, item) => item.code > max.code ? item : max).level}>
                            {educationStats.distribution.reduce((max, item) => item.code > max.code ? item : max).level}
                          </span>
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span>Levels:</span>
                          <span className="font-bold">
                            {educationStats.distribution.length}/9
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Income Card with Hover */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border text-center 
                transition-all duration-300 hover:shadow-lg cursor-pointer group relative">
                  <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Economic Status</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">IDR {medianIncome} juta</div>
                  <p className="text-gray-600">median monthly household income</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-90 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                    <div className="w-full space-y-1.5 max-h-56 overflow-y-auto">
                      <div className="text-white font-bold text-center mb-1 text-xs">Income Distribution</div>
                      {(() => {
                        const incomeBrackets = {
                          'Low (<THB40K)': idData.filter(d => d.A5 <= 3).length,
                          'Middle (THB40K-70K)': idData.filter(d => d.A5 >= 4 && d.A5 <= 6).length,
                          'Upper Middle (THB70K-100K)': idData.filter(d => d.A5 >= 7 && d.A5 <= 9).length,
                          'High (>THB100K)': idData.filter(d => d.A5 >= 10).length
                        };
                        
                        return Object.entries(incomeBrackets).map(([bracket, count]) => (
                          <div key={bracket} className="flex items-center justify-between text-white text-xs">
                            <span className="font-medium w-28 text-left">{bracket}</span>
                            <div className="flex-1 mx-1.5">
                              <div className="bg-gray-600 rounded-full h-1">
                                <div 
                                  className="bg-green-400 h-1 rounded-full" 
                                  style={{ width: `${(count / idData.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="font-bold w-10 text-right">
                              {((count / idData.length) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ));
                      })()}
                      
                      <div className="border-t border-gray-600 pt-1 mt-1 text-[10px] text-gray-300">
                        <div className="flex justify-between">
                          <span>Highest Group:</span>
                          <span className="font-bold">
                            {(() => {
                              const maxIncomeCode = Math.max(...idData.map(d => d.A5));
                              const maxGroups = idData.filter(d => d.A5 === maxIncomeCode).length;
                              return `${maxGroups} users`;
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span>Range:</span>
                          <span className="font-bold">
                            {Math.min(...idData.map(d => d.A5))}-{Math.max(...idData.map(d => d.A5))}/18
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technology' && (
            <div className="space-y-8">
              {/* Tech Adoption Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl text-center 
                transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{calculateTechUsageStats(idData).dailyAppUsers}%</div>
                  <div className="text-blue-100 font-medium mb-2">Use Health Apps Daily</div>
                  <div className="text-sm text-blue-200">Highest adoption rate in region</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Daily Health App Users</div>
                      <div className="text-white text-sm">
                        Percentage of participants who use health apps at least once per day
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Based on self-reported usage data
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Survey sample: {idData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-2xl text-center 
                transition-all duration-300 hover:from-purple-600 hover:to-pink-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Watch className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{calculateTechUsageStats(idData).wearableOwners}%</div>
                  <div className="text-purple-100 font-medium mb-2">Own Wearable Devices</div>
                  <div className="text-sm text-purple-200">Growing {Math.round(calculateTechUsageStats(idData).wearableOwners / 3)}% annually</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Wearable Device Ownership</div>
                      <div className="text-white text-sm">
                        Percentage of participants who own and use wearable health devices
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Includes smartwatches, fitness trackers, and medical wearables
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Survey sample: {idData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-8 rounded-2xl text-center 
                transition-all duration-300 hover:from-green-600 hover:to-teal-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Zap className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{formatHoursAndMinutes(calculateTechUsageStats(idData).avgDailyUsage)}</div>
                  <div className="text-green-100 font-medium mb-2">Average Daily Usage</div>
                  <div className="text-sm text-green-200">Across all health technologies</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Average Daily Technology Usage</div>
                      <div className="text-white text-sm">
                        Combined average hours spent on health apps and wearables per day
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Calculated from self-reported daily usage hours
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Survey sample: {idData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Patterns - Tech Focused */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Health Behavior Patterns</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-blue-600">📊</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Health Tracking</div>
                    <div className="text-gray-600 text-sm mb-2">Self-Monitoring</div>
                    <div className="space-y-1 text-xs">
                      <div>Regular Activity: {Math.round((idData.filter(d => d.B4 >= 3).length / idData.length) * 100)}%</div>
                      <div>Nutrition Aware: {Math.round((idData.filter(d => d.B6 >= 4).length / idData.length) * 100)}%</div>
                      <div>Health Conscious: {Math.round((idData.filter(d => d.B3 >= 4).length / idData.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-purple-600">🧘</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Wellness Focus</div>
                    <div className="text-gray-600 text-sm mb-2">Mental Health</div>
                    <div className="space-y-1 text-xs">
                      <div>High Emotional: {Math.round((idData.filter(d => (d.B11_1 + d.B11_2 + d.B11_3) / 3 >= 4).length / idData.length) * 100)}%</div>
                      <div>High Psychological: {Math.round((idData.filter(d => (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6 >= 4).length / idData.length) * 100)}%</div>
                      <div>High Social: {Math.round((idData.filter(d => (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5 >= 4).length / idData.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-green-600">⚡</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Active Lifestyle</div>
                    <div className="text-gray-600 text-sm mb-2">Physical Health</div>
                    <div className="space-y-1 text-xs">
                      <div>Excellent Health: {Math.round((idData.filter(d => d.B3 === 5).length / idData.length) * 100)}%</div>
                      <div>Good Health: {Math.round((idData.filter(d => d.B3 === 4).length / idData.length) * 100)}%</div>
                      <div>Fair Health: {Math.round((idData.filter(d => d.B3 === 3).length / idData.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-orange-600">🛡️</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Preventive Care</div>
                    <div className="text-gray-600 text-sm mb-2">Health Management</div>
                    <div className="space-y-1 text-xs">
                      <div>No Conditions: {Math.round((idData.filter(d => d.B10_9 === 1).length / idData.length) * 100)}%</div>
                      <div>Non-smokers: {Math.round((idData.filter(d => d.B8 === 1).length / idData.length) * 100)}%</div>
                      <div>Low Alcohol: {Math.round((idData.filter(d => d.B7 <= 2).length / idData.length) * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Metrics by Income */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Health Metrics by Income Level</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthMetricsByIncome} margin={{left:10, right: 10, top:20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="income" 
                        stroke="#64748b" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Score']}
                        labelFormatter={(label) => {
                          const item = healthMetricsByIncome.find(d => d?.income === label);
                          return item ? `${item.description} (${item.participants} participants)` : label;
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mentalHealth" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        name="Mental Wellbeing"
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="physicalHealth" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        name="Physical Health"
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-gray-600 mt-4">
                  Health scores shown as percentages of maximum possible scores (Higher percentages indicate better health)
                </div>
              </div>

              {/* Technology ROI */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-2xl">
                <h4 className="text-2xl font-bold mb-6 text-center">Digital Health Impact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-4xl font-bold text-green-400 mb-2">{techImpactProxies.awarenessImpact}%</div>
                    <div className="text-white font-medium mb-1">Health Awareness</div>
                    <div className="text-gray-300 text-sm">Active & nutrition-conscious</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💪</div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">{techImpactProxies.behaviorImpact}%</div>
                    <div className="text-white font-medium mb-1">Healthy Behaviors</div>
                    <div className="text-gray-300 text-sm">Multiple positive habits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">😊</div>
                    <div className="text-4xl font-bold text-purple-400 mb-2">{techImpactProxies.outcomesImpact}%</div>
                    <div className="text-white font-medium mb-1">Optimal Wellbeing</div>
                    <div className="text-gray-300 text-sm">Strong mental & physical health</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-8">
              {/* Health Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{excellentHealthPercent}%</div>
                  <div className="text-green-100 font-medium">Excellent Physical Health</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{((idData.reduce((sum, d) => {
                    const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
                    const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
                    const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
                    return sum + (emotional + psychological + social) / 3;
                  }, 0) / idData.length) / 6 * 100).toFixed(1)}%</div>
                  <div className="text-blue-100 font-medium">Mental Wellbeing Score</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl text-center">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">
                    {Math.round((idData.filter(d => d.B4 >= 3).length / idData.length) * 100)}%
                  </div>
                  <div className="text-purple-100 font-medium">Active Lifestyle</div>
                </div>
              </div>

              {/* Health Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Physical Health */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-xl font-bold mb-4 text-center">Physical Health Distribution</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={physicalHealthData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                          outerRadius={100}
                          innerRadius={40}
                          dataKey="value"
                        >
                          {physicalHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${props.payload.percentage}% (${value} participants)`,
                            props.payload.name
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Mental Health Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-xl font-bold mb-4">Mental Wellbeing Components</h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-900">Emotional Health</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {convertToPercentage(
                            idData.reduce((sum, d) => sum + (d.B11_1 + d.B11_2 + d.B11_3) / 3, 0) / idData.length,
                            6
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(idData.reduce((sum, d) => sum + (d.B11_1 + d.B11_2 + d.B11_3) / 3, 0) / idData.length / 6) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-900">Psychological Health</span>
                        <span className="text-2xl font-bold text-green-600">
                          {convertToPercentage(
                            idData.reduce((sum, d) => sum + (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6, 0) / idData.length,
                            6
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(idData.reduce((sum, d) => sum + (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6, 0) / idData.length / 6) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-purple-900">Social Health</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {convertToPercentage(
                            idData.reduce((sum, d) => sum + (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5, 0) / idData.length,
                            6
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(idData.reduce((sum, d) => sum + (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5, 0) / idData.length / 6) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-8 rounded-2xl">
        <h3 className="text-3xl font-bold mb-6 text-center">Indonesia: Leading the Digital Health Revolution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🚀</div>
            <h4 className="font-bold mb-2 text-lg">Technology Pioneer</h4>
            <p className="text-sm text-gray-200">
              {techAdoptionRate}% use health apps regularly, with {wearableAdoption}% adopting wearable technology for health monitoring.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">💰</div>
            <h4 className="font-bold mb-2 text-lg">Economic Driver</h4>
            <p className="text-sm text-gray-200">
              {highIncomePercent}% high-income participants achieve {incomeHealthGap}% better mental health scores, demonstrating socioeconomic health advantages.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold mb-2 text-lg">Health Excellence</h4>
            <p className="text-sm text-gray-200">
              {excellentHealthPercent}% report excellent physical health, with mental wellbeing at {mentalWellbeingPercent}% of optimal levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};