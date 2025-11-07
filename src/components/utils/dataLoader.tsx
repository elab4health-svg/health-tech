import { HealthDataRecord } from '../types/healthData';
import healthData from '../../data/asean.json';

let cachedData: HealthDataRecord[] = healthData;

export async function loadHealthData(): Promise<HealthDataRecord[]> {
  return cachedData;
}

// Your other functions remain the same
export function filterByCountry(data: HealthDataRecord[], hqCode: number): HealthDataRecord[] {
  return data.filter(record => record.HQ_COUNTRY === hqCode);
}

export function calculateBMI(height: number, weight: number): number {
  if (height <= 0 || weight <= 0) return 0;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function calculateMentalHealthScores(record: HealthDataRecord) {
  const emotional = (record.B11_1 + record.B11_2 + record.B11_3) / 3;
  const psychological = (record.B11_4 + record.B11_9 + record.B11_10 + record.B11_12 + record.B11_13 + record.B11_14) / 6;
  const social = (record.B11_5 + record.B11_6 + record.B11_7 + record.B11_8 + record.B11_11) / 5;

  return {
    emotional: parseFloat(emotional.toFixed(2)),
    psychological: parseFloat(psychological.toFixed(2)),
    social: parseFloat(social.toFixed(2)),
    overall: parseFloat(((emotional + psychological + social) / 3).toFixed(2))
  };
}