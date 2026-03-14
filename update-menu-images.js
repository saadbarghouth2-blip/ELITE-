const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'pages', 'Menu.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const mappings = [
  [/حمص/, 'hummus,arabic,food'],
  [/تبولة/, 'tabbouleh,salad,arabic'],
  [/ورق عنب|عنب/, 'stuffed grape leaves,dolma'],
  [/متبل|بابا غنوج/, 'baba ganoush,eggplant dip'],
  [/فتوش/, 'fattoush salad'],
  [/سلطة خضراء/, 'green salad'],
  [/مشويات|كباب|كفتة|شيش|مشوي/, 'mixed grill,kebab'],
  [/برياني/, 'chicken biryani'],
  [/كبسة/, 'kabsa rice'],
  [/ماسالا/, 'chicken tikka masala'],
  [/سمك/, 'grilled fish fillet'],
  [/روبيان|جمبري/, 'crispy shrimp'],
  [/كنافة/, 'kunafa dessert'],
  [/بقلاوة/, 'baklava'],
  [/ام علي|أم علي/, 'umm ali dessert'],
  [/مهلبية/, 'muhallabia dessert'],
  [/كيك شوكولاتة|شوكولاتة/, 'chocolate cake'],
  [/تيراميسو/, 'tiramisu'],
  [/عصير برتقال/, 'orange juice'],
  [/عصير مانجو/, 'mango juice'],
  [/ليمون بالنعناع/, 'mint lemonade'],
  [/قهوة عربية/, 'arabic coffee'],
  [/شاي أسود/, 'black tea'],
  [/مياه/, 'mineral water'],
  [/سلطة يونانية/, 'greek salad'],
  [/شمندر/, 'beet hummus'],
  [/سيزر/, 'caesar salad'],
  [/بروشيتا/, 'bruschetta'],
  [/مقبلات مشكل/, 'mezze platter'],
  [/حلومي/, 'grilled halloumi'],
  [/مندي/, 'mandi rice'],
  [/شاورما/, 'chicken shawarma'],
  [/لازانيا/, 'lasagna'],
  [/ألفريدو|الفريدو/, 'alfredo pasta'],
  [/أضلاع|باربكيو/, 'bbq ribs'],
  [/باييلا/, 'seafood paella'],
  [/بارميزان/, 'chicken parmesan'],
  [/ترياكي/, 'teriyaki beef'],
  [/تشيزكيك/, 'cheesecake'],
  [/براونيز/, 'brownies'],
  [/تمر/, 'date dessert'],
  [/ميني كيك/, 'mini cakes'],
  [/ماكرون/, 'macarons'],
  [/تارت/, 'fruit tart'],
  [/إكلير/, 'eclair pastry'],
  [/موهيتو/, 'mojito'],
  [/آيس لاتيه|ايس لاتيه/, 'iced latte'],
  [/سموذي/, 'strawberry smoothie'],
  [/رمان/, 'pomegranate juice'],
  [/ماتشا/, 'iced matcha latte'],
  [/استوائي/, 'tropical juice'],
  [/كولد برو/, 'cold brew coffee'],
  [/سمبوسة|سمبوسك/, 'samosa'],
  [/مطبق/, 'mutabbaq'],
  [/جرجير/, 'arugula salad'],
  [/جريش/, 'jareesh saudi dish'],
  [/قرصان/, 'qursan saudi dish'],
  [/سليق/, 'saleeg saudi rice'],
  [/حنيذ/, 'haneeth lamb'],
  [/مضغوط/, 'pressure cooked chicken kabsa'],
  [/مطازيز/, 'matazeez saudi dish'],
  [/رز|أرز/, 'arabic rice dish'],
  [/شوربة/, 'soup'],
  [/سلطة/, 'salad'],
  [/عصير/, 'fresh juice'],
  [/قهوة/, 'coffee'],
  [/شاي/, 'tea'],
];

function queryForName(name) {
  for (const [regex, query] of mappings) {
    if (regex.test(name)) return query;
  }
  return 'arabic food';
}

const replacer = (match, prefix, name, oldUrl, suffix) => {
  const query = queryForName(name);
  const url = `https://source.unsplash.com/1200x900/?${encodeURIComponent(query)}`;
  return `${prefix}${url}${suffix}`;
};

content = content.replace(/(\{[\s\S]*?name:\s*'([^']+)'[\s\S]*?image:\s*')([^']*)(')/g, replacer);

fs.writeFileSync(filePath, content);
console.log('Updated menu images.');
