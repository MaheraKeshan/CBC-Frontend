/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../../components/productCard'
import { motion } from 'framer-motion'

export default function ProductPage() {
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {  
		const fetchProducts = async () => {
		try {
			const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "products")
			setProducts(response.data)
		} catch (err) {
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
		}
		
		if (isLoading) {
		fetchProducts()
		}
	}, [isLoading])

	// Animation variants
	const container = {
		hidden: { opacity: 0 },
		show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
		}
	}

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
	}

	if (error) {
		return (
		<div className="flex items-center justify-center h-screen">
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			<strong>Error:</strong> {error}
			</div>
		</div>
		)
	}

	if (isLoading) {
		return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col items-center">
			<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			<p className="mt-4 text-gray-600">Loading products...</p>
			</div>
		</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div className="max-w-7xl mx-auto">
			{/* Page Header */}
			<motion.div 
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="text-center mb-12"
			>
			<h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
				Our Products
			</h1>
			<p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
				Discover our high-quality selection
			</p>
			</motion.div>

			{/* Product Grid */}
			{products.length > 0 ? (
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
			>
				{products.map((product) => (
				<motion.div key={product.productId} variants={item}>
					<ProductCard product={product} />
				</motion.div>
				))}
				{products.map((product) => (
				<motion.div key={product.productId} variants={item}>
					<ProductCard product={product} />
				</motion.div>
				))}
			</motion.div>

			
			
			) : (
			<div className="text-center py-12">
				<p className="text-gray-500 text-lg">No products available at the moment.</p>
			</div>
			)}

			{/* Floating Action Button */}
			<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className="fixed bottom-8 right-8"
			>
			<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg flex items-center">
				<svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
				</svg>
				Filter
			</button>
			</motion.div>
		</div>
		</div>
	)
}