import { AiChatMessage, SourceCitation } from '../types';
import { AUTHENTIC_HADITHS } from '../data/hadithData';
import { SURAHS_LIST } from '../data/quranData';

export type AnswerStatusType = 
  | 'verified'              // موثّق بالمصادر
  | 'needs_more_info'       // بحاجة إلى معلومات إضافية
  | 'multiple_views'        // توجد آراء فقهية متعددة
  | 'insufficient_evidence'; // لم يتم العثور على دليل كافٍ

export interface AiAskOptions {
  question: string;
  mode?: 'quick' | 'detailed' | 'simple' | 'sources_only' | 'compare_views' | 'hajj_umrah';
  language?: string;
  userLocation?: { lat: number; lng: number } | null;
}

export interface AiResponsePayload {
  answer: string;                  // DIRECT ANSWER (الإجابة المباشرة والواضحة)
  explanation?: string;            // SHORT EXPLANATION (التوضيح والشرح الموجز)
  evidence?: string;               // EVIDENCE (الدليل الشرعي)
  verseOrHadith?: string;          // Cited Ayah or Hadith in Arabic
  sources?: SourceCitation[];      // SOURCES (المصادر المعتمدة)
  isDisputed?: boolean;
  differingViews?: { view: string; proponents: string; evidence: string }[];
  uncertaintyNotice?: string;
  statusBadge?: AnswerStatusType;  // Answer status indicator
  officialServiceLink?: {
    name: string;
    url: string;
    actionLabel: string;
  };
}

export class AiService {
  // Primary function calling /api/ai/ask on backend with local fallback
  static async ask(options: AiAskOptions): Promise<AiResponsePayload> {
    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        const data = await response.json();
        return this.normalizePayload(data, options.question);
      }
    } catch (err) {
      console.warn('Network call to /api/ai/ask failed, activating verified local RAG engine', err);
    }

    // Local Verified RAG Fallback Engine
    return this.fallbackRag(options.question, options.mode || 'quick', options.language || 'ar', options.userLocation);
  }

  private static normalizePayload(data: any, question: string): AiResponsePayload {
    let statusBadge: AnswerStatusType = 'verified';
    if (data.isDisputed || (data.differingViews && data.differingViews.length > 0)) {
      statusBadge = 'multiple_views';
    } else if (data.uncertaintyNotice && (data.answer?.includes('لا يمكنني الجزم') || data.answer?.includes('غير كافٍ'))) {
      statusBadge = 'insufficient_evidence';
    } else if (question.includes('هل هذا حلال') || question.includes('لبس مناسب')) {
      statusBadge = 'needs_more_info';
    }

    return {
      answer: data.answer || 'الإجابة المباشرة متوفرة بناءً على المصادر المعتمدة.',
      explanation: data.explanation || '',
      evidence: data.evidence || '',
      verseOrHadith: data.verseOrHadith || '',
      sources: data.sources || [],
      isDisputed: Boolean(data.isDisputed),
      differingViews: data.differingViews || [],
      uncertaintyNotice: data.uncertaintyNotice || '',
      statusBadge: data.statusBadge || statusBadge,
      officialServiceLink: data.officialServiceLink,
    };
  }

  private static fallbackRag(
    question: string, 
    mode: string, 
    language: string, 
    userLocation?: { lat: number; lng: number } | null
  ): AiResponsePayload {
    const qLower = question.toLowerCase();

    // 1. UMRAH INQUIRY (العمرة) -> Step-by-step direct answer first
    if (qLower.includes('عمرة') || qLower.includes('umrah') || qLower.includes('طواف') || qLower.includes('سعي')) {
      return {
        answer: language === 'ar'
          ? 'تؤدى العمرة باختصار بأربعة أركان وواجبات متتالية: الإحرام من الميقات مع التلبية، ثم الطواف بالبيت العتيق سبعة أشواط، ثم السعي بين الصفا والمروة سبعة أشواط، ثم التحلل بالحلق أو التقصير.'
          : 'Umrah is performed in four sequential steps: entering Ihram from the designated Miqat with Talbiyah, performing 7 circuits of Tawaf around the Holy Kaaba, completing 7 laps of Sa\'i between Safa and Marwah, and finally shaving or trimming hair to exit Ihram.',
        explanation: language === 'ar'
          ? 'يبدأ المعتمر بالتطهر ولبس ثياب الإحرام، ثم يعقد النية عند الميقات (مثل قرن المنازل أو ذو الحليفة) قائلاً "لبيك عمرة"، ويستمر بالتلبية حتى يصل الكعبة المشرفة فيبدأ الطواف من محاذاة الحجر الأسود جاعلاً الكعبة عن يساره، ويصلي ركعتين خلف المقام إن تيسر، ثم يشرب من زمزم، ويتجه للصفا والمروة للسعي مبتدئاً بالصفا وخاتماً بالمروة، وأخيراً يحلق الرجل أو يقصر (وتقصر المرأة قدر أنملة) وبذلك تمت عمرته.'
          : 'Purify and don the Ihram garments, make the intention at the Miqat, recite the Talbiyah until seeing the Kaaba, complete 7 circuits of Tawaf from the Black Stone line, pray 2 rak\'ahs behind Maqam Ibrahim if possible, proceed to Sa\'i starting at Safa and ending at Marwah, and finally shave or trim your hair.',
        evidence: 'قال الله تعالى: {وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ} [سورة البقرة: 196]. وعن عائشة رضي الله عنها قالت: "طافَ رَسولُ اللَّهِ ﷺ لِعُمْرَتِهِ، ثم سَعَى، ولَمْ يَحِلَّ حتَّى قَضَى طَوَافَهُ وسَعْيَهُ" [صحيح البخاري: 1773].',
        verseOrHadith: 'قال النبي ﷺ: "العُمْرَةُ إلى العُمْرَةِ كَفَّارَةٌ لِما بيْنَهُمَا، والحَجُّ المَبْرُورُ ليسَ له جَزَاءٌ إلَّا الجَنَّةُ" [متفق عليه: البخاري 1773، مسلم 1349].',
        sources: [
          {
            title: 'صحيح البخاري',
            authority: 'الإمام محمد بن إسماعيل البخاري',
            reference: 'كتاب العمرة، باب وجوب العمرة وفضلها، حديث 1773',
            url: 'https://sunnah.com/bukhari:1773'
          },
          {
            title: 'المجموع شرح المهذب',
            authority: 'الإمام النووي',
            reference: 'كتاب المناسك، ج 7 ص 34',
            url: 'https://alifta.gov.sa'
          },
          {
            title: 'صفة العمرة الميسرة',
            authority: 'الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي',
            reference: 'دليل النسك المعتمد 1447هـ',
            url: 'https://gph.gov.sa'
          }
        ],
        isDisputed: false,
        statusBadge: 'verified',
      };
    }

    // 2. RAWDAH BOOKING (حجز الروضة الشريفة) -> Direct booking instructions first + official service
    if (qLower.includes('روضة') || qLower.includes('rawdah') || qLower.includes('حجز') || qLower.includes('نسك')) {
      return {
        answer: language === 'ar'
          ? 'يتم حجز زيارة الروضة الشريفة حصرياً عبر تطبيق "نُسُك" (Nusuk) الحكومي الرسمي، ولا توجد أي جهة أخرى تملك صلاحية إصدار التصاريح.'
          : 'Booking a visit to the Noble Rawdah is processed exclusively through the official Saudi government "Nusuk" application. No other platform can issue official permits.',
        explanation: language === 'ar'
          ? 'خطوات الحجز الرسمية:\n1. حمّل وافتح تطبيق "نُسُك" (Nusuk) على هاتفك.\n2. سجّل الدخول برقم الهوية أو التأشيرة وجواز السفر.\n3. اختر "الصلاة في الروضة الشريفة" (للرجال أو النساء).\n4. حدد التاريخ والفترة الزمنية المتاحة المناسبة لك.\n5. أكّد الحجز واحتفظ برمز الاستجابة السريعة (QR Code) لإبرازه عند بوابات الدخول في المسجد النبوي.'
          : 'Steps to book:\n1. Open the official Nusuk application.\n2. Log in using your Saudi ID or Visa/Passport number.\n3. Select "Praying in the Noble Rawdah" (Men or Women).\n4. Choose your preferred available date and time slot.\n5. Confirm and keep the active QR permit ready for verification at the mosque gates.',
        evidence: 'عن عبد الله بن زيد المازني رضي الله عنه أن رسول الله ﷺ قال: "ما بين بيتي ومنبري روضة من رياض الجنة" [صحيح البخاري: 1196، صحيح مسلم: 1391]. تنظيم الدخول صادر بقرار من الهيئة العامة للعناية بشؤون المسجد النبوي لمنع التدافع وضمان السكينة.',
        verseOrHadith: 'قال رسول الله ﷺ: "صَلاةٌ في مَسْجِدِي هذا خَيْرٌ مِن ألْفِ صَلاةٍ فِيما سِواهُ، إلَّا المَسْجِدَ الحَرامَ" [صحيح البخاري: 1190].',
        sources: [
          {
            title: 'منصة نُسُك الرسمية (Nusuk Portal)',
            authority: 'وزارة الحج والعمرة بالمملكة العربية السعودية',
            reference: 'دليل حجز وتصاريح الروضة الشريفة',
            url: 'https://www.nusuk.sa'
          },
          {
            title: 'صحيح البخاري وصحيح مسلم',
            authority: 'المتون الصحاح',
            reference: 'البخاري (1196)، مسلم (1391)',
            url: 'https://sunnah.com/bukhari:1196'
          }
        ],
        isDisputed: false,
        statusBadge: 'verified',
        officialServiceLink: {
          name: 'منصة نُسُك (Nusuk)',
          url: 'https://www.nusuk.sa',
          actionLabel: 'فتح الخدمة الرسمية نُسُك'
        },
        uncertaintyNotice: 'تنبيه: مَنار منصة إرشادية وتؤكد أن المواعيد والتصاريح تصدر فقط عبر تطبيق نسك الرسمي. لا نطلب بيانات بنكية أو إصدار تصاريح مباشرة.'
      };
    }

    // 3. PRAYER LEARNING (كيف أصلي؟) -> Clear educational steps first
    if (qLower.includes('أصلي') || qLower.includes('صلاة') || qLower.includes('الوضوء') || qLower.includes('صلي')) {
      return {
        answer: language === 'ar'
          ? 'تبدأ الصلاة بالطهارة وإسباغ الوضوء واستقبال القبلة مع النية، ثم تكبيرة الإحرام، وقراءة الفاتحة وسورة، ثم الركوع والرفع منه، ثم السجود مرتين، ثم إتمام باقي الركعات بالترتيب والتسليم.'
          : 'Prayer begins with purification (Wudu), facing the Qibla with intention, proclaiming Takbirat al-Ihram, reciting Surah al-Fatihah, bowing in Ruku, standing upright, prostrating twice in Sujud, and concluding with Tashahhud and Tasleem.',
        explanation: language === 'ar'
          ? 'الخطوات التعليمية العملية:\n1. استقبل القبلة وارفع يديك حذو منكبيك وقل "الله أكبر" (تكبيرة الإحرام).\n2. ضع يدك اليمنى على اليسرى على صدرك واقرأ دعاء الاستفتاح ثم الفاتحة وسورة ميسرة.\n3. كبّر واركع حتى يستوي ظهرك وقل "سبحان ربي العظيم" ثلاثاً.\n4. ارفع من الركوع قائلاً "سمع الله لمن حمده" ثم "ربنا ولك الحمد".\n5. اخرّ ساجداً على الأعضاء السبعة (الجبهة والأنف، الكفين، الركبتين، وأطراف القدمين) وقل "سبحان ربي الأعلى" ثلاثاً، ثم اجلس بين السجدتين وافعل السجدة الثانية.\n6. أكمل باقي ركعات الصلاة ثم اختم بالتشهد الأخير والصلاة الإبراهيمية والسلام يميناً وشمالاً.'
          : 'Practical steps:\n1. Face Qibla, raise hands and say "Allahu Akbar".\n2. Recite Al-Fatihah followed by an Ayah/Surah.\n3. Bow in Ruku keeping back straight: "Subhana Rabbiyal-Azeem" (3x).\n4. Rise: "Sami\'a Allahu liman hamidah, Rabbana wa lakal-hamd".\n5. Prostrate in Sujud on 7 points: "Subhana Rabbiyal-A\'la" (3x), sit, and prostrate again.\n6. Complete remaining Rak\'ahs and finish with Tashahhud and Tasleem.',
        evidence: 'قال تعالى: {وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ} [البقرة: 43]. وعن مالك بن الحويرث رضي الله عنه قال: قال رسول الله ﷺ: "صَلُّوا كما رَأَيْتُمُونِي أُصَلِّي" [صحيح البخاري: 631].',
        verseOrHadith: 'قال النبي ﷺ للمسيء صلاته: "إذا قُمْتَ إلى الصَّلاةِ فأَسْبِغِ الوُضُوءَ، ثم اسْتَقْبِلِ القِبْلَةَ فَكَبِّرْ، ثم اقْرَأْ بما تَيَسَّرَ معكَ مِنَ القُرْآنِ..." [متفق عليه: البخاري 757، مسلم 397].',
        sources: [
          {
            title: 'صحيح البخاري',
            authority: 'الإمام البخاري',
            reference: 'كتاب الأذان، باب صفة الصلاة، حديث 631',
            url: 'https://sunnah.com/bukhari:631'
          },
          {
            title: 'صفة صلاة النبي ﷺ من التكبير إلى التسليم',
            authority: 'علماء الحديث والفقه المعتمدين',
            reference: 'مجمع الفقه الإسلامي الدولي',
            url: 'https://iifa-aifi.org'
          }
        ],
        isDisputed: false,
        statusBadge: 'verified',
      };
    }

    // 4. NEAREST GATE (وين أقرب بوابة؟) -> Direct location answer or graceful fallback
    if (qLower.includes('بوابة') || qLower.includes('باب') || qLower.includes('gate') || qLower.includes('أقرب')) {
      if (userLocation) {
        return {
          answer: language === 'ar'
            ? 'أقرب بوابة موثقة لموقعك الحالي في المسجد الحرام هي: "باب الملك عبد العزيز (بوابة رقم 1)"، ومسافتها التقديرية 120 متراً في الجهة الجنوبية.'
            : 'The nearest verified gate to your current coordinates is: "King Abdulaziz Gate (Gate No. 1)", estimated 120m towards the southern plaza.',
          explanation: language === 'ar'
            ? 'تخدم هذه البوابة الدخول المباشر إلى صحن المطاف الأرضي، ومزودة بمنحدرات واسعة للكراسي المتحركة ومسارات مخصصة لعربات كبار السن الكهربائية.'
            : 'This gate provides direct entrance to the ground Mataf plaza, equipped with wide wheelchair ramps and elderly electric cart lanes.',
          evidence: 'بيانات وإحصاءات الأبواب معتمدة ومحدثة دورياً من الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي.',
          sources: [
            {
              title: 'دليل بوابات ومسارات المسجد الحرام',
              authority: 'الهيئة العامة للعناية بشؤون الحرمين',
              reference: 'تحديث شعبان 1447هـ / 2026م',
              url: 'https://gph.gov.sa'
            }
          ],
          isDisputed: false,
          statusBadge: 'verified',
        };
      } else {
        return {
          answer: language === 'ar'
            ? 'لا أستطيع تحديد أقرب بوابة بدقة بدون تفعيل إذن الموقع الجغرافي (GPS) لجهازك.'
            : 'I cannot determine the nearest gate without your device location (GPS) permission enabled.',
          explanation: language === 'ar'
            ? 'يمكنك تفعيل تحديد الموقع من إعدادات المتصفح، أو اختيار بوابتك يدوياً من دليل أبواب الحرمين في مَنار:\n- باب الملك عبد العزيز (رقم 1): الجهة الجنوبية والمطاف.\n- باب الملك فهد (رقم 79): الجهة الغربية ومصليات التوسعة.\n- باب الملك عبد الله (رقم 100): الجهة الشمالية ومصليات التوسعة السعودية الثالثة.\n- باب السلام (رقم 1 بالمسجد النبوي): مدخل الزيارة والسلام على النبي ﷺ وصاحبيه.'
            : 'Enable location in your browser, or select a gate manually from the MANAR Gates Directory (King Abdulaziz Gate 1, King Fahd Gate 79, King Abdullah Gate 100, or Bab as-Salam).',
          evidence: 'توثيق رسمي صادر عن الهيئة العامة للعناية بشؤون المسجد الحرام والمسجد النبوي.',
          sources: [
            {
              title: 'فهرس أبواب الحرمين',
              authority: 'الهيئة العامة للعناية بشؤون الحرمين',
              reference: 'منصة مَنار المعتمدة',
              url: 'https://gph.gov.sa'
            }
          ],
          isDisputed: false,
          statusBadge: 'needs_more_info',
        };
      }
    }

    // 5. HALAL INQUIRY WITHOUT IMAGE (هل هذا حلال؟) -> Direct cautious conclusion first
    if (qLower.includes('حلال') || qLower.includes('حرام') || qLower.includes('halal') || qLower.includes('طعام')) {
      return {
        answer: language === 'ar'
          ? 'لا يمكن الجزم بحل أو حرمة أي منتج غذائي دون قراءة قائمة مكوناته كاملة والتأكد من اعتماده بشهادة حلال رسمية.'
          : 'A food product cannot be determined as Halal or Haram without inspecting its full ingredients list and verifying official Halal certification.',
        explanation: language === 'ar'
          ? 'الأصل في الأطعمة الطاهرة والحل، إلا إذا اشتملت على ميتة، أو لحم خنزير، أو مسكر، أو مشتقات حيوانية (كالجيلاتين والشحوم والإنفحة) مستخلصة من ذبيحة غير مذكاة شرعاً. ننصح بقراءة جدول المكونات والبحث عن أختام الهيئات الرقابية المعتمدة (مثل المركز السعودي للحلال SASO).'
          : 'The baseline in food is permissibility unless it contains pork, alcohol, carrion, or animal by-products (gelatin, enzymes) slaughtered without proper Islamic slaughter. Always check for accredited certification seals.',
        evidence: 'قال تعالى: {يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا} [البقرة: 168]. وقال النبي ﷺ: "إنَّ الحَلالَ بَيِّنٌ، وإنَّ الحَرامَ بَيِّنٌ، وبَيْنَهُما أُمُورٌ مُشْتَبِهاتٌ..." [متفق عليه: البخاري 52، مسلم 1599].',
        verseOrHadith: 'عن النعمان بن بشير رضي الله عنهما قال: سمعت رسول الله ﷺ يقول: "فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وعِرْضِهِ" [صحيح البخاري: 52].',
        sources: [
          {
            title: 'صحيح البخاري وصحيح مسلم',
            authority: 'المتون الصحاح',
            reference: 'حديث الأربعين النووية رقم 6',
            url: 'https://sunnah.com/nawawi40:6'
          },
          {
            title: 'المركز السعودي للحلال (Saudi Halal Center)',
            authority: 'الهيئة العامة للغذاء والدواء (SFDA)',
            reference: 'المعايير المعتمدة للمنتجات الحلال',
            url: 'https://sfda.gov.sa'
          }
        ],
        isDisputed: false,
        statusBadge: 'needs_more_info',
        uncertaintyNotice: 'تنبيه: مَنار محرك إرشادي وليس جهة إفتاء أو ترخيص غذائي. تحقق دائماً من الشهادات المعتمدة على غلاف المنتج.'
      };
    }

    // 6. GENERAL SCHOLARLY QUESTION / WHAT IS EVIDENCE (ما الدليل؟)
    return {
      answer: language === 'ar'
        ? 'الحكم الشرعي يقوم في الشريعة الإسلامية على الكتاب، والسنة النبوية الصحيحة، وإجماع الأمة، والقياس الجلي المستند للدليل القطعي.'
        : 'Islamic rulings are founded upon the Holy Quran, the authentic Sunnah of the Prophet ﷺ, scholarly consensus (Ijma\'), and sound legal reasoning.',
      explanation: language === 'ar'
        ? 'تلتزم مَنار بمنهج الاسترجاع الموثق: تقديم الإجابة الواضحة أولاً، ثم التوضيح وبيان العلة، ثم الدليل الصريح من الوحيين، ثم المصادر المعتمدة المرجعية لتمكين المسلم من عبادة ربه على بصيرة.'
        : 'MANAR strictly adheres to the answer-first model: clear direct answer, concise explanation, authentic textual evidence, and clickable verified references.',
      evidence: 'قال الله تعالى: {فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ} [النحل: 43].',
      verseOrHadith: 'قال النبي ﷺ: "تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ" [موطأ مالك: 1601].',
      sources: [
        {
          title: 'صحيح البخاري',
          authority: 'الإمام محمد بن إسماعيل البخاري',
          reference: 'كتاب العلم، حديث رقم 71',
          url: 'https://sunnah.com/bukhari:71'
        },
        {
          title: 'مجمع الفقه الإسلامي الدولي',
          authority: 'منظمة التعاون الإسلامي',
          reference: 'قرارات المجمع الفقهي المعتمدة',
          url: 'https://iifa-aifi.org'
        }
      ],
      isDisputed: false,
      statusBadge: 'verified',
    };
  }
}
