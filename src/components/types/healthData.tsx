export interface HealthDataRecord {
  HQ_COUNTRY: number;
  A1: number;
  A2: number;
  A3: number;
  A4: number;
  A5: number;
  A6: number;
  A7: number;
  A8: number;
  A9: string;
  A10: number;
  A11: number;
  A12: number;
  A13: number;
  HQ_A13: number;
  A14: string;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
  B5: number;
  B6: number;
  B7: number;
  B8: number;
  B9: string;
  B10_1: number;
  B10_2: number;
  B10_3: number;
  B10_4: number;
  B10_5: number;
  B10_6: number;
  B10_7: number;
  B10_8: number;
  B10_9: number;
  B11_1: number;
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
  B12: string;
}

export interface Country {
  code: string;
  name: string;
  color: string;
  coordinates: [number, number];
  hqCode: number;
}

export const countries: Country[] = [
  { code: 'sg', name: 'Singapore', color: '#e11d48', coordinates: [1.3521, 103.8198], hqCode: 1 },
  { code: 'my', name: 'Malaysia', color: '#8b5cf6', coordinates: [4.2105, 101.9758], hqCode: 2 },
  { code: 'ph', name: 'Philippines', color: '#0ea5e9', coordinates: [12.8797, 121.7740], hqCode: 3 },
  { code: 'th', name: 'Thailand', color: '#10b981', coordinates: [15.8700, 100.9925], hqCode: 4 },
  { code: 'vn', name: 'Vietnam', color: '#06b6d4', coordinates: [14.0583, 108.2772], hqCode: 5 },
  { code: 'id', name: 'Indonesia', color: '#f59e0b', coordinates: [-0.7893, 113.9213], hqCode: 6 }
];

export const labels = {
  citizenship: {
    1: 'Citizen',
    2: 'Permanent Resident',
    3: 'Foreigner'
  },
  gender: {
    1: 'Male',
    2: 'Female',
    3: 'Others'
  },
  ethnicity: {
    sg: {
      1: 'Chinese',
      2: 'Malay',
      3: 'Indian',
      4: 'Eurasian',
      5: 'Others'
    }
  },
  income: {
    1: 'Less than $1,000',
    2: '$1,000 to $1,999',
    3: '$2,000 to $2,999',
    4: '$3,000 to $3,999',
    5: '$4,000 to $4,999',
    6: '$5,000 to $5,999',
    7: '$6,000 to $6,999',
    8: '$7,000 to $7,999',
    9: '$8,000 to $8,999',
    10: '$9,000 to $9,999',
    11: '$10,000 to $10,999',
    12: '$11,000 to $11,999',
    13: '$12,000 to $12,999',
    14: '$13,000 to $13,999',
    15: '$14,000 to $14,999',
    16: '$15,000 to $15,999',
    17: '$16,000 to $16,999',
    18: '$17,000 to $17,999',
    19: '$18,000 to $18,999',
    20: '$19,000 to $19,999',
    21: '$20,000 and above'
  },
  education: {
    1: 'No formal education',
    2: 'Primary 6 or below',
    3: 'Some secondary',
    4: 'N-level/ITE',
    5: 'O-level',
    6: 'A-level/Diploma',
    7: 'Degree',
    8: 'Postgraduate',
    9: 'Others'
  },
  marital: {
    1: 'Single',
    2: 'Married',
    3: 'Widowed',
    4: 'Separated',
    5: 'Divorced',
    6: 'Others'
  },
  employment: {
    1: 'Employed full-time',
    2: 'Employed part-time',
    3: 'Self-employed',
    4: 'Currently laid off',
    5: 'On leave of absence',
    6: 'Retired',
    7: 'Homemaker',
    8: 'Full-time student',
    9: 'Others'
  },
  houseType: {
    1: 'Studio Apartment',
    2: '1-room HDB flat',
    3: '2-room HDB flat',
    4: '3-room HDB flat',
    5: '4-room HDB flat',
    6: '5-room HDB flat',
    7: 'Executive flat',
    8: 'Executive condominium (EC)',
    9: 'Condominium (excluding EC)',
    10: 'Terrace house',
    11: 'Bungalow/Detached house',
    12: 'Semi-detached house',
    13: 'Others'
  },
  health: {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very good',
    5: 'Excellent'
  },
  frequency: {
    physical: {
      1: 'Less than once per week',
      2: '1 to 2 times per week',
      3: '3 to 4 times per week',
      4: '5 to 6 times per week',
      5: 'More than 6 times per week'
    },
    sitting: {
      1: 'Less than 1 hour',
      2: '1 to 2 hours',
      3: '3 to 4 hours',
      4: '5 to 6 hours',
      5: 'More than 6 hours'
    },
    fruitVeg: {
      1: 'None',
      2: '½ serving or less',
      3: 'About 1 serving',
      4: 'About 2 servings',
      5: 'About 3 servings',
      6: 'About 4 servings',
      7: '5 or more servings'
    },
    alcohol: {
      1: 'Less than one day per week',
      2: '1 to 2 days per week',
      3: '3 to 4 days per week',
      4: '5 to 6 days per week',
      5: '7 days per week'
    }
  },
  smoking: {
    B8: {
      1: 'No',
      2: 'Yes',
      3: "Don't know/Not sure"
    },
    B9: {
      1: 'Not at all',
      2: 'Some days',
      3: 'Every day'
    }
  },
  mentalHealth: {
    1: 'Never',
    2: 'Once or twice in the past month',
    3: 'About once a week',
    4: 'About 2 or 3 times a week',
    5: 'Almost every day',
    6: 'Every day'
  },
  ecigDays: {
    1: '0 days',
    2: '1 to 9 days',
    3: '10 to 19 days',
    4: '20 to 29 days',
    5: 'Every day'
  }
};
