// Sample data structure based on the provided JSON format
export interface HealthData {
  HQ_COUNTRY: number;
  A1: number; // Age
  A2: number; // Citizenship
  A3: number; // Gender
  A4: number; // Ethnicity
  A5: number; // Income
  A6: number; // Education
  A7: number; // Marital status
  A8: number; // Have children
  A9: number | string; // Number of children
  A10: number; // Employment status
  A11: number; // Housing type
  A12: number; // Perceived SES
  A13: number; // Postal code
  B1: number; // Height
  B2: number; // Weight
  B3: number; // General health
  B4: number; // Physical activity frequency
  B5: number; // Sitting duration
  B6: number; // Fruit & vegetable consumption
  B7: number; // Alcohol consumption
  B8: number; // Smoking history
  B9: number | string; // Current smoking frequency
  B10_1: number; // Cancer
  B10_2: number; // Diabetes
  B10_3: number; // High blood pressure
  B10_4: number; // Heart condition
  B10_5: number; // Lung disease
  B10_6: number; // Arthritis
  B10_7: number; // Infectious disease
  B10_8: number; // Other medical condition
  B10_9: number; // None of the above
  B11_1: number; // Mental health questions
  B11_2: number;
  B11_3: number;
  B11_4: number;
  B11_5: number;
  B11_6: number;
  B11_7: number;
  B11_8: number;
  B11_9: number;
  B11_10: number;
  B11_11: number;
  B11_12: number;
  B11_13: number;
  B11_14: number;
  B12: number | string; // E-cigarette usage
}

export const countries = [
  { code: 'sg', name: 'Singapore', color: '#e11d48', coordinates: [1.3521, 103.8198], hqCode: 1 },
  { code: 'my', name: 'Malaysia', color: '#8b5cf6', coordinates: [4.2105, 101.9758], hqCode: 2 },
  { code: 'ph', name: 'Philippines', color: '#0ea5e9', coordinates: [12.8797, 121.7740], hqCode: 3 },
  { code: 'th', name: 'Thailand', color: '#10b981', coordinates: [15.8700, 100.9925], hqCode: 4 },
  { code: 'vn', name: 'Vietnam', color: '#06b6d4', coordinates: [14.0583, 108.2772], hqCode: 5 },
  { code: 'id', name: 'Indonesia', color: '#f59e0b', coordinates: [-0.7893, 113.9213], hqCode: 6 }
];

import aseanData from "../data/asean.json"

const rawData: HealthData[] = aseanData as HealthData[];

export const processData = (data: HealthData[]): HealthData[] => {
  return data.map(item => {
    // Calculate BMI
    const bmi = item.B1 > 0 && item.B2 > 0 ? item.B2 / ((item.B1 / 100) ** 2) : 0;
    
    // Calculate mental health scores (same as your existing function)
    const emotional = (item.B11_1 + item.B11_2 + item.B11_3) / 3;
    const psychological = (item.B11_4 + item.B11_9 + item.B11_10 + item.B11_12 + item.B11_13 + item.B11_14) / 6;
    const social = (item.B11_5 + item.B11_6 + item.B11_7 + item.B11_8 + item.B11_11) / 5;
    
    return {
      ...item,
      // Add any calculated fields if needed
      BMI: bmi,
      MentalHealth_Emotional: emotional,
      MentalHealth_Psychological: psychological,
      MentalHealth_Social: social,
      MentalHealth_Overall: (emotional + psychological + social) / 3
    };
  });
};

// Export processed data
export const processedData = processData(rawData);

// Helper function to get country data by HQ_COUNTRY code
export const getCountryData = (hqCode: number): HealthData[] => {
  return processedData.filter(item => item.HQ_COUNTRY === hqCode);
};

// Helper function to get country by code
export const getCountryByCode = (code: string) => {
  return countries.find(country => country.code === code);
};