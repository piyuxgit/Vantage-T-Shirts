import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { X, Mail, Lock } from 'lucide-react';

export default function Auth({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white w-full max-w-md p-10 rounded-[2.5rem] relative brutal-border"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-neon rounded-full transition-colors border border-black">
          <X size={18} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tighter mb-2 uppercase italic font-serif">Welcome Back</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-mono">Auth_Session_Init</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white outline-none transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white outline-none transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold tracking-[0.4em] text-xs hover:bg-neon hover:text-black transition-all disabled:opacity-50 shadow-xl"
          >
            {loading ? 'PROCESSING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-5 border-2 border-black rounded-2xl font-bold text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
            GOOGLE ACCOUNT
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => {
              onClose();
              navigate('/signup');
            }}
            className="text-black font-bold underline underline-offset-4"
          >
            Join the Studio
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
