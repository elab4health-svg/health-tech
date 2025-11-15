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
  C1_1: number; C1_2: number; C1_3: number; C1_4: number; C1_5: number; C1_6: number; C1_7: number;
  C2_1: number; C2_2: number;
  C3_1: number; C3_2: number; C3_3: number; C3_4: number; C3_5: number; C3_6: number; C3_7: number;
  C3_8: number; C3_9: number; C3_10: number; C3_11: number; C3_12: number; C3_13: number; C3_14: number;
  C3_15: number; C3_16: number; C3_17: number; C3_18: number; C3_19: number; C3_20: number; C3_21: number;
  C3_22: number;
  C4_1: number; C4_2: number;
  C5_1: number; C5_2: number; C5_3: number; C5_4: number; C5_5: number; C5_6: number;
  C6_1: number; C6_2: number; C6_3: number;
  C7: number;
  C8_1: number; C8_2: number; C8_3: number;
  C9_1: number; C9_2: number; C9_3: number;
  ATTNCHECK1: number;
  C10A_1: number; C10A_2: number; C10A_3: number; C10A_4: number; C10A_5: number; C10A_6: number; C10A_7: number;
  C10B_1: number; C10B_2: number; C10B_3: number; C10B_4: number; C10B_5: number;
  C11_1: number; C11_2: number; C11_3: number; C11_4: number; C11_5: number;
  ATTNCHECK2: number;
  C12A_1: number; C12A_2: number; C12A_3: number; C12A_4: number;
  C12B_1: number; C12B_2: number; C12B_3: number;
  C12C_1: number; C12C_2: number; C12C_3: number;
  C12D_1: number; C12D_2: number; C12D_3: number;
  C13A_1: number; C13A_2: number; C13A_3: number;
  C13B_1: number; C13B_2: number; C13B_3: number; C13B_4: number;
  C13C_1: number; C13C_2: number; C13C_3: number; C13C_4: number;
  ATTNCHECK3: number;
  C14A_1: number; C14A_2: number; C14A_3: number; C14A_4: number;
  C14B_1: number; C14B_2: number; C14B_3: number;
  C14C_1: number; C14C_2: number; C14C_3: number;
  C14D_1: number; C14D_2: number; C14D_3: number; C14D_4: number;
  C15_1: number; C15_2: number; C15_3: number;
  C16_1: number; C16_2: number; C16_3: number;
  C17_1: string; C17_2: string; C17_3: string;
  C18_1: string; C18_2: string;
  
  // Section D: Social Environment
  D1_1: number; D1_2: number; D1_3: number; D1_4: number; D1_5: number; D1_6: number; D1_7: number;
  D1_8: number; D1_9: number;
  D2_1: number; D2_2: number; D2_3: number;
  D3_1: number; D3_2: number; D3_3: number;
  D4: number;
  ATTNCHECK4: number;
  D5_1: number; D5_2: number; D5_3: number; D5_4: number; D5_5: number; D5_6: number;
  D6_1: number; D6_2: number; D6_3: number; D6_4: number;
  D7_1: number; D7_2: number; D7_3: number;
  D8_1: number; D8_2: number; D8_3: number;
  D9_1: number; D9_2: number; D9_3: number;
  D10_1: number; D10_2: number; D10_3: number;
  D11_1: number; D11_2: number; D11_3: number;
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
import aseanData2 from "../data/asean2.json"

const mergeDatasets = (dataA: any[], dataB: any[]): HealthData[] => {
  return dataA.map((itemA, index) => {
    const itemB = dataB[index] || {};
    return {
      ...itemA,
      ...itemB
    };
  });
};

const rawData: HealthData[] = mergeDatasets(aseanData, aseanData2);

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