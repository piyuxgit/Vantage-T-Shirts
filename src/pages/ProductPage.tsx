import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function ProductPage({ 
  onAddToCart 
}: { 
  onAddToCart: (product: Product, size: string) => void;
}) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === productId);
  
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const validateSize = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate('/')} className="underline">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-white pt-24 pb-20 px-4 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] relative overflow-hidden rounded-[3rem] bg-gray-100 brutal-border">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 flex items-center justify-between px-6">
              <button 
                onClick={() => setCurrentImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                className="p-4 glass rounded-full hover:bg-neon hover:text-black transition-all shadow-xl"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setCurrentImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                className="p-4 glass rounded-full hover:bg-neon hover:text-black transition-all shadow-xl"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-black scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col py-4">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-neon font-mono text-[10px] tracking-[0.5em] uppercase">{product.category}</span>
            <span className="h-[1px] flex-1 bg-gray-100"></span>
            <span className="text-gray-400 font-mono text-[10px]">DROP_2026_V.01</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-none italic font-serif uppercase">{product.name}</h1>
          <p className="text-4xl font-bold mb-12 font-mono">₹{product.price}</p>
          
          <div className="mb-12" ref={sizeRef}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Select_Size</span>
                {showSizeError && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-600 uppercase tracking-widest"
                  >
                    Please select a size to continue
                  </motion.span>
                )}
              </div>
              <button 
                onClick={() => setShowSizeChart(true)}
                className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8 hover:text-accent"
              >
                Size Chart
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`py-5 text-sm font-bold border-2 rounded-2xl transition-all ${selectedSize === size ? 'bg-neon text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105' : 'hover:border-black border-gray-100'} ${showSizeError && !selectedSize ? 'border-red-600' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12 mb-16">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 text-gray-400">Description_Log</h4>
              <p className="text-xl text-gray-600 leading-relaxed font-light font-serif italic">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-gray-100">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400">Fabric_Spec</h4>
                <p className="text-sm font-bold">100% PREMIUM COTTON</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400">Care_Guide</h4>
                <p className="text-sm font-bold">MACHINE WASH COLD</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-auto">
            <button
              onClick={() => {
                if (validateSize()) {
                  onAddToCart(product, selectedSize);
                }
              }}
              className="w-full py-7 bg-black text-white rounded-[2rem] font-bold tracking-[0.4em] text-xs hover:bg-neon hover:text-black transition-all shadow-2xl active:scale-[0.98]"
            >
              ADD TO BAG
            </button>
            <button
              onClick={() => {
                if (validateSize()) {
                  navigate(`/payment?productId=${product.id}&size=${selectedSize}`);
                }
              }}
              className="w-full py-7 border-2 border-black text-black rounded-[2rem] font-bold tracking-[0.4em] text-xs hover:bg-black hover:text-white transition-all shadow-sm active:scale-[0.98]"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-10 rounded-3xl max-w-md w-full relative shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <button onClick={() => setShowSizeChart(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
              <h3 className="text-2xl font-bold mb-8 tracking-tighter">SIZE REFERENCE</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-4 font-bold uppercase tracking-widest text-[10px]">Size</th>
                    <th className="text-left py-4 font-bold uppercase tracking-widest text-[10px]">Chest (in)</th>
                    <th className="text-left py-4 font-bold uppercase tracking-widest text-[10px]">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {['XS', 'S', 'M', 'L', 'XL'].map((s, i) => (
                    <tr key={s}>
                      <td className="py-4 font-bold">{s}</td>
                      <td className="py-4 text-gray-500">{34 + i*2}-{36 + i*2}</td>
                      <td className="py-4 text-gray-500">{27 + i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                * Measurements are in inches. For an oversized fit, we recommend your true size. For a standard fit, size down.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
