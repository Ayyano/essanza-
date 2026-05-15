const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wizaodoqmvuyzvzuzvjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpemFvZG9xbXZ1eXp2enV6dmprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg1MzMzNywiZXhwIjoyMDk0NDI5MzM3fQ.LifyyetM6uiaRP6ix5nD6FnivakMqwsyCvJIO3eVVIQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: 'Women Unstitched', slug: 'women-unstitched', description: 'Premium unstitched fabric suits — apne style mein tayar karein', image: '/images/D-14Front_A.jpg', sort_order: 1 },
  { name: 'Women Stitched', slug: 'women-stitched', description: 'Ready-to-wear stitched collection — pehnein aur niklein', image: '/images/MBM-3PW25-07MaroonBack_D.jpg', sort_order: 2 },
  { name: 'Men Stitched', slug: 'men-stitched', description: 'Mard ka style, ESSANZA ka standard', image: '/images/MBMKR-SS26-37MaroonCloseup_E.jpg', sort_order: 3 },
  { name: 'Kids Clothing', slug: 'kids-clothing', description: 'Chotay bachon ke liye premium fashion', image: '/images/mkd-ef21-23-blueb_4c223133-92d3-4ee2-9934-d20710246362.webp', sort_order: 4 },
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets aur electronics', image: '/images/D-14Closeup_E.jpg', sort_order: 5 },
  { name: 'Cosmetics', slug: 'cosmetics', description: 'Khoobsurti ka naya standard', image: '/images/JANEA2601PinkRhodolite_C.webp', sort_order: 6 },
  { name: 'Handbags', slug: 'handbags', description: 'Har outfit ka perfect companion', image: '/images/JSD056GreenOnyx.webp', sort_order: 7 },
  { name: 'Jewelry', slug: 'jewelry', description: 'Nagina har style ke liye', image: '/images/JAN-EA-26-1_Pink_Rhodolite_A.webp', sort_order: 8 },
  { name: 'Kitchenware', slug: 'kitchenware', description: 'Kitchen mein bhi premium feel', image: '/images/D-14Closeup_H.jpg', sort_order: 9 },
  { name: 'Fashion Accessories', slug: 'fashion-accessories', description: 'Chotay details jo bara farq dete hain', image: '/images/JSD056GreenOnyx_d4c39e68-f148-46b2-a0f9-f067d50db5c7.jpg', sort_order: 10 },
  { name: 'Home Essentials', slug: 'home-essentials', description: 'Ghar ko banayein aur bhi khoobsurat', image: '/images/D-14Front_A.jpg', sort_order: 11 },
  { name: 'Bedding', slug: 'bedding', description: 'Neend ka naya standard', image: '/images/D-14Closeup_E.jpg', sort_order: 12 },
  { name: 'Bedsheets', slug: 'bedsheets', description: 'Premium bedsheets for luxury sleep', image: '/images/D-14Closeup_H.jpg', sort_order: 13 },
  { name: 'Pillow Covers', slug: 'pillow-covers', description: 'Chotay details, bara farq', image: '/images/D-14Front_A.jpg', sort_order: 14 },
  { name: 'Men Shoes', slug: 'men-shoes', description: 'Qadam premium rakhein', image: '/images/MBMKR-SS26-37MaroonCloseup_D.webp', sort_order: 15 },
  { name: 'Women Shoes', slug: 'women-shoes', description: 'Har qadam par style', image: '/images/MBM-3PW25-07MaroonCloseup_E.webp', sort_order: 16 },
  { name: 'Kids Shoes', slug: 'kids-shoes', description: 'Chotay qadmon ke liye bara style', image: '/images/mkd-ef21-23-blued_cdcac77e-2686-42a7-91c1-34402a1039e2.webp', sort_order: 17 },
  { name: 'Kids Accessories', slug: 'kids-accessories', description: 'Bachon ke liye pyari accessories', image: '/images/MKDEA2613BlueCloseup_G.webp', sort_order: 18 },
  { name: 'Lifestyle Products', slug: 'lifestyle-products', description: 'ESSANZA lifestyle — har pal premium', image: '/images/JTKEF2501Multicolor1.webp', sort_order: 19 },
];

async function seed() {
  console.log('Seeding database...');

  // Insert categories
  const { data: catData, error: catError } = await supabase.from('categories').upsert(
    categories.map(c => ({ ...c, item_count: 0 })),
    { onConflict: 'slug', ignoreDuplicates: false }
  );
  if (catError) { console.error('Category error:', catError); return; }
  console.log(`Inserted ${categories.length} categories`);

  // Get inserted categories
  const { data: cats } = await supabase.from('categories').select('id, name, slug');
  const catMap = new Map(cats?.map(c => [c.slug, c.id]) || []);

  // Products
  const products = [
    { name: 'ESSANZA Khawab Digital Printed 3-Piece', slug: 'essanza-khawab-digital-printed-3-piece', category: 'women-unstitched', subcategory: 'Digital Print Lawn', description: 'Khawab — jaisay khuwabon mein dekha tha. Silk chiffon fabric with hand-smoked digital print. Dusron ki tarah nahi, ESSANZA ki tarah.', price: 8490, sale_price: 6990, images: ['/images/MBM-3PW25-07MaroonBack_D.jpg', '/images/MBM-3PW25-07MaroonCloseup_E.webp', '/images/MBMKR-SS26-37MaroonCloseup_D.webp'], colors: [{"name":"Maroon","hex":"#800020"},{"name":"Emerald","hex":"#046A38"},{"name":"Royal Blue","hex":"#002366"}], sizes: ['Small','Medium','Large','X-Large'], tags: ['new','trending','bestseller'], rating: 4.8, review_count: 127, stock_quantity: 25, is_new: true, is_trending: true, on_sale: true },
    { name: 'ESSANZA Zari Embroidered Lawn Suit', slug: 'essanza-zari-embroidered-lawn-suit', category: 'women-unstitched', subcategory: 'Embroidered Lawn', description: 'Zari ka kaam jo roshni mein chamkay. Premium lawn fabric with heavy embroidered front. Khaas mauqon ke liye.', price: 12990, sale_price: 9990, images: ['/images/MBM-3PW25-07MaroonCloseup_E.webp', '/images/MBMKR-SS26-37MaroonCloseup_E.jpg'], colors: [{"name":"Gold","hex":"#D4AF37"},{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"}], sizes: ['Small','Medium','Large','X-Large'], tags: ['trending','bestseller'], rating: 4.9, review_count: 89, stock_quantity: 15, is_new: false, is_trending: true, on_sale: true },
    { name: 'ESSANZA Mehrun Embroidered Chiffon', slug: 'essanza-mehrun-embroidered-chiffon', category: 'women-unstitched', subcategory: 'Chiffon Collection', description: 'Mehrun — ek alag ehsaas. Heavy embroidered chiffon suit with digital printed bottom. Har jaga nazar ruk jaye.', price: 15990, sale_price: 12990, images: ['/images/MBMKR-SS26-37MaroonCloseup_E.jpg', '/images/MBM-3PW25-07MaroonBack_D.jpg'], colors: [{"name":"Red","hex":"#DC143C"},{"name":"Teal","hex":"#008080"}], sizes: ['Medium','Large','X-Large'], tags: ['new','premium'], rating: 4.7, review_count: 64, stock_quantity: 10, is_new: true, is_trending: false, on_sale: true },
    { name: 'ESSANZA Sitara Digital Printed Suit', slug: 'essanza-sitara-digital-printed-suit', category: 'women-unstitched', subcategory: 'Digital Print', description: 'Sitara — jaise aasman se utara ho. Modern digital print on soft lawn fabric. Daily wear ke liye perfect.', price: 5990, images: ['/images/MBMKR-SS26-37MaroonCloseup_D.webp', '/images/MBM-3PW25-07MaroonCloseup_E.webp'], colors: [{"name":"Sky Blue","hex":"#87CEEB"},{"name":"Pink","hex":"#FFB6C1"},{"name":"Mint","hex":"#98FB98"}], sizes: ['Small','Medium','Large','X-Large'], tags: ['new','trending'], rating: 4.6, review_count: 203, stock_quantity: 50, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Nasha Organza Suit', slug: 'essanza-nasha-organza-suit', category: 'women-unstitched', subcategory: 'Organza Collection', description: 'Nasha — jis mein kho jaayein. Pure organza fabric with hand-smoked details.', price: 18990, sale_price: 15990, images: ['/images/D-14Front_A.jpg', '/images/D-14Closeup_E.jpg'], colors: [{"name":"Peach","hex":"#FFDAB9"},{"name":"Lavender","hex":"#DBBADD"}], sizes: ['Medium','Large'], tags: ['premium','new'], rating: 4.9, review_count: 42, stock_quantity: 8, is_new: true, is_trending: false, on_sale: true },
    { name: 'ESSANZA Aqsa Stitched Collection', slug: 'essanza-aqsa-stitched-collection', category: 'women-stitched', subcategory: 'Ready to Wear', description: 'Ready to wear — bas pehnein aur niklein. Premium fabric with trendy design.', price: 8490, images: ['/images/JAN-EA-26-1_Pink_Rhodolite_A.webp', '/images/JANEA2601PinkRhodolite_C.webp'], colors: [{"name":"Pink","hex":"#FF69B4"},{"name":"Navy","hex":"#000080"}], sizes: ['Small','Medium','Large','X-Large'], tags: ['bestseller','trending'], rating: 4.5, review_count: 156, stock_quantity: 30, is_new: false, is_trending: true, on_sale: false },
    { name: 'ESSANZA Sapphire Stitched Formal', slug: 'essanza-sapphire-stitched-formal', category: 'women-stitched', subcategory: 'Formal Wear', description: 'Formal mauqon ke liye perfect stitched ensemble.', price: 12490, sale_price: 9990, images: ['/images/JKTEF2602PinkChatham_C.jpg', '/images/JAN-EA-26-1_Pink_Rhodolite_A.webp'], colors: [{"name":"Sapphire","hex":"#0F52BA"},{"name":"Black","hex":"#000000"}], sizes: ['Small','Medium','Large'], tags: ['new','premium'], rating: 4.4, review_count: 78, stock_quantity: 12, is_new: true, is_trending: false, on_sale: true },
    { name: 'ESSANZA Classic Khaddar Stitched', slug: 'essanza-classic-khaddar-stitched', category: 'women-stitched', subcategory: 'Winter Collection', description: 'Winter vibes with premium khaddar fabric.', price: 6990, images: ['/images/78e955a7-4a60-4860-baf6-6aa19ad0271d.JPG'], sizes: ['Small','Medium','Large','X-Large'], tags: ['bestseller'], rating: 4.3, review_count: 234, stock_quantity: 45, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Pearl Embroidered Stitched', slug: 'essanza-pearl-embroidered-stitched', category: 'women-stitched', subcategory: 'Party Wear', description: 'Pearl embroidery jo har kisi ki nazar apni taraf khinchay.', price: 15990, images: ['/images/9900481c-b835-4509-89aa-3da1530c112c.JPG'], colors: [{"name":"White Pearl","hex":"#F5F5F5"},{"name":"Gold","hex":"#D4AF37"}], sizes: ['Medium','Large','X-Large'], tags: ['premium','new'], rating: 4.8, review_count: 56, stock_quantity: 7, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Sherwani Collection', slug: 'essanza-sherwani-collection', category: 'men-stitched', subcategory: 'Wedding Wear', description: 'Shaadi ka style ESSANZA jaisa. Premium sherwani for groom and guests.', price: 24990, sale_price: 19990, images: ['/images/MBMKR-SS26-37MaroonCloseup_D.webp', '/images/MBMKR-SS26-37MaroonCloseup_E.jpg'], colors: [{"name":"Maroon","hex":"#800020"},{"name":"Black","hex":"#000000"},{"name":"Navy","hex":"#000080"}], sizes: ['Medium','Large','X-Large','XX-Large'], tags: ['new','premium','bestseller'], rating: 4.9, review_count: 89, stock_quantity: 20, is_new: true, is_trending: true, on_sale: true },
    { name: 'ESSANZA Executive Shirt Collection', slug: 'essanza-executive-shirt-collection', category: 'men-stitched', subcategory: 'Formal Shirts', description: 'Office ke liye premium formal shirts.', price: 4990, images: ['/images/MBM-3PW25-07MaroonBack_D.jpg', '/images/MBM-3PW25-07MaroonCloseup_E.webp'], colors: [{"name":"White","hex":"#FFFFFF"},{"name":"Blue","hex":"#0F52BA"}], sizes: ['Small','Medium','Large','X-Large','XX-Large'], tags: ['bestseller','trending'], rating: 4.4, review_count: 312, stock_quantity: 100, is_new: false, is_trending: true, on_sale: false },
    { name: 'ESSANZA Casual Kurta Shalwar', slug: 'essanza-casual-kurta-shalwar', category: 'men-stitched', subcategory: 'Casual Wear', description: 'Rozana style ke liye comfortable kurta shalwar.', price: 3990, images: ['/images/c8bd98e3-024d-4954-acf8-f7d1ad496230.JPG'], sizes: ['Small','Medium','Large','X-Large'], tags: ['bestseller'], rating: 4.2, review_count: 445, stock_quantity: 80, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Kids Festive Wear', slug: 'essanza-kids-festive-wear', category: 'kids-clothing', subcategory: 'Festive Collection', description: 'Eid aur khaas mauqon ke liye pyari outfit.', price: 3490, sale_price: 2990, images: ['/images/mkd-ef21-23-blueb_4c223133-92d3-4ee2-9934-d20710246362.webp', '/images/mkd-ef21-23-blued_cdcac77e-2686-42a7-91c1-34402a1039e2.webp'], colors: [{"name":"Blue","hex":"#4169E1"},{"name":"Green","hex":"#046A38"}], sizes: ['2-3Y','3-4Y','4-5Y','5-6Y','6-7Y'], tags: ['new','trending'], rating: 4.7, review_count: 67, stock_quantity: 35, is_new: true, is_trending: true, on_sale: true },
    { name: 'ESSANZA Kids Casual Collection', slug: 'essanza-kids-casual-collection', category: 'kids-clothing', subcategory: 'Casual Wear', description: 'Rozana pehnein ke liye comfortable kids wear.', price: 2490, images: ['/images/MKDEA2613BlueCloseup_G.webp', '/images/MKDEA2613BlueFront_A.webp'], colors: [{"name":"Sky Blue","hex":"#87CEEB"},{"name":"Pink","hex":"#FFB6C1"}], sizes: ['2-3Y','3-4Y','4-5Y','5-6Y'], tags: ['bestseller','trending'], rating: 4.5, review_count: 189, stock_quantity: 60, is_new: false, is_trending: true, on_sale: false },
    { name: 'ESSANZA Kids Party Wear Set', slug: 'essanza-kids-party-wear-set', category: 'kids-clothing', subcategory: 'Party Wear', description: 'Chotay se party animals ke liye stylish wear.', price: 4490, images: ['/images/mkd-ef21-23-blueb_4c223133-92d3-4ee2-9934-d20710246362.webp'], colors: [{"name":"Red","hex":"#DC143C"},{"name":"Blue","hex":"#4169E1"}], sizes: ['3-4Y','4-5Y','5-6Y','6-7Y'], tags: ['new'], rating: 4.6, review_count: 45, stock_quantity: 20, is_new: true, is_trending: false, on_sale: false },
    { name: 'ESSANZA Wireless Earbuds Pro', slug: 'essanza-wireless-earbuds-pro', category: 'electronics', subcategory: 'Audio', description: 'Premium sound quality with active noise cancellation.', price: 5990, sale_price: 4490, images: ['/images/D-14Closeup_E.jpg'], tags: ['trending','new'], rating: 4.3, review_count: 234, stock_quantity: 50, is_new: true, is_trending: true, on_sale: true },
    { name: 'ESSANZA Power Bank 20000mAh', slug: 'essanza-power-bank-20000mah', category: 'electronics', subcategory: 'Accessories', description: 'High capacity power bank for all-day charging.', price: 3990, images: ['/images/D-14Closeup_H.jpg'], tags: ['bestseller'], rating: 4.2, review_count: 167, stock_quantity: 40, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Flawless Foundation', slug: 'essanza-flawless-foundation', category: 'cosmetics', subcategory: 'Makeup Base', description: 'Flawless skin ka raaz. Premium foundation for all skin types.', price: 1990, images: ['/images/JANEA2601PinkRhodolite_C.webp'], colors: [{"name":"Ivory","hex":"#FFFFF0"},{"name":"Beige","hex":"#F5F5DC"},{"name":"Tan","hex":"#D2B48C"}], tags: ['new','trending'], rating: 4.4, review_count: 89, stock_quantity: 75, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Velvet Matte Lipstick', slug: 'essanza-velvet-matte-lipstick', category: 'cosmetics', subcategory: 'Lips', description: 'Velvet smooth matte lipstick jo din bhar tikay.', price: 1290, images: ['/images/JAN-EA-26-1_Pink_Rhodolite_A.webp'], colors: [{"name":"Red","hex":"#DC143C"},{"name":"Nude","hex":"#C9B1A0"}], tags: ['bestseller','trending'], rating: 4.6, review_count: 345, stock_quantity: 100, is_new: false, is_trending: true, on_sale: false },
    { name: 'ESSANZA Kajal Extreme', slug: 'essanza-kajal-extreme', category: 'cosmetics', subcategory: 'Eyes', description: 'Kajal jo aankhon ki baat kare. Waterproof and long-lasting.', price: 890, images: ['/images/JSD056GreenOnyx.webp'], tags: ['bestseller'], rating: 4.7, review_count: 567, stock_quantity: 200, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Rose Water Mist', slug: 'essanza-rose-water-mist', category: 'cosmetics', subcategory: 'Skincare', description: 'Freshness ka ek spray. Natural rose water for glowing skin.', price: 690, images: ['/images/9900481c-b835-4509-89aa-3da1530c112c.JPG'], tags: ['new','trending'], rating: 4.5, review_count: 123, stock_quantity: 150, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Premium Tote Bag', slug: 'essanza-premium-tote-bag', category: 'handbags', subcategory: 'Tote Bags', description: 'Har outfit ka perfect companion. Premium tote with ample space.', price: 5490, images: ['/images/JSD056GreenOnyx_d4c39e68-f148-46b2-a0f9-f067d50db5c7.jpg'], colors: [{"name":"Tan","hex":"#D2B48C"},{"name":"Black","hex":"#000000"}], tags: ['new','trending'], rating: 4.5, review_count: 78, stock_quantity: 25, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Crossbody Bag', slug: 'essanza-crossbody-bag', category: 'handbags', subcategory: 'Crossbody', description: 'Hands-free style ke liye trendy crossbody bag.', price: 4490, sale_price: 3990, images: ['/images/JSD056GreenOnyx.webp'], colors: [{"name":"Brown","hex":"#8B4513"},{"name":"Black","hex":"#000000"}], tags: ['bestseller'], rating: 4.3, review_count: 145, stock_quantity: 30, is_new: false, is_trending: false, on_sale: true },
    { name: 'ESSANZA Gold Plated Earrings', slug: 'essanza-gold-plated-earrings', category: 'jewelry', subcategory: 'Earrings', description: 'Gold plated earrings jo chamkayein aapka chehra.', price: 2990, images: ['/images/JAN-EA-26-1_Pink_Rhodolite_A.webp', '/images/JANEA2601PinkRhodolite_C.webp'], tags: ['trending','new'], rating: 4.7, review_count: 89, stock_quantity: 40, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Kundan Necklace Set', slug: 'essanza-kundan-necklace-set', category: 'jewelry', subcategory: 'Necklace', description: 'Traditional kundan set for weddings and festivities.', price: 12990, sale_price: 9990, images: ['/images/JKTEF2602PinkChatham_C.jpg'], tags: ['premium','bestseller'], rating: 4.9, review_count: 56, stock_quantity: 10, is_new: false, is_trending: true, on_sale: true },
    { name: 'ESSANZA Pearl Bracelet', slug: 'essanza-pearl-bracelet', category: 'jewelry', subcategory: 'Bracelets', description: 'Elegant pearl bracelet for daily elegance.', price: 1990, images: ['/images/JTKEF2501Multicolor1.webp'], tags: ['new'], rating: 4.4, review_count: 67, stock_quantity: 45, is_new: true, is_trending: false, on_sale: false },
    { name: 'ESSANZA Non-Stick Fry Pan', slug: 'essanza-non-stick-fry-pan', category: 'kitchenware', subcategory: 'Cookware', description: 'Premium non-stick pan for perfect cooking.', price: 2990, sale_price: 2490, images: ['/images/D-14Front_A.jpg'], tags: ['bestseller'], rating: 4.5, review_count: 234, stock_quantity: 60, is_new: false, is_trending: false, on_sale: true },
    { name: 'ESSANZA Kitchen Knife Set', slug: 'essanza-kitchen-knife-set', category: 'kitchenware', subcategory: 'Cutlery', description: 'Professional grade knife set for every chef.', price: 3990, images: ['/images/D-14Closeup_H.jpg'], tags: ['new'], rating: 4.3, review_count: 89, stock_quantity: 35, is_new: true, is_trending: false, on_sale: false },
    { name: 'ESSANZA Ceramic Mug Set', slug: 'essanza-ceramic-mug-set', category: 'kitchenware', subcategory: 'Tableware', description: 'Set of 6 premium ceramic mugs for your daily chai.', price: 1990, images: ['/images/D-14Closeup_E.jpg'], colors: [{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"}], tags: ['trending'], rating: 4.6, review_count: 156, stock_quantity: 80, is_new: false, is_trending: true, on_sale: false },
    { name: 'ESSANZA Silk Scarf', slug: 'essanza-silk-scarf', category: 'fashion-accessories', subcategory: 'Scarves', description: 'Pure silk scarf jo style mein char chaand laga de.', price: 2990, images: ['/images/JSD056GreenOnyx_d4c39e68-f148-46b2-a0f9-f067d50db5c7.jpg'], colors: [{"name":"Red","hex":"#DC143C"},{"name":"Blue","hex":"#4169E1"}], tags: ['new','trending'], rating: 4.5, review_count: 67, stock_quantity: 30, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Leather Belt', slug: 'essanza-leather-belt', category: 'fashion-accessories', subcategory: 'Belts', description: 'Genuine leather belt for premium looks.', price: 2490, images: ['/images/MBM-3PW25-07MaroonCloseup_E.webp'], tags: ['bestseller'], rating: 4.4, review_count: 234, stock_quantity: 100, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Aviator Sunglasses', slug: 'essanza-aviator-sunglasses', category: 'fashion-accessories', subcategory: 'Eyewear', description: 'Aviator style sunglasses with UV protection.', price: 3490, sale_price: 2990, images: ['/images/MBMKR-SS26-37MaroonCloseup_E.jpg'], tags: ['trending'], rating: 4.3, review_count: 123, stock_quantity: 50, is_new: false, is_trending: true, on_sale: true },
    { name: 'ESSANZA Cashmere Beanie', slug: 'essanza-cashmere-beanie', category: 'fashion-accessories', subcategory: 'Winter Accessories', description: 'Premium cashmere beanie for winters.', price: 1990, images: ['/images/78e955a7-4a60-4860-baf6-6aa19ad0271d.JPG'], colors: [{"name":"Black","hex":"#000000"},{"name":"Gray","hex":"#808080"}], tags: ['new'], rating: 4.2, review_count: 45, stock_quantity: 40, is_new: true, is_trending: false, on_sale: false },
    { name: 'ESSANZA Scented Candle Collection', slug: 'essanza-scented-candle-collection', category: 'home-essentials', subcategory: 'Decor', description: 'Ghar ko mehka dein ESSANZA scented candles se.', price: 1490, images: ['/images/ca403492-4291-471c-b356-ab6df2875135.JPG'], tags: ['new','trending'], rating: 4.7, review_count: 89, stock_quantity: 60, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Premium Comforter', slug: 'essanza-premium-comforter', category: 'bedding', subcategory: 'Comforters', description: 'Garm aur luxurious comforter for perfect sleep.', price: 8990, sale_price: 7490, images: ['/images/D-14Front_A.jpg'], tags: ['bestseller','trending'], rating: 4.6, review_count: 178, stock_quantity: 25, is_new: false, is_trending: true, on_sale: true },
    { name: 'ESSANZA Cotton Bedsheet Set', slug: 'essanza-cotton-bedsheet-set', category: 'bedsheets', subcategory: 'Cotton', description: 'Pure cotton bedsheet for soft and comfy sleep.', price: 3990, images: ['/images/D-14Closeup_E.jpg'], colors: [{"name":"White","hex":"#FFFFFF"},{"name":"Blue","hex":"#4169E1"}], sizes: ['Single','Double','Queen','King'], tags: ['bestseller'], rating: 4.5, review_count: 345, stock_quantity: 80, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Embroidered Pillow Set', slug: 'essanza-embroidered-pillow-set', category: 'pillow-covers', subcategory: 'Decorative', description: 'Hand embroidered pillow covers for luxury decor.', price: 2490, images: ['/images/D-14Closeup_H.jpg'], tags: ['new','trending'], rating: 4.6, review_count: 67, stock_quantity: 30, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Formal Loafers', slug: 'essanza-formal-loafers', category: 'men-shoes', subcategory: 'Formal Shoes', description: 'Premium formal loafers for office and events.', price: 6990, images: ['/images/MBMKR-SS26-37MaroonCloseup_D.webp'], colors: [{"name":"Black","hex":"#000000"},{"name":"Brown","hex":"#8B4513"}], sizes: ['40','41','42','43','44'], tags: ['bestseller'], rating: 4.4, review_count: 156, stock_quantity: 50, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Sports Sneakers', slug: 'essanza-sports-sneakers', category: 'men-shoes', subcategory: 'Casual Shoes', description: 'Trendy sneakers for everyday wear.', price: 7990, sale_price: 6490, images: ['/images/MBM-3PW25-07MaroonBack_D.jpg'], colors: [{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"}], sizes: ['40','41','42','43','44'], tags: ['trending','new'], rating: 4.3, review_count: 89, stock_quantity: 35, is_new: true, is_trending: true, on_sale: true },
    { name: 'ESSANZA Heeled Sandals', slug: 'essanza-heeled-sandals', category: 'women-shoes', subcategory: 'Heels', description: 'Elegant heeled sandals for parties and events.', price: 5990, images: ['/images/MBM-3PW25-07MaroonCloseup_E.webp'], colors: [{"name":"Gold","hex":"#D4AF37"},{"name":"Black","hex":"#000000"}], sizes: ['36','37','38','39','40'], tags: ['trending','new'], rating: 4.5, review_count: 123, stock_quantity: 30, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Ballet Flats', slug: 'essanza-ballet-flats', category: 'women-shoes', subcategory: 'Flats', description: 'Comfortable ballet flats for everyday elegance.', price: 3990, images: ['/images/MBMKR-SS26-37MaroonCloseup_E.jpg'], colors: [{"name":"Nude","hex":"#C9B1A0"},{"name":"Black","hex":"#000000"}], sizes: ['36','37','38','39','40'], tags: ['bestseller'], rating: 4.2, review_count: 267, stock_quantity: 60, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Kids Sparkle Shoes', slug: 'essanza-kids-sparkle-shoes', category: 'kids-shoes', subcategory: 'Casual', description: 'Sparkly shoes jo bachon ko bohot pasand aayein gi.', price: 2990, images: ['/images/mkd-ef21-23-blued_cdcac77e-2686-42a7-91c1-34402a1039e2.webp'], sizes: ['Kids-10','Kids-11','Kids-12','Kids-13'], tags: ['new'], rating: 4.6, review_count: 78, stock_quantity: 40, is_new: true, is_trending: false, on_sale: false },
    { name: 'ESSANZA Kids Sandals', slug: 'essanza-kids-sandals', category: 'kids-shoes', subcategory: 'Sandals', description: 'Comfortable sandals for active kids.', price: 1990, images: ['/images/MKDEA2613BlueFront_A.webp'], colors: [{"name":"Blue","hex":"#4169E1"},{"name":"Pink","hex":"#FF69B4"}], sizes: ['Kids-10','Kids-11','Kids-12'], tags: ['bestseller'], rating: 4.3, review_count: 156, stock_quantity: 55, is_new: false, is_trending: false, on_sale: false },
    { name: 'ESSANZA Kids Hair Accessories', slug: 'essanza-kids-hair-accessories', category: 'kids-accessories', subcategory: 'Hair', description: 'Pyari hair accessories for little princesses.', price: 890, images: ['/images/MKDEA2613BlueCloseup_G.webp'], tags: ['new','trending'], rating: 4.5, review_count: 89, stock_quantity: 100, is_new: true, is_trending: true, on_sale: false },
    { name: 'ESSANZA Premium Notebook', slug: 'essanza-premium-notebook', category: 'lifestyle-products', subcategory: 'Stationery', description: 'Premium leather-bound notebook for daily journaling.', price: 2490, images: ['/images/JTKEF2501Multicolor1.webp'], colors: [{"name":"Black","hex":"#000000"},{"name":"Brown","hex":"#8B4513"}], tags: ['new'], rating: 4.4, review_count: 45, stock_quantity: 40, is_new: true, is_trending: false, on_sale: false },
  ];

  for (const product of products) {
    const categoryId = catMap.get(product.category);
    if (!categoryId) {
      console.error(`Category not found for product: ${product.name}, category: ${product.category}`);
      continue;
    }
    const { error } = await supabase.from('products').upsert({
      name: product.name,
      slug: product.slug,
      category_id: categoryId,
      subcategory: product.subcategory,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price || null,
      images: product.images,
      colors: product.colors || [],
      sizes: product.sizes || [],
      tags: product.tags,
      rating: product.rating,
      review_count: product.review_count,
      stock_quantity: product.stock_quantity,
      in_stock: product.stock_quantity > 0,
      is_new: product.is_new,
      is_trending: product.is_trending,
      on_sale: !!product.sale_price,
      is_active: true,
    }, { onConflict: 'slug', ignoreDuplicates: false });
    if (error) console.error(`Product error: ${product.name}: ${error.message}`);
  }
  console.log(`Inserted/updated ${products.length} products`);

  // Update category item counts
  for (const [slug, id] of catMap) {
    const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('category_id', id).eq('is_active', true);
    if (count !== null) {
      await supabase.from('categories').update({ item_count: count }).eq('id', id);
    }
  }
  console.log('Updated category counts');

  // Insert banners
  const banners = [
    { title: 'New Collection 2026', subtitle: 'Har style ka apna ESSANZA — jo dekho dil aa gaya', cta: 'Shop Now', image: '/images/MBM-3PW25-07MaroonBack_D.jpg', link: '/shop/new-arrivals', sort_order: 1 },
    { title: 'Premium Unstitched', subtitle: 'Apne style mein tayar karein — fabric jo mehsoos karein', cta: 'Explore Collection', image: '/images/MBM-3PW25-07MaroonCloseup_E.webp', link: '/shop/women-unstitched', sort_order: 2 },
    { title: 'Trending Now', subtitle: 'Jo sab le rahe hain — ESSANZA trending collection', cta: 'View Trending', image: '/images/MBMKR-SS26-37MaroonCloseup_D.webp', link: '/trending', sort_order: 3 },
  ];
  for (const banner of banners) {
    await supabase.from('banners').upsert(banner, { onConflict: 'title', ignoreDuplicates: false });
  }
  console.log('Inserted banners');

  // Insert testimonials
  const testimonials = [
    { name: 'Ayesha Khan', location: 'Karachi', text: 'Mashallah! Bohot khoobsurat fabric hai. Color exactly jaisa website par tha. Delivery bhi time pe aa gayi. ESSANZA ka standard hamesha top class.', rating: 5 },
    { name: 'Fatima Ali', location: 'Lahore', text: 'Quality aik dum zabardast hai. Main ne ghar walon ke liye bhi mangwaya hai. Sab bohot impressed hain.', rating: 5 },
    { name: 'Sana Tariq', location: 'Islamabad', text: 'Fabric bohot soft hai aur embroidery ka kaam fine hai. Value for money hai. Definitely recommend karti hoon.', rating: 4 },
    { name: 'Zara Malik', location: 'Faisalabad', text: 'Pehli baar ESSANZA se mangwaya hai aur bohot khush hoon. Fit perfect hai aur COD ka option hai toh tension nahi.', rating: 5 },
    { name: 'Hira Shah', location: 'Rawalpindi', text: 'Design waisa hi hai jaise photos mein dikh raha tha. Bohot elegant hai.', rating: 4 },
    { name: 'Mahnoor Sheikh', location: 'Multan', text: 'Eid ke liye liya tha aur sab ne bohot tareef ki. Bina naap ke silwai bhi perfect aayi.', rating: 5 },
    { name: 'Sarah Ahmed', location: 'Karachi', text: 'ESSANZA se ab tak kai baar order kar chuki hoon. Har baar quality ne impress kiya hai.', rating: 5 },
    { name: 'Hira Nasir', location: 'Lahore', text: 'Bohot acchi shopping experience thi. Website easy hai aur delivery fast.', rating: 4 },
  ];
  for (const t of testimonials) {
    await supabase.from('testimonials').upsert(t, { onConflict: 'name', ignoreDuplicates: false });
  }
  console.log('Inserted testimonials');

  console.log('Database seeded successfully!');
}

seed().catch(console.error);
