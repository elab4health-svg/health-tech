import hkData from './hk.json';

// Hong Kong Health Survey Data Structure
export interface HKHealthData {
  respondentId: number;
  CountryCode: string;
  Gender: number; // 1=Male, 2=Female, 3=Others
  Age: number;
  Education: number; // 1=Middle school or below, 2=High school, 3=Foundation diploma, 4=Higher diploma, 5=Bachelor's, 6=Master's, 7=Doctoral
  Income: number; // 1=Below 10k, 2=10k-20k, 3=20k-30k, 4=30k-40k, 5=40k-50k, 6=50k-60k, 7=Above 60k
  Employment: number; // 1=Full time, 2=Part time, 3=Unemployed, 4=Disability pension, 5=Retired, 6=Home duties, 7=Student, 8=Other
  MaritalStatus: number; // 1=Never married, 2=Married/living with partner, 3=Divorced/separated, 4=Widowed
  Region: number; // 1=Hong Kong Island, 2=Kowloon, 3=New Territories
  DistrictIsland: number; // For Hong Kong Island residents
  DistrictKowloon: number; // For Kowloon residents
  DistrictNT: number; // For New Territories residents
  Ladder: number; // Social ladder position 1-10
  Height: number; // cm
  Weight: number; // kg
  GeneralHealth: number; // 1=Poor, 2=Fair, 3=Good, 4=Very good, 5=Excellent
  physicalActivity: number; // 1=<1/week, 2=1-2/week, 3=3-4/week, 4=5-6/week, 5=>6/week
  'Fruits&Veg': number; // 1=None, 2=≤0.5 serving, 3=~1 serving, 4=~2 servings, 5=~3 servings, 6=~4 servings, 7=≥5 servings
  AlcoholicDrink: number; // 1=<1 day/week, 2=1-2 days/week, 3=3-4 days/week, 4=5-6 days/week, 5=7 days/week
  Smoking100Cigs: number; // 1=No, 2=Yes, 3=Don't know
  Smoking: number; // 1=Not at all, 2=Some days, 3=Every day (0 if doesn't smoke)
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
  'B11.1_1_1': number; // Bedtime hour
  'B11.2_1_1': number; // Bedtime minute
  'B12.1_1_1': number; // Wake time hour
  'B12.2_1_1': number; // Wake time minute
  B13: number; // Time to fall asleep (minutes)
  'B14a.1_1_1': number; // Sleep duration hours
  'B14a.2_1_1': number; // Sleep duration minutes
  QID97: number;
  'B14b.1_1_1': number;
  'B14b.2_1_1': number;
  SleepingTrouble: number; // 1=None, 2=<1/week, 3=1-2/week, 4=≥3/week
  SleepQuality: number; // 1=Very good, 2=Good, 3=Poor, 4=Very poor
  // Loneliness scale
  Loneliness: number; // Lack of companionship
  Ignored: number; // Feel left out/ignored
  Isolated: number; // Feel isolated
}

// Helper functions for data analysis
export const calculateBMI = (weight: number, height: number): number => {
  return weight / Math.pow(height / 100, 2);
};

export const calculateMentalHealthScores = (data: HKHealthData) => {
  // Emotional wellbeing (items 1, 2, 3)
  const emotional = (data.B10_1 + data.B10_2 + data.B10_3) / 3;
  
  // Social wellbeing (items 4, 5, 6, 7, 8)
  const social = (data.B10_4 + data.B10_5 + data.B10_6 + data.B10_7 + data.B10_8) / 5;
  
  // Psychological wellbeing (items 9, 10, 11, 12, 13, 14)
  const psychological = (data.B10_9 + data.B10_10 + data.B10_11 + data.B10_12 + data.B10_13 + data.B10_14) / 6;
  
  return { emotional, social, psychological };
};

export const getDistrictName = (region: number, districtCode: number): string => {
  if (region === 1) { // Hong Kong Island
    const districts = ['', 'Central & Western', 'Wan Chai', 'Eastern', 'Southern'];
    return districts[districtCode] || '';
  } else if (region === 2) { // Kowloon
    const districts = ['', 'Yau Tsim Mong', 'Sham Shui Po', 'Kowloon City', 'Wong Tai Sin', 'Kwun Tong'];
    return districts[districtCode] || '';
  } else if (region === 3) { // New Territories
    const districts = ['', 'Kwai Tsing', 'Tsuen Wan', 'Tuen Mun', 'Yuen Long', 'North', 'Tai Po', 'Sha Tin', 'Sai Kung', 'Islands'];
    return districts[districtCode] || '';
  }
  return '';
};

export const processHKData = (data: HKHealthData[]): HKHealthData[] => {
  return data.map(item => ({
    ...item,
    BMI: parseFloat(calculateBMI(item.Weight, item.Height).toFixed(1)),
    ...calculateMentalHealthScores(item)
  }));
};

export const processedHKData = processHKData(hkData as HKHealthData[]);