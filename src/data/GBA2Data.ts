import gba2Data from './gba2.json';

// Greater Bay Area Health Survey Data Structure - Sections C & D
export interface GBA2HealthData {
  respondentId: number;
  code: string; // "gba"
  // Section C: Dementia
  C1: number; // Know someone with dementia (1=No, 2=Yes)
  C2: number; // Relationship (0=N/A, 1=Partner/spouse, 2=Friend, 3=Parent, 4=Other)
  // Neurocognitive disorders diagnosis
  C3_1: number; // Major Neurocognitive Disorder
  C3_2: number; // Mild Cognitive Impairment
  C3_3: number; // Alzheimer's Disease
  C3_4: number; // Vascular Dementia
  C3_5: number; // Other neurodegenerative conditions
  C3_6: number; // None of the above
  // Dementia Knowledge Assessment Scale
  C4a_1: number; // Most forms don't shorten life [False]
  C4a_2: number; // Blood vessel disease most common [False]
  C4a_3: number; // People can recover [False]
  C4a_4: number; // Normal part of ageing [False]
  C4b_1: number; // Impossible to communicate [False]
  C4b_2: number; // Important to correct [False]
  C4b_3: number; // Communicate through body language [True]
  C4c_1: number; // Behaviours response to unmet needs [True]
  C4c_2: number; // Unlikely to experience depression [False]
  C4c_3: number; // Medications most effective [False]
  C4c_4: number; // Movement affected later stages [True]
  C4c_5: number; // Eating/drinking difficulty later [True]
  C4c_6: number; // Difficulty speaking advanced [True]
  C4c_7: number; // Difficulty learning new skills [True]
  C4c_8: number; // Daily care focus comfort [True]
  C4d_1: number; // High blood pressure increases risk [True]
  C4d_2: number; // Depression symptoms mistaken [True]
  C4d_3: number; // Exercise beneficial [True]
  C4d_4: number; // Early diagnosis doesn't improve [False]
  // Seeking Intention
  C5_1: number; // Plan to seek information
  C5_2: number; // Intend to find out more
  C5_3: number; // Try to seek much information
  // Information Avoidance
  C6_1: number; // Don't want more information
  C6_2: number; // Avoid news
  C6_3: number; // Avoid internet information
  C6_4: number; // Avoid personal communication
  // Attitude Toward Seeking (0-10 scale)
  C7_1: number; // Valuable
  C7_2: number; // Beneficial
  C7_3: number; // Helpful
  // Seeking-related subjective norms
  C8_1: number; // People close expect you to seek
  C8_2: number; // Important people think should seek
  C8_3: number; // People you spend time with likely seek
  // Perceived Seeking Control
  C9_1: number; // Easy to find information
  C9_2: number; // Not afraid to find information
  C9_3: number; // Able to find information
  // Perceived knowledge (0-100)
  C10_1: number; // Knowledge about dementia
  // Sufficiency threshold (0-100)
  C11_1: number; // How much knowledge needed
  // Perceived susceptibility
  C12_1: number; // Chances of developing great
  C12_2: number; // Future chances high
  C12_3: number; // Strong possibility
  C12_4: number; // Within 10 years
  // Perceived severity
  C13_1: number; // Thought scares me
  C13_2: number; // Heart beats faster
  C13_3: number; // Feelings about self change
  C13_4: number; // Feel nauseous
  C13_5: number; // More serious than other diseases
  // Elaboration
  C14_1: number; // Stop and think about news
  C14_2: number; // Relate to other things
  C14_3: number; // Carefully analyze information
  // Attention to media (1-5 scale)
  C15a_1: number; // Newspaper dementia news
  C15a_2: number; // Newspaper prevention news
  C15a_3: number; // Newspaper prevention campaigns
  C15b_1: number; // TV dementia news
  C15b_2: number; // TV prevention news
  C15b_3: number; // TV prevention campaigns
  C15c_1: number; // Internet dementia news
  C15c_2: number; // Internet prevention news
  C15c_3: number; // Internet prevention campaigns
  C15d_1: number; // Social media dementia news
  C15d_2: number; // Social media prevention news
  C15d_3: number; // Social media prevention campaigns
  // Interpersonal communication (1-5 scale)
  C16_1: number; // With family
  C16_2: number; // With friends
  C16_3: number; // With colleagues
  C16_4: number; // With healthcare providers
  // Perceived likelihood (0-100)
  C17_1: number; // Percent chance develop dementia
  
  // Section D: AI-assisted Health Technologies
  // Health wearables used
  D1_1: number; // Apple Watch
  D1_2: number; // Samsung Smartwatch
  D1_3: number; // Huawei Watch Fit
  D1_4: number; // Fitbit Watch
  D1_5: number; // Fitbit Tracker
  D1_6: number; // Mi Smart Band
  D1_7?: number; // Huawei Band
  D1_8: number; // Keep Watch
  D1_9: number; // OPPO Watch
  D1_10: number; // Amazfit Watch
  D1_11: number; // Honor Watch
  D1_12: number; // Garmin Watch
  D1_13: number; // Gao Chi Watch
  D1_14: number; // Others
  D1_15: number; // Never use
  // Time spent using wearables
  'D2a#1_1_1': number; // Hours
  'D2a#1_1_2': number; // Minutes
  'D2b#1_1_1': number; // Additional hours field
  'D2b#2_1_1': number; // Additional minutes field
  QID205: number; // Additional field
  // Health apps used
  D3_1: number; // Apple Health
  D3_2: number; // Strava
  D3_3: number; // MyFitnessPal
  D3_4: number; // 薄荷健康
  D3_5: number; // Pacer
  D3_6: number; // Samsung Health
  D3_7: number; // Huawei Health
  D3_8: number; // Mi Fit
  D3_9: number; // Garmin App
  D3_10: number; // 高驰COROS
  D3_11: number; // WeChat Sports
  D3_12: number; // Alipay Health
  D3_13: number; // Codoon
  D3_14: number; // Others
  D3_15: number; // Keep
  D3_16: number; // Mei You
  D3_17: number; // DaYiMa
  D3_18: number; // Ping An Good Doctor
  D3_19: number; // DingXiang Doctor
  D3_20: number; // WeDoctor
  D3_21: number; // Others specified
  D3_22: number; // Never use
  // Time spent using apps
  'D4a#1_1_1': number; // Hours
  'D4a#1_1_2': number; // Minutes
  'D4b#1_1_1': number; // Additional hours
  'D4b#2_1_1': number; // Additional minutes
  QID207: number; // Additional field
  // Dementia-specific apps interest
  D5: number; // Interest level (1-5)
  // Purpose for using dementia apps
  D6_1: number; // Monitoring memory
  D6_2: number; // Improving cognitive function
  D6_3: number; // Tracking activities
  D6_4: number; // Recording health data
  D6_5: number; // Remote communication
  D6_6: number; // Tracking family members
  D6_7: number; // Other
  // Perceived Familiarity (1-5 scale)
  D7_1: number; // Familiar with dementia apps
  D7_2: number; // Familiar with data use
  D7_3: number; // Familiar with data types
  // Internet stability (1-5 scale)
  D8: number;
  // Technology Maintenance
  'D3_1__1': number; // Cost higher than regular
  'D3_2__1': number; // Costs lot of money
  'D3_3__1': number; // Cost burden for dementia
  // Perception of Data Ownership
  D4_1: number; // Data is mine
  D4_2: number; // Personal ownership sense
  D4_3: number; // Emotionally mine
  D4_4: number; // Belongs to me
  D4_5: number; // Ownership feeling
  // Trust in AI
  D5_1: number; // Trust health recommendations
  D5_2: number; // Recommendations trustworthy
  D5_3: number; // Believe reliable
  // Perceived accuracy of AI
  'D6_1__1': number; // Think accurate
  'D6_2__1': number; // Generally accurate
  'D6_3__1': number; // Exact and correct
  // Technology Anxiety
  'D7_1__1': number; // Not technology person
  'D7_2__1': number; // Feel uneasy
  'D7_3__1': number; // Makes nervous
  // Data privacy concern
  D14_1: number; // Information misused
  D14_2: number; // Find private information
  D14_3: number; // Concerned about sharing
  // AI Optimism
  D15_1: number; // Like latest apps
  D15_2: number; // More convenient
  D15_3: number; // More control
  D15_4: number; // Feel excited
  // UTAUT - Performance Expectancy
  D16a_1: number; // Find useful
  D16a_2: number; // Accomplish quickly
  D16a_3: number; // Improve quality
  D16a_4: number; // Improve self-management
  // UTAUT - Effort Expectancy
  D16b_1: number; // Easy to learn
  D16b_2: number; // Easy to use
  D16b_3: number; // Get quite good at using
  // UTAUT - Social Influence
  D16c_1: number; // Important people believe should use
  D16c_2: number; // People who influence think should use
  D16c_3: number; // People whose opinions prefer to use
  // UTAUT - Facilitating Conditions
  D16d_1: number; // Have resources
  D16d_2: number; // Have knowledge
  D16d_3: number; // Compatible with other tech
  D16d_4: number; // Can get help
  // UTAUT - Hedonic Motivation
  D16e_1: number; // Fun
  D16e_2: number; // Enjoyable
  D16e_3: number; // Entertaining
  // UTAUT - Hedonic Value
  D16f_1: number; // Gave enjoyment
  D16f_2: number; // Gave fun
  D16f_3: number; // Stimulated curiosity
  // Health Data Monitoring
  D16g_1: number; // More easily monitor
  D16g_2: number; // Useful monitoring
  D16g_3: number; // More conveniently monitor
  // Price Value
  D16h_1: number; // Reasonably priced
  D16h_2: number; // Good relative to price
  D16h_3: number; // Economical
  D16h_4: number; // Cost burdensome
  // Intention to Use
  D16i_1: number; // Intend to use future
  D16i_2: number; // Use every opportunity
  D16i_3: number; // Plan to increase use
  // Intention to Purchase
  D16j_1: number; // Intend to purchase
  D16j_2: number; // Purchase every opportunity
  D16j_3: number; // Plan to increase purchase
  // Government Support
  D17_1: number; // Important role promoting
  D17_2: number; // Policies facilitate adoption
  D17_3: number; // Government endorses use
}

// Helper functions for dementia knowledge analysis
export const calculateDementiaKnowledgeScore = (data: GBA2HealthData): number => {
  const correctAnswers = [
    // Causes and Characteristics (all false)
    data.C4a_1 <= 2 ? 1 : 0, // False
    data.C4a_2 <= 2 ? 1 : 0, // False
    data.C4a_3 <= 2 ? 1 : 0, // False
    data.C4a_4 <= 2 ? 1 : 0, // False
    // Communication (mixed)
    data.C4b_1 <= 2 ? 1 : 0, // False
    data.C4b_2 <= 2 ? 1 : 0, // False
    data.C4b_3 >= 3 ? 1 : 0, // True
    // Care Needs (mixed)
    data.C4c_1 >= 3 ? 1 : 0, // True
    data.C4c_2 <= 2 ? 1 : 0, // False
    data.C4c_3 <= 2 ? 1 : 0, // False
    data.C4c_4 >= 3 ? 1 : 0, // True
    data.C4c_5 >= 3 ? 1 : 0, // True
    data.C4c_6 >= 3 ? 1 : 0, // True
    data.C4c_7 >= 3 ? 1 : 0, // True
    data.C4c_8 >= 3 ? 1 : 0, // True
    // Risks and Health Promotion (mixed)
    data.C4d_1 >= 3 ? 1 : 0, // True
    data.C4d_2 >= 3 ? 1 : 0, // True
    data.C4d_3 >= 3 ? 1 : 0, // True
    data.C4d_4 <= 2 ? 1 : 0, // False
  ];
  
  return correctAnswers.reduce((sum, score) => sum + score, 0) / correctAnswers.length * 100;
};

export const calculateTechnologyAcceptanceScores = (data: GBA2HealthData) => {
  return {
    performanceExpectancy: (data.D16a_1 + data.D16a_2 + data.D16a_3 + data.D16a_4) / 4,
    effortExpectancy: (data.D16b_1 + data.D16b_2 + data.D16b_3) / 3,
    socialInfluence: (data.D16c_1 + data.D16c_2 + data.D16c_3) / 3,
    facilitatingConditions: (data.D16d_1 + data.D16d_2 + data.D16d_3 + data.D16d_4) / 4,
    hedonicMotivation: (data.D16e_1 + data.D16e_2 + data.D16e_3) / 3,
    intentionToUse: (data.D16i_1 + data.D16i_2 + data.D16i_3) / 3,
    trustInAI: (data.D5_1 + data.D5_2 + data.D5_3) / 3,
    dataOwnership: (data.D4_1 + data.D4_2 + data.D4_3 + data.D4_4 + data.D4_5) / 5
  };
};

export const getWearableUsage = (data: GBA2HealthData): string[] => {
  const wearables = [
    { key: 'D1_1', name: 'Apple Watch' },
    { key: 'D1_2', name: 'Samsung Smartwatch' },
    { key: 'D1_3', name: 'Huawei Watch Fit' },
    { key: 'D1_4', name: 'Fitbit Watch' },
    { key: 'D1_5', name: 'Fitbit Tracker' },
    { key: 'D1_6', name: 'Mi Smart Band' },
    { key: 'D1_8', name: 'Keep Watch' },
    { key: 'D1_9', name: 'OPPO Watch' },
    { key: 'D1_10', name: 'Amazfit Watch' },
    { key: 'D1_11', name: 'Honor Watch' },
    { key: 'D1_12', name: 'Garmin Watch' }
  ];
  
  return wearables
    .filter(w => data[w.key as keyof GBA2HealthData] === 1)
    .map(w => w.name);
};

export const getHealthAppsUsage = (data: GBA2HealthData): string[] => {
  const apps = [
    { key: 'D3_1', name: 'Apple Health' },
    { key: 'D3_2', name: 'Strava' },
    { key: 'D3_3', name: 'MyFitnessPal' },
    { key: 'D3_4', name: '薄荷健康' },
    { key: 'D3_5', name: 'Pacer' },
    { key: 'D3_6', name: 'Samsung Health' },
    { key: 'D3_7', name: 'Huawei Health' },
    { key: 'D3_8', name: 'Mi Fit' },
    { key: 'D3_11', name: 'WeChat Sports' },
    { key: 'D3_12', name: 'Alipay Health' },
    { key: 'D3_15', name: 'Keep' }
  ];
  
  return apps
    .filter(app => data[app.key as keyof GBA2HealthData] === 1)
    .map(app => app.name);
};

export const processGBA2Data = (data: GBA2HealthData[]): (GBA2HealthData & { 
  dementiaKnowledgeScore: number;
  technologyAcceptance: ReturnType<typeof calculateTechnologyAcceptanceScores>;
  wearablesUsed: string[];
  appsUsed: string[];
})[] => {
  return data.map(item => ({
    ...item,
    dementiaKnowledgeScore: parseFloat(calculateDementiaKnowledgeScore(item).toFixed(1)),
    technologyAcceptance: calculateTechnologyAcceptanceScores(item),
    wearablesUsed: getWearableUsage(item),
    appsUsed: getHealthAppsUsage(item)
  }));
};

export const processedGBA2Data = processGBA2Data(gba2Data);