/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import toast from "react-hot-toast";
import { FiSearch, FiX } from "react-icons/fi";
import {AnimatePresence, motion } from "framer-motion";

export default function SearchProductPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [query, setQuery] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(0);

	useEffect(() => {
		return () => {
		if (typingTimeout) clearTimeout(typingTimeout);
		};
	}, [typingTimeout]);

	const handleSearch = async (searchQuery) => {
		if (searchQuery.length === 0) {
		setProducts([]);
		return;
		}

		setIsLoading(true);
		try {
		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL}products/search/${searchQuery}`
		);
		setProducts(response.data);
		} catch (error) {
		toast.error("Error fetching products");
		console.error(error);
		} finally {
		setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setQuery(value);

		if (typingTimeout) clearTimeout(typingTimeout);

		setTypingTimeout(
		setTimeout(() => {
			handleSearch(value);
		}, 500)
		);
	};

	const clearSearch = () => {
		setQuery("");
		setProducts([]);
		if (typingTimeout) clearTimeout(typingTimeout);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
		<div className="max-w-7xl mx-auto">
			{/* Header Section */}
			<motion.div 
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="text-center mb-12"
			>
			<h1 className="text-4xl font-bold text-gray-900 mb-4">
				Discover Amazing Products
			</h1>
			<p className="text-lg text-gray-600 max-w-2xl mx-auto">
				Search through our extensive collection of high-quality products
			</p>
			</motion.div>

			{/* Search Bar */}
			<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4 }}
			className="max-w-2xl mx-auto mb-12 relative"
			>
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<FiSearch className="h-5 w-5 text-gray-400" />
				</div>
				<input
				type="text"
				placeholder="Search for products..."
				className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
				value={query}
				onChange={handleInputChange}
				/>
				{query && (
				<button
					onClick={clearSearch}
					className="absolute inset-y-0 right-0 pr-3 flex items-center"
				>
					<FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
				</button>
				)}
			</div>
			</motion.div>

			{/* Results Section */}
			<div className="mb-12">
			<AnimatePresence>
				{query.length === 0 ? (
				<motion.div
					key="empty-state"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="text-center py-12"
				>
					<div className="max-w-md mx-auto">
					<FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Start searching
					</h3>
					<p className="text-gray-500">
						Enter a product name in the search box above to find what you're looking for
					</p>
					</div>
				</motion.div>
				) : isLoading ? (
				<motion.div
					key="loading-state"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="flex justify-center items-center h-64"
				>
					<Loading />
				</motion.div>
				) : products.length === 0 ? (
				<motion.div
					key="no-results"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="text-center py-12"
				>
					<div className="max-w-md mx-auto">
					<FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No products found
					</h3>
					<p className="text-gray-500">
						We couldn't find any products matching "<span className="font-semibold">{query}</span>"
					</p>
					</div>
				</motion.div>
				) : (
				<motion.div
					key="results"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ staggerChildren: 0.1 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
				>
					{products.map((product) => (
					<motion.div
						key={product.productId}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<ProductCard product={product} />
					</motion.div>
					))}
				</motion.div>
				)}
			</AnimatePresence>
			</div>

			{/* Popular Searches */}
			<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.3 }}
			className="text-center"
			>
			<h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
				Popular Searches
			</h3>
			<div className="flex flex-wrap justify-center gap-3">
				{['Electronics', 'Clothing', 'Home Decor', 'Books', 'Sports'].map((term) => (
				<button
					key={term}
					onClick={() => {
					setQuery(term);
					handleSearch(term);
					}}
					className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
				>
					{term}
				</button>
				))}
			</div>
			</motion.div>
		</div>
		</div>
	);
}