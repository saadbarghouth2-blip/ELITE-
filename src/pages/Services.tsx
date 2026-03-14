import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Heart, PartyPopper, Building2, Briefcase, Utensils, ChefHat,
  CheckCircle2, ArrowLeft, Star, Users, Clock, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: Heart,
    title: 'حفلات الزفاف',
    shortDesc: 'تنظيم بوفيهات فاخرة لحفلات الزفاف مع تشكيلة واسعة من الأطباق',
    fullDesc: 'نقدم خدمات إعاشة متكاملة لحفلات الزفاف، بدءاً من تخطيط القائمة وتذوق الأطباق، وصولاً إلى التقديم الأنيق في يوم الحفل. فريقنا المتخصص يضمن أن يكون يومكم الخاص مثالياً بكل تفاصيله.',
    features: [
      'قائمة مخصصة حسب ذوق العروسين',
      'تذوق مسبق للأطباق',
      'تنسيق طاولات أنيق',
      'فريق خدمة محترف',
      'تنظيف شامل بعد الحفل',
    ],
    image: '/images/gallery-1.jpg',
    price: 'يبدأ من 150 ر.س للشخص',
  },
  {
    icon: PartyPopper,
    title: 'المناسبات الخاصة',
    shortDesc: 'خدمات إعاشة مخصصة للمناسبات العائلية والاجتماعية',
    fullDesc: 'سواء كان حفل تخرج، عيد ميلاد، أو تجمع عائلي، نحن هنا لنضيف لمسة من الفخامة إلى مناسبتكم. نقدم خيارات متنوعة تناسب جميع الأذواق والميزانيات.',
    features: [
      'تصاميم مخصصة للمناسبة',
      'خيارات للأطفال والكبار',
      'تقديم منزلي أو في القاعة',
      'عروض خاصة للمجموعات',
      'خدمة توصيل متاحة',
    ],
    image: '/images/gallery-6.jpg',
    price: 'يبدأ من 80 ر.س للشخص',
  },
  {
    icon: Building2,
    title: 'خدمات المطاعم',
    shortDesc: 'توريد الأطعمة الجاهزة للمطاعم والفنادق بأعلى معايير الجودة',
    fullDesc: 'نقدم خدمات التوريد للمطاعم والفنادق، مع ضمان الجودة والطعم المتميز. منتجاتنا مصنوعة من أفضل المكونات وتحت إشراف طهاة محترفين.',
    features: [
      'عقود شهرية وسنوية',
      'جودة موثقة ومعتمدة',
      'توصيل يومي منتظم',
      'أسعار تنافسية للجملة',
      'دعم فني مستمر',
    ],
    image: '/images/gallery-5.jpg',
    price: 'اتصل للاستفسار',
  },
  {
    icon: Briefcase,
    title: 'الولائم والمؤتمرات',
    shortDesc: 'تنظيم إعاشة للمؤتمرات والاجتماعات والولائم الرسمية',
    fullDesc: 'خدمات إعاشة احترافية للفعاليات الرسمية والمؤتمرات. نفهم أهمية الانطباع الأول ونضمن تقديم خدمة على أعلى مستوى.',
    features: [
      'تخطيط احترافي للفعالية',
      'قائمة متنوعة تناسب الجميع',
      'خدمة سريعة ومنظمة',
      'تنسيق مع منظمي الحدث',
      'تقارير تفصيلية',
    ],
    image: '/images/gallery-2.jpg',
    price: 'يبدأ من 120 ر.س للشخص',
  },
  {
    icon: Utensils,
    title: 'البوفيه المفتوح',
    shortDesc: 'تقديم بوفيهات مفتوحة متنوعة تناسب جميع الأذواق',
    fullDesc: 'بوفيهات مفتوحة متكاملة مع تشكيلة واسعة من الأطباق العربية والعالمية. مثالية للمناسبات الكبيرة حيث يمكن للضيوف الاختيار حسب رغبتهم.',
    features: [
      'أكثر من 50 طبق متنوع',
      'محطات طهي حية',
      'قائمة نباتية متاحة',
      'تزيين وتنسيق أنيق',
      'خدمة على مدار الحفل',
    ],
    image: '/images/gallery-2.jpg',
    price: 'يبدأ من 200 ر.س للشخص',
  },
  {
    icon: ChefHat,
    title: 'التمويل الغذائي',
    shortDesc: 'خدمات التمويل الغذائي للشركات والمؤسسات',
    fullDesc: 'حلول غذائية متكاملة للشركات والمؤسسات، تشمل تقديم الوجبات اليومية للموظفين، والإعاشة للفعاليات الداخلية.',
    features: [
      'خطط غذائية متوازنة',
      'عقود مرنة',
      'قائمة متجددة أسبوعياً',
      'خدمة توصيل للشركة',
      'دعم صحي وغذائي',
    ],
    image: '/images/gallery-3.jpg',
    price: 'اتصل للاستفسار',
  },
]

const process = [
  {
    step: '01',
    title: 'الاستشارة',
    description: 'نتواصل معك لفهم احتياجاتك وتفاصيل مناسبتك',
  },
  {
    step: '02',
    title: 'التخطيط',
    description: 'نعد خطة مفصلة مع قائمة طعام مخصصة',
  },
  {
    step: '03',
    title: 'التنفيذ',
    description: 'ننفذ الخطة باحترافية عالية في يوم الحدث',
  },
  {
    step: '04',
    title: 'المتابعة',
    description: 'نتابع معك للتأكد من رضاكم التام',
  },
]

export default function Services() {
  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gallery-4.jpg')" }}
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
      <section className="relative min-h-screen flex items-center bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/gallery-4.jpg"
            alt="خدمات إطعام وضيافة"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/65 to-dark/85" />
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-gold text-sm font-arabic mb-4 block">خدماتنا</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-arabic leading-tight">
              حلول <span className="text-gradient-gold">إعاشة متكاملة</span>
            </h1>
            <p className="text-xl text-white/70 font-arabicBody leading-relaxed">
              نقدم مجموعة واسعة من خدمات الإعاشة المصممة لتلبية احتياجاتك الخاصة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-28 bg-dark-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-dark-700/50 rounded-3xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                    <div className="absolute top-4 right-4 w-14 h-14 rounded-xl bg-gold/90 flex items-center justify-center">
                      <service.icon className="w-7 h-7 text-dark" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-3 font-arabic group-hover:text-gold transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-white/60 font-arabicBody mb-4 leading-relaxed">
                      {service.fullDesc}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-white/80 font-arabic mb-3 text-sm">مميزات الخدمة:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                            <span className="text-white/60 text-sm font-arabic">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <span className="text-gold font-bold font-arabic">{service.price}</span>
                      <Button
                        asChild
                        variant="outline"
                        className="border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-arabic"
                      >
                        <Link to="/booking">
                          احجز الآن
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-28 bg-dark relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-arabic mb-4 block">كيف نعمل</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
              خطوات <span className="text-gradient-gold">بسيطة</span> لحفلتك المثالية
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector */}
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gold/20">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold/20" />
                  </div>
                )}

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-dark font-bold text-xl">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-arabic">{step.title}</h3>
                  <p className="text-white/60 font-arabicBody">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-28 bg-dark-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold text-sm font-arabic mb-4 block">لماذا نحن</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-arabic">
                ما يميز <span className="text-gradient-gold">النخبة</span>
              </h2>
              <p className="text-white/70 font-arabicBody leading-relaxed mb-8 text-lg">
                نحن لا نقدم مجرد طعام، بل نقدم تجربة كاملة. من التخطيط الأولي إلى التنظيف النهائي، نحن معك في كل خطوة.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Star, title: 'جودة لا تُضاهى', desc: 'نستخدم أفضل المكونات الطازجة' },
                  { icon: Users, title: 'فريق محترف', desc: 'طهاة معتمدون دولياً' },
                  { icon: Clock, title: 'الالتزام بالوقت', desc: 'نصل في الموعد دائماً' },
                  { icon: Award, title: 'خبرة 30 عاماً', desc: 'ثلاثة عقود من التميز' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-dark-700/50 rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-arabic">{item.title}</h4>
                      <p className="text-white/60 text-sm font-arabic">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/images/gallery-4.jpg"
                alt="Why Choose Us"
                loading="lazy"
                decoding="async"
                className="rounded-3xl w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-gold rounded-3xl p-8 shadow-gold-lg">
                <div className="text-center">
                  <span className="text-5xl font-bold text-dark block">5000+</span>
                  <span className="text-dark/80 font-arabic">حفلة ناجحة</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-arabic">
              هل لديك <span className="text-gradient-gold">مناسبة قادمة؟</span>
            </h2>
            <p className="text-white/60 text-lg font-arabicBody mb-10 leading-relaxed">
              دعنا نساعدك في جعل مناسبتك مميزة. تواصل معنا الآن للحصول على استشارة مجانية.
            </p>
            <Button
              asChild
              className="bg-gradient-gold text-dark hover:shadow-gold-lg transition-all duration-300 font-arabic font-semibold px-10 py-7 text-lg"
            >
              <Link to="/booking">
                احصل على عرض سعر
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
    </div>
  )
}

