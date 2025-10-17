import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";

export default function ProductCard({ product }) {
	return (
		<div className="group w-full max-w-[320px] h-[480px] bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 hover:border-gray-200 relative mx-4">

		<div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
			<button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
			<FiHeart className="text-gray-600 hover:text-red-500" />
			</button>
			<button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
			<FiEye className="text-gray-600 hover:text-blue-500" />
			</button>
		</div>


		<div className="relative w-full h-[220px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
			<img
			src={product.image?.[0] || "/placeholder.png"}
			alt={product.name}
			className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
			/>

			{/* Stock Badge */}
			<span
			className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${
				product.stock > 0
				? "bg-green-100 text-green-700"
				: "bg-red-100 text-red-600"
			}`}
			>
			{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
			</span>

			{/* Discount Badge */}
			{product.labelledPrice > product.price && (
			<span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
				{Math.round(
				((product.labelledPrice - product.price) / product.labelledPrice) * 100
				)}% OFF
			</span>
			)}
		</div>

		{/* Product Details */}
		<div className="p-5 flex flex-col flex-grow">
			<div className="mb-2">
			<span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
				{product.category}
			</span>
			</div>
			
			<Link to={`/overview/${product.productId}`} className="flex-grow">
			<h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
				{product.name}
			</h2>
			<p className="text-sm text-gray-500 mb-4 line-clamp-2">
				{product.description}
			</p>
			</Link>

			{/* Rating */}
			<div className="flex items-center mb-4">
			<div className="flex">
				{[...Array(5)].map((_, i) => (
				<svg
					key={i}
					className={`w-4 h-4 ${
					i < (product.rating || 0)
						? "text-yellow-400"
						: "text-gray-300"
					}`}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
				))}
			</div>
			<span className="text-xs text-gray-500 ml-1">
				({product.reviewCount || 0} reviews)
			</span>
			</div>

			{/* Price Section */}
			<div className="mt-auto">
			<div className="flex items-center gap-2 mb-3">
				<span className="text-xl font-bold text-gray-900">
				${product.price.toFixed(2)}
				</span>
				{product.labelledPrice > product.price && (
				<span className="line-through text-sm text-gray-400">
					${product.labelledPrice.toFixed(2)}
				</span>
				)}
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2">
				<button
				disabled={product.stock === 0}
				className={`flex-1 py-3 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
					product.stock > 0
					? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
					: "bg-gray-300 text-gray-500 cursor-not-allowed"
				}`}
				>
				<FiShoppingCart />
				{product.stock > 0 ? "Add to Cart" : "Unavailable"}
				</button>
				<Link
				to={`/overview/${product.productId}`}
				className="flex-1 py-3 text-center font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
				>
				View Details
				</Link>
			</div>
			</div>
		</div>
		</div>
	);
}