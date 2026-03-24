import { Product } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <motion.div 
        className="group cursor-pointer"
        whileHover={{ y: -8 }}
      >
        <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative rounded-[2rem] brutal-border">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-neon text-black text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">View Drop</span>
          </div>
        </div>
        <div className="mt-6 px-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold tracking-tighter text-gray-900 uppercase leading-none">{product.name}</h3>
            <p className="text-sm font-bold font-mono">₹{product.price}</p>
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">{product.category}</p>
        </div>
      </motion.div>
    </Link>
  );
}
