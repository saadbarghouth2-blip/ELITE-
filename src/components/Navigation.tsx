import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'الرئيسية', href: '/' },
  { name: 'من نحن', href: '/about' },
  { name: 'خدماتنا', href: '/services' },
  { name: 'قائمة الطعام', href: '/menu' },
  { name: 'معرض الصور', href: '/gallery' },
  { name: 'داخل المطبخ', href: '/kitchen' },
  { name: 'احجز الآن', href: '/booking' },
  { name: 'تواصل معنا', href: '/contact' },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-2 sm:px-0 py-3 bg-transparent backdrop-blur-sm border-none shadow-none nav-contrast"
      >
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-gold flex items-center justify-center"
              >
                <ChefHat className="w-5 h-5 sm:w-7 sm:h-7 text-dark" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gradient-gold font-arabic">ELITE</span>
                <span className="text-[10px] sm:text-xs text-gold/80 font-arabic hidden sm:block">النخبة للحفلات</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={link.href}
                    className={`relative px-3 lg:px-4 py-2 text-sm font-arabic font-semibold transition-colors duration-300 group drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] ${
                      location.pathname === link.href
                        ? 'text-gold'
                        : 'text-white hover:text-gold'
                    }`}
                  >
                    {link.name}
                    <motion.span
                      className="absolute bottom-0 right-0 h-0.5 bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: location.pathname === link.href ? '100%' : 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA & Phone */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.a
                href="tel:+201067431264"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
              >
                <Phone className="w-4 h-4" />
                <span className="font-arabic text-sm">01067431264</span>
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="bg-gradient-gold text-dark hover:shadow-gold-lg transition-all duration-300 font-arabic font-semibold px-4 lg:px-6 py-2 text-sm"
                >
                  <Link to="/booking">احجز الآن</Link>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-white hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-black/85 border-l border-gold/20 overflow-auto backdrop-blur-xl"
            >
              <div className="p-6 pt-24">
                {/* Logo in menu */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gold/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                    <ChefHat className="w-7 h-7 text-dark" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gradient-gold font-arabic">ELITE</span>
                    <span className="text-xs text-gold/80 block font-arabic">النخبة للحفلات</span>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                          location.pathname === link.href
                            ? 'bg-gold/20 text-gold'
                            : 'text-white hover:bg-white/5 hover:text-gold'
                        }`}
                      >
                        <span className="font-arabic text-lg">{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Contact Info */}
                <div className="mt-8 pt-6 border-t border-gold/10">
                  <motion.a
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    href="tel:+201067431264"
                    className="flex items-center gap-3 text-gold p-4 bg-gold/10 rounded-xl"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-arabic">01067431264</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
