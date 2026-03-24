import { Search, ShoppingBag, User, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ 
  onProfileClick, 
  onCartClick, 
  onSearch,
  cartCount 
}: { 
  onProfileClick: () => void; 
  onCartClick: () => void;
  onSearch: (query: string) => void;
  cartCount: number;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, path: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // If not on homepage, just let the Link handle navigation
    }
  };

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1, scale: 1 },
        hidden: { y: -100, opacity: 0, scale: 0.95 }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-8 h-16 flex items-center justify-between w-[95%] max-w-7xl shadow-2xl"
    >
      <div className="flex items-center gap-12">
        <Link to="/" onClick={(e) => {
          if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}>
          <h1 className="text-2xl font-bold tracking-tighter cursor-pointer flex items-center gap-2">
            VANTAGE <span className="text-[10px] bg-black text-white px-2 py-1 rounded-full font-mono tracking-widest">V.01</span>
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em]">
          <Link 
            to="/category/men" 
            onClick={(e) => handleNavClick(e, 'men-section', '/category/men')}
            className="hover:text-accent transition-colors"
          >
            Men
          </Link>
          <Link 
            to="/category/women" 
            onClick={(e) => handleNavClick(e, 'women-section', '/category/women')}
            className="hover:text-accent transition-colors"
          >
            Women
          </Link>
          <Link 
            to="/category/new-arrivals" 
            onClick={(e) => handleNavClick(e, 'new-arrivals-section', '/category/new-arrivals')}
            className="hover:text-accent transition-colors"
          >
            New
          </Link>
          <Link 
            to="/#featured" 
            onClick={(e) => handleNavClick(e, 'featured-section', '/')}
            className="hover:text-accent transition-colors"
          >
            Featured
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="relative flex items-center">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.input
                autoFocus
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="absolute right-8 bg-transparent border-b border-black outline-none px-2 py-1 text-sm font-medium"
                placeholder="Search drops..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
            )}
          </AnimatePresence>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-accent transition-colors">
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
        
        <button onClick={onProfileClick} className="hover:text-accent transition-colors">
          <User size={20} />
        </button>
        
        <button onClick={onCartClick} className="relative hover:text-accent transition-colors">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </motion.nav>
  );
}
