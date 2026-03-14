import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SendHorizontal, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type BotRole = 'user' | 'assistant'

type BotMessage = {
  id: number
  role: BotRole
  text: string
}

type FAQItem = {
  question: string
  answer: string
  keywords: string[]
}

const assistantName = 'أنا الشيف'

const faqBank: FAQItem[] = [
  {
    question: 'ازاي أطلب عرض سعر سريع؟',
    answer:
      'تقدر تحصل على عرض سعر سريع جدًا لو أرسلت 4 نقاط في رسالة واحدة: تاريخ المناسبة، المدينة، عدد الضيوف، ونوع الخدمة المطلوبة.\nبعدها بنرجع لك بتصور أولي واضح يشمل الباقة المقترحة والتكلفة التقريبية.\nثم يتم تثبيت العرض النهائي بعد مراجعة التفاصيل الدقيقة معك.',
    keywords: ['عرض سعر', 'سعر', 'تكلفة', 'ميزانية', 'quote', 'price'],
  },
  {
    question: 'كم وقت يحتاج الحجز؟',
    answer:
      'للطلبات الصغيرة نوصي بالحجز قبل 48 ساعة على الأقل.\nللمناسبات الكبيرة الأفضل من 7 إلى 14 يوم لضمان أفضل توفر للأصناف وفريق التشغيل.\nكلما حجزت بدري كانت الخيارات أوسع والتنفيذ أدق.',
    keywords: ['وقت', 'حجز', 'مدة', 'متى', 'قبل'],
  },
  {
    question: 'هل عندكم باقات جاهزة؟',
    answer:
      'نعم، لدينا باقات جاهزة متنوعة حسب نوع المناسبة وعدد الضيوف.\nكل باقة قابلة للتعديل: نقدر نضيف أو نحذف أصناف ونضبط الكميات بما يناسب ميزانيتك.\nالهدف يكون شكل راقٍ وتكلفة محسوبة بدون هدر.',
    keywords: ['باقات', 'باقة', 'جاهزة', 'package'],
  },
  {
    question: 'هل أقدر أخصص المنيو بالكامل؟',
    answer:
      'أكيد، التخصيص الكامل متاح.\nنبدأ بفهم ذوقك ونوع الحدث، ثم نبني منيو متوازن (مقبلات، أطباق رئيسية، حلويات، مشروبات).\nنراعي تنوع الضيوف ونقترح بدائل عملية لكل فئة.',
    keywords: ['تخصيص', 'منيو', 'قائمة', 'menu'],
  },
  {
    question: 'هل يوجد بوفيه مفتوح؟',
    answer:
      'نعم، نوفر بوفيه مفتوح بتنسيق احترافي.\nنوزع محطات التقديم بطريقة تسهّل حركة الضيوف وتقلل الازدحام.\nونضبط الكميات حسب مدة المناسبة وعدد الحضور.',
    keywords: ['بوفيه', 'مفتوح', 'محطات', 'buffet'],
  },
  {
    question: 'هل توفرون خدمة قهوة وحلويات؟',
    answer:
      'نعم، نوفر ركن قهوة عربي أو مختص مع تشكيلة حلويات مناسبة للمناسبة.\nيمكن دمج ركن القهوة ضمن الباقة الأساسية أو تنفيذه كخدمة مستقلة.\nكما نقدر ننسق أسلوب التقديم ليكون متوافق مع هوية الحدث.',
    keywords: ['قهوة', 'حلويات', 'coffee', 'dessert'],
  },
  {
    question: 'هل فيه خيارات صحية ونباتية؟',
    answer:
      'نعم، نوفر خيارات صحية ونباتية منخفضة الدهون أو السعرات حسب الطلب.\nنوازن بين القيمة الغذائية والطعم والشكل النهائي للتقديم.\nولو عندك تفضيلات محددة، نبني لك خط منيو مناسب من البداية.',
    keywords: ['صحي', 'نباتي', 'دايت', 'vegan', 'healthy'],
  },
  {
    question: 'كيف تتعاملون مع حساسية الطعام؟',
    answer:
      'نتعامل مع حساسية الطعام بجدية عالية.\nنوضح المكونات الرئيسية ونوفر بدائل قدر الإمكان حسب نوع الحساسية.\nيفضل إرسال الحالات الخاصة مبكرًا حتى نضبط الخطة التشغيلية بدقة.',
    keywords: ['حساسية', 'allergy', 'gluten', 'lactose', 'مكونات'],
  },
  {
    question: 'هل أقدر أعمل تذوق قبل المناسبة؟',
    answer:
      'للمناسبات الكبيرة، نعم يمكن ترتيب جلسة تذوق مسبقة بموعد منسق.\nالهدف اعتماد الأصناف النهائية ورفع الثقة قبل يوم التنفيذ.\nيتم التنسيق حسب نوع الباقة وجدول المواعيد المتاح.',
    keywords: ['تذوق', 'sampling', 'taste', 'تجربة'],
  },
  {
    question: 'هل توفرون فريق ضيافة؟',
    answer:
      'نعم، لدينا فريق ضيافة محترف لإدارة التقديم وخدمة الضيوف.\nالفريق يساعد في التنظيم الميداني وضبط جودة الخدمة طوال المناسبة.\nيمكن تحديد عدد الأفراد حسب حجم الحدث.',
    keywords: ['ضيافة', 'طاقم', 'staff', 'تقديم'],
  },
  {
    question: 'هل فيه مشرف للمناسبة؟',
    answer:
      'نعم، يمكن توفير مشرف ميداني لمتابعة التنفيذ لحظة بلحظة.\nدور المشرف تنسيق الفريق، معالجة أي ملاحظات سريعة، وضمان الالتزام بالخطة.\nهذا الخيار مهم جدًا للمناسبات الكبيرة.',
    keywords: ['مشرف', 'تنسيق', 'supervisor', 'إدارة'],
  },
  {
    question: 'هل تقدمون خدمات للشركات؟',
    answer:
      'نعم، نخدم اجتماعات الشركات، ورش العمل، حفلات الموظفين، وإطلاق المنتجات.\nنقدر نوفر باقات صباحية أو مسائية حسب طبيعة الفعالية.\nونراعي في التنفيذ سرعة الخدمة ومظهر التقديم الرسمي.',
    keywords: ['شركات', 'شركة', 'corporate', 'اجتماعات'],
  },
  {
    question: 'هل الخدمة تشمل التوصيل والتركيب؟',
    answer:
      'نعم، الخدمة تشمل التوصيل والتركيب الأساسي في الموقع.\nكما يمكن إضافة تجهيزات إضافية حسب احتياج المناسبة.\nننسق كل شيء مسبقًا لتجنب أي تأخير يوم التنفيذ.',
    keywords: ['توصيل', 'تركيب', 'delivery', 'setup'],
  },
  {
    question: 'ما المدن اللي تخدموها؟',
    answer:
      'الخدمة الأساسية داخل الرياض وضواحيها.\nوبعض المدن القريبة متاحة حسب الجدول وحجم المناسبة.\nأرسل الموقع وسنؤكد لك التغطية فورًا.',
    keywords: ['مدن', 'مدينة', 'الرياض', 'locations'],
  },
  {
    question: 'ما أقل عدد ضيوف؟',
    answer:
      'لا يوجد رقم ثابت يناسب كل المناسبات.\nالحد الأدنى يعتمد على نوع الخدمة، موقع التنفيذ، وخيارات المنيو.\nأرسل العدد المتوقع وسنقترح لك أنسب صيغة تشغيل.',
    keywords: ['أقل', 'اقل', 'عدد', 'ضيوف', 'minimum'],
  },
  {
    question: 'ما أقصى عدد ضيوف تقدروا عليه؟',
    answer:
      'نقدر نخدم أعداد كبيرة جدًا عبر فرق تشغيل متعددة.\nيتم تقسيم نقاط الخدمة وتوزيع الطاقم لضمان سرعة الانسياب.\nكل حالة يتم تقييمها بخطة تنفيذ خاصة.',
    keywords: ['أقصى', 'اكبر', 'أكبر', 'capacity', 'ضيوف'],
  },
  {
    question: 'هل الأسعار تشمل الضريبة؟',
    answer:
      'تفاصيل الضريبة تظهر بوضوح في العرض النهائي.\nيعتمد ذلك على نوع الباقة وطبيعة التعاقد.\nنهتم دائمًا بالشفافية الكاملة في كل بند مالي.',
    keywords: ['ضريبة', 'vat', 'فاتورة', 'شامل'],
  },
  {
    question: 'ما طرق الدفع؟',
    answer:
      'متاح التحويل البنكي، مدى، البطاقات الائتمانية، والدفع النقدي حسب الحالة.\nسياسة الدفع والتأكيد تُذكر بوضوح قبل اعتماد الطلب.\nويمكن ترتيب دفعات مرحلية للمناسبات الكبيرة.',
    keywords: ['دفع', 'تحويل', 'مدى', 'visa', 'mada'],
  },
  {
    question: 'هل لازم عربون للتأكيد؟',
    answer:
      'في معظم الحالات نعم، يتم تأكيد الحجز بعد دفع العربون.\nقيمة العربون تعتمد على حجم المناسبة والباقات المختارة.\nيتم توضيح جميع الشروط قبل الإغلاق النهائي.',
    keywords: ['عربون', 'تأكيد', 'مقدم', 'دفعة'],
  },
  {
    question: 'هل أقدر أعدل الطلب بعد التأكيد؟',
    answer:
      'نعم، التعديل متاح حسب توقيت الإشعار ونوع التعديل.\nكلما كان الإشعار مبكرًا، كانت مرونة التعديل أعلى.\nنساعدك دائمًا بأفضل بديل ممكن إذا كانت هناك قيود تشغيلية.',
    keywords: ['تعديل', 'تغيير', 'change', 'بعد التأكيد'],
  },
  {
    question: 'هل أقدر ألغي الحجز؟',
    answer:
      'الإلغاء متاح وفق سياسة الإلغاء المعتمدة في العرض.\nيعتمد ذلك على وقت الإشعار وما تم تجهيزه فعليًا من الطلب.\nالفريق يوضح لك كل التفاصيل بدقة قبل التوقيع.',
    keywords: ['إلغاء', 'الغاء', 'cancel', 'استرجاع'],
  },
  {
    question: 'هل توفرون معدات التقديم؟',
    answer:
      'نعم، نوفر معدات تقديم أساسية ضمن الخدمة.\nويمكن الترقية لمستوى أعلى في أدوات التقديم حسب الطابع المطلوب.\nنرشح لك الخيار الأنسب بناءً على نوع المناسبة.',
    keywords: ['معدات', 'تقديم', 'صحون', 'serving'],
  },
  {
    question: 'هل عندكم ديكور وتنسيق طاولات؟',
    answer:
      'نوفر تنسيقات تقديم جذابة داخل نطاق الخدمة الأساسية.\nوللتجهيزات الديكورية المتقدمة يمكن التنسيق مع شركاء تنفيذ.\nنضمن أن الشكل النهائي يكون متناسق مع أجواء المناسبة.',
    keywords: ['ديكور', 'تنسيق', 'طاولات', 'setup'],
  },
  {
    question: 'هل عندكم منيو أطفال؟',
    answer:
      'نعم، متاح منيو مناسب للأطفال من حيث الطعم والحصص والتقديم.\nنراعي البساطة والتنوع في الخيارات المخصصة للأطفال.\nويمكن دمجه مع منيو الكبار في نفس الفعالية.',
    keywords: ['أطفال', 'اطفال', 'kids', 'طفل'],
  },
  {
    question: 'هل فيه خيارات بحري أو لحوم؟',
    answer:
      'نعم، يمكن اختيار منيو بحري بالكامل أو لحوم بالكامل أو دمج بينهما.\nنساعدك في التوازن حسب ميزانيتك وعدد الضيوف.\nونقدم لك اقتراحات عملية تقلل الهدر وتحافظ على الجودة.',
    keywords: ['بحري', 'لحوم', 'seafood', 'meat', 'سمك'],
  },
  {
    question: 'هل في شواء مباشر؟',
    answer:
      'الشواء المباشر متاح في باقات محددة وبحسب اشتراطات المكان.\nنقيم الموقع أولًا لضمان السلامة وجودة التنفيذ.\nثم نعطيك تصور واضح قبل اعتماد الخدمة.',
    keywords: ['شواء', 'مباشر', 'grill', 'live'],
  },
  {
    question: 'هل توفرون إفطار صباحي؟',
    answer:
      'نعم، لدينا باقات إفطار صباحي للشركات والمناسبات الخاصة.\nتشمل خيارات خفيفة ومتنوعة تناسب الفعاليات الصباحية.\nويمكن إضافة ركن قهوة متكامل معها.',
    keywords: ['إفطار', 'فطور', 'صباحي', 'breakfast'],
  },
  {
    question: 'هل عندكم بوكسات فردية؟',
    answer:
      'نعم، متوفر بوكسات فردية مرتبة بشكل أنيق للمناسبات والاجتماعات.\nيمكن تخصيص محتوى البوكس حسب الفئة المستهدفة والميزانية.\nهذا الخيار ممتاز للفعاليات الرسمية السريعة.',
    keywords: ['بوكس', 'فردية', 'box', 'وجبات فردية'],
  },
  {
    question: 'هل تقدمون خدمة مناسبات منزلية؟',
    answer:
      'نعم، نخدم المناسبات المنزلية مع احترام خصوصية المكان.\nنجهز خطة تشغيل مرنة تناسب المساحة المتاحة في المنزل.\nونضمن تقديم مرتب ونظيف بدون إزعاج.',
    keywords: ['منزلية', 'منزل', 'بيت', 'home'],
  },
  {
    question: 'هل تقدمون خدمة أعراس؟',
    answer:
      'نعم، نقدم خدمات أعراس مع باقات متعددة تناسب أحجام مختلفة.\nنركز على دقة التنظيم وجودة الضيافة طوال وقت الحفل.\nويمكن دمج خدمات إضافية حسب رغبتكم.',
    keywords: ['عرس', 'زواج', 'زفاف', 'اعراس'],
  },
  {
    question: 'هل عندكم خدمة حفلات تخرج؟',
    answer:
      'نعم، لدينا خيارات مناسبة لحفلات التخرج الخاصة والعائلية.\nيمكن تصميم منيو شبابي أو رسمي حسب نوع الحفل.\nونساعدك في ضبط التكاليف بدون التأثير على الشكل.',
    keywords: ['تخرج', 'حفلة', 'graduation'],
  },
  {
    question: 'هل تعملون كل أيام الأسبوع؟',
    answer:
      'نستقبل الطلبات بشكل يومي ضمن ساعات العمل.\nمواعيد التنفيذ تعتمد على جدول الحجوزات المتاح.\nإذا عندك تاريخ محدد، أرسله الآن للتأكد الفوري.',
    keywords: ['أيام', 'الاسبوع', 'دوام', 'مواعيد'],
  },
  {
    question: 'كيف أتواصل بسرعة؟',
    answer:
      'أسرع قناة عادة هي واتساب مع إرسال تفاصيل المناسبة كاملة.\nكلما كانت المعلومات أوضح، كان الرد أدق وأسرع.\nيمكنك أيضًا استخدام نموذج التواصل في الصفحة.',
    keywords: ['تواصل', 'واتساب', 'whatsapp', 'رقم'],
  },
  {
    question: 'هل ترسلون صور من أعمال سابقة؟',
    answer:
      'نعم، نرسل نماذج مناسبة لنوع مناسبتك حتى تشوف مستوى التنفيذ.\nنختار لك أمثلة قريبة من الميزانية والطابع المطلوب.\nهذا يساعدك تتخذ قرار أسرع بثقة.',
    keywords: ['صور', 'نماذج', 'أعمال', 'portfolio'],
  },
  {
    question: 'هل ممكن تضبطوا الباقة على ميزانية محددة؟',
    answer:
      'نعم، نقدر نبني لك باقة قوية ضمن سقف ميزانية واضح.\nنرتب الأولويات: الأصناف الأساسية، عدد المحطات، وعدد الطاقم.\nالنتيجة تكون متوازنة بين الجودة والتكلفة.',
    keywords: ['ميزانية', 'سقف', 'تكلفة', 'اقتصادي'],
  },
  {
    question: 'هل فيه خدمة بعد منتصف الليل؟',
    answer:
      'في بعض الحالات نعم، حسب الموقع ونوع المناسبة وجدول التشغيل.\nنحتاج معرفة الوقت الدقيق وعدد الضيوف لتأكيد التوفر.\nوبناءً عليه نرسل لك الخطة المناسبة.',
    keywords: ['منتصف الليل', 'ليل', 'متأخر', 'late'],
  },
  {
    question: 'هل ممكن حجز مستعجل لنفس اليوم؟',
    answer:
      'يعتمد على التوفر الفعلي في نفس اليوم.\nلو توفر فريق وتشغيل مناسب ممكن ننفذ بشكل سريع.\nأرسل التفاصيل الآن وسنفحص لك الإمكانية مباشرة.',
    keywords: ['مستعجل', 'نفس اليوم', 'عاجل', 'urgent'],
  },
  {
    question: 'هل تقدمون خدمة صواني فقط بدون طاقم؟',
    answer:
      'نعم، متاح خيار صواني/طلبات تجهيز بدون فريق ضيافة.\nهذا الخيار مناسب للتجمعات الصغيرة والمتوسطة.\nيمكن إضافة الطاقم لاحقًا إذا رغبت.',
    keywords: ['صواني', 'بدون طاقم', 'tray', 'drop-off'],
  },
  {
    question: 'هل في باقات اقتصادية؟',
    answer:
      'نعم، لدينا باقات اقتصادية محسوبة بعناية.\nنحافظ فيها على جودة الطعم وشكل التقديم قدر الإمكان.\nونساعدك تختار أفضل قيمة مقابل التكلفة.',
    keywords: ['اقتصادية', 'موفر', 'رخيص', 'budget'],
  },
  {
    question: 'هل يمكن توفير مشروبات باردة وساخنة؟',
    answer:
      'نعم، نوفر مشروبات باردة وساخنة ضمن باقات متنوعة.\nيمكن إضافة ركن مخصص للمشروبات فقط أو دمجه مع الضيافة الكاملة.\nونضبط الأنواع حسب وقت المناسبة والجمهور.',
    keywords: ['مشروبات', 'باردة', 'ساخنة', 'drinks'],
  },
  {
    question: 'هل يوجد عقد أو اتفاق واضح قبل التنفيذ؟',
    answer:
      'نعم، يتم توضيح جميع البنود الأساسية قبل اعتماد الطلب النهائي.\nيشمل ذلك نطاق الخدمة، آلية الدفع، وسياسات التعديل أو الإلغاء.\nالوضوح الكامل جزء أساسي من جودة الخدمة.',
    keywords: ['عقد', 'اتفاق', 'شروط', 'policy'],
  },
]

const quickQuestions = faqBank.slice(0, 30).map((item) => item.question)

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/[^\u0600-\u06ff\sa-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')

const greetingReply =
  'أهلا وسهلا، أنا الشيف.\nاسألني براحتك عن الحجز، المنيو، الأسعار، أو أي تفاصيل خاصة بمناسبتك.\nكلما كتبت تفاصيل أكثر، يكون الرد أدق وأسرع.'

const fallbackReply =
  'سؤالك ممتاز، ولأعطيك إجابة دقيقة جدًا أحتاج 4 معلومات:\n1) نوع المناسبة\n2) تاريخ التنفيذ\n3) عدد الضيوف\n4) المدينة أو الموقع\nأرسلهم في رسالة واحدة وأنا أرتب لك اقتراح قوي مباشرة.'

const getBotAnswer = (input: string) => {
  const normalizedInput = normalizeText(input)

  if (!normalizedInput) {
    return 'اكتب سؤالك بشكل مباشر، وأنا هجاوبك فورًا.'
  }

  const greetingWords = ['السلام', 'اهلا', 'مرحبا', 'هاي', 'hello', 'hi']
  if (greetingWords.some((word) => normalizedInput.includes(word))) {
    return greetingReply
  }

  let bestMatch: { item: FAQItem | null; score: number } = { item: null, score: 0 }

  faqBank.forEach((item) => {
    const keywordScore = item.keywords.reduce((total, keyword) => {
      return normalizedInput.includes(normalizeText(keyword)) ? total + 1 : total
    }, 0)

    const questionScore = normalizedInput.includes(normalizeText(item.question)) ? 2 : 0
    const totalScore = keywordScore + questionScore

    if (totalScore > bestMatch.score) {
      bestMatch = { item, score: totalScore }
    }
  })

  if (bestMatch.item && bestMatch.score > 0) {
    return bestMatch.item.answer
  }

  return fallbackReply
}

type ChefAvatarProps = {
  size?: 'sm' | 'md' | 'lg'
  mood?: 'idle' | 'thinking' | 'excited'
  className?: string
}

const chefAvatarSizeClass = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

function ChefAvatar({ size = 'md', mood = 'idle', className = '' }: ChefAvatarProps) {
  const isThinking = mood === 'thinking'
  const isExcited = mood === 'excited'
  const steamOpacity = isThinking ? [0.2, 0.85, 0.2] : [0, 0, 0]
  const steamY = isThinking ? [1, -3, 1] : [0, 0, 0]
  const cloudOpacity = isThinking ? [0.1, 0.4, 0.1] : [0.08, 0.18, 0.08]
  const ringScale = isExcited ? [1, 1.08, 1] : [1, 1.02, 1]
  const floatDuration = isThinking ? 0.9 : isExcited ? 0.7 : 2.3

  return (
    <motion.div
      className={`${chefAvatarSizeClass[size]} ${className}`.trim()}
      animate={{ y: [0, -3, 0], scale: ringScale }}
      transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <motion.circle
          cx="60"
          cy="60"
          r="58"
          fill="#10151f"
          animate={{ opacity: cloudOpacity }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <circle cx="60" cy="60" r="56" fill="none" stroke="#d4af37" strokeOpacity="0.35" strokeWidth="2" />

        <motion.path
          d="M36 88C36 76 46 70 60 70C74 70 84 76 84 88V96H36V88Z"
          fill="#ffffff"
          animate={{ scaleX: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '60px 88px' }}
        />
        <path d="M44 78H76" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="55" r="20" fill="#f5c7a5" />

        <motion.g
          animate={{ y: [0, -2, 0], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '60px 30px' }}
        >
          <path
            d="M35 38C35 26 43 20 50 20C53 13 58 10 64 10C70 10 75 13 78 20C86 21 92 27 92 36C92 44 86 49 79 49H45C39 49 35 44 35 38Z"
            fill="#ffffff"
          />
          <path d="M42 40H85" stroke="#d4af37" strokeOpacity="0.35" strokeWidth="2" />
        </motion.g>

        <motion.circle
          cx="52"
          cy="54"
          r="2.8"
          fill="#1e1b1b"
          animate={{ scaleY: [1, 1, 0.15, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.3 }}
          style={{ transformOrigin: '52px 54px' }}
        />
        <motion.circle
          cx="68"
          cy="54"
          r="2.8"
          fill="#1e1b1b"
          animate={{ scaleY: [1, 1, 0.15, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.15, repeatDelay: 1.3 }}
          style={{ transformOrigin: '68px 54px' }}
        />

        <path d="M54 64C56 67 64 67 66 64" stroke="#8f3f2e" strokeWidth="2.4" strokeLinecap="round" />

        <motion.g
          animate={isThinking ? { rotate: [-10, 12, -10] } : isExcited ? { rotate: [-8, 10, -8] } : { rotate: [-3, 4, -3] }}
          transition={{ duration: isThinking ? 1 : isExcited ? 0.9 : 2.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '72px 83px' }}
        >
          <rect x="69" y="80" width="20" height="7" rx="3.5" fill="#f5c7a5" />
          <rect x="88" y="78" width="11" height="4" rx="2" fill="#d4af37" />
        </motion.g>
        <rect x="30" y="80" width="20" height="7" rx="3.5" fill="#f5c7a5" />

        <motion.path
          d="M96 64C100 60 99 55 102 51"
          stroke="#f3e9d2"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: steamOpacity, y: steamY }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <motion.path
          d="M101 68C106 63 105 57 109 53"
          stroke="#f3e9d2"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: steamOpacity, y: steamY }}
          transition={{ duration: 1.1, repeat: Infinity, delay: 0.2 }}
        />
      </svg>
    </motion.div>
  )
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="w-1.5 h-1.5 rounded-full bg-gold block"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
        />
      ))}
    </span>
  )
}

function ChefThinkingStage({ text }: { text: string }) {
  const thinkingSteps = ['أراجع نوع المناسبة', 'أرتب الباقة الأنسب', 'أضبط الكميات', 'أجهز الرد النهائي']

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-gold/20 bg-dark-700/60 p-3"
    >
      <div className="flex items-center gap-2 text-white/90 font-arabic text-sm">
        <ChefAvatar size="sm" mood="thinking" />
        <span>{text}</span>
        <ThinkingDots />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {thinkingSteps.map((step, index) => (
          <motion.span
            key={step}
            className="text-[11px] md:text-xs text-gold/90 bg-gold/10 rounded-full px-2.5 py-1 font-arabic"
            animate={{ opacity: [0.45, 1, 0.45], y: [0, -1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.2 }}
          >
            {step}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 w-1/2 bg-gradient-gold"
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

export default function ContactAssistantBot() {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'أنا الشيف.\nجاهز أساعدك في كل شيء يخص مناسبتك: الباقات، المنيو، الأسعار، وطريقة التنفيذ.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chefMood, setChefMood] = useState<'idle' | 'thinking' | 'excited'>('idle')
  const [messagePanelHeight, setMessagePanelHeight] = useState(430)
  const [typingHint, setTypingHint] = useState('أنا الشيف بيفكر في أفضل إجابة لمناسبتك...')
  const messageIdRef = useRef(2)
  const chatPanelRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const typingTimerRef = useRef<number | null>(null)
  const chefMoodTimerRef = useRef<number | null>(null)

  function scrollMessagesToBottom(behavior: ScrollBehavior = 'smooth') {
    if (!messagesContainerRef.current) return
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior,
    })
  }

  function scheduleScrollToBottom(behavior: ScrollBehavior = 'smooth') {
    window.requestAnimationFrame(() => {
      scrollMessagesToBottom(behavior)
      window.setTimeout(() => scrollMessagesToBottom(behavior), 50)
      window.setTimeout(() => scrollMessagesToBottom(behavior), 180)
    })
  }

  function scrollPageToChatOnMobile() {
    if (!window.matchMedia('(max-width: 767px)').matches) return
    const targetElement = chatPanelRef.current ?? messagesContainerRef.current
    if (!targetElement) return

    const scrollWithOffset = () => {
      const navOffset = 84
      const targetY = window.scrollY + targetElement.getBoundingClientRect().top - navOffset
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
    }

    window.requestAnimationFrame(() => {
      scrollWithOffset()
      window.setTimeout(scrollWithOffset, 250)
    })
  }

  useEffect(() => {
    scheduleScrollToBottom('smooth')
  }, [messages, isTyping])

  useEffect(() => {
    const updateViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const nextHeight = Math.round(Math.max(220, Math.min(460, viewportHeight * 0.52)))
      setMessagePanelHeight(nextHeight)
      scheduleScrollToBottom('auto')
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    window.addEventListener('orientationchange', updateViewportHeight)
    window.visualViewport?.addEventListener('resize', updateViewportHeight)

    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('orientationchange', updateViewportHeight)
      window.visualViewport?.removeEventListener('resize', updateViewportHeight)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current)
      }
      if (chefMoodTimerRef.current) {
        window.clearTimeout(chefMoodTimerRef.current)
      }
    }
  }, [])

  const pushMessage = (role: BotRole, text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: messageIdRef.current++,
        role,
        text,
      },
    ])
  }

  const sendMessage = (value: string, source: 'quick' | 'manual' = 'manual') => {
    const trimmed = value.trim()
    if (!trimmed || isTyping) return

    pushMessage('user', trimmed)
    if (source === 'quick') {
      scrollPageToChatOnMobile()
    }
    scheduleScrollToBottom('auto')
    setInputValue('')
    setChefMood('thinking')
    setTypingHint(
      source === 'quick'
        ? 'أنا الشيف بيفكر في أحسن إجابة لسؤالك...'
        : 'أنا الشيف بيفهم تفاصيل طلبك وبيجهز رد مرتب...'
    )
    setIsTyping(true)

    const response = getBotAnswer(trimmed)
    const delay = source === 'quick' ? 1900 : 1400

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current)
    }

    typingTimerRef.current = window.setTimeout(() => {
      pushMessage('assistant', response)
      setIsTyping(false)
      setChefMood('excited')
      if (chefMoodTimerRef.current) {
        window.clearTimeout(chefMoodTimerRef.current)
      }
      chefMoodTimerRef.current = window.setTimeout(() => {
        setChefMood('idle')
        chefMoodTimerRef.current = null
      }, 1200)
      scheduleScrollToBottom('smooth')
      typingTimerRef.current = null
    }, delay)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(inputValue, 'manual')
  }

  return (
    <div className="glassmorphism-light rounded-3xl border border-gold/20 p-5 md:p-8 relative overflow-hidden">
      <motion.div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-gold/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.85, 0.3] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-gold/5 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.8, repeat: Infinity }}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <ChefAvatar size="lg" mood={chefMood} className="shadow-gold-lg" />
          <div>
            <h3 className="text-white text-xl font-bold font-arabic">{assistantName}</h3>
            <p className="text-white/60 text-sm font-arabicBody">
              {chefMood === 'thinking'
                ? 'الشيف مركز مع سؤالك الآن...'
                : chefMood === 'excited'
                  ? 'تم تجهيز الرد وجاهز للإرسال'
                  : 'شيف ذكي بردود أوسع وأنيميشن تفاعلي'}
            </p>
          </div>
        </div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-h-44 overflow-y-auto pr-1 flex flex-wrap gap-2 mb-6"
      >
        {quickQuestions.map((question, index) => (
          <motion.div
            key={question}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.35) }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => sendMessage(question, 'quick')}
              className="border-gold/25 bg-dark-700/50 text-white/90 hover:bg-gold hover:text-dark font-arabic text-xs md:text-sm"
            >
              {question}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <div ref={chatPanelRef} className="rounded-2xl bg-dark-900/60 border border-white/10 p-4 md:p-5">
        <div
          ref={messagesContainerRef}
          className="overflow-y-auto overscroll-contain scroll-smooth touch-pan-y space-y-3 pr-1"
          style={{ maxHeight: `${messagePanelHeight}px` }}
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <ChefAvatar
                    size="sm"
                    mood={chefMood === 'excited' ? 'excited' : 'idle'}
                    className="flex-shrink-0 mt-1"
                  />
                )}

                <div className="max-w-[88%]">
                  {message.role === 'assistant' && (
                    <span className="text-[11px] text-gold/80 font-arabic mr-2">{assistantName}</span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed font-arabicBody whitespace-pre-line ${
                      message.role === 'assistant'
                        ? 'bg-dark-700/90 text-white border border-gold/15'
                        : 'bg-gradient-gold text-dark font-semibold'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <UserRound className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && <ChefThinkingStage text={typingHint} />}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onFocus={() => scheduleScrollToBottom('auto')}
            placeholder="اسأل أنا الشيف أي سؤال..."
            className="bg-dark-700 border-gold/20 text-white placeholder:text-white/40 font-arabic text-base"
          />
          <motion.div whileTap={{ scale: 0.96 }} animate={isTyping ? { y: [0, -1, 0] } : { y: 0 }} transition={{ duration: 0.6, repeat: isTyping ? Infinity : 0 }}>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic font-semibold sm:min-w-36"
            >
              <motion.span animate={isTyping ? { rotate: [0, -12, 12, 0] } : { rotate: 0 }} transition={{ duration: 0.8, repeat: isTyping ? Infinity : 0 }} className="inline-flex">
                <SendHorizontal className="w-4 h-4 ml-2" />
              </motion.span>
              إرسال
            </Button>
          </motion.div>
        </form>

        <p className="text-white/50 text-xs md:text-sm font-arabic mt-3">
          للحصول على عرض سعر نهائي دقيق، أرسل: عدد الضيوف + التاريخ + المدينة + نوع المناسبة.
        </p>
      </div>
    </div>
  )
}
