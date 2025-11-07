import hkCDData from './hk2.json';

// Hong Kong Dementia & AI Health Technology Survey Data Structure (Sections C & D)
export interface HKDementiaAIData {
  respondentId: number;
  CountryCode: string;
  
  // Section C: Dementia
  C1: number; // Know someone with dementia (1=No, 2=Yes)
  C2: number; // Relationship (0=N/A, 1=Partner/spouse, 2=Friend, 3=Parent, 4=Other)
  
  // C3: Diagnosed conditions (0=No, 1=Yes)
  C3_1: number; // Major Neurocognitive Disorder
  C3_2: number; // Mild Cognitive Impairment
  C3_3: number; // Alzheimer's Disease
  C3_4: number; // Vascular Dementia
  C3_5: number; // Other neurodegenerative conditions
  C3_6: number; // None of the above
  
  // C4: Dementia Knowledge Assessment (1=False, 2=Probably False, 3=Probably True, 4=True, 5=Don't Know)
  // Causes and Characteristics
  C4a_1: number; // Most forms don't shorten life [False]
  C4a_2: number; // Vascular dementia most common [False]
  C4a_3: number; // People can recover [False]
  C4a_4: number; // Normal part of aging [False]
  
  // Communication and Engagement
  C4b_1: number; // Impossible to communicate with advanced [False]
  C4b_2: number; // Important to correct when confused [False]
  C4b_3: number; // Advanced communicate through body language [True]
  
  // Care Needs
  C4c_1: number; // Uncharacteristic behaviors response to unmet needs [True]
  C4c_2: number; // Unlikely to experience depression [False]
  C4c_3: number; // Medications most effective for behavioral symptoms [False]
  C4c_4: number; // Movement affected in later stages [True]
  C4c_5: number; // Difficulty eating/drinking in later stages [True]
  C4c_6: number; // Advanced may have difficulty speaking [True]
  C4c_7: number; // Often have difficulty learning new skills [True]
  C4c_8: number; // Daily care effective when focuses on comfort [True]
  
  // Risks and Health Promotion
  C4d_1: number; // High blood pressure increases risk [True]
  C4d_2: number; // Depression symptoms can be mistaken [True]
  C4d_3: number; // Exercise generally beneficial [True]
  C4d_4: number; // Early diagnosis doesn't improve quality of life [False]
  
  // C5: Seeking Intention (1-7 scale)
  C5_1: number; // Plan to seek information
  C5_2: number; // Intend to find out more
  C5_3: number; // Will try to seek as much information
  
  // C6: Information Avoidance (1-7 scale)
  C6_1: number; // Don't want more information
  C6_2: number; // Avoid watching/reading news
  C6_3: number; // Avoid dementia-related information online
  C6_4: number; // Avoid personal communication
  
  // C7: Attitude Toward Seeking (0-10 scale)
  C7_1: number; // Valuable
  C7_2: number; // Beneficial
  C7_3: number; // Helpful
  
  // C8: Seeking-related subjective norms (1-7 scale)
  C8_1: number; // People close expect you to seek
  C8_2: number; // Important people think you should seek
  C8_3: number; // People you spend time with likely to seek
  
  // C9: Perceived Seeking Control (1-7 scale)
  C9_1: number; // Easy to find information
  C9_2: number; // Not afraid to find information
  C9_3: number; // Able to find information
  
  // C10 & C11: Knowledge scales (0-100)
  C10_1: number; // Perceived knowledge
  C11_1: number; // Sufficiency threshold
  
  // C12: Perceived Susceptibility (1-7 scale)
  C12_1: number; // Chances of developing are great
  C12_2: number; // Feel chances are high
  C12_3: number; // Strong possibility will develop
  C12_4: number; // Within next 10 years will develop
  
  // C13: Perceived Severity (1-7 scale)
  C13_1: number; // Thought scares me
  C13_2: number; // Heart beats faster when think about
  C13_3: number; // Feelings about self would change
  C13_4: number; // Feel nauseous when think about
  C13_5: number; // More serious than other diseases
  
  // C14: Elaboration (1-7 scale)
  C14_1: number; // Stop and think about news
  C14_2: number; // Relate to other things I know
  C14_3: number; // Carefully analyze information
  
  // C15: Attention to media (1-5 scale)
  // Newspaper
  C15a_1: number; // News stories related to dementia
  C15a_2: number; // Prevention news stories
  C15a_3: number; // Prevention campaigns
  
  // Television
  C15b_1: number; // News stories related to dementia
  C15b_2: number; // Prevention news stories
  C15b_3: number; // Prevention campaigns
  
  // Internet
  C15c_1: number; // News stories related to dementia
  C15c_2: number; // Prevention news stories
  C15c_3: number; // Prevention campaigns
  
  // Social Media
  C15d_1: number; // News stories related to dementia
  C15d_2: number; // Prevention news stories
  C15d_3: number; // Prevention campaigns
  
  // C16: Interpersonal Communication (1-5 scale)
  C16_1: number; // Family members
  C16_2: number; // Friends
  C16_3: number; // Colleagues
  C16_4: number; // Healthcare providers
  
  // C17: Perceived likelihood (0-100)
  C17_1: number; // Percent chance will develop dementia
  
  // Section D: AI-assisted Health Technologies
  // D1: Health wearables used (0=No, 1=Yes)
  D1_1: number; // Apple Watch
  D1_2: number; // Samsung Smartwatch
  D1_3: number; // Huawei Watch Fit
  D1_4: number; // Fitbit Watch
  D1_5: number; // Fitbit Tracker
  D1_6: number; // Mi Smart Band
  D1_10: number; // Huawei Band
  D1_8: number; // Others
  D1_9: number; // Never use
  
  // D2: Wearable usage time
  'D2a.1_1_1': number; // Hours
  'D2a.2_1_1': number; // Minutes
  QID205: number;
  'D2b.1_1_1': number;
  'D2b.2_1_1': number;
  
  // D3: Health apps used (0=No, 1=Yes)
  D3_1: number; // Apple Health
  D3_2: number; // Google Fit
  D3_3: number; // Strava
  D3_4: number; // MyFitnessPal
  D3_5: number; // Pacer
  D3_6: number; // Samsung Health
  D3_7: number; // Huawei Health
  D3_8: number; // Mi Fit
  D3_9: number; // DrGo
  D3_10: number; // iMeddy
  D3_11: number; // Flo/Clue
  D3_12: number; // HA Go
  D3_13: number; // eHealth
  D3_16: number; // Others
  D3_14: number; // Others (duplicate field)
  D3_15: number; // Never use
  
  // D4: Health app usage time
  'D4a.1_1_1': number; // Hours
  'D4a.2_1_1': number; // Minutes
  QID207: number;
  'D4b.1_1_1': number;
  'D4b.2_1_1': number;
  
  // D5: Dementia-specific apps/wearables
  D5: number; // 1=Never used not interested, 2=Never used might consider, 3=Used before stopped, 4=Currently using some, 5=Currently using actively
  
  // D6: Primary purpose for dementia apps (0=No, 1=Yes)
  D6_1: number; // Monitoring memory
  D6_2: number; // Improving cognitive function
  D6_3: number; // Tracking daily activities
  D6_4: number; // Recording health data
  D6_5: number; // Communicating with doctors/caregivers
  D6_6: number; // Tracking family members
  D6_7: number; // Other
  
  // D7: Perceived Familiarity (1-5 scale)
  D7_1: number; // Familiar with using for dementia management
  D7_2: number; // Familiar with how developers use data
  D7_3: number; // Familiar with types of data collected
  
  // D8: Digital Infrastructure
  D8: number; // Internet stability (1-5 scale)
  
  // D9: Technology Maintenance (1-7 scale)
  D9_1: number; // Cost higher than regular products
  D9_2: number; // Cost lot of money
  D9_3: number; // Cost burden for dementia management
  
  // D10: Perception of Data Ownership (1-7 scale)
  D10_1: number; // Data is mine
  D10_2: number; // Sense of personal ownership when using
  D10_3: number; // Emotionally feel data is mine
  D10_4: number; // Data belongs to me
  D10_5: number; // Sense of personal ownership towards data
  
  // D11: Trust in AI (1-7 scale)
  D11_1: number; // Trust health recommendations by AI
  D11_2: number; // Recommendations are trustworthy
  D11_3: number; // Believe recommendations are reliable
  
  // D12: Perceived Accuracy of AI (1-7 scale)
  D12_1: number; // Recommendations are accurate
  D12_2: number; // Generally accurate
  D12_3: number; // Exact and correct
  
  // D13: Technology Anxiety (1-7 scale)
  D13_1: number; // Not a technology person
  D13_2: number; // Feel uneasy using technology
  D13_3: number; // Using technology makes me nervous
  
  // D14: Data Privacy Concern (1-7 scale)
  D14_1: number; // Concerned information could be misused
  D14_2: number; // Concerned person can find private information
  D14_3: number; // Concerned about sharing information
  
  // D15: AI Optimism (1-7 scale)
  D15_1: number; // Like to use latest AI apps/wearables
  D15_2: number; // Latest will be more convenient
  D15_3: number; // Enable people to be more in control
  D15_4: number; // AI apps make me feel excited
  
  // D16: UTAUT - Performance Expectancy (1-7 scale)
  D16a_1: number; // Find useful in daily life
  D16a_2: number; // Accomplish things more quickly
  D16a_3: number; // Improves quality of daily health activities
  D16a_4: number; // Opportunity to improve health self-management
  
  // D16: UTAUT - Effort Expectancy (1-7 scale)
  D16b_1: number; // Learning to use is easy
  D16b_2: number; // Find easy to use
  D16b_3: number; // Easy to get good at using
  
  // D16: UTAUT - Social Influence (1-7 scale)
  D16c_1: number; // Important people believe I should use
  D16c_2: number; // People who influence behavior think I should use
  D16c_3: number; // People whose opinions I value prefer to use
  
  // D16: UTAUT - Facilitating Conditions (1-7 scale)
  D16d_1: number; // Have necessary resources
  D16d_2: number; // Have necessary knowledge
  D16d_3: number; // Compatible with other technologies
  D16d_4: number; // Can get help when have difficulties
  
  // D16: UTAUT - Hedonic Motivation (1-7 scale)
  D16e_1: number; // Using is fun
  D16e_2: number; // Using is enjoyable
  D16e_3: number; // Using is entertaining
  
  // D16: UTAUT - Hedonic Value (1-7 scale)
  D16f_1: number; // Gave me enjoyment
  D16f_2: number; // Gave fun to me
  D16f_3: number; // Stimulated my curiosity
  
  // D16: Health Data Monitoring (1-7 scale)
  D16g_1: number; // Allow me to more easily monitor
  D16g_2: number; // Useful in monitoring
  D16g_3: number; // Monitor more conveniently
  
  // D16: Price Value (1-7 scale)
  D16h_1: number; // Reasonably priced
  D16h_2: number; // Good relative to price
  D16h_3: number; // Economical
  D16h_4: number; // Cost is burdensome
  
  // D16: Intention to Use (1-7 scale)
  D16i_1: number; // Intend to use in future
  D16i_2: number; // Intend to use at every opportunity
  D16i_3: number; // Plan to increase use
  
  // D16: Intention to Purchase (1-7 scale)
  D16j_1: number; // Intend to purchase in future
  D16j_2: number; // Intend to purchase at every opportunity
  D16j_3: number; // Plan to increase purchase
  
  // D17: Government Support for Digital Health (1-7 scale)
  D17_1: number; // Government plays important role
  D17_2: number; // Policies facilitate adoption
  D17_3: number; // Government endorses use
  
  // D18: Government Support for Health Tech Infrastructure (1-7 scale)
  D18_1: number; // Important role in promoting development
  D18_2: number; // Policies facilitate development
  D18_3: number; // Government endorses development
}

// Helper functions for data analysis
export const calculateDementiaKnowledgeScore = (data: HKDementiaAIData): number => {
  // Calculate correct answers (4 points for correct, 0 for incorrect, 2.5 for "don't know")
  const correctAnswers = {
    // Causes and Characteristics (all should be False = 1)
    C4a_1: 1, C4a_2: 1, C4a_3: 1, C4a_4: 1,
    // Communication and Engagement
    C4b_1: 1, C4b_2: 1, C4b_3: 4, // C4b_3 should be True = 4
    // Care Needs
    C4c_1: 4, C4c_2: 1, C4c_3: 1, C4c_4: 4, C4c_5: 4, C4c_6: 4, C4c_7: 4, C4c_8: 4,
    // Risks and Health Promotion
    C4d_1: 4, C4d_2: 4, C4d_3: 4, C4d_4: 1
  };
  
  let totalScore = 0;
  let maxScore = 0;
  
  Object.entries(correctAnswers).forEach(([key, correctAnswer]) => {
    const userAnswer = (data as any)[key];
    maxScore += 4;
    
    if (userAnswer === correctAnswer) {
      totalScore += 4;
    } else if (userAnswer === 5) { // Don't know
      totalScore += 2.5;
    }
    // Incorrect answers get 0 points
  });
  
  return (totalScore / maxScore) * 100;
};

export const calculateSeekingIntention = (data: HKDementiaAIData): number => {
  return (data.C5_1 + data.C5_2 + data.C5_3) / 3;
};

export const calculateInformationAvoidance = (data: HKDementiaAIData): number => {
  return (data.C6_1 + data.C6_2 + data.C6_3 + data.C6_4) / 4;
};

export const calculateAttitudeTowardSeeking = (data: HKDementiaAIData): number => {
  return (data.C7_1 + data.C7_2 + data.C7_3) / 3;
};

export const calculatePerceivedSusceptibility = (data: HKDementiaAIData): number => {
  return (data.C12_1 + data.C12_2 + data.C12_3 + data.C12_4) / 4;
};

export const calculatePerceivedSeverity = (data: HKDementiaAIData): number => {
  return (data.C13_1 + data.C13_2 + data.C13_3 + data.C13_4 + data.C13_5) / 5;
};

export const calculateTrustInAI = (data: HKDementiaAIData): number => {
  return (data.D11_1 + data.D11_2 + data.D11_3) / 3;
};

export const calculateAIAccuracy = (data: HKDementiaAIData): number => {
  return (data.D12_1 + data.D12_2 + data.D12_3) / 3;
};

export const calculateTechnologyAnxiety = (data: HKDementiaAIData): number => {
  return (data.D13_1 + data.D13_2 + data.D13_3) / 3;
};

export const calculateDataPrivacyConcern = (data: HKDementiaAIData): number => {
  return (data.D14_1 + data.D14_2 + data.D14_3) / 3;
};

export const calculatePerformanceExpectancy = (data: HKDementiaAIData): number => {
  return (data.D16a_1 + data.D16a_2 + data.D16a_3 + data.D16a_4) / 4;
};

export const calculateEffortExpectancy = (data: HKDementiaAIData): number => {
  return (data.D16b_1 + data.D16b_2 + data.D16b_3) / 3;
};

export const calculateSocialInfluence = (data: HKDementiaAIData): number => {
  return (data.D16c_1 + data.D16c_2 + data.D16c_3) / 3;
};

export const calculateIntentionToUse = (data: HKDementiaAIData): number => {
  return (data.D16i_1 + data.D16i_2 + data.D16i_3) / 3;
};

export const getHealthWearablesUsed = (data: HKDementiaAIData): string[] => {
  const wearables = [
    { key: 'D1_1', name: 'Apple Watch' },
    { key: 'D1_2', name: 'Samsung Smartwatch' },
    { key: 'D1_3', name: 'Huawei Watch Fit' },
    { key: 'D1_4', name: 'Fitbit Watch' },
    { key: 'D1_5', name: 'Fitbit Tracker' },
    { key: 'D1_6', name: 'Mi Smart Band' },
    { key: 'D1_10', name: 'Huawei Band' },
    { key: 'D1_8', name: 'Others' }
  ];
  
  return wearables.filter(w => (data as any)[w.key] === 1).map(w => w.name);
};

export const getHealthAppsUsed = (data: HKDementiaAIData): string[] => {
  const apps = [
    { key: 'D3_1', name: 'Apple Health' },
    { key: 'D3_2', name: 'Google Fit' },
    { key: 'D3_3', name: 'Strava' },
    { key: 'D3_4', name: 'MyFitnessPal' },
    { key: 'D3_5', name: 'Pacer' },
    { key: 'D3_6', name: 'Samsung Health' },
    { key: 'D3_7', name: 'Huawei Health' },
    { key: 'D3_8', name: 'Mi Fit' },
    { key: 'D3_9', name: 'DrGo' },
    { key: 'D3_10', name: 'iMeddy' },
    { key: 'D3_11', name: 'Flo/Clue' },
    { key: 'D3_12', name: 'HA Go' },
    { key: 'D3_13', name: 'eHealth' }
  ];
  
  return apps.filter(a => (data as any)[a.key] === 1).map(a => a.name);
};

export const processHKCDData = (data: HKDementiaAIData[]): HKDementiaAIData[] => {
  return data.map(item => ({
    ...item,
    dementiaKnowledgeScore: calculateDementiaKnowledgeScore(item),
    seekingIntention: calculateSeekingIntention(item),
    informationAvoidance: calculateInformationAvoidance(item),
    attitudeTowardSeeking: calculateAttitudeTowardSeeking(item),
    perceivedSusceptibility: calculatePerceivedSusceptibility(item),
    perceivedSeverity: calculatePerceivedSeverity(item),
    trustInAI: calculateTrustInAI(item),
    aiAccuracy: calculateAIAccuracy(item),
    technologyAnxiety: calculateTechnologyAnxiety(item),
    dataPrivacyConcern: calculateDataPrivacyConcern(item),
    performanceExpectancy: calculatePerformanceExpectancy(item),
    effortExpectancy: calculateEffortExpectancy(item),
    socialInfluence: calculateSocialInfluence(item),
    intentionToUse: calculateIntentionToUse(item),
    healthWearablesUsed: getHealthWearablesUsed(item),
    healthAppsUsed: getHealthAppsUsed(item)
  }));
};

export const processedHKCDData = processHKCDData(hkCDData as HKDementiaAIData[]);