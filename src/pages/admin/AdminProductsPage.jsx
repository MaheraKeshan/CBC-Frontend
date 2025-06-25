/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const navigate = useNavigate();

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = () => {
		setIsLoading(true);
		axios
		.get(import.meta.env.VITE_BACKEND_URL + "products")
		.then((res) => {
			setProducts(res.data);
			setIsLoading(false);
		})
		.catch(() => {
			toast.error("Failed to load products");
			setIsLoading(false);
		});
	};

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
		direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const sortedProducts = [...products].sort((a, b) => {
		if (sortConfig.key) {
		if (a[sortConfig.key] < b[sortConfig.key]) {
			return sortConfig.direction === 'asc' ? -1 : 1;
		}
		if (a[sortConfig.key] > b[sortConfig.key]) {
			return sortConfig.direction === 'asc' ? 1 : -1;
		}
		}
		return 0;
	});

	const filteredProducts = sortedProducts.filter(product =>
		Object.values(product).some(
		value => value && 
		value.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const deleteProduct = (productId) => {
		if (!window.confirm("Are you sure you want to delete this product?")) return;
		
		const token = localStorage.getItem("token");
		if (!token) {
		toast.error("Please login first");
		return;
		}
		
		axios
		.delete(import.meta.env.VITE_BACKEND_URL + "products/" + productId, {
			headers: { Authorization: "Bearer " + token },
		})
		.then(() => {
			toast.success("Product deleted successfully");
			fetchProducts();
		})
		.catch((e) => {
			toast.error(e.response?.data?.message || "Failed to delete product");
		});
	};

	const getSortIndicator = (key) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === 'asc' ? '↑' : '↓';
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6 font-[var(--font-main)]">
		<div className="max-w-7xl mx-auto">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
			<h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
			<div className="flex items-center space-x-4 mt-4 md:mt-0">
				<div className="relative">
				<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search products..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
				/>
				</div>
				<button
				onClick={fetchProducts}
				className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition"
				title="Refresh"
				>
				<FaSync />
				</button>
			</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
				<p className="text-gray-500">Total Products</p>
				<p className="text-2xl font-bold">{products.length}</p>
			</div>
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
				<p className="text-gray-500">Out of Stock</p>
				<p className="text-2xl font-bold">
				{products.filter(p => p.stock <= 0).length}
				</p>
			</div>
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
				<p className="text-gray-500">Average Price</p>
				<p className="text-2xl font-bold">
				${(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0).toFixed(2)}
				</p>
			</div>
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
				<p className="text-gray-500">Total Value</p>
				<p className="text-2xl font-bold">
				${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
				</p>
			</div>
			</div>

			{/* Products Table */}
			{isLoading ? (
			<div className="w-full h-64 flex justify-center items-center">
				<div className="w-16 h-16 border-4 border-gray-300 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
			</div>
			) : (
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
					<tr>
						<th 
						className="py-3 px-4 text-left font-medium text-gray-500 cursor-pointer"
						onClick={() => handleSort('productId')}
						>
						ID {getSortIndicator('productId')}
						</th>
						<th 
						className="py-3 px-4 text-left font-medium text-gray-500 cursor-pointer"
						onClick={() => handleSort('name')}
						>
						Product {getSortIndicator('name')}
						</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Image</th>
						<th 
						className="py-3 px-4 text-left font-medium text-gray-500 cursor-pointer"
						onClick={() => handleSort('labelledPrice')}
						>
						MRP {getSortIndicator('labelledPrice')}
						</th>
						<th 
						className="py-3 px-4 text-left font-medium text-gray-500 cursor-pointer"
						onClick={() => handleSort('price')}
						>
						Price {getSortIndicator('price')}
						</th>
						<th 
						className="py-3 px-4 text-left font-medium text-gray-500 cursor-pointer"
						onClick={() => handleSort('stock')}
						>
						Stock {getSortIndicator('stock')}
						</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
					</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
					<AnimatePresence>
						{filteredProducts.length > 0 ? (
						filteredProducts.map((item) => (
							<motion.tr
							key={item.productId}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className={`hover:bg-gray-50 transition ${
								item.stock <= 0 ? 'bg-red-50' : ''
							}`}
							>
							<td className="py-4 px-4">{item.productId}</td>
							<td className="py-4 px-4 font-medium">{item.name}</td>
							<td className="py-4 px-4">
								<img
								src={item.image[0]}
								alt={item.name}
								className="w-12 h-12 object-cover rounded-lg"
								/>
							</td>
							<td className="py-4 px-4 text-gray-500 line-through">
								${item.labelledPrice}
							</td>
							<td className="py-4 px-4 font-medium text-green-600">
								${item.price}
							</td>
							<td className="py-4 px-4">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${
								item.stock > 10 
									? 'bg-green-100 text-green-800' 
									: item.stock > 0 
									? 'bg-yellow-100 text-yellow-800' 
									: 'bg-red-100 text-red-800'
								}`}>
								{item.stock} in stock
								</span>
							</td>
							<td className="py-4 px-4">
								<div className="flex space-x-2">
								<button
									onClick={() => deleteProduct(item.productId)}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
									title="Delete"
								>
									<FaTrash size={16} />
								</button>
								<button
									onClick={() =>
									navigate("/admin/edit-product", {
										state: item,
									})
									}
									className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
									title="Edit"
								>
									<FaEdit size={16} />
								</button>
								</div>
							</td>
							</motion.tr>
						))
						) : (
						<tr>
							<td colSpan="7" className="py-8 text-center text-gray-500">
							No products found
							</td>
						</tr>
						)}
					</AnimatePresence>
					</tbody>
				</table>
				</div>
			</div>
			)}

			{/* Floating Add Button */}
			<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className="fixed bottom-6 right-6"
			>
			<Link
				to="/admin/add-product"
				className="bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300 flex items-center"
			>
				<FaPlus className="mr-2" />
				Add Product
			</Link>
			</motion.div>
		</div>
		</div>
	);
}