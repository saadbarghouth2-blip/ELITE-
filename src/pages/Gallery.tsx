import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Instagram, Filter, Heart, Eye } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type GalleryCategory = 'events' | 'food' | 'buffet' | 'behind'
type GalleryFilter = 'all' | GalleryCategory

type GalleryItem = {
  id: number
  category: GalleryCategory
  src: string
  title: string
  likes: number
}

const categories: { id: GalleryFilter; name: string }[] = [
  { id: 'all', name: 'الكل' },
  { id: 'events', name: 'المناسبات' },
  { id: 'food', name: 'الأطعمة' },
  { id: 'buffet', name: 'البوفيه' },
  { id: 'behind', name: 'خلف الكواليس' },
]

const galleryItems: GalleryItem[] = [
  { id: 1, category: 'events', src: '/images/gallery-1.jpg', title: 'استقبال فاخر للمناسبات الرسمية', likes: 562 },
  { id: 2, category: 'events', src: '/images/gallery-2.jpg', title: 'ضيافة مؤتمرات واجتماعات الشركات', likes: 537 },
  { id: 3, category: 'buffet', src: '/images/about-image.jpg', title: 'بوفيه رئيسي بخيارات متنوعة', likes: 518 },
  { id: 4, category: 'buffet', src: '/images/gallery-4.jpg', title: 'ركن حلويات وضيافة راقٍ', likes: 491 },
  { id: 5, category: 'behind', src: '/images/gallery-5.jpg', title: 'داخل المطبخ أثناء وقت التجهيز', likes: 472 },
  { id: 6, category: 'events', src: '/images/gallery-6.jpg', title: 'بوفيه خارجي في الأجواء المفتوحة', likes: 556 },
  { id: 7, category: 'food', src: '/images/menu-mixed-grill.jpg', title: 'مشويات مشكلة طازجة', likes: 483 },
  { id: 8, category: 'food', src: '/images/menu-biryani.jpg', title: 'برياني دجاج محضّر بعناية', likes: 468 },
  { id: 9, category: 'food', src: '/images/menu-kunafa.jpg', title: 'كنافة نابلسية ساخنة', likes: 452 },
  { id: 10, category: 'food', src: '/images/menu-warak.jpg', title: 'ورق عنب للتقديمات الخاصة', likes: 439 },
  { id: 11, category: 'food', src: '/images/menu-juices.jpg', title: 'محطة العصائر الباردة', likes: 421 },
  { id: 12, category: 'food', src: '/images/menu-coffee.jpg', title: 'ركن القهوة العربية', likes: 405 },
  { id: 13, category: 'food', src: '/images/menu-tabbouleh.jpg', title: 'تبولة وسلطات طازجة', likes: 398 },
  { id: 14, category: 'food', src: '/images/menu-baklava.jpg', title: 'بقلاوة مشكلة للحلويات', likes: 387 },
  { id: 15, category: 'food', src: '/images/menu-ummali.jpg', title: 'أم علي بطابع شرقي', likes: 372 },
  { id: 16, category: 'food', src: '/images/menu-hummus.jpg', title: 'حمص بالطحينة للتقديمات', likes: 365 },
  { id: 17, category: 'buffet', src: '/images/gallery-moment-buffet-01.jpg', title: 'بوفيه ضيافة بتنسيق فاخر', likes: 578 },
  { id: 18, category: 'buffet', src: '/images/gallery-moment-buffet-02.jpg', title: 'طاولة حلويات للمناسبات الخاصة', likes: 544 },
  { id: 19, category: 'buffet', src: '/images/gallery-moment-buffet-03.jpg', title: 'تفاصيل سويتات وتارت للتقديم', likes: 517 },
  { id: 20, category: 'events', src: '/images/gallery-moment-event-01.jpg', title: 'تنسيق طاولات الاستقبال', likes: 496 },
  { id: 21, category: 'events', src: '/images/gallery-moment-event-02.jpg', title: 'قاعة ضيافة جاهزة لاستقبال الضيوف', likes: 472 },
  { id: 22, category: 'events', src: '/images/gallery-moment-event-03.jpg', title: 'تجهيزات أنيقة قبل بدء المناسبة', likes: 459 },
  { id: 23, category: 'behind', src: '/images/gallery-moment-behind-01.jpg', title: 'اللمسات الأخيرة قبل التقديم', likes: 434 },
  { id: 24, category: 'behind', src: '/images/gallery-moment-behind-02.jpg', title: 'تنسيق الأطباق داخل المطبخ', likes: 427 },
  { id: 25, category: 'behind', src: '/images/gallery-moment-behind-03.jpg', title: 'تحضير الأطباق بعناية عالية', likes: 418 },
  { id: 26, category: 'behind', src: '/images/gallery-moment-behind-04.jpg', title: 'فريقنا أثناء تجهيز الضيافة', likes: 446 },
  { id: 27, category: 'events', src: '/images/gallery-net-event-04.jpg', title: 'قاعة حفلات بإضاءة كلاسيكية', likes: 512 },
  { id: 28, category: 'events', src: '/images/gallery-net-event-05.jpg', title: 'أمسية خارجية مع جلسات ضيافة', likes: 547 },
  { id: 29, category: 'events', src: '/images/gallery-net-event-06.jpg', title: 'طاولات زفاف بلمسات وردية', likes: 523 },
  { id: 30, category: 'events', src: '/images/gallery-net-event-07.jpg', title: 'مساحة مناسبات بتنسيق دائري', likes: 506 },
  { id: 31, category: 'events', src: '/images/gallery-net-event-08.jpg', title: 'تنسيق خارجي أبيض للمناسبات النهارية', likes: 498 },
  { id: 32, category: 'buffet', src: '/images/gallery-net-buffet-04.jpg', title: 'محطة فواكه ومشروبات للضيافة', likes: 466 },
  { id: 33, category: 'buffet', src: '/images/gallery-net-buffet-05.jpg', title: 'بوفيه مقبلات خفيف للفعاليات', likes: 451 },
  { id: 34, category: 'buffet', src: '/images/gallery-net-buffet-06.jpg', title: 'تنسيق بوفيه عملي ومتكامل', likes: 479 },
  { id: 35, category: 'buffet', src: '/images/gallery-net-buffet-07.jpg', title: 'ركن دونات وحلويات للضيافة', likes: 438 },
  { id: 36, category: 'behind', src: '/images/gallery-net-behind-05.jpg', title: 'الشيف أثناء تجهيز طبق التقديم', likes: 421 },
  { id: 37, category: 'behind', src: '/images/gallery-net-behind-06.jpg', title: 'حركة الفريق داخل المطبخ', likes: 433 },
  { id: 38, category: 'behind', src: '/images/gallery-net-behind-07.jpg', title: 'تحضير الأصناف داخل محطة العمل', likes: 417 },
  { id: 39, category: 'behind', src: '/images/gallery-net-behind-08.jpg', title: 'لقطة بخار المطبخ أثناء الخدمة', likes: 409 },
  { id: 40, category: 'food', src: '/images/gallery-net-food-01.jpg', title: 'طبق مشاوي بتقديم فاخر', likes: 462 },
  { id: 41, category: 'food', src: '/images/gallery-net-food-02.jpg', title: 'تقديم مشويات مع خضار مشوية', likes: 474 },
]

const galleryHighlights = [
  `${galleryItems.length} لقطة مختارة`,
  'مناسبات خاصة',
  'بوفيهات راقية',
  'تجهيزات المطبخ',
  'صور جديدة من النت',
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryFilter>('all')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [likedItems, setLikedItems] = useState<number[]>([])

  const filteredItems = useMemo(
    () =>
      activeCategory === 'all'
        ? galleryItems
        : galleryItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  )

  const currentIndex =
    selectedImage !== null ? filteredItems.findIndex((item) => item.id === selectedImage) : -1

  const nextImage = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1].id)
    }
  }

  const prevImage = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1].id)
    }
  }

  const toggleLike = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLikedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gallery-5.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/70" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
      <section className="relative min-h-screen flex items-center bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/gallery-4.jpg"
            alt="بوفيه وحلويات"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-65"
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
            <span className="text-gold text-sm font-arabic mb-4 block">معرض الصور</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-arabic">
              لحظات من <span className="text-gradient-gold">تجاربنا</span>
            </h1>
            <p className="text-xl text-white/70 font-arabicBody leading-relaxed max-w-3xl mx-auto">
              من تنسيق القاعات والبوفيهات الراقية إلى تفاصيل التحضير داخل المطبخ، هذا المعرض
              يجمع لقطات حقيقية من أعمالنا ويعكس مستوى الجودة والتنظيم في كل مناسبة.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {galleryHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-gold/20 bg-white/5 px-4 py-2 text-sm text-white/75 font-arabic backdrop-blur-sm"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-black/70">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col items-center gap-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/15 bg-white/5 px-4 py-2 text-sm text-white/70 font-arabic backdrop-blur-sm">
              <Filter className="w-4 h-4 text-gold" />
              اختر الفئة التي تريد استعراضها
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-6 py-2 font-arabic transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-gold text-dark'
                      : 'bg-dark-700 text-white/70 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
                  onClick={() => setSelectedImage(item.id)}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-arabic text-lg mb-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => toggleLike(item.id, e)}
                            className="flex items-center gap-1 text-white/80 hover:text-red-500 transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                likedItems.includes(item.id) ? 'fill-red-500 text-red-500' : ''
                              }`}
                            />
                            <span className="text-sm">
                              {item.likes + (likedItems.includes(item.id) ? 1 : 0)}
                            </span>
                          </button>
                          <span className="flex items-center gap-1 text-white/80">
                            <Eye className="w-5 h-5" />
                            <span className="text-sm">{item.likes + 320}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <a
              href="https://instagram.com/elite_for_outside_catering_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-arabic hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Instagram className="w-6 h-6" />
              تابعنا على إنستقرام
            </a>
          </motion.div>
        </div>
      </section>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-dark/95 border-none max-w-6xl p-0 overflow-hidden">
          {selectedImage !== null && (
            <div className="relative">
              <img
                src={filteredItems[currentIndex]?.src}
                alt={filteredItems[currentIndex]?.title}
                loading="eager"
                decoding="async"
                className="w-full max-h-[80vh] object-contain"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                disabled={currentIndex === filteredItems.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark to-transparent">
                <h3 className="text-white text-xl font-arabic">{filteredItems[currentIndex]?.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={(e) => toggleLike(filteredItems[currentIndex].id, e)}
                    className="flex items-center gap-1 text-white/80 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedItems.includes(filteredItems[currentIndex].id)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                    <span>
                      {filteredItems[currentIndex]?.likes +
                        (likedItems.includes(filteredItems[currentIndex].id) ? 1 : 0)}
                    </span>
                  </button>
                  <span className="text-white/50 text-sm">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
    </div>
  )
}
