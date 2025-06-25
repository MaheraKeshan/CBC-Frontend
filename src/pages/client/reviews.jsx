/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiStar, FiSend } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../components/loading";

export default function ReviewsPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [query, setQuery] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(0);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [review, setReview] = useState({
		rating: 5,
		comment: "",
	});

	// Clean up timeout on unmount
	useEffect(() => {
		return () => {
		if (typingTimeout) clearTimeout(typingTimeout);
		};
	}, [typingTimeout]);

	// Product search handler
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

	// Debounced search input
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

	// Submit review handler
	const submitReview = async (e) => {
		e.preventDefault();
		
		if (!selectedProduct) {
		toast.error("Please select a product first");
		return;
		}

		try {
		setIsLoading(true);
		const reviewData = {
			productId: selectedProduct._id,
			rating: review.rating,
			comment: review.comment,
		};

		await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}reviews`,
			reviewData,
			{
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			}
		);

		toast.success("Review submitted successfully!");
		setReview({ rating: 5, comment: "" });
		setSelectedProduct(null);
		setQuery("");
		setProducts([]);
		} catch (error) {
		toast.error(error.response?.data?.message || "Failed to submit review");
		} finally {
		setIsLoading(false);
		}
	};

	// Star rating component
	const StarRating = ({ rating, setRating }) => {
		return (
		<div className="flex items-center space-x-1">
			{[1, 2, 3, 4, 5].map((star) => (
			<button
				key={star}
				type="button"
				onClick={() => setRating(star)}
				className="focus:outline-none"
			>
				<FiStar
				className={`h-6 w-6 ${
					star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
				}`}
				/>
			</button>
			))}
			<span className="ml-2 text-gray-600">{rating}.0</span>
		</div>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
		<div className="max-w-4xl mx-auto">
			{/* Page Header */}
			<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center mb-12"
			>
			<h1 className="text-3xl font-bold text-gray-900 mb-3">
				{selectedProduct ? "Write Your Review" : "Find a Product to Review"}
			</h1>
			<p className="text-gray-600 max-w-2xl mx-auto">
				{selectedProduct
				? `Share your experience with ${selectedProduct.name}`
				: "Search for products you've purchased to leave a review"}
			</p>
			</motion.div>

			{/* Product Search Section */}
			{!selectedProduct && (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="mb-8"
			>
				<div className="max-w-2xl mx-auto relative">
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<FiSearch className="h-5 w-5 text-gray-400" />
					</div>
					<input
					type="text"
					placeholder="Search for products to review..."
					className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
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
				</div>

				{/* Search Results */}
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
						Find products to review
						</h3>
						<p className="text-gray-500">
						Search for products you've purchased to share your experience
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
						We couldn't find any products matching "
						<span className="font-semibold">{query}</span>"
						</p>
					</div>
					</motion.div>
				) : (
					<motion.div
					key="results"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
					>
					{products.map((product) => (
						<motion.div
						key={product._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
						onClick={() => setSelectedProduct(product)}
						>
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0">
							<img
								src={product.image || "/placeholder-product.jpg"}
								alt={product.name}
								className="h-16 w-16 object-cover rounded-md"
							/>
							</div>
							<div className="flex-1 min-w-0">
							<h3 className="text-lg font-medium text-gray-900 truncate">
								{product.name}
							</h3>
							<p className="text-sm text-gray-500 line-clamp-2">
								{product.description}
							</p>
							</div>
						</div>
						</motion.div>
					))}
					</motion.div>
				)}
				</AnimatePresence>
			</motion.div>
			)}

			{/* Review Form Section */}
			{selectedProduct && (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
			>
				<div className="flex items-start mb-6">
				<div className="flex-shrink-0 mr-4">
					<img
					src={selectedProduct.image || "/placeholder-product.jpg"}
					alt={selectedProduct.name}
					className="h-16 w-16 object-cover rounded-md"
					/>
				</div>
				<div>
					<h2 className="text-xl font-semibold text-gray-900">
					{selectedProduct.name}
					</h2>
					<p className="text-gray-500 text-sm line-clamp-2">
					{selectedProduct.description}
					</p>
				</div>
				<button
					onClick={() => setSelectedProduct(null)}
					className="ml-auto text-gray-400 hover:text-gray-600"
				>
					<FiX className="h-5 w-5" />
				</button>
				</div>

				<form onSubmit={submitReview} className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Your Rating
					</label>
					<StarRating
					rating={review.rating}
					setRating={(rating) => setReview({ ...review, rating })}
					/>
				</div>

				<div>
					<label
					htmlFor="comment"
					className="block text-sm font-medium text-gray-700 mb-2"
					>
					Your Review
					</label>
					<textarea
					id="comment"
					name="comment"
					rows={5}
					className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
					placeholder="Share your honest thoughts about this product..."
					value={review.comment}
					onChange={(e) =>
						setReview({ ...review, comment: e.target.value })
					}
					required
					/>
				</div>

				<div className="flex justify-end space-x-3">
					<button
					type="button"
					onClick={() => setSelectedProduct(null)}
					className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
					Back
					</button>
					<button
					type="submit"
					disabled={isLoading}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
					{isLoading ? (
						<>
						<Loading className="mr-2" />
						Submitting...
						</>
					) : (
						<>
						<FiSend className="mr-2 h-4 w-4" />
						Submit Review
						</>
					)}
					</button>
				</div>
				</form>
			</motion.div>
			)}
		</div>
		</div>
	);
}