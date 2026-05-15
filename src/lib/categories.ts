import { Category } from "@/types";
import { slugify } from "@/lib/utils";

export const categories: Category[] = [
  {
    id: "cat-001",
    name: "Women Unstitched",
    slug: slugify("Women Unstitched"),
    image: "/images/MBM-3PW25-07MaroonBack_D.jpg",
    description:
      "Jissay pehno toh log poochain ye kahan se mila. ESSANZA ka unstitched collection — digital print lawn se le kar heavy embroidered chiffon tak. Khud tailor se silwao aur perfect fit pao. Har kapray mein mohabbat hai.",
    itemCount: 5,
    subcategories: [
      { name: "Digital Print Lawn", slug: slugify("Digital Print Lawn") },
      { name: "Embroidered Lawn", slug: slugify("Embroidered Lawn") },
      { name: "Chiffon Collection", slug: slugify("Chiffon Collection") },
      { name: "Organza Collection", slug: slugify("Organza Collection") },
    ],
  },
  {
    id: "cat-002",
    name: "Women Stitched",
    slug: slugify("Women Stitched"),
    image: "/images/ca403492-4291-471c-b356-ab6df2875135.JPG",
    description:
      "Ready to wear jo aapko fit aaye bilkul perfect. Kabhi tailor ki tension nahi, bas ESSANZA ka charm. Party wear se formal tak — har mood ke liye kuch na kuch hai.",
    itemCount: 4,
    subcategories: [
      { name: "Ready to Wear", slug: slugify("Ready to Wear") },
      { name: "Party Collection", slug: slugify("Party Collection") },
      { name: "Formals", slug: slugify("Formals") },
      { name: "Embroidered Stitched", slug: slugify("Embroidered Stitched") },
    ],
  },
  {
    id: "cat-003",
    name: "Men Stitched",
    slug: slugify("Men Stitched"),
    image: "/images/JTK_EF25_01_Multi_Color.jpg",
    description:
      "Mard ko ESSANZA ki zaroorat hai. Stitched kurta shalwar, casual shirts, aur formal wear — sab kuch ek jagah. Fit perfect, look smart, feel ESSANZA.",
    itemCount: 3,
    subcategories: [
      { name: "Kurta Shalwar", slug: slugify("Kurta Shalwar") },
      { name: "Premium Stitched", slug: slugify("Premium Stitched") },
      { name: "Casuals", slug: slugify("Casuals") },
    ],
  },
  {
    id: "cat-004",
    name: "Kids Clothing",
    slug: slugify("Kids Clothing"),
    image: "/images/9900481c-b835-4509-89aa-3da1530c112c.JPG",
    description:
      "Chotay nawab aur choti pariyon ke liye ESSANZA ka collection. Soft fabric, bright colors, aur comfortable fit jo bachon ko pasand aaye. Ghar se le kar party tak.",
    itemCount: 3,
    subcategories: [
      { name: "Boys Stitched", slug: slugify("Boys Stitched") },
      { name: "Girls Stitched", slug: slugify("Girls Stitched") },
      { name: "Casuals", slug: slugify("Casuals") },
    ],
  },
  {
    id: "cat-005",
    name: "Electronics",
    slug: slugify("Electronics"),
    image: "/images/D-14Closeup_E.jpg",
    description:
      "Tech jo aap ki zindagi ko aasaan kar de. ESSANZA ke electronics mein hai quality, style aur performance. Bluetooth speakers se earbuds tak — sab kuch ek jagah.",
    itemCount: 2,
    subcategories: [
      { name: "Audio", slug: slugify("Audio") },
    ],
  },
  {
    id: "cat-006",
    name: "Cosmetics",
    slug: slugify("Cosmetics"),
    image: "/images/JANEA2601PinkRhodolite_C.webp",
    description:
      "Khoobsurti ESSANZA ke saath. Makeup, skincare aur fragrances — jo aap ki beauty ko complete kare. Premium products jo aap ko dein glow wala feel.",
    itemCount: 4,
    subcategories: [
      { name: "Skincare", slug: slugify("Skincare") },
      { name: "Makeup", slug: slugify("Makeup") },
      { name: "Fragrances", slug: slugify("Fragrances") },
    ],
  },
  {
    id: "cat-007",
    name: "Handbags",
    slug: slugify("Handbags"),
    image: "/images/mkd-ef21-23-blueb_4c223133-92d3-4ee2-9934-d20710246362.webp",
    description:
      "Jahan ESSANZA ka handbag ho, wahan style ki koi kami nahi. Tote bags, clutches — har outfit ke liye ek perfect match. Carry your world with ESSANZA.",
    itemCount: 2,
    subcategories: [
      { name: "Tote Bags", slug: slugify("Tote Bags") },
      { name: "Clutches", slug: slugify("Clutches") },
    ],
  },
  {
    id: "cat-008",
    name: "Jewelry",
    slug: slugify("Jewelry"),
    image: "/images/JSD056GreenOnyx.webp",
    description:
      "Chamak ESSANZA ka, style aap ka. Earrings, necklaces, aur bangles — har mehfil mein alag dikhne ke liye. Gold-plated, silver aur crystal — choose your shine.",
    itemCount: 3,
    subcategories: [
      { name: "Earrings", slug: slugify("Earrings") },
      { name: "Necklaces", slug: slugify("Necklaces") },
      { name: "Bangles", slug: slugify("Bangles") },
    ],
  },
  {
    id: "cat-009",
    name: "Kitchenware",
    slug: slugify("Kitchenware"),
    image: "/images/78e955a7-4a60-4860-baf6-6aa19ad0271d.JPG",
    description:
      "ESSANZA ke saath kitchen mein utaro toh khana banaye maze aata hai. Dinner sets, cookware, aur mugs — jo aap ki table ko dein shahi andaaz.",
    itemCount: 3,
    subcategories: [
      { name: "Dinner Sets", slug: slugify("Dinner Sets") },
      { name: "Mugs", slug: slugify("Mugs") },
      { name: "Cookware", slug: slugify("Cookware") },
    ],
  },
  {
    id: "cat-010",
    name: "Fashion Accessories",
    slug: slugify("Fashion Accessories"),
    image: "/images/D-14Closeup_H.jpg",
    description:
      "Accessories woh chotay motay items hain jo outfit ko complete karte hain. Sunglasses, watches, belts, scarves, wallets — ESSANZA ke saath, poora look ready.",
    itemCount: 4,
    subcategories: [
      { name: "Scarves", slug: slugify("Scarves") },
      { name: "Belts", slug: slugify("Belts") },
      { name: "Sunglasses", slug: slugify("Sunglasses") },
      { name: "Wallets", slug: slugify("Wallets") },
    ],
  },
  {
    id: "cat-011",
    name: "Home Essentials",
    slug: slugify("Home Essentials"),
    image: "/images/c8bd98e3-024d-4954-acf8-f7d1ad496230.JPG",
    description:
      "Ghar ESSANZA ka ho toh baat hi kya hai. Decor items, vases, aur home accessories jo aap ke ghar ko banaye stylish aur cozy.",
    itemCount: 1,
    subcategories: [
      { name: "Decor", slug: slugify("Decor") },
    ],
  },
  {
    id: "cat-012",
    name: "Bedding",
    slug: slugify("Bedding"),
    image: "/images/9900481c-b835-4509-89aa-3da1530c112c.JPG",
    description:
      "ESSANZA ke bedding mein jaise baadal pe letay hon. Bedsheets, pillow covers aur blankets — jo dein aisi neend jaise kabhi aati nahi. Naram aur cozy.",
    itemCount: 3,
    subcategories: [
      { name: "Bedsheets", slug: slugify("Bedsheets") },
      { name: "Pillow Covers", slug: slugify("Pillow Covers") },
      { name: "Blankets", slug: slugify("Blankets") },
    ],
  },
  {
    id: "cat-013",
    name: "Men Shoes",
    slug: slugify("Men Shoes"),
    image: "/images/D-14Front_A.jpg",
    description:
      "Qadam ESSANZA ke saath. Formal shoes se sneakers tak — har occasion ke liye perfect pair. Comfort aur style dono ek jagah.",
    itemCount: 2,
    subcategories: [
      { name: "Formal Shoes", slug: slugify("Formal Shoes") },
      { name: "Casual Shoes", slug: slugify("Casual Shoes") },
    ],
  },
  {
    id: "cat-014",
    name: "Women Shoes",
    slug: slugify("Women Shoes"),
    image: "/images/ca403492-4291-471c-b356-ab6df2875135.JPG",
    description:
      "ESSANZA ke saath har qadam style ka ho. Heels, sandals — har mood ke liye perfect pair jo aap ki personality ko complete kare.",
    itemCount: 2,
    subcategories: [
      { name: "Heels", slug: slugify("Heels") },
      { name: "Sandals", slug: slugify("Sandals") },
    ],
  },
  {
    id: "cat-015",
    name: "Kids Shoes",
    slug: slugify("Kids Shoes"),
    image: "/images/78e955a7-4a60-4860-baf6-6aa19ad0271d.JPG",
    description:
      "Chotay qadam, ESSANZA ke saath. Sneakers aur sandals jo bachon ko pasand aayein aur maaon ko bhi. Comfortable, colorful, cute.",
    itemCount: 2,
    subcategories: [
      { name: "Boys Shoes", slug: slugify("Boys Shoes") },
      { name: "Girls Shoes", slug: slugify("Girls Shoes") },
    ],
  },
  {
    id: "cat-016",
    name: "Kids Accessories",
    slug: slugify("Kids Accessories"),
    image: "/images/9900481c-b835-4509-89aa-3da1530c112c.JPG",
    description:
      "Chotay bachon ke liye chotay accessories jo unhe aur bhi pyaare bana dein. Hair clips, bands aur bhi bohat kuch ESSANZA mein hai.",
    itemCount: 1,
    subcategories: [
      { name: "Hair Accessories", slug: slugify("Hair Accessories") },
    ],
  },
  {
    id: "cat-017",
    name: "Lifestyle Products",
    slug: slugify("Lifestyle Products"),
    image: "/images/ca403492-4291-471c-b356-ab6df2875135.JPG",
    description:
      "Zindagi ESSANZA ke saath behtar hai. Premium lifestyle products jo aapki daily routine ko dein ek naya taste. Watches aur accessories.",
    itemCount: 1,
    subcategories: [
      { name: "Watches", slug: slugify("Watches") },
    ],
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const featuredCategories = categories.slice(0, 8);
