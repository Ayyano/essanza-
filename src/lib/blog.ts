import { BlogPost } from "@/types";
import { slugify } from "@/lib/utils";

export const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    title: "ESSANZA Style Guide: Summer Mein Kaise Karein Outfit Perfect",
    slug: slugify("ESSANZA Style Guide Summer Mein Kaise Karein Outfit Perfect"),
    excerpt:
      "Garmi mein stylish kaise rahein? We have some easy peasy summer styling tips for you! Lawn suits se le kar light fabrics tak — ESSANZA ke saath summer mein bhi stylish raho.",
    image: "/images/MBM-3PW25-07MaroonBack_D.jpg",
    date: "2026-05-10",
    author: "ESSANZA Style Desk",
    tags: ["style guide", "summer", "fashion tips"],
  },
  {
    id: "blog-002",
    title: "Shaadi Ka Season Aa Gaya — ESSANZA Bridal Shopping Guide",
    slug: slugify("Shaadi Ka Season Aa Gaya ESSANZA Bridal Shopping Guide"),
    excerpt:
      "Pakistani weddings ka season aa gaya hai aur ab planning shuru karo. Mayun se le kar walima tak — ESSANZA ke paas sab kuch hai. Bridal outfits, jewelry, handbags, sab ek jagah.",
    image: "/images/ca403492-4291-471c-b356-ab6df2875135.JPG",
    date: "2026-05-05",
    author: "ESSANZA Style Desk",
    tags: ["wedding", "bridal", "shopping guide"],
  },
  {
    id: "blog-003",
    title: "Lawn Ki Baat Hi Kya Hai — Unstitched Collection 2026",
    slug: slugify("Lawn Ki Baat Hi Kya Hai Unstitched Collection 2026"),
    excerpt:
      "ESSANZA ka naya digital print lawn collection aaya hai aur hum toh crazy ho gaye hain! Khawab se Shabnam tak — har design apne aap mein unique hai. Sab se best prints is baar ESSANZA mein hain.",
    image: "/images/78e955a7-4a60-4860-baf6-6aa19ad0271d.JPG",
    date: "2026-04-28",
    author: "ESSANZA Design Team",
    tags: ["lawn", "unstitched", "summer"],
  },
  {
    id: "blog-004",
    title: "Mard Ka Style: Perfect Kurta Shalwar Kaise Pehnein",
    slug: slugify("Mard Ka Style Perfect Kurta Shalwar Kaise Pehnein"),
    excerpt:
      "Mardon ke liye style utna hi important hai jitna ladies ke liye. ESSANZA ke stitched kurta shalwar mein perfect fit kaise paayein? Fabric kaise choose karein? Complete guide for men.",
    image: "/images/JTK_EF25_01_Multi_Color.jpg",
    date: "2026-04-20",
    author: "ESSANZA Men's Corner",
    tags: ["men", "style guide", "kurta shalwar"],
  },
  {
    id: "blog-005",
    title: "Accessories Se Outfit Ko Kaise Complete Karein",
    slug: slugify("Accessories Se Outfit Ko Kaise Complete Karein"),
    excerpt:
      "Kya aap jante hain accessories aapke poore look ko change kar sakte hain? Scarves, belts, watches, sunglasses — ESSANZA se accessorize karna seekhein aur har outfit mein alag lagein.",
    image: "/images/D-14Closeup_H.jpg",
    date: "2026-04-15",
    author: "ESSANZA Style Desk",
    tags: ["accessories", "fashion tips", "style guide"],
  },
  {
    id: "blog-006",
    title: "Winter Wardrobe Planning: Abhi Se Taiyari Karo",
    slug: slugify("Winter Wardrobe Planning Abhi Se Taiyari Karo"),
    excerpt:
      "Winter ab door nahi hai! ESSANZA ke winter collection mein swearers, blankets, aur warm fabrics ke saath apna wardrobe upgrade karo. Early winter shopping ke fayde jaano.",
    image: "/images/9900481c-b835-4509-89aa-3da1530c112c.JPG",
    date: "2026-04-10",
    author: "ESSANZA Design Team",
    tags: ["winter", "wardrobe", "shopping guide"],
  },
  {
    id: "blog-007",
    title: "Ghar Ko ESSANZA Se Sajane Ka Tareeqa",
    slug: slugify("Ghar Ko ESSANZA Se Sajane Ka Tareeqa"),
    excerpt:
      "Ghar wohi hai jahan ESSANZA ho! Home decor, bedding, bedsheets, pillow covers — ESSANZA ke home collection se apne ghar ko dein naya look. Aasan aur affordable home styling tips.",
    image: "/images/c8bd98e3-024d-4954-acf8-f7d1ad496230.JPG",
    date: "2026-04-05",
    author: "ESSANZA Home Desk",
    tags: ["home decor", "bedding", "lifestyle"],
  },
  {
    id: "blog-008",
    title: "Kitchen Queen: ESSANZA Kitchenware Review aur Tips",
    slug: slugify("Kitchen Queen ESSANZA Kitchenware Review aur Tips"),
    excerpt:
      "ESSANZA ka kitchenware collection review. Dinner sets se non-stick pans tak — jo cheezein aap ki cooking ko aasaan aur stylish banayein. Humare favorite picks dekhein!",
    image: "/images/ca403492-4291-471c-b356-ab6df2875135.JPG",
    date: "2026-04-01",
    author: "ESSANZA Kitchen Desk",
    tags: ["kitchenware", "review", "home"],
  },
];
