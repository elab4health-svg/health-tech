import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { processedHKData, calculateBMI, calculateMentalHealthScores, getDistrictName } from '../../data/hkData';
import { FlagImage } from './flagImage';
import { HKHealthData } from '../../data/hkData';
import { processedHKCDData, calculateDementiaKnowledgeScore, calculateTrustInAI, calculateTechnologyAnxiety, calculateIntentionToUse, getHealthWearablesUsed, getHealthAppsUsed } from '../../data/hk2Data';
import { Users, Heart, Brain, TrendingUp, AlertCircle, Bed, Clock, Award, MapPin, HeartPulse, GraduationCap, X, DollarSign, Activity, Moon, FolderHeart as UserHeart, Building2, Stethoscope, Target, BarChart3, Smartphone, Bot, Eye, Shield, Search, Zap } from 'lucide-react';

export const HongKongAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'health' | 'mental' | 'sleep' | 'dementia' | 'ai-tech'>('overview');
  const [isChronicConditionsModalOpen, setIsChronicConditionsModalOpen] = useState(false);

  const hkData = processedHKData;
  const hkCDData = processedHKCDData;

  // Calculate key metrics for original data
  const avgAge = Math.round(hkData.reduce((sum, d) => sum + d.Age, 0) / hkData.length);
  const excellentHealthPercent = Math.round((hkData.filter(d => d.GeneralHealth === 5 || d.GeneralHealth === 4 || d.GeneralHealth === 3).length / hkData.length) * 100);
  const avgMentalHealth = (hkData.reduce((sum, d) => {
    const scores = calculateMentalHealthScores(d);
    return sum + (scores.emotional + scores.social + scores.psychological) / 3;
  }, 0) / hkData.length);
  
  const avgBMI = (hkData.reduce((sum, d) => sum + calculateBMI(d.Weight, d.Height), 0) / hkData.length).toFixed(1);
  const goodSleepPercent = Math.round((hkData.filter(d => d.SleepQuality <= 2).length / hkData.length) * 100);

  // Calculate key metrics for dementia & AI data
  const avgDementiaKnowledge = (hkCDData.reduce((sum, d) => sum + calculateDementiaKnowledgeScore(d), 0) / hkCDData.length).toFixed(1);
  const avgTrustInAI = (hkCDData.reduce((sum, d) => sum + calculateTrustInAI(d), 0) / hkCDData.length);
  const techAnxietyPercent = Math.round((hkCDData.filter(d => calculateTechnologyAnxiety(d) >= 4).length / hkCDData.length) * 100);
  const highIntentionToUse = Math.round((hkCDData.filter(d => calculateIntentionToUse(d) >= 5).length / hkCDData.length) * 100);

  // Demographics data
  const genderLabels = { 1: 'Male', 2: 'Female', 3: 'Others' };
  const regionLabels = { 1: 'Hong Kong Island', 2: 'Kowloon', 3: 'New Territories' };
  const educationLabels = {
    1: 'Middle School',
    2: 'High School', 
    3: 'Foundation Diploma',
    4: 'Higher Diploma',
    5: "Bachelor's",
    6: "Master's",
    7: 'Doctoral'
  };
  
  const genderData = Object.entries(genderLabels).map(([code, label]) => ({
    name: label,
    value: hkData.filter(d => d.Gender === parseInt(code)).length,
    percentage: Math.round((hkData.filter(d => d.Gender === parseInt(code)).length / hkData.length) * 100)
  }));

  const regionData = Object.entries(regionLabels).map(([code, label]) => ({
    name: label,
    value: hkData.filter(d => d.Region === parseInt(code)).length,
    percentage: Math.round((hkData.filter(d => d.Region === parseInt(code)).length / hkData.length) * 100)
  }));

  const educationData = Object.entries(educationLabels).map(([code, label]) => ({
    name: label,
    value: hkData.filter(d => d.Education === parseInt(code)).length,
    percentage: Math.round((hkData.filter(d => d.Education === parseInt(code)).length / hkData.length) * 100)
  }));

  // Income analysis
  const highIncomeUsers = hkData.filter(d => d.Income >= 6).length; // Above HKD 50,000
  const highIncomePercent = Math.round((highIncomeUsers / hkData.length) * 100);

  // Health analysis
  const healthDistribution = [
    { name: 'Excellent', value: hkData.filter(d => d.GeneralHealth === 5).length, color: '#10b981' },
    { name: 'Very Good', value: hkData.filter(d => d.GeneralHealth === 4).length, color: '#3b82f6' },
    { name: 'Good', value: hkData.filter(d => d.GeneralHealth === 3).length, color: '#f59e0b' },
    { name: 'Fair', value: hkData.filter(d => d.GeneralHealth === 2).length, color: '#f97316' },
    { name: 'Poor', value: hkData.filter(d => d.GeneralHealth === 1).length, color: '#ef4444' }
  ];

  // Mental health by age groups
  const ageGroups = [
    { range: '18-29', data: hkData.filter(d => d.Age >= 18 && d.Age <= 29) },
    { range: '30-39', data: hkData.filter(d => d.Age >= 30 && d.Age <= 39) },
    { range: '40-49', data: hkData.filter(d => d.Age >= 40 && d.Age <= 49) },
    { range: '50-59', data: hkData.filter(d => d.Age >= 50 && d.Age <= 59) },
    { range: '60+', data: hkData.filter(d => d.Age >= 60) }
  ];

  const mentalHealthByAge = ageGroups.map(group => ({
    age: group.range,
    emotional: group.data.reduce((sum, d) => sum + calculateMentalHealthScores(d).emotional, 0) / group.data.length,
    social: group.data.reduce((sum, d) => sum + calculateMentalHealthScores(d).social, 0) / group.data.length,
    psychological: group.data.reduce((sum, d) => sum + calculateMentalHealthScores(d).psychological, 0) / group.data.length
  }));

  // Dementia data analysis
  const dementiaExperienceData = [
    { name: 'No Experience', value: hkCDData.filter(d => d.C1 === 1).length, color: '#10b981' },
    { name: 'Has Experience', value: hkCDData.filter(d => d.C1 === 2).length, color: '#3b82f6' }
  ];

  const relationshipData = hkCDData.filter(d => d.C1 === 2).reduce((acc, d) => {
    const relationships = {
      1: 'Partner/Spouse',
      2: 'Friend', 
      3: 'Parent',
      4: 'Other'
    };
    const rel = relationships[d.C2 as keyof typeof relationships];
    if (rel) {
      acc[rel] = (acc[rel] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const relationshipChartData = Object.entries(relationshipData).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / hkCDData.filter(d => d.C1 === 2).length) * 100)
  }));

  // AI Technology usage data
  const wearableUsageData = [
    { name: 'Apple Watch', users: hkCDData.filter(d => d.D1_1 === 1).length },
    { name: 'Samsung Watch', users: hkCDData.filter(d => d.D1_2 === 1).length },
    { name: 'Huawei Watch', users: hkCDData.filter(d => d.D1_3 === 1).length },
    { name: 'Fitbit Watch', users: hkCDData.filter(d => d.D1_4 === 1).length },
    { name: 'Fitbit Tracker', users: hkCDData.filter(d => d.D1_5 === 1).length },
    { name: 'Mi Smart Band', users: hkCDData.filter(d => d.D1_6 === 1).length },
    { name: 'Huawei Band', users: hkCDData.filter(d => d.D1_10 === 1).length }
  ].filter(item => item.users > 0).sort((a, b) => b.users - a.users);

  const healthAppUsageData = [
    { name: 'Apple Health', users: hkCDData.filter(d => d.D3_1 === 1).length },
    { name: 'Google Fit', users: hkCDData.filter(d => d.D3_2 === 1).length },
    { name: 'Samsung Health', users: hkCDData.filter(d => d.D3_6 === 1).length },
    { name: 'Huawei Health', users: hkCDData.filter(d => d.D3_7 === 1).length },
    { name: 'Strava', users: hkCDData.filter(d => d.D3_3 === 1).length },
    { name: 'MyFitnessPal', users: hkCDData.filter(d => d.D3_4 === 1).length }
  ].filter(item => item.users > 0).sort((a, b) => b.users - a.users);

  // AI trust vs technology anxiety radar data
  const aiPerceptionData = [
    {
      metric: 'Trust in AI',
      score: avgTrustInAI,
      fullMark: 7
    },
    {
      metric: 'AI Accuracy',
      score: hkCDData.reduce((sum, d) => sum + ((d.D12_1 + d.D12_2 + d.D12_3) / 3), 0) / hkCDData.length,
      fullMark: 7
    },
    {
      metric: 'Data Ownership',
      score: hkCDData.reduce((sum, d) => sum + ((d.D10_1 + d.D10_2 + d.D10_3 + d.D10_4 + d.D10_5) / 5), 0) / hkCDData.length,
      fullMark: 7
    },
    {
      metric: 'Tech Anxiety (Inverted)',
      score: 7 - (hkCDData.reduce((sum, d) => sum + calculateTechnologyAnxiety(d), 0) / hkCDData.length),
      fullMark: 7
    },
    {
      metric: 'Privacy Concern (Inverted)',
      score: 7 - (hkCDData.reduce((sum, d) => sum + ((d.D14_1 + d.D14_2 + d.D14_3) / 3), 0) / hkCDData.length),
      fullMark: 7
    },
    {
      metric: 'AI Optimism',
      score: hkCDData.reduce((sum, d) => sum + ((d.D15_1 + d.D15_2 + d.D15_3 + d.D15_4) / 4), 0) / hkCDData.length,
      fullMark: 7
    }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'health', label: 'Physical Health', icon: Heart },
    { id: 'mental', label: 'Mental Health', icon: Brain },
    { id: 'sleep', label: 'Sleep & Lifestyle', icon: Moon },
    { id: 'dementia', label: 'Dementia Awareness', icon: Search },
    { id: 'ai-tech', label: 'AI & Technology', icon: Bot }
  ];

  const calculateAverageEducation = (data: HKHealthData[]): number => {
    return data.reduce((sum, d) => sum + d.Education, 0) / data.length;
  };

  const calculateMedianIncome = (data: HKHealthData[]): number => {
    const incomeMap = {
      1: 5000,   // Below 10,000
      2: 15000,  // 10,001-20,000
      3: 25000,  // 20,001-30,000
      4: 35000,  // 30,001-40,000
      5: 45000,  // 40,001-50,000
      6: 55000,  // 50,001-60,000
      7: 65000   // Above 60,000
    };
    
    return data.reduce((sum, d) => sum + (incomeMap[d.Income as keyof typeof incomeMap] || 0), 0) / data.length;
  };

  const calculateAverageSocialLadder = (data: HKHealthData[]): number => {
    return data.reduce((sum, d) => sum + d.Ladder, 0) / data.length;
  };

  const getEducationLevelDescription = (avgEducation: number): string => {
    if (avgEducation >= 5) return "Bachelor's & Above";
    if (avgEducation >= 4) return "Higher Diploma & Above";
    if (avgEducation >= 3) return "Foundation Diploma & Above";
    return "High School & Below";
  };

  const getSocialLadderDescription = (avgLadder: number): string => {
    if (avgLadder >= 8) return "High perceived status";
    if (avgLadder >= 6) return "Upper-middle status";
    if (avgLadder >= 4) return "Middle status";
    return "Lower-middle status";
  };

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
    <div className="space-y-8 bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl">
      {/* Header */}
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FlagImage code='hk' size='xxl'/>
          <h1 className="text-4xl font-bold text-gray-900">香港 Hong Kong</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Comprehensive Health, Dementia & AI Technology Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Understanding health patterns, dementia awareness, AI technology adoption, and wellbeing indicators across Hong Kong's diverse population
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-7">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 py-6 px-4 font-semibold transition-all duration-300 text-sm lg:text-base ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-red-600 to-orange-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Hero Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Health Survey - No hover */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{hkData.length}</div>
                  <div className="text-blue-100 font-medium text-sm">Health Survey</div>
                </div>
                
                {/* Excellent Health - With hover */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-green-600 hover:to-green-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{excellentHealthPercent}%</div>
                  <div className="text-green-100 font-medium text-sm">Excellent Health</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2">
                      Based on General Health question:<br/>
                      1. Poor<br/>2. Fair<br/>3. Good<br/>4. Very Good<br/>5. Excellent<br/>
                      Shows % reporting Good, Very Good or Excellent health
                    </span>
                  </div>
                </div>
                
                {/* Mental Wellbeing - With hover */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-purple-600 hover:to-purple-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{convertToPercentage(avgMentalHealth,6)}</div>
                  <div className="text-purple-100 font-medium text-sm">Mental Wellbeing</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2">
                      Based on B10 questions:<br/>
                      1. Never<br/>2. Once or Twice in a month<br/>3. About once a week<br/>
                      4. About 2 or 3 times a week<br/>5. Almost every day<br/>6. Every day
                    </span>
                  </div>
                </div>
                
                {/* Good Sleep - With hover */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-indigo-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Moon className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{goodSleepPercent}%</div>
                  <div className="text-indigo-100 font-medium text-sm">Good Sleep</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2">
                      Based on Sleep Quality (B16):<br/>
                      1. Very Good<br/>2. Good<br/>3. Poor<br/>4. Very Poor<br/>
                      Shows % reporting Very Good or Good sleep quality
                    </span>
                  </div>
                </div>
                
                {/* Dementia Knowledge - With hover */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-orange-600 hover:to-orange-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{avgDementiaKnowledge}%</div>
                  <div className="text-orange-100 font-medium text-sm">Dementia Knowledge</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2">
                      Based on dementia knowledge assessment:<br/>
                      Correct answers to questions about dementia<br/>
                      causes, symptoms, and communication
                    </span>
                  </div>
                </div>
                
                {/* AI Trust Score - With hover */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl text-center 
                transition-all duration-300 hover:from-teal-600 hover:to-teal-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{convertToPercentage(avgTrustInAI,7)}</div>
                  <div className="text-teal-100 font-medium text-sm">AI Trust Score</div>

                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2">
                      1. Strongly Disagree<br/>2. Disagree<br/>3. Somewhat Disagree<br/>
                      4. Neutral<br/>5. Somewhat Agree<br/>6. Agree<br/>7. Strongly Agree
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Insights - Add hovers to these as well */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Urban Health - With hover */}
                <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-sm
                transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-8 h-8 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900">Urban Health</h3>
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">{avgAge} years</div>
                  <p className="text-gray-600">average age with {excellentHealthPercent}% excellent health</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-white text-center">
                      Average age calculated from A2 question<br/>
                      Health status from General Health (B3)<br/>
                      Shows urban population health dynamics
                    </span>
                  </div>
                </div>

                {/* High Income - With hover */}
                <div className="bg-white border-l-4 border-green-500 p-6 rounded-lg shadow-sm
                transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-green-500" />
                    <h3 className="text-xl font-bold text-gray-900">High Income</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{highIncomePercent}%</div>
                  <p className="text-gray-600">earn above HKD 50,000 monthly</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-white text-center">
                      Based on A4 monthly household income:<br/>
                      6. HKD 50,001-60,000<br/>7. Above HKD 60,000<br/>
                      Shows socioeconomic status distribution
                    </span>
                  </div>
                </div>

                {/* Dementia Aware - With hover */}
                <div className="bg-white border-l-4 border-purple-500 p-6 rounded-lg shadow-sm
                transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="w-8 h-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900">Dementia Aware</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round((hkCDData.filter(d => d.C1 === 2).length / hkCDData.length) * 100)}%</div>
                  <p className="text-gray-600">have dementia experience</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-white text-center">
                      Based on C1 question:<br/>
                      1. No dementia experience<br/>2. Has dementia experience<br/>
                      Personal or family experience with dementia
                    </span>
                  </div>
                </div>

                {/* AI Adoption - With hover */}
                <div className="bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow-sm
                transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="w-8 h-8 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">AI Adoption</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{highIntentionToUse}%</div>
                  <p className="text-gray-600">high intention to use AI health tech</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-white text-center">
                      Based on intention to use AI health technology<br/>
                      Measured on 7-point scale<br/>
                      Shows % with high adoption likelihood (≥5)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demographics' && (
            <div className="space-y-8">
              {/* Population Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gender Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Population by Gender</h4>
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {genderData.map((entry, index) => (
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

                {/* Regional Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Population by Region</h4>
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={regionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {regionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index + 3]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {regionData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index + 3] }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{entry.name}</div>
                            <div className="text-2xl font-bold" style={{ color: COLORS[index + 3] }}>
                              {entry.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Distribution */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Education Level Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={educationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value} people`, 'Count']} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Socioeconomic Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">
                    {convertToPercentage(calculateAverageEducation(hkData), 7)}
                  </div>
                  <div className="text-blue-100 font-medium mb-2">Average Education Level</div>
                  <div className="text-sm text-blue-200">
                    {getEducationLevelDescription(calculateAverageEducation(hkData))}
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Education levels:<br/>
                      1. Middle school or below<br/>
                      2. High school<br/>
                      3. Foundation diploma<br/>
                      4. Higher diploma<br/>
                      5. Bachelor's degree<br/>
                      6. Master's degree<br/>
                      7. Doctoral degree
                    </span>
                  </div>
                </div>
                
                {/* Median Income - With hover */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-green-600 hover:to-emerald-700 
                hover:shadow-lg cursor-pointer group relative">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">
                    HKD {Math.round(calculateMedianIncome(hkData) / 1000)}k
                  </div>
                  <div className="text-green-100 font-medium mb-2">Median Income</div>
                  <div className="text-sm text-green-200">Monthly household income</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Monthly household income brackets:<br/>
                      Below HKD 10,000<br/>
                      HKD 10,001-20,000<br/>
                      HKD 20,001-30,000<br/>
                      HKD 30,001-40,000<br/>
                      HKD 40,001-50,000<br/>
                      HKD 50,001-60,000<br/>
                      Above HKD 60,000
                    </span>
                  </div>
                </div>
                
                {/* Social Ladder - With hover */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-purple-600 hover:to-pink-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl font-bold mb-2">
                    {convertToPercentage(calculateAverageSocialLadder(hkData), 10)}
                  </div>
                  <div className="text-purple-100 font-medium mb-2">Social Ladder</div>
                  <div className="text-sm text-purple-200">
                    {getSocialLadderDescription(calculateAverageSocialLadder(hkData))}
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Self-perceived social standing:<br/>
                      1st layer: Lowest standing in community<br/>
                      5th layer: Middle standing<br/>
                      10th layer: Highest standing in community<br/>
                      Where people place themselves relative to others
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-8">
              {/* Physical Health Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Overall Health Status</h4>
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={healthDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {healthDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {healthDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{entry.name}</div>
                            <div className="text-2xl font-bold" style={{ color: entry.color }}>
                              {Math.round((entry.value / hkData.length) * 100)}%
                            </div>
                            <div className="text-sm text-gray-500">{entry.value} responses</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* BMI Analysis */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-2xl
                  transition-all duration-300 hover:from-orange-600 hover:to-red-600 
                  hover:shadow-lg cursor-pointer group relative">
                    <h4 className="text-xl font-bold mb-4">BMI Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{avgBMI}</div>
                        <div className="text-orange-100">Average BMI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{
                          Math.round((hkData.filter(d => {
                            const bmi = calculateBMI(d.Weight, d.Height);
                            return bmi >= 18.5 && bmi < 25;
                          }).length / hkData.length) * 100)
                        }%</div>
                        <div className="text-orange-100">Healthy Weight</div>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[13px] font-small p-2 text-center">
                        Body Mass Index categories:<br/>
                        Underweight: Below 18.5<br/>
                        Healthy weight: 18.5 - 24.9<br/>
                        Overweight: 25 - 29.9<br/>
                        Obesity: 30 and above<br/>
                        Based on self-reported height and weight
                      </span>
                    </div>
                  </div>

                  {/* Physical Activity */}
                  <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 rounded-2xl
                  transition-all duration-300 hover:from-green-600 hover:to-teal-600 
                  hover:shadow-lg cursor-pointer group relative">
                    <h4 className="text-xl font-bold mb-4">Physical Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Regular Exercise (3+ times/week)</span>
                        <span className="font-bold">{
                          Math.round((hkData.filter(d => d.physicalActivity >= 3).length / hkData.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adequate Fruit & Vegetable Intake</span>
                        <span className="font-bold">{
                          Math.round((hkData.filter(d => d['Fruits&Veg'] >= 5).length / hkData.length) * 100)
                        }%</span>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-small p-2 text-center">
                        Physical activity frequency:<br/>
                        Less than once per week<br/>
                        1 to 2 times per week<br/>
                        3 to 4 times per week<br/>
                        5 to 6 times per week<br/>
                        More than 6 times per week<br/><br/>
                        Fruit & vegetable servings:<br/>
                        5 or more servings daily considered adequate
                      </span>
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-2xl">
                    <h4 className="text-xl font-bold mb-4">Chronic Conditions</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold mb-1">{
                        Math.round((hkData.filter(d => d.B9_11 === 1).length / hkData.length) * 100)
                      }%</div>
                      <div className="text-blue-100">Report No Chronic Conditions</div>
                    </div>
                    <button 
                      onClick={() => setIsChronicConditionsModalOpen(true)}
                      className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Health Behaviors */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Health Behaviors & Lifestyle</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Regular Exercise - With hover */}
                  <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer group relative">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <Activity className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">{
                      Math.round((hkData.filter(d => d.physicalActivity >= 3).length / hkData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Regular Exercise</div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-[13px] font-small p-2 text-white text-center">
                        Regular exercise: 3+ times per week<br/>
                        Includes activities like running,<br/>
                        gym workouts, sports, or walking<br/>
                        for exercise purposes
                      </span>
                    </div>
                  </div>
                  
                  {/* Adequate Nutrition - With hover */}
                  <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer group relative">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                      <div className="text-2xl font-bold text-orange-600">🥬</div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">{
                      Math.round((hkData.filter(d => d['Fruits&Veg'] >= 4).length / hkData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Adequate Nutrition</div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-[13px] font-small p-2 text-white text-center">
                        Adequate nutrition: 4+ servings daily<br/>
                        One serving = medium fruit or<br/>
                        bowl of leafy vegetables<br/>
                        Meets recommended daily intake
                      </span>
                    </div>
                  </div>
                  
                  {/* Never Smokers - With hover */}
                  <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer group relative">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <div className="text-2xl font-bold text-red-600">🚭</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">{
                      Math.round((hkData.filter(d => d.Smoking100Cigs === 1).length / hkData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Never Smokers</div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-[13px] font-small p-2 text-white text-center">
                        Never smoked 100 cigarettes<br/>
                        in their entire life<br/>
                        Includes complete non-smokers<br/>
                        and those with minimal exposure
                      </span>
                    </div>
                  </div>
                  
                  {/* Low Alcohol Use - With hover */}
                  <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer group relative">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <div className="text-2xl font-bold text-blue-600">🍷</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{
                      Math.round((hkData.filter(d => d.AlcoholicDrink <= 2).length / hkData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Low Alcohol Use</div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-[13px] font-small p-2 text-white text-center">
                        Low alcohol use: 1-2 days per week<br/>
                        or less<br/>
                        Includes beer, wine, malt beverages,<br/>
                        or liquor consumption
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mental' && (
            <div className="space-y-8">
              {/* Mental Health Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-blue-600 hover:to-cyan-700 
                hover:shadow-lg cursor-pointer group relative">
                  <UserHeart className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {convertToPercentage(
                      hkData.reduce((sum, d) => sum + calculateMentalHealthScores(d).emotional, 0) / hkData.length,
                      6
                    )}
                  </div>
                  <div className="text-blue-100 font-medium">Emotional Wellbeing</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Measures frequency of:<br/>
                      Feeling happy<br/>
                      Feeling interested in life<br/>
                      Feeling satisfied with life<br/>
                      Based on daily emotional experiences
                    </span>
                  </div>
                </div>
                
                {/* Social Wellbeing - With hover */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-green-600 hover:to-emerald-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {convertToPercentage(
                      hkData.reduce((sum, d) => sum + calculateMentalHealthScores(d).social, 0) / hkData.length,
                      6
                    )}
                  </div>
                  <div className="text-green-100 font-medium">Social Wellbeing</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Measures sense of:<br/>
                      Contribution to society<br/>
                      Community belonging<br/>
                      Trust in social systems<br/>
                      Belief in societal goodness
                    </span>
                  </div>
                </div>
                
                {/* Psychological Wellbeing - With hover */}
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-purple-600 hover:to-violet-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">
                    {convertToPercentage(
                      hkData.reduce((sum, d) => sum + calculateMentalHealthScores(d).psychological, 0) / hkData.length,
                      6
                    )}
                  </div>
                  <div className="text-purple-100 font-medium">Psychological Wellbeing</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Measures aspects of:<br/>
                      Self-acceptance and personality<br/>
                      Daily life management<br/>
                      Personal relationships<br/>
                      Growth experiences and confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Mental Health by Age Group */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Mental Wellbeing by Age Group</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mentalHealthByAge}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis domain={[3, 6]} />
                    <Tooltip 
                      formatter={(value: number) => value.toFixed(3)}
                    />
                    <Line type="monotone" dataKey="emotional" stroke="#3b82f6" strokeWidth={3} name="Emotional" />
                    <Line type="monotone" dataKey="social" stroke="#10b981" strokeWidth={3} name="Social" />
                    <Line type="monotone" dataKey="psychological" stroke="#8b5cf6" strokeWidth={3} name="Psychological" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Loneliness Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Loneliness Indicators - With hover */}
                <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white p-6 rounded-2xl
                transition-all duration-300 hover:from-red-600 hover:to-pink-600 
                hover:shadow-lg cursor-pointer group relative">
                  <h4 className="text-xl font-bold mb-4">Loneliness Indicators</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Lack of Companionship</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d.Loneliness >= 3).length / hkData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feel Left Out</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d.Ignored >= 3).length / hkData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feel Isolated</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d.Isolated >= 3).length / hkData.length) * 100)
                      }%</span>
                    </div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Loneliness scale measures:<br/>
                      How often people feel:<br/>
                      • Lack of companionship<br/>
                      • Left out or ignored<br/>
                      • Isolated from others<br/>
                      <br/>
                      Shows % experiencing these feelings<br/>
                      at least 3-4 days per week
                    </span>
                  </div>
                </div>

                {/* Social Connection - With hover */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-6 rounded-2xl
                transition-all duration-300 hover:from-teal-600 hover:to-cyan-600 
                hover:shadow-lg cursor-pointer group relative">
                  <h4 className="text-xl font-bold mb-4">Social Connection</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      Math.round((hkData.filter(d => d.B10_5 >= 4 && d.B10_11 >= 4).length / hkData.length) * 100)
                    }%</div>
                    <div className="text-teal-100">Feel Strong Community Connection</div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Combines two key aspects:<br/>
                      • Feeling of belonging to a community<br/>
                      • Having warm, trusting relationships<br/>
                      <br/>
                      Shows % who experience both<br/>
                      at least 2-3 times per week<br/>
                      or more frequently
                    </span>
                  </div>
                </div>

                {/* Life Satisfaction - With hover */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 rounded-2xl
                transition-all duration-300 hover:from-orange-600 hover:to-amber-600 
                hover:shadow-lg cursor-pointer group relative">
                  <h4 className="text-xl font-bold mb-4">Life Satisfaction</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      Math.round((hkData.filter(d => d.B10_1 >= 4 && d.B10_3 >= 4).length / hkData.length) * 100)
                    }%</div>
                    <div className="text-orange-100">High Happiness & Life Satisfaction</div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Combines two positive emotions:<br/>
                      • Feeling happy<br/>
                      • Feeling satisfied with life<br/>
                      <br/>
                      Shows % who experience both<br/>
                      at least 2-3 times per week<br/>
                      or more frequently<br/>
                      Indicates overall life contentment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="space-y-8">
              {/* Sleep Quality Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Moon className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{goodSleepPercent}%</div>
                  <div className="text-indigo-100 font-medium">Good Sleep Quality</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Sleep quality ratings:<br/>
                      Very Good: Restful and refreshing<br/>
                      Good: Generally satisfactory<br/>
                      Poor: Frequently disrupted<br/>
                      Very Poor: Consistently inadequate<br/>
                      <br/>
                      Shows % reporting Very Good or Good sleep
                    </span>
                  </div>
                </div>
                
                {/* Average Sleep Duration - With hover */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" /> 
                  <div className="text-3xl font-bold mb-1">{formatHoursAndMinutes(
                    hkData.reduce((sum, d) => sum + d['B14a.1_1_1'], 0) / hkData.length
                  )}</div>
                  <div className="text-blue-100 font-medium">Average Sleep Duration</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Actual time spent sleeping<br/>
                      Excludes time lying awake in bed<br/>
                      <br/>
                      Recommended for adults:<br/>
                      7-9 hours per night<br/>
                      <br/>
                      Based on self-reported sleep hours
                    </span>
                  </div>
                </div>
                
                {/* Time to Fall Asleep - With hover */}
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-green-600 hover:to-teal-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Bed className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{(
                    hkData.reduce((sum, d) => sum + d.B13, 0) / hkData.length
                  ).toFixed(0)} min</div>
                  <div className="text-green-100 font-medium">Time to Fall Asleep</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Time from closing eyes to falling asleep<br/>
                      <br/>
                      Healthy range: 15-20 minutes<br/>
                      {'<'}30 minutes: Normal sleep onset<br/>
                      {'>'}30 minutes: Potential sleep latency issue<br/>
                      <br/>
                      Also known as sleep latency
                    </span>
                  </div>
                </div>
                
                {/* Experience Sleep Troubles - With hover */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-orange-600 hover:to-red-700 
                hover:shadow-lg cursor-pointer group relative">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{
                    Math.round((hkData.filter(d => d.SleepingTrouble >= 3).length / hkData.length) * 100)
                  }%</div>
                  <div className="text-orange-100 font-medium">Experience Sleep Troubles</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-small p-2 text-center">
                      Waking up in middle of night<br/>
                      or early morning<br/>
                      <br/>
                      Frequency categories:<br/>
                      None<br/>
                      Less than once per week<br/>
                      1-2 times per week<br/>
                      3 or more times per week<br/>
                      <br/>
                      Shows % with 1+ times per week
                    </span>
                  </div>
                </div>
              </div>

              {/* Sleep Quality Distribution */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Sleep Quality Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{
                      ((hkData.filter(d => d.SleepQuality === 1).length / hkData.length) * 100).toFixed(1)
                    }%</div>
                    <div className="font-semibold text-green-800">Very Good</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{
                      ((hkData.filter(d => d.SleepQuality === 2).length / hkData.length) * 100).toFixed(1)
                    }%</div>
                    <div className="font-semibold text-blue-800">Good</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{
                      ((hkData.filter(d => d.SleepQuality === 3).length / hkData.length) * 100).toFixed(1)
                    }%</div>
                    <div className="font-semibold text-orange-800">Poor</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">{
                      ((hkData.filter(d => d.SleepQuality === 4).length / hkData.length) * 100).toFixed(1)
                    }%</div>
                    <div className="text-semibold text-red-800">Very Poor</div>
                  </div>
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8 rounded-2xl
                transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 
                hover:shadow-lg cursor-pointer group relative">
                  <h4 className="text-2xl font-bold mb-6">Healthy Lifestyle Factors</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Regular Physical Activity</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d.physicalActivity >= 3).length / hkData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adequate Fruit & Vegetable Intake</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d['Fruits&Veg'] >= 4).length / hkData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Non-Smokers</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d.Smoking100Cigs === 1).length / hkData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moderate Alcohol Consumption</span>
                      <span className="font-bold">{
                        Math.round((hkData.filter(d => d.AlcoholicDrink <= 2).length / hkData.length) * 100)
                      }%</span>
                    </div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-[13px] font-small p-4 text-center max-w-sm">
                      <div className="space-y-3">
                        <div><strong>Regular Physical Activity:</strong><br/>3+ times per week exercise</div>
                        <div><strong>Adequate Nutrition:</strong><br/>4+ daily servings of fruits & vegetables</div>
                        <div><strong>Non-Smokers:</strong><br/>Never smoked 100 cigarettes in lifetime</div>
                        <div><strong>Moderate Alcohol:</strong><br/>1-2 days per week or less consumption</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-2xl
                transition-all duration-300 hover:from-purple-600 hover:to-pink-700 
                hover:shadow-lg cursor-pointer group relative">
                  <h4 className="text-2xl font-bold mb-6">Sleep & Mental Health Connection</h4>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold mb-2">{
                        Math.round((hkData.filter(d => d.SleepQuality <= 2 && d.B10_1 >= 4).length / 
                        hkData.filter(d => d.SleepQuality <= 2).length) * 100)
                      }%</div>
                      <div className="text-purple-100">of good sleepers report high happiness</div>
                    </div>
                    <div className="text-sm text-purple-200">
                      Quality sleep is strongly associated with better mental health outcomes, 
                      life satisfaction, and overall wellbeing in Hong Kong residents.
                    </div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-[13px] font-small p-4 text-center max-w-sm">
                      <div className="space-y-3">
                        <div><strong>Good Sleep Quality:</strong><br/>Rated as Very Good or Good sleep</div>
                        <div><strong>High Happiness:</strong><br/>Feeling happy at least 2-3 times per week</div>
                        <div><br/>This correlation shows how sleep quality<br/>directly impacts daily emotional wellbeing<br/>and positive mood experiences</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dementia' && (
            <div className="space-y-8">
              {/* Dementia Awareness Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Knowledge Score - With hover */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-purple-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{avgDementiaKnowledge}%</div>
                  <div className="text-purple-100 font-medium">Knowledge Score</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Based on assessment of dementia knowledge<br/>
                      covering causes, symptoms, communication,<br/>
                      and care needs<br/>
                      Higher scores indicate better understanding<br/>
                      of dementia facts and misconceptions
                    </span>
                  </div>
                </div>
                
                {/* Have Experience - With hover */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-blue-600 hover:to-cyan-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{Math.round((hkCDData.filter(d => d.C1 === 2).length / hkCDData.length) * 100)}%</div>
                  <div className="text-blue-100 font-medium">Have Experience</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Percentage who know someone<br/>
                      with dementia personally<br/>
                      Includes family members, friends,<br/>
                      or acquaintances with the condition<br/>
                      Shows personal exposure to dementia
                    </span>
                  </div>
                </div>
                
                {/* Seeking Intention - With hover */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-green-600 hover:to-emerald-700 
                hover:shadow-lg cursor-pointer group relative">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{
                    (convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C5_1 + d.C5_2 + d.C5_3) / 3), 0) / hkCDData.length,7))
                  }</div>
                  <div className="text-green-100 font-medium">Seeking Intention</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Willingness to seek information<br/>
                      about dementia in the future<br/>
                      Measures plans to learn more and<br/>
                      actively search for dementia-related<br/>
                      information and resources
                    </span>
                  </div>
                </div>
                
                {/* Perceived Risk - With hover */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-orange-600 hover:to-red-700 
                hover:shadow-lg cursor-pointer group relative">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{
                    (convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C12_1 + d.C12_2 + d.C12_3 + d.C12_4) / 4), 0) / hkCDData.length,7))
                  }</div>
                  <div className="text-orange-100 font-medium">Perceived Risk</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Personal assessment of likelihood<br/>
                      of developing dementia<br/>
                      Measures perceived susceptibility<br/>
                      and personal risk factors<br/>
                      Higher scores indicate greater<br/>
                      perceived personal risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Dementia Experience */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Dementia Experience</h4>
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dementiaExperienceData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {dementiaExperienceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {dementiaExperienceData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{entry.name}</div>
                            <div className="text-2xl font-bold" style={{ color: entry.color }}>
                              {Math.round((entry.value / hkCDData.length) * 100)}%
                            </div>
                            <div className="text-sm text-gray-500">{entry.value} people</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Relationship to Person with Dementia</h4>
                  <div className="space-y-4">
                    {relationshipChartData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          ></div>
                          <span className="font-semibold">{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold" style={{ color: COLORS[index] }}>
                            {entry.percentage}%
                          </div>
                          <div className="text-sm text-gray-500">{entry.value} people</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Knowledge Assessment */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Dementia Knowledge Assessment</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Knowledge Categories - With hover */}
                  <div className="bg-blue-50 p-6 rounded-lg text-center
                  transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                    <h5 className="font-bold text-blue-800 mb-4">Knowledge Categories</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round((hkCDData.reduce((sum, d) => {
                            const correctAnswers = [d.C4a_1, d.C4a_2, d.C4a_3, d.C4a_4].filter(a => a === 1).length;
                            return sum + (correctAnswers / 4) * 100;
                          }, 0) / hkCDData.length))}%
                        </div>
                        <div className="text-sm text-blue-700">Causes & Characteristics</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((hkCDData.reduce((sum, d) => {
                            const scores = [
                              d.C4b_1 === 1 ? 1 : 0,
                              d.C4b_2 === 1 ? 1 : 0,
                              d.C4b_3 === 4 ? 1 : 0
                            ];
                            return sum + (scores.reduce((a, b) => a + b) / 3) * 100;
                          }, 0) / hkCDData.length))}%
                        </div>
                        <div className="text-sm text-green-700">Communication</div>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="text-[13px] font-small p-4 text-white text-center">
                        <div className="space-y-2">
                          <div><strong>Causes & Characteristics:</strong><br/>Understanding dementia origins,<br/>common misconceptions, and<br/>disease progression</div>
                          <div><strong>Communication:</strong><br/>Knowledge about interacting with<br/>dementia patients and effective<br/>communication strategies</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information Behavior - With hover */}
                  <div className="bg-purple-50 p-6 rounded-lg text-center
                  transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                    <h5 className="font-bold text-purple-800 mb-4">Information Behavior</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C5_1 + d.C5_2 + d.C5_3) / 3), 0) / hkCDData.length,7))}
                        </div>
                        <div className="text-sm text-purple-700">Seeking Intention</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C6_1 + d.C6_2 + d.C6_3 + d.C6_4) / 4), 0) / hkCDData.length,7))}
                        </div>
                        <div className="text-sm text-orange-700">Information Avoidance</div>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="text-[13px] font-small p-4 text-white text-center">
                        <div className="space-y-2">
                          <div><strong>Seeking Intention:</strong><br/>Willingness to actively search for<br/>dementia information and learn<br/>more about the condition</div>
                          <div><strong>Information Avoidance:</strong><br/>Tendency to avoid or ignore<br/>dementia-related information<br/>due to discomfort or fear</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Perception - With hover */}
                  <div className="bg-green-50 p-6 rounded-lg text-center
                  transition-all duration-300 hover:shadow-md cursor-pointer group relative">
                    <h5 className="font-bold text-green-800 mb-4">Risk Perception</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C12_1 + d.C12_2 + d.C12_3 + d.C12_4) / 4), 0) / hkCDData.length,7))}
                        </div>
                        <div className="text-sm text-green-700">Perceived Susceptibility</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C13_1 + d.C13_2 + d.C13_3 + d.C13_4 + d.C13_5) / 5), 0) / hkCDData.length,7))}
                        </div>
                        <div className="text-sm text-red-700">Perceived Severity</div>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="text-[13px] font-small p-4 text-white text-center">
                        <div className="space-y-2">
                          <div><strong>Perceived Susceptibility:</strong><br/>Personal belief about likelihood<br/>of developing dementia based on<br/>personal risk factors</div>
                          <div><strong>Perceived Severity:</strong><br/>Assessment of how serious<br/>dementia would be if developed,<br/>including emotional impact</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Attention and Communication */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-2xl">
                <h4 className="text-2xl font-bold mb-6 text-center">Information Sources & Communication</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl">📰</div>
                    </div>
                    <div className="font-semibold mb-1">Newspaper</div>
                    <div className="text-2xl font-bold mb-1">
                      {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C15a_1 + d.C15a_2 + d.C15a_3) / 3), 0) / hkCDData.length,5))}
                    </div>
                    <div className="text-sm text-indigo-200">Average attention</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl">📺</div>
                    </div>
                    <div className="font-semibold mb-1">Television</div>
                    <div className="text-2xl font-bold mb-1">
                      {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C15b_1 + d.C15b_2 + d.C15b_3) / 3), 0) / hkCDData.length,5))}
                    </div>
                    <div className="text-sm text-indigo-200">Average attention</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl">🌐</div>
                    </div>
                    <div className="font-semibold mb-1">Internet</div>
                    <div className="text-2xl font-bold mb-1">
                      {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C15c_1 + d.C15c_2 + d.C15c_3) / 3), 0) / hkCDData.length,5))}
                    </div>
                    <div className="text-sm text-indigo-200">Average attention</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl">📱</div>
                    </div>
                    <div className="font-semibold mb-1">Social Media</div>
                    <div className="text-2xl font-bold mb-1">
                      {(convertToPercentage(hkCDData.reduce((sum, d) => sum + ((d.C15d_1 + d.C15d_2 + d.C15d_3) / 3), 0) / hkCDData.length,5))}
                    </div>
                    <div className="text-sm text-indigo-200">Average attention</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-tech' && (
            <div className="space-y-8">
              {/* AI Technology Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{convertToPercentage(avgTrustInAI,7)}</div>
                  <div className="text-blue-100 font-medium">AI Trust Score</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Confidence in AI health recommendations<br/>
                      and reliability of AI-assisted<br/>
                      health technologies<br/>
                      Measures trust in accuracy and<br/>
                      dependability of AI health advice
                    </span>
                  </div>
                </div>
                
                {/* High Use Intention - With hover */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-green-600 hover:to-emerald-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{highIntentionToUse}%</div>
                  <div className="text-green-100 font-medium">High Use Intention</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Percentage with strong plans to use<br/>
                      AI health technologies in future<br/>
                      Includes intentions to adopt and<br/>
                      regularly use AI-assisted health tools<br/>
                      for personal health management
                    </span>
                  </div>
                </div>
                
                {/* High Tech Anxiety - With hover */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-orange-600 hover:to-red-700 
                hover:shadow-lg cursor-pointer group relative">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{techAnxietyPercent}%</div>
                  <div className="text-orange-100 font-medium">High Tech Anxiety</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Percentage experiencing significant<br/>
                  discomfort or nervousness with<br/>
                  technology use<br/>
                  Measures unease with learning<br/>
                  and using new health technologies
                    </span>
                  </div>
                </div>
                
                {/* Active App Users - With hover */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl text-center
                transition-all duration-300 hover:from-purple-600 hover:to-pink-700 
                hover:shadow-lg cursor-pointer group relative">
                  <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl font-bold mb-1">{Math.round((hkCDData.filter(d => d.D5 >= 4).length / hkCDData.length) * 100)}%</div>
                  <div className="text-purple-100 font-medium">Active App Users</div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[13px] font-small p-2 text-center">
                      Currently using health apps for<br/>
                      dementia management or prevention<br/>
                      Includes both regular usage and<br/>
                      active engagement with app features<br/>
                      for health monitoring and support
                    </span>
                  </div>
                </div>
              </div>

              {/* Wearables and Apps Usage */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Health Wearables Usage</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wearableUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [`${value} users`, 'Users']} />
                      <Bar dataKey="users" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Health Apps Usage</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={healthAppUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [`${value} users`, 'Users']} />
                      <Bar dataKey="users" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Perception Radar Chart */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">AI Technology Perception Profile</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={aiPerceptionData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 7]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Technology Factors */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Performance Expectancy</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      convertToPercentage((hkCDData.reduce((sum, d) => sum + ((d.D16a_1 + d.D16a_2 + d.D16a_3 + d.D16a_4) / 4), 0) / hkCDData.length),7)
                    }</div>
                    <div className="text-teal-100 mb-3">Average Score</div>
                    <div className="text-sm text-teal-200">
                      Users expect AI health tech to improve their daily health management and activities
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Effort Expectancy</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      convertToPercentage((hkCDData.reduce((sum, d) => sum + ((d.D16b_1 + d.D16b_2 + d.D16b_3) / 3), 0) / hkCDData.length),7)
                    }</div>
                    <div className="text-purple-100 mb-3">Average Score</div>
                    <div className="text-sm text-purple-200">
                      Most users find AI health technologies relatively easy to learn and use
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Social Influence</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      convertToPercentage((hkCDData.reduce((sum, d) => sum + ((d.D16c_1 + d.D16c_2 + d.D16c_3) / 3), 0) / hkCDData.length),7)
                    }</div>
                    <div className="text-orange-100 mb-3">Average Score</div>
                    <div className="text-sm text-orange-200">
                      Moderate influence from family, friends, and healthcare providers on technology adoption
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy and Trust */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Data Privacy Concerns</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Information Misuse Concern</span>
                      <span className="font-bold">{
                        convertToPercentage((hkCDData.reduce((sum, d) => sum + d.D14_1, 0) / hkCDData.length),7)
                      }</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Privacy Finding Concern</span>
                      <span className="font-bold">{
                        convertToPercentage((hkCDData.reduce((sum, d) => sum + d.D14_2, 0) / hkCDData.length),7)
                      }</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Information Sharing Concern</span>
                      <span className="font-bold">{
                        convertToPercentage((hkCDData.reduce((sum, d) => sum + d.D14_3, 0) / hkCDData.length),7)
                      }</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Data Ownership Perception</h4>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold mb-2">{
                        convertToPercentage((hkCDData.reduce((sum, d) => sum + ((d.D10_1 + d.D10_2 + d.D10_3 + d.D10_4 + d.D10_5) / 5), 0) / hkCDData.length),7)
                      }</div>
                      <div className="text-indigo-100">Average Ownership Score</div>
                    </div>
                    <div className="text-sm text-indigo-200">
                      Users show moderate sense of personal ownership over their health data generated by AI technologies.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-gradient-to-r from-red-900 via-orange-900 to-yellow-900 text-white p-8 rounded-2xl">
        <h3 className="text-3xl font-bold mb-6 text-center">Hong Kong Health Innovation: Bridging Traditional Care & Digital Future</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🏥</div>
            <h4 className="font-bold mb-2 text-lg">Healthcare Excellence</h4>
            <p className="text-sm text-gray-200">
              {excellentHealthPercent}% report excellent health with world-class medical infrastructure and health awareness.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🧠</div>
            <h4 className="font-bold mb-2 text-lg">Dementia Awareness</h4>
            <p className="text-sm text-gray-200">
              {avgDementiaKnowledge}% knowledge score with {Math.round((hkCDData.filter(d => d.C1 === 2).length / hkCDData.length) * 100)}% having personal experience.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🤖</div>
            <h4 className="font-bold mb-2 text-lg">AI Technology Adoption</h4>
            <p className="text-sm text-gray-200">
              Trust score of {convertToPercentage(avgTrustInAI,7)} with {highIntentionToUse}% showing high intention to use AI health technologies.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">💤</div>
            <h4 className="font-bold mb-2 text-lg">Holistic Wellbeing</h4>
            <p className="text-sm text-gray-200">
              {goodSleepPercent}% good sleep quality supporting mental wellbeing score of {convertToPercentage(avgMentalHealth)} in urban environment.
            </p>
          </div>
        </div>
      </div>

      {/* Chronic Conditions Modal */}
      {isChronicConditionsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">Chronic Conditions Details</h3>
                <HeartPulse className="w-5 h-5 text-red-500" />
              </div>
              <button 
                onClick={() => setIsChronicConditionsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* Chronic Conditions Data */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Prevalence of Chronic Conditions</h4>
                
                {/* Calculate chronic conditions data */}
                {(() => {
                  const conditions = [
                    { id: 'B9_1', name: 'Cancer', color: '#FF6B6B' },
                    { id: 'B9_2', name: 'Diabetes', color: '#4ECDC4' },
                    { id: 'B9_3', name: 'High Blood Pressure', color: '#45B7D1' },
                    { id: 'B9_4', name: 'Heart Condition', color: '#F9A826' },
                    { id: 'B9_5', name: 'Chronic Lung Disease', color: '#6A0572' },
                    { id: 'B9_6', name: 'Arthritis', color: '#AB83A1' },
                    { id: 'B9_7', name: 'Infectious Disease', color: '#5C80BC' },
                    { id: 'B9_8', name: 'Neurological Conditions', color: '#4D908E' },
                    { id: 'B9_9', name: 'Stroke', color: '#F94144' },
                    { id: 'B9_10', name: 'Other Conditions', color: '#90BE6D' }
                  ];
                  
                  const conditionData = conditions.map(condition => ({
                    name: condition.name,
                    value: hkData.filter((d:any) => d[condition.id] === 1).length,
                    percentage: Math.round((hkData.filter((d:any) => d[condition.id] === 1).length / hkData.length) * 100),
                    color: condition.color
                  }));
                  
                  const noConditions = hkData.filter(d => d.B9_11 === 1).length;
                  const noConditionsPercentage = Math.round((noConditions / hkData.length) * 100);
                  
                  return (
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                      <div className="h-64 w-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[...conditionData.filter(d => d.value > 0), { name: 'No Conditions', value: noConditions, percentage: noConditionsPercentage, color: '#10B981' }]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              labelLine={false}
                            >
                              {[...conditionData.filter(d => d.value > 0), { name: 'No Conditions', value: noConditions, percentage: noConditionsPercentage, color: '#10B981' }].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [`${value} people (${props.payload.percentage}%)`, props.payload.name]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {conditionData.filter(d => d.value > 0).map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <div 
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: entry.color }}
                              ></div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{entry.name}</div>
                                <div className="text-lg font-bold" style={{ color: entry.color }}>
                                  {entry.percentage}%
                                </div>
                                <div className="text-sm text-gray-500">{entry.value} cases</div>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0 bg-green-500"
                            ></div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">No Chronic Conditions</div>
                              <div className="text-lg font-bold text-green-600">
                                {noConditionsPercentage}%
                              </div>
                              <div className="text-sm text-gray-500">{noConditions} people</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Additional Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Chronic Conditions by Age Group</h4>
                  <div className="space-y-2">
                    {ageGroups.map(group => {
                      const withConditions = group.data.filter(d => d.B9_11 !== 1).length;
                      const percentage = Math.round((withConditions / group.data.length) * 100);
                      return (
                        <div key={group.range} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{group.range}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-blue-700 w-10">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Conditions & General Health</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">With chronic conditions reporting good health</span>
                      <span className="text-sm font-medium text-purple-700">
                        {Math.round((hkData.filter(d => d.B9_11 !== 1 && d.GeneralHealth >= 4).length / hkData.filter(d => d.B9_11 !== 1).length) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">With chronic conditions reporting poor health</span>
                      <span className="text-sm font-medium text-purple-700">
                        {Math.round((hkData.filter(d => d.B9_11 !== 1 && d.GeneralHealth <= 2).length / hkData.filter(d => d.B9_11 !== 1).length) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Average number of conditions per person</span>
                      <span className="text-sm font-medium text-purple-700">
                        {(hkData.filter(d => d.B9_11 !== 1).reduce((sum, d) => {
                          return sum + (d.B9_1 + d.B9_2 + d.B9_3 + d.B9_4 + d.B9_5 + d.B9_6 + d.B9_7 + d.B9_8 + d.B9_9 + d.B9_10);
                        }, 0) / hkData.filter(d => d.B9_11 !== 1).length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
              <button 
                onClick={() => setIsChronicConditionsModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};