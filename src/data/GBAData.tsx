import gbaData from './gba.json';

// Greater Bay Area Health Survey Data Structure
export interface GBAHealthData {
  respondentId: number;
  code: string; // "gba"
  gender: number; // 1=Male, 2=Female, 3=Others
  age: number;
  education: number; // 1=No formal education, 2=Primary, 3=Junior high, 4=Vocational secondary, 5=High school, 6=Associate, 7=Bachelor's, 8=Master's, 9=Doctoral, 10=Other
  income: number; // 1=Below 1000, 2=1001-2000, ..., 16=Above 60000
  employment: number; // 1=Full time, 2=Part time, 3=Unemployed, 4=Disability pension, 5=Retired, 6=Home duties, 7=Student, 8=Other
  maritalStatus: number; // 1=Never married, 2=Married/living with partner, 3=Divorced/separated, 4=Widowed
  area: number; // 1=Remote rural, 2=Township, 3=Suburban, 4=Urban, 5=Other
  city: number; // 1=Guangzhou, 2=Shenzhen, 3=Zhuhai, 4=Foshan, 5=Huizhou, 6=Dongguan, 7=Zhongshan, 8=Jiangmen, 9=Zhaoqing, 10=Other
  ladder: number; // Social ladder position 1-10
  height: number; // cm
  weight: number; // kg
  generalHealth: number; // 1=Poor, 2=Fair, 3=Good, 4=Very good, 5=Excellent
  physicalActivity: number; // 1=<1/week, 2=1-2/week, 3=3-4/week, 4=5-6/week, 5=>6/week
  'fruits&Veg': number; // 1=None, 2=≤0.5 serving, 3=~1 serving, 4=~2 servings, 5=~3 servings, 6=~4 servings, 7=≥5 servings
  alcoholic: number; // 1=<1 day/week, 2=1-2 days/week, 3=3-4 days/week, 4=5-6 days/week, 5=7 days/week
  smoke100cigs: number; // 1=No, 2=Yes, 3=Don't know
  smoking: number; // 1=Not at all, 2=Some days, 3=Every day (0 if doesn't smoke)
  // Medical conditions (B9_1 to B9_11)
  B9_1: number; // Cancer
  B9_2: number; // Diabetes
  B9_3: number; // High blood pressure
  B9_4: number; // Heart condition
  B9_5: number; // Chronic lung disease
  B9_6: number; // Arthritis
  B9_7: number; // Infectious disease
  B9_8: number; // Neurological conditions
  B9_9: number; // Stroke
  B9_10: number; // Other
  B9_11: number; // None of the above
  // Mental health items (B10_1 to B10_14)
  B10_1: number; // Happy
  B10_2: number; // Interested in life
  B10_3: number; // Satisfied with life
  B10_4: number; // Something important to contribute
  B10_5: number; // Belonged to community
  B10_6: number; // Society is good place
  B10_7: number; // People are basically good
  B10_8: number; // Society works makes sense
  B10_9: number; // Liked most parts of personality
  B10_10: number; // Good at managing daily life
  B10_11: number; // Warm trusting relationships
  B10_12: number; // Experiences that challenged growth
  B10_13: number; // Confident to express ideas
  B10_14: number; // Life has direction/meaning
  // Sleep data
  'B11#1_1_1': number; // Bedtime hour
  'B11#2_1_1': number; // Bedtime minute
  'B12#1_1_1': number; // Wake time hour
  'B12#2_1_1': number; // Wake time minute
  B13: number; // Time to fall asleep (minutes)
  'B14a#1_1_1': number; // Sleep duration hours
  'B14a#2_1_1': number; // Sleep duration minutes
  sleepingTrouble: number; // 1=None, 2=<1/week, 3=1-2/week, 4=≥3/week
  sleepQuality: number; // 1=Very good, 2=Good, 3=Poor, 4=Very poor
  // Loneliness scale
  B17_1: number; // Lack of companionship
  B17_2: number; // Feel left out/ignored
  B17_3: number; // Feel isolated
}

// Helper functions for data analysis
export const calculateBMI = (weight: number, height: number): number => {
  return weight / Math.pow(height / 100, 2);
};

export const calculateMentalHealthScores = (data: GBAHealthData) => {
  // Emotional wellbeing (items 1, 2, 3)
  const emotional = (data.B10_1 + data.B10_2 + data.B10_3) / 3;
  
  // Social wellbeing (items 4, 5, 6, 7, 8)
  const social = (data.B10_4 + data.B10_5 + data.B10_6 + data.B10_7 + data.B10_8) / 5;
  
  // Psychological wellbeing (items 9, 10, 11, 12, 13, 14)
  const psychological = (data.B10_9 + data.B10_10 + data.B10_11 + data.B10_12 + data.B10_13 + data.B10_14) / 6;
  
  return { emotional, social, psychological };
};

export const getCityName = (cityCode: number): string => {
  const cities = {
    1: 'Guangzhou / 广州',
    2: 'Shenzhen / 深圳',
    3: 'Zhuhai / 珠海',
    4: 'Foshan / 佛山',
    5: 'Huizhou / 惠州',
    6: 'Dongguan / 东莞',
    7: 'Zhongshan / 中山',
    8: 'Jiangmen / 江门',
    9: 'Zhaoqing / 肇庆',
    10: 'Other / 其他'
  };
  return cities[cityCode as keyof typeof cities] || '';
};

export const getEducationLevel = (educationCode: number): string => {
  const education = {
    1: 'No formal education / 没有受过正规教育',
    2: 'Primary school / 小学',
    3: 'Junior high school / 初中',
    4: 'Vocational secondary / 中等职业',
    5: 'High school / 高中',
    6: 'Associate degree / 大专',
    7: "Bachelor's degree / 本科",
    8: "Master's degree / 研究生",
    9: 'Doctoral degree / 博士',
    10: 'Other / 其他'
  };
  return education[educationCode as keyof typeof education] || '';
};

export const getIncomeRange = (incomeCode: number): string => {
  const income = {
    1: 'Below ¥1,000',
    2: '¥1,001 - 2,000',
    3: '¥2,001 - 3,000',
    4: '¥3,001 - 4,000',
    5: '¥4,001 - 5,000',
    6: '¥5,001 - 6,000',
    7: '¥6,001 - 7,000',
    8: '¥7,001 - 8,000',
    9: '¥8,001 - 9,000',
    10: '¥9,001 - 10,000',
    11: '¥10,001 - 20,000',
    12: '¥20,001 - 30,000',
    13: '¥30,001 - 40,000',
    14: '¥40,001 - 50,000',
    15: '¥50,001 - 60,000',
    16: 'Above ¥60,000'
  };
  return income[incomeCode as keyof typeof income] || '';
};

export const processGBAData = (data: GBAHealthData[]): (GBAHealthData & { BMI: number; emotional: number; social: number; psychological: number })[] => {
  return data.map(item => ({
    ...item,
    BMI: parseFloat(calculateBMI(item.weight, item.height).toFixed(1)),
    ...calculateMentalHealthScores(item)
  }));
};

export const processedGBAData = processGBAData(gbaData);