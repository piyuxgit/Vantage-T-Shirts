import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'ESSENTIAL OVERSIZED TEE',
    price: 1499,
    category: 'men',
    description: 'A premium heavyweight cotton tee with a relaxed, boxy fit. Perfect for everyday layering or a standalone statement.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'w1',
    name: 'SILK-TOUCH CROP TOP',
    price: 1299,
    category: 'women',
    description: 'Ultra-soft modal blend crop top with a subtle sheen. Designed for comfort and a sleek silhouette.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'm2',
    name: 'GRAPHIC ARCHIVE TEE',
    price: 1899,
    category: 'men',
    description: 'Limited edition vintage-wash tee featuring custom screen-printed artwork. Each piece is uniquely distressed.',
    images: [
      'https://images.unsplash.com/photo-1576566582419-17a8844445cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'w2',
    name: 'MINIMALIST RIBBED TEE',
    price: 1199,
    category: 'women',
    description: 'Fine-ribbed organic cotton tee with a slim fit and elongated sleeves. A versatile staple for any wardrobe.',
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1485230405350-c830535d7a7d?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'n1',
    name: 'VANTAGE SIGNATURE HOODIE',
    price: 3499,
    category: 'new-arrivals',
    description: 'Heavyweight loopback jersey hoodie with a relaxed fit and dropped shoulders. Features our signature minimal branding.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821921-25d3343c7181?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'n2',
    name: 'TECHNICAL CARGO PANTS',
    price: 4999,
    category: 'new-arrivals',
    description: 'Water-repellent nylon cargo pants with adjustable cuffs and multiple utility pockets. Designed for the modern explorer.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594633313593-bab3825d00d1?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['30', '32', '34', '36']
  },
  {
    id: 'n3',
    name: 'ASYMMETRIC KNIT DRESS',
    price: 3999,
    category: 'new-arrivals',
    description: 'Elegant ribbed knit dress with an asymmetric neckline and side slit. A sophisticated piece for any occasion.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457576-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'm3',
    name: 'VINTAGE DENIM JACKET',
    price: 4499,
    category: 'men',
    description: 'Classic denim jacket with a worn-in feel and custom metal hardware. A timeless layering piece.',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'w3',
    name: 'HIGH-WAISTED TAILORED PANTS',
    price: 2999,
    category: 'women',
    description: 'Sharp, high-waisted trousers with a wide-leg silhouette. Perfect for a polished, professional look.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594633313593-bab3825d00d1?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'n4',
    name: 'OVERSIZED BLAZER',
    price: 6999,
    category: 'new-arrivals',
    description: 'Modern oversized blazer with structured shoulders and a clean, minimalist design. A versatile statement piece.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'n5',
    name: 'MESH RUNNING SNEAKERS',
    price: 5499,
    category: 'new-arrivals',
    description: 'Lightweight, breathable mesh sneakers with a responsive foam sole. Designed for both performance and style.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['7', '8', '9', '10', '11']
  },
  {
    id: 'n6',
    name: 'LEATHER CROSSBODY BAG',
    price: 3999,
    category: 'new-arrivals',
    description: 'Sleek, compact crossbody bag made from premium pebbled leather. Features an adjustable strap and silver hardware.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['One Size']
  }
];
