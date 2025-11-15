import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { getCountryData, HealthData, getCountryByCode } from '../../data/sampleDataAsean';
import { Users, Smartphone, Watch, Heart, Brain, TrendingUp, Award, MapPin, GraduationCap, DollarSign, Activity, Zap } from 'lucide-react';

export const PhilippinesAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'technology' | 'health' | 'apps_wearables' | 'social_environment'>('overview');
  
  // Filter Philippines data
  const phCountry = getCountryByCode('ph');
  const phData = phCountry ? getCountryData(phCountry.hqCode) : [];

  // Calculate key metrics
  const avgHealthApps = phData.reduce((sum, d) => sum + (d.B4 || 0), 0) / phData.length;
  const avgWearables = phData.reduce((sum, d) => sum + (d.B5 || 0), 0) / phData.length;
  const avgMentalHealth = phData.reduce((sum, d) => {
    const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
    const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
    const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
    return sum + (emotional + psychological + social) / 3;
  }, 0) / phData.length;
  const excellentHealthPercent = Math.round((phData.filter(d => d.B3 === 5 || d.B3 === 4).length / phData.length) * 100);

  // Demographics data
  const ethnicityLabels = { '1': 'Cina', '2': 'Melayu', '3': 'India', '4': 'Others',};
  const genderLabels = { '1': 'Male', '2': 'Female', '3': 'Others' };
  
  const ethnicityData = Object.entries(ethnicityLabels).map(([code, label]) => ({
    name: label,
    value: phData.filter(d => d.A4 === parseInt(code)).length,
    percentage: parseFloat(((phData.filter(d => d.A4 === parseInt(code)).length / phData.length) * 100).toFixed(2))
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
    value: phData.filter(d => d.A3 === parseInt(code)).length,
    percentage: parseFloat(((phData.filter(d => d.A3 === parseInt(code)).length / phData.length) * 100).toFixed(2))
  }));

  // High usage segments
  const highTechUsers = phData.filter(d => d.B4 > 3 || d.B5 > 3).length;
  const highTechPercent = Math.round((highTechUsers / phData.length) * 100);

  // Income distribution - A5 field
  // const highIncomeUsers = phData.filter(d => d.A5 > 15).length;
  // const highIncomePercent = Math.round((highIncomeUsers / phData.length) * 100);
  const nutritionAwarenessPercent = Math.round((phData.filter(d => d.B6 >= 4).length / phData.length) * 100);

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

  const ageStats = calculateAgeStats(phData);

  // Education labels based on the survey
  const educationLabels: { [key: number]: string } = {
    1: 'Walang pormal na edukasyon',
    2: 'Bahagyang Elementarya',
    3: 'Elementarya',
    4: 'Bahagyang High School',
    5: 'High School',
    6: 'Bahagyang Senior High School',
    7: 'Senior High School',
    8: 'Bahagyang kolehiyo',
    9: 'Diploma ng Kolehiyo',
    10: 'Postgraduate',
    11: 'Iba pa'
  };

  // Calculate physical health distribution data for pie chart
  const physicalHealthData = [
    {
      name: 'Excellent',
      value: phData.filter(d => d.B3 === 5).length,
      percentage: Math.round((phData.filter(d => d.B3 === 5).length / phData.length) * 100),
      fill: '#10b981'
    },
    {
      name: 'Very Good',
      value: phData.filter(d => d.B3 === 4).length,
      percentage: Math.round((phData.filter(d => d.B3 === 4).length / phData.length) * 100),
      fill: '#3b82f6'
    },
    {
      name: 'Good',
      value: phData.filter(d => d.B3 === 3).length,
      percentage: Math.round((phData.filter(d => d.B3 === 3).length / phData.length) * 100),
      fill: '#f59e0b'
    },
    {
      name: 'Fair',
      value: phData.filter(d => d.B3 === 2).length,
      percentage: Math.round((phData.filter(d => d.B3 === 2).length / phData.length) * 100),
      fill: '#f97316'
    },
    {
      name: 'Poor',
      value: phData.filter(d => d.B3 === 1).length,
      percentage: Math.round((phData.filter(d => d.B3 === 1).length / phData.length) * 100),
      fill: '#ef4444'
    }
  ].filter(item => item.value > 0); // Only show categories that have data

  // Calculate education statistics for Philippines
  const calculateEducationStats = (data: HealthData[]) => {
    if (data.length === 0) return { tertiaryPercent: 0, distribution: [] };

    // Tertiary education = A6 >= 8 (Bahagyang kolehiyo and above)
    const tertiaryEducationPercent = Math.round((data.filter(d => d.A6 >= 8).length / data.length) * 100);

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

  const educationStats = calculateEducationStats(phData);

  // Calculate median income (A5 field - convert to approximate income values)
  const calculateMedianIncome = (data: HealthData[]) => {
    if (data.length === 0) return 0;
    
    // Map income codes to midpoint values of each range for Philippines (PHP)
    const incomeMap: { [key: number]: number } = {
      1: 15000,   // PHP 10,000 – PHP 19,999 (midpoint: PHP 15,000)
      2: 25000,   // PHP 20,000 – PHP 20,999 (midpoint: PHP 25,000)
      3: 35000,   // PHP 30,000 – PHP 30,999 (midpoint: PHP 35,000)
      4: 45000,   // PHP 40,000 – PHP 40,999 (midpoint: PHP 45,000)
      5: 55000,   // PHP 50,000 – PHP 50,999 (midpoint: PHP 55,000)
      6: 65000,   // PHP 60,000 – PHP 60,999 (midpoint: PHP 65,000)
      7: 75000,   // PHP 70,000 – PHP 70,999 (midpoint: PHP 75,000)
      8: 85000,   // PHP 80,000 – PHP 80,999 (midpoint: PHP 85,000)
      9: 95000,   // PHP 90,000 – PHP 90,999 (midpoint: PHP 95,000)
      10: 105000, // PHP 100,000 – PHP 100,999 (midpoint: PHP 105,000)
      11: 205000, // PHP 200,000 – PHP 200,999 (midpoint: PHP 205,000)
      12: 305000, // PHP 300,000 – PHP 300,999 (midpoint: PHP 305,000)
      13: 405000, // PHP 400,000 – PHP 400,999 (midpoint: PHP 405,000)
      14: 505000, // PHP 500,000 – PHP 500,999 (midpoint: PHP 505,000)
      15: 650000  // PHP 600,000 pataas (estimated midpoint: PHP 650,000)
    };

    const incomes = data
      .map(d => incomeMap[d.A5] || 0)
      .sort((a, b) => a - b);
    
    const mid = Math.floor(incomes.length / 2);
    const median = incomes.length % 2 === 0 
      ? (incomes[mid - 1] + incomes[mid]) / 2 
      : incomes[mid];
    
    return Math.round(median / 1000) * 1000; // Round to nearest 1,000
  };

  const medianIncome = calculateMedianIncome(phData);

  // Health Metrics by Income with actual income ranges for Philippines
  const calculateHealthMetricsByIncome = (data: HealthData[]) => {
    // Define income ranges with actual labels for Philippines (PHP)
    const incomeRanges = [
      { min: 1, max: 3, label: 'PHP<35K', description: 'Under PHP 35,000' },
      { min: 4, max: 6, label: 'PHP35K-65K', description: 'PHP 35,000 - PHP 65,999' },
      { min: 7, max: 9, label: 'PHP70K-95K', description: 'PHP 70,000 - PHP 95,999' },
      { min: 10, max: 10, label: 'PHP100K', description: 'PHP 100,000 - PHP 100,999' },
      { min: 11, max: 13, label: 'PHP200K-400K', description: 'PHP 200,000 - PHP 400,999' },
      { min: 14, max: 15, label: 'PHP500K+', description: 'PHP 500,000 and above' }
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

  const healthMetricsByIncome = calculateHealthMetricsByIncome(phData);

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

  const techImpactProxies = calculateTechImpactProxies(phData);

  // Calculate key findings metrics
  const techAdoptionRate = calculateTechUsageStats(phData).dailyAppUsers;
  const highIncomePercent = Math.round((phData.filter(d => d.A5 >= 17).length / phData.length) * 100);
  const wearableAdoption = calculateTechUsageStats(phData).wearableOwners;
  const incomeHealthGap = healthMetricsByIncome.length > 0 
    && healthMetricsByIncome[0] != null
    && healthMetricsByIncome[healthMetricsByIncome.length - 1] != null
    ? Math.round(
        (healthMetricsByIncome[healthMetricsByIncome.length - 1]!.mentalHealth ?? 0) -
        (healthMetricsByIncome[0]!.mentalHealth ?? 0)
      )
    : 0;
  const mentalWellbeingPercent = ((phData.reduce((sum, d) => {
    const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
    const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
    const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
    return sum + (emotional + psychological + social) / 3;
  }, 0) / phData.length) / 6 * 100).toFixed(1);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'technology', label: 'Technology', icon: Smartphone },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'apps_wearables', label: 'Apps & Wearables', icon: Watch }, 
    { id: 'social_environment', label: 'Social Environment', icon: Users }
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

  const calculateAppsWearablesStats = (data: HealthData[]) => {
    if (data.length === 0) return null;

    // Filter data that has Section C data
    const dataWithSectionC = data.filter(d => d.C1_1 !== undefined);
    
    if (dataWithSectionC.length === 0) return null;

    // C1: Wearable usage (check if any wearable is used)
    const anyWearableUsage = Math.round((dataWithSectionC.filter(d => 
      d.C1_1 === 1 || d.C1_2 === 1 || d.C1_3 === 1 || d.C1_4 === 1 || 
      d.C1_5 === 1 || d.C1_6 === 1 || d.C1_7 === 1
    ).length / dataWithSectionC.length) * 100);

    // C3: Health app usage (check if any app is used)
    const anyAppUsage = Math.round((dataWithSectionC.filter(d => 
      d.C3_1 === 1 || d.C3_2 === 1 || d.C3_3 === 1 || d.C3_4 === 1 || 
      d.C3_5 === 1 || d.C3_6 === 1 || d.C3_7 === 1 || d.C3_8 === 1 ||
      d.C3_9 === 1 || d.C3_10 === 1 || d.C3_11 === 1 || d.C3_12 === 1 ||
      d.C3_13 === 1 || d.C3_14 === 1 || d.C3_15 === 1 || d.C3_16 === 1 ||
      d.C3_17 === 1 || d.C3_18 === 1 || d.C3_19 === 1 || d.C3_20 === 1 ||
      d.C3_21 === 1 || d.C3_22 === 1
    ).length / dataWithSectionC.length) * 100);

    // C5: Health categories used
    const healthCategories = {
      fitness: Math.round((dataWithSectionC.filter(d => d.C5_1 === 1).length / dataWithSectionC.length) * 100),
      sleep: Math.round((dataWithSectionC.filter(d => d.C5_2 === 1).length / dataWithSectionC.length) * 100),
      mentalHealth: Math.round((dataWithSectionC.filter(d => d.C5_3 === 1).length / dataWithSectionC.length) * 100),
      diet: Math.round((dataWithSectionC.filter(d => d.C5_4 === 1).length / dataWithSectionC.length) * 100),
      medicalCondition: Math.round((dataWithSectionC.filter(d => d.C5_5 === 1).length / dataWithSectionC.length) * 100)
    };

    // C6: Perceived familiarity (average)
    const avgFamiliarity = dataWithSectionC.reduce((sum, d) => 
      sum + ((d.C6_1 || 0) + (d.C6_2 || 0) + (d.C6_3 || 0)) / 3, 0) / dataWithSectionC.length;

    // C7: Internet stability
    const stableInternetUsers = Math.round((dataWithSectionC.filter(d => (d.C7 || 0) >= 4).length / dataWithSectionC.length) * 100);

    return {
      anyWearableUsage,
      anyAppUsage,
      healthCategories,
      avgFamiliarity: parseFloat(avgFamiliarity.toFixed(1)),
      stableInternetUsers,
      sampleSize: dataWithSectionC.length
    };
  };

  const calculateSocialEnvironmentStats = (data: HealthData[]) => {
    if (data.length === 0) return null;

    // Filter data that has Section D data
    const dataWithSectionD = data.filter(d => d.D1_1 !== undefined);
    
    if (dataWithSectionD.length === 0) return null;

    // D1: Health Consciousness (average of all 9 items)
    const avgHealthConsciousness = dataWithSectionD.reduce((sum, d) => 
      sum + ((d.D1_1 || 0) + (d.D1_2 || 0) + (d.D1_3 || 0) + (d.D1_4 || 0) + 
            (d.D1_5 || 0) + (d.D1_6 || 0) + (d.D1_7 || 0) + (d.D1_8 || 0) + (d.D1_9 || 0)) / 9, 0) / dataWithSectionD.length;

    // D2: Exercise Intention (average of 3 items)
    const avgExerciseIntention = dataWithSectionD.reduce((sum, d) => 
      sum + ((d.D2_1 || 0) + (d.D2_2 || 0) + (d.D2_3 || 0)) / 3, 0) / dataWithSectionD.length;

    // D4: Political Orientation
    const politicalScores = dataWithSectionD.map(d => d.D4 || 6).filter(score => score > 0);
    const avgPoliticalScore = politicalScores.length > 0 ? 
      politicalScores.reduce((sum, score) => sum + score, 0) / politicalScores.length : 6;

    // D8: Descriptive Social Norms
    const avgDescriptiveNorms = dataWithSectionD.reduce((sum, d) => 
      sum + ((d.D8_1 || 0) + (d.D8_2 || 0) + (d.D8_3 || 0)) / 3, 0) / dataWithSectionD.length;

    // D10: Government Support
    const avgGovSupport = dataWithSectionD.reduce((sum, d) => 
      sum + ((d.D10_1 || 0) + (d.D10_2 || 0) + (d.D10_3 || 0)) / 3, 0) / dataWithSectionD.length;

    return {
      avgHealthConsciousness: parseFloat(avgHealthConsciousness.toFixed(1)),
      avgExerciseIntention: parseFloat(avgExerciseIntention.toFixed(1)),
      avgPoliticalScore: parseFloat(avgPoliticalScore.toFixed(1)),
      avgDescriptiveNorms: parseFloat(avgDescriptiveNorms.toFixed(1)),
      avgGovSupport: parseFloat(avgGovSupport.toFixed(1)),
      sampleSize: dataWithSectionD.length
    };
  };

  // Calculate the stats
  const appsWearablesStats = calculateAppsWearablesStats(phData);
  const socialEnvironmentStats = calculateSocialEnvironmentStats(phData);

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
      {/* Header */}
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Philippines</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Digital Health Technology Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Understanding how technology is transforming healthcare experiences across Philippines's diverse population
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
                  <div className="text-4xl font-bold mb-2">{phData.length}</div>
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
                        Based on {phData.length} participants
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
                        Based on {phData.length} participants
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
                <h3 className="text-2xl font-bold mb-6 text-center">Philippines's Digital Health Journey</h3>
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
                
                {/* Gender Distribution Card */}
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

                {/* Age Insights Card */}
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
                            '18-24': phData.filter(d => d.A1 >= 18 && d.A1 <= 24).length,
                            '25-34': phData.filter(d => d.A1 >= 25 && d.A1 <= 34).length,
                            '35-44': phData.filter(d => d.A1 >= 35 && d.A1 <= 44).length,
                            '45-54': phData.filter(d => d.A1 >= 45 && d.A1 <= 54).length,
                            '55+': phData.filter(d => d.A1 >= 55).length
                          };
                          
                          return Object.entries(ageGroups).map(([group, count]) => (
                            <div key={group} className="flex justify-between">
                              <span>{group} years:</span>
                              <span className="font-bold ml-4">
                                {count} ({(count / phData.length * 100).toFixed(1)}%)
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Income - Now this will be the second row */}
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
                  <div className="text-3xl font-bold text-green-600 mb-2">PHP {medianIncome.toLocaleString()}</div>
                  <p className="text-gray-600">median monthly household income</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-90 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                    <div className="w-full space-y-1.5 max-h-56 overflow-y-auto">
                      <div className="text-white font-bold text-center mb-1 text-xs">Income Distribution</div>
                      {(() => {
                        const incomeBrackets = {
                          'Low (<PHP35K)': phData.filter(d => d.A5 <= 3).length,
                          'Middle (PHP35K-95K)': phData.filter(d => d.A5 >= 4 && d.A5 <= 9).length,
                          'Upper Middle (PHP100K-400K)': phData.filter(d => d.A5 >= 10 && d.A5 <= 13).length,
                          'High (>PHP500K)': phData.filter(d => d.A5 >= 14).length
                        };
                        
                        return Object.entries(incomeBrackets).map(([bracket, count]) => (
                          <div key={bracket} className="flex items-center justify-between text-white text-xs">
                            <span className="font-medium w-28 text-left">{bracket}</span>
                            <div className="flex-1 mx-1.5">
                              <div className="bg-gray-600 rounded-full h-1">
                                <div 
                                  className="bg-green-400 h-1 rounded-full" 
                                  style={{ width: `${(count / phData.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="font-bold w-10 text-right">
                              {((count / phData.length) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ));
                      })()}
                      
                      <div className="border-t border-gray-600 pt-1 mt-1 text-[10px] text-gray-300">
                        <div className="flex justify-between">
                          <span>Highest Group:</span>
                          <span className="font-bold">
                            {(() => {
                              const maxIncomeCode = Math.max(...phData.map(d => d.A5));
                              const maxGroups = phData.filter(d => d.A5 === maxIncomeCode).length;
                              return `${maxGroups} users`;
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span>Range:</span>
                          <span className="font-bold">
                            {Math.min(...phData.map(d => d.A5))}-{Math.max(...phData.map(d => d.A5))}/15
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
                  <div className="text-4xl font-bold mb-2">{calculateTechUsageStats(phData).dailyAppUsers}%</div>
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
                        Survey sample: {phData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-2xl text-center 
                transition-all duration-300 hover:from-purple-600 hover:to-pink-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Watch className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{calculateTechUsageStats(phData).wearableOwners}%</div>
                  <div className="text-purple-100 font-medium mb-2">Own Wearable Devices</div>
                  <div className="text-sm text-purple-200">Growing {Math.round(calculateTechUsageStats(phData).wearableOwners / 3)}% annually</div>
                  
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
                        Survey sample: {phData.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-8 rounded-2xl text-center 
                transition-all duration-300 hover:from-green-600 hover:to-teal-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Zap className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">{formatHoursAndMinutes(calculateTechUsageStats(phData).avgDailyUsage)}</div>
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
                        Survey sample: {phData.length} participants
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
                      <div>Regular Activity: {Math.round((phData.filter(d => d.B4 >= 3).length / phData.length) * 100)}%</div>
                      <div>Nutrition Aware: {Math.round((phData.filter(d => d.B6 >= 4).length / phData.length) * 100)}%</div>
                      <div>Health Conscious: {Math.round((phData.filter(d => d.B3 >= 4).length / phData.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-purple-600">🧘</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Wellness Focus</div>
                    <div className="text-gray-600 text-sm mb-2">Mental Health</div>
                    <div className="space-y-1 text-xs">
                      <div>High Emotional: {Math.round((phData.filter(d => (d.B11_1 + d.B11_2 + d.B11_3) / 3 >= 4).length / phData.length) * 100)}%</div>
                      <div>High Psychological: {Math.round((phData.filter(d => (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6 >= 4).length / phData.length) * 100)}%</div>
                      <div>High Social: {Math.round((phData.filter(d => (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5 >= 4).length / phData.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-green-600">⚡</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Active Lifestyle</div>
                    <div className="text-gray-600 text-sm mb-2">Physical Health</div>
                    <div className="space-y-1 text-xs">
                      <div>Excellent Health: {Math.round((phData.filter(d => d.B3 === 5).length / phData.length) * 100)}%</div>
                      <div>Good Health: {Math.round((phData.filter(d => d.B3 === 4).length / phData.length) * 100)}%</div>
                      <div>Fair Health: {Math.round((phData.filter(d => d.B3 === 3).length / phData.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-orange-600">🛡️</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Preventive Care</div>
                    <div className="text-gray-600 text-sm mb-2">Health Management</div>
                    <div className="space-y-1 text-xs">
                      <div>No Conditions: {Math.round((phData.filter(d => d.B10_9 === 1).length / phData.length) * 100)}%</div>
                      <div>Non-smokers: {Math.round((phData.filter(d => d.B8 === 1).length / phData.length) * 100)}%</div>
                      <div>Low Alcohol: {Math.round((phData.filter(d => d.B7 <= 2).length / phData.length) * 100)}%</div>
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
                  <div className="text-3xl font-bold mb-1">{((phData.reduce((sum, d) => {
                    const emotional = (d.B11_1 + d.B11_2 + d.B11_3) / 3;
                    const psychological = (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6;
                    const social = (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5;
                    return sum + (emotional + psychological + social) / 3;
                  }, 0) / phData.length) / 6 * 100).toFixed(1)}%</div>
                  <div className="text-blue-100 font-medium">Mental Wellbeing Score</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl text-center">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">
                    {Math.round((phData.filter(d => d.B4 >= 3).length / phData.length) * 100)}%
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
                            phData.reduce((sum, d) => sum + (d.B11_1 + d.B11_2 + d.B11_3) / 3, 0) / phData.length,
                            6
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(phData.reduce((sum, d) => sum + (d.B11_1 + d.B11_2 + d.B11_3) / 3, 0) / phData.length / 6) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-900">Psychological Health</span>
                        <span className="text-2xl font-bold text-green-600">
                          {convertToPercentage(
                            phData.reduce((sum, d) => sum + (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6, 0) / phData.length,
                            6
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(phData.reduce((sum, d) => sum + (d.B11_4 + d.B11_9 + d.B11_10 + d.B11_12 + d.B11_13 + d.B11_14) / 6, 0) / phData.length / 6) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-purple-900">Social Health</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {convertToPercentage(
                            phData.reduce((sum, d) => sum + (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5, 0) / phData.length,
                            6
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(phData.reduce((sum, d) => sum + (d.B11_5 + d.B11_6 + d.B11_7 + d.B11_8 + d.B11_11) / 5, 0) / phData.length / 6) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apps_wearables' && (
            <div className="space-y-8">
              {/* Apps & Wearables Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Apps Card with Hover */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {appsWearablesStats ? appsWearablesStats.anyAppUsage : 0}%
                  </div>
                  <div className="text-blue-100 font-medium">Use Health Apps</div>
                  <div className="text-blue-200 text-sm mt-2">
                    {appsWearablesStats ? appsWearablesStats.sampleSize : 0} participants
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Health App Usage</div>
                      <div className="text-white text-sm">
                        Percentage of participants who use at least one health app
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Based on 22 different health app categories
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Survey sample: {appsWearablesStats ? appsWearablesStats.sampleSize : 0} participants
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wearables Card with Hover */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-purple-600 hover:to-pink-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Watch className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {appsWearablesStats ? appsWearablesStats.anyWearableUsage : 0}%
                  </div>
                  <div className="text-purple-100 font-medium">Use Wearables</div>
                  <div className="text-purple-200 text-sm mt-2">
                    Various brands & types
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Wearable Device Usage</div>
                      <div className="text-white text-sm">
                        Percentage of participants who use at least one wearable device
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Includes smartwatches, fitness trackers, and health bands
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Survey sample: {appsWearablesStats ? appsWearablesStats.sampleSize : 0} participants
                      </div>
                    </div>
                  </div>
                </div>

                {/* Internet Stability Card with Hover */}
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-green-600 hover:to-teal-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {appsWearablesStats ? appsWearablesStats.stableInternetUsers : 0}%
                  </div>
                  <div className="text-green-100 font-medium">Stable Internet</div>
                  <div className="text-green-200 text-sm mt-2">
                    Reliable connectivity
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Internet Stability</div>
                      <div className="text-white text-sm">
                        Percentage of participants with stable internet access (rated 4-5 out of 5)
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Scale: 1 (Not stable at all) to 5 (Extremely stable)
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Survey sample: {appsWearablesStats ? appsWearablesStats.sampleSize : 0} participants
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rest of the Apps & Wearables content remains the same */}
              {/* Health Categories Usage */}
              {appsWearablesStats && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-xl font-bold mb-4">Health Categories Used</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(appsWearablesStats.healthCategories).map(([category, percentage]) => (
                      <div key={category} className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{percentage}%</div>
                        <div className="text-sm text-gray-600 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technology Familiarity */}
              {appsWearablesStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h4 className="text-xl font-bold mb-4">Technology Familiarity</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {appsWearablesStats.avgFamiliarity}/5
                      </div>
                      <p className="text-gray-600">Average familiarity score</p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-500 h-4 rounded-full" 
                            style={{ width: `${(appsWearablesStats.avgFamiliarity / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h4 className="text-xl font-bold mb-4">Digital Infrastructure</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Internet Stability</span>
                          <span className="font-bold text-green-600">{appsWearablesStats.stableInternetUsers}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${appsWearablesStats.stableInternetUsers}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Health App Adoption</span>
                          <span className="font-bold text-blue-600">{appsWearablesStats.anyAppUsage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${appsWearablesStats.anyAppUsage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social_environment' && (
            <div className="space-y-8">
              {/* Social Environment Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Consciousness Card with Hover */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-orange-600 hover:to-red-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {socialEnvironmentStats ? convertToPercentage(socialEnvironmentStats.avgHealthConsciousness, 5) : '0%'}
                  </div>
                  <div className="text-orange-100 font-medium">Health Conscious</div>
                  <div className="text-orange-200 text-sm mt-2">
                    Self-awareness score
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Health Consciousness</div>
                      <div className="text-white text-sm">
                        Average score on health awareness and self-monitoring (9-item scale)
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Scale: 1 (Does not describe me) to 5 (Describes me very well)
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Measures health self-consciousness, alertness, and involvement
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise Intention Card with Hover */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-green-600 hover:to-emerald-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {socialEnvironmentStats ? convertToPercentage(socialEnvironmentStats.avgExerciseIntention,7) : '0%'}
                  </div>
                  <div className="text-green-100 font-medium">Exercise Intent</div>
                  <div className="text-green-200 text-sm mt-2">
                    Motivation level
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Exercise Intention</div>
                      <div className="text-white text-sm">
                        Average intention to exercise regularly over the next 2 weeks
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Scale: 1 (Strongly Disagree) to 7 (Strongly Agree)
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Based on 3-item exercise intention scale
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Support Card with Hover */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-blue-600 hover:to-cyan-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {socialEnvironmentStats ? convertToPercentage(socialEnvironmentStats.avgGovSupport,7) : '0%'}
                  </div>
                  <div className="text-blue-100 font-medium">Gov Support</div>
                  <div className="text-blue-200 text-sm mt-2">
                    Policy perception
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-85 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                    <div className="text-center space-y-3">
                      <div className="text-white font-bold text-lg mb-2">Government Support Perception</div>
                      <div className="text-white text-sm">
                        Average perception of government support for digital health adoption
                      </div>
                      <div className="text-white text-xs opacity-90">
                        Scale: 1 (Strongly Disagree) to 7 (Strongly Agree)
                      </div>
                      <div className="text-white text-xs opacity-80 mt-2">
                        Based on 3-item government support scale
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Political Orientation & Social Norms */}
              {socialEnvironmentStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h4 className="text-xl font-bold mb-4">Political Orientation</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {socialEnvironmentStats.avgPoliticalScore}/11
                      </div>
                      <p className="text-gray-600">Average political score</p>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-bold text-blue-600">1-4</div>
                          <div className="text-gray-600">Liberal</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="font-bold text-purple-600">5-7</div>
                          <div className="text-gray-600">Moderate</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="font-bold text-red-600">8-11</div>
                          <div className="text-gray-600">Conservative</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h4 className="text-xl font-bold mb-4">Social Norms</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Peer Influence</span>
                          <span className="font-bold text-green-600">
                            {socialEnvironmentStats.avgDescriptiveNorms}/7
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(socialEnvironmentStats.avgDescriptiveNorms / 7) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Health Consciousness</span>
                          <span className="font-bold text-orange-600">
                            {socialEnvironmentStats.avgHealthConsciousness}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(socialEnvironmentStats.avgHealthConsciousness / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Exercise Motivation</span>
                          <span className="font-bold text-blue-600">
                            {socialEnvironmentStats.avgExerciseIntention}/7
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(socialEnvironmentStats.avgExerciseIntention / 7) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Government Support */}
              {socialEnvironmentStats && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-xl font-bold mb-4">Government Support Perception</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {socialEnvironmentStats.avgGovSupport}/7
                    </div>
                    <p className="text-gray-600">Average perception of government support for digital health</p>
                    <div className="mt-6">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-green-500 h-4 rounded-full" 
                          style={{ width: `${(socialEnvironmentStats.avgGovSupport / 7) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Low Support</span>
                        <span>High Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-8 rounded-2xl">
        <h3 className="text-3xl font-bold mb-6 text-center">Philippines: Leading the Digital Health Revolution</h3>
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