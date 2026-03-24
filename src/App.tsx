import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { Product, CartItem } from './types';
import { PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Auth from './components/Auth';
import LandingAnimation from './components/LandingAnimation';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import PaymentPage from './pages/PaymentPage';
import SignupPage from './pages/SignupPage';
import { io } from 'socket.io-client';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const socket = io();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Sync to MongoDB
        try {
          const res = await fetch('/api/users/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL
            })
          });

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

          // Subscribe to real-time updates for this user
          socket.emit('subscribe_user', u.uid);
        } catch (err: any) {
          console.error('MongoDB sync failed:', err.message);
        }
      } else {
        setMongoUser(null);
      }
    });

    socket.on('user_updated', (updatedUser) => {
      console.log('Real-time update from MongoDB:', updatedUser);
      setMongoUser(updatedUser);
    });

    return () => {
      unsubscribe();
      socket.disconnect();
    };
  }, []);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images[0]
          })),
          userId: user.uid
        })
      });

      const { url } = await response.json();
      
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <AnimatePresence>
        {showLanding && <LandingAnimation onComplete={() => setShowLanding(false)} />}
      </AnimatePresence>

      <Navbar 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={() => user ? setIsProfileOpen(true) : setIsAuthOpen(true)}
        onSearch={setSearchQuery}
      />

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route 
          path="/product/:productId" 
          element={<ProductPage onAddToCart={addToCart} />} 
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      {/* Modals */}
      <AnimatePresence>
        {isCartOpen && (
          <Cart 
            items={cart}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
          />
        )}
        {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
        {isAuthOpen && <Auth onClose={() => setIsAuthOpen(false)} />}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="text-2xl font-bold tracking-tighter">VANTAGE</h2>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Instagram</a>
            <a href="#" className="hover:text-black">Twitter</a>
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">© 2026 VANTAGE STUDIO</p>
        </div>
      </footer>
    </div>
  );
}
