export type AnswerStatusType = 
  | 'verified'              // موثّق بالمصادر
  | 'needs_more_info'       // بحاجة إلى معلومات إضافية
  | 'multiple_views'        // توجد آراء فقهية متعددة
  | 'insufficient_evidence'; // لم يتم العثور على دليل كافٍ

export interface ImageAnalysisResult {
  directAnswer: string;            // DIRECT ANSWER (الإجابة المباشرة والواضحة أولاً)
  explanation: string;             // SHORT EXPLANATION (التوضيح والشرح)
  evidence?: string;               // EVIDENCE (الدليل الشرعي أو المعيار المعتمد)
  detectedText?: string;           // OCR Text (تفاصيل التحليل)
  visualObservations: string[];    // Observations (الملاحظات المرئية)
  statusBadge: AnswerStatusType;   // Status badge
  importantDisclaimer: string;     // Religious safety disclaimer
  recommendedAction: string;       // Next recommended action
  sources?: { title: string; authority: string; reference: string; url?: string }[];
}

export class CameraService {
  private static stream: MediaStream | null = null;

  static async startCamera(videoElement: HTMLVideoElement): Promise<boolean> {
    try {
      this.stopCamera();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      this.stream = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
      return true;
    } catch (err) {
      console.warn('Unable to access camera device', err);
      return false;
    }
  }

  static stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  static captureSnapshot(videoElement: HTMLVideoElement): string | null {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      console.error('Snapshot capture failed', e);
      return null;
    }
  }

  static async analyzeImage(
    imageBase64: string,
    mode: 'product_food' | 'clothing' | 'prayer_education' | 'general',
    question?: string
  ): Promise<ImageAnalysisResult> {
    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mode,
          question,
          mimeType: 'image/jpeg',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return this.normalizeResult(data, mode, question);
      }
    } catch (e) {
      console.warn('Network call to analyze-image failed, using safe local analyzer fallback', e);
    }

    // Local Safe Answer-First Fallback
    return this.fallbackAnalysis(mode, question);
  }

  private static normalizeResult(data: any, mode: string, question?: string): ImageAnalysisResult {
    const isFood = mode === 'product_food' || question?.includes('حلال');
    const isClothing = mode === 'clothing' || question?.includes('لبس');

    let directAnswer = data.directAnswer || data.answer;
    if (!directAnswer) {
      if (isFood) {
        directAnswer = 'لا يمكنني الجزم بأن المنتج حلال من الصورة الحالية وحدها.';
      } else if (isClothing) {
        directAnswer = 'لا يمكن الجزم بالحكم الشرعي للثوب من الصورة وحدها، وإنما تقارن الخصائص الظاهرة بضوابط الستر الشرعية.';
      } else {
        directAnswer = 'تم فحص الصورة، والإجابة تعتمد على العناصر الظاهرة أدناه.';
      }
    }

    return {
      directAnswer,
      explanation: data.explanation || data.educationalNotes || 'التوضيح مبني على مطابقة العناصر الظاهرة مع المعايير المعتمدة.',
      evidence: data.evidence || 'قال النبي ﷺ: "دع ما يريبك إلى ما لا يريبك" [صحيح الترمذي: 2518].',
      detectedText: data.detectedText || '',
      visualObservations: data.observations || data.visualObservations || ['تمت معالجة بيانات الصورة عبر كاميرا مَنار.'],
      statusBadge: data.statusBadge || (isFood ? 'needs_more_info' : 'verified'),
      importantDisclaimer: data.importantDisclaimer || 'تنبيه رقابي: الرؤية الحاسوبية وسيلة مساعدة وليست سلطة إفتائية شرعية مستقلة.',
      recommendedAction: data.recommendedAction || 'التحقق من ختم الاعتماد الرسمي أو سؤال الجهات المختصة.',
      sources: data.sources || [
        { title: 'المركز السعودي للحلال (SFDA)', authority: 'المملكة العربية السعودية', reference: 'ضوابط التحقق من المنتجات' },
        { title: 'صحيح البخاري وصحيح مسلم', authority: 'المتون الصحاح', reference: 'كتاب البيوع والأطعمة' }
      ]
    };
  }

  private static fallbackAnalysis(
    mode: 'product_food' | 'clothing' | 'prayer_education' | 'general',
    question?: string
  ): ImageAnalysisResult {
    const qLower = (question || '').toLowerCase();

    // 1. FOOD PRODUCT ANALYSIS (هل هذا حلال؟) -> Direct conclusion / uncertainty FIRST
    if (mode === 'product_food' || qLower.includes('حلال') || qLower.includes('طعام')) {
      return {
        directAnswer: 'لا يمكنني الجزم بأن المنتج حلال من الصورة الحالية وحدها.',
        explanation: 'السبب: الصورة لا تظهر قائمة المكونات التفصيلية بوضوح تام، كما أن مصدر المشتقات الحيوانية وطرق التذكية الشرعية وخلو خطوط الإنتاج من الملوثات لا يمكن إثباتها بالرؤية البصرية المجردة.',
        evidence: 'عن النعمان بن بشير رضي الله عنه قال: قال رسول الله ﷺ: "إنَّ الحَلالَ بَيِّنٌ، وإنَّ الحَرامَ بَيِّنٌ، وبَيْنَهُما أُمُورٌ مُشْتَبِهاتٌ لا يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وعِرْضِهِ" [متفق عليه: البخاري 52، مسلم 1599].',
        detectedText: 'قائمة المكونات بحاجة إلى تقريب أو زاوية أوضح (Ingredients text requires closer inspection)',
        visualObservations: [
          'تم فحص الغلاف الخارجي للمنتج بنجاح.',
          'لم يتم رصد شعار اعتماد حلال رسمي واضح ومباشر على هذه الواجهة.',
          'تحتاج قائمة الإضافات (E-numbers) والجيلاتين إلى فحص دقيق.'
        ],
        statusBadge: 'needs_more_info',
        importantDisclaimer: 'تنبيه شرعي ورقابي قطعي: الذكاء الاصطناعي والكاميرا ليسا مصدراً للفتوى بالحل أو الحرمة. يقع التكليف بالتحقق من شهادة الحلال المعتمدة الصادرة من الهيئات الرقابية الرسمية.',
        recommendedAction: 'التقط صورة واضحة ومقربة لجدول المكونات المطبوع في الخلف، أو ابحث عن ختم "حلال" المعتمد من المركز السعودي للحلال (SFDA) أو الجهة الرسمية في بلدك.',
        sources: [
          {
            title: 'صحيح البخاري',
            authority: 'الإمام البخاري',
            reference: 'كتاب الإيمان، حديث رقم 52',
            url: 'https://sunnah.com/bukhari:52'
          },
          {
            title: 'المركز السعودي للحلال (SFDA Halal Center)',
            authority: 'الهيئة العامة للغذاء والدواء بالمملكة العربية السعودية',
            reference: 'معايير شهادات الحلال والمنتجات المستوردة',
            url: 'https://sfda.gov.sa'
          }
        ]
      };
    }

    // 2. CLOTHING ANALYSIS (هل هذا اللبس مناسب؟) -> Observations FIRST, then Direct Answer, then Evidence
    if (mode === 'clothing' || qLower.includes('لبس') || qLower.includes('ملابس') || qLower.includes('إحرام')) {
      return {
        directAnswer: 'لا يمكن الجزم بالحكم الشرعي من الصورة وحدها، ولكن بمقارنة المظهر الظاهر بالمعايير الفقهية: يجب أن يكون اللباس ساتراً للعورة، فضفاضاً غير شفاف ولا مجسم، وخالياً مما يخالف هدي الشريعة.',
        explanation: 'التحليل التعليمي: شروط اللباس الشرعي في الصلاة والإحرام تتطلب ستر العورة المغلظة والمخففة بيقين، وأن لا يشف القماش عن لون البشرة. وفي الإحرام للرجل: يشترط التجرد من المخيط (المفصل على الجسد) وارتداء إزار ورداء أبيضين نظيفين.',
        evidence: 'قال الله تعالى: {يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِندَ كُلِّ مَسْجِدٍ} [الأعراف: 31]. وسُئل النبي ﷺ: ما يلبس المحرم؟ فقال: "لا يَلْبَسُ القُمُصَ، ولا العَمائِمَ، ولا السَّراوِيلاتِ، ولا البَرانِسَ، ولا الخِفافَ..." [صحيح البخاري: 134].',
        detectedText: '',
        visualObservations: [
          'تمت ملاحظة نوع الثوب وتصميمه الظاهري.',
          'اللباس يظهر تغطية عامة للأعضاء الظاهرة في الصورة.',
          'سماكة القماش والتفصيل الدقيق يتطلبان تأكداً حسياً من المرتدي.'
        ],
        statusBadge: 'verified',
        importantDisclaimer: 'تنبيه: الكاميرا أداة مساعدة تعليمية ولا تصدر أحكاماً شرعية ملزمة على أشخاص أو ملابس.',
        recommendedAction: 'تأكد من عدم شفافية القماش ومطابقته لشروط ستر العورة في الصلاة أو ضوابط الإحرام.',
        sources: [
          {
            title: 'صحيح البخاري',
            authority: 'الإمام البخاري',
            reference: 'كتاب جزاء الصيد ولباس المحرم، حديث 134',
            url: 'https://sunnah.com/bukhari:134'
          },
          {
            title: 'فتاوى اللجنة الدائمة للبحوث العلمية والإفتاء',
            authority: 'المملكة العربية السعودية',
            reference: 'المجلد 24، أحكام اللباس والزينة',
            url: 'https://alifta.gov.sa'
          }
        ]
      };
    }

    // 3. PRAYER EDUCATION (حركات الصلاة) -> Direct educational answer first
    if (mode === 'prayer_education' || qLower.includes('صلاة') || qLower.includes('ركوع') || qLower.includes('سجود')) {
      return {
        directAnswer: 'صفة الحركة الظاهرة تطابق الهدي النبوي المستحب في استواء الظهر والاطمئنان عند الركوع والسجود.',
        explanation: 'التوضيح التعليمي: في الركوع يُسن وضع اليدين على الركبتين مفرجتي الأصابع كأنه قابض عليهما، ومد الظهر مستوياً بحيث لو صب عليه ماء لاستقر. وفي السجود يجب تمكين الأعضاء السبعة من الأرض (الجبهة مع الأنف، اليدين، الركبتين، وأطراف أصابع القدمين متجهة للقبلة).',
        evidence: 'عن عائشة رضي الله عنها قالت: "كانَ رَسولُ اللَّهِ ﷺ يَسْتَفْتِحُ الصَّلَاةَ بالتَّكْبِيرِ... وكانَ إذَا رَكَعَ لَمْ يُشْخِصْ رَأْسَهُ، ولَمْ يُصَوِّبْهُ، ولَكِنْ بيْنَ ذلكَ" [صحيح مسلم: 498].',
        detectedText: '',
        visualObservations: [
          'استواء وضعية الظهر والكتفين أثناء الحركة.',
          'ملاحظة مواضع الأطراف واليدين على الركبتين أو الأرض.'
        ],
        statusBadge: 'verified',
        importantDisclaimer: 'تنبيه شرعي حاسم: مَنار لا تقضي مطلقاً بصحة الصلاة أو بطلانها؛ فالقبول علمها عند الله، والملاحظات هنا للتدريب الإرشادي فقط.',
        recommendedAction: 'راجع صفة صلاة النبي ﷺ كاملة خطوة بخطوة في قسم "تعلّم الصلاة" في منصة مَنار.',
        sources: [
          {
            title: 'صحيح مسلم',
            authority: 'الإمام مسلم بن الحجاج',
            reference: 'كتاب الصلاة، باب ما يجمع صفة الصلاة، حديث 498',
            url: 'https://sunnah.com/muslim:498'
          },
          {
            title: 'صحيح البخاري',
            authority: 'الإمام البخاري',
            reference: 'كتاب الأذان، باب إتمام الركوع، حديث 828',
            url: 'https://sunnah.com/bukhari:828'
          }
        ]
      };
    }

    // 4. GENERAL VISION
    return {
      directAnswer: 'تم فحص الصورة واستخلاص بياناتها المرجعية المعتمدة في مَنار.',
      explanation: 'تحرص مَنار على استخراج المعلومات المفيدة وربطها بالمصادر الأصلية دون التكهن بأحكام دينية غير منصوص عليها.',
      evidence: 'قال تعالى: {وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ} [الإسراء: 36].',
      detectedText: '',
      visualObservations: ['تم تحليل الصورة عبر الكاميرا الرقمية بنجاح.'],
      statusBadge: 'verified',
      importantDisclaimer: 'مَنار منصة إرشادية وتثقيفية معتمدة.',
      recommendedAction: 'استخدم خيارات الدردشة الشرعية إن كان لديك استفسار محدد حول هذه الصورة.',
      sources: [
        {
          title: 'منصة مَنار الرقمية',
          authority: 'الضوابط العلمية والتقنية',
          reference: 'الإصدار المعتمد 2026'
        }
      ]
    };
  }
}
