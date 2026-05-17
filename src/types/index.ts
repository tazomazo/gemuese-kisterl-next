export interface User {
  id: string;
  name: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category_id: string | null;
  available: boolean;
  created_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'fulfilled';
  created_at: string;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_order: number;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  name: string;
  is_admin: boolean;
}
