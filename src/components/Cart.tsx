import { CartItem } from '../types';
import { motion } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function Cart({ 
  items, 
  onClose, 
  onUpdateQuantity, 
  onRemove,
  onCheckout 
}: { 
  items: CartItem[]; 
  onClose: () => void;
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemove: (id: string, size: string) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl brutal-border"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="p-8 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-3 italic font-serif">
            <ShoppingBag size={24} /> YOUR BAG
          </h2>
          <button onClick={onClose} className="p-3 hover:bg-neon rounded-full transition-all border border-black">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-6">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-[10px] uppercase tracking-[0.5em] font-mono">Bag_Is_Empty</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 group">
                <div className="w-28 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden brutal-border">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover transition-all" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col py-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold uppercase tracking-tighter">{item.name}</h3>
                    <button onClick={() => onRemove(item.id, item.selectedSize)} className="text-gray-400 hover:text-accent transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-widest">Size: {item.selectedSize}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center border-2 border-black rounded-full overflow-hidden">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)}
                        className="px-3 py-1 hover:bg-neon transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                        className="px-3 py-1 hover:bg-neon transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-bold font-mono">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t space-y-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Total_Amount</span>
              <span className="text-3xl font-bold font-mono">₹{total}</span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-mono">
              Shipping_Calculated_At_Checkout
            </p>
            <button 
              onClick={onCheckout}
              className="w-full py-6 bg-black text-white rounded-2xl font-bold tracking-[0.4em] text-xs hover:bg-neon hover:text-black transition-all shadow-2xl"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
