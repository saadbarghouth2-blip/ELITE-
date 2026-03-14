import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  MapPin,
  Mail,
  CheckCircle2,
  PartyPopper,
  Utensils,
  Heart,
  Building2,
  Briefcase,
  ChefHat,
  CreditCard,
  Wallet,
  Banknote,
  MessageCircle,
  Truck,
  Store,
  Timer,
  Phone,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const EMAILJS_PUBLIC_KEY = 'zbeu8eZx9DOBnf-dY'
const EMAILJS_SERVICE_ID = 'service_yn6thtg'
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_1iwi7i8'
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_iude7gf'
const WHATSAPP_NUMBER = '201067431264'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
const CART_STORAGE_KEY = 'elite_menu_cart'
const ORDER_DRAFT_KEY = 'elite_order_draft'

type BookingMode = 'package' | 'menu' | 'custom'

type FormState = {
  name: string
  phone: string
  email: string
  city: string
  eventType: string
  eventDate: string
  preferredTime: string
  guests: string
  location: string
  venueType: string
  serviceStyle: string
  eventDuration: string
  deliveryMethod: string
  deliveryAddress: string
  landmark: string
  package: string
  hallStyle: string
  notes: string
  paymentMethod: string
  contactMethod: string
}

type SummaryItem = {
  label: string
  value: string
}

type DraftCartItem = {
  name: string
  quantity: number
  price: number
}

type CartDraftState = {
  count: number
  total: number
  items: DraftCartItem[]
}

type CustomPlannerCategory = 'mains' | 'sides' | 'desserts' | 'drinks'

type CustomPlannerItem = {
  id: string
  category: CustomPlannerCategory
  name: string
  price: number
  unit: string
  description: string
}

type SelectionReviewItem = {
  name: string
  quantity: number
  quantitySuffix: string
  price: number
  total: number
  subtitle: string
}

type ValidationField = keyof FormState | 'eventType' | 'menuSelection' | 'customSelection'

type ValidationErrors = Partial<Record<ValidationField, string>>

type SectionCardProps = {
  index: string
  icon: typeof Calendar
  title: string
  description: string
  children: ReactNode
  className?: string
}

type FieldLabelProps = {
  children: ReactNode
  required?: boolean
  hint?: string
}

const eventTypes = [
  { id: 'wedding', name: 'حفل زفاف', icon: Heart },
  { id: 'private', name: 'مناسبة خاصة', icon: PartyPopper },
  { id: 'corporate', name: 'حدث شركة', icon: Building2 },
  { id: 'conference', name: 'مؤتمر', icon: Briefcase },
  { id: 'buffet', name: 'بوفيه مفتوح', icon: Utensils },
  { id: 'other', name: 'أخرى', icon: ChefHat },
] as const

const packages = [
  { name: 'الباقة الأساسية', price: 150, description: 'مناسبة للتجمعات الصغيرة والطلبات السريعة.' },
  { name: 'الباقة الفضية', price: 250, description: 'توازن ممتاز بين التنوع والسعر للمناسبات المتوسطة.' },
  { name: 'الباقة الذهبية', price: 400, description: 'تجربة ضيافة متكاملة للمناسبات الكبيرة والراقية.' },
] as const

const bookingModes = [
  {
    id: 'package',
    name: 'وليمة أو باقة جاهزة',
    description: 'اختَر باقة مناسبة وعدد الضيوف وسنجهز لك التنفيذ بشكل سريع وواضح.',
    highlight: 'الأفضل للحجوزات السريعة',
    icon: Utensils,
  },
  {
    id: 'menu',
    name: 'اختيار من المنيو',
    description: 'اختَر أصنافك من صفحة المنيو ثم ارجع هنا لاستكمال بيانات الحجز فقط.',
    highlight: 'مرن لو عارف طلباتك',
    icon: Store,
  },
  {
    id: 'custom',
    name: 'صمّم مناسبتي',
    description: 'اختَر شكل القاعة أو الجلسة وحدد الأصناف والكميات بالتفصيل من هنا.',
    highlight: 'مناسب للمناسبات الخاصة',
    icon: ChefHat,
  },
] as const satisfies ReadonlyArray<{
  id: BookingMode
  name: string
  description: string
  highlight: string
  icon: typeof Calendar
}>

const paymentMethods = [
  { id: 'card', name: 'بطاقة ائتمان', icon: CreditCard },
  { id: 'transfer', name: 'تحويل بنكي', icon: Banknote },
  { id: 'cash', name: 'نقداً عند الاستلام', icon: Wallet },
] as const

const contactMethods = [
  { id: 'whatsapp', name: 'واتساب', icon: MessageCircle },
  { id: 'email', name: 'إيميل', icon: Mail },
  { id: 'phone', name: 'اتصال', icon: Phone },
] as const

const deliveryMethods = [
  { id: 'delivery', name: 'توصيل', icon: Truck },
  { id: 'pickup', name: 'استلام من الفرع', icon: Store },
] as const

const venueTypes = [
  { id: 'hall', name: 'قاعة', description: 'قاعة أفراح أو مناسبات مجهزة' },
  { id: 'home', name: 'منزل', description: 'ولائم أو تجمعات منزلية' },
  { id: 'farm', name: 'استراحة', description: 'استراحة أو مزرعة أو شاليه' },
  { id: 'company', name: 'شركة', description: 'مقر عمل أو فعالية داخل شركة' },
  { id: 'outdoor', name: 'موقع خارجي', description: 'حديقة أو مساحة مفتوحة' },
] as const

const hallStyles = [
  {
    id: 'majlis',
    name: 'جلسة عربية دافئة',
    capacity: '30 - 80 ضيف',
    description: 'أنسب للولائم العائلية والتجمعات الخاصة داخل المنزل أو الاستراحة.',
  },
  {
    id: 'classic-hall',
    name: 'قاعة كلاسيكية',
    capacity: '80 - 140 ضيف',
    description: 'خيار عملي للحفلات الخاصة وولائم الشركات مع توزيع مريح للطاولات.',
  },
  {
    id: 'royal-hall',
    name: 'قاعة ملكية',
    capacity: '140 - 220 ضيف',
    description: 'مناسبة للزفاف والمناسبات الكبيرة التي تحتاج خدمة وضيافة متكاملة.',
  },
  {
    id: 'garden-setup',
    name: 'تجهيز خارجي / حديقة',
    capacity: '60 - 180 ضيف',
    description: 'مثالي للمناسبات المفتوحة مع بوفيه ومحطات تقديم وحركة أسهل للضيوف.',
  },
] as const

const serviceStyles = [
  { id: 'buffet', name: 'بوفيه مفتوح', description: 'محطات تقديم وخيارات متنوعة' },
  { id: 'boxed', name: 'بوكسات فردية', description: 'تقديم مرتب وسريع لكل ضيف' },
  { id: 'plated', name: 'تقديم على الطاولات', description: 'أطباق رئيسية أو ضيافة منظمة' },
  { id: 'desserts', name: 'حلويات ومشروبات', description: 'ركن خفيف للحلويات والضيافة' },
  { id: 'full-service', name: 'ضيافة متكاملة', description: 'طعام وتقديم وتجهيز أشمل' },
] as const

const eventDurations = [
  { id: 'short', name: '2 - 3 ساعات', description: 'فعالية قصيرة أو استقبال سريع' },
  { id: 'half-day', name: 'نصف يوم', description: 'تغطية لعدة ساعات متواصلة' },
  { id: 'full-day', name: 'يوم كامل', description: 'مناسبة طويلة أو متعددة الفقرات' },
  { id: 'multi-period', name: 'أكثر من فترة', description: 'تجهيز ممتد على فترتين أو أكثر' },
] as const

const customPlannerCategories = [
  { id: 'mains', label: 'الأطباق الرئيسية' },
  { id: 'sides', label: 'المقبلات والأركان' },
  { id: 'desserts', label: 'الحلويات' },
  { id: 'drinks', label: 'المشروبات والضيافة' },
] as const satisfies ReadonlyArray<{ id: CustomPlannerCategory; label: string }>

const customPlannerItems: CustomPlannerItem[] = [
  {
    id: 'arabic-feast',
    category: 'mains',
    name: 'وليمة لحم عربي',
    price: 950,
    unit: 'صينية',
    description: 'تكفي تقريبًا 12 - 15 ضيفًا مع أرز وتقديم فاخر.',
  },
  {
    id: 'mandi-chicken',
    category: 'mains',
    name: 'مندي دجاج',
    price: 420,
    unit: 'صينية',
    description: 'خيار مناسب للولائم المتوسطة ويكفي 8 - 10 ضيوف.',
  },
  {
    id: 'mixed-grill-station',
    category: 'mains',
    name: 'ركن مشويات مشكلة',
    price: 780,
    unit: 'ركن',
    description: 'محطة تقديم حية تناسب الحفلات المفتوحة والمناسبات المسائية.',
  },
  {
    id: 'oriental-mezza',
    category: 'sides',
    name: 'ركن مقبلات شرقية',
    price: 280,
    unit: 'ركن',
    description: 'حمص ومتبل وتبولة وسلطات متنوعة مع تجهيز التقديم.',
  },
  {
    id: 'rice-tray',
    category: 'sides',
    name: 'صينية أرز بسمتي فاخر',
    price: 160,
    unit: 'صينية',
    description: 'مناسبة كإضافة مع الولائم الرئيسية والبوفيهات.',
  },
  {
    id: 'bread-service',
    category: 'sides',
    name: 'ركن خبز ومعجنات',
    price: 140,
    unit: 'ركن',
    description: 'تشكيلة خبز طازج وميني معجنات لبدء الضيافة بشكل أنيق.',
  },
  {
    id: 'kunafa-tray',
    category: 'desserts',
    name: 'صينية كنافة',
    price: 230,
    unit: 'صينية',
    description: 'تكفي 15 - 18 حصة وتناسب الولائم العائلية.',
  },
  {
    id: 'umm-ali-tray',
    category: 'desserts',
    name: 'صينية أم علي',
    price: 190,
    unit: 'صينية',
    description: 'حلوى مناسبة للبوفيهات الشتوية والمناسبات الخاصة.',
  },
  {
    id: 'mini-dessert-corner',
    category: 'desserts',
    name: 'ركن ميني حلويات',
    price: 360,
    unit: 'ركن',
    description: 'تشكيلة ضيافة متنوعة للكوفي بريك أو استقبال الضيوف.',
  },
  {
    id: 'arabic-coffee',
    category: 'drinks',
    name: 'ضيافة قهوة عربية وشاي',
    price: 180,
    unit: 'محطة',
    description: 'محطة ضيافة مناسبة للاستقبال والترحيب داخل القاعة أو المنزل.',
  },
  {
    id: 'juice-station',
    category: 'drinks',
    name: 'ركن عصائر موسمية',
    price: 220,
    unit: 'محطة',
    description: 'عصائر طازجة تقدم بشكل مرتب للمناسبات الخاصة والشركات.',
  },
  {
    id: 'water-soft-drinks',
    category: 'drinks',
    name: 'مياه ومشروبات غازية',
    price: 95,
    unit: 'باقة',
    description: 'تجهيز أساسي للطاولات أو ركن الخدمة طوال المناسبة.',
  },
]

const bookingHighlights = [
  {
    icon: CheckCircle2,
    title: 'خطوات أوضح',
    description: 'كل البيانات مرتبة في أقسام سهلة حتى تكمل الطلب بسرعة وبدون تشتت.',
  },
  {
    icon: Banknote,
    title: 'ملخص فوري',
    description: 'تشوف التقدير المالي والبيانات المهمة مباشرة قبل إرسال الطلب.',
  },
  {
    icon: MessageCircle,
    title: 'إرسال بالطريقة المناسبة',
    description: 'يمكنك الإرسال عبر البريد أو واتساب حسب الطريقة الأنسب لك.',
  },
] as const

const bookingSteps = [
  { step: '01', title: 'بيانات التواصل', description: 'نأخذ اسمك ووسيلة التواصل والمدينة.' },
  { step: '02', title: 'اختيار المسار', description: 'باقة جاهزة أو منيو أو تصميم مناسبة بالتفصيل.' },
  { step: '03', title: 'تفاصيل التنفيذ', description: 'الموعد والمكان ونوع الضيافة والتوصيل والتجهيز.' },
  { step: '04', title: 'المراجعة والإرسال', description: 'ملخص نهائي واضح ثم إرسال الطلب بثقة.' },
] as const

const bookingInputClass =
  'h-11 rounded-xl border-gold/20 bg-dark-700/60 text-sm text-white font-arabic placeholder:text-white/35 focus-visible:border-gold focus-visible:ring-gold/30 sm:h-12 sm:text-base'

const bookingTextareaClass =
  'rounded-2xl border-gold/20 bg-dark-700/60 text-sm leading-7 text-white font-arabic placeholder:text-white/35 focus-visible:border-gold focus-visible:ring-gold/30 sm:text-base'

const normalizePhone = (value: string) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return value
    .split('')
    .map((char) => {
      const index = arabicDigits.indexOf(char)
      return index >= 0 ? String(index) : char
    })
    .join('')
    .replace(/\D/g, '')
}

const isValidPhone = (value: string) => normalizePhone(value).length >= 9
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const createInitialFormData = (): FormState => ({
  name: '',
  phone: '',
  email: '',
  city: '',
  eventType: '',
  eventDate: '',
  preferredTime: '',
  guests: '',
  location: '',
  venueType: '',
  serviceStyle: '',
  eventDuration: '',
  deliveryMethod: 'delivery',
  deliveryAddress: '',
  landmark: '',
  package: '',
  hallStyle: '',
  notes: '',
  paymentMethod: 'cash',
  contactMethod: 'whatsapp',
})

const validationFieldOrder: ValidationField[] = [
  'name',
  'phone',
  'email',
  'city',
  'eventDate',
  'preferredTime',
  'eventType',
  'guests',
  'package',
  'menuSelection',
  'customSelection',
  'deliveryAddress',
]

const getChoiceCardClass = (isActive: boolean) =>
  cn(
    'group flex h-full min-h-[92px] flex-col items-center justify-center gap-2.5 rounded-2xl border p-3.5 text-center transition-all duration-300 sm:min-h-[118px] sm:gap-3 sm:p-4',
    isActive
      ? 'border-gold bg-gradient-to-br from-gold/20 to-gold/5 shadow-[0_0_0_1px_rgba(212,175,55,0.32)]'
      : 'border-gold/20 bg-dark-700/20 hover:border-gold/45 hover:bg-gold/5'
  )

function SectionCard({ index, icon: Icon, title, description, children, className }: SectionCardProps) {
  return (
    <section className={cn('glassmorphism-light rounded-[24px] border border-gold/15 p-4 sm:rounded-[30px] sm:p-6 md:p-7', className)}>
      <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 sm:h-14 sm:w-14">
          <Icon className="h-5 w-5 text-gold sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0">
          <span className="mb-2 inline-flex rounded-full border border-gold/15 bg-white/5 px-3 py-1 text-xs text-gold/80 font-arabic">
            القسم {index}
          </span>
          <h2 className="text-xl font-bold text-white font-arabic sm:text-2xl">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function FieldLabel({ children, required = false, hint }: FieldLabelProps) {
  return (
    <div className="mb-2 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <label className="text-sm text-white/85 font-arabic">
        {children}
        {required && <span className="mr-1 text-gold">*</span>}
      </label>
      {hint && <span className="text-xs text-white/40 font-arabic">{hint}</span>}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="mt-2 text-sm text-red-300 font-arabic">{message}</p>
}

export default function Booking() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cartDraftInfo, setCartDraftInfo] = useState<CartDraftState | null>(null)
  const [bookingMode, setBookingMode] = useState<BookingMode>('package')
  const [customItemQuantities, setCustomItemQuantities] = useState<Record<string, number>>({})
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Partial<Record<ValidationField, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [formData, setFormData] = useState<FormState>(createInitialFormData)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDER_DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as {
        items?: DraftCartItem[]
        total?: number
      }
      if (!Array.isArray(draft.items) || draft.items.length === 0) return

      const count = draft.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
      const totalFromItems = draft.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      )
      const total = Number(draft.total) || totalFromItems
      setCartDraftInfo({ count, total, items: draft.items })
      setBookingMode((prev) => (prev === 'package' ? 'menu' : prev))
    } catch {
      // ignore invalid storage
    }
  }, [])

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])
  const activeCartDraft = bookingMode === 'menu' ? cartDraftInfo : null
  const activeBookingMode = bookingModes.find((mode) => mode.id === bookingMode) ?? bookingModes[0]

  const customPlannerSelections = useMemo(
    () =>
      customPlannerItems
        .map((item) => {
          const quantity = customItemQuantities[item.id] || 0
          return {
            ...item,
            quantity,
            total: quantity * item.price,
          }
        })
        .filter((item) => item.quantity > 0),
    [customItemQuantities]
  )

  const customPlannerTotal = useMemo(
    () => customPlannerSelections.reduce((sum, item) => sum + item.total, 0),
    [customPlannerSelections]
  )

  const customPlannerQuantity = useMemo(
    () => customPlannerSelections.reduce((sum, item) => sum + item.quantity, 0),
    [customPlannerSelections]
  )

  const selectedHallStyle = hallStyles.find((item) => item.id === formData.hallStyle) ?? null

  const recommendedHallStyle = useMemo(() => {
    const guests = Number(formData.guests) || 0
    if (guests <= 0) return null
    if (guests <= 80) return hallStyles[0]
    if (guests <= 140) return hallStyles[1]
    if (guests <= 220) return hallStyles[2]
    return hallStyles[3]
  }, [formData.guests])

  const selectionReviewItems = useMemo<SelectionReviewItem[]>(() => {
    if (bookingMode === 'custom') {
      return customPlannerSelections.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        quantitySuffix: item.unit,
        price: item.price,
        total: item.total,
        subtitle: `سعر ${item.unit}: ${item.price} ر.س`,
      }))
    }

    return (
      activeCartDraft?.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        quantitySuffix: '',
        price: item.price,
        total: item.price * item.quantity,
        subtitle: `سعر الوحدة: ${item.price} ر.س`,
      })) ?? []
    )
  }, [activeCartDraft, bookingMode, customPlannerSelections])

  const selectionLines = useMemo(
    () =>
      selectionReviewItems.map(
        (item, index) =>
          `${index + 1}. ${item.name} - الكمية: ${item.quantity}${item.quantitySuffix ? ` ${item.quantitySuffix}` : ''} - الإجمالي: ${item.total} ر.س`
      ),
    [selectionReviewItems]
  )

  const selectionBreakdownTitle = bookingMode === 'custom' ? 'ملخص التصميم المخصص' : 'ملخص المنيو المضاف'
  const selectionBreakdownDescription =
    bookingMode === 'custom'
      ? 'راجع الأصناف والكميات المختارة قبل الإرسال، ويمكنك تعديلها في أي وقت من هذا القسم.'
      : 'تفاصيل الأصناف تظهر هنا بشكل مرتب للقراءة فقط، بينما خانة الملاحظات بالأسفل مخصصة لطلباتك الإضافية.'
  const selectionCountLabel = bookingMode === 'custom' ? 'إجمالي الكميات' : 'عدد العناصر'
  const selectionCountValue = bookingMode === 'custom' ? customPlannerQuantity : activeCartDraft?.count ?? 0
  const selectionTotalLabel = bookingMode === 'custom' ? 'إجمالي التصميم' : 'إجمالي السلة'
  const selectionTotalValue = bookingMode === 'custom' ? customPlannerTotal : activeCartDraft?.total ?? 0
  const selectionMessageTitle = bookingMode === 'custom' ? '*تفاصيل التصميم المخصص*' : '*تفاصيل المنيو المختار*'
  const selectionEmailTitle = bookingMode === 'custom' ? '[تفاصيل التصميم المخصص]' : '[تفاصيل المنيو المختار]'

  const sectionIndices = useMemo(() => {
    let currentIndex = 1
    const next = () => String(currentIndex++).padStart(2, '0')

    const sections = {
      contact: next(),
      mode: next(),
      eventType: '',
      details: '',
      custom: '',
      delivery: '',
      package: '',
      payment: '',
      notes: '',
    }

    if (bookingMode !== 'menu') {
      sections.eventType = next()
    }

    sections.details = next()

    if (bookingMode === 'custom') {
      sections.custom = next()
    }

    sections.delivery = next()

    if (bookingMode === 'package') {
      sections.package = next()
    }

    sections.payment = next()
    sections.notes = next()

    return sections
  }, [bookingMode])

  const buildValidationErrors = (
    data: FormState = formData,
    mode: BookingMode = bookingMode,
    draft: CartDraftState | null = activeCartDraft,
    customSelectionCount: number = customPlannerSelections.length
  ): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!data.name.trim()) {
      errors.name = 'اكتب الاسم الكامل'
    }

    if (!data.phone.trim()) {
      errors.phone = 'اكتب رقم الجوال'
    } else if (!isValidPhone(data.phone)) {
      errors.phone = 'رقم الجوال غير صحيح'
    }

    if (data.email && !isValidEmail(data.email)) {
      errors.email = 'صيغة البريد الإلكتروني غير صحيحة'
    }

    if (!data.city.trim()) {
      errors.city = 'اكتب المدينة'
    }

    if (!data.eventDate) {
      errors.eventDate = 'اختر تاريخ المناسبة'
    }

    if (!data.preferredTime) {
      errors.preferredTime = 'اختر الوقت المفضل'
    }

    if (mode === 'menu') {
      if (!draft || draft.items.length === 0) {
        errors.menuSelection = 'اختر أصنافك من صفحة المنيو أولاً'
      }
    } else {
      if (!data.eventType) {
        errors.eventType = 'اختر نوع المناسبة'
      }

      if (!data.guests || Number(data.guests) <= 0) {
        errors.guests = 'أدخل عدد ضيوف صحيح'
      }

      if (mode === 'package' && !data.package) {
        errors.package = 'اختر الباقة المناسبة'
      }

      if (mode === 'custom' && customSelectionCount === 0) {
        errors.customSelection = 'أضف صنفًا واحدًا على الأقل مع الكمية'
      }
    }

    if (data.deliveryMethod === 'delivery' && !data.deliveryAddress.trim()) {
      errors.deliveryAddress = 'اكتب عنوان التوصيل'
    }

    return errors
  }

  const getFirstValidationError = (errors: ValidationErrors) =>
    validationFieldOrder.map((field) => errors[field]).find(Boolean) ?? null

  const getVisibleError = (field: ValidationField) =>
    submitAttempted || touchedFields[field] ? fieldErrors[field] : undefined

  const handleFieldBlur = (field: ValidationField) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
    setFieldErrors(buildValidationErrors())
  }

  const handleFieldChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    const nextFormData = { ...formData, [field]: value }
    setFormData(nextFormData)

    if (submitAttempted || touchedFields[field]) {
      setFieldErrors(buildValidationErrors(nextFormData))
    }
  }

  const handleBookingModeChange = (mode: BookingMode) => {
    setBookingMode(mode)

    if (submitAttempted) {
      setFieldErrors(
        buildValidationErrors(formData, mode, mode === 'menu' ? cartDraftInfo : null)
      )
    }
  }

  const updateCustomItemQuantity = (itemId: string, delta: number) => {
    const nextQuantities = { ...customItemQuantities }
    const nextValue = Math.max(0, Math.min(20, (nextQuantities[itemId] || 0) + delta))

    if (nextValue === 0) {
      delete nextQuantities[itemId]
    } else {
      nextQuantities[itemId] = nextValue
    }

    setCustomItemQuantities(nextQuantities)

    if (submitAttempted || touchedFields.customSelection) {
      const nextCustomSelectionCount = Object.values(nextQuantities).filter((value) => value > 0).length
      setFieldErrors(
        buildValidationErrors(formData, bookingMode, activeCartDraft, nextCustomSelectionCount)
      )
    }
  }

  const resetCustomPlanner = () => {
    setCustomItemQuantities({})
    handleFieldChange('hallStyle', '')
    if (submitAttempted || touchedFields.customSelection) {
      setFieldErrors(buildValidationErrors(formData, bookingMode, activeCartDraft, 0))
    }
    toast.success('تم تصفير التصميم المخصص')
  }

  const clearCartAndRestart = () => {
    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(ORDER_DRAFT_KEY)
    setCartDraftInfo(null)
    setBookingMode('package')
    setCustomItemQuantities({})
    setFieldErrors({})
    setTouchedFields({})
    setSubmitAttempted(false)
    setFormData(createInitialFormData())
    toast.success('تم إفراغ السلة ويمكنك البدء من جديد')
  }

  const getEstimatedTotal = () => {
    if (activeCartDraft) return activeCartDraft.total
    if (bookingMode === 'custom') return customPlannerTotal

    const selectedPackage = packages.find((pkg) => pkg.name === formData.package)
    const guests = Number(formData.guests) || 0
    return (selectedPackage?.price || 0) * guests
  }

  const getNameById = <T extends { id: string; name: string }>(list: readonly T[], id: string) =>
    list.find((item) => item.id === id)?.name || '-'

  const validate = () => {
    const errors = buildValidationErrors()
    setSubmitAttempted(true)
    setFieldErrors(errors)
    return getFirstValidationError(errors)
  }

  const buildSummary = () => {
    const bookingModeName = activeBookingMode.name
    const eventTypeName =
      bookingMode === 'menu'
        ? 'اختيار من المنيو'
        : getNameById(eventTypes as unknown as Array<{ id: string; name: string }>, formData.eventType)
    const deliveryMethodName = getNameById(deliveryMethods, formData.deliveryMethod)
    const paymentMethodName = getNameById(paymentMethods, formData.paymentMethod)
    const contactMethodName = getNameById(contactMethods, formData.contactMethod)
    const venueTypeName = getNameById(venueTypes, formData.venueType)
    const serviceStyleName = getNameById(serviceStyles, formData.serviceStyle)
    const eventDurationName = getNameById(eventDurations, formData.eventDuration)
    const hallStyleValue =
      bookingMode === 'custom'
        ? selectedHallStyle?.name || (recommendedHallStyle ? `${recommendedHallStyle.name} (مقترحة)` : '-')
        : '-'
    const deliveryAddress =
      formData.deliveryMethod === 'delivery' ? formData.deliveryAddress || '-' : 'استلام من الفرع'
    const guestsOrItems =
      bookingMode === 'menu'
        ? activeCartDraft
          ? `${activeCartDraft.count} عنصر`
          : 'لم يتم اختيار أصناف بعد'
        : bookingMode === 'custom'
          ? `${formData.guests || '-'} ضيف • ${customPlannerQuantity} كمية`
          : formData.guests || '-'
    const packageName =
      bookingMode === 'menu'
        ? activeCartDraft
          ? 'الأصناف المحددة من المنيو'
          : 'اذهب إلى صفحة المنيو لاختيار الأصناف'
        : bookingMode === 'custom'
          ? customPlannerSelections.length > 0
            ? `تصميم مخصص (${customPlannerSelections.length} صنف)`
            : 'لم يتم اختيار أصناف بعد'
          : formData.package || '-'
    const total = getEstimatedTotal()
    const normalizedPhone = normalizePhone(formData.phone)

    const items: SummaryItem[] = [
      { label: 'مسار الحجز', value: bookingModeName },
      { label: 'الاسم', value: formData.name || '-' },
      { label: 'الجوال', value: normalizedPhone || '-' },
      { label: 'البريد الإلكتروني', value: formData.email || '-' },
      { label: 'المدينة', value: formData.city || '-' },
      { label: 'نوع المناسبة', value: eventTypeName },
      { label: 'التاريخ', value: formData.eventDate || '-' },
      { label: 'الوقت', value: formData.preferredTime || '-' },
      { label: 'عدد الضيوف / العناصر', value: guestsOrItems },
      { label: 'الموقع', value: formData.location || '-' },
      { label: 'نوع المكان', value: venueTypeName },
      { label: 'شكل القاعة / الجلسة', value: hallStyleValue },
      { label: 'أسلوب التقديم', value: serviceStyleName },
      { label: 'مدة التغطية', value: eventDurationName },
      { label: 'طريقة التوصيل', value: deliveryMethodName },
      { label: 'عنوان التوصيل', value: deliveryAddress },
      { label: 'معلم قريب', value: formData.landmark || '-' },
      { label: 'الباقة / الخطة', value: packageName },
      { label: 'طريقة الدفع', value: paymentMethodName },
      { label: 'طريقة التواصل', value: contactMethodName },
      { label: 'إجمالي المنيو', value: activeCartDraft ? `${activeCartDraft.total} ر.س` : '-' },
      {
        label: 'إجمالي التصميم المخصص',
        value: bookingMode === 'custom' && customPlannerTotal > 0 ? `${customPlannerTotal} ر.س` : '-',
      },
      { label: 'الإجمالي المتوقع', value: total > 0 ? `${total} ر.س` : '-' },
    ]

    const lines = items.map((item) => `${item.label}: ${item.value}`)
    return { items, lines, total }
  }

  const openWhatsApp = () => {
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    const sentAt = new Date().toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    const summary = buildSummary()

    const message = [
      '*طلب حجز جديد*',
      '',
      ...summary.lines.map((line) => `- ${line}`),
      ...(selectionLines.length > 0 ? ['', selectionMessageTitle, ...selectionLines] : []),
      '',
      '*ملاحظات*',
      formData.notes || '-',
      '',
      '*معلومات الإرسال*',
      `- وقت الإرسال: ${sentAt}`,
      '- التوقيت: الرياض',
    ].join('\n')

    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const sendEmail = async () => {
    if (isSubmitting) return

    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    setIsSubmitting(true)

    const summary = buildSummary()
    const orderId = `ORD-${Date.now().toString().slice(-10)}`
    const itemsPayload = [
      ...summary.lines,
      ...(selectionLines.length > 0 ? ['', selectionEmailTitle, ...selectionLines] : []),
    ].join('\n')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        {
          order_id: orderId,
          name: formData.name,
          email: formData.email || '-',
          phone: normalizePhone(formData.phone),
          address:
            formData.deliveryMethod === 'delivery'
              ? formData.deliveryAddress || '-'
              : 'استلام من الفرع',
          items: itemsPayload,
          total: summary.total > 0 ? `${summary.total}` : '-',
          payment_method: getNameById(paymentMethods, formData.paymentMethod),
          notes: formData.notes || '-',
          city: formData.city || '-',
          booking_mode: activeBookingMode.name,
          event_type:
            bookingMode === 'menu'
              ? 'اختيار من المنيو'
              : getNameById(eventTypes as unknown as Array<{ id: string; name: string }>, formData.eventType),
          event_date: formData.eventDate || '-',
          preferred_time: formData.preferredTime || '-',
          guests: bookingMode === 'menu' ? `${activeCartDraft?.count ?? 0}` : formData.guests || '-',
          location: formData.location || '-',
          venue_type: getNameById(venueTypes, formData.venueType),
          hall_style:
            bookingMode === 'custom'
              ? selectedHallStyle?.name || recommendedHallStyle?.name || '-'
              : '-',
          service_style: getNameById(serviceStyles, formData.serviceStyle),
          event_duration: getNameById(eventDurations, formData.eventDuration),
          contact_method: getNameById(contactMethods, formData.contactMethod),
          delivery_method: getNameById(deliveryMethods, formData.deliveryMethod),
        },
        EMAILJS_PUBLIC_KEY
      )

      if (formData.email && isValidEmail(formData.email)) {
        const recipientEmail = formData.email.trim()
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_AUTOREPLY_TEMPLATE_ID,
          {
            to_email: recipientEmail,
            user_email: recipientEmail,
            recipient_email: recipientEmail,
            customer_email: recipientEmail,
            reply_to: recipientEmail,
            email: recipientEmail,
            name: formData.name,
            order_id: orderId,
            total: summary.total > 0 ? `${summary.total}` : '-',
            payment_method: getNameById(paymentMethods, formData.paymentMethod),
            items: itemsPayload,
          },
          EMAILJS_PUBLIC_KEY
        )
      }

      toast.success('تم إرسال الطلب بنجاح')
      localStorage.removeItem(ORDER_DRAFT_KEY)
      setCartDraftInfo(null)
      setBookingMode('package')
      setCustomItemQuantities({})
      setFieldErrors({})
      setTouchedFields({})
      setSubmitAttempted(false)
      setFormData(createInitialFormData())
    } catch (err) {
      console.error(err)
      toast.error('حدث خطأ أثناء الإرسال')
    } finally {
      setIsSubmitting(false)
    }
  }

  const summaryPreview = buildSummary()

  const readinessChecks = useMemo(() => {
    const checks = [
      {
        label: 'الاسم ورقم الجوال',
        done: Boolean(formData.name.trim()) && isValidPhone(formData.phone),
      },
      {
        label: 'المدينة',
        done: Boolean(formData.city.trim()),
      },
      {
        label: 'تاريخ المناسبة والوقت',
        done: Boolean(formData.eventDate && formData.preferredTime),
      },
      ...(bookingMode === 'menu'
        ? [{ label: 'اختيار أصناف من المنيو', done: Boolean(activeCartDraft?.items.length) }]
        : [
            { label: 'نوع المناسبة', done: Boolean(formData.eventType) },
            { label: 'عدد الضيوف', done: Boolean(Number(formData.guests) > 0) },
          ]),
      ...(bookingMode === 'package' ? [{ label: 'الباقة', done: Boolean(formData.package) }] : []),
      ...(bookingMode === 'custom'
        ? [{ label: 'الأصناف والكميات', done: Boolean(customPlannerSelections.length) }]
        : []),
      {
        label: formData.deliveryMethod === 'delivery' ? 'عنوان التوصيل' : 'طريقة الاستلام',
        done: formData.deliveryMethod === 'pickup' || Boolean(formData.deliveryAddress.trim()),
      },
    ]

    return checks
  }, [
    activeCartDraft,
    bookingMode,
    customPlannerSelections.length,
    formData.city,
    formData.deliveryAddress,
    formData.deliveryMethod,
    formData.eventDate,
    formData.eventType,
    formData.guests,
    formData.name,
    formData.package,
    formData.phone,
    formData.preferredTime,
  ])

  const completedReadiness = readinessChecks.filter((item) => item.done).length
  const completionPercentage = Math.round((completedReadiness / readinessChecks.length) * 100)
  const nextPendingItem = readinessChecks.find((item) => !item.done)

  const eventTypeLabel =
    bookingMode === 'menu'
      ? activeCartDraft
        ? 'اختيار من المنيو'
        : 'منيو غير مكتمل'
      : bookingMode === 'custom'
        ? formData.eventType
          ? `${getNameById(eventTypes as unknown as Array<{ id: string; name: string }>, formData.eventType)} • تصميم مخصص`
          : 'تصميم مناسبة بالتفصيل'
        : formData.eventType
          ? `${getNameById(eventTypes as unknown as Array<{ id: string; name: string }>, formData.eventType)} • باقة جاهزة`
          : activeBookingMode.name

  const summaryCards: Array<{ label: string; value: string; icon: typeof Calendar }> = [
    {
      label: 'نوع الطلب',
      value: eventTypeLabel,
      icon: bookingMode === 'menu' ? Store : bookingMode === 'custom' ? ChefHat : PartyPopper,
    },
    {
      label: 'الموعد',
      value:
        formData.eventDate && formData.preferredTime
          ? `${formData.eventDate} • ${formData.preferredTime}`
          : 'أضف التاريخ والوقت',
      icon: Calendar,
    },
    {
      label:
        bookingMode === 'menu'
          ? 'محتوى الطلب'
          : bookingMode === 'custom'
            ? 'الضيوف والتصميم'
            : 'الضيوف والباقة',
      value:
        bookingMode === 'menu'
          ? activeCartDraft
            ? `${activeCartDraft.count} عنصر • ${activeCartDraft.total} ر.س`
            : 'لم تختَر أصنافًا من المنيو بعد'
          : bookingMode === 'custom'
            ? `${formData.guests || '0'} ضيف • ${customPlannerSelections.length} صنف • ${customPlannerQuantity} كمية`
            : `${formData.guests || '0'} ضيف • ${formData.package || 'لم تحدد الباقة'}`,
      icon: Users,
    },
    {
      label: 'الموقع / التوصيل',
      value:
        formData.deliveryMethod === 'pickup'
          ? 'استلام من الفرع'
          : formData.deliveryAddress || formData.location || 'أضف العنوان أو الموقع',
      icon: MapPin,
    },
    {
      label: 'تفاصيل التنفيذ',
      value:
        [
          getNameById(venueTypes, formData.venueType),
          bookingMode === 'custom'
            ? selectedHallStyle?.name || recommendedHallStyle?.name || '-'
            : '-',
          getNameById(serviceStyles, formData.serviceStyle),
          getNameById(eventDurations, formData.eventDuration),
        ]
          .filter((item) => item !== '-')
          .join(' • ') ||
        (bookingMode === 'custom'
          ? 'أضف نوع المكان والجلسة وأسلوب التقديم ومدة المناسبة'
          : 'أضف نوع المكان وأسلوب التقديم ومدة المناسبة'),
      icon: Utensils,
    },
    {
      label: 'طريقة الدفع',
      value: getNameById(paymentMethods, formData.paymentMethod),
      icon: Wallet,
    },
    {
      label: 'طريقة التواصل',
      value: getNameById(contactMethods, formData.contactMethod),
      icon: MessageCircle,
    },
  ]

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/menu-juices.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/70" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-dark sm:min-h-[68vh] md:min-h-[74vh]">
          <div className="absolute inset-0">
            <img
              src="/images/menu-mixed-grill.jpg"
              alt="حجز بوفيه وضيافة"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/70 to-dark/85" />
          </div>
          <div className="absolute -top-10 right-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />

          <div className="container-custom relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold font-arabic sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              تجربة حجز أسهل وأكثر وضوحًا
            </span>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-white font-arabic sm:mb-6 sm:text-5xl md:text-6xl">
              احجز <span className="text-gradient-gold">مناسبتك</span>
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-8 text-white/70 font-arabicBody sm:text-lg md:text-xl">
              من أول بيانات التواصل إلى الملخص النهائي، كل شيء هنا مرتب لتكمل طلبك بسهولة
              وتراجع التفاصيل قبل الإرسال بثقة.
            </p>

            <div className="mt-8 grid gap-3 text-right md:mt-10 md:grid-cols-3 md:gap-4">
              {bookingHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm sm:p-5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10">
                    <item.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-arabic">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black/70 py-10 sm:py-16">
          <div className="container-custom max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 grid gap-3 sm:mb-8 md:grid-cols-2 xl:grid-cols-4">
              {bookingSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-2xl border border-gold/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5"
                >
                  <span className="inline-flex rounded-full border border-gold/15 bg-gold/10 px-3 py-1 text-xs text-gold font-arabic">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white font-arabic">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <form
              id="booking-form"
              onSubmit={(e) => {
                e.preventDefault()
                void sendEmail()
              }}
              className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.35fr)_360px]"
            >
              <div className="space-y-4 sm:space-y-6">
                {cartDraftInfo && (
                  <div className="grid gap-3 rounded-[26px] border border-gold/30 bg-gradient-to-r from-gold/15 to-gold/5 p-4 sm:gap-4 sm:rounded-[30px] sm:p-6 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gold font-arabic">
                        {bookingMode === 'menu' ? 'طلب محمّل من المنيو' : 'يوجد طلب محفوظ من المنيو'}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white font-arabic">
                        {bookingMode === 'menu' ? 'بياناتك الأساسية فقط' : 'يمكنك الرجوع إليه في أي وقت'}
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-black/20 p-4">
                      <p className="text-xs text-white/55 font-arabic">عدد العناصر</p>
                      <p className="mt-2 text-2xl font-bold text-white">{cartDraftInfo.count}</p>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-black/20 p-4">
                      <p className="text-xs text-white/55 font-arabic">إجمالي السلة</p>
                      <p className="mt-2 text-2xl font-bold text-gold">
                        {cartDraftInfo.total} ر.س
                      </p>
                    </div>
                    <div
                      className={cn(
                        'md:col-span-3 grid gap-3',
                        bookingMode !== 'menu' ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
                      )}
                    >
                      {bookingMode !== 'menu' && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 border-gold/35 bg-black/20 text-gold hover:bg-gold/10 hover:text-gold font-arabic sm:h-12 sm:text-base"
                          onClick={() => handleBookingModeChange('menu')}
                        >
                          <Store className="ml-2 h-4 w-4" />
                          استخدم طلب المنيو المحفوظ
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-red-500/35 bg-red-500/5 text-sm text-red-200 hover:bg-red-500/10 hover:text-red-100 font-arabic sm:h-12 sm:text-base"
                        onClick={clearCartAndRestart}
                      >
                        <RotateCcw className="ml-2 h-4 w-4" />
                        إفراغ السلة والبدء من جديد
                      </Button>
                    </div>
                  </div>
                )}

                <SectionCard
                  index={sectionIndices.contact}
                  icon={Phone}
                  title="بيانات التواصل"
                  description="هذه البيانات تساعدنا على الوصول لك بسرعة وتأكيد الطلب بالطريقة المناسبة."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel required>الاسم الكامل</FieldLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        onBlur={() => handleFieldBlur('name')}
                        className={cn(
                          bookingInputClass,
                          getVisibleError('name') &&
                            'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                        )}
                        placeholder="مثال: أحمد محمد"
                      />
                      <FieldError message={getVisibleError('name')} />
                    </div>
                    <div>
                      <FieldLabel required hint="رقم جوال فعال">
                        رقم الجوال
                      </FieldLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        onBlur={() => handleFieldBlur('phone')}
                        className={cn(
                          bookingInputClass,
                          getVisibleError('phone') &&
                            'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                        )}
                        placeholder="05xxxxxxxx"
                      />
                      <FieldError message={getVisibleError('phone')} />
                    </div>
                    <div>
                      <FieldLabel>البريد الإلكتروني</FieldLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => handleFieldBlur('email')}
                        className={cn(
                          bookingInputClass,
                          getVisibleError('email') &&
                            'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                        )}
                        placeholder="name@example.com"
                      />
                      <FieldError message={getVisibleError('email')} />
                    </div>
                    <div>
                      <FieldLabel required>المدينة</FieldLabel>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        onBlur={() => handleFieldBlur('city')}
                        className={cn(
                          bookingInputClass,
                          getVisibleError('city') &&
                            'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                        )}
                        placeholder="الرياض، جدة، مكة..."
                      />
                      <FieldError message={getVisibleError('city')} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  index={sectionIndices.mode}
                  icon={activeBookingMode.icon}
                  title="طريقة الحجز"
                  description="اختَر المسار المناسب لك: باقة جاهزة، منيو، أو تصميم مناسبتك بالتفصيل."
                >
                  <div className="grid gap-3 lg:grid-cols-3">
                    {bookingModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleBookingModeChange(mode.id)}
                        className={cn(
                          'rounded-2xl border p-5 text-right transition-all duration-300',
                          bookingMode === mode.id
                            ? 'border-gold bg-gradient-to-br from-gold/20 to-gold/5 shadow-[0_0_0_1px_rgba(212,175,55,0.32)]'
                            : 'border-gold/20 bg-dark-700/20 hover:border-gold/45 hover:bg-gold/5'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-base font-bold text-white font-arabic">{mode.name}</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                              {mode.description}
                            </p>
                          </div>
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-black/20">
                            <mode.icon
                              className={cn(
                                'h-5 w-5',
                                bookingMode === mode.id ? 'text-gold' : 'text-white/60'
                              )}
                            />
                          </div>
                        </div>
                        <span className="mt-4 inline-flex rounded-full border border-gold/15 bg-white/5 px-3 py-1 text-[11px] text-gold font-arabic">
                          {mode.highlight}
                        </span>
                      </button>
                    ))}
                  </div>

                  {bookingMode === 'menu' && !activeCartDraft && (
                    <div className="mt-5 rounded-[24px] border border-gold/20 bg-black/15 p-4 sm:p-5">
                      <p className="text-sm text-gold font-arabic">لم يتم تحميل أصناف بعد</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                        إذا كنت تفضل الاختيار من المنيو فقط، افتح صفحة المنيو وحدد الأصناف ثم ارجع هنا لإكمال بيانات الموعد والتوصيل.
                      </p>
                      <div className="mt-4">
                        <Button
                          type="button"
                          asChild
                          className="bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic"
                        >
                          <Link to="/menu">
                            <Store className="ml-2 h-4 w-4" />
                            فتح المنيو
                          </Link>
                        </Button>
                      </div>
                      <FieldError message={getVisibleError('menuSelection')} />
                    </div>
                  )}

                  {bookingMode === 'custom' && (
                    <div className="mt-5 rounded-[24px] border border-gold/20 bg-black/15 p-4 sm:p-5">
                      <p className="text-sm text-gold font-arabic">مسار تصميم المناسبة</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                        في هذا المسار تقدر تختار الجلسة أو القاعة المناسبة، ثم تحدد أصناف الوليمة والكميات التي تناسب ضيوفك بدون الالتزام بباقة ثابتة.
                      </p>
                    </div>
                  )}
                </SectionCard>

                {bookingMode !== 'menu' && (
                  <SectionCard
                    index={sectionIndices.eventType}
                    icon={PartyPopper}
                    title="نوع المناسبة"
                    description="اختر نوع المناسبة حتى نجهز لك تجربة ضيافة مناسبة لطبيعة الحدث."
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {eventTypes.map((eventType) => (
                        <button
                          key={eventType.id}
                          type="button"
                          onClick={() => handleFieldChange('eventType', eventType.id)}
                          className={getChoiceCardClass(formData.eventType === eventType.id)}
                        >
                          <eventType.icon
                            className={cn(
                              'h-6 w-6',
                              formData.eventType === eventType.id ? 'text-gold' : 'text-white/60'
                            )}
                          />
                          <p
                            className={cn(
                              'font-arabic text-sm',
                              formData.eventType === eventType.id ? 'text-gold' : 'text-white/75'
                            )}
                          >
                            {eventType.name}
                          </p>
                        </button>
                      ))}
                    </div>
                    <FieldError message={getVisibleError('eventType')} />
                  </SectionCard>
                )}

                <SectionCard
                  index={sectionIndices.details}
                  icon={Calendar}
                  title="تفاصيل المناسبة"
                  description={
                    bookingMode === 'menu'
                      ? 'أضف الموعد ومكان التنفيذ وطريقة الاستلام حتى نراجع طلب المنيو بشكل أدق.'
                      : 'أضف الموعد وعدد الضيوف ونوع المكان وأسلوب التقديم حتى تكون المراجعة والتجهيز أدق وأسهل.'
                  }
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-gold/15 bg-white/5 p-4 md:col-span-2">
                      <p className="text-sm text-gold font-arabic">
                        {bookingMode === 'menu' ? 'بيانات أساسية + مراجعة أسرع' : 'تفاصيل أدق = تجهيز أسرع'}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                        {bookingMode === 'menu'
                          ? 'في هذا المسار نركز على الموعد وطريقة التنفيذ لأن الأصناف مختارة بالفعل من المنيو.'
                          : 'كل معلومة إضافية هنا تساعدنا في تحديد أسلوب التقديم والطاقم المناسب وطبيعة التنفيذ قبل التواصل معك.'}
                      </p>
                    </div>
                    <div>
                      <FieldLabel required>تاريخ المناسبة</FieldLabel>
                      <div className="relative">
                        <Calendar className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                        <Input
                          type="date"
                          min={minDate}
                          value={formData.eventDate}
                          onChange={(e) => handleFieldChange('eventDate', e.target.value)}
                          onBlur={() => handleFieldBlur('eventDate')}
                          className={cn(
                            bookingInputClass,
                            'pr-12',
                            getVisibleError('eventDate') &&
                              'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                          )}
                        />
                      </div>
                      <FieldError message={getVisibleError('eventDate')} />
                    </div>
                    <div>
                      <FieldLabel required>الوقت المفضل</FieldLabel>
                      <div className="relative">
                        <Timer className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                        <Input
                          type="time"
                          value={formData.preferredTime}
                          onChange={(e) => handleFieldChange('preferredTime', e.target.value)}
                          onBlur={() => handleFieldBlur('preferredTime')}
                          className={cn(
                            bookingInputClass,
                            'pr-12',
                            getVisibleError('preferredTime') &&
                              'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                          )}
                        />
                      </div>
                      <FieldError message={getVisibleError('preferredTime')} />
                    </div>
                    {bookingMode !== 'menu' && (
                      <div>
                        <FieldLabel required>عدد الضيوف</FieldLabel>
                        <div className="relative">
                          <Users className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                          <Input
                            type="number"
                            min="1"
                            value={formData.guests}
                            onChange={(e) => handleFieldChange('guests', e.target.value)}
                            onBlur={() => handleFieldBlur('guests')}
                            className={cn(
                              bookingInputClass,
                              'pr-12',
                              getVisibleError('guests') &&
                                'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                            )}
                            placeholder="مثال: 80"
                          />
                        </div>
                        <FieldError message={getVisibleError('guests')} />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <FieldLabel>مكان المناسبة</FieldLabel>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
                        <Input
                          value={formData.location}
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                          className={cn(bookingInputClass, 'pr-12')}
                          placeholder="مثال: قاعة، منزل، استراحة..."
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel hint="اختياري لكن مهم">نوع المكان</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {venueTypes.map((venue) => (
                          <button
                            key={venue.id}
                            type="button"
                            onClick={() => handleFieldChange('venueType', venue.id)}
                            className={getChoiceCardClass(formData.venueType === venue.id)}
                          >
                            <p
                              className={cn(
                                'font-arabic text-sm',
                                formData.venueType === venue.id ? 'text-gold' : 'text-white/75'
                              )}
                            >
                              {venue.name}
                            </p>
                            <p className="text-xs leading-relaxed text-white/45 font-arabicBody">
                              {venue.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel hint="اختياري لكن مفيد">أسلوب التقديم</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {serviceStyles.map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => handleFieldChange('serviceStyle', style.id)}
                            className={getChoiceCardClass(formData.serviceStyle === style.id)}
                          >
                            <p
                              className={cn(
                                'font-arabic text-sm',
                                formData.serviceStyle === style.id ? 'text-gold' : 'text-white/75'
                              )}
                            >
                              {style.name}
                            </p>
                            <p className="text-xs leading-relaxed text-white/45 font-arabicBody">
                              {style.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel hint="اختياري">مدة التغطية المتوقعة</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {eventDurations.map((duration) => (
                          <button
                            key={duration.id}
                            type="button"
                            onClick={() => handleFieldChange('eventDuration', duration.id)}
                            className={getChoiceCardClass(formData.eventDuration === duration.id)}
                          >
                            <p
                              className={cn(
                                'font-arabic text-sm',
                                formData.eventDuration === duration.id ? 'text-gold' : 'text-white/75'
                              )}
                            >
                              {duration.name}
                            </p>
                            <p className="text-xs leading-relaxed text-white/45 font-arabicBody">
                              {duration.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {bookingMode === 'custom' && (
                  <SectionCard
                    index={sectionIndices.custom}
                    icon={ChefHat}
                    title="صمّم مناسبتك بالتفصيل"
                    description="اختَر الجلسة أو القاعة المناسبة ثم حدد الأصناف والكميات التي تناسب ضيوفك."
                  >
                    <div className="space-y-5">
                      {recommendedHallStyle && !selectedHallStyle && (
                        <div className="rounded-[24px] border border-gold/20 bg-gradient-to-r from-gold/15 to-gold/5 p-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm text-gold font-arabic">اقتراح مناسب لعدد الضيوف</p>
                              <h3 className="mt-2 text-lg font-bold text-white font-arabic">
                                {recommendedHallStyle.name}
                              </h3>
                              <p className="mt-1 text-sm text-white/60 font-arabicBody">
                                {recommendedHallStyle.capacity} • {recommendedHallStyle.description}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-gold/35 bg-black/20 text-gold hover:bg-gold/10 hover:text-gold font-arabic"
                              onClick={() => handleFieldChange('hallStyle', recommendedHallStyle.id)}
                            >
                              اختيار هذا الاقتراح
                            </Button>
                          </div>
                        </div>
                      )}

                      <div>
                        <FieldLabel hint="اختياري لكن مفيد">شكل القاعة أو الجلسة</FieldLabel>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                          {hallStyles.map((hall) => (
                            <button
                              key={hall.id}
                              type="button"
                              onClick={() => handleFieldChange('hallStyle', hall.id)}
                              className={cn(
                                'rounded-2xl border p-4 text-right transition-all duration-300',
                                formData.hallStyle === hall.id
                                  ? 'border-gold bg-gradient-to-br from-gold/20 to-gold/5 shadow-[0_0_0_1px_rgba(212,175,55,0.32)]'
                                  : 'border-gold/20 bg-dark-700/20 hover:border-gold/45 hover:bg-gold/5'
                              )}
                            >
                              <p className="text-sm font-bold text-white font-arabic">{hall.name}</p>
                              <p className="mt-2 text-xs text-gold font-arabic">{hall.capacity}</p>
                              <p className="mt-2 text-sm leading-relaxed text-white/55 font-arabicBody">
                                {hall.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-gold/15 bg-white/5 p-4">
                          <p className="text-xs text-white/45 font-arabic">الأصناف المختارة</p>
                          <p className="mt-2 text-2xl font-bold text-white font-arabic">
                            {customPlannerSelections.length}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-gold/15 bg-white/5 p-4">
                          <p className="text-xs text-white/45 font-arabic">إجمالي الكميات</p>
                          <p className="mt-2 text-2xl font-bold text-white font-arabic">
                            {customPlannerQuantity}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-gold/15 bg-white/5 p-4">
                          <p className="text-xs text-white/45 font-arabic">التقدير الحالي</p>
                          <p className="mt-2 text-2xl font-bold text-gold font-arabic">
                            {customPlannerTotal > 0 ? `${customPlannerTotal} ر.س` : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-red-500/35 bg-red-500/5 text-red-200 hover:bg-red-500/10 hover:text-red-100 font-arabic"
                          onClick={resetCustomPlanner}
                        >
                          <RotateCcw className="ml-2 h-4 w-4" />
                          تصفير الكميات
                        </Button>
                      </div>

                      <div className="space-y-5">
                        {customPlannerCategories.map((category) => {
                          const categoryItems = customPlannerItems.filter(
                            (item) => item.category === category.id
                          )

                          return (
                            <div
                              key={category.id}
                              className="rounded-[24px] border border-white/8 bg-black/10 p-4 sm:p-5"
                            >
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <h3 className="text-lg font-bold text-white font-arabic">
                                    {category.label}
                                  </h3>
                                  <p className="mt-1 text-xs text-white/45 font-arabic">
                                    اختر الأصناف المناسبة وحدد الكميات المطلوبة.
                                  </p>
                                </div>
                                <span className="rounded-full border border-gold/15 bg-gold/10 px-3 py-1 text-[11px] text-gold font-arabic">
                                  {categoryItems.length} خيارات
                                </span>
                              </div>

                              <div className="grid gap-3 lg:grid-cols-2">
                                {categoryItems.map((item) => {
                                  const quantity = customItemQuantities[item.id] || 0
                                  const itemTotal = quantity * item.price

                                  return (
                                    <div
                                      key={item.id}
                                      className={cn(
                                        'rounded-2xl border p-4 transition-all duration-300',
                                        quantity > 0
                                          ? 'border-gold bg-gradient-to-br from-gold/15 to-gold/5'
                                          : 'border-white/8 bg-white/[0.03]'
                                      )}
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-sm font-bold text-white font-arabic">
                                            {item.name}
                                          </p>
                                          <p className="mt-2 text-sm leading-relaxed text-white/55 font-arabicBody">
                                            {item.description}
                                          </p>
                                        </div>
                                        <span className="rounded-full bg-black/20 px-3 py-1 text-[11px] text-gold font-arabic">
                                          {item.price} ر.س / {item.unit}
                                        </span>
                                      </div>

                                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center rounded-full border border-gold/20 bg-black/20 px-2 py-1">
                                          <button
                                            type="button"
                                            className="rounded-full p-2 text-gold transition-colors hover:bg-gold/10 hover:text-white"
                                            onClick={() => updateCustomItemQuantity(item.id, -1)}
                                          >
                                            <Minus className="h-4 w-4" />
                                          </button>
                                          <span className="min-w-[64px] text-center text-sm text-white font-arabic">
                                            {quantity} {item.unit}
                                          </span>
                                          <button
                                            type="button"
                                            className="rounded-full p-2 text-gold transition-colors hover:bg-gold/10 hover:text-white"
                                            onClick={() => updateCustomItemQuantity(item.id, 1)}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </button>
                                        </div>

                                        <div className="text-right">
                                          <p className="text-[11px] text-white/45 font-arabic">
                                            إجمالي الصنف
                                          </p>
                                          <p className="mt-1 text-sm font-bold text-gold font-arabic">
                                            {itemTotal > 0 ? `${itemTotal} ر.س` : '-'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <FieldError message={getVisibleError('customSelection')} />
                    </div>
                  </SectionCard>
                )}

                <SectionCard
                  index={sectionIndices.delivery}
                  icon={Truck}
                  title="التوصيل أو الاستلام"
                  description="اختر طريقة استلام الطلب، وأضف العنوان إن كنت تحتاج التوصيل."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {deliveryMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handleFieldChange('deliveryMethod', method.id)}
                        className={getChoiceCardClass(formData.deliveryMethod === method.id)}
                      >
                        <method.icon
                          className={cn(
                            'h-6 w-6',
                            formData.deliveryMethod === method.id ? 'text-gold' : 'text-white/60'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm font-arabic',
                            formData.deliveryMethod === method.id ? 'text-gold' : 'text-white/75'
                          )}
                        >
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-5">
                    {formData.deliveryMethod === 'delivery' && (
                      <div>
                        <FieldLabel required>عنوان التوصيل</FieldLabel>
                        <Textarea
                          value={formData.deliveryAddress}
                          onChange={(e) => handleFieldChange('deliveryAddress', e.target.value)}
                          onBlur={() => handleFieldBlur('deliveryAddress')}
                          className={cn(
                            bookingTextareaClass,
                            'min-h-[110px]',
                            getVisibleError('deliveryAddress') &&
                              'border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20'
                          )}
                          placeholder="اكتب الحي والشارع ورقم المبنى أو أي تفاصيل مهمة للوصول"
                        />
                        <FieldError message={getVisibleError('deliveryAddress')} />
                      </div>
                    )}
                    <div>
                      <FieldLabel>أقرب معلم بارز</FieldLabel>
                      <Input
                        value={formData.landmark}
                        onChange={(e) => handleFieldChange('landmark', e.target.value)}
                        className={bookingInputClass}
                        placeholder="يساعدنا في الوصول بسرعة أكبر"
                      />
                    </div>
                  </div>
                </SectionCard>

                {bookingMode === 'package' && (
                  <SectionCard
                    index={sectionIndices.package}
                    icon={Utensils}
                    title="اختيار الباقة"
                    description="اختر الباقة المناسبة لعدد الضيوف وطبيعة المناسبة."
                  >
                    <div className="grid gap-3 lg:grid-cols-3">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.name}
                          type="button"
                          onClick={() => handleFieldChange('package', pkg.name)}
                          className={cn(
                            'rounded-2xl border p-5 text-right transition-all duration-300',
                            formData.package === pkg.name
                              ? 'border-gold bg-gradient-to-br from-gold/20 to-gold/5 shadow-[0_0_0_1px_rgba(212,175,55,0.32)]'
                              : 'border-gold/20 bg-dark-700/20 hover:border-gold/45 hover:bg-gold/5'
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-white font-arabic font-bold">{pkg.name}</p>
                            <span className="rounded-full bg-black/20 px-3 py-1 text-xs text-gold">
                              {pkg.price} ر.س / شخص
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-white/60 font-arabicBody">
                            {pkg.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    <FieldError message={getVisibleError('package')} />
                  </SectionCard>
                )}

                <SectionCard
                  index={sectionIndices.payment}
                  icon={Wallet}
                  title="الدفع وطريقة التواصل"
                  description="حدد طريقة الدفع المفضلة، ثم اختر الطريقة التي ترغب أن نتواصل بها معك."
                >
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <FieldLabel>طريقة الدفع</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handleFieldChange('paymentMethod', method.id)}
                            className={getChoiceCardClass(formData.paymentMethod === method.id)}
                          >
                            <method.icon
                              className={cn(
                                'h-5 w-5',
                                formData.paymentMethod === method.id ? 'text-gold' : 'text-white/60'
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs font-arabic',
                                formData.paymentMethod === method.id ? 'text-gold' : 'text-white/75'
                              )}
                            >
                              {method.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <FieldLabel>طريقة التواصل</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {contactMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handleFieldChange('contactMethod', method.id)}
                            className={getChoiceCardClass(formData.contactMethod === method.id)}
                          >
                            <method.icon
                              className={cn(
                                'h-5 w-5',
                                formData.contactMethod === method.id ? 'text-gold' : 'text-white/60'
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs font-arabic',
                                formData.contactMethod === method.id ? 'text-gold' : 'text-white/75'
                              )}
                            >
                              {method.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  index={sectionIndices.notes}
                  icon={Mail}
                  title="ملاحظات إضافية"
                  description="أضف أي طلب خاص أو تفاصيل إضافية تريد أن يطّلع عليها فريقنا قبل التواصل معك."
                >
                  {selectionReviewItems.length > 0 && (
                    <div className="mb-5 rounded-[24px] border border-gold/20 bg-black/15 p-4 sm:rounded-[26px] sm:p-5">
                      <div className="flex flex-col gap-4 border-b border-white/8 pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm text-gold font-arabic">{selectionBreakdownTitle}</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                            {selectionBreakdownDescription}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="rounded-2xl border border-gold/15 bg-white/5 px-4 py-3 text-center">
                            <p className="text-[11px] text-white/45 font-arabic">{selectionCountLabel}</p>
                            <p className="mt-1 text-lg font-bold text-white font-arabic">
                              {selectionCountValue}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-gold/15 bg-white/5 px-4 py-3 text-center">
                            <p className="text-[11px] text-white/45 font-arabic">{selectionTotalLabel}</p>
                            <p className="mt-1 text-lg font-bold text-gold font-arabic">
                              {selectionTotalValue} ر.س
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 max-h-[240px] space-y-3 overflow-y-auto pl-1 sm:max-h-[260px]">
                        {selectionReviewItems.map((item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3"
                          >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white font-arabic">
                                  {index + 1}. {item.name}
                                </p>
                                <p className="mt-1 text-xs text-white/45 font-arabicBody">
                                  {item.subtitle}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full border border-gold/15 bg-gold/10 px-3 py-1 text-xs text-gold font-arabic">
                                  الكمية: {item.quantity}
                                  {item.quantitySuffix ? ` ${item.quantitySuffix}` : ''}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 font-arabic">
                                  الإجمالي: {item.total} ر.س
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <FieldLabel hint="اختياري">ملاحظاتك الخاصة</FieldLabel>
                  <Textarea
                    dir="rtl"
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className={cn(bookingTextareaClass, 'min-h-[150px] text-right leading-7 sm:min-h-[170px]')}
                    placeholder="مثل: وقت الوصول المفضل، أدوات التقديم المطلوبة، تعليمات المكان، أو أي طلبات خاصة إضافية..."
                  />
                </SectionCard>
              </div>

              <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-28">
                <div className="glassmorphism-light rounded-[24px] border border-gold/25 p-4 sm:rounded-[28px] sm:p-6">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                    <div>
                      <p className="text-sm text-gold font-arabic">جاهزية الطلب</p>
                      <h3 className="mt-2 text-2xl font-bold text-white font-arabic">
                        {completionPercentage}% مكتمل
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold font-bold sm:h-14 sm:w-14">
                      {completedReadiness}/{readinessChecks.length}
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold via-[#f3d27a] to-[#fff2b3] transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    {readinessChecks.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2"
                      >
                        <span className="text-sm text-white/70 font-arabic">{item.label}</span>
                        <CheckCircle2
                          className={cn('h-4 w-4', item.done ? 'text-gold' : 'text-white/25')}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-gold/15 bg-gold/10 p-4">
                    <p className="text-xs text-white/60 font-arabic">المطلوب التالي</p>
                    <p className="mt-2 text-sm text-gold font-arabic">
                      {nextPendingItem ? nextPendingItem.label : 'الطلب جاهز للإرسال'}
                    </p>
                  </div>
                </div>

                <div className="glassmorphism-light rounded-[24px] border border-gold/25 p-4 sm:rounded-[28px] sm:p-6">
                  <h3 className="text-lg font-bold text-white font-arabic">ملخص سريع</h3>
                  <div className="mt-4 space-y-3">
                    {summaryCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/5 bg-black/10 p-3.5 sm:p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10">
                            <item.icon className="h-5 w-5 text-gold" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-white/45 font-arabic">{item.label}</p>
                            <p className="mt-1 text-sm leading-relaxed text-white/80 font-arabic">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/20 to-gold/5 p-4">
                    <p className="text-xs text-white/55 font-arabic">الإجمالي المتوقع</p>
                    <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                      <p className="text-2xl font-bold text-gold font-arabic">
                        {summaryPreview.total > 0 ? `${summaryPreview.total} ر.س` : '-'}
                      </p>
                      <span className="text-xs text-white/45 font-arabic">
                        {bookingMode === 'menu'
                          ? 'تم احتسابه من المنيو المختار'
                          : bookingMode === 'custom'
                            ? 'تم احتسابه من الأصناف والكميات المختارة'
                            : 'يُحسب من الباقة وعدد الضيوف'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphism-light rounded-[24px] border border-gold/25 p-4 sm:rounded-[28px] sm:p-6">
                  <h3 className="text-lg font-bold text-white font-arabic">إرسال الطلب</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60 font-arabicBody">
                    بعد مراجعة الملخص يمكنك إرسال الطلب فورًا، وسنعود إليك عبر وسيلة التواصل
                    التي اخترتها.
                  </p>

                  <div className="mt-5 space-y-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 w-full bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic"
                    >
                      <Mail className="ml-2 h-4 w-4" />
                      {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={openWhatsApp}
                      className="h-12 w-full border-green-500/40 bg-green-500/5 text-green-400 hover:bg-green-500/10 font-arabic"
                    >
                      <MessageCircle className="ml-2 h-4 w-4" />
                      إرسال عبر واتساب
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a
                      href={`tel:+${WHATSAPP_NUMBER}`}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/75 transition-colors hover:border-gold/30 hover:text-white font-arabic"
                    >
                      <Phone className="h-4 w-4 text-gold" />
                      اتصال مباشر
                    </a>
                    <a
                      href="mailto:saadbarghouth11@gmail.com"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/75 transition-colors hover:border-gold/30 hover:text-white font-arabic"
                    >
                      <Mail className="h-4 w-4 text-gold" />
                      مراسلة إيميل
                    </a>
                  </div>
                </div>

                <div className="glassmorphism-light rounded-[24px] border border-gold/25 p-4 sm:rounded-[28px] sm:p-6">
                  <h3 className="text-lg font-bold text-white font-arabic">ماذا يحدث بعد الإرسال؟</h3>
                  <div className="mt-4 space-y-3">
                    {[
                      'نراجع الطلب والتفاصيل الأساسية.',
                      'نتواصل معك لتأكيد الموعد والخدمة المطلوبة.',
                      'نرتب التنفيذ النهائي حسب ما تم الاتفاق عليه.',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                        <p className="text-sm leading-relaxed text-white/65 font-arabicBody">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
