/* eslint-disable no-unused-vars */
import { Route, Routes, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    ShieldCheck, 
    Sparkles, 
    ShoppingBag, 
    ChevronRight,
    Star,
    Leaf,
    Heart
} from "lucide-react";

import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverviewPage from "./client/productOverviewPage";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkOut";
import SearchProductPage from "./client/searchProducts";
import AboutPage from "./client/about";
import ContactPage from "./client/contact";
import ProductReviewsPage from "./client/reviews";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-800 overflow-x-hidden">
        <Header />

        <main className="flex-1 w-full">
            <Routes>
            <Route path="/" element={<HomeLanding />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} /> 
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/overview/:id" element={<ProductOverviewPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<SearchProductPage />} />
            <Route path="/review" element={<ProductReviewsPage />} />
            <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </main>
        </div>
    );
    }

    function HomeLanding() {
    return (
        <>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-sky-50 to-rose-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1887&auto=format&fit=crop')] opacity-5 bg-cover bg-center"></div>
            </div>
            
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col md:flex-row items-center relative z-10"
            >
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight"
                >
                Discover Your <span className="text-sky-600">Inner Radiance</span>
                </motion.h1>
                
                <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto md:mx-0 mb-8"
                >
                Experience the art of beauty with our exclusive collection of high-performance cosmetics and skincare.
                </motion.p>
                
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                >
                <Link
                    to="/products"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                    <ShoppingBag size={22} />
                    Shop The Collection
                    <ChevronRight size={18} className="ml-1" />
                </Link>
                </motion.div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="md:w-1/2 relative"
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1470&auto=format&fit=crop" 
                    alt="Featured Beauty Product" 
                    className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg"
                >
                <div className="flex items-center gap-2">
                    <div className="bg-sky-100 p-2 rounded-full">
                    <Star className="text-sky-600" size={20} />
                    </div>
                    <div>
                    <p className="font-semibold text-slate-800">Best Seller</p>
                    <p className="text-xs text-slate-500">Luminous Silk Foundation</p>
                    </div>
                </div>
                </motion.div>
            </motion.div>
            </motion.div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-white">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Featured Products</h2>
                <p className="text-lg text-slate-500 mt-2">Curated for excellence, chosen by you.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                >
                <ProductCard 
                    name="Luminous Silk Foundation" 
                    price="$65.00" 
                    image="https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1374&auto=format&fit=crop" 
                />
                </motion.div>
                
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                >
                <ProductCard 
                    name="Celestial Glow Highlighter" 
                    price="$42.00" 
                    image="https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=1470&auto=format&fit=crop" 
                />
                </motion.div>
                
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                >
                <ProductCard 
                    name="Velvet Kiss Lipstick" 
                    price="$35.00" 
                    image="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=1470&auto=format&fit=crop" 
                />
                </motion.div>
                
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                >
                <ProductCard 
                    name="Revitalizing Night Serum" 
                    price="$88.00" 
                    image="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1588&auto=format&fit=crop" 
                />
                </motion.div>
            </div>
            </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="bg-slate-50 py-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">The Crystal Beauty Difference</h2>
                <p className="text-lg text-slate-500 mt-2">Our commitment to quality and your beauty.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-10 text-center">
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                >
                <FeatureHighlight 
                    icon={<Sparkles className="text-sky-600"/>} 
                    title="Premium Ingredients" 
                    description="We source the finest, most effective ingredients to ensure luxurious results." 
                />
                </motion.div>
                
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                >
                <FeatureHighlight 
                    icon={<Leaf className="text-sky-600"/>} 
                    title="Ethical & Cruelty-Free" 
                    description="Our entire collection is developed with a deep commitment to ethical practices and is never tested on animals." 
                />
                </motion.div>
                
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                >
                <FeatureHighlight 
                    icon={<Heart className="text-sky-600"/>} 
                    title="Satisfaction Guaranteed" 
                    description="We stand behind our products. If you don't love them, we'll make it right." 
                />
                </motion.div>
            </div>
            </div>
        </section>
        </>
    );
    }

    // Enhanced Product Card with hover effects
    function ProductCard({ name, price, image }) {
    return (
        <motion.div 
        whileHover={{ y: -5 }}
        className="group relative text-center bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
        >
        <div className="overflow-hidden relative">
            <img 
            src={image} 
            alt={name} 
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
        
        <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{name}</h3>
            <p className="text-sky-600 font-medium">{price}</p>
            
            <div className="mt-3 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                key={star} 
                size={16} 
                className={`${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                />
            ))}
            </div>
        </div>
        
        <Link 
            to="/products" 
            className="absolute inset-0 z-10"
            aria-label={`View ${name}`}
        ></Link>
        </motion.div>
    );
    }

    // Enhanced Feature Highlight
    function FeatureHighlight({ icon, title, description }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-50 mx-auto mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
    }

    // Enhanced 404 Page
    function NotFoundPage() {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 min-h-[50vh] px-4 max-w-screen-md mx-auto"
        >
        <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <h2 className="text-6xl font-bold text-red-500 mb-4">404</h2>
        </motion.div>
        <p className="text-xl text-slate-500 mb-6">Oops! The page you're looking for could not be found.</p>
        <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors"
        >
            Go Back Home
            <ChevronRight size={16} />
        </Link>
        </motion.div>
    );
}