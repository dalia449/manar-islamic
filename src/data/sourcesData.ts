import { VerifiedSource } from '../types';

export const APPROVED_SOURCES: VerifiedSource[] = [
  {
    id: 'src-1',
    name: 'مجمع الملك فهد لطباعة المصحف الشريف',
    authority: 'King Fahd Complex for the Printing of the Holy Quran',
    category: 'Quran & Tafsir',
    url: 'https://qurancomplex.gov.sa',
    language: 'Arabic / Multi-language',
    isVerified: true,
    lastAuditedDate: '2026-09-01',
    description: 'المرجعية العالمية الأولى والمعتمدة لطباعة وضبط نص المصحف الشريف والتفاسير الميسرة وترجمات معاني القرآن.'
  },
  {
    id: 'src-2',
    name: 'صحيح البخاري وصحيح مسلم - موسوعة الدرر السنية وموقع السنة النبوية',
    authority: 'Verified Sunnah Repository (Dorar & Sunnah.com)',
    category: 'Hadith',
    url: 'https://sunnah.com',
    language: 'Arabic / English',
    isVerified: true,
    lastAuditedDate: '2026-09-01',
    description: 'قواعد بيانات نصوص الأحاديث النبوية الشريفة المحققة مع أرقام الكتب والأبواب ودرجات الصحة المعتمدة.'
  },
  {
    id: 'src-3',
    name: 'مجمع الفقه الإسلامي الدولي (منظمة التعاون الإسلامي)',
    authority: 'International Islamic Fiqh Academy (OIC)',
    category: 'Fiqh Council',
    url: 'https://iifa-aifi.org',
    language: 'Arabic / English / French',
    isVerified: true,
    lastAuditedDate: '2026-09-01',
    description: 'أعلى هيئة فقهية جماعية إسلامية تمثل كافة الدول الإسلامية لإصدار القرارات في النوازل المعاصرة.'
  },
  {
    id: 'src-4',
    name: 'هيئة كبار العلماء والرئاسة العامة للبحوث العلمية والإفتاء',
    authority: 'Council of Senior Scholars (Saudi Arabia)',
    category: 'Government Authority',
    url: 'https://alifta.gov.sa',
    language: 'Arabic',
    isVerified: true,
    lastAuditedDate: '2026-09-01',
    description: 'الفتاوى والبحوث العلمية المعتمدة الصادرة عن كبار علماء المملكة العربية السعودية.'
  },
  {
    id: 'src-5',
    name: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    authority: 'General Authority for the Care of the Two Holy Mosques',
    category: 'Official Haramain',
    url: 'https://gph.gov.sa',
    language: 'Arabic / English / Urdu / French',
    isVerified: true,
    lastAuditedDate: '2026-09-01',
    description: 'المصدر الرسمي والوحيد لإرشادات أبواب الحرمين، مسارات الطواف، والمصليات والخدمات الميدانية.'
  },
  {
    id: 'src-6',
    name: 'الأزهر الشريف ومجمع البحوث الإسلامية',
    authority: 'Al-Azhar Al-Sharif Islamic Research Academy',
    category: 'Fiqh Council',
    url: 'https://azhar.eg',
    language: 'Arabic / English',
    isVerified: true,
    lastAuditedDate: '2026-09-01',
    description: 'أعرق منارة علمية إسلامية لنشر الفقه الوسطي المعتدل والتراث الإسلامي الأصيل.'
  }
];
