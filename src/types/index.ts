export type LanguageCode = 'ar' | 'en' | 'ur' | 'id' | 'ms' | 'tr' | 'fr' | 'bn' | 'es';

export type UserRole = 'USER' | 'ADMIN' | 'CONTENT_REVIEWER';

export type FeedbackCategory = 
  | 'AI Assistant'
  | 'Quran'
  | 'Hajj & Umrah'
  | 'Makkah'
  | 'Madinah'
  | 'Prayer'
  | 'Qibla'
  | 'Camera AI'
  | 'Overall Experience'
  | 'Other';

export interface FeedbackItem {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  rating: number; // 1-5
  comment: string;
  category: FeedbackCategory;
  hasProblem: boolean;
  problemDescription?: string;
  createdAt: string;
  reviewedByAdmin?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string;
  city: string;
  language: LanguageCode;
  phone?: string;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  preferences: {
    prayerCalculationMethod: string;
    asrJuristic: 'standard' | 'hanafi';
    notifications: boolean;
    hajjUmrahInterest: boolean;
    learningInterest: boolean;
  };
}

export interface QuranSurah {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  translationEnglish: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  juzStart: number;
  sampleAyahs: {
    numberInSurah: number;
    textArabic: string;
    translationEnglish: string;
    translationUrdu?: string;
    audioUrl?: string;
    tafsirSummary?: string;
  }[];
}

export interface HadithItem {
  id: string;
  collection: 'Bukhari' | 'Muslim' | 'Abu Dawud' | 'Tirmidhi' | 'Nawawi 40';
  bookNumber?: number;
  hadithNumber: string | number;
  category: 'Faith' | 'Prayer' | 'Hajj & Umrah' | 'Purification' | 'Manners' | 'Knowledge';
  narrator: string;
  textArabic: string;
  textTranslation: string;
  grade: 'Sahih' | 'Hasan';
  scholarGrading?: string;
  sourceUrl?: string;
}

export interface DuaItem {
  id: string;
  category: 'morning' | 'evening' | 'prayer' | 'sleep' | 'travel' | 'hajj_umrah' | 'quranic';
  titleArabic: string;
  titleEnglish: string;
  textArabic: string;
  transliteration?: string;
  translation: string;
  reference: string;
  virtue?: string;
  repeatTarget: number;
}

export interface GateInfo {
  id: string;
  mosque: 'haram' | 'prophet';
  gateNumber: number | string;
  nameArabic: string;
  nameEnglish: string;
  locationArea: string;
  areaServed: string;
  nearbyLandmarks: string;
  accessibility: {
    wheelchairRamp: boolean;
    escalator: boolean;
    elderlyCarts: boolean;
    brailleSignage: boolean;
  };
  latitude: number;
  longitude: number;
  officialSource: string;
  lastVerifiedDate: string;
  isOpen: boolean;
  notes?: string;
}

export interface HaramainLocation {
  id: string;
  city: 'makkah' | 'madinah';
  category: 'holy_site' | 'miqat' | 'historical' | 'transport' | 'service';
  nameArabic: string;
  nameEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  latitude: number;
  longitude: number;
  visitingHours?: string;
  guidelines?: string[];
  historicalSignificance?: string;
  officialSource: string;
  lastVerified: string;
  imageUrl?: string;
}

export interface TripActivity {
  id: string;
  dayNumber: number;
  timeSlot: string;
  title: string;
  description: string;
  location?: string;
  category: 'prayer' | 'umrah' | 'hajj' | 'rawdah' | 'ziyarah' | 'rest' | 'transport';
  completed: boolean;
}

export interface TripPlan {
  id: string;
  userId: string;
  destination: 'makkah' | 'madinah' | 'both';
  startDate: string;
  endDate: string;
  travelersCount: number;
  hotelMakkah?: string;
  hotelMadinah?: string;
  activities: TripActivity[];
  rawdahAppointmentTime?: string;
  notes: string;
  createdAt: string;
}

export interface VerifiedSource {
  id: string;
  name: string;
  authority: string;
  category: 'Quran & Tafsir' | 'Hadith' | 'Fiqh Council' | 'Government Authority' | 'Official Haramain';
  url: string;
  language: string;
  isVerified: boolean;
  lastAuditedDate: string;
  description: string;
}

export interface SourceCitation {
  title: string;
  authority: string;
  reference: string;
  url?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'manar';
  text: string;
  timestamp: string;
  mode?: string;
  answerData?: {
    answer: string;
    explanation?: string;
    evidence?: string;
    verseOrHadith?: string;
    sources?: SourceCitation[];
    isDisputed?: boolean;
    differingViews?: { view: string; proponents: string; evidence: string }[];
    uncertaintyNotice?: string;
  };
  imageAttachment?: string;
}

export interface OfficialServiceLink {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  authority: string;
  url: string;
  iconName: string;
  category: 'permit' | 'visa' | 'train' | 'mosque_care';
  disclaimer: string;
  lastVerified: string;
}

export interface AdminLog {
  id: string;
  adminName: string;
  action: string;
  targetContent: string;
  timestamp: string;
  details: string;
}
