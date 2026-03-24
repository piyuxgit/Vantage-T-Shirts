import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Package, HelpCircle, RotateCcw, LogOut, ChevronRight, Database, Zap } from 'lucide-react';

export default function Profile({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState(auth.currentUser);
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'returns' | 'help'>('history');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch from MongoDB
        try {
          const res = await fetch(`/api/users/${u.uid}`);
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server responded with ${res.status}: ${text.slice(0, 100)}...`);
          }
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(`Expected JSON but got ${contentType}. Response: ${text.slice(0, 100)}...`);
          }
          const data = await res.json();
          setMongoUser(data);
        } catch (err: any) {
          console.error('MongoDB fetch failed:', err.message);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-white"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter">MY ACCOUNT</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-500 text-sm">{user.email}</p>
              {mongoUser && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                  <Database size={10} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Synced_to_Mongo</span>
                  <Zap size={8} className="animate-pulse" />
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-sm font-bold uppercase tracking-widest underline underline-offset-4">Close</button>
        </div>

        <div className="flex gap-8 border-b mb-8">
          {[
            { id: 'history', label: 'Orders', icon: Package },
            { id: 'returns', label: 'Returns', icon: RotateCcw },
            { id: 'help', label: 'Help', icon: HelpCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all border-b-2 ${activeTab === tab.id ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'history' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  <p className="text-sm uppercase tracking-widest">No orders found</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="border rounded-xl p-6 hover:border-black transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-4">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold">₹{order.total}</p>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="py-20 text-center">
              <h3 className="text-xl font-bold mb-2">No Active Returns</h3>
              <p className="text-sm text-gray-500">You have 30 days from delivery to initiate a return.</p>
              <button className="mt-6 px-8 py-3 border border-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Start a Return
              </button>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { q: 'Shipping Policy', a: 'Free standard shipping on orders over ₹2500.' },
                  { q: 'Size Guide', a: 'Our tees are designed for a relaxed fit. Size down for a slimmer look.' },
                  { q: 'Care Instructions', a: 'Machine wash cold, tumble dry low. Do not iron prints.' },
                  { q: 'Contact Us', a: 'support@vantage.com' },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-bold text-sm mb-2">{item.q}</h4>
                    <p className="text-sm text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t flex justify-between items-center">
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:opacity-50"
          >
            <LogOut size={14} /> Logout
          </button>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">VANTAGE © 2026</p>
        </div>
      </div>
    </motion.div>
  );
}
