import { HaramainLocation } from '../types';

export const HARAMAIN_LOCATIONS: HaramainLocation[] = [
  // Makkah
  {
    id: 'place-kaaba',
    city: 'makkah',
    category: 'holy_site',
    nameArabic: 'الكعبة المشرفة وصحن المطاف',
    nameEnglish: 'The Holy Kaaba & Mataf Courtyard',
    descriptionArabic: 'قبلة المسلمين في صلواتهم ومهوى أفئدتهم، يتوسط صحن المسجد الحرام حيث يُطاف حولها سبعة أشواط بدءًا من الحجر الأسود.',
    descriptionEnglish: 'The Qibla for Muslims worldwide and the focal point of Islamic prayer, situated in the heart of Masjid al-Haram where pilgrims perform seven circuits of Tawaf.',
    latitude: 21.422487,
    longitude: 39.826206,
    visitingHours: 'مفتوح على مدار الساعة (Open 24/7)',
    guidelines: [
      'النية الصادقة واستقبال الحجر الأسود عند بدء كل شوط',
      'جعل الكعبة عن يسار الطائف طوال الطواف',
      'صلاة ركعتين خلف مقام إبراهيم عليه السلام بعد إتمام الأشواط السبعة إن تيسر',
      'تجنب التزاحم وإيذاء المصلين والطائفين'
    ],
    historicalSignificance: 'بناها نبي الله إبراهيم وإسماعيل عليهما السلام بأمر من الله تعالى، وجعلها الله بيتًا عتيقًا ومثابة للناس وأمنًا.',
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
    lastVerified: '2026-09-01'
  },
  {
    id: 'place-maqam-ibrahim',
    city: 'makkah',
    category: 'holy_site',
    nameArabic: 'مقام إبراهيم عليه السلام',
    nameEnglish: 'Maqam Ibrahim (Station of Abraham)',
    descriptionArabic: 'الحجر الأثري الذي وقف عليه خليل الله إبراهيم عليه السلام أثناء بناء الكعبة المشرفة، يقع قبالة باب الكعبة داخل مقصورة زجاجية مذهبة.',
    descriptionEnglish: 'The stone on which Prophet Ibrahim (peace be upon him) stood while raising the walls of the Holy Kaaba, preserved in a golden crystal kiosk.',
    latitude: 21.4226,
    longitude: 39.82635,
    visitingHours: 'مفتوح في صحن المطاف على مدار الساعة',
    guidelines: ['يُسن صلاة ركعتي الطواف خلفه في أي موضع من المسجد الحرام دون تزاحم'],
    historicalSignificance: 'آية بينة في بيت الله الحرام: (وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى) [البقرة: 125].',
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام',
    lastVerified: '2026-09-01'
  },
  {
    id: 'place-zamzam',
    city: 'makkah',
    category: 'service',
    nameArabic: 'ماء زمزم المبارك',
    nameEnglish: 'Blessed Well & Distribution of Zamzam',
    descriptionArabic: 'العين المعجزة التي فجّرها جبريل عليه السلام برجل إسماعيل وأمه هاجر عليها السلام، متوفر في حافظات مبردة ونقاط شرب ذكية داخل الحرمين الشريفين.',
    descriptionEnglish: 'The miraculous well that gushed forth for Hajar and baby Ismail (peace be upon them), available throughout both Holy Mosques in chilled thermal dispensers.',
    latitude: 21.4223,
    longitude: 39.8266,
    visitingHours: 'متوفر ومتاح دائمًا في جميع أرجاء الحرمين الشريفين',
    guidelines: [
      'التسمية والدعاء عند الشرب، فـ "ماء زمزم لما شرب له"',
      'الشرب جالسًا باليد اليمنى وحمد الله بعد الانتهاء',
      'المحافظة على نظافة أماكن الشرب وترشيد الاستهلاك'
    ],
    officialSource: 'إدارة سقيا زمزم بالمسجد الحرام',
    lastVerified: '2026-09-01'
  },
  {
    id: 'place-miqat-tanim',
    city: 'makkah',
    category: 'miqat',
    nameArabic: 'مسجد التنعيم (مسجد أم المؤمنين عائشة)',
    nameEnglish: 'Masjid at-Taneem (Aisha Mosque - Miqat for Haram residents)',
    descriptionArabic: 'أقرب مواضع الحل لأهل مكة ومن كان داخل حدود الحرم للإحرام بالعمرة، أحرمت منه أم المؤمنين عائشة رضي الله عنها بأمر النبي ﷺ.',
    descriptionEnglish: 'The nearest boundary of the Haram (al-Hill) for residents of Makkah or visitors wishing to enter Ihram for Umrah.',
    latitude: 21.4641,
    longitude: 39.7997,
    visitingHours: 'مفتوح 24 ساعة، مجهز بمرافق الاغتسال والإحرام والحافلات',
    officialSource: 'وزارة الشؤون الإسلامية والدعوة والإرشاد',
    lastVerified: '2026-09-01'
  },
  // Madinah
  {
    id: 'place-rawdah',
    city: 'madinah',
    category: 'holy_site',
    nameArabic: 'الروضة الشريفة',
    nameEnglish: 'Rawdah ash-Sharifah (The Noble Garden)',
    descriptionArabic: 'الموضع الشريف الواقع بين بيت النبي ﷺ ومنبره الشريف، وصفه النبي ﷺ بأنه "روضة من رياض الجنة". الصلاة فيه مستحبة وفضلها عظيم.',
    descriptionEnglish: 'The blessed area between the Prophet’s house and his pulpit. Described by the Prophet ﷺ as "a garden from the gardens of Paradise".',
    latitude: 24.4674,
    longitude: 39.6111,
    visitingHours: 'عبر تصريح حجز مسبق ومحدد الموعد حصرًا من خلال تطبيق "نسك" (Nusuk)',
    guidelines: [
      'الحجز المسبق المؤكد عبر منصة نسك الرسمية (Nusuk)',
      'الحضور قبل الموعد بـ 15 دقيقة والتزام البوابة المحددة في التصريح',
      'السكينة والوقار وخفض الصوت، والصلاة ركعتين والإكثار من الدعاء والذكر',
      'عدم مزاحمة الزوار وإتاحة الفرصة لإخوانك بعد انقضاء الوقت'
    ],
    historicalSignificance: 'قال النبي ﷺ: "ما بين بيتي ومنبري روضة من رياض الجنة، ومنبري على حوضي" (صحيح البخاري ومسلم).',
    officialSource: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي ومنصة نسك',
    lastVerified: '2026-09-01'
  },
  {
    id: 'place-quba',
    city: 'madinah',
    category: 'historical',
    nameArabic: 'مسجد قباء',
    nameEnglish: 'Masjid Quba (First Mosque in Islam)',
    descriptionArabic: 'أول مسجد أسس في الإسلام عند وصول النبي ﷺ إلى المدينة المنورة، الصلاة فيه تعدل أجر عمرة تامة.',
    descriptionEnglish: 'The first mosque built in the history of Islam upon the Prophet’s arrival in Madinah. Praying in it carries the reward of an Umrah.',
    latitude: 24.4392,
    longitude: 39.6173,
    visitingHours: 'مفتوح 24 ساعة للصلوات والزيارة',
    guidelines: [
      'يُسن التطهر في البيت ثم القدوم للصلاة فيه يوم السبت أو أي يوم آخر',
      'قال رسول الله ﷺ: "من تطهر في بيته ثم أتى مسجد قباء فصلى فيه صلاة كان له كأجر عمرة" (سنن ابن ماجه، وصححه الألباني)'
    ],
    officialSource: 'هيئة تطوير منطقة المدينة المنورة',
    lastVerified: '2026-09-01'
  },
  {
    id: 'place-uhud',
    city: 'madinah',
    category: 'historical',
    nameArabic: 'جبل أحد ومقبرة الشهداء',
    nameEnglish: 'Mount Uhud & Martyrs Cemetery',
    descriptionArabic: 'الجبل المبارك الذي قال فيه النبي ﷺ: "أحد جبل يحبنا ونحبه"، ويضم مقبرة شهداء غزوة أحد الكرام ومنهم سيد الشهداء حمزة بن عبد المطلب رضي الله عنه.',
    descriptionEnglish: 'The historic mountain beloved by the Prophet ﷺ ("Uhud is a mountain that loves us and we love it"), and the resting place of 70 noble martyrs including Hamzah (RA).',
    latitude: 24.5034,
    longitude: 39.6128,
    visitingHours: 'مفتوح للزيارة النهارية والمسائية مع مسارات ومراكز تعريفية',
    guidelines: ['السلام على الشهداء والدعاء لهم بالرحمة والمغفرة دون التبرك بالأحجار أو التربة'],
    officialSource: 'هيئة تطوير منطقة المدينة المنورة ووزارة السياحة',
    lastVerified: '2026-09-01'
  }
];
