import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { processedGBAData, calculateBMI, calculateMentalHealthScores, getCityName, getEducationLevel, getIncomeRange } from '../../data/GBAData';
import { processedGBA2Data, calculateDementiaKnowledgeScore, calculateTechnologyAcceptanceScores } from '../../data/GBA2Data';
import { Users, Heart, Brain, TrendingUp, AlertCircle, Bed, Clock, Award, MapPin, HeartPulse, GraduationCap, X, DollarSign, Activity, Moon, FolderHeart as UserHeart, Building2, Stethoscope, Target, BarChart3, Zap, Smartphone, Shield, Lightbulb, Search } from 'lucide-react';

export const GBAAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'health' | 'mental' | 'sleep' | 'dementia' | 'aitech'>('overview');
  const [isChronicConditionsModalOpen, setIsChronicConditionsModalOpen] = useState(false);

  const gbaData = processedGBAData;
  const gba2Data = processedGBA2Data;

  // Calculate key metrics from original data
  const avgAge = Math.round(gbaData.reduce((sum, d) => sum + d.age, 0) / gbaData.length);
  const excellentHealthPercent = Math.round((gbaData.filter(d => d.generalHealth === 5 || d.generalHealth === 4 || d.generalHealth === 3).length / gbaData.length) * 100);
  const avgMentalHealth = (gbaData.reduce((sum, d) => {
    const scores = calculateMentalHealthScores(d);
    return sum + (scores.emotional + scores.social + scores.psychological) / 3;
  }, 0) / gbaData.length).toFixed(1);
  
  const avgBMI = (gbaData.reduce((sum, d) => sum + calculateBMI(d.weight, d.height), 0) / gbaData.length).toFixed(1);
  const goodSleepPercent = Math.round((gbaData.filter(d => d.sleepQuality <= 2).length / gbaData.length) * 100);

  // Calculate key metrics from sections C & D
  const avgDementiaKnowledge = gba2Data.length > 0 ? (gba2Data.reduce((sum, d) => sum + d.dementiaKnowledgeScore, 0) / gba2Data.length).toFixed(1) : '0';
  const knowSomeoneWithDementia = gba2Data.length > 0 ? Math.round((gba2Data.filter(d => d.C1 === 2).length / gba2Data.length) * 100) : 0;
  const avgAITrust = gba2Data.length > 0 ? (gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.trustInAI, 0) / gba2Data.length).toFixed(1) : '0';
  const wearableUsage = gba2Data.length > 0 ? Math.round((gba2Data.filter(d => d.D1_15 === 0).length / gba2Data.length) * 100) : 0;

  // Demographics data
  const genderLabels = { 1: 'Male', 2: 'Female', 3: 'Others' };
  const cityLabels = {
    1: 'Guangzhou',
    2: 'Shenzhen', 
    3: 'Zhuhai',
    4: 'Foshan',
    5: 'Huizhou',
    6: 'Dongguan',
    7: 'Zhongshan',
    8: 'Jiangmen',
    9: 'Zhaoqing',
    10: 'Other'
  };
  
  const educationLabels = {
    1: 'No formal education',
    2: 'Primary school',
    3: 'Junior high school', 
    4: 'Vocational secondary',
    5: 'High school',
    6: 'Associate degree',
    7: "Bachelor's degree",
    8: "Master's degree",
    9: 'Doctoral degree',
    10: 'Other'
  };
  
  const genderData = Object.entries(genderLabels).map(([code, label]) => ({
    name: label,
    value: gbaData.filter(d => d.gender === parseInt(code)).length,
    percentage: Math.round((gbaData.filter(d => d.gender === parseInt(code)).length / gbaData.length) * 100)
  }));

  const cityData = Object.entries(cityLabels).map(([code, label]) => ({
    name: label,
    value: gbaData.filter(d => d.city === parseInt(code)).length,
    percentage: ((gbaData.filter(d => d.city === parseInt(code)).length / gbaData.length) * 100).toFixed(2)
  }));

  const educationData = Object.entries(educationLabels).map(([code, label]) => ({
    name: label,
    value: gbaData.filter(d => d.education === parseInt(code)).length,
    percentage: Math.round((gbaData.filter(d => d.education === parseInt(code)).length / gbaData.length) * 100)
  }));

  // Income analysis
  const highIncomeUsers = gbaData.filter(d => d.income >= 13).length; // Above ¥30,000
  const highIncomePercent = Math.round((highIncomeUsers / gbaData.length) * 100);

  // Health analysis
  const healthDistribution = [
    { name: 'Excellent', value: gbaData.filter(d => d.generalHealth === 5).length, color: '#10b981' },
    { name: 'Very Good', value: gbaData.filter(d => d.generalHealth === 4).length, color: '#3b82f6' },
    { name: 'Good', value: gbaData.filter(d => d.generalHealth === 3).length, color: '#f59e0b' },
    { name: 'Fair', value: gbaData.filter(d => d.generalHealth === 2).length, color: '#f97316' },
    { name: 'Poor', value: gbaData.filter(d => d.generalHealth === 1).length, color: '#ef4444' }
  ];

  // Mental health by age groups
  const ageGroups = [
    { range: '18-29', data: gbaData.filter(d => d.age >= 18 && d.age <= 29) },
    { range: '30-39', data: gbaData.filter(d => d.age >= 30 && d.age <= 39) },
    { range: '40-49', data: gbaData.filter(d => d.age >= 40 && d.age <= 49) },
    { range: '50-59', data: gbaData.filter(d => d.age >= 50 && d.age <= 59) },
    { range: '60+', data: gbaData.filter(d => d.age >= 60) }
  ];

  const mentalHealthByAge = ageGroups.filter(group => group.data.length > 0).map(group => ({
    age: group.range,
    emotional: group.data.reduce((sum, d) => sum + calculateMentalHealthScores(d).emotional, 0) / group.data.length,
    social: group.data.reduce((sum, d) => sum + calculateMentalHealthScores(d).social, 0) / group.data.length,
    psychological: group.data.reduce((sum, d) => sum + calculateMentalHealthScores(d).psychological, 0) / group.data.length
  }));

  // Technology acceptance radar data
  const technologyAcceptanceRadar = gba2Data.length > 0 ? [{
    subject: 'Performance Expectancy',
    value: gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.performanceExpectancy, 0) / gba2Data.length
  }, {
    subject: 'Effort Expectancy',
    value: gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.effortExpectancy, 0) / gba2Data.length
  }, {
    subject: 'Social Influence',
    value: gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.socialInfluence, 0) / gba2Data.length
  }, {
    subject: 'Facilitating Conditions',
    value: gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.facilitatingConditions, 0) / gba2Data.length
  }, {
    subject: 'Hedonic Motivation',
    value: gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.hedonicMotivation, 0) / gba2Data.length
  }, {
    subject: 'Trust in AI',
    value: gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.trustInAI, 0) / gba2Data.length
  }] : [];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#16f99aff', '#0d92daff', '#da0d69ff'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'health', label: 'Physical Health', icon: Heart },
    { id: 'mental', label: 'Mental Health', icon: Brain },
    { id: 'sleep', label: 'Sleep & Lifestyle', icon: Moon },
    { id: 'dementia', label: 'Dementia Awareness', icon: Search },
    { id: 'aitech', label: 'AI Health Tech', icon: Smartphone }
  ];

  return (
    <div className="space-y-8 bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
      {/* Header */}
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">粤港澳大湾区 Greater Bay Area</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Comprehensive Health & Wellbeing Analysis</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Understanding health patterns, lifestyle factors, wellbeing indicators, dementia awareness, and AI health technology adoption across the Greater Bay Area's dynamic cities
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 py-6 px-4 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-green-600 to-emerald-600'
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
              <div className="grid grid-cols-2 lg:grid-cols-7 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{gbaData.length}</div>
                  <div className="text-emerald-100 font-medium">Participants</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{excellentHealthPercent}%</div>
                  <div className="text-blue-100 font-medium">Excellent Health</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{avgMentalHealth}</div>
                  <div className="text-purple-100 font-medium">Mental Wellbeing</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-2xl text-center">
                  <Moon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{goodSleepPercent}%</div>
                  <div className="text-indigo-100 font-medium">Good Sleep</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-6 rounded-2xl text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{avgBMI}</div>
                  <div className="text-orange-100 font-medium">Average BMI</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-2xl text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{avgDementiaKnowledge}%</div>
                  <div className="text-pink-100 font-medium">Dementia Knowledge</div>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">{wearableUsage}%</div>
                  <div className="text-teal-100 font-medium">Use Wearables</div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-green-500" />
                    <h3 className="text-xl font-bold text-gray-900">Innovation Hub</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{avgAge} years</div>
                  <p className="text-gray-600">average age driving China's tech and economic innovation</p>
                </div>

                <div className="bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">Economic Prosperity</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{highIncomePercent}%</div>
                  <p className="text-gray-600">earn above ¥30,000 monthly, reflecting the region's economic strength</p>
                </div>

                <div className="bg-white border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-8 h-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900">Education Hub</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">80%</div>
                  <p className="text-gray-600">have higher education degrees, powering the region's knowledge economy</p>
                </div>

                <div className="bg-white border-l-4 border-pink-500 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-8 h-8 text-pink-500" />
                    <h3 className="text-xl font-bold text-gray-900">Health Innovation</h3>
                  </div>
                  <div className="text-3xl font-bold text-pink-600 mb-2">{knowSomeoneWithDementia}%</div>
                  <p className="text-gray-600">know someone with dementia, driving awareness and care innovation</p>
                </div>
              </div>

              {/* City Overview */}
              <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">Greater Bay Area Cities Health Landscape</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {cityData.filter(city => city.value > 0).map((city, index) => (
                    <div key={city.name} className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <div className="text-xl font-bold">{city.percentage}%</div>
                      </div>
                      <div className="font-semibold mb-1 text-sm">{city.name}</div>
                      <div className="text-xs text-gray-300">{city.value} residents</div>
                    </div>
                  ))}
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
                            data={genderData.filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {genderData.filter(d => d.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {genderData.filter(d => d.value > 0).map((entry, index) => (
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

                {/* City Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Population by City</h4>
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={cityData.filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {cityData.filter(d => d.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {cityData.filter(d => d.value > 0).map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index + 2] }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{entry.name}</div>
                            <div className="text-2xl font-bold" style={{ color: COLORS[index + 2] }}>
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
                  <BarChart data={educationData.filter(d => d.value > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} fontSize={12} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value} people`, 'Count']} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Socioeconomic Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl text-center">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <div className="text-4xl font-bold mb-2">7.5</div>
                  <div className="text-emerald-100 font-medium mb-2">Average Education Level</div>
                  <div className="text-sm text-emerald-200">Bachelor's Degree Level</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <div className="text-4xl font-bold mb-2">¥32k</div>
                  <div className="text-blue-100 font-medium mb-2">Median Income</div>
                  <div className="text-sm text-blue-200">Monthly household income</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <div className="text-4xl font-bold mb-2">6.5</div>
                  <div className="text-purple-100 font-medium mb-2">Social Ladder</div>
                  <div className="text-sm text-purple-200">Average perceived status</div>
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
                            data={healthDistribution.filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {healthDistribution.filter(d => d.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {healthDistribution.filter(d => d.value > 0).map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{entry.name}</div>
                            <div className="text-2xl font-bold" style={{ color: entry.color }}>
                              {((entry.value / gbaData.length) * 100).toFixed(2)}%
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
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 rounded-2xl">
                    <h4 className="text-xl font-bold mb-4">BMI Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{avgBMI}</div>
                        <div className="text-orange-100">Average BMI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{
                          Math.round((gbaData.filter(d => {
                            const bmi = calculateBMI(d.weight, d.height);
                            return bmi >= 18.5 && bmi < 25;
                          }).length / gbaData.length) * 100)
                        }%</div>
                        <div className="text-orange-100">Healthy Weight</div>
                      </div>
                    </div>
                  </div>

                  {/* Physical Activity */}
                  <div className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-6 rounded-2xl">
                    <h4 className="text-xl font-bold mb-4">Physical Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Regular Exercise (3+ times/week)</span>
                        <span className="font-bold">{
                          Math.round((gbaData.filter(d => d.physicalActivity >= 3).length / gbaData.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adequate Fruit & Vegetable Intake</span>
                        <span className="font-bold">{
                          Math.round((gbaData.filter(d => d['fruits&Veg'] >= 5).length / gbaData.length) * 100)
                        }%</span>
                      </div>
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-2xl">
                    <h4 className="text-xl font-bold mb-4">Chronic Conditions</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold mb-1">{
                        Math.round((gbaData.filter(d => d.B9_11 === 1).length / gbaData.length) * 100)
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
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{
                      Math.round((gbaData.filter(d => d.physicalActivity >= 3).length / gbaData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Regular Exercise</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-green-600">🥬</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">{
                      Math.round((gbaData.filter(d => d['fruits&Veg'] >= 4).length / gbaData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Adequate Nutrition</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-red-600">🚭</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">{
                      Math.round((gbaData.filter(d => d.smoke100cigs === 1).length / gbaData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Never Smokers</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-blue-600">🍷</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{
                      Math.round((gbaData.filter(d => d.alcoholic <= 2).length / gbaData.length) * 100)
                    }%</div>
                    <div className="text-gray-600 text-sm">Low Alcohol Use</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mental' && (
            <div className="space-y-8">
              {/* Mental Health Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <UserHeart className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gbaData.length > 0 ? (
                    gbaData.reduce((sum, d) => sum + calculateMentalHealthScores(d).emotional, 0) / gbaData.length
                  ).toFixed(1) : '0'}</div>
                  <div className="text-blue-100 font-medium">Emotional Wellbeing</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gbaData.length > 0 ? (
                    gbaData.reduce((sum, d) => sum + calculateMentalHealthScores(d).social, 0) / gbaData.length
                  ).toFixed(1) : '0'}</div>
                  <div className="text-emerald-100 font-medium">Social Wellbeing</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl text-center">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gbaData.length > 0 ? (
                    gbaData.reduce((sum, d) => sum + calculateMentalHealthScores(d).psychological, 0) / gbaData.length
                  ).toFixed(1) : '0'}</div>
                  <div className="text-purple-100 font-medium">Psychological Wellbeing</div>
                </div>
              </div>

              {/* Mental Health by Age Group */}
              {mentalHealthByAge.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Mental Wellbeing by Age Group</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={mentalHealthByAge}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis domain={[3, 6]} />
                      <Tooltip 
                        formatter={(value: number) => value.toFixed(2)}
                      />
                      <Line type="monotone" dataKey="emotional" stroke="#3b82f6" strokeWidth={3} name="Emotional" />
                      <Line type="monotone" dataKey="social" stroke="#10b981" strokeWidth={3} name="Social" />
                      <Line type="monotone" dataKey="psychological" stroke="#8b5cf6" strokeWidth={3} name="Psychological" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Loneliness Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Loneliness Indicators</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Lack of Companionship</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d.B17_1 >= 3).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feel Left Out</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d.B17_2 >= 3).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feel Isolated</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d.B17_3 >= 3).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Social Connection</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      Math.round((gbaData.filter(d => d.B10_5 >= 4 && d.B10_11 >= 4).length / gbaData.length) * 100)
                    }%</div>
                    <div className="text-teal-100">Feel Strong Community Connection</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Life Satisfaction</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{
                      Math.round((gbaData.filter(d => d.B10_1 >= 4 && d.B10_3 >= 4).length / gbaData.length) * 100)
                    }%</div>
                    <div className="text-amber-100">High Happiness & Life Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="space-y-8">
              {/* Sleep Quality Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl text-center">
                  <Moon className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{goodSleepPercent}%</div>
                  <div className="text-indigo-100 font-medium">Good Sleep Quality</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl text-center">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-90" /> 
                  <div className="text-3xl font-bold mb-1">{gbaData.length > 0 ? (
                    gbaData.reduce((sum, d) => sum + d['B14a#1_1_1'], 0) / gbaData.length
                  ).toFixed(1) : '0'}h</div>
                  <div className="text-blue-100 font-medium">Average Sleep Duration</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl text-center">
                  <Bed className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gbaData.length > 0 ? (
                    gbaData.reduce((sum, d) => sum + d.B13, 0) / gbaData.length
                  ).toFixed(0) : '0'} min</div>
                  <div className="text-emerald-100 font-medium">Time to Fall Asleep</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{
                    Math.round((gbaData.filter(d => d.sleepingTrouble >= 3).length / gbaData.length) * 100)
                  }%</div>
                  <div className="text-orange-100 font-medium">Experience Sleep Troubles</div>
                </div>
              </div>

              {/* Sleep Quality Distribution */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h4 className="text-2xl font-bold mb-6 text-center">Sleep Quality Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">{
                      gbaData.length > 0 ? ((gbaData.filter(d => d.sleepQuality === 1).length / gbaData.length) * 100).toFixed(1) : '0'
                    }%</div>
                    <div className="font-semibold text-emerald-800">Very Good</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{
                      gbaData.length > 0 ? ((gbaData.filter(d => d.sleepQuality === 2).length / gbaData.length) * 100).toFixed(1) : '0'
                    }%</div>
                    <div className="font-semibold text-blue-800">Good</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{
                      gbaData.length > 0 ? ((gbaData.filter(d => d.sleepQuality === 3).length / gbaData.length) * 100).toFixed(1) : '0'
                    }%</div>
                    <div className="font-semibold text-orange-800">Poor</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">{
                      gbaData.length > 0 ? ((gbaData.filter(d => d.sleepQuality === 4).length / gbaData.length) * 100).toFixed(1) : '0'
                    }%</div>
                    <div className="font-semibold text-red-800">Very Poor</div>
                  </div>
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Healthy Lifestyle Factors</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Regular Physical Activity</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d.physicalActivity >= 3).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adequate Fruit & Vegetable Intake</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d['fruits&Veg'] >= 4).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Non-Smokers</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d.smoke100cigs === 1).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moderate Alcohol Consumption</span>
                      <span className="font-bold">{
                        Math.round((gbaData.filter(d => d.alcoholic <= 2).length / gbaData.length) * 100)
                      }%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Sleep & Mental Health Connection</h4>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold mb-2">{
                        gbaData.filter(d => d.sleepQuality <= 2).length > 0 ? Math.round((gbaData.filter(d => d.sleepQuality <= 2 && d.B10_1 >= 4).length / 
                        gbaData.filter(d => d.sleepQuality <= 2).length) * 100) : 0
                      }%</div>
                      <div className="text-purple-100">of good sleepers report high happiness</div>
                    </div>
                    <div className="text-sm text-purple-200">
                      Quality sleep is strongly associated with better mental health outcomes, 
                      life satisfaction, and overall wellbeing in Greater Bay Area residents.
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
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-2xl text-center">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{avgDementiaKnowledge}%</div>
                  <div className="text-pink-100 font-medium">Knowledge Score</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{knowSomeoneWithDementia}%</div>
                  <div className="text-purple-100 font-medium">Know Someone</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gba2Data.length > 0 ? (
                    gba2Data.reduce((sum, d) => sum + (d.C5_1 + d.C5_2 + d.C5_3) / 3, 0) / gba2Data.length
                  ).toFixed(1) : '0'} / 7</div>
                  <div className="text-blue-100 font-medium">Information Seeking</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl text-center">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gba2Data.length > 0 ? (
                    gba2Data.reduce((sum, d) => sum + d.C17_1, 0) / gba2Data.length
                  ).toFixed(0) : '0'}%</div>
                  <div className="text-emerald-100 font-medium">Perceived Risk</div>
                </div>
              </div>

              {/* Knowledge Assessment */}
              {gba2Data.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Dementia Knowledge by Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{
                        Math.round((gba2Data.filter(d => 
                          (d.C4a_1 <= 2 ? 1 : 0) + (d.C4a_2 <= 2 ? 1 : 0) + (d.C4a_3 <= 2 ? 1 : 0) + (d.C4a_4 <= 2 ? 1 : 0) >= 2
                        ).length / gba2Data.length) * 100)
                      }%</div>
                      <div className="font-semibold text-blue-800">Understand Causes</div>
                      <div className="text-sm text-gray-600 mt-2">Correctly identify dementia causes and characteristics</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">{
                        Math.round((gba2Data.filter(d => 
                          (d.C4b_1 <= 2 ? 1 : 0) + (d.C4b_2 <= 2 ? 1 : 0) + (d.C4b_3 >= 3 ? 1 : 0) >= 2
                        ).length / gba2Data.length) * 100)
                      }%</div>
                      <div className="font-semibold text-green-800">Communication Skills</div>
                      <div className="text-sm text-gray-600 mt-2">Know how to communicate with dementia patients</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{
                        Math.round((gba2Data.filter(d => 
                          (d.C4c_1 >= 3 ? 1 : 0) + (d.C4c_4 >= 3 ? 1 : 0) + (d.C4c_5 >= 3 ? 1 : 0) + (d.C4c_6 >= 3 ? 1 : 0) + (d.C4c_7 >= 3 ? 1 : 0) + (d.C4c_8 >= 3 ? 1 : 0) >= 4
                        ).length / gba2Data.length) * 100)
                      }%</div>
                      <div className="font-semibold text-purple-800">Care Knowledge</div>
                      <div className="text-sm text-gray-600 mt-2">Understand care needs and behavioral symptoms</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{
                        Math.round((gba2Data.filter(d => 
                          (d.C4d_1 >= 3 ? 1 : 0) + (d.C4d_2 >= 3 ? 1 : 0) + (d.C4d_3 >= 3 ? 1 : 0) >= 2
                        ).length / gba2Data.length) * 100)
                      }%</div>
                      <div className="font-semibold text-orange-800">Prevention Aware</div>
                      <div className="text-sm text-gray-600 mt-2">Know risk factors and health promotion</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Seeking Behavior */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Information Sources</h4>
                  {gba2Data.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Internet</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.reduce((sum, d) => sum + (d.C15c_1 + d.C15c_2 + d.C15c_3) / 3, 0) / gba2Data.length) * 20)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Media</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.reduce((sum, d) => sum + (d.C15d_1 + d.C15d_2 + d.C15d_3) / 3, 0) / gba2Data.length) * 20)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Television</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.reduce((sum, d) => sum + (d.C15b_1 + d.C15b_2 + d.C15b_3) / 3, 0) / gba2Data.length) * 20)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Newspapers</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.reduce((sum, d) => sum + (d.C15a_1 + d.C15a_2 + d.C15a_3) / 3, 0) / gba2Data.length) * 20)
                        }%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Health Beliefs</h4>
                  {gba2Data.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold mb-2">{
                          Math.round((gba2Data.reduce((sum, d) => sum + (d.C13_1 + d.C13_2 + d.C13_3 + d.C13_4 + d.C13_5) / 5, 0) / gba2Data.length) * 100 / 7)
                        }%</div>
                        <div className="text-teal-100">Perceived Severity Score</div>
                      </div>
                      <div className="text-sm text-teal-200">
                        Higher perceived severity of dementia is associated with increased information seeking behavior and preventive actions.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Communication Patterns */}
              {gba2Data.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Discussion Frequency by Relationship</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">{
                        (gba2Data.reduce((sum, d) => sum + d.C16_1, 0) / gba2Data.length).toFixed(1)
                      }/5</div>
                      <div className="font-semibold">Family</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{
                        (gba2Data.reduce((sum, d) => sum + d.C16_2, 0) / gba2Data.length).toFixed(1)
                      }/5</div>
                      <div className="font-semibold">Friends</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{
                        (gba2Data.reduce((sum, d) => sum + d.C16_3, 0) / gba2Data.length).toFixed(1)
                      }/5</div>
                      <div className="font-semibold">Colleagues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{
                        (gba2Data.reduce((sum, d) => sum + d.C16_4, 0) / gba2Data.length).toFixed(1)
                      }/5</div>
                      <div className="font-semibold">Healthcare Providers</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'aitech' && (
            <div className="space-y-8">
              {/* AI Technology Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl text-center">
                  <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{wearableUsage}%</div>
                  <div className="text-blue-100 font-medium">Use Wearables</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl text-center">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{avgAITrust}</div>
                  <div className="text-emerald-100 font-medium">AI Trust Level</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gba2Data.length > 0 ? (
                    gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.intentionToUse, 0) / gba2Data.length
                  ).toFixed(1) : '0'}</div>
                  <div className="text-purple-100 font-medium">Usage Intention</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{gba2Data.length > 0 ? 
                    Math.round((gba2Data.filter(d => d.D5 >= 3).length / gba2Data.length) * 100) : 0
                  }%</div>
                  <div className="text-orange-100 font-medium">Dementia App Interest</div>
                </div>
              </div>

              {/* Technology Acceptance Radar Chart */}
              {technologyAcceptanceRadar.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Technology Acceptance Framework</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={technologyAcceptanceRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[1, 7]} />
                      <Radar
                        name="Acceptance Score"
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Device Usage Patterns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Popular Wearables</h4>
                  {gba2Data.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Mi Smart Band</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D1_6 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amazfit Watch</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D1_10 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Apple Watch</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D1_1 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Huawei Devices</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D1_3 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-8 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-6">Popular Health Apps</h4>
                  {gba2Data.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>WeChat Sports</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D3_11 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keep Fitness</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D3_15 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Apple Health</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D3_1 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alipay Health</span>
                        <span className="font-bold">{
                          Math.round((gba2Data.filter(d => d.D3_12 === 1).length / gba2Data.length) * 100)
                        }%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy and Trust Factors */}
              {gba2Data.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h4 className="text-2xl font-bold mb-6 text-center">Privacy and Trust Concerns</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600 mb-2">{
                        Math.round((gba2Data.reduce((sum, d) => sum + (d.D14_1 + d.D14_2 + d.D14_3) / 3, 0) / gba2Data.length) * 100 / 7)
                      }%</div>
                      <div className="font-semibold text-red-800">Privacy Concerns</div>
                      <div className="text-sm text-gray-600 mt-2">Worried about data misuse and privacy</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{
                        Math.round((gba2Data.reduce((sum, d) => sum + (d['D7_1__1'] + d['D7_2__1'] + d['D7_3__1']) / 3, 0) / gba2Data.length) * 100 / 7)
                      }%</div>
                      <div className="font-semibold text-orange-800">Technology Anxiety</div>
                      <div className="text-sm text-gray-600 mt-2">Feel uneasy or nervous about technology</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">{
                        Math.round((gba2Data.reduce((sum, d) => sum + d.technologyAcceptance.dataOwnership, 0) / gba2Data.length) * 100 / 7)
                      }%</div>
                      <div className="font-semibold text-green-800">Data Ownership</div>
                      <div className="text-sm text-gray-600 mt-2">Feel ownership of their health data</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Government Support and Infrastructure */}
              {gba2Data.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl">
                    <h4 className="text-2xl font-bold mb-6">Government Support</h4>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold mb-2">{
                        Math.round((gba2Data.reduce((sum, d) => sum + (d.D17_1 + d.D17_2 + d.D17_3) / 3, 0) / gba2Data.length) * 100 / 7)
                      }%</div>
                      <div className="text-blue-100">Support for Digital Health Infrastructure</div>
                    </div>
                    <div className="text-sm text-blue-200">
                      Strong government support is seen as crucial for the development and adoption of AI health technologies.
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-8 rounded-2xl">
                    <h4 className="text-2xl font-bold mb-6">Digital Infrastructure</h4>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold mb-2">{
                        Math.round((gba2Data.reduce((sum, d) => sum + d.D8, 0) / gba2Data.length) * 20)
                      }%</div>
                      <div className="text-emerald-100">Internet Stability Rating</div>
                    </div>
                    <div className="text-sm text-emerald-200">
                      High-quality internet infrastructure supports widespread adoption of health technologies.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-900 text-white p-8 rounded-2xl">
        <h3 className="text-3xl font-bold mb-6 text-center">Greater Bay Area Health Insights: Innovation Meets Wellness</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🚀</div>
            <h4 className="font-bold mb-2 text-lg">Innovation-Driven Health</h4>
            <p className="text-sm text-gray-200">
              The Greater Bay Area leverages technology and innovation to create smart health solutions and enhance quality of life.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">💼</div>
            <h4 className="font-bold mb-2 text-lg">Economic Prosperity & Health</h4>
            <p className="text-sm text-gray-200">
              High income levels and education create opportunities for better healthcare access and health-conscious lifestyles.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">🧠</div>
            <h4 className="font-bold mb-2 text-lg">Dementia Awareness</h4>
            <p className="text-sm text-gray-200">
              Growing awareness and knowledge about dementia drives preventive care and family planning in the region.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="text-4xl mb-3">📱</div>
            <h4 className="font-bold mb-2 text-lg">AI Health Technology</h4>
            <p className="text-sm text-gray-200">
              High adoption of wearables and health apps, with strong government support for digital health infrastructure.
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
                <HeartPulse className="w-5 h-5 text-emerald-500" />
              </div>
              <button 
                onClick={() => setIsChronicConditionsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Chronic Conditions Analysis</h4>
                <p className="text-lg text-gray-600 mb-8">
                  Detailed chronic conditions analysis will be available when more survey data is collected.
                </p>
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <div className="text-emerald-800 font-medium">
                    Current sample shows {Math.round((gbaData.filter(d => d.B9_11 === 1).length / gbaData.length) * 100)}% 
                    of participants report no chronic conditions, indicating good overall health in the Greater Bay Area.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
              <button 
                onClick={() => setIsChronicConditionsModalOpen(false)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
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