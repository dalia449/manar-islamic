export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: {
    name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
    nameArabic: string;
    time: string;
    minutesRemaining: number;
    formattedCountdown: string;
  };
}

export interface CityPreset {
  nameArabic: string;
  nameEnglish: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
}

export const CITIES_CATALOG: CityPreset[] = [
  { nameArabic: 'مكة المكرمة (الحرم المكي)', nameEnglish: 'Makkah Al-Mukarramah', country: 'السعودية', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { nameArabic: 'المدينة المنورة (المسجد النبوي)', nameEnglish: 'Madinah Al-Munawwarah', country: 'السعودية', lat: 24.4672, lng: 39.6111, timezone: 3 },
  { nameArabic: 'الرياض', nameEnglish: 'Riyadh', country: 'السعودية', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { nameArabic: 'جدة', nameEnglish: 'Jeddah', country: 'السعودية', lat: 21.5433, lng: 39.1728, timezone: 3 },
  { nameArabic: 'القاهرة', nameEnglish: 'Cairo', country: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { nameArabic: 'إسطنبول', nameEnglish: 'Istanbul', country: 'تركيا', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { nameArabic: 'جاكرتا', nameEnglish: 'Jakarta', country: 'إندونيسيا', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { nameArabic: 'كوالالمبور', nameEnglish: 'Kuala Lumpur', country: 'ماليزيا', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { nameArabic: 'لندن', nameEnglish: 'London', country: 'بريطانيا', lat: 51.5074, lng: -0.1278, timezone: 1 },
  { nameArabic: 'نيويورك', nameEnglish: 'New York', country: 'الولايات المتحدة', lat: 40.7128, lng: -74.0060, timezone: -4 },
  { nameArabic: 'دبي', nameEnglish: 'Dubai', country: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { nameArabic: 'دكا', nameEnglish: 'Dhaka', country: 'بنغلاديش', lat: 23.8103, lng: 90.4125, timezone: 6 },
  { nameArabic: 'باريس', nameEnglish: 'Paris', country: 'فرنسا', lat: 48.8566, lng: 2.3522, timezone: 2 }
];

export class PrayerService {
  // Method configurations
  private getMethodParams(method: string): { fajrAngle: number; ishaAngle: number; ishaInterval?: number } {
    switch (method) {
      case 'UmmAlQura': // Makkah: Fajr 18.5 deg, Isha 90 mins after Maghrib (120 mins in Ramadan)
        return { fajrAngle: 18.5, ishaAngle: 0, ishaInterval: 90 };
      case 'Egyptian': // Egyptian General Authority: Fajr 19.5 deg, Isha 17.5 deg
        return { fajrAngle: 19.5, ishaAngle: 17.5 };
      case 'MWL': // Muslim World League: Fajr 18 deg, Isha 17 deg
        return { fajrAngle: 18, ishaAngle: 17 };
      case 'ISNA': // North America: Fajr 15 deg, Isha 15 deg
        return { fajrAngle: 15, ishaAngle: 15 };
      case 'Karachi': // University of Islamic Sciences, Karachi: Fajr 18 deg, Isha 18 deg
        return { fajrAngle: 18, ishaAngle: 18 };
      default:
        return { fajrAngle: 18.5, ishaAngle: 0, ishaInterval: 90 };
    }
  }

  // Astronomical Solar Coordinates Calculation
  calculate(
    lat: number,
    lng: number,
    date: Date = new Date(),
    method: string = 'UmmAlQura',
    asrJuristic: 'standard' | 'hanafi' = 'standard'
  ): PrayerTimes {
    const params = this.getMethodParams(method);
    const dayOfYear = this.getDayOfYear(date);

    // Approximate solar declination (delta in degrees)
    const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const declination = 23.45 * Math.sin(b);
    const decRad = (declination * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    // Equation of Time in minutes
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

    // Solar noon time in standard local decimal hours
    // Using user local timezone offset
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;
    const solarNoon = 12 + timezoneOffsetHours - lng / 15 - eot / 60;

    // Helper for hour angle given depression angle alpha
    const getHourAngle = (angle: number): number => {
      const angleRad = (angle * Math.PI) / 180;
      const cosH = (-Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
      if (cosH > 1) return 0;
      if (cosH < -1) return 180;
      return (Math.acos(cosH) * 180) / Math.PI;
    };

    // Sunrise & Sunset angle is 0.833 degrees (accounting for refraction and solar radius)
    const sunsetH = getHourAngle(0.833) / 15;
    const sunriseTime = solarNoon - sunsetH;
    const maghribTime = solarNoon + sunsetH;

    // Fajr
    const fajrH = getHourAngle(params.fajrAngle) / 15;
    const fajrTime = solarNoon - fajrH;

    // Asr calculation
    const shadowFactor = asrJuristic === 'hanafi' ? 2 : 1;
    const asrAltitudeRad = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad))));
    const cosAsrH = (Math.sin(asrAltitudeRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    const asrH = (Math.acos(Math.max(-1, Math.min(1, cosAsrH))) * 180) / Math.PI / 15;
    const asrTime = solarNoon + asrH;

    // Isha calculation
    let ishaTime: number;
    if (params.ishaInterval) {
      ishaTime = maghribTime + params.ishaInterval / 60;
    } else {
      const ishaH = getHourAngle(params.ishaAngle) / 15;
      ishaTime = solarNoon + ishaH;
    }

    const formatTime = (decimalHours: number): string => {
      let totalMinutes = Math.round(decimalHours * 60);
      totalMinutes = (totalMinutes + 1440) % 1440;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const fajrStr = formatTime(fajrTime);
    const sunriseStr = formatTime(sunriseTime);
    const dhuhrStr = formatTime(solarNoon);
    const asrStr = formatTime(asrTime);
    const maghribStr = formatTime(maghribTime);
    const ishaStr = formatTime(ishaTime);

    // Determine next prayer and countdown
    const currentMinutes = date.getHours() * 60 + date.getMinutes();
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const prayerSchedule: { name: PrayerTimes['nextPrayer']['name']; nameArabic: string; time: string; minutes: number }[] = [
      { name: 'Fajr', nameArabic: 'الفجر', time: fajrStr, minutes: toMinutes(fajrStr) },
      { name: 'Sunrise', nameArabic: 'الشروق', time: sunriseStr, minutes: toMinutes(sunriseStr) },
      { name: 'Dhuhr', nameArabic: 'الظهر', time: dhuhrStr, minutes: toMinutes(dhuhrStr) },
      { name: 'Asr', nameArabic: 'العصر', time: asrStr, minutes: toMinutes(asrStr) },
      { name: 'Maghrib', nameArabic: 'المغرب', time: maghribStr, minutes: toMinutes(maghribStr) },
      { name: 'Isha', nameArabic: 'العشاء', time: ishaStr, minutes: toMinutes(ishaStr) },
    ];

    let next = prayerSchedule.find(p => p.minutes > currentMinutes);
    let minutesRemaining: number;

    if (!next) {
      // Next is tomorrow's Fajr
      next = prayerSchedule[0];
      minutesRemaining = 1440 - currentMinutes + next.minutes;
    } else {
      minutesRemaining = next.minutes - currentMinutes;
    }

    const remHours = Math.floor(minutesRemaining / 60);
    const remMins = minutesRemaining % 60;
    const formattedCountdown = remHours > 0 ? `${remHours} ساعة و ${remMins} دقيقة` : `${remMins} دقيقة`;

    return {
      fajr: fajrStr,
      sunrise: sunriseStr,
      dhuhr: dhuhrStr,
      asr: asrStr,
      maghrib: maghribStr,
      isha: ishaStr,
      nextPrayer: {
        name: next.name,
        nameArabic: next.nameArabic,
        time: next.time,
        minutesRemaining,
        formattedCountdown,
      }
    };
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

export const prayerService = new PrayerService();
