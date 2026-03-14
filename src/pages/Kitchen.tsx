import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Clapperboard, ExternalLink, PlayCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RevealOnScroll from '@/components/RevealOnScroll'

type KitchenVideo = {
  title: string
  src: string
  source: string
}

const FALLBACK_IMAGE = '/images/gallery-5.jpg'

const kitchenVideos: KitchenVideo[] = [
  {
    title: 'تحضير المكونات في مطبخ احترافي',
    src: 'https://player.vimeo.com/external/483985086.sd.mp4?s=e3442024a599de477e05ef4d4e77893769583f0c&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-preparing-ingredients-in-modern-professional-kitchen/b8f318dfd595e585d26e595c399fcbdb/',
  },
  {
    title: 'تجهيز الطبق النهائي داخل المطبخ',
    src: 'https://player.vimeo.com/external/483986161.sd.mp4?s=cd07ac44e92d97c335e68e42923666647467cf6e&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-preparing-dish-in-modern-professional-kitchen/1a894c486eaa7d493f7290474fd9d846/',
  },
  {
    title: 'تقطيع وتجهيز المكونات على لوح خشبي',
    src: 'https://player.vimeo.com/external/483984880.sd.mp4?s=11b0b691208ddcf4f13473750fe7e80cd920a7ea&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-preparing-ingredients-on-wooden-board-in-professional-kitchen/0ed6e88e03f8b684ff75ba872c8fc829/',
  },
  {
    title: 'تجهيز الشيف قبل بدء الخدمة',
    src: 'https://player.vimeo.com/external/483984453.sd.mp4?s=afd95b8e70ff5434bfe444dad6a08f93b55cde0c&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-preparing-for-work-in-professional-kitchen/50b321a4e9843db5b49126ac2514c2e7/',
  },
  {
    title: 'شيف تحضر طبقًا داخل مطبخ احترافي',
    src: 'https://player.vimeo.com/external/483985746.sd.mp4?s=6bc42aeec9c4587e272b422457bbda5c4f35e586&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/female-chef-preparing-cuisine-in-professional-kitchen/f27226723ab6ec7c04e501615a4e254b/',
  },
  {
    title: 'تعاون فريق الطهاة داخل مطبخ المطعم',
    src: 'https://player.vimeo.com/external/442836530.sd.mp4?s=7d8deb166f29469b5d1b3b4cd8e44038eacf7213&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/professional-chefs-collaborating-in-modern-restaurant-kitchen/383c1bb61cfc85ce52a3e33c7f38edd4/',
  },
  {
    title: 'خط إنتاج فعلي داخل مطبخ تجاري',
    src: 'https://player.vimeo.com/external/515487469.sd.mp4?s=b9a288a5149499610e40ec64770f0d7c9b34f4a3&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/professional-chef-cooking-vegetables-in-industrial-kitchen/d19448c740c9a829b6aedffc339201bb/',
  },
  {
    title: 'تحضير اللحم باحتراف في محطة الطهي',
    src: 'https://player.vimeo.com/external/437502592.sd.mp4?s=c43d961e8e362351207d3b9102e337df2a21cbfe&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-skillfully-preparing-meat-in-professional-kitchen/2ef03dcd3f418510c42a917fcdfff965/',
  },
  {
    title: 'تزيين طبق اللحم بالأعشاب',
    src: 'https://player.vimeo.com/external/388080475.sd.mp4?s=ff4c286949acac9bc0e64d2c25554c22e9f16e7d&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-garnishing-meat-dish-with-fresh-herbs-in-restaurant-kitchen/1196ed9c02f651bb1e7b5a5f2a0714f9/',
  },
  {
    title: 'شيف يضع اللحم على الشواية',
    src: 'https://player.vimeo.com/external/388079717.sd.mp4?s=b8bd0f3e030a48091b0ed340881d635ff7299d14&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-placing-bacon-strip-on-grill-in-busy-restaurant-kitchen/3117b4919a049a0707afe843ed4e4df7/',
  },
  {
    title: 'تحضير منزلي منظم داخل المطبخ',
    src: 'https://player.vimeo.com/external/372465205.sd.mp4?s=cc83244bfc085154791a4332ff3eaa422ad78052&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/family-enjoying-cooking-together-in-modern-kitchen/60da490ffd4c56e91aeba81ca758fa2d/',
  },
  {
    title: 'تشغيل فريق داخل مطبخ تجاري',
    src: 'https://player.vimeo.com/progressive_redirect/playback/869436127/rendition/240p/file.mp4?loc=external&oauth2_token_id=1223210874&signature=23b8e7ec58b0f9b2e5d7e7a0f6842278295e3680626dad1c589dd0b9eb77036f',
    source: 'https://pikwizard.com/video/professional-chefs-working-in-commercial-kitchen-atmosphere/af5367c9f24b858122899f9f24de0099/',
  },
  {
    title: 'تقطيع الخضار أثناء التحضير',
    src: 'https://player.vimeo.com/progressive_redirect/playback/1126398700/rendition/240p/file.mp4?loc=external&oauth2_token_id=1223210874&signature=4ed479a59dd0b3b3e26a8d3875a4ba0ac30068a07e9149ea269ed8aba5cfabe8',
    source: 'https://pikwizard.com/video/chef-slicing-vegetables-with-digital-overlay-in-modern-kitchen/2d6352c70095f7abc4bbe2e9425a0444/',
  },
  {
    title: 'عرض أطباق جاهزة بعد التحضير',
    src: 'https://player.vimeo.com/progressive_redirect/playback/1128493918/rendition/240p/file.mp4?loc=external&oauth2_token_id=1223210874&signature=320bc80a756b0c636a47aae59d4c913d5eebe6c14e9091d47ab506cb1252b06a',
    source: 'https://pikwizard.com/video/chef-displaying-delicious-culinary-creations-in-rustic-kitchen/83c0e29b8380519e77c3dcd4994b56fc/',
  },
  {
    title: 'لقطة كاترينج وطهي مباشر',
    src: 'https://player.vimeo.com/progressive_redirect/playback/1158698042/rendition/240p/file.mp4%20%28240p%29.mp4?loc=external&oauth2_token_id=1223210874&signature=8995ca8533419e947a426ea29032d542699b13e416ee4c7c621a4577b94ca387',
    source: 'https://pikwizard.com/video/chef-cooking-on-backyard-griddle-smoke-rising-outdoor-catering-footage/cedcfd176c4fdd8cd01cf8093b7edf5b/',
  },
  {
    title: 'شيف يقلب الخضار داخل مطبخ منزلي',
    src: 'https://player.vimeo.com/external/345210575.sd.mp4?s=d8451280c5a5e3b858bfcc0a8bec8daa80e649d7&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-cooking-in-home-kitchen-with-vegetable-tossing/aaae6482d59f99768f65f4f1a6818cb3/',
  },
  {
    title: 'قلي سريع داخل ووك في المطبخ',
    src: 'https://player.vimeo.com/external/345222139.sd.mp4?s=7df48238dc22148c6783e806b194c7176ada4d23&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/cook-frying-food-in-wok-in-home-kitchen/ed7d9086f5885b8dc87f9ff090523d47/',
  },
  {
    title: 'تنسيق وتقديم الأطباق من مطبخ المطعم',
    src: 'https://player.vimeo.com/external/437501934.sd.mp4?s=6c117391137bd595db364360d11ac0ea78cb8611&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chefs-and-waitress-serving-dishes-in-restaurant-kitchen/ed07f9dbf4f58478f84e7860f8578d79/',
  },
  {
    title: 'شيف يطهو باستخدام أدوات مطبخ حديثة',
    src: 'https://player.vimeo.com/progressive_redirect/playback/1167781395/rendition/240p/file.mp4%20%28240p%29.mp4?loc=external&oauth2_token_id=1223210874&signature=7ca858da327aeaea645e5a293adb3ea2b7d6e073e1de09852c0bb30c76b2c423',
    source: 'https://pikwizard.com/video/chef-cooking-with-smart-glasses-in-restaurant-kitchen/2f8b1521ff43b9e3b8f0cb00a29eb45e/',
  },
  {
    title: 'استعراض مهارة الشيف أثناء القلي',
    src: 'https://player.vimeo.com/external/345210594.sd.mp4?s=9afe54d2e0ddf1a3f38acc7c2c7e5ce70ae0010f&profile_id=139&oauth2_token_id=1223210874',
    source: 'https://pikwizard.com/video/chef-frying-food-in-wok-and-throwing-ingredients/68f9b7ef53afde666e6a2fd84842d144/',
  },
]

const localImageNames = [
  'gallery-1.jpg',
  'gallery-2.jpg',
  'gallery-3.jpg',
  'gallery-4.jpg',
  'gallery-5.jpg',
  'gallery-6.jpg',
  'about-image.jpg',
  'WhatsApp Image 2026-03-06 at 11.47.07 PM (1).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.07 PM.jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.08 PM (1).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.08 PM (2).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.08 PM (3).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.08 PM.jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.09 PM (1).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.09 PM (2).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.09 PM (3).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.09 PM.jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.10 PM (1).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.10 PM (2).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.10 PM (3).jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.10 PM.jpeg',
  'WhatsApp Image 2026-03-06 at 11.47.11 PM.jpeg',
]

const kitchenImages = Array.from(new Set(localImageNames.map((name) => encodeURI(`/images/${name}`))))
const stripImages = kitchenImages.slice(0, 10)
const galleryImages = kitchenImages.slice(10)
const stripLoopImages = [...stripImages, ...stripImages.slice(4), ...stripImages.slice(0, 4)]
const STRIP_TRAVEL = stripImages.length * 304

export default function Kitchen() {
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({})

  const handleVideoError = (src: string) => {
    setFailedVideos((prev) => (prev[src] ? prev : { ...prev, [src]: true }))
  }

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget
    if (target.dataset.fallbackApplied === '1') return
    target.dataset.fallbackApplied = '1'
    target.src = FALLBACK_IMAGE
  }

  const heroVideo = kitchenVideos[0]
  const heroPoster = kitchenImages[0] ?? FALLBACK_IMAGE
  const isHeroBroken = !!failedVideos[heroVideo.src]

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gallery-6.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/70" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {isHeroBroken ? (
          <img
            src={heroPoster}
            alt="داخل المطبخ"
            onError={handleImageError}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            onError={() => handleVideoError(heroVideo.src)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo.src} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/85 via-dark/75 to-dark" />

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl mx-auto">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-2 text-gold text-sm font-arabic mb-5 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              بث مباشر من داخل مطبخ النخبة
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-arabic leading-tight">
              فيديوهات وصور <span className="text-gradient-gold">داخل المطبخ</span>
            </h1>
            <p className="text-xl text-white/70 font-arabicBody mb-10">
              كل العناصر مزودة بنظام fallback تلقائي، وإذا لم يعمل الفيديو أو الصورة تظهر صورة بديلة فورًا.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic">
                <a href="#kitchen-videos">شاهد الفيديوهات الآن</a>
              </Button>
              <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-dark font-arabic">
                <Link to="/booking">احجز مناسبتك</Link>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section id="kitchen-videos" className="py-20 bg-dark-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-gold text-sm font-arabic mb-4 block">فيديوهات مطبخ حقيقية</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
                تجهيز وطهي <span className="text-gradient-gold">بدون فراغات</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {kitchenVideos.map((video, index) => {
              const posterSrc = kitchenImages[index % kitchenImages.length] ?? FALLBACK_IMAGE
              const isBroken = !!failedVideos[video.src]

              return (
                <RevealOnScroll key={video.src} delay={index * 0.05}>
                  <motion.article
                    whileHover={{ y: -8 }}
                    className="rounded-2xl overflow-hidden border border-gold/20 bg-dark-700/40 group"
                  >
                    <div className="relative h-56 bg-dark-700">
                      {isBroken ? (
                        <img
                          src={posterSrc}
                          alt={video.title}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="none"
                          poster={posterSrc}
                          onError={() => handleVideoError(video.src)}
                          className="w-full h-full object-cover"
                        >
                          <source src={video.src} type="video/mp4" />
                        </video>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-dark/70 px-3 py-1 text-xs text-gold font-arabic border border-gold/30">
                        <PlayCircle className="w-3.5 h-3.5" />
                        {isBroken ? 'صورة بديلة' : 'تشغيل تلقائي'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-arabic font-bold mb-3">{video.title}</h3>
                      <a
                        href={video.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-arabic"
                      >
                        المصدر
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.article>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-dark overflow-hidden border-y border-gold/10">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-center gap-2 text-gold font-arabic">
            <Camera className="w-5 h-5" />
            شريط صور من داخل المطبخ
          </div>
        </div>

        <motion.div
          className="flex gap-4 w-max px-4"
          animate={{ x: [0, -STRIP_TRAVEL] }}
          transition={{ duration: 42, ease: 'linear', repeat: Infinity }}
        >
          {stripLoopImages.map((src, index) => (
            <div key={`${src}-${index}`} className="w-72 h-44 rounded-2xl overflow-hidden border border-gold/20 bg-dark-700">
              <img
                src={src}
                alt="لقطة من داخل المطبخ"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </section>

      <section className="py-20 bg-dark">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-gold text-sm font-arabic mb-4 block">صور المطبخ</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-arabic">
                معرض كبير <span className="text-gradient-gold">بدون روابط فارغة</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {galleryImages.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 10) * 0.03 }}
                className="break-inside-avoid rounded-2xl overflow-hidden border border-gold/15 bg-dark-700/30"
              >
                <img
                  src={src}
                  alt={`صورة مطبخ رقم ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-800 border-t border-gold/10">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <Clapperboard className="w-10 h-10 text-gold mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-arabic">
                عايز فيديوهات مطبخ <span className="text-gradient-gold">أكثر</span>؟
              </h2>
              <p className="text-white/65 text-lg font-arabicBody mb-8">
                ابعت لينكات إضافية وأنا أضيفها لك مباشرة مع fallback تلقائي.
              </p>
              <Button asChild className="bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic font-semibold px-8 py-6">
                <Link to="/contact">ابعت لينكات جديدة</Link>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </motion.div>
    </div>
  )
}

