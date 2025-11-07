import { processedHKData, calculateMentalHealthScores } from './hkData';
import { processedGBAData, calculateMentalHealthScores as calculateGBAMentalHealth } from './GBAData';
import { processedHKCDData } from './hk2Data';
import { processedGBA2Data } from './GBA2Data';
import aseanData from './asean.json'; // Import the new asean.json
import { HealthDataRecord } from '../components/types/healthData'; // Make sure this interface matches your new JSON structure

// Combined data interface
export interface CombinedHealthData {
  respondentId: number | string;
  countryCode: string;
  countryName: string;
  region?: string;
  city?: string;
  // Basic health metrics
  generalHealth: number;
  physicalHealth: number;
  mentalHealth: number;
  emotional: number;
  social: number;
  psychological: number;
  // Technology usage
  healthAppsHours: number;
  wearablesHours: number;
  totalTechHours: number;
  // Demographics
  age: number;
  gender: number;
  education: number;
  income: number;
}

// Helper function to convert time fields to hours
const convertToHours = (hours: number, minutes: number): number => {
  return hours + (minutes / 60);
};

// Merge HK data (unchanged)
const mergeHKData = (): CombinedHealthData[] => {
  return processedHKData.map(hkItem => {
    // Find corresponding technology data
    const techData = processedHKCDData.find(cd => cd.respondentId === hkItem.respondentId);

    // Calculate technology usage hours
    let healthAppsHours = 0;
    let wearablesHours = 0;

    if (techData) {
      // Wearable hours from D2a fields
      const wearableHours = techData['D2a.1_1_1'] || 0;
      const wearableMinutes = techData['D2a.2_1_1'] || 0;
      wearablesHours = convertToHours(wearableHours, wearableMinutes);

      // Health app hours from D4a fields
      const appHours = techData['D4a.1_1_1'] || 0;
      const appMinutes = techData['D4a.2_1_1'] || 0;
      healthAppsHours = convertToHours(appHours, appMinutes);
    }

    // Calculate mental health scores
    const mentalHealthScores = calculateMentalHealthScores(hkItem);

    // Get region name
    const regionNames = ['', 'Hong Kong Island', 'Kowloon', 'New Territories'];
    const region = regionNames[hkItem.Region] || 'Unknown';

    return {
      respondentId: hkItem.respondentId,
      countryCode: 'hk',
      countryName: 'Hong Kong',
      region,
      generalHealth: hkItem.GeneralHealth,
      physicalHealth: hkItem.GeneralHealth,
      mentalHealth: (mentalHealthScores.emotional + mentalHealthScores.social + mentalHealthScores.psychological) / 3,
      emotional: mentalHealthScores.emotional,
      social: mentalHealthScores.social,
      psychological: mentalHealthScores.psychological,
      healthAppsHours: Number(healthAppsHours.toFixed(2)),
      wearablesHours: Number(wearablesHours.toFixed(2)),
      totalTechHours: Number((healthAppsHours + wearablesHours).toFixed(2)),
      age: hkItem.Age,
      gender: hkItem.Gender,
      education: hkItem.Education,
      income: hkItem.Income
    };
  });
};

// Merge GBA data (unchanged)
const mergeGBAData = (): CombinedHealthData[] => {
  return processedGBAData.map(gbaItem => {
    // Find corresponding technology data
    const techData = processedGBA2Data.find(cd => cd.respondentId === gbaItem.respondentId);

    // Calculate technology usage hours
    let healthAppsHours = 0;
    let wearablesHours = 0;

    if (techData) {
      // Wearable hours from D2a fields (note: GBA uses # instead of .)
      const wearableHours = techData['D2a#1_1_1'] || 0;
      const wearableMinutes = techData['D2a#1_1_2'] || 0;
      wearablesHours = convertToHours(wearableHours, wearableMinutes);

      // Health app hours from D4a fields
      const appHours = techData['D4a#1_1_1'] || 0;
      const appMinutes = techData['D4a#1_1_2'] || 0;
      healthAppsHours = convertToHours(appHours, appMinutes);
    }

    // Calculate mental health scores
    const mentalHealthScores = calculateGBAMentalHealth(gbaItem);

    // Get city name
    const getCityName = (cityCode: number): string => {
      const cities: { [key: number]: string } = {
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
      return cities[cityCode] || 'Unknown';
    };

    return {
      respondentId: gbaItem.respondentId,
      countryCode: 'gba',
      countryName: 'Greater Bay Area',
      city: getCityName(gbaItem.city),
      generalHealth: gbaItem.generalHealth,
      physicalHealth: gbaItem.generalHealth,
      mentalHealth: (mentalHealthScores.emotional + mentalHealthScores.social + mentalHealthScores.psychological) / 3,
      emotional: mentalHealthScores.emotional,
      social: mentalHealthScores.social,
      psychological: mentalHealthScores.psychological,
      healthAppsHours: Number(healthAppsHours.toFixed(2)),
      wearablesHours: Number(wearablesHours.toFixed(2)),
      totalTechHours: Number((healthAppsHours + wearablesHours).toFixed(2)),
      age: gbaItem.age,
      gender: gbaItem.gender,
      education: gbaItem.education,
      income: gbaItem.income
    };
  });
};

// UPDATED: Merge ASEAN data using the new asean.json format
const mergeASEANData = (): CombinedHealthData[] => {
  const aseanRecords = aseanData as HealthDataRecord[];
  
  return aseanRecords.map(aseanItem => {
    // Calculate mental health scores using the new B11 fields
    const emotional = (aseanItem.B11_1 + aseanItem.B11_2 + aseanItem.B11_3) / 3;
    const psychological = (aseanItem.B11_4 + aseanItem.B11_9 + aseanItem.B11_10 + aseanItem.B11_12 + aseanItem.B11_13 + aseanItem.B11_14) / 6;
    const social = (aseanItem.B11_5 + aseanItem.B11_6 + aseanItem.B11_7 + aseanItem.B11_8 + aseanItem.B11_11) / 5;
    const mentalHealth = (emotional + psychological + social) / 3;

    // Map HQ_COUNTRY codes to country information
    const countryMap: { [key: number]: { code: string, name: string } } = {
      1: { code: 'sg', name: 'Singapore' },
      2: { code: 'my', name: 'Malaysia' },
      3: { code: 'ph', name: 'Philippines' },
      4: { code: 'th', name: 'Thailand' },
      5: { code: 'vn', name: 'Vietnam' },
      6: { code: 'id', name: 'Indonesia' }
    };

    const countryInfo = countryMap[aseanItem.HQ_COUNTRY] || { code: 'unknown', name: 'Unknown' };

    // Use B4 and B5 as proxies for technology usage (since we don't have direct health app/wearable hours)
    // You may need to adjust these calculations based on your actual data meaning
    const healthAppsHours = aseanItem.B4; // Using B4 as proxy for health apps
    const wearablesHours = aseanItem.B5;  // Using B5 as proxy for wearables

    return {
      respondentId: aseanItem.HQ_COUNTRY + '_' + aseanItem.A1, // Create a unique ID
      countryCode: countryInfo.code,
      countryName: countryInfo.name,
      generalHealth: aseanItem.B3, // B3 is general health
      physicalHealth: aseanItem.B3, // Using B3 for physical health as well
      mentalHealth: Number(mentalHealth.toFixed(2)),
      emotional: Number(emotional.toFixed(2)),
      social: Number(social.toFixed(2)),
      psychological: Number(psychological.toFixed(2)),
      healthAppsHours: Number(healthAppsHours.toFixed(2)),
      wearablesHours: Number(wearablesHours.toFixed(2)),
      totalTechHours: Number((healthAppsHours + wearablesHours).toFixed(2)),
      age: aseanItem.A1,
      gender: aseanItem.A3,
      education: aseanItem.A6,
      income: aseanItem.A5
    };
  });
};

// Combine all data
export const combinedHealthData: CombinedHealthData[] = [
  ...mergeHKData(),
  ...mergeGBAData(),
  ...mergeASEANData()
];

// Define regions/countries for analysis (unchanged)
export const regions = [
  {
    code: 'hk',
    name: 'Hong Kong',
    color: '#3B82F6', // Blue
    flag: 'hk'
  },
  {
    code: 'gba',
    name: 'Greater Bay Area',
    color: '#EF4444', // Red
    flag: 'cn'
  },
  {
    code: 'sg',
    name: 'Singapore',
    color: '#e11d48',
    flag: 'sg'
  },
  {
    code: 'ph',
    name: 'Philippines',
    color: '#0ea5e9',
    flag: 'ph'
  },
  {
    code: 'th',
    name: 'Thailand',
    color: '#10b981',
    flag: 'th'
  },
  {
    code: 'id',
    name: 'Indonesia',
    color: '#f59e0b',
    flag: 'id'
  },
  {
    code: 'my',
    name: 'Malaysia',
    color: '#8b5cf6',
    flag: 'my'
  },
  {
    code: 'vn',
    name: 'Vietnam',
    color: '#06b6d4',
    flag: 'vn'
  }
];

// Calculate regional statistics (unchanged)
export const calculateRegionalStats = () => {
  return regions.map(region => {
    const regionData = combinedHealthData.filter(d => d.countryCode === region.code);

    if (regionData.length === 0) {
      return {
        ...region,
        participants: 0,
        healthApps: 0,
        wearables: 0,
        physicalHealth: 0,
        mentalHealth: 0,
        totalUsage: 0
      };
    }

    const avgHealthApps = regionData.reduce((sum, d) => sum + d.healthAppsHours, 0) / regionData.length;
    const avgWearables = regionData.reduce((sum, d) => sum + d.wearablesHours, 0) / regionData.length;
    const avgPhysicalHealth = regionData.reduce((sum, d) => sum + d.physicalHealth, 0) / regionData.length;
    const avgMentalHealth = regionData.reduce((sum, d) => sum + d.mentalHealth, 0) / regionData.length;

    return {
      ...region,
      participants: regionData.length,
      healthApps: Number(avgHealthApps.toFixed(2)),
      wearables: Number(avgWearables.toFixed(2)),
      physicalHealth: Number(avgPhysicalHealth.toFixed(2)),
      mentalHealth: Number(avgMentalHealth.toFixed(2)),
      totalUsage: Number((avgHealthApps + avgWearables).toFixed(2))
    };
  });
};