export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  category_id?: string;
  subcategory: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isTrending: boolean;
  onSale: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
  subcategories: { name: string; slug: string }[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  link: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
}
