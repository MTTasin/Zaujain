import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, NavLink, Link, useParams } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaCamera, FaPhoneAlt as FaPhone } from "react-icons/fa";


import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Define the base URL for your Django API
const API_URL = 'http://192.168.0.101:8000'; // Base URL for the server

// --- SVG Icons ---
const PhoneIcon = () => ( <FaPhone /> );
const WhatsAppIcon = () => ( <FaWhatsapp /> );
const FacebookIcon = () => ( <FaFacebookF /> );
const InstagramIcon = () => ( <FaInstagram /> );
const CameraIcon = () => ( <FaCamera /> );

// --- Component: ScrollToTop ---
const ScrollToTop = () => { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; };

// --- Component: MotionWrapper ---
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };
const MotionWrapper = ({ children }) => ( <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>{children}</motion.div> );

// --- Component: ImageCarouselModal ---
const ImageCarouselModal = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);
    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="relative w-full max-w-3xl h-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-10 right-0 text-white text-3xl z-10">&times;</button>
                <AnimatePresence initial={false} mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex].image}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-contain"
                    />
                </AnimatePresence>
                <button onClick={prevImage} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full">&lt;</button>
                <button onClick={nextImage} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full">&gt;</button>
            </div>
        </motion.div>
    );
};

// --- Component: ProductCard ---
const ProductCard = ({ product, onImageClick }) => {
    const coverImage = product.images && product.images.length > 0 ? product.images[0].image : 'https://placehold.co/600x400/a855f7/ffffff?text=No+Image';
    return (
        <motion.div
            className="bg-gray-800 rounded-lg shadow-2xl shadow-purple-900/10 overflow-hidden group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => product.images && product.images.length > 0 && onImageClick(0)}
        >
            <div className="relative overflow-hidden">
                <img src={coverImage} alt={product.name} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/a855f7/ffffff?text=Image+Not+Found'; }}/>
                {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <CameraIcon /> <span>{product.images.length}</span>
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                <p className="text-gray-400 mt-2">{product.description ? product.description.substring(0, 100) : ''}{product.description && product.description.length > 100 ? '...' : ''}</p>
            </div>
        </motion.div>
    );
};

// --- Component: Header ---
const Header = ({ siteConfig, categories = [] }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const linkStyle = "px-4 py-2 text-lg text-gray-300 hover:text-pink-400 transition-colors duration-300";
    const activeLinkStyle = { color: '#ec4899' };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const MobileNavLink = ({ to, children }) => (
        <NavLink to={to} className={({ isActive }) => `block text-center text-2xl py-4 ${isActive ? 'text-pink-400' : 'text-white'}`} onClick={() => setMobileMenuOpen(false)}>
            {children}
        </NavLink>
    );

    return (
        <>
            <header className="bg-gray-900/70 backdrop-blur-md shadow-lg sticky top-0 z-40">
                <nav className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/">
                        <img 
                            src={siteConfig.logo ? `${API_URL}${siteConfig.logo}`: 'https://placehold.co/150x60/111827/DB2777?text=Zaujain'} 
                            alt="Zaujain Nikah Point Logo" 
                            className="h-14 w-auto object-contain" 
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? 'font-semibold' : ''}`} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
                        {categories.length > 0 && (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className={`${linkStyle} flex items-center`}>
                                    Categories
                                    <svg className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                            {categories.map(cat => (
                                                <NavLink key={cat.id} to={`/category/${cat.slug}`} className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-pink-400 bg-gray-700' : 'text-gray-300'} hover:bg-gray-700`} onClick={() => setDropdownOpen(false)}>
                                                    {cat.name}
                                                </NavLink>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(true)} className="text-white focus:outline-none">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </nav>
            </header>
            
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50" onClick={() => setMobileMenuOpen(false)}>
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute top-0 right-0 h-full w-full max-w-xs bg-gray-900 shadow-lg p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end">
                                <button onClick={() => setMobileMenuOpen(false)} className="text-white focus:outline-none">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <div className="flex flex-col justify-center items-center flex-grow">
                                <MobileNavLink to="/">Home</MobileNavLink>
                                <h3 className="text-gray-500 text-xl mt-6 mb-2">Categories</h3>
                                {categories.map(cat => (
                                    <MobileNavLink key={cat.id} to={`/category/${cat.slug}`}>{cat.name}</MobileNavLink>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};


// --- Component: Footer ---
const Footer = ({ config, categories }) => {
    const whatsAppNumber = (config.whatsapp_number || '').replace(/[^0-9]/g, '');
    return (
        <footer className="bg-gray-900 border-t-2 border-t-fuchsia-500 text-gray-300 mt-16 relative pt-10">
            {/* Scratchy top effect */}
           
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo & About */}
                    <div className="col-span-1 md:col-span-2">
                        <img 
                            src={config.logo ? `${API_URL}${config.logo}`: 'https://placehold.co/150x60/111827/DB2777?text=Zaujain'} 
                            alt="Zaujain Nikah Point Logo" 
                            className="h-14 mb-4 object-contain"
                        />
                        <p className="text-gray-400 max-w-md">
                            Beautifully crafted Nikah Namas to make your marriage memorable. We provide unique and personalized designs to celebrate your sacred union.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-pink-400 transition-colors">Home</Link></li>
                             {categories.map(cat => (
                                <li key={cat.id}><Link to={`/category/${cat.slug}`} className="hover:text-pink-400 transition-colors">{cat.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                             {config.phone_number && (<li><a href={`tel:${config.phone_number}`} className="flex gap-2 items-center hover:text-pink-400 transition-colors"><PhoneIcon /> {config.phone_number}</a></li>)}
                            {config.whatsapp_number && (<li><a href={`https://wa.me/${whatsAppNumber}`} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center hover:text-pink-400 transition-colors"><WhatsAppIcon /> {config.whatsapp_number}</a></li>)}
                        </ul>
                        <div className="flex items-center space-x-4 pt-4">
                           {config.facebook_link && (
                               <a href={config.facebook_link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                                   <FacebookIcon />
                               </a>
                           )}
                           {config.instagram_link && (
                               <a href={config.instagram_link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                                   <InstagramIcon />
                               </a>
                           )}
                       </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} {config.site_name || 'Zaujain Nikah Point'}. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};


// --- Page Component Abstraction (to handle modal logic) ---
const ProductPageLayout = ({ products, loading }) => {
    const [modalState, setModalState] = useState({ isOpen: false, images: [], initialIndex: 0 });
    const openModal = (productImages, index) => { setModalState({ isOpen: true, images: productImages, initialIndex: index }); };
    const closeModal = () => { setModalState({ isOpen: false, images: [], initialIndex: 0 }); };
    return (
        <>
            <AnimatePresence>
                {modalState.isOpen && ( <ImageCarouselModal images={modalState.images} initialIndex={modalState.initialIndex} onClose={closeModal} /> )}
            </AnimatePresence>
            {loading ? <div className="text-center text-white">Loading...</div> :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, index) => (
                        <motion.div key={product.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                            <ProductCard product={product} onImageClick={(imageIndex) => openModal(product.images, imageIndex)} />
                        </motion.div>
                    ))}
                </div>
            }
        </>
    );
};

// --- Page: HomePage ---
const HomePage = ({ apiUrl, siteConfig }) => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`${apiUrl}/api/products/?featured=true`)
      .then(response => { setFeatured(response.data); setLoading(false); })
      .catch(error => { console.error("Error fetching featured products:", error); setLoading(false); });
  }, [apiUrl]);
  return (
    <MotionWrapper>
      <div className="container mx-auto px-6 py-12">
        <div className="text-center py-16">
            <motion.h2 
                className="text-2xl text-gray-400 font-light mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                Welcome to
            </motion.h2>
            <motion.h1 
                className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.7 }}
            >
                {siteConfig.site_name || 'Zaujain Nikah Point'}
            </motion.h1>
            <motion.p 
                className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.7, delay: 0.5 }}
            >
                Beautifully Crafted Nikah Namas to Celebrate Your Sacred Union.
            </motion.p>
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-10">Featured Designs</h2>
        <ProductPageLayout products={featured} loading={loading} />
      </div>
    </MotionWrapper>
  );
};

// --- Page: CategoryPage ---
const CategoryPage = ({ apiUrl, categories }) => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const currentCategory = categories.find(cat => cat.slug === slug);
    if (currentCategory) { setCategoryName(currentCategory.name); }
    axios.get(`${apiUrl}/api/products/?category=${slug}`)
      .then(response => { setProducts(response.data); setLoading(false); })
      .catch(error => { console.error(`Error fetching products for category ${slug}:`, error); setLoading(false); });
  }, [slug, apiUrl, categories]);
  return (
    <MotionWrapper>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-10">{categoryName}</h1>
        <ProductPageLayout products={products} loading={loading} />
      </div>
    </MotionWrapper>
  );
};

// --- App Layout Component ---
const AppLayout = () => {
  const [siteConfig, setSiteConfig] = useState({});
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  useEffect(() => {
    axios.get(`${API_URL}/api/config/`).then(response => setSiteConfig(response.data || {})).catch(error => console.error("Error fetching site config:", error));
    axios.get(`${API_URL}/api/categories/`).then(response => setCategories(response.data)).catch(error => console.error("Error fetching categories:", error));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 antialiased">
      <Header siteConfig={siteConfig} categories={categories} />
      <ScrollToTop />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage apiUrl={API_URL} siteConfig={siteConfig} />} />
            <Route path="/category/:slug" element={<CategoryPage apiUrl={API_URL} categories={categories} />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer config={siteConfig} categories={categories} />
    </div>
  );
};

// --- Main App Component ---
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
