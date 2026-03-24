import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const categoryProducts = PRODUCTS.filter(p => p.category === categoryName);

  return (
    <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-12 mb-20">
        <Link 
          to="/"
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-neon transition-colors group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back_To_Selection
        </Link>
        
        <div className="flex items-end justify-between border-b-2 border-black pb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-400 font-mono text-[10px]">V.01_DROP</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase italic font-serif leading-none">
              {categoryName?.replace('-', ' ')}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold font-mono leading-none">{categoryProducts.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mt-2 font-mono">Items_Found</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
        {categoryProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </main>
  );
}
