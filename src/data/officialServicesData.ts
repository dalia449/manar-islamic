import { OfficialServiceLink } from '../types';

export const OFFICIAL_SERVICES: OfficialServiceLink[] = [
  {
    id: 'svc-nusuk',
    titleArabic: 'منصة نُسُك الرسمية (Nusuk)',
    titleEnglish: 'Nusuk Official Platform',
    descriptionArabic: 'المنصة الحكومية الرسمية المعتمدة لحجز تصاريح العمرة وزيارة الروضة الشريفة وباقات الحج لضيوف الرحمن حول العالم.',
    descriptionEnglish: 'The official Saudi government platform for booking Umrah permits, Rawdah visiting appointments, and international Hajj packages.',
    authority: 'وزارة الحج والعمرة والهيئة السعودية للسياحة',
    url: 'https://www.nusuk.sa',
    iconName: 'Compass',
    category: 'permit',
    disclaimer: 'تنبيه: مَنار لا تصدر تصاريح رسمية ولا تبيع باقات. الحجز وإصدار التصاريح يتم حصرًا وبشكل مباشر عبر منصة نسك الحكومية الرسمية.',
    lastVerified: '2026-09-01'
  },
  {
    id: 'svc-haj-gov',
    titleArabic: 'وزارة الحج والعمرة بالمملكة العربية السعودية',
    titleEnglish: 'Ministry of Hajj and Umrah',
    descriptionArabic: 'الموقع الرسمي للوزارة للاطلاع على اللوائح والأنظمة المعتمدة، الاشتراطات الصحية، ومكاتب وحملات الحج والعمرة المرخصة.',
    descriptionEnglish: 'Official portal of the Saudi Ministry of Hajj & Umrah for regulations, health requirements, and licensed pilgrim service providers.',
    authority: 'Ministry of Hajj and Umrah',
    url: 'https://www.haj.gov.sa',
    iconName: 'Building2',
    category: 'permit',
    disclaimer: 'مَنار توفر روابط الإرشاد المباشرة إلى البوابة الحكومية الرسمية لمطالعة التحديثات والاشتراطات النظامية.',
    lastVerified: '2026-09-01'
  },
  {
    id: 'svc-visa-saudi',
    titleArabic: 'منصة التأشيرات السعودية (روح السعودية / KSA Visa)',
    titleEnglish: 'Saudi Official Visa Portal (Visit Saudi)',
    descriptionArabic: 'التقديم على التأشيرة السياحية الإلكترونية وتأشيرة المرور (ترانزيت) والتأشيرات المباشرة التي تتيح أداء العمرة وزيارة الحرمين الشريفين.',
    descriptionEnglish: 'Official portal to apply for electronic tourist visas, transit visas, and visit visas allowing Umrah and Haramain visits.',
    authority: 'وزارة الخارجية والهيئة السعودية للسياحة',
    url: 'https://www.visitsaudi.com',
    iconName: 'FileCheck',
    category: 'visa',
    disclaimer: 'تقديم التأشيرات ودفع الرسوم يتم عبر المنصات القنصلية الرسمية التابعة لوزارة الخارجية السعودية فقط.',
    lastVerified: '2026-09-01'
  },
  {
    id: 'svc-haramain-rail',
    titleArabic: 'قطار الحرمين السريع (HHR)',
    titleEnglish: 'Haramain High Speed Railway',
    descriptionArabic: 'حجز التذاكر الرسمية لقطار الحرمين الكهربائي فائق السرعة (300 كم/ساعة) الرابط بين مكة المكرمة، والمدينة المنورة، ومطار الملك عبد العزيز بجدة.',
    descriptionEnglish: 'Official booking portal for high-speed train transit between Makkah, Madinah, Jeddah, and King Abdulaziz International Airport.',
    authority: 'الخطوط الحديدية السعودية (سار / SAR)',
    url: 'https://sar.hhr.sa',
    iconName: 'Train',
    category: 'train',
    disclaimer: 'مَنار لا تتولى بيع التذاكر؛ يتم الحجز واختيار المقاعد عبر بوابة قطار الحرمين السريع الرسمية.',
    lastVerified: '2026-09-01'
  },
  {
    id: 'svc-gph',
    titleArabic: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    titleEnglish: 'General Authority for the Care of the Two Holy Mosques',
    descriptionArabic: 'البوابة الرسمية لمتابعة إحصائيات الحشود، وخرائط أبواب الحرمين، ومواعيد الدروس العلمية، وحجز العربات الكهربائية الرسمية لكبار السن.',
    descriptionEnglish: 'Official authority providing live operational updates, gate status, wheelchair services, and religious education schedules in the Two Holy Mosques.',
    authority: 'General Authority for the Care of the Two Holy Mosques',
    url: 'https://gph.gov.sa',
    iconName: 'ShieldCheck',
    category: 'mosque_care',
    disclaimer: 'المصدر الرسمي المعتمد لأي تغييرات في مسارات الطواف ومداخل المسجد الحرام والمسجد النبوي الشريف.',
    lastVerified: '2026-09-01'
  }
];
