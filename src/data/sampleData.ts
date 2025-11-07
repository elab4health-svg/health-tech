// Sample data structure based on the provided JSON format
export interface HealthData {
  RespondentID: string;
  Country: string;
  Age: string;
  Gender: string;
  Ethnicity: string;
  Education: string;
  Income: string;
  PerceivedSES: string;
  HealthAppsHours: string;
  WearablesHours: string;
  PhysicalHealth: string;
  MH_a: string;
  MH_b: string;
  MH_c: string;
  MH_d: string;
  MH_e: string;
  MH_f: string;
  MH_g: string;
  MH_h: string;
  MH_i: string;
  MH_j: string;
  MH_k: string;
  MH_l: string;
  MH_m: string;
  MH_n: string;
  MentalHealth_Emotional: string;
  MentalHealth_Psychological: string;
  MentalHealth_Social: string;
  BMI: string;
  PhyActivity: string;
  'Veg&Fru': string;
}

export const countries = [
  { code: 'sg', name: 'Singapore', color: '#e11d48', coordinates: [1.3521, 103.8198] },
  { code: 'ph', name: 'Philippines', color: '#0ea5e9', coordinates: [12.8797, 121.7740] },
  { code: 'th', name: 'Thailand', color: '#10b981', coordinates: [15.8700, 100.9925] },
  { code: 'id', name: 'Indonesia', color: '#f59e0b', coordinates: [-0.7893, 113.9213] },
  { code: 'my', name: 'Malaysia', color: '#8b5cf6', coordinates: [4.2105, 101.9758] },
  { code: 'vn', name: 'Vietnam', color: '#06b6d4', coordinates: [14.0583, 108.2772] }
];

// Import your actual data - placeholder for now
// These would be imported from sg.json, ph.json, etc.
// For now, we'll generate sample data

const generateSampleDataForCountry = (countryCode: string, count: number): HealthData[] => {
  const data: HealthData[] = [];

  for (let i = 0; i < count; i++) {
    const respondentID = `${countryCode.toUpperCase()}_${String(i + 1).padStart(4, '0')}`;

    data.push({
      RespondentID: respondentID,
      Country: countryCode,
      Age: String(Math.floor(Math.random() * 50) + 20),
      Gender: String(Math.floor(Math.random() * 2) + 1),
      Ethnicity: String(Math.floor(Math.random() * 5) + 1),
      Education: String(Math.floor(Math.random() * 6) + 1),
      Income: String(Math.floor(Math.random() * 10) + 1),
      PerceivedSES: String(Math.floor(Math.random() * 5) + 1),
      HealthAppsHours: (Math.random() * 5).toFixed(2),
      WearablesHours: (Math.random() * 3).toFixed(2),
      PhysicalHealth: String(Math.floor(Math.random() * 5) + 1),
      MH_a: String(Math.floor(Math.random() * 6) + 1),
      MH_b: String(Math.floor(Math.random() * 6) + 1),
      MH_c: String(Math.floor(Math.random() * 6) + 1),
      MH_d: String(Math.floor(Math.random() * 6) + 1),
      MH_e: String(Math.floor(Math.random() * 6) + 1),
      MH_f: String(Math.floor(Math.random() * 6) + 1),
      MH_g: String(Math.floor(Math.random() * 6) + 1),
      MH_h: String(Math.floor(Math.random() * 6) + 1),
      MH_i: String(Math.floor(Math.random() * 6) + 1),
      MH_j: String(Math.floor(Math.random() * 6) + 1),
      MH_k: String(Math.floor(Math.random() * 6) + 1),
      MH_l: String(Math.floor(Math.random() * 6) + 1),
      MH_m: String(Math.floor(Math.random() * 6) + 1),
      MH_n: String(Math.floor(Math.random() * 6) + 1),
      MentalHealth_Emotional: '',
      MentalHealth_Psychological: '',
      MentalHealth_Social: '',
      BMI: (Math.random() * 10 + 18).toFixed(1),
      PhyActivity: String(Math.floor(Math.random() * 5) + 1),
      'Veg&Fru': String(Math.floor(Math.random() * 10))
    });
  }

  return data;
};

// Generate sample data for each country (1000 participants each)
const sgData = generateSampleDataForCountry('sg', 1000);
const phData = generateSampleDataForCountry('ph', 1000);
const thData = generateSampleDataForCountry('th', 1000);
const idData = generateSampleDataForCountry('id', 1000);
const myData = generateSampleDataForCountry('my', 1000);
const vnData = generateSampleDataForCountry('vn', 1000);

// Combine all data into a single array
export const sampleData: HealthData[] = [
  ...sgData,
  ...phData,
  ...thData,
  ...idData,
  ...myData,
  ...vnData
];

// If you need to transform any data or add missing fields, you can do it here
export const processData = (data: HealthData[]): HealthData[] => {
  return data.map(item => {
    // Calculate mental health subscales if they're missing
    if (!item.MentalHealth_Emotional || !item.MentalHealth_Psychological || !item.MentalHealth_Social) {
      const emotional = ((parseInt(item.MH_a) + parseInt(item.MH_b) + parseInt(item.MH_c)) / 3).toFixed(2);
      const psychological = ((parseInt(item.MH_i) + parseInt(item.MH_j) + parseInt(item.MH_l) +
                             parseInt(item.MH_m) + parseInt(item.MH_n) + parseInt(item.MH_d)) / 6).toFixed(2);
      const social = ((parseInt(item.MH_e) + parseInt(item.MH_f) + parseInt(item.MH_g) +
                      parseInt(item.MH_h) + parseInt(item.MH_k)) / 5).toFixed(2);

      return {
        ...item,
        MentalHealth_Emotional: emotional,
        MentalHealth_Psychological: psychological,
        MentalHealth_Social: social
      };
    }

    return item;
  });
};

// Export processed data
export const processedData = processData(sampleData);
