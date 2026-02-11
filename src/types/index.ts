// === CURRENCY ===

export type Currency = 'MAD' | 'EUR';

// === PRODUCT IMAGE ===

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
  blurDataURL: string | null;
}

// === CATEGORY ===

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  position: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: CategorySummary | null;
  children?: CategoryWithCount[];
  _count?: { products: number };
}

export interface CategorySummary {
  name: string;
  slug: string;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string | null;
  _count: { products: number };
}

// === PRODUCT ===

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  priceMad: number;
  priceEur: number;
  compareAtPriceMad: number | null;
  compareAtPriceEur: number | null;
  sku: string | null;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  artisan: string;
  origin: string;
  materials: string | null;
  dimensions: string | null;
  weight: number;
  categoryId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
  reviews?: Review[];
  aggregateRating?: AggregateRating | null;
  relatedProducts?: ProductListItem[];
}

/** Product as returned by list endpoints (lighter payload) */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  priceMad: number;
  priceEur: number;
  compareAtPriceMad: number | null;
  compareAtPriceEur: number | null;
  stock: number;
  artisan: string;
  origin: string;
  isFeatured?: boolean;
  category: CategorySummary;
  images: ProductImage[];
}

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
}

// === REVIEW ===

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
}

// === USER ===

export type Role = 'CLIENT' | 'ADMIN';

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: Role;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

// === ADDRESS ===

export interface Address {
  id: string;
  userId: string;
  label: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
  street: string;
  street2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// === ORDER ===

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  shippingAddressId: string;
  shippingMethod: string | null;
  stripePaymentIntentId: string | null;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: Address;
}

// === CART ===

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    priceMad: number;
    priceEur: number;
    stock: number;
    isActive: boolean;
    images: ProductImage[];
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

// === API RESPONSES ===

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: ProductListItem[];
  pagination: Pagination;
}

export interface CategoryProductsResponse {
  category: Category;
  products: ProductListItem[];
  pagination: Pagination;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface FeaturedProductsResponse {
  products: ProductListItem[];
}

export interface CartResponse {
  cart: Cart | { items: CartItem[] };
}

export interface ApiError {
  error: string;
}

// === FILTERS ===

export interface ProductFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  artisan: string;
  origin: string;
  sort: string;
  order: 'asc' | 'desc';
  q: string;
  currency: Currency;
  page: number;
}

// === WISHLIST ===

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
