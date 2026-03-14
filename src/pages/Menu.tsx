import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Utensils,
  ChefHat,
  Heart,
  GlassWater,
  Mail,
  MessageCircle,
  UtensilsCrossed,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

type MenuCategory = 'appetizers' | 'hot' | 'trays' | 'desserts' | 'beverages'

type MenuItem = {
  id: number
  category: MenuCategory
  name: string
  price: number
  image: string
  description: string
  calories: number
  serves: string
}

const WHATSAPP_NUMBER = '201067431264'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
const CART_STORAGE_KEY = 'elite_menu_cart'
const ORDER_DRAFT_KEY = 'elite_order_draft'

const categories = [
  { id: 'all', name: 'الكل', icon: Utensils },
  { id: 'appetizers', name: 'المقبلات والسلطات', icon: Utensils },
  { id: 'hot', name: 'الأطباق الرئيسية', icon: ChefHat },
  { id: 'trays', name: 'الصواني والبوكسات', icon: UtensilsCrossed },
  { id: 'desserts', name: 'الحلويات', icon: Heart },
  { id: 'beverages', name: 'المشروبات', icon: GlassWater },
] as const

const menuItems: MenuItem[] = [
  { id: 1, category: 'appetizers', name: 'حمص كلاسيك', price: 25, image: 'https://source.unsplash.com/1200x900/?%D8%AD%D9%85%D8%B5%20%D9%83%D9%84%D8%A7%D8%B3%D9%8A%D9%83%20food', description: 'حمص كريمي مع الطحينة وزيت الزيتون', calories: 180, serves: 'يكفي 2-3 أشخاص' },
  { id: 2, category: 'appetizers', name: 'تبولة', price: 20, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D8%A8%D9%88%D9%84%D8%A9%20food', description: 'سلطة بقدونس طازجة مع البرغل والليمون', calories: 120, serves: 'يكفي 2-3 أشخاص' },
  { id: 3, category: 'appetizers', name: 'ورق عنب محشي', price: 35, image: 'https://source.unsplash.com/1200x900/?%D9%88%D8%B1%D9%82%20%D8%B9%D9%86%D8%A8%20%D9%85%D8%AD%D8%B4%D9%8A%20food', description: 'ورق عنب محشي بالأرز والأعشاب', calories: 250, serves: 'يكفي 3-4 أشخاص' },
  { id: 4, category: 'appetizers', name: 'متبل باذنجان مدخن', price: 22, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%AA%D8%A8%D9%84%20%D8%A8%D8%A7%D8%B0%D9%86%D8%AC%D8%A7%D9%86%20%D9%85%D8%AF%D8%AE%D9%86%20food', description: 'باذنجان مدخن مع الطحينة والثوم', calories: 150, serves: 'يكفي 2-3 أشخاص' },
  { id: 5, category: 'appetizers', name: 'فتوش', price: 24, image: 'https://source.unsplash.com/1200x900/?%D9%81%D8%AA%D9%88%D8%B4%20food', description: 'سلطة مقرمشة مع خبز محمص وسماق', calories: 200, serves: 'يكفي 2-3 أشخاص' },
  { id: 6, category: 'appetizers', name: 'سلطة خضراء', price: 18, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%84%D8%B7%D8%A9%20%D8%AE%D8%B6%D8%B1%D8%A7%D8%A1%20food', description: 'خضار طازجة مع صوص خفيف', calories: 80, serves: 'يكفي 2-3 أشخاص' },

  { id: 7, category: 'hot', name: 'مشويات مشكلة', price: 120, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B4%D9%88%D9%8A%D8%A7%D8%AA%20%D9%85%D8%B4%D9%83%D9%84%D8%A9%20food', description: 'كفتة وشيش دجاج وريش لحم مع أرز', calories: 850, serves: 'يكفي 3-4 أشخاص' },
  { id: 8, category: 'hot', name: 'برياني دجاج', price: 85, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D8%B1%D9%8A%D8%A7%D9%86%D9%8A%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'أرز برياني متبل مع دجاج مشوي', calories: 700, serves: 'يكفي 2-3 أشخاص' },
  { id: 9, category: 'hot', name: 'كبسة لحم', price: 95, image: 'https://source.unsplash.com/1200x900/?%D9%83%D8%A8%D8%B3%D8%A9%20%D9%84%D8%AD%D9%85%20food', description: 'كبسة خليجية تقليدية بلحم طري', calories: 900, serves: 'يكفي 2-3 أشخاص' },
  { id: 10, category: 'hot', name: 'دجاج ماسالا', price: 75, image: 'https://source.unsplash.com/1200x900/?%D8%AF%D8%AC%D8%A7%D8%AC%20%D9%85%D8%A7%D8%B3%D8%A7%D9%84%D8%A7%20food', description: 'دجاج بصوص كريمي وتوابل هندية', calories: 650, serves: 'يكفي 2-3 أشخاص' },
  { id: 11, category: 'hot', name: 'فيليه سمك مشوي', price: 100, image: 'https://source.unsplash.com/1200x900/?%D9%81%D9%8A%D9%84%D9%8A%D9%87%20%D8%B3%D9%85%D9%83%20%D9%85%D8%B4%D9%88%D9%8A%20food', description: 'فيليه سمك مشوي مع خضار موسمية', calories: 550, serves: 'يكفي 2-3 أشخاص' },
  { id: 12, category: 'hot', name: 'روبيان مقرمش', price: 110, image: 'https://source.unsplash.com/1200x900/?%D8%B1%D9%88%D8%A8%D9%8A%D8%A7%D9%86%20%D9%85%D9%82%D8%B1%D9%85%D8%B4%20food', description: 'روبيان ذهبي مقلي مع صوص خاص', calories: 480, serves: 'يكفي 2-3 أشخاص' },

  { id: 13, category: 'desserts', name: 'كنافة', price: 45, image: 'https://source.unsplash.com/1200x900/?%D9%83%D9%86%D8%A7%D9%81%D8%A9%20food', description: 'كنافة ذهبية بالجبن والقطر', calories: 450, serves: 'يكفي 2-3 أشخاص' },
  { id: 14, category: 'desserts', name: 'بقلاوة', price: 40, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D9%82%D9%84%D8%A7%D9%88%D8%A9%20food', description: 'رقائق عجين بالفستق والعسل', calories: 380, serves: 'يكفي 2-3 أشخاص' },
  { id: 15, category: 'desserts', name: 'أم علي', price: 35, image: 'https://source.unsplash.com/1200x900/?%D8%A3%D9%85%20%D8%B9%D9%84%D9%8A%20food', description: 'حلى الحليب التقليدي بالمكسرات', calories: 420, serves: 'يكفي 2-3 أشخاص' },
  { id: 16, category: 'desserts', name: 'مهلبية', price: 25, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%87%D9%84%D8%A8%D9%8A%D8%A9%20food', description: 'بودينغ حليب ناعم مع فستق', calories: 280, serves: 'يكفي شخص واحد' },
  { id: 17, category: 'desserts', name: 'كيك شوكولاتة', price: 30, image: 'https://source.unsplash.com/1200x900/?%D9%83%D9%8A%D9%83%20%D8%B4%D9%88%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9%20food', description: 'كيك شوكولاتة طري مع صوص كراميل', calories: 350, serves: 'يكفي شخص واحد' },
  { id: 18, category: 'desserts', name: 'تيراميسو', price: 35, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D9%8A%D8%B1%D8%A7%D9%85%D9%8A%D8%B3%D9%88%20food', description: 'تيراميسو إيطالي بنكهة القهوة', calories: 320, serves: 'يكفي شخص واحد' },

  { id: 19, category: 'beverages', name: 'عصير برتقال طازج', price: 25, image: 'https://source.unsplash.com/1200x900/?%D8%B9%D8%B5%D9%8A%D8%B1%20%D8%A8%D8%B1%D8%AA%D9%82%D8%A7%D9%84%20%D8%B7%D8%A7%D8%B2%D8%AC%20food', description: 'عصير برتقال طبيعي معصور طازج', calories: 120, serves: 'كوب واحد' },
  { id: 20, category: 'beverages', name: 'عصير مانجو', price: 28, image: 'https://source.unsplash.com/1200x900/?%D8%B9%D8%B5%D9%8A%D8%B1%20%D9%85%D8%A7%D9%86%D8%AC%D9%88%20food', description: 'عصير مانجو غني وقوام ناعم', calories: 150, serves: 'كوب واحد' },
  { id: 21, category: 'beverages', name: 'ليمون بالنعناع', price: 22, image: 'https://source.unsplash.com/1200x900/?%D9%84%D9%8A%D9%85%D9%88%D9%86%20%D8%A8%D8%A7%D9%84%D9%86%D8%B9%D9%86%D8%A7%D8%B9%20food', description: 'مشروب ليمون منعش مع نعناع', calories: 80, serves: 'كوب واحد' },
  { id: 22, category: 'beverages', name: 'قهوة عربية', price: 20, image: 'https://source.unsplash.com/1200x900/?%D9%82%D9%87%D9%88%D8%A9%20%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9%20food', description: 'قهوة عربية تقليدية بالهيل', calories: 60, serves: 'كوب واحد' },
  { id: 23, category: 'beverages', name: 'شاي أسود', price: 15, image: 'https://source.unsplash.com/1200x900/?%D8%B4%D8%A7%D9%8A%20%D8%A3%D8%B3%D9%88%D8%AF%20food', description: 'شاي أسود ساخن بطعم كلاسيكي', calories: 0, serves: 'كوب واحد' },
  { id: 24, category: 'beverages', name: 'مياه معدنية', price: 5, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%8A%D8%A7%D9%87%20%D9%85%D8%B9%D8%AF%D9%86%D9%8A%D8%A9%20food', description: 'مياه باردة معبأة', calories: 0, serves: 'زجاجة واحدة' },
]

const extraMenuItems: MenuItem[] = [
  { id: 101, category: 'appetizers', name: 'سلطة يونانية', price: 32, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%84%D8%B7%D8%A9%20%D9%8A%D9%88%D9%86%D8%A7%D9%86%D9%8A%D8%A9%20food', description: 'سلطة طازجة مع جبنة فيتا وزيتون', calories: 210, serves: 'يكفي 2-3 أشخاص' },
  { id: 102, category: 'appetizers', name: 'حمص الشمندر', price: 28, image: 'https://source.unsplash.com/1200x900/?%D8%AD%D9%85%D8%B5%20%D8%A7%D9%84%D8%B4%D9%85%D9%86%D8%AF%D8%B1%20food', description: 'حمص ملون بالشمندر مع طحينة', calories: 190, serves: 'يكفي 2-3 أشخاص' },
  { id: 103, category: 'appetizers', name: 'سلطة سيزر بالدجاج', price: 39, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%84%D8%B7%D8%A9%20%D8%B3%D9%8A%D8%B2%D8%B1%20%D8%A8%D8%A7%D9%84%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'خس روماني مع دجاج مشوي وجبن بارميزان', calories: 380, serves: 'يكفي شخصين' },
  { id: 104, category: 'appetizers', name: 'بروشيتا مشكلة', price: 34, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D8%B1%D9%88%D8%B4%D9%8A%D8%AA%D8%A7%20%D9%85%D8%B4%D9%83%D9%84%D8%A9%20food', description: 'خبز محمص مع طماطم طازجة وريحان', calories: 260, serves: 'يكفي 2-3 أشخاص' },
  { id: 105, category: 'appetizers', name: 'طبق مقبلات مشكل', price: 58, image: 'https://source.unsplash.com/1200x900/?%D8%B7%D8%A8%D9%82%20%D9%85%D9%82%D8%A8%D9%84%D8%A7%D8%AA%20%D9%85%D8%B4%D9%83%D9%84%20food', description: 'تشكيلة كاملة من المقبلات الساخنة والباردة', calories: 540, serves: 'يكفي 3-4 أشخاص' },
  { id: 106, category: 'appetizers', name: 'ورق عنب فاخر', price: 42, image: 'https://source.unsplash.com/1200x900/?%D9%88%D8%B1%D9%82%20%D8%B9%D9%86%D8%A8%20%D9%81%D8%A7%D8%AE%D8%B1%20food', description: 'ورق عنب محشي بتتبيلة خاصة', calories: 300, serves: 'يكفي 2-3 أشخاص' },
  { id: 107, category: 'appetizers', name: 'مكعبات حلومي مشوية', price: 36, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%83%D8%B9%D8%A8%D8%A7%D8%AA%20%D8%AD%D9%84%D9%88%D9%85%D9%8A%20%D9%85%D8%B4%D9%88%D9%8A%D8%A9%20food', description: 'حلومي مشوي مع أعشاب وزيت زيتون', calories: 310, serves: 'يكفي 2-3 أشخاص' },

  { id: 108, category: 'hot', name: 'مندي لحم', price: 125, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%86%D8%AF%D9%8A%20%D9%84%D8%AD%D9%85%20food', description: 'لحم مندي مطهو ببطء على أرز عطري', calories: 920, serves: 'يكفي 3-4 أشخاص' },
  { id: 109, category: 'hot', name: 'مندي دجاج', price: 95, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%86%D8%AF%D9%8A%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'دجاج مندي طري مع أرز بالزعفران', calories: 760, serves: 'يكفي 2-3 أشخاص' },
  { id: 110, category: 'hot', name: 'طبق شاورما دجاج', price: 58, image: 'https://source.unsplash.com/1200x900/?%D8%B7%D8%A8%D9%82%20%D8%B4%D8%A7%D9%88%D8%B1%D9%85%D8%A7%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'شرائح شاورما مع بطاطس وصوص ثوم', calories: 610, serves: 'يكفي شخصين' },
  { id: 111, category: 'hot', name: 'لازانيا لحم', price: 72, image: 'https://source.unsplash.com/1200x900/?%D9%84%D8%A7%D8%B2%D8%A7%D9%86%D9%8A%D8%A7%20%D9%84%D8%AD%D9%85%20food', description: 'طبقات باستا بصوص طماطم وجبن', calories: 740, serves: 'يكفي 2-3 أشخاص' },
  { id: 112, category: 'hot', name: 'باستا ألفريدو بالدجاج', price: 64, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D8%A7%D8%B3%D8%AA%D8%A7%20%D8%A3%D9%84%D9%81%D8%B1%D9%8A%D8%AF%D9%88%20%D8%A8%D8%A7%D9%84%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'باستا كريمية مع دجاج مشوي', calories: 680, serves: 'يكفي شخصين' },
  { id: 113, category: 'hot', name: 'أضلاع باربكيو', price: 138, image: 'https://source.unsplash.com/1200x900/?%D8%A3%D8%B6%D9%84%D8%A7%D8%B9%20%D8%A8%D8%A7%D8%B1%D8%A8%D9%83%D9%8A%D9%88%20food', description: 'أضلاع لحم بصوص مدخن تقدم ساخنة', calories: 880, serves: 'يكفي 2-3 أشخاص' },
  { id: 114, category: 'hot', name: 'باييلا سي فود', price: 132, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D8%A7%D9%8A%D9%8A%D9%84%D8%A7%20%D8%B3%D9%8A%20%D9%81%D9%88%D8%AF%20food', description: 'أرز إسباني بالمأكولات البحرية', calories: 790, serves: 'يكفي 3-4 أشخاص' },
  { id: 115, category: 'hot', name: 'دجاج بارميزان', price: 86, image: 'https://source.unsplash.com/1200x900/?%D8%AF%D8%AC%D8%A7%D8%AC%20%D8%A8%D8%A7%D8%B1%D9%85%D9%8A%D8%B2%D8%A7%D9%86%20food', description: 'صدر دجاج مقرمش مع جبن وصوص طماطم', calories: 700, serves: 'يكفي شخصين' },
  { id: 116, category: 'hot', name: 'ترياكي لحم مع أرز', price: 79, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D8%B1%D9%8A%D8%A7%D9%83%D9%8A%20%D9%84%D8%AD%D9%85%20%D9%85%D8%B9%20%D8%A3%D8%B1%D8%B2%20food', description: 'شرائح لحم بصوص ترياكي فوق أرز', calories: 690, serves: 'يكفي شخصين' },

  { id: 117, category: 'desserts', name: 'تشيزكيك بالتوت', price: 34, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D8%B4%D9%8A%D8%B2%D9%83%D9%8A%D9%83%20%D8%A8%D8%A7%D9%84%D8%AA%D9%88%D8%AA%20food', description: 'تشيزكيك كريمي مع صوص التوت', calories: 360, serves: 'يكفي شخص واحد' },
  { id: 118, category: 'desserts', name: 'براونيز شوكولاتة', price: 29, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D8%B1%D8%A7%D9%88%D9%86%D9%8A%D8%B2%20%D8%B4%D9%88%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9%20food', description: 'براونيز شوكولاتة غني يقدم دافئاً', calories: 390, serves: 'يكفي شخص واحد' },
  { id: 119, category: 'desserts', name: 'كاسات تمر بالحلى', price: 33, image: 'https://source.unsplash.com/1200x900/?%D9%83%D8%A7%D8%B3%D8%A7%D8%AA%20%D8%AA%D9%85%D8%B1%20%D8%A8%D8%A7%D9%84%D8%AD%D9%84%D9%89%20food', description: 'طبقات تمر وكريمة بطعم فاخر', calories: 410, serves: 'يكفي 2-3 أشخاص' },
  { id: 120, category: 'desserts', name: 'تشكيلة ميني كيك', price: 42, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D8%B4%D9%83%D9%8A%D9%84%D8%A9%20%D9%85%D9%8A%D9%86%D9%8A%20%D9%83%D9%8A%D9%83%20food', description: 'قطع ميني كيك مناسبة للمناسبات', calories: 470, serves: 'يكفي 3-4 أشخاص' },
  { id: 121, category: 'desserts', name: 'بوكس ماكرون', price: 48, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D9%88%D9%83%D8%B3%20%D9%85%D8%A7%D9%83%D8%B1%D9%88%D9%86%20food', description: 'ماكرون فرنسي بنكهات متنوعة', calories: 320, serves: 'يكفي 2-3 أشخاص' },
  { id: 122, category: 'desserts', name: 'تارت فواكه', price: 36, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D8%A7%D8%B1%D8%AA%20%D9%81%D9%88%D8%A7%D9%83%D9%87%20food', description: 'تارت كاسترد بالفواكه الموسمية', calories: 340, serves: 'يكفي شخصين' },
  { id: 123, category: 'desserts', name: 'إكلير فستق', price: 31, image: 'https://source.unsplash.com/1200x900/?%D8%A5%D9%83%D9%84%D9%8A%D8%B1%20%D9%81%D8%B3%D8%AA%D9%82%20food', description: 'إكلير كريمي بطبقة فستق', calories: 330, serves: 'يكفي شخص واحد' },

  { id: 124, category: 'beverages', name: 'موهيتو كلاسيك', price: 24, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%88%D9%87%D9%8A%D8%AA%D9%88%20%D9%83%D9%84%D8%A7%D8%B3%D9%8A%D9%83%20food', description: 'مشروب منعش بالنعناع والليمون', calories: 95, serves: 'كوب واحد' },
  { id: 125, category: 'beverages', name: 'آيس لاتيه', price: 26, image: 'https://source.unsplash.com/1200x900/?%D8%A2%D9%8A%D8%B3%20%D9%84%D8%A7%D8%AA%D9%8A%D9%87%20food', description: 'قهوة لاتيه باردة مع حليب', calories: 140, serves: 'كوب واحد' },
  { id: 126, category: 'beverages', name: 'سموذي فراولة', price: 27, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%85%D9%88%D8%B0%D9%8A%20%D9%81%D8%B1%D8%A7%D9%88%D9%84%D8%A9%20food', description: 'سموذي فراولة طازج ومخفوق', calories: 170, serves: 'كوب واحد' },
  { id: 127, category: 'beverages', name: 'عصير رمان', price: 30, image: 'https://source.unsplash.com/1200x900/?%D8%B9%D8%B5%D9%8A%D8%B1%20%D8%B1%D9%85%D8%A7%D9%86%20food', description: 'عصير رمان طبيعي بارد', calories: 130, serves: 'كوب واحد' },
  { id: 128, category: 'beverages', name: 'آيس ماتشا', price: 31, image: 'https://source.unsplash.com/1200x900/?%D8%A2%D9%8A%D8%B3%20%D9%85%D8%A7%D8%AA%D8%B4%D8%A7%20food', description: 'ماتشا باردة مع حليب وثلج', calories: 120, serves: 'كوب واحد' },
  { id: 129, category: 'beverages', name: 'عصير استوائي مشكل', price: 29, image: 'https://source.unsplash.com/1200x900/?%D8%B9%D8%B5%D9%8A%D8%B1%20%D8%A7%D8%B3%D8%AA%D9%88%D8%A7%D8%A6%D9%8A%20%D9%85%D8%B4%D9%83%D9%84%20food', description: 'مزيج مانجو وأناناس وبرتقال', calories: 160, serves: 'كوب واحد' },
  { id: 130, category: 'beverages', name: 'قهوة كولد برو', price: 28, image: 'https://source.unsplash.com/1200x900/?%D9%82%D9%87%D9%88%D8%A9%20%D9%83%D9%88%D9%84%D8%AF%20%D8%A8%D8%B1%D9%88%20food', description: 'قهوة باردة مخمرة بنكهة ناعمة', calories: 15, serves: 'كوب واحد' },
  { id: 131, category: 'appetizers', name: 'سمبوسة لحم سعودية', price: 30, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%85%D8%A8%D9%88%D8%B3%D8%A9%20%D9%84%D8%AD%D9%85%20%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9%20food', description: 'سمبوسة مقرمشة محشية لحم متبل على الطريقة السعودية', calories: 320, serves: 'يكفي 2-3 أشخاص' },
  { id: 132, category: 'appetizers', name: 'مطبق حجازي', price: 34, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B7%D8%A8%D9%82%20%D8%AD%D8%AC%D8%A7%D8%B2%D9%8A%20food', description: 'رقائق عجين محشية باللحم والبصل وتوابل حجازية', calories: 360, serves: 'يكفي شخصين' },
  { id: 133, category: 'appetizers', name: 'سلطة جرجير بالرمان', price: 27, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%84%D8%B7%D8%A9%20%D8%AC%D8%B1%D8%AC%D9%8A%D8%B1%20%D8%A8%D8%A7%D9%84%D8%B1%D9%85%D8%A7%D9%86%20food', description: 'جرجير طازج مع دبس الرمان وبصل أحمر', calories: 140, serves: 'يكفي 2-3 أشخاص' },

  { id: 134, category: 'hot', name: 'جريش قصيمي', price: 68, image: 'https://source.unsplash.com/1200x900/?%D8%AC%D8%B1%D9%8A%D8%B4%20%D9%82%D8%B5%D9%8A%D9%85%D9%8A%20food', description: 'جريش مطبوخ ببطء مع لحم وتتبيلة سعودية أصيلة', calories: 620, serves: 'يكفي 2-3 أشخاص' },
  { id: 135, category: 'hot', name: 'قرصان لحم', price: 82, image: 'https://source.unsplash.com/1200x900/?%D9%82%D8%B1%D8%B5%D8%A7%D9%86%20%D9%84%D8%AD%D9%85%20food', description: 'خبز قرصان مع مرق اللحم والخضار على الطريقة النجدية', calories: 690, serves: 'يكفي 2-3 أشخاص' },
  { id: 136, category: 'hot', name: 'سليق دجاج طائفي', price: 78, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%84%D9%8A%D9%82%20%D8%AF%D8%AC%D8%A7%D8%AC%20%D8%B7%D8%A7%D8%A6%D9%81%D9%8A%20food', description: 'أرز سليق كريمي مع دجاج مشوي ولمسة هيل', calories: 670, serves: 'يكفي 2-3 أشخاص' },
  { id: 137, category: 'hot', name: 'حنيذ لحم', price: 132, image: 'https://source.unsplash.com/1200x900/?%D8%AD%D9%86%D9%8A%D8%B0%20%D9%84%D8%AD%D9%85%20food', description: 'لحم حنيذ طري مطهو على نار هادئة مع أرز معطر', calories: 930, serves: 'يكفي 3-4 أشخاص' },
  { id: 138, category: 'hot', name: 'دجاج مضغوط', price: 92, image: 'https://source.unsplash.com/1200x900/?%D8%AF%D8%AC%D8%A7%D8%AC%20%D9%85%D8%B6%D8%BA%D9%88%D8%B7%20food', description: 'أرز مضغوط مع دجاج متبل بالبهارات الخليجية', calories: 740, serves: 'يكفي 2-3 أشخاص' },
  { id: 139, category: 'hot', name: 'مطازيز نجدية', price: 73, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B7%D8%A7%D8%B2%D9%8A%D8%B2%20%D9%86%D8%AC%D8%AF%D9%8A%D8%A9%20food', description: 'قطع عجين مطازيز مع مرق اللحم والخضار', calories: 650, serves: 'يكفي 2-3 أشخاص' },
  { id: 140, category: 'hot', name: 'مفطح لحم', price: 165, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%81%D8%B7%D8%AD%20%D9%84%D8%AD%D9%85%20food', description: 'طبق سعودي فاخر من اللحم مع أرز بهارات خاصة', calories: 1120, serves: 'يكفي 4-5 أشخاص' },

  { id: 141, category: 'desserts', name: 'كليجا قصيمية', price: 32, image: 'https://source.unsplash.com/1200x900/?%D9%83%D9%84%D9%8A%D8%AC%D8%A7%20%D9%82%D8%B5%D9%8A%D9%85%D9%8A%D8%A9%20food', description: 'حلى تقليدي من القصيم محشي بالتمر والبهارات', calories: 330, serves: 'يكفي 2-3 أشخاص' },
  { id: 142, category: 'desserts', name: 'لقيمات بالعسل', price: 29, image: 'https://source.unsplash.com/1200x900/?%D9%84%D9%82%D9%8A%D9%85%D8%A7%D8%AA%20%D8%A8%D8%A7%D9%84%D8%B9%D8%B3%D9%84%20food', description: 'لقيمات ذهبية مقرمشة مغطاة بالعسل والسمسم', calories: 360, serves: 'يكفي 2-3 أشخاص' },
  { id: 143, category: 'desserts', name: 'معصوب بالقشطة', price: 36, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B9%D8%B5%D9%88%D8%A8%20%D8%A8%D8%A7%D9%84%D9%82%D8%B4%D8%B7%D8%A9%20food', description: 'موز وعسل وخبز طازج مع قشطة ومكسرات', calories: 480, serves: 'يكفي شخصين' },

  { id: 144, category: 'beverages', name: 'شاي كرك', price: 18, image: 'https://source.unsplash.com/1200x900/?%D8%B4%D8%A7%D9%8A%20%D9%83%D8%B1%D9%83%20food', description: 'شاي كرك بالحليب والهيل بنكهة سعودية محبوبة', calories: 110, serves: 'كوب واحد' },
  { id: 145, category: 'beverages', name: 'سوبيا حجازية', price: 22, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%88%D8%A8%D9%8A%D8%A7%20%D8%AD%D8%AC%D8%A7%D8%B2%D9%8A%D8%A9%20food', description: 'مشروب سوبيا بارد بنكهة الهيل والقرفة', calories: 170, serves: 'كوب واحد' },
  { id: 146, category: 'beverages', name: 'لبن عيران', price: 14, image: 'https://source.unsplash.com/1200x900/?%D9%84%D8%A8%D9%86%20%D8%B9%D9%8A%D8%B1%D8%A7%D9%86%20food', description: 'مشروب لبن بارد ومنعش مناسب للأطباق الحارة', calories: 90, serves: 'كوب واحد' },
  { id: 147, category: 'appetizers', name: 'شوربة عدس حجازية', price: 24, image: 'https://source.unsplash.com/1200x900/?%D8%B4%D9%88%D8%B1%D8%A8%D8%A9%20%D8%B9%D8%AF%D8%B3%20%D8%AD%D8%AC%D8%A7%D8%B2%D9%8A%D8%A9%20food', description: 'شوربة عدس دافئة بتتبيلة حجازية خفيفة', calories: 210, serves: 'يكفي شخصين' },
  { id: 148, category: 'appetizers', name: 'فتة باذنجان', price: 33, image: 'https://source.unsplash.com/1200x900/?%D9%81%D8%AA%D8%A9%20%D8%A8%D8%A7%D8%B0%D9%86%D8%AC%D8%A7%D9%86%20food', description: 'طبقات خبز مقرمش مع باذنجان وصلصة طحينة', calories: 340, serves: 'يكفي 2-3 أشخاص' },
  { id: 149, category: 'appetizers', name: 'حمص صنوبر', price: 31, image: 'https://source.unsplash.com/1200x900/?%D8%AD%D9%85%D8%B5%20%D8%B5%D9%86%D9%88%D8%A8%D8%B1%20food', description: 'حمص كريمي مزين بصنوبر محمص وزيت زيتون', calories: 290, serves: 'يكفي 2-3 أشخاص' },
  { id: 150, category: 'appetizers', name: 'سلطة زبادي بالخيار', price: 21, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%84%D8%B7%D8%A9%20%D8%B2%D8%A8%D8%A7%D8%AF%D9%8A%20%D8%A8%D8%A7%D9%84%D8%AE%D9%8A%D8%A7%D8%B1%20food', description: 'زبادي بارد مع خيار ونعناع يقدم مع الأطباق الحارة', calories: 130, serves: 'يكفي 2-3 أشخاص' },
  { id: 151, category: 'hot', name: 'مرقوق لحم نجدي', price: 84, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B1%D9%82%D9%88%D9%82%20%D9%84%D8%AD%D9%85%20%D9%86%D8%AC%D8%AF%D9%8A%20food', description: 'شرائح عجين رقيقة مطهوة مع لحم وخضار في مرق غني', calories: 720, serves: 'يكفي 2-3 أشخاص' },
  { id: 152, category: 'hot', name: 'رز بخاري دجاج', price: 76, image: 'https://source.unsplash.com/1200x900/?%D8%B1%D8%B2%20%D8%A8%D8%AE%D8%A7%D8%B1%D9%8A%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'أرز بخاري متبل مع دجاج مشوي وصوص طماطم حار', calories: 690, serves: 'يكفي 2-3 أشخاص' },
  { id: 153, category: 'hot', name: 'صيادية سمك', price: 98, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D8%A7%D8%AF%D9%8A%D8%A9%20%D8%B3%D9%85%D9%83%20food', description: 'أرز صيادية بالبصل المكرمل مع فيليه سمك طازج', calories: 640, serves: 'يكفي 2-3 أشخاص' },
  { id: 154, category: 'hot', name: 'مقلقل لحم', price: 88, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%82%D9%84%D9%82%D9%84%20%D9%84%D8%AD%D9%85%20food', description: 'قطع لحم صغيرة مطهوة سريعًا مع فلفل وبصل', calories: 610, serves: 'يكفي شخصين' },
  { id: 155, category: 'hot', name: 'كبسة دجاج حارة', price: 89, image: 'https://source.unsplash.com/1200x900/?%D9%83%D8%A8%D8%B3%D8%A9%20%D8%AF%D8%AC%D8%A7%D8%AC%20%D8%AD%D8%A7%D8%B1%D8%A9%20food', description: 'كبسة دجاج سعودية بخلطة بهارات حارة', calories: 770, serves: 'يكفي 2-3 أشخاص' },
  { id: 156, category: 'desserts', name: 'حنيني نجدي', price: 34, image: 'https://source.unsplash.com/1200x900/?%D8%AD%D9%86%D9%8A%D9%86%D9%8A%20%D9%86%D8%AC%D8%AF%D9%8A%20food', description: 'حلى نجدي من التمر والدقيق والسمن بطعم أصيل', calories: 430, serves: 'يكفي شخصين' },
  { id: 157, category: 'desserts', name: 'عصيدة التمر', price: 30, image: 'https://source.unsplash.com/1200x900/?%D8%B9%D8%B5%D9%8A%D8%AF%D8%A9%20%D8%A7%D9%84%D8%AA%D9%85%D8%B1%20food', description: 'عصيدة دافئة ممزوجة بالتمر والسمن البلدي', calories: 390, serves: 'يكفي شخصين' },
  { id: 158, category: 'desserts', name: 'معمول تمر', price: 28, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B9%D9%85%D9%88%D9%84%20%D8%AA%D9%85%D8%B1%20food', description: 'قطع معمول هشة محشية تمر فاخر', calories: 320, serves: 'يكفي 2-3 أشخاص' },
  { id: 159, category: 'desserts', name: 'دبيازة حجازية', price: 37, image: 'https://source.unsplash.com/1200x900/?%D8%AF%D8%A8%D9%8A%D8%A7%D8%B2%D8%A9%20%D8%AD%D8%AC%D8%A7%D8%B2%D9%8A%D8%A9%20food', description: 'حلى موسمي غني بالمشمش المجفف والزبيب والمكسرات', calories: 410, serves: 'يكفي 2-3 أشخاص' },
  { id: 160, category: 'beverages', name: 'قهوة سعودية بالزعفران', price: 24, image: 'https://source.unsplash.com/1200x900/?%D9%82%D9%87%D9%88%D8%A9%20%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9%20%D8%A8%D8%A7%D9%84%D8%B2%D8%B9%D9%81%D8%B1%D8%A7%D9%86%20food', description: 'قهوة عربية فاخرة بالهيل ولمسة زعفران', calories: 70, serves: 'كوب واحد' },
  { id: 161, category: 'beverages', name: 'فيمتو مثلج', price: 20, image: 'https://source.unsplash.com/1200x900/?%D9%81%D9%8A%D9%85%D8%AA%D9%88%20%D9%85%D8%AB%D9%84%D8%AC%20food', description: 'مشروب فيمتو بارد مع ثلج وشرائح فواكه', calories: 180, serves: 'كوب واحد' },
  { id: 162, category: 'beverages', name: 'تمر هندي بارد', price: 19, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D9%85%D8%B1%20%D9%87%D9%86%D8%AF%D9%8A%20%D8%A8%D8%A7%D8%B1%D8%AF%20food', description: 'مشروب تمر هندي منعش بنكهة متوازنة', calories: 140, serves: 'كوب واحد' },
  { id: 163, category: 'hot', name: 'مشاوي دجاج مشكل', price: 96, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B4%D8%A7%D9%88%D9%8A%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'تشكيلة شيش وأوراك دجاج مع خضار مشوية وصوص ثوم', calories: 720, serves: 'يكفي 2-3 أشخاص' },
  { id: 164, category: 'hot', name: 'برياني لحم فاخر', price: 98, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D8%B1%D9%8A%D8%A7%D9%86%D9%8A%20%D9%84%D8%AD%D9%85%20food', description: 'أرز برياني مع لحم طري مطهو بتوابل هندية عطرية', calories: 840, serves: 'يكفي 2-3 أشخاص' },
  { id: 165, category: 'hot', name: 'كبسة جمبري', price: 112, image: 'https://source.unsplash.com/1200x900/?%D9%83%D8%A8%D8%B3%D8%A9%20%D8%AC%D9%85%D8%A8%D8%B1%D9%8A%20food', description: 'كبسة بحرية غنية بالجمبري والبهارات الخليجية', calories: 760, serves: 'يكفي 2-3 أشخاص' },
  { id: 166, category: 'hot', name: 'مكرونة بشاميل باللحم', price: 68, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%83%D8%B1%D9%88%D9%86%D8%A9%20%D8%A8%D8%B4%D8%A7%D9%85%D9%8A%D9%84%20food', description: 'طبقات مكرونة غنية بصوص بشاميل ولحم متبل', calories: 690, serves: 'يكفي 2-3 أشخاص' },
  { id: 167, category: 'hot', name: 'أوزي لحم بالزعفران', price: 104, image: 'https://source.unsplash.com/1200x900/?%D8%A3%D9%88%D8%B2%D9%8A%20%D9%84%D8%AD%D9%85%20food', description: 'أرز أوزي فاخر مع لحم ومكسرات ولمسة زعفران', calories: 860, serves: 'يكفي 2-3 أشخاص' },
  { id: 168, category: 'hot', name: 'مقلوبة دجاج', price: 88, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%82%D9%84%D9%88%D8%A8%D8%A9%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'أرز مقلوبة مع دجاج وخضار مقلية ونكهة بيتية', calories: 730, serves: 'يكفي 2-3 أشخاص' },
  { id: 169, category: 'desserts', name: 'كنافة بالقشطة', price: 47, image: 'https://source.unsplash.com/1200x900/?%D9%83%D9%86%D8%A7%D9%81%D8%A9%20%D8%A8%D8%A7%D9%84%D9%82%D8%B4%D8%B7%D8%A9%20food', description: 'كنافة طرية محشية قشطة مع فستق وقطر', calories: 470, serves: 'يكفي 2-3 أشخاص' },
  { id: 170, category: 'desserts', name: 'تشيزكيك لوتس', price: 37, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D8%B4%D9%8A%D8%B2%D9%83%D9%8A%D9%83%20%D9%84%D9%88%D8%AA%D8%B3%20food', description: 'تشيزكيك كريمي بقاعدة بسكويت لوتس وصوص غني', calories: 390, serves: 'يكفي شخص واحد' },
  { id: 171, category: 'desserts', name: 'لقيمات نوتيلا', price: 34, image: 'https://source.unsplash.com/1200x900/?%D9%84%D9%82%D9%8A%D9%85%D8%A7%D8%AA%20%D9%86%D9%88%D8%AA%D9%8A%D9%84%D8%A7%20food', description: 'لقيمات ذهبية تقدم مع نوتيلا وبندق محمص', calories: 410, serves: 'يكفي 2-3 أشخاص' },
  { id: 172, category: 'desserts', name: 'بوكس براونيز', price: 45, image: 'https://source.unsplash.com/1200x900/?%D8%A8%D9%88%D9%83%D8%B3%20%D8%A8%D8%B1%D8%A7%D9%88%D9%86%D9%8A%D8%B2%20food', description: 'بوكس مناسب للضيافة يحتوي قطع براونيز غنية', calories: 520, serves: 'يكفي 3-4 أشخاص' },
  { id: 173, category: 'desserts', name: 'معمول فستق', price: 32, image: 'https://source.unsplash.com/1200x900/?%D9%85%D8%B9%D9%85%D9%88%D9%84%20%D9%81%D8%B3%D8%AA%D9%82%20food', description: 'معمول هش محشي فستق فاخر ومزين بسكر ناعم', calories: 340, serves: 'يكفي 2-3 أشخاص' },
  { id: 174, category: 'desserts', name: 'تيراميسو إسبريسو', price: 38, image: 'https://source.unsplash.com/1200x900/?%D8%AA%D9%8A%D8%B1%D8%A7%D9%85%D9%8A%D8%B3%D9%88%20%D8%A5%D8%B3%D8%A8%D8%B1%D9%8A%D8%B3%D9%88%20food', description: 'تيراميسو مركز بنكهة إسبريسو وكريمة ماسكربوني', calories: 340, serves: 'يكفي شخص واحد' },
  { id: 175, category: 'beverages', name: 'ميلك شيك شوكولاتة', price: 29, image: 'https://source.unsplash.com/1200x900/?%D9%85%D9%8A%D9%84%D9%83%20%D8%B4%D9%8A%D9%83%20%D8%B4%D9%88%D9%83%D9%88%D9%84%D8%A7%D8%AA%D8%A9%20food', description: 'ميلك شيك بارد بقوام غني ولمسة شوكولاتة', calories: 320, serves: 'كوب واحد' },
  { id: 176, category: 'beverages', name: 'سموذي مانجو', price: 28, image: 'https://source.unsplash.com/1200x900/?%D8%B3%D9%85%D9%88%D8%B0%D9%8A%20%D9%85%D8%A7%D9%86%D8%AC%D9%88%20food', description: 'سموذي مانجو مخفوق بطعم استوائي منعش', calories: 180, serves: 'كوب واحد' },
  { id: 177, category: 'beverages', name: 'آيس لاتيه كراميل', price: 30, image: 'https://source.unsplash.com/1200x900/?%D8%A2%D9%8A%D8%B3%20%D9%84%D8%A7%D8%AA%D9%8A%D9%87%20%D9%83%D8%B1%D8%A7%D9%85%D9%8A%D9%84%20food', description: 'قهوة لاتيه باردة مع كراميل وحليب مخفوق', calories: 190, serves: 'كوب واحد' },
  { id: 178, category: 'beverages', name: 'عصير أناناس طازج', price: 26, image: 'https://source.unsplash.com/1200x900/?%D8%B9%D8%B5%D9%8A%D8%B1%20%D8%A3%D9%86%D8%A7%D9%86%D8%A7%D8%B3%20food', description: 'عصير أناناس بارد بطعم استوائي نقي', calories: 125, serves: 'كوب واحد' },
  { id: 179, category: 'beverages', name: 'شاي خوخ مثلج', price: 24, image: 'https://source.unsplash.com/1200x900/?%D8%B4%D8%A7%D9%8A%20%D8%AE%D9%88%D8%AE%20%D9%85%D8%AB%D9%84%D8%AC%20food', description: 'شاي بارد بنكهة الخوخ وشرائح ليمون منعشة', calories: 110, serves: 'كوب واحد' },
  { id: 180, category: 'beverages', name: 'فرابتشينو موكا', price: 32, image: 'https://source.unsplash.com/1200x900/?%D9%81%D8%B1%D8%A7%D8%A8%D8%AA%D8%B4%D9%8A%D9%86%D9%88%20%D9%85%D9%88%D9%83%D8%A7%20food', description: 'مشروب قهوة مثلج ممزوج بالشوكولاتة والكريمة', calories: 260, serves: 'كوب واحد' },
  { id: 181, category: 'trays', name: 'صينية مشويات عائلية', price: 320, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D9%85%D8%B4%D9%88%D9%8A%D8%A7%D8%AA%20food', description: 'صينية كبيرة تضم كباب وشيش دجاج وكفتة مع أرز وخضار', calories: 1850, serves: 'تكفي 5-6 أشخاص' },
  { id: 182, category: 'trays', name: 'صينية كبسة دجاج', price: 260, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D9%83%D8%A8%D8%B3%D8%A9%20%D8%AF%D8%AC%D8%A7%D8%AC%20food', description: 'صينية كبسة كاملة مناسبة للعزائم مع دجاج متبل', calories: 1680, serves: 'تكفي 4-5 أشخاص' },
  { id: 183, category: 'trays', name: 'صينية ميني ساندويتشات', price: 220, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D9%85%D9%8A%D9%86%D9%8A%20%D8%B3%D8%A7%D9%86%D8%AF%D9%88%D9%8A%D8%AA%D8%B4%D8%A7%D8%AA%20food', description: 'تشكيلة ضيافة خفيفة من ميني ساندويتشات جبن ودجاج وتونة', calories: 1380, serves: 'تكفي 6-8 أشخاص' },
  { id: 184, category: 'trays', name: 'صينية حلويات مشكلة', price: 240, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA%20food', description: 'صينية ضيافة متنوعة من كنافة وبقلاوة وميني كيك', calories: 1620, serves: 'تكفي 6-8 أشخاص' },
  { id: 185, category: 'trays', name: 'صينية ورق عنب', price: 180, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D9%88%D8%B1%D9%82%20%D8%B9%D9%86%D8%A8%20food', description: 'صينية مرتبة من ورق العنب المحشي بتتبيلة ليمون وزيت زيتون', calories: 980, serves: 'تكفي 4-5 أشخاص' },
  { id: 186, category: 'trays', name: 'صينية مندي لحم', price: 340, image: 'https://source.unsplash.com/1200x900/?%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D9%85%D9%86%D8%AF%D9%8A%20%D9%84%D8%AD%D9%85%20food', description: 'صينية مندي فاخر بلحم طري وأرز متبل للولائم', calories: 1940, serves: 'تكفي 5-6 أشخاص' },
]

const allMenuItems = [...menuItems, ...extraMenuItems]
const FALLBACK_MENU_IMAGE = '/images/gallery-5.jpg'

const categoryLabels: Record<MenuCategory, string> = {
  appetizers: 'مقبلات',
  hot: 'طبق رئيسي',
  trays: 'صواني',
  desserts: 'حلويات',
  beverages: 'مشروبات',
}

const categoryPalettes: Record<MenuCategory, { start: string; end: string; accent: string }> = {
  appetizers: { start: '#153544', end: '#0f1f29', accent: '#f5c542' },
  hot: { start: '#4a1f1f', end: '#231010', accent: '#f59e0b' },
  trays: { start: '#46311c', end: '#24160d', accent: '#fbbf24' },
  desserts: { start: '#422341', end: '#221222', accent: '#f9a8d4' },
  beverages: { start: '#173b2f', end: '#0d2019', accent: '#86efac' },
}

const categoryImageFallbacks: Record<MenuCategory, string[]> = {
  appetizers: ['/images/menu-tabbouleh.jpg', '/images/menu-hummus.jpg', '/images/menu-warak.jpg'],
  hot: ['/images/menu-mixed-grill.jpg', '/images/menu-biryani.jpg'],
  trays: ['/images/gallery-4.jpg', '/images/menu-mixed-grill.jpg', '/images/menu-baklava.jpg'],
  desserts: ['/images/menu-kunafa.jpg', '/images/menu-baklava.jpg', '/images/menu-ummali.jpg'],
  beverages: ['/images/menu-juices.jpg', '/images/menu-coffee.jpg'],
}

const normalizeArabicText = (value: string): string =>
  value.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim()

type DishImageRule = {
  pattern: RegExp
  primary: string
  wikipediaTitle?: string
  wikipediaLang?: 'ar' | 'en'
  fallbacks?: string[]
}

const dishImageRules: DishImageRule[] = [
  { pattern: /حمص صنوبر|حمص الشمندر|حمص كلاسيك|حمص/, primary: '/images/menu-hummus.jpg', wikipediaTitle: 'Hummus' },
  { pattern: /تبوله/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Tabbouleh' },
  { pattern: /ورق عنب/, primary: '/images/menu-warak.jpg', wikipediaTitle: 'Dolma' },
  { pattern: /متبل|فته باذنجان/, primary: '/images/menu-hummus.jpg', wikipediaTitle: 'Baba ghanoush' },
  { pattern: /فتوش/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Fattoush' },
  { pattern: /سلطه يونانيه/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Greek salad' },
  { pattern: /سلطه سيزر/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Caesar salad' },
  { pattern: /سلطه جرجير/, primary: '/images/menu-tabbouleh.jpg' },
  { pattern: /سلطه زبادي بالخيار/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Tzatziki' },
  { pattern: /سلطه خضراء/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Salad' },
  { pattern: /بروشيتا/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Bruschetta' },
  { pattern: /مقبلات مشكل/, primary: '/images/menu-warak.jpg', wikipediaTitle: 'Meze' },
  { pattern: /حلومي/, primary: '/images/menu-tabbouleh.jpg', wikipediaTitle: 'Halloumi' },
  { pattern: /سمبوسه/, primary: '/images/menu-warak.jpg', wikipediaTitle: 'Samosa' },
  { pattern: /مطبق/, primary: '/images/menu-warak.jpg', wikipediaTitle: 'مطبق', wikipediaLang: 'ar' },
  { pattern: /شوربه عدس/, primary: '/images/menu-hummus.jpg', wikipediaTitle: 'Lentil soup' },
  { pattern: /صينيه مشويات|مشويات|مشاوي/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Mixed grill' },
  { pattern: /صينيه كبسه/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Kabsa' },
  { pattern: /صينيه مندي/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Mandi (food)' },
  { pattern: /صينيه ورق عنب/, primary: '/images/menu-warak.jpg', wikipediaTitle: 'Dolma' },
  { pattern: /صينيه حلويات|صينيه ميني ساندويتشات/, primary: '/images/gallery-4.jpg' },
  { pattern: /برياني/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Biryani' },
  { pattern: /رز بخاري/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'رز بخاري', wikipediaLang: 'ar' },
  { pattern: /كبسه|مضغوط|مفطح/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Kabsa' },
  { pattern: /مندي/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Mandi (food)' },
  { pattern: /جريش/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'جريش', wikipediaLang: 'ar' },
  { pattern: /قرصان/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'قرصان', wikipediaLang: 'ar' },
  { pattern: /سليق/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'سليق', wikipediaLang: 'ar' },
  { pattern: /حنيذ/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'حنيذ', wikipediaLang: 'ar' },
  { pattern: /مطازيز/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'مطازيز', wikipediaLang: 'ar' },
  { pattern: /مرقوق/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'مرقوق', wikipediaLang: 'ar' },
  { pattern: /مكرونه بشاميل/, primary: '/images/menu-mixed-grill.jpg' },
  { pattern: /اوزي/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'أوزي', wikipediaLang: 'ar' },
  { pattern: /مقلوبه/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Maqluba' },
  { pattern: /شاورما/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Shawarma' },
  { pattern: /ماسالا/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Chicken tikka masala' },
  { pattern: /لازانيا/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Lasagne' },
  { pattern: /الفريدو/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Fettuccine Alfredo' },
  { pattern: /باربكيو/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Barbecue' },
  { pattern: /باييلا/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Paella' },
  { pattern: /بارميزان/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Chicken parmesan' },
  { pattern: /ترياكي/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Teriyaki' },
  { pattern: /صياديه/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'صيادية', wikipediaLang: 'ar' },
  { pattern: /سمك/, primary: '/images/menu-biryani.jpg', wikipediaTitle: 'Fish fillet' },
  { pattern: /روبيان/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'Shrimp and prawn as food' },
  { pattern: /مقلقل/, primary: '/images/menu-mixed-grill.jpg', wikipediaTitle: 'مقلقل', wikipediaLang: 'ar' },
  { pattern: /كنافه/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Kunafa' },
  { pattern: /بقلاوه/, primary: '/images/menu-baklava.jpg', wikipediaTitle: 'Baklava' },
  { pattern: /ام علي/, primary: '/images/menu-ummali.jpg', wikipediaTitle: 'Umm Ali' },
  { pattern: /مهلبيه/, primary: '/images/menu-ummali.jpg', wikipediaTitle: 'Muhallebi' },
  { pattern: /كيك شوكولاته/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Chocolate cake' },
  { pattern: /تيراميسو/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Tiramisu' },
  { pattern: /تشيزكيك/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Cheesecake' },
  { pattern: /براونيز/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Chocolate brownie' },
  { pattern: /كاسات تمر/, primary: '/images/menu-ummali.jpg' },
  { pattern: /ميني كيك/, primary: '/images/menu-kunafa.jpg' },
  { pattern: /ماكرون/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Macaron' },
  { pattern: /تارت فواكه/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Fruit tart' },
  { pattern: /اكلير/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Éclair' },
  { pattern: /كليجا/, primary: '/images/menu-baklava.jpg', wikipediaTitle: 'Kleicha' },
  { pattern: /لقيمات/, primary: '/images/menu-kunafa.jpg', wikipediaTitle: 'Luqaimat' },
  { pattern: /معصوب/, primary: '/images/menu-ummali.jpg', wikipediaTitle: 'معصوب', wikipediaLang: 'ar' },
  { pattern: /حنيني/, primary: '/images/menu-ummali.jpg', wikipediaTitle: 'حنيني', wikipediaLang: 'ar' },
  { pattern: /عصيده التمر/, primary: '/images/menu-ummali.jpg', wikipediaTitle: 'عصيدة', wikipediaLang: 'ar' },
  { pattern: /معمول/, primary: '/images/menu-baklava.jpg', wikipediaTitle: 'Maamoul' },
  { pattern: /دبيازه/, primary: '/images/menu-ummali.jpg', wikipediaTitle: 'دبيازة', wikipediaLang: 'ar' },
  { pattern: /ليمون بالنعناع/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Lemonade' },
  { pattern: /عصير برتقال/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Orange juice' },
  { pattern: /عصير مانجو/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Mango juice' },
  { pattern: /سموذي/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Smoothie' },
  { pattern: /عصير رمان/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Pomegranate juice' },
  { pattern: /عصير استوايي/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Juice' },
  { pattern: /عصير/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Juice' },
  { pattern: /موهيتو/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Mojito' },
  { pattern: /ميلك شيك/, primary: '/images/menu-juices.jpg' },
  { pattern: /ايس ماتشا/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Matcha' },
  { pattern: /قهوه عربيه|قهوه سعوديه/, primary: '/images/menu-coffee.jpg', wikipediaTitle: 'Arabic coffee' },
  { pattern: /ايس لاتيه/, primary: '/images/menu-coffee.jpg', wikipediaTitle: 'Latte' },
  { pattern: /قهوه كولد برو/, primary: '/images/menu-coffee.jpg', wikipediaTitle: 'Cold brew coffee' },
  { pattern: /فرابتشينو/, primary: '/images/menu-coffee.jpg' },
  { pattern: /شاي كرك/, primary: '/images/menu-coffee.jpg', wikipediaTitle: 'Karak' },
  { pattern: /شاي اسود/, primary: '/images/menu-coffee.jpg', wikipediaTitle: 'Black tea' },
  { pattern: /شاي خوخ/, primary: '/images/menu-juices.jpg' },
  { pattern: /سوبيا/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'سوبيا', wikipediaLang: 'ar' },
  { pattern: /لبن عيران/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Ayran' },
  { pattern: /فيمتو/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Vimto' },
  { pattern: /تمر هندي/, primary: '/images/menu-juices.jpg', wikipediaTitle: 'Tamarind' },
  { pattern: /مياه معدنيه/, primary: '/images/menu-juices.jpg' },
]

const getDishImageRule = (item: MenuItem): DishImageRule | null => {
  const normalizedName = normalizeArabicText(item.name)
  return dishImageRules.find((rule) => rule.pattern.test(normalizedName)) ?? null
}

type MenuImageEntry = {
  primary: string
  fallbacks: string[]
}

type MenuImageConfig = MenuImageEntry & {
  wikipediaEndpoint?: string
}

const wikipediaImageCache = new Map<string, string | null>()

const buildWikipediaSummaryEndpoint = (title: string, lang: 'ar' | 'en' = 'en'): string =>
  `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`

const escapeSvgText = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const buildUniqueMenuPlaceholder = (item: MenuItem): string => {
  const palette = categoryPalettes[item.category]
  const title = escapeSvgText(item.name)
  const category = escapeSvgText(categoryLabels[item.category])
  const subtitle = escapeSvgText(`${item.price} ر.س`)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.start}" />
        <stop offset="100%" stop-color="${palette.end}" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)" />
    <circle cx="1020" cy="140" r="180" fill="${palette.accent}" opacity="0.2" />
    <circle cx="180" cy="760" r="220" fill="${palette.accent}" opacity="0.14" />
    <text x="70" y="130" fill="${palette.accent}" font-size="44" font-family="Arial" font-weight="700">ELITE MENU</text>
    <text x="70" y="230" fill="#ffffff" font-size="64" font-family="Arial" font-weight="700">${title}</text>
    <text x="70" y="305" fill="#e5e7eb" font-size="40" font-family="Arial">${category}</text>
    <text x="70" y="370" fill="#ffffff" font-size="40" font-family="Arial">${subtitle}</text>
    <text x="70" y="810" fill="#d1d5db" font-size="28" font-family="Arial">Image ID: ${item.id}</text>
  </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const buildMenuImageFallbacks = (item: MenuItem, primary: string, extraFallbacks: string[] = []): string[] =>
  Array.from(
    new Set([
      ...extraFallbacks,
      ...categoryImageFallbacks[item.category],
      buildUniqueMenuPlaceholder(item),
      FALLBACK_MENU_IMAGE,
    ])
  ).filter((src) => src !== primary)

const menuImageMap: Record<number, MenuImageConfig> = Object.fromEntries(
  allMenuItems.map((item) => {
    const rule = getDishImageRule(item)
    const primary = rule?.primary ?? categoryImageFallbacks[item.category][0]
    return [
      item.id,
      {
        primary,
        fallbacks: buildMenuImageFallbacks(item, primary, rule?.fallbacks),
        wikipediaEndpoint:
          rule?.wikipediaTitle !== undefined
            ? buildWikipediaSummaryEndpoint(rule.wikipediaTitle, rule.wikipediaLang)
            : undefined,
      },
    ]
  })
) as Record<number, MenuImageConfig>

const resolveMenuImageEntry = (item: MenuItem, wikipediaImages: Record<string, string>): MenuImageEntry => {
  const config = menuImageMap[item.id]

  if (!config) {
    const primary = categoryImageFallbacks[item.category][0] ?? FALLBACK_MENU_IMAGE
    return {
      primary,
      fallbacks: buildMenuImageFallbacks(item, primary),
    }
  }

  const primary =
    (config.wikipediaEndpoint ? wikipediaImages[config.wikipediaEndpoint] : undefined) ?? config.primary

  return {
    primary,
    fallbacks: config.fallbacks.filter((src) => src !== primary),
  }
}

const floatingFoodImages = [
  '/images/menu-biryani.jpg',
  '/images/menu-mixed-grill.jpg',
  '/images/menu-kunafa.jpg',
  '/images/menu-juices.jpg',
  '/images/menu-hummus.jpg',
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

type FlyingCartItem = {
  id: string
  image: string
  quantity: number
  startX: number
  startY: number
  endX: number
  endY: number
  size: number
}

export default function Menu() {
  const navigate = useNavigate()
  const cartButtonRef = useRef<HTMLDivElement | null>(null)
  const cartPulseControls = useAnimationControls()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [flyingCartItems, setFlyingCartItems] = useState<FlyingCartItem[]>([])
  const [wikipediaImages, setWikipediaImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Array.from(wikipediaImageCache.entries()).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string'
      )
    )
  )
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  const getCartTargetPoint = () => {
    const viewportFallback = {
      x: Math.max(20, window.innerWidth - 104),
      y: 104,
    }

    const rect = cartButtonRef.current?.getBoundingClientRect()
    if (!rect) {
      return viewportFallback
    }

    const isVisible =
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth

    if (!isVisible) {
      return viewportFallback
    }

    return {
      x: rect.left + rect.width / 2 - 34,
      y: rect.top + rect.height / 2 - 34,
    }
  }

  const triggerCartCelebration = (image: string, quantity: number, sourceEl?: HTMLElement | null) => {
    if (typeof window === 'undefined') {
      return
    }

    const sourceRect = sourceEl?.getBoundingClientRect()
    const size = Math.min(88, Math.max(58, sourceRect?.width ?? 64))
    const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 - size / 2 : window.innerWidth / 2 - size / 2
    const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 - size / 2 : window.innerHeight / 2 - size / 2
    const target = getCartTargetPoint()

    setFlyingCartItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        image,
        quantity,
        startX,
        startY,
        endX: target.x,
        endY: target.y,
        size,
      },
    ])

    void cartPulseControls.start({
      scale: [1, 1.08, 0.95, 1.05, 1],
      rotate: [0, -5, 5, -3, 0],
      boxShadow: [
        '0 0 0 rgba(245,197,66,0)',
        '0 0 32px rgba(245,197,66,0.38)',
        '0 0 16px rgba(245,197,66,0.18)',
        '0 0 28px rgba(245,197,66,0.3)',
        '0 0 0 rgba(245,197,66,0)',
      ],
      transition: {
        duration: 0.75,
        times: [0, 0.2, 0.45, 0.72, 1],
        ease: 'easeInOut',
      },
    })
  }

  const buildOrderDraft = (items: CartItem[]) => ({
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: Date.now(),
  })

  const showAddToCartToast = (item: MenuItem, quantity: number, nextCart: CartItem[]) => {
    toast.custom(
      () => (
        <button
          type="button"
          onClick={() => {
            toast.dismiss()
            proceedToOrderDetails(nextCart)
          }}
          className="group w-[min(92vw,430px)] overflow-hidden rounded-[28px] border border-gold/40 bg-[linear-gradient(135deg,rgba(18,18,18,0.98),rgba(54,38,10,0.96))] p-0 text-right shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="relative shrink-0">
              <img
                src={getMenuImageEntry(item).primary}
                alt={item.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-gold/30"
              />
              <span className="absolute -bottom-1 -left-1 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-dark">
                +{quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-arabic text-base font-bold text-white">تمت إضافة {item.name} إلى السلة</p>
              <p className="mt-1 font-arabicBody text-sm text-white/70">
                اضغط هنا لإكمال خطوات الطلب مباشرة
              </p>
              <div className="mt-2 inline-flex items-center rounded-full bg-gold/15 px-3 py-1 text-xs font-arabic text-gold">
                {nextCart.reduce((sum, entry) => sum + entry.quantity, 0)} عنصر · {buildOrderDraft(nextCart).total} ر.س
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-4 py-3">
            <span className="font-arabic text-sm text-white/65">فتح صفحة الطلب الآن</span>
            <span className="rounded-full bg-gradient-gold px-4 py-1.5 font-arabic text-sm font-bold text-dark">
              أكمل الطلب
            </span>
          </div>
        </button>
      ),
      {
        duration: 5500,
      }
    )
  }

  useEffect(() => {
    const endpointsToFetch = Array.from(
      new Set(
        Object.values(menuImageMap)
          .map((entry) => entry.wikipediaEndpoint)
          .filter((endpoint): endpoint is string =>
            endpoint !== undefined ? !wikipediaImageCache.has(endpoint) : false
          )
      )
    )

    if (endpointsToFetch.length === 0) {
      return
    }

    let isActive = true

    void Promise.all(
      endpointsToFetch.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, {
            headers: {
              accept: 'application/json',
            },
          })

          if (!response.ok) {
            wikipediaImageCache.set(endpoint, null)
            return [endpoint, null] as const
          }

          const data = (await response.json()) as {
            originalimage?: { source?: string }
            thumbnail?: { source?: string }
          }
          const image = data.originalimage?.source ?? data.thumbnail?.source ?? null

          wikipediaImageCache.set(endpoint, image)
          return [endpoint, image] as const
        } catch {
          wikipediaImageCache.set(endpoint, null)
          return [endpoint, null] as const
        }
      })
    ).then((results) => {
      if (!isActive) {
        return
      }

      setWikipediaImages((prev) => {
        const nextEntries = results.filter((result): result is readonly [string, string] => Boolean(result[1]))

        if (nextEntries.length === 0) {
          return prev
        }

        return {
          ...prev,
          ...Object.fromEntries(nextEntries),
        }
      })
    })

    return () => {
      isActive = false
    }
  }, [])

  const getMenuImageEntry = (item: MenuItem): MenuImageEntry =>
    resolveMenuImageEntry(item, wikipediaImages)

  const addAndOptionallyOpenCart = (
    item: MenuItem,
    quantity: number,
    openCartAfterAdd: boolean,
    sourceEl?: HTMLElement | null
  ) => {
    addToCart(item, quantity, sourceEl)
    setSelectedItem(null)
    if (openCartAfterAdd) {
      setIsCartOpen(true)
    }
  }

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const filteredItems = useMemo(
    () =>
      allMenuItems.filter((item) => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      }),
    [activeCategory, searchQuery]
  )

  const relatedItems = useMemo(
    () =>
      selectedItem
        ? allMenuItems.filter((item) => item.category === selectedItem.category && item.id !== selectedItem.id).slice(0, 3)
        : [],
    [selectedItem]
  )

  const getPrepTime = (item: MenuItem): string => {
    switch (item.category) {
      case 'appetizers':
        return '8-12 دقيقة'
      case 'hot':
        return '15-25 دقيقة'
      case 'trays':
        return '45-90 دقيقة'
      case 'desserts':
        return '5-10 دقائق'
      case 'beverages':
        return '2-4 دقائق'
      default:
        return '10 دقائق'
    }
  }

  const openItemDetails = (item: MenuItem) => {
    setSelectedItem(item)
    setSelectedQuantity(1)
  }

  const handleMenuImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget
    const fallbacks = (target.dataset.fallbacks ?? '').split('|').filter(Boolean)
    const currentIndex = Number(target.dataset.fallbackIndex ?? '0')

    if (currentIndex < fallbacks.length) {
      target.src = fallbacks[currentIndex]
      target.dataset.fallbackIndex = String(currentIndex + 1)
      return
    }

    if (target.src !== FALLBACK_MENU_IMAGE) {
      target.src = FALLBACK_MENU_IMAGE
    }
  }

  const buildNextCart = (currentCart: CartItem[], item: MenuItem, quantity: number, image: string) => {
    const existing = currentCart.find((entry) => entry.id === item.id)
    if (existing) {
      return currentCart.map((entry) =>
        entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry
      )
    }

    return [...currentCart, { id: item.id, name: item.name, price: item.price, quantity, image }]
  }

  const addToCart = (item: MenuItem, quantity = 1, sourceEl?: HTMLElement | null) => {
    const imageEntry = getMenuImageEntry(item)
    const nextCart = buildNextCart(cart, item, quantity, imageEntry.primary)

    setCart(nextCart)
    triggerCartCelebration(imageEntry.primary, quantity, sourceEl)
    showAddToCartToast(item, quantity, nextCart)
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => {
      const nextCart = prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)

      if (nextCart.length === 0) {
        localStorage.removeItem(ORDER_DRAFT_KEY)
      }

      return nextCart
    })
  }

  const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(ORDER_DRAFT_KEY)
    setCart([])
    setSelectedItem(null)
    toast.success('تم إفراغ السلة ويمكنك البدء من جديد')
  }

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  const proceedToOrderDetails = (items: CartItem[] = cart) => {
    if (items.length === 0) {
      toast.error('السلة فارغة')
      return
    }

    const draft = buildOrderDraft(items)

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(draft))
    setCart(items)
    setIsCartOpen(false)
    setSelectedItem(null)
    navigate('/booking')
    toast.success('تم نقلك لصفحة بيانات الطلب')
  }

  const openWhatsApp = () => {
    const sentAt = new Date().toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const cartSummary = cart.length
      ? cart
          .map((item, index) => `${index + 1}) ${item.name} - الكمية: ${item.quantity} - الإجمالي: ${item.price * item.quantity} ر.س`)
          .join('\n')
      : '- لا توجد أصناف مضافة حالياً'

    const message = [
      '*طلب عبر واتساب*',
      '',
      '*تفاصيل السلة*',
      cartSummary,
      '',
      `- إجمالي السلة: ${cart.length ? `${cartTotal} ر.س` : '-'}`,
      '',
      '*معلومات الإرسال*',
      `- وقت الإرسال: ${sentAt}`,
      '- التوقيت: الرياض',
      '- المصدر: قائمة الطعام / السلة',
      '',
      'مطلوب: تأكيد التوفر ووقت التنفيذ.',
    ].join('\n')

    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/menu-mixed-grill.jpg')" }}
    >
      <div className="pointer-events-none fixed inset-0 z-[90]">
        <AnimatePresence>
          {flyingCartItems.map((flyingItem) => (
            <motion.div
              key={flyingItem.id}
              initial={{
                left: flyingItem.startX,
                top: flyingItem.startY,
                scale: 0.4,
                opacity: 0,
                rotate: -16,
              }}
              animate={{
                left: [flyingItem.startX, flyingItem.startX + 18, flyingItem.endX],
                top: [flyingItem.startY, flyingItem.startY - 46, flyingItem.endY],
                scale: [0.4, 1.08, 0.35],
                opacity: [0, 1, 1, 0],
                rotate: [-16, 4, 16],
              }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.38, 1],
              }}
              onAnimationComplete={() =>
                setFlyingCartItems((prev) => prev.filter((entry) => entry.id !== flyingItem.id))
              }
              className="absolute"
            >
              <div
                className="relative overflow-hidden rounded-[24px] border border-gold/40 shadow-[0_22px_50px_rgba(0,0,0,0.35)]"
                style={{
                  width: flyingItem.size,
                  height: flyingItem.size,
                }}
              >
                <img
                  src={flyingItem.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-gold/25" />
                <span className="absolute -bottom-1 -left-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-dark">
                  +{flyingItem.quantity}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/30 to-black/60" />
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
            src="/images/menu-biryani.jpg"
            alt="أطباق وليمة سعودية"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/65 to-dark/85" />
          <div className="absolute inset-0 opacity-15">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, rgba(245, 197, 66, 0.16), transparent 28%), radial-gradient(circle at 78% 62%, rgba(255, 255, 255, 0.08), transparent 32%)',
              }}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            {floatingFoodImages.map((src, index) => (
              <motion.img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute w-32 h-32 object-cover rounded-2xl border border-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                style={{
                  right: `${12 + index * 16}%`,
                  top: index % 2 === 0 ? '14%' : '64%',
                }}
                initial={{ opacity: 0, scale: 0.85, rotate: -6 + index * 3 }}
                animate={{
                  opacity: 0.55,
                  y: [0, index % 2 === 0 ? -22 : 22, 0],
                  x: [0, index % 2 === 0 ? 14 : -14, 0],
                  rotate: [-6 + index * 3, -2 + index * 3, -6 + index * 3],
                }}
                transition={{
                  duration: 9 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.6,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-gold text-sm font-arabic mb-4 block">قائمة الطعام</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-arabic">
              تشكيلة <span className="text-gradient-gold">واسعة من الأكلات السعودية</span>
            </h1>
            <p className="text-xl text-white/70 font-arabicBody">
              اكتشف أشهر المأكولات السعودية مع أصناف إضافية تناسب كل الأذواق
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-dark-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن طبق..."
                className="pr-12 bg-dark-700 border-gold/20 text-white placeholder:text-white/40 font-arabic"
              />
            </div>
            <motion.div ref={cartButtonRef} animate={cartPulseControls} className="relative">
              <Button
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic relative overflow-visible"
              >
                <ShoppingCart className="w-5 h-5 ml-2" />
                السلة
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, y: -4, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-arabic transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-gold text-dark'
                    : 'bg-dark-700 text-white/70 hover:bg-dark-600 hover:text-white'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const imageEntry = getMenuImageEntry(item)

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-dark-700/50 rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openItemDetails(item)}>
                      <img
                        src={imageEntry.primary}
                        alt={item.name}
                        data-fallbacks={imageEntry.fallbacks.join('|')}
                        onError={handleMenuImageError}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                      <div className="absolute bottom-3 right-3 bg-gold text-dark px-3 py-1 rounded-full text-sm font-bold font-arabic">
                        {item.price} ر.س
                      </div>
                    </div>

                    <div className="p-5">
                      <h3
                        className="text-lg font-bold text-white mb-2 font-arabic group-hover:text-gold transition-colors cursor-pointer"
                        onClick={() => openItemDetails(item)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-white/50 text-sm font-arabicBody line-clamp-2 mb-4">{item.description}</p>
                      <Button
                        onClick={(event) => addToCart(item, 1, event.currentTarget)}
                        className="w-full bg-gold/10 text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-arabic"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        أضف للسلة
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50 font-arabic text-xl">لا توجد أطباق مطابقة للبحث</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="bg-dark-800 border-gold/20 w-full max-w-[min(520px,calc(100vw-24px))] sm:max-w-3xl px-4 sm:px-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white font-arabic text-right">
              {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="mt-4 grid gap-4 md:gap-6 md:grid-cols-[1.2fr_0.9fr] items-start">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-gold/15">
                  <img
                    src={getMenuImageEntry(selectedItem).primary}
                    alt={selectedItem.name}
                    data-fallbacks={getMenuImageEntry(selectedItem).fallbacks.join('|')}
                    onError={handleMenuImageError}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 md:h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                </div>
                <p className="text-white/80 font-arabicBody text-base md:text-lg">{selectedItem.description}</p>

                <div className="grid sm:grid-cols-2 gap-2 text-sm font-arabic">
                  <span className="px-3 py-2 rounded-xl bg-dark-700/80 border border-gold/15 text-white/80">
                    الفئة: {categoryLabels[selectedItem.category]}
                  </span>
                  <span className="px-3 py-2 rounded-xl bg-dark-700/80 border border-gold/15 text-white/80">
                    الوقت التقريبي: {getPrepTime(selectedItem)}
                  </span>
                  <span className="px-3 py-2 rounded-xl bg-dark-700/80 border border-gold/15 text-white/80">
                    السعرات: {selectedItem.calories}
                  </span>
                  <span className="px-3 py-2 rounded-xl bg-dark-700/80 border border-gold/15 text-white/80">
                    الحصة: {selectedItem.serves}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center bg-dark-700/70 border border-gold/10 rounded-full px-3 py-2">
                    <button
                      type="button"
                      className="text-gold hover:text-white transition-colors px-2"
                      onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-arabic text-lg px-2 min-w-[2ch] text-center">{selectedQuantity}</span>
                    <button
                      type="button"
                      className="text-gold hover:text-white transition-colors px-2"
                      onClick={() => setSelectedQuantity((q) => Math.min(12, q + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-gold font-arabic">{selectedItem.price} ر.س</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  <Button
                    onClick={(event) =>
                      addAndOptionallyOpenCart(selectedItem, selectedQuantity, false, event.currentTarget)
                    }
                    className="w-full bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    أضف واستمر
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gold/40 text-gold hover:bg-gold/10 font-arabic"
                    onClick={(event) =>
                      addAndOptionallyOpenCart(selectedItem, selectedQuantity, true, event.currentTarget)
                    }
                  >
                    أكمل إلى السلة
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-center text-white/70 hover:text-gold font-arabic"
                  onClick={() => {
                    setSelectedItem(null)
                    setIsCartOpen(true)
                  }}
                >
                  الانتقال للسلة الحالية دون إضافة
                </Button>

                {relatedItems.length > 0 && (
                  <div className="mt-4 border-t border-gold/10 pt-4">
                    <h4 className="text-white font-bold mb-3 font-arabic">اقتراحات مشابهة</h4>
                    <div className="space-y-3">
                      {relatedItems.map((related) => {
                        const entry = getMenuImageEntry(related)
                        return (
                          <div
                            key={related.id}
                            className="flex items-center gap-3 bg-dark-700/50 rounded-xl p-3 hover:border hover:border-gold/20 transition"
                          >
                            <img
                              src={entry.primary}
                              alt={related.name}
                              data-fallbacks={entry.fallbacks.join('|')}
                              onError={handleMenuImageError}
                              loading="lazy"
                              decoding="async"
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="text-white font-arabic text-sm">{related.name}</p>
                              <span className="text-gold text-xs">{related.price} ر.س · {getPrepTime(related)}</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gold/15 text-gold hover:bg-gold hover:text-dark font-arabic"
                              onClick={(event) => addToCart(related, 1, event.currentTarget)}
                            >
                              أضف
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="bg-dark-800 border-gold/20 max-w-lg max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white font-arabic text-right">سلة الطلبات</DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 font-arabic">السلة فارغة</p>
            </div>
          ) : (
            <div className="mt-4">
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-dark-700/50 rounded-xl p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      data-fallbacks={(menuImageMap[item.id]?.fallbacks ?? [FALLBACK_MENU_IMAGE]).join('|')}
                      onError={handleMenuImageError}
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-arabic">{item.name}</h4>
                      <span className="text-gold text-sm">{item.price} ر.س</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-arabic">الإجمالي:</span>
                  <span className="text-2xl font-bold text-gold font-arabic">{cartTotal} ر.س</span>
                </div>
                <div className="space-y-3">
                  <Button
                    type="button"
                    className="w-full bg-gradient-gold text-dark hover:shadow-gold-lg font-arabic"
                    onClick={() => proceedToOrderDetails()}
                  >
                    <Mail className="w-5 h-5 ml-2" />
                    استكمال بيانات الطلب
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-500/40 text-green-400 hover:bg-green-500/10 font-arabic"
                    onClick={openWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تواصل عبر واتساب
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-red-500/35 text-red-300 hover:bg-red-500/10 hover:text-red-200 font-arabic"
                    onClick={clearCart}
                  >
                    <Trash2 className="w-5 h-5 ml-2" />
                    إفراغ السلة والبدء من جديد
                  </Button>
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

