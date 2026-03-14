import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { 
  Award, Users, Clock, CheckCircle2, Star, Target, Heart, Lightbulb,
  TrendingUp, Shield, Sparkles, Phone, Mail
} from 'lucide-react'
import AnimatedCounter from '@/components/AnimatedCounter'
import RevealOnScroll from '@/components/RevealOnScroll'

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const stats = [
  { value: 30, suffix: '+', label: 'عام من الخبرة', icon: Clock },
  { value: 5000, suffix: '+', label: 'حفلة ناجحة', icon: Award },
  { value: 50, suffix: '+', label: 'طبق متنوع', icon: Star },
  { value: 100, suffix: '%', label: 'رضا العملاء', icon: Heart },
]

const values = [
  {
    icon: Heart,
    title: 'الجودة أولاً',
    description: 'نستخدم فقط أفضل المكونات الطازجة لضمان أعلى معايير الجودة في كل طبق نقدمه.',
  },
  {
    icon: Users,
    title: 'العملاء في المقام الأول',
    description: 'نسعى دائماً لتجاوز توقعات عملائنا وتقديم تجربة استثنائية في كل مناسبة.',
  },
  {
    icon: Target,
    title: 'الالتزام بالمواعيد',
    description: 'نحن ندرك أهمية الوقت في المناسبات، لذا نلتزم دائماً بالمواعيد المحددة.',
  },
  {
    icon: Lightbulb,
    title: 'الابتكار المستمر',
    description: 'نطور باستمرار قائمتنا وخدماتنا لتلبية احتياجات عملائنا المتغيرة.',
  },
]

const timeline = [
  {
    year: '1994',
    title: 'التأسيس',
    description: 'تأسست النخبة للحفلات والإعاشة كمشروع عائلي صغير في الرياض.',
  },
  {
    year: '2000',
    title: 'التوسع الأول',
    description: 'افتتاح أول مطبخ مركزي وتوظيف فريق من الطهاة المحترفين.',
  },
  {
    year: '2010',
    title: 'الاعتراف الإقليمي',
    description: 'حصلنا على عدة جوائز كأفضل شركة إعاشة في المنطقة الوسطى.',
  },
  {
    year: '2015',
    title: 'التوسع الوطني',
    description: 'بدأنا في تقديم خدماتنا في جميع أنحاء المملكة العربية السعودية.',
  },
  {
    year: '2020',
    title: 'التحول الرقمي',
    description: 'إطلاق منصة الحجز الإلكتروني وتطبيق خدمة العملاء المتقدمة.',
  },
  {
    year: '2024',
    title: '30 عاماً من التميز',
    description: 'نحتفل بثلاثة عقود من تقديم خدمات الإعاشة الفاخرة.',
  },
]

const team = [
  {
    name: 'الشيف أحمد',
    role: 'الشيف التنفيذي',
    image: '/images/team-09.jpg',
    experience: '25 عاماً',
  },
  {
    name: 'الشيف يوسف',
    role: 'رئيس قسم المأكولات الشرقية',
    image: '/images/team-12.jpg',
    experience: '14 عاماً',
  },
  {
    name: 'الشيف مريم',
    role: 'رئيسة قسم الحلويات',
    image: '/images/team-chef-07.jpg',
    experience: '9 سنوات',
  },
  {
    name: 'الشيف ندى',
    role: 'رئيسة قسم المخبوزات',
    image: '/images/team-04.jpg',
    experience: '12 عاماً',
  },
  {
    name: 'الشيف هالة',
    role: 'مشرفة خط الإنتاج',
    image: '/images/team-chef-10.jpg',
    experience: '11 عاماً',
  },
  {
    name: 'الشيف رنا',
    role: 'مسؤولة تطوير الوصفات',
    image: '/images/team-chef-11.jpg',
    experience: '10 سنوات',
  },
  {
    name: 'عمر الحربي',
    role: 'منسق الضيافة',
    image: '/images/team-office-01.jpg',
    experience: '8 سنوات',
  },
  {
    name: 'فهد العنزي',
    role: 'مدير العمليات',
    image: '/images/team-office-04.jpg',
    experience: '15 عاماً',
  },
  {
    name: 'خالد السبيعي',
    role: 'مدير التشغيل الميداني',
    image: '/images/team-office-03.jpg',
    experience: '12 عاماً',
  },
  {
    name: 'رجب عبدة',
    role: 'مسؤول المبيعات والتسويق',
    image: '/images/ragab-abda-sales.png',
    experience: 'مبيعات وتسويق',
  },
  {
    name: 'ناصر الحربي',
    role: 'مسؤول الجودة وسلامة الغذاء',
    image: '/images/team-office-05.jpg',
    experience: '11 عاماً',
  },
  {
    name: 'سامي الزهراني',
    role: 'مسؤول الحجوزات',
    image: '/images/team-office-06.jpg',
    experience: '7 سنوات',
  },
  {
    name: 'الشيف تركي',
    role: 'رئيس قسم الولائم والصواني',
    image: '/images/team-08.jpg',
    experience: '16 عاماً',
  },
  {
    name: 'الشيف سارة',
    role: 'مشرفة تجهيز البوفيه',
    image: '/images/team-chef-09.jpg',
    experience: '10 سنوات',
  },
  {
    name: 'عبدالرحمن القحطاني',
    role: 'قائد فريق الضيافة الميداني',
    image: '/images/team-office-07.jpg',
    experience: '9 سنوات',
  },
  {
    name: 'ريم العتيبي',
    role: 'منسقة الفعاليات والتنفيذ',
    image: '/images/team-office-09.jpg',
    experience: '8 سنوات',
  },
  {
    name: 'مازن الشهراني',
    role: 'مسؤول الإمداد والتجهيز',
    image: '/images/team-office-08.jpg',
    experience: '11 عاماً',
  },
  {
    name: 'الشيف لينا',
    role: 'مختصة تقديم وحلويات المناسبات',
    image: '/images/team-chef-08.jpg',
    experience: '9 سنوات',
  },
]

const certifications = [
  {
    title: 'ISO 22000',
    desc: 'نظام إدارة سلامة الغذاء لضمان جودة التخزين والتجهيز والتقديم.',
    icon: Shield,
    badge: 'سلامة الغذاء',
  },
  {
    title: 'HACCP',
    desc: 'تحليل المخاطر ونقاط المراقبة الحرجة في جميع مراحل الإعداد والتشغيل.',
    icon: CheckCircle2,
    badge: 'اعتماد تشغيلي',
  },
  {
    title: 'جائزة التميز',
    desc: 'تكريم يعكس تميزنا في تنفيذ خدمات الإعاشة والضيافة للمناسبات الكبرى.',
    icon: Award,
    badge: 'تكريم',
  },
  {
    title: 'شهادة الاشتراطات الصحية',
    desc: 'التزام مستمر بأعلى معايير النظافة وسلامة المناولة داخل المطابخ.',
    icon: Heart,
    badge: 'التزام صحي',
  },
  {
    title: 'اعتماد جودة التشغيل',
    desc: 'تقييم مرتفع في سرعة التنفيذ، دقة التجهيز، وانسيابية فرق الخدمة.',
    icon: TrendingUp,
    badge: 'جودة تشغيل',
  },
  {
    title: 'وسام رضا العملاء',
    desc: 'ثقة متكررة وتوصيات مستمرة من عملائنا في الحفلات والولائم الخاصة.',
    icon: Star,
    badge: 'رضا العملاء',
  },
  {
    title: 'شريك الفعاليات الموثوق',
    desc: 'اختيارنا لتنفيذ الضيافة والبوفيهات في المناسبات الرسمية والخاصة.',
    icon: Sparkles,
    badge: 'شراكات',
  },
  {
    title: 'تكريم التميز في الضيافة',
    desc: 'تقدير لاحترافية فريقنا في حسن التقديم والتنظيم وتجربة الضيوف.',
    icon: Users,
    badge: 'الضيافة',
  },
]

function SectionTopLine() {
  return (
    <div className="mb-14 flex justify-center" aria-hidden="true">
      <div className="h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  )
}

export default function About() {
  const statsRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const heroParticles = useMemo(
    () =>
      Array.from({ length: shouldReduceMotion ? 8 : 18 }, (_, i) => ({
        id: i,
        right: `${pseudoRandom(i + 5) * 100}%`,
        top: `${pseudoRandom(i + 21) * 100}%`,
        duration: 4 + pseudoRandom(i + 37) * 2,
        delay: pseudoRandom(i + 53) * 2,
      })),
    [shouldReduceMotion]
  )

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gallery-2.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/70" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/menu-mixed-grill.jpg"
            alt="حول النخبة للحفلات"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/55 to-black/80" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-gold/30 rounded-full"
              style={{
                right: particle.right,
                top: particle.top,
              }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -30, 0],
                      opacity: [0.2, 0.6, 0.2],
                    }
              }
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <RevealOnScroll>
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8"
              >
                <Sparkles className="w-10 h-10 text-gold" />
              </motion.div>
              <span className="text-gold text-sm font-arabic mb-4 block">من نحن</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-arabic leading-tight">
                قصة <span className="text-gradient-gold">النخبة</span>
              </h1>
              <p className="text-xl text-white/70 font-arabicBody leading-relaxed">
                من مطبخ عائلي صغير إلى واحدة من أبرز شركات الإعاشة في المملكة العربية السعودية
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative bg-black/70">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <SectionTopLine />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center p-8 rounded-3xl bg-dark-700/50 border border-gold/10 hover:border-gold/30 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4"
                >
                  <stat.icon className="w-8 h-8 text-gold" />
                </motion.div>
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix}
                  className="text-4xl md:text-5xl font-bold text-gradient-gold block mb-2"
                />
                <span className="text-white/60 font-arabic">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-28 relative overflow-hidden bg-black/70">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <SectionTopLine />
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll direction="right">
              <div>
                <span className="text-gold text-sm font-arabic mb-4 block">قصتنا</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-arabic">
                  منذ <span className="text-gradient-gold">1994</span> ونحن نبني التميز
                </h2>
                <div className="space-y-4 text-white/70 font-arabicBody leading-relaxed text-lg">
                  <p>
                    بدأت قصتنا في عام 1994 عندما قررنا فتح مطبخ عائلي صغير في حي الروضة بالرياض. كان حلمنا بسيطاً: تقديم أطعمة لذيذة بجودة عالية لعملائنا.
                  </p>
                  <p>
                    مع مرور السنين، توسعنا تدريجياً من خلال بناء سمعة قوية قائمة على الجودة والموثوقية. اليوم، نحن فخورون بأن نكون واحدة من أبرز شركات الإعاشة في المملكة العربية السعودية.
                  </p>
                  <p>
                    على مدار ثلاثة عقود، قدمنا خدماتنا لأكثر من 5000 حفلة ومناسبة، من حفلات الزفاف الحميمة إلى المؤتمرات الكبرى. وفي كل مرة، نسعى لتقديم تجربة لا تُنسى.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: TrendingUp, text: 'جودة عالية' },
                    { icon: Shield, text: 'خدمة ممتازة' },
                    { icon: Star, text: 'أسعار تنافسية' },
                    { icon: Users, text: 'فريق محترف' },
                  ].map((item, i) => (
                    <RevealOnScroll key={i} delay={0.5 + i * 0.1}>
                      <motion.div 
                        whileHover={{ x: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                        className="flex items-center gap-3 p-4 bg-gold/10 rounded-xl transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-gold" />
                        <span className="text-white/80 font-arabic">{item.text}</span>
                      </motion.div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="left">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <motion.img
                    src="/images/gallery-5.jpg"
                    alt="Kitchen"
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl w-full h-64 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.img
                    src="/images/gallery-3.jpg"
                    alt="Food"
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl w-full h-64 object-cover mt-8"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.img
                    src="/images/menu-mixed-grill.jpg"
                    alt="Grill"
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl w-full h-64 object-cover -mt-8"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.img
                    src="/images/gallery-6.jpg"
                    alt="Event"
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl w-full h-64 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-28 bg-black/70">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <SectionTopLine />
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-arabic mb-4 block">قيمنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
                المبادئ التي <span className="text-gradient-gold">نؤمن بها</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex gap-6 p-8 bg-dark-700/50 rounded-3xl border border-gold/10 hover:border-gold/30 transition-all"
                >
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0"
                  >
                    <value.icon className="w-8 h-8 text-gold" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 font-arabic">{value.title}</h3>
                    <p className="text-white/60 font-arabicBody leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-28 relative bg-black/70">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <SectionTopLine />
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-arabic mb-4 block">رحلتنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
                محطات في <span className="text-gradient-gold">تاريخنا</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="relative max-w-4xl mx-auto">
            {/* Line */}
            <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <RevealOnScroll key={index} delay={index * 0.1} direction="left">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="relative md:pr-20"
                  >
                    {/* Dot */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                      className="hidden md:flex absolute right-4 top-0 w-8 h-8 rounded-full bg-gold border-4 border-dark items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-dark rounded-full" />
                    </motion.div>

                    <div className="glassmorphism-light rounded-2xl p-6 hover:border-gold/30 transition-colors">
                      <span className="text-gold text-2xl font-bold block mb-2">{item.year}</span>
                      <h3 className="text-xl font-bold text-white mb-2 font-arabic">{item.title}</h3>
                      <p className="text-white/60 font-arabicBody">{item.description}</p>
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-28 bg-black/70">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <SectionTopLine />
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-arabic mb-4 block">فريقنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
                نخبة من <span className="text-gradient-gold">المحترفين</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -15 }}
                  className="group"
                >
                  <div className="relative rounded-3xl overflow-hidden mb-4">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-80 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                    
                    {/* Experience Badge */}
                    <div className="absolute bottom-4 right-4 bg-gold text-dark px-3 py-1 rounded-full text-sm font-bold font-arabic">
                      {member.experience}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white font-arabic group-hover:text-gold transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-white/60 font-arabic">{member.role}</p>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-28 bg-black/70">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <SectionTopLine />
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-arabic mb-4 block">شهاداتنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
                اعتراف <span className="text-gradient-gold">بتميزنا</span>
              </h2>
              <p className="mt-6 max-w-3xl mx-auto text-white/65 text-lg font-arabicBody leading-relaxed">
                نعتز بسجل من الشهادات والتكريمات التي تعكس التزامنا بالجودة، سلامة الغذاء،
                واحترافية التنفيذ في كل مناسبة.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="glassmorphism-light rounded-3xl p-8 text-center group hover:border-gold/30 transition-all h-full"
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors"
                  >
                    <cert.icon className="w-10 h-10 text-gold" />
                  </motion.div>
                  <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-gold font-arabic mb-4">
                    {cert.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2 font-arabic">{cert.title}</h3>
                  <p className="text-white/60 font-arabicBody">{cert.desc}</p>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-28 relative overflow-hidden bg-black/70">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <SectionTopLine />
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-arabic">
                هل تريد <span className="text-gradient-gold">معرفة المزيد؟</span>
              </h2>
              <p className="text-white/60 text-lg font-arabicBody mb-10">
                فريقنا جاهز للإجابة على جميع استفساراتك
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:+201067431264"
                  className="flex items-center gap-3 bg-gold/10 hover:bg-gold/20 text-gold px-6 py-4 rounded-xl transition-colors font-arabic"
                >
                  <Phone className="w-5 h-5" />
                  01067431264
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:saadbarghouth11@gmail.com"
                  className="flex items-center gap-3 bg-gold/10 hover:bg-gold/20 text-gold px-6 py-4 rounded-xl transition-colors font-arabic"
                >
                  <Mail className="w-5 h-5" />
                  saadbarghouth11@gmail.com
                </motion.a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </motion.div>
    </div>
  )
}

