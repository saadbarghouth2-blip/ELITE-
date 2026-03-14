import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { 
  Phone, Star, ArrowLeft, Heart, 
  ChefHat, PartyPopper, Building2, Briefcase, Utensils,
  Award, Clock, Sparkles, Flame,
  TrendingUp, Shield, Zap, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import AnimatedCounter from '@/components/AnimatedCounter'
import RevealOnScroll from '@/components/RevealOnScroll'
import MagneticButton from '@/components/MagneticButton'

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Particle Background Component
function ParticleBackground() {
  const shouldReduceMotion = useReducedMotion()
  const particles = useMemo(
    () =>
      Array.from({ length: shouldReduceMotion ? 12 : 28 }, (_, i) => ({
        id: i,
        right: `${pseudoRandom(i + 1) * 100}%`,
        top: `${pseudoRandom(i + 17) * 100}%`,
        duration: 4 + pseudoRandom(i + 33) * 3,
        delay: pseudoRandom(i + 49) * 3,
      })),
    [shouldReduceMotion]
  )

  return (
    <div className="particle-background absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 bg-gold/30 rounded-full"
          style={{
            right: particle.right,
            top: particle.top,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -40, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.9])
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        <img
          src="/images/gallery-6.jpg"
          alt="بوفيه فخم وأطباق طازجة"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/60 to-dark/85" />
      </motion.div>

      <ParticleBackground />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 container-custom px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-28 md:pt-32"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex flex-wrap items-center justify-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 sm:px-5 py-2.5 mb-8 backdrop-blur-sm max-w-full text-center"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-gold text-sm font-arabic">30 عاماً من التميز</span>
          <Sparkles className="w-4 h-4 text-gold" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <motion.span 
            className="text-gradient-gold font-arabic block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ELITE النخبة
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white font-arabic block mt-4 text-3xl sm:text-5xl md:text-6xl leading-tight"
          >
            للحفلات والإعاشة
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-white/80 mb-4 font-arabic"
        >
          نقدم لكم تجربة طعام فاخرة لجميع مناسباتكم
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-base md:text-lg text-white/60 mb-12 max-w-2xl mx-auto font-arabicBody leading-relaxed"
        >
          خدمات إعاشة متكاملة للحفلات والمناسبات والمطاعم في جميع أنحاء المملكة العربية السعودية
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center"
        >
          <MagneticButton>
            <Button
              asChild
              className="bg-gradient-gold text-dark hover:shadow-gold-lg transition-all duration-300 font-arabic font-semibold px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg group w-full sm:w-auto whitespace-normal text-center leading-snug"
            >
              <Link to="/booking">
                احجز خدماتك الآن
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button
              asChild
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-arabic font-semibold px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg w-full sm:w-auto whitespace-normal text-center leading-snug"
            >
              <Link to="/menu">تصفح قائمة الطعام</Link>
            </Button>
          </MagneticButton>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 flex items-center justify-center gap-4 sm:gap-6 flex-wrap"
        >
          <motion.a 
            href="tel:+201067431264"
            whileHover={{ scale: 1.05 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-white/70 hover:text-gold transition-colors bg-white/5 px-5 py-3 rounded-full w-full sm:w-auto text-center"
          >
            <Phone className="w-5 h-5 text-gold" />
            <span className="font-arabic">01067431264</span>
          </motion.a>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-white/70 bg-white/5 px-5 py-3 rounded-full w-full sm:w-auto text-center"
          >
            <MapPin className="w-5 h-5 text-gold" />
            <span className="font-arabic">الرياض، السعودية</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-sm font-arabic">اسحب للأسفل</span>
          <div className="w-8 h-12 border-2 border-gold/40 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gold rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    { icon: ChefHat, title: 'طهاة محترفون', desc: 'فريق من أفضل الطهاة ذوي الخبرة العالية', color: 'from-gold/20 to-gold/5' },
    { icon: Sparkles, title: 'فريق ضيافة راقٍ', desc: 'مضيفون محترفون يضمنون تجربة فاخرة للضيوف', color: 'from-amber-500/20 to-amber-500/5' },
    { icon: Shield, title: 'سلامة وجودة', desc: 'رقابة صارمة للنظافة وسلامة الغذاء في كل خطوة', color: 'from-emerald-500/20 to-emerald-500/5' },
    { icon: Heart, title: 'جودة عالية', desc: 'نختار أفضل المكونات لضمان أعلى جودة', color: 'from-red-500/20 to-red-500/5' },
    { icon: Clock, title: 'الالتزام بالمواعيد', desc: 'نصل في الوقت المحدد دائماً', color: 'from-blue-500/20 to-blue-500/5' },
    { icon: Award, title: 'خبرة 30 عاماً', desc: 'ثلاثة عقود من التميز في خدمات الإعاشة', color: 'from-purple-500/20 to-purple-500/5' },
  ]

  return (
    <section className="py-24 bg-black/70 sm:bg-black/80 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-arabic mb-4 block">لماذا نحن</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
              ما يميز <span className="text-gradient-gold">النخبة</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -15, scale: 1.02 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${feature.color} border border-gold/10 hover:border-gold/30 transition-all duration-500 group overflow-hidden`}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="relative w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-gold" />
                </motion.div>
                
                <h3 className="relative text-xl font-bold text-white mb-3 font-arabic group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-white/60 font-arabicBody">{feature.desc}</p>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Preview Section
function AboutPreviewSection() {
  const stats = [
    { value: 30, suffix: '+', label: 'عام من الخبرة' },
    { value: 5000, suffix: '+', label: 'حفلة ناجحة' },
    { value: 50, suffix: '+', label: 'طبق متنوع' },
    { value: 100, suffix: '%', label: 'رضا العملاء' },
  ]

  const highlights = [
    { icon: Flame, text: 'مكونات طازجة يومياً' },
    { icon: Shield, text: 'معايير صحية عالية' },
    { icon: TrendingUp, text: 'أسعار تنافسية' },
    { icon: Zap, text: 'خدمة سريعة' },
  ]

  return (
    <section className="py-28 bg-black/70 sm:bg-black/80 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <RevealOnScroll direction="right">
            <div className="relative">
              <motion.div 
                className="relative rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="/images/about-image.jpg"
                  alt="About Elite"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[340px] sm:h-[420px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
              </motion.div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 bg-gradient-gold rounded-3xl p-6 sm:p-8 shadow-gold-lg"
              >
                <div className="text-center">
                  <AnimatedCounter value={30} suffix="" className="text-5xl font-bold text-dark block" />
                  <span className="text-dark/80 font-arabic">عاماً من الخبرة</span>
                </div>
              </motion.div>

              {/* Decorative Frame */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute top-2 left-2 sm:-top-6 sm:-left-6 w-24 h-24 sm:w-32 sm:h-32 border-t-4 border-l-4 border-gold/30 rounded-tl-3xl" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-2 right-2 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 border-b-4 border-r-4 border-gold/30 rounded-br-3xl" 
              />
            </div>
          </RevealOnScroll>

          {/* Content */}
          <RevealOnScroll direction="left">
            <div>
              <span className="text-gold text-sm font-arabic mb-4 block">من نحن</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-arabic leading-tight">
                <span className="text-gradient-gold">30 عاماً</span> من التميز في خدمات الإعاشة
              </h2>
              
              <div className="space-y-4 text-white/70 font-arabicBody leading-relaxed text-lg">
                <p>
                  تأسست النخبة للحفلات والإعاشة قبل ثلاثة عقود، ومنذ ذلك الحين نقدم خدمات إعاشة فاخرة للحفلات والمناسبات والمطاعم في جميع أنحاء المملكة العربية السعودية.
                </p>
                <p>
                  نفتخر بفريقنا المتخصص من الطهاة المحترفين وخبرائنا في تنظيم الحفلات، الذين يعملون بشغف لتقديم تجربة طعام لا تُنسى لعملائنا الكرام.
                </p>
              </div>

              {/* Highlights Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {highlights.map((item, i) => (
                  <RevealOnScroll key={i} delay={0.5 + i * 0.1}>
                    <motion.div 
                      whileHover={{ x: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                      className="flex items-center gap-3 p-3 sm:p-4 bg-dark-700/50 rounded-xl transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-gold" />
                      <span className="text-white/80 font-arabic text-sm">{item.text}</span>
                    </motion.div>
                  </RevealOnScroll>
                ))}
              </div>

              <RevealOnScroll delay={0.8}>
                <div className="mt-10">
                  <MagneticButton>
                    <Button
                      asChild
                      className="bg-gradient-gold text-dark hover:shadow-gold-lg transition-all duration-300 font-arabic font-semibold px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto whitespace-normal text-center leading-snug"
                    >
                      <Link to="/about">
                        تعرف علينا أكثر
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Link>
                    </Button>
                  </MagneticButton>
                </div>
              </RevealOnScroll>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gold/10">
                {stats.map((stat, index) => (
                  <RevealOnScroll key={index} delay={0.3 + index * 0.1}>
                    <div className="text-center">
                      <AnimatedCounter 
                        value={stat.value} 
                        suffix={stat.suffix}
                        className="text-2xl md:text-3xl font-bold text-gradient-gold block"
                      />
                      <span className="text-white/50 text-xs md:text-sm font-arabic">{stat.label}</span>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

// Services Preview Section
function ServicesPreviewSection() {
  const services = [
    {
      icon: Heart,
      title: 'حفلات الزفاف',
      desc: 'تنظيم بوفيهات فاخرة لحفلات الزفاف مع تشكيلة واسعة من الأطباق',
      image: '/images/gallery-1.jpg',
      price: 'من 150 ر.س',
    },
    {
      icon: PartyPopper,
      title: 'المناسبات الخاصة',
      desc: 'خدمات إعاشة مخصصة للمناسبات العائلية والاجتماعية',
      image: '/images/gallery-6.jpg',
      price: 'من 80 ر.س',
    },
    {
      icon: Building2,
      title: 'خدمات المطاعم',
      desc: 'توريد الأطعمة الجاهزة للمطاعم والفنادق بأعلى معايير الجودة',
      image: '/images/gallery-5.jpg',
      price: 'تواصل معنا',
    },
    {
      icon: Briefcase,
      title: 'الولائم والمؤتمرات',
      desc: 'تنظيم إعاشة للمؤتمرات والاجتماعات والولائم الرسمية',
      image: '/images/gallery-2.jpg',
      price: 'من 120 ر.س',
    },
    {
      icon: Utensils,
      title: 'البوفيه المفتوح',
      desc: 'تقديم بوفيهات مفتوحة متنوعة تناسب جميع الأذواق',
      image: '/images/gallery-4.jpg',
      price: 'من 200 ر.س',
    },
    {
      icon: ChefHat,
      title: 'التمويل الغذائي',
      desc: 'خدمات التمويل الغذائي للشركات والمؤسسات',
      image: '/images/gallery-3.jpg',
      price: 'تواصل معنا',
    },
  ]

  return (
    <section className="py-28 bg-black/70 sm:bg-black/80 relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-arabic mb-4 block">خدماتنا</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
              خدمات إعاشة <span className="text-gradient-gold">متكاملة</span> لجميع المناسبات
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -15 }}
                className="group relative bg-dark-700/50 rounded-3xl overflow-hidden border border-gold/10 hover:border-gold/40 transition-all duration-500 h-full"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 bg-gold text-dark px-3 py-1.5 rounded-full text-sm font-bold font-arabic">
                    {service.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors"
                  >
                    <service.icon className="w-7 h-7 text-gold" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3 font-arabic group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/60 font-arabicBody leading-relaxed mb-4">
                    {service.desc}
                  </p>
                  <Link 
                    to="/services"
                    className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-arabic text-sm group/link"
                  >
                    اكتشف المزيد
                    <ArrowLeft className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.5}>
          <div className="text-center mt-12">
            <MagneticButton>
              <Button
                asChild
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-arabic font-semibold px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto whitespace-normal text-center leading-snug"
              >
                <Link to="/services">
                  عرض جميع الخدمات
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

// Menu Preview Section
function MenuPreviewSection() {
  const featuredItems = [
    { name: 'مشويات مشكلة', price: 120, image: '/images/menu-mixed-grill.jpg', category: 'أطباق رئيسية' },
    { name: 'كنافة نابلسية', price: 45, image: '/images/menu-kunafa.jpg', category: 'حلويات' },
    { name: 'برياني دجاج', price: 85, image: '/images/menu-biryani.jpg', category: 'أطباق رئيسية' },
    { name: 'حمص بالطحينة', price: 25, image: '/images/menu-hummus.jpg', category: 'مقبلات' },
  ]

  return (
    <section className="py-28 bg-black/70 sm:bg-black/80 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-arabic mb-4 block">قائمة الطعام</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic mb-4">
              أشهى <span className="text-gradient-gold">الأطباق</span>
            </h2>
            <p className="text-white/60 font-arabicBody max-w-2xl mx-auto">
              اكتشف تشكيلتنا الواسعة من الأطباق العربية والعالمية المعدة بأيدي خبراء
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-dark-700/50 rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-500"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-gold/90 text-dark px-2 py-1 rounded-lg text-xs font-bold font-arabic">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 font-arabic group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold">{item.price} ر.س</span>
                    <Link 
                      to="/menu"
                      className="text-white/50 hover:text-gold transition-colors text-sm font-arabic"
                    >
                      عرض الكل
                    </Link>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.4}>
          <div className="text-center mt-12">
            <MagneticButton>
              <Button
                asChild
                className="bg-gradient-gold text-dark hover:shadow-gold-lg transition-all duration-300 font-arabic font-semibold px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto whitespace-normal text-center leading-snug"
              >
                <Link to="/menu">
                  تصفح القائمة الكاملة
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

// Testimonials Preview Section
function TestimonialsPreviewSection() {
  const testimonials = [
    {
      name: 'أحمد العبدالله',
      role: 'عميل',
      text: 'خدمة ممتازة وأطعمة لذيذة، كان حفل زفافي ناجحاً بفضل النخبة للإعاشة. أنصح الجميع بالتعامل معهم.',
      rating: 5,
      avatar: 'أ',
    },
    {
      name: 'سارة المحمد',
      role: 'عميلة',
      text: 'تعامل راقي وجودة عالية في التقديم. الفريق محترف جداً والأكل كان رائعاً. شكراً لكم!',
      rating: 5,
      avatar: 'س',
    },
    {
      name: 'خالد السبيعي',
      role: 'مدير شركة',
      text: 'فريق محترف ومنظم، قدموا لنا بوفيه فاخر في مؤتمر شركتنا. تجربة رائعة بكل المقاييس.',
      rating: 5,
      avatar: 'خ',
    },
  ]

  return (
    <section className="py-28 bg-black/70 sm:bg-black/80 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-arabic mb-4 block">آراء العملاء</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
              ماذا يقول <span className="text-gradient-gold">عملاؤنا</span> عنا
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className="glassmorphism-light rounded-3xl p-8 relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 right-8 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-dark text-xl font-bold">"</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-gold fill-gold" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/80 font-arabicBody leading-relaxed mb-6 text-lg">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <span className="text-white font-bold font-arabic block">{testimonial.name}</span>
                    <span className="text-white/50 text-sm font-arabic">{testimonial.role}</span>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-28 bg-black/70 sm:bg-black/80 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles className="w-10 h-10 text-gold" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-arabic">
              جاهز لتحظى <span className="text-gradient-gold">بمناسبة لا تُنسى؟</span>
            </h2>
            <p className="text-white/60 text-lg font-arabicBody mb-10 leading-relaxed">
              دعنا نساعدك في تنظيم حفلتك القادمة. تواصل معنا الآن واحصل على عرض خاص!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <MagneticButton>
              <Button
                asChild
                className="bg-gradient-gold text-dark hover:shadow-gold-lg transition-all duration-300 font-arabic font-semibold px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg w-full sm:w-auto whitespace-normal text-center leading-snug"
              >
                  <Link to="/booking">
                    احجز الآن
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
              <Button
                asChild
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-arabic font-semibold px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg w-full sm:w-auto whitespace-normal text-center leading-snug"
              >
                  <Link to="/contact">تواصل معنا</Link>
                </Button>
              </MagneticButton>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

// Main Home Page
export default function Home() {
  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/home-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/25 sm:via-black/20 sm:to-black/45" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <HeroSection />
        <FeaturesSection />
        <AboutPreviewSection />
        <ServicesPreviewSection />
        <MenuPreviewSection />
        <TestimonialsPreviewSection />
        <CTASection />
      </motion.div>
    </div>
  )
}
