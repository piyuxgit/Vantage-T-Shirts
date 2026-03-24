import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, ArrowRight, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('Recaptcha resolved');
        }
      });
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: 'User',
          phoneNumber: user.phoneNumber,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => navigate('/')}
          className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
        >
          <ArrowLeft size={16} /> Back to Store
        </button>

        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 uppercase italic font-serif leading-none">Join the<br/>Studio</h1>
          <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.5em]">
            {otpSent ? `Verification_Code_Sent_To_${phone}` : 'Enter_Phone_To_Start_Session'}
          </p>
        </div>

        <div id="recaptcha-container"></div>

        <div className="bg-white p-10 rounded-[2.5rem] brutal-border">
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.form 
                key="phone-step"
                onSubmit={handleSendOtp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full pl-16 pr-6 py-6 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white outline-none transition-all text-lg font-bold"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !phone}
                  className="w-full py-6 bg-black text-white rounded-2xl font-bold tracking-[0.4em] text-xs hover:bg-neon hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl"
                >
                  {loading ? 'SENDING...' : 'GET OTP'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-step"
                onSubmit={handleVerifyOtp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    className="w-full pl-16 pr-6 py-6 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white outline-none transition-all text-xl font-bold tracking-[0.5em] text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-6 bg-black text-white rounded-2xl font-bold tracking-[0.4em] text-xs hover:bg-neon hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl"
                >
                  {loading ? 'VERIFYING...' : 'VERIFY & CREATE'}
                  {!loading && <CheckCircle2 size={18} />}
                </button>

                <button 
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                >
                  Change Phone Number
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or signup with</span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full py-6 border-2 border-black rounded-2xl font-bold text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
              GOOGLE ACCOUNT
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/')}
            className="text-black font-bold underline underline-offset-4"
          >
            Sign in here
          </button>
        </p>
      </motion.div>
    </div>
  );
}
