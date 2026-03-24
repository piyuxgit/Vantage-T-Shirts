import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  // Get 10 featured products for the main screen
  const featuredProducts = PRODUCTS.slice(0, 10);

  return (
    <main className="pt-24 pb-20">
      {/* Marquee Section */}
      <div className="bg-black py-4 overflow-hidden whitespace-nowrap border-y-2 border-black mb-12">
        <div className="flex animate-marquee gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white text-xs font-bold uppercase tracking-[0.5em] flex items-center gap-12">
              VANTAGE STUDIO — NEW ARRIVALS — DROP 01 — 2026
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        <section id="categories" className="grid md:grid-cols-2 gap-6 mb-32">
          <div className="grid grid-cols-1 gap-6">
            <Link to="/category/men" id="men-section" className="h-[40vh]">
              <motion.div 
                className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-full brutal-border"
                whileHover={{ scale: 0.99 }}
              >
                <img 
                  src="https://picsum.photos/seed/menhero/1200/1600" 
                  alt="Men" 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 flex items-end p-12 group-hover:bg-black/30 transition-colors">
                  <h2 className="text-white text-7xl font-bold tracking-tighter leading-none">MEN</h2>
                </div>
              </motion.div>
            </Link>
            <Link to="/category/women" id="women-section" className="h-[40vh]">
              <motion.div 
                className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-full brutal-border"
                whileHover={{ scale: 0.99 }}
              >
                <img 
                  src="https://picsum.photos/seed/womenhero/1200/1600" 
                  alt="Women" 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 flex items-end p-12 group-hover:bg-black/30 transition-colors">
                  <h2 className="text-white text-7xl font-bold tracking-tighter leading-none">WOMEN</h2>
                </div>
              </motion.div>
            </Link>
          </div>
          
          <Link to="/category/new-arrivals" id="new-arrivals-section" className="h-full">
            <motion.div 
              className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-full brutal-border"
              whileHover={{ scale: 0.99 }}
            >
              <img 
                src="https://picsum.photos/seed/newhero/1200/1600" 
                alt="New Arrivals" 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 flex flex-col justify-between p-12 group-hover:bg-black/30 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="bg-neon text-black px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase">Limited Drop</span>
                  <span className="text-white font-mono text-xs">2026_VNTG</span>
                </div>
                <h2 className="text-white text-8xl font-bold tracking-tighter leading-none">NEW<br/>ARRIVALS</h2>
              </div>
            </motion.div>
          </Link>
        </section>

        {/* Featured Products Section */}
        <section id="featured-section" className="mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none italic font-serif">The New<br/>Standard</h2>
            </div>
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
              Curated essentials for the modern creative. High-quality fabrics, brutalist silhouettes, and timeless design.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-20">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>

          <div className="mt-32 flex justify-center">
            <Link 
              to="/category/new-arrivals"
              className="px-16 py-6 brutal-btn text-xs font-bold uppercase tracking-[0.4em] rounded-full"
            >
              Explore All Drops
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
