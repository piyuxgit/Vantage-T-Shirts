export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'men' | 'women' | 'new-arrivals';
  images: string[];
  sizes: string[];
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'returned';
  createdAt: string;
}
