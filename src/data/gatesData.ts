import { GateInfo } from '../types';

export const VERIFIED_GATES: GateInfo[] = [
  {
    id: 'gate-makkah-1',
    mosque: 'haram',
    gateNumber: 1,
    nameArabic: 'باب الملك عبد العزيز',
    nameEnglish: 'King Abdulaziz Gate',
    locationArea: 'الجهة الجنوبية الغربية (South-West)',
    areaServed: 'الصحن الأرضي والمطاف والمسعى الجنوبي',
    nearbyLandmarks: 'أبراج البيت (ساعة مكة)، وقف الملك عبد العزيز، ساحة أجياد',
    accessibility: {
      wheelchairRamp: true,
      escalator: true,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 21.4208,
    longitude: 39.8252,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'بوابة رئيسية تاريخية مجهزة بكافة خدمات الوصول الشامل وعربات الطواف لكبار السن.'
  },
  {
    id: 'gate-makkah-79',
    mosque: 'haram',
    gateNumber: 79,
    nameArabic: 'باب الملك فهد',
    nameEnglish: 'King Fahd Gate',
    locationArea: 'الجهة الغربية (Western Façade)',
    areaServed: 'توسعة الملك فهد، المطاف الأرضي، الدور الأول وسطح التوسعة',
    nearbyLandmarks: 'ساحات الشبيكة، فندق دار التوحيد، شارع إبراهيم الخليل',
    accessibility: {
      wheelchairRamp: true,
      escalator: true,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 21.4221,
    longitude: 39.8241,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'أحد أكبر المداخل الغربية المؤدية مباشرة إلى توسعة الملك فهد وصحن المطاف.'
  },
  {
    id: 'gate-makkah-100',
    mosque: 'haram',
    gateNumber: 100,
    nameArabic: 'باب الملك عبد الله',
    nameEnglish: 'King Abdullah Gate',
    locationArea: 'الجهة الشمالية (Northern Expansion)',
    areaServed: 'التوسعة السعودية الثالثة الكبرى والمصليات الشمالية الحديثة',
    nearbyLandmarks: 'ساحات جبل الكعبة الشمالية، نفق جرول، محطة حافلات النقل السريع',
    accessibility: {
      wheelchairRamp: true,
      escalator: true,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 21.4253,
    longitude: 39.8265,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'بوابة عملاقة بارتفاع متميز تفتح مباشرة على أحدث التوسعات ذات التكييف والمصليات الواسعة.'
  },
  {
    id: 'gate-makkah-62',
    mosque: 'haram',
    gateNumber: 62,
    nameArabic: 'باب العمرة',
    nameEnglish: 'Umrah Gate (Bab al-Umrah)',
    locationArea: 'الجهة الشمالية الغربية (North-West)',
    areaServed: 'الصحن الأرضي والمطاف والجهة المقابلة للتنعيم',
    nearbyLandmarks: 'مكتب خدمات المعتمرين، جسر أجياد الغربي',
    accessibility: {
      wheelchairRamp: true,
      escalator: false,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 21.4235,
    longitude: 39.8247,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'سمي بباب العمرة لأن النبي ﷺ دخل منه في عمرة القضاء، وهو المدخل التقليدي للمعتمرين القادمين من التنعيم.'
  },
  {
    id: 'gate-makkah-84',
    mosque: 'haram',
    gateNumber: 84,
    nameArabic: 'باب الفتح',
    nameEnglish: 'Al-Fath Gate (Bab al-Fath)',
    locationArea: 'الجهة الشمالية الشرقية (North-East)',
    areaServed: 'المطاف والمسعى ومصليات الدور الأرضي',
    nearbyLandmarks: 'ساحات المروة الشمالية، محطة شعب علي',
    accessibility: {
      wheelchairRamp: true,
      escalator: true,
      elderlyCarts: false,
      brailleSignage: false
    },
    latitude: 21.4242,
    longitude: 39.8276,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'المدخل الذي دخل منه النبي ﷺ مكة يوم فتح مكة المكرمة.'
  },
  {
    id: 'gate-makkah-88',
    mosque: 'haram',
    gateNumber: 88,
    nameArabic: 'باب المروة',
    nameEnglish: 'Marwah Gate',
    locationArea: 'الجهة الشرقية عند نهاية المسعى',
    areaServed: 'المسعى ومخرج المعتمرين بعد إنهاء السعي والتحلل',
    nearbyLandmarks: 'جبل المروة، دورات مياه القشاشية، محطة الحافلات الشرقية',
    accessibility: {
      wheelchairRamp: true,
      escalator: true,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 21.4248,
    longitude: 39.8284,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'البوابة الرئيسية لخروج المعتمرين بعد إتمام شوط السعي السابع عند المروة.'
  },
  // Madinah Gates
  {
    id: 'gate-madinah-1',
    mosque: 'prophet',
    gateNumber: 1,
    nameArabic: 'باب السلام',
    nameEnglish: 'Bab as-Salam (Peace Gate)',
    locationArea: 'الجهة الغربية الجنوبية للمسجد النبوي',
    areaServed: 'ممر السلام على النبي ﷺ وصاحبيه، والمواجهة الشريفة والروضة',
    nearbyLandmarks: 'الساحة الغربية، مكتب إرشاد التائهين',
    accessibility: {
      wheelchairRamp: true,
      escalator: false,
      elderlyCarts: false,
      brailleSignage: true
    },
    latitude: 24.4672,
    longitude: 39.6105,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'المدخل الرسمي المخصص لمسار السلام على النبي ﷺ وصاحبيه أبي بكر وعمر رضي الله عنهما للرجال.'
  },
  {
    id: 'gate-madinah-25',
    mosque: 'prophet',
    gateNumber: 25,
    nameArabic: 'باب عثمان بن عفان (للنساء)',
    nameEnglish: 'Bab Uthman ibn Affan (Women Entrance)',
    locationArea: 'الجهة الشمالية الشرقية للمسجد النبوي',
    areaServed: 'المصليات المخصصة للنساء ومسار الروضة الشريفة للنساء',
    nearbyLandmarks: 'الساحات الشمالية، الفنادق المركزية الشمالية',
    accessibility: {
      wheelchairRamp: true,
      escalator: true,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 24.4691,
    longitude: 39.6119,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'المدخل المخصص لدخول الأخوات المصليات ومسار حجز الروضة الشريفة عبر تطبيق نسك.'
  },
  {
    id: 'gate-madinah-37',
    mosque: 'prophet',
    gateNumber: 37,
    nameArabic: 'باب بلال بن رباح',
    nameEnglish: 'Bab Bilal',
    locationArea: 'الجهة الجنوبية المقابلة للقبلة',
    areaServed: 'المصلى القديم وممر ساحة البقيع',
    nearbyLandmarks: 'مقبرة البقيع الشريف، مركز الخدمة الميدانية',
    accessibility: {
      wheelchairRamp: true,
      escalator: false,
      elderlyCarts: true,
      brailleSignage: true
    },
    latitude: 24.4665,
    longitude: 39.6121,
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerifiedDate: '2026-09-01',
    isOpen: true,
    notes: 'بوابة هادئة وسريعة تؤدي إلى الساحات الجنوبية وقريبة من ممر البقيع.'
  }
];
