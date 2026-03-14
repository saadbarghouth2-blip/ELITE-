import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, ChefHat, ChevronLeft, Star } from 'lucide-react'

const quickLinks = [
  { name: 'الرئيسية', href: '/' },
  { name: 'من نحن', href: '/about' },
  { name: 'خدماتنا', href: '/services' },
  { name: 'قائمة الطعام', href: '/menu' },
  { name: 'معرض الصور', href: '/gallery' },
  { name: 'داخل المطبخ', href: '/kitchen' },
  { name: 'احجز الآن', href: '/booking' },
]

const services = [
  'حفلات الزفاف',
  'المناسبات الخاصة',
  'خدمات المطاعم',
  'الولائم والمؤتمرات',
  'البوفيه المفتوح',
  'التمويل الغذائي',
]

export default function Footer() {
  return (
    <footer className="bg-dark-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      {/* Main Footer */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative">
        {/* Top Section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Logo & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-dark" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient-gold font-arabic block">ELITE</span>
                <span className="text-sm text-gold/80 font-arabic">النخبة للحفلات والإعاشة</span>
              </div>
            </Link>
            <p className="text-white/60 font-arabicBody leading-relaxed mb-6">
              30 عاماً من التميز في خدمات الإعاشة والحفلات في المملكة العربية السعودية. نقدم تجربة طعام فاخرة لجميع المناسبات.
            </p>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com/elite_for_outside_catering_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-white hover:bg-gold hover:text-dark transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/201067431264"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-white hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h4 className="text-white font-bold mb-6 font-arabic text-lg">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-gold transition-colors duration-300 font-arabic flex items-center gap-2 group"
                  >
                    <ChevronLeft className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <h4 className="text-white font-bold mb-6 font-arabic text-lg">خدماتنا</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-white/60 hover:text-gold transition-colors duration-300 font-arabic flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 text-gold" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h4 className="text-white font-bold mb-6 font-arabic text-lg">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-white/40 text-xs font-arabic block">الهاتف</span>
                  <a href="tel:+201067431264" className="text-white hover:text-gold transition-colors font-arabic">01067431264</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-white/40 text-xs font-arabic block">البريد</span>
                  <a href="mailto:saadbarghouth11@gmail.com" className="text-white hover:text-gold transition-colors font-arabic">saadbarghouth11@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-white/40 text-xs font-arabic block">العنوان</span>
                  <span className="text-white font-arabic text-sm">الرياض، المملكة العربية السعودية</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-white/40 text-xs font-arabic block">ساعات العمل</span>
                  <span className="text-white font-arabic text-sm">الأحد - الخميس: 8 ص - 10 م</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gold/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm font-arabic">
              جميع الحقوق محفوظة © 2024 النخبة للحفلات والإعاشة
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm font-arabic">تصميم وتطوير:</span>
              <span className="text-gold text-sm font-arabic">Elite Digital Team</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
