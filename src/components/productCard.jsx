import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
	return (
		<Link to={"/overview/" +product.productId} className="w-[300px] h-[450px] bg-white shadow-lg rounded-xl m-4 overflow-hidden flex flex-col">
			{/* Product Image */}
			<div className="h-[180px] bg-gray-100 flex items-center justify-center">
				<img
					src={product.image?.[0] || "/placeholder.png"}
					alt={product.name}
					className="h-full object-contain"
				/>
			</div>

			{/* Product Details */}
			<div className="p-4 flex flex-col flex-grow">
				<h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
				<p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

				<div className="mt-auto">
					{/* Price Section */}
					<div className="flex items-center gap-2 mt-2">
						<span className="text-green-600 font-bold text-lg">${product.price.toFixed(2)}</span>
						{product.labelledPrice > product.price && (
							<span className="line-through text-sm text-gray-400">${product.labelledPrice.toFixed(2)}</span>
						)}
					</div>

					{/* Stock Status */}
					<p className={`mt-1 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
						{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
					</p>

					{/* Buy Now Button */}
					<button
						disabled={product.stock === 0}
						className={`mt-3 w-full py-2 text-white font-semibold rounded-lg transition-all ${
							product.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
						}`}
					>
						Buy Now
					</button>
				</div>
			</div>
		</Link>
	);
}
