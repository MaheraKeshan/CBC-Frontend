/* eslint-disable no-unused-vars */
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import mediaUpload from '../../utils/mediaUpload'
import axios from 'axios'
import { FiUpload, FiX, FiArrowLeft, FiDollarSign, FiPackage, FiTag } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function AddProductPage() {
	const [formData, setFormData] = useState({
		productId: '',
		name: '',
		altNames: '',
		description: '',
		images: [],
		previewImages: [],
		labelledPrice: '',
		price: '',
		stock: ''
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
		...prev,
		[name]: value
		}))
	}

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files)
		setFormData(prev => ({
		...prev,
		images: files
		}))
		
		// Create preview URLs
		const newPreviewUrls = files.map(file => URL.createObjectURL(file))
		setFormData(prev => ({
		...prev,
		previewImages: newPreviewUrls
		}))
	}

	const removeImage = (index) => {
		const newPreviews = [...formData.previewImages]
		newPreviews.splice(index, 1)
		setFormData(prev => ({
		...prev,
		previewImages: newPreviews,
		images: prev.images.filter((_, i) => i !== index)
		}))
	}

	async function handleAddProduct() {
		const token = localStorage.getItem("token")
		if (!token) {
		toast.error("Please login first to add product")
		return
		}
		if (!formData.images || formData.images.length <= 0) {
		toast.error("Please select at least one image")
		return
		}

		setIsSubmitting(true)

		try {
		const uploadPromises = formData.images.map(file => mediaUpload(file))
		const imageURLs = await Promise.all(uploadPromises)

		const product = {
			productId: formData.productId,
			name: formData.name,
			altNames: formData.altNames.split(",").map(s => s.trim()).filter(s => s),
			description: formData.description,
			image: imageURLs,
			labelledPrice: Number(formData.labelledPrice),
			price: Number(formData.price),
			stock: Number(formData.stock),
		}

		await axios.post(`${import.meta.env.VITE_BACKEND_URL}products`, product, {
			headers: {
			Authorization: "Bearer " + token,
			},
		})

		toast.success(<span className="font-medium">Product added successfully!</span>, {
			style: {
			background: '#4CAF50',
			color: '#fff',
			},
			icon: '🎉'
		})
		navigate("/admin/products")
		} catch (err) {
		console.error(err)
		toast.error(<span className="font-medium">{err.response?.data?.message || "Error adding product"}</span>, {
			style: {
			background: '#F44336',
			color: '#fff',
			}
		})
		} finally {
		setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
		<div className="max-w-4xl mx-auto">
			<motion.div 
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
			>
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 border-b border-indigo-500/30">
				<div className="flex items-center justify-between">
				<motion.button
					whileHover={{ x: -3 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => navigate('/admin/products')}
					className="flex items-center text-white/90 hover:text-white transition"
				>
					<FiArrowLeft className="mr-2" />
					<span className="font-medium">Back to Products</span>
				</motion.button>
				<h2 className="text-2xl font-bold text-white tracking-wide">
					Add New Product
				</h2>
				<div className="w-6"></div> {/* Spacer for alignment */}
				</div>
			</div>

			{/* Form */}
			<div className="p-6 sm:p-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Product ID */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Product ID <span className="text-red-500">*</span>
					</label>
					<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<FiTag className="text-gray-400" />
					</div>
					<input
						type="text"
						name="productId"
						required
						className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
						value={formData.productId}
						onChange={handleChange}
						placeholder="PROD-001"
					/>
					</div>
				</div>

				{/* Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Product Name <span className="text-red-500">*</span>
					</label>
					<input
					type="text"
					name="name"
					required
					className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
					value={formData.name}
					onChange={handleChange}
					placeholder="Premium Product Name"
					/>
				</div>

				{/* Alt Names */}
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Alternative Names
					</label>
					<input
					type="text"
					name="altNames"
					className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
					value={formData.altNames}
					onChange={handleChange}
					placeholder="Comma separated names (e.g., Model X, Pro Version)"
					/>
				</div>

				{/* Description */}
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Description <span className="text-red-500">*</span>
					</label>
					<textarea
					rows={4}
					name="description"
					required
					className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
					value={formData.description}
					onChange={handleChange}
					placeholder="Detailed product description..."
					/>
				</div>

				{/* Images */}
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Product Images <span className="text-red-500">*</span>
					</label>
					
					{/* Image preview grid */}
					{formData.previewImages.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
						{formData.previewImages.map((img, index) => (
						<motion.div 
							key={index} 
							className="relative group"
							whileHover={{ scale: 1.03 }}
						>
							<img
							src={img}
							alt={`Preview ${index + 1}`}
							className="w-full h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
							/>
							<motion.button
							type="button"
							onClick={() => removeImage(index)}
							className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
							whileHover={{ scale: 1.1 }}
							>
							<FiX size={14} />
							</motion.button>
						</motion.div>
						))}
					</div>
					)}

					{/* File upload */}
					<motion.label 
					className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer bg-blue-50 hover:border-blue-500 transition group"
					whileHover={{ y: -2 }}
					>
					<div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition">
						<FiUpload className="w-6 h-6 text-blue-500" />
					</div>
					<p className="text-sm text-gray-600 text-center">
						<span className="font-medium text-blue-600">Click to upload</span> or drag and drop
					</p>
					<p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max 5MB each)</p>
					<input
						type="file"
						className="hidden"
						onChange={handleImageChange}
						multiple
						accept="image/*"
					/>
					</motion.label>
				</div>

				{/* Pricing */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Market Price <span className="text-red-500">*</span>
					</label>
					<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<FiDollarSign className="text-gray-400" />
					</div>
					<input
						type="number"
						name="labelledPrice"
						required
						min="0"
						step="0.01"
						className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
						value={formData.labelledPrice}
						onChange={handleChange}
						placeholder="99.99"
					/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Selling Price <span className="text-red-500">*</span>
					</label>
					<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<FiDollarSign className="text-gray-400" />
					</div>
					<input
						type="number"
						name="price"
						required
						min="0"
						step="0.01"
						className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
						value={formData.price}
						onChange={handleChange}
						placeholder="79.99"
					/>
					</div>
				</div>

				{/* Stock */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Stock Quantity <span className="text-red-500">*</span>
					</label>
					<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<FiPackage className="text-gray-400" />
					</div>
					<input
						type="number"
						name="stock"
						required
						min="0"
						className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
						value={formData.stock}
						onChange={handleChange}
						placeholder="100"
					/>
					</div>
				</div>
				</div>

				{/* Action buttons */}
				<div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
				<motion.button
					type="button"
					onClick={() => navigate('/admin/products')}
					whileHover={{ x: -3 }}
					whileTap={{ scale: 0.95 }}
					className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
				>
					Cancel
				</motion.button>
				<motion.button
					type="button"
					onClick={handleAddProduct}
					disabled={isSubmitting}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-70 shadow-lg"
				>
					{isSubmitting ? (
					<span className="flex items-center justify-center">
						<svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Adding...
					</span>
					) : (
					<span className="font-medium tracking-wide">Add Product</span>
					)}
				</motion.button>
				</div>
			</div>
			</motion.div>
		</div>
		</div>
	)
}