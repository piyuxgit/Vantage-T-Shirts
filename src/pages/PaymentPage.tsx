import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Smartphone, Building2, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productId');
  const size = searchParams.get('size');
  const product = PRODUCTS.find(p => p.id === productId);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!product || !size) {
      navigate('/');
    }
  }, [product, size, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      if (auth.currentUser && product) {
        await addDoc(collection(db, 'orders'), {
          userId: auth.currentUser.uid,
          items: [{ ...product, selectedSize: size, quantity: 1 }],
          total: product.price,
          status: 'pending',
          createdAt: new Date().toISOString(),
          paymentMethod
        });
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Payment successful but failed to save order record.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md p-12 brutal-border rounded-[3rem]"
        >
          <div className="w-24 h-24 bg-neon text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,157,0.5)]">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-5xl font-bold tracking-tighter mb-6 italic font-serif uppercase">Order_Confirmed</h2>
          <p className="text-gray-500 mb-12 leading-relaxed font-mono text-xs uppercase tracking-widest">
            Your_Order_For_The_{product.name}_(Size:_{size})_Has_Been_Placed_Successfully. 
            Session_ID:_{Math.random().toString(36).substring(7).toUpperCase()}
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="w-full py-6 bg-black text-white rounded-2xl font-bold tracking-[0.4em] text-xs hover:bg-neon hover:text-black transition-all shadow-2xl"
          >
            VIEW MY ORDERS
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* Left Column: Payment Methods */}
        <div className="space-y-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-neon transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back_To_Drop
          </button>

          <div className="p-10 bg-white brutal-border rounded-[3rem]">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-bold tracking-tighter italic font-serif uppercase">Payment_Method</h2>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'upi', label: 'UPI / QR CODE', icon: Smartphone },
                { id: 'card', label: 'CREDIT / DEBIT CARD', icon: CreditCard },
                { id: 'netbanking', label: 'NET BANKING', icon: Building2 },
                { id: 'cod', label: 'CASH ON DELIVERY', icon: Truck },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`w-full p-6 flex items-center gap-6 border-2 rounded-2xl transition-all ${
                    paymentMethod === method.id 
                      ? 'border-black bg-neon text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' 
                      : 'border-gray-100 hover:border-black'
                  }`}
                >
                  <div className={`p-4 rounded-xl ${paymentMethod === method.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}>
                    <method.icon size={20} />
                  </div>
                  <span className="font-bold text-xs tracking-[0.2em] uppercase">{method.label}</span>
                  {paymentMethod === method.id && (
                    <div className="ml-auto w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-neon rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === 'upi' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-10 p-8 bg-gray-50 rounded-[2rem] brutal-border"
                >
                  <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Enter_UPI_ID</label>
                  <input 
                    type="text" 
                    placeholder="username@okaxis"
                    className="w-full p-5 bg-white border-2 border-black rounded-2xl focus:bg-neon focus:outline-none transition-all font-mono text-sm"
                  />
                </motion.div>
              )}

              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-10 space-y-4"
                >
                  <div className="p-8 bg-gray-50 rounded-[2rem] space-y-6 brutal-border">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Card_Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-5 bg-white border-2 border-black rounded-2xl focus:bg-neon focus:outline-none transition-all font-mono text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full p-5 bg-white border-2 border-black rounded-2xl focus:bg-neon focus:outline-none transition-all font-mono text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">CVV</label>
                        <input type="password" placeholder="***" className="w-full p-5 bg-white border-2 border-black rounded-2xl focus:bg-neon focus:outline-none transition-all font-mono text-sm" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 text-gray-400 px-6">
            <ShieldCheck size={18} className="text-neon" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] font-mono">Secure_256-Bit_SSL_Encrypted</span>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:sticky lg:top-40 h-fit">
          <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl brutal-border border-white/10">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-bold tracking-tighter italic font-serif uppercase">Order_Summary</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            
            <div className="flex gap-8 mb-10">
              <div className="w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 brutal-border border-white/20">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 py-2">
                <h3 className="font-bold text-lg uppercase tracking-tight mb-2">{product.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-6 font-mono">Size: {size}</p>
                <p className="font-bold text-2xl font-mono text-neon">₹{product.price}</p>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-mono uppercase text-[10px]">Subtotal</span>
                <span className="font-mono">₹{product.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-mono uppercase text-[10px]">Shipping</span>
                <span className="text-neon font-bold uppercase text-[10px] tracking-[0.4em] font-mono">Free</span>
              </div>
              <div className="flex justify-between pt-6 border-t border-white/10">
                <span className="font-bold uppercase tracking-[0.4em] text-xs">Total_Amount</span>
                <span className="text-4xl font-bold tracking-tighter font-mono text-neon">₹{product.price}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-12 py-7 bg-neon text-black rounded-[2rem] font-bold tracking-[0.5em] text-xs hover:bg-white transition-all shadow-[0_0_40px_rgba(0,255,157,0.3)] disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  PROCESSING...
                </>
              ) : (
                `PAY_₹${product.price}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
