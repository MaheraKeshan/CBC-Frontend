import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import mediaUpload from '../../utils/mediaUpload'
import axios from 'axios'

export default function EditProductPage() {
	const location = useLocation()

	const [productId] = useState(location.state.productId)
	const [name, setName] = useState(location.state.name)
	const [altNames, setAltNames] = useState(location.state.altNames.join(", "))
	const [description, setDescription] = useState(location.state.description)
	const [images, setImages] = useState('')
	const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
	const [price, setPrice] = useState(location.state.price)
	const [stock, setStock] = useState(location.state.stock)
	const navigate = useNavigate()

	async function EditProduct() {
		const token = localStorage.getItem("token")
		if (!token) {
			toast.error("Please login first")
			return
		}

		let imageURLs = location.state.image

		try {
			if (images.length > 0) {
				const uploadPromises = Array.from(images).map(file => mediaUpload(file))
				imageURLs = await Promise.all(uploadPromises)
			}

			const updatedProduct = {
				productId,
				name,
				altNames: altNames.split(","),
				description,
				image: imageURLs,
				labelledPrice,
				price,
				stock,
			}

			await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}products/${productId}`,
				updatedProduct,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			)

			toast.success("Product updated successfully")
			navigate("/admin/products")
		} catch (err) {
			console.error(err)
			toast.error("Error while updating product")
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-900 px-4 py-10">
			<div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-10">
				<h2 className="text-3xl font-bold text-center text-green-700 mb-8">Edit Product</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<input
						type="text"
						disabled
						placeholder="Product ID"
						className="input-style bg-gray-100 text-gray-600 cursor-not-allowed"
						value={productId}
					/>
					<input
						type="text"
						placeholder="Name"
						className="input-style"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Alternative Names (comma separated)"
						className="input-style"
						value={altNames}
						onChange={(e) => setAltNames(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Description"
						className="input-style"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<input
						type="file"
						className="w-full file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-green-100 file:text-green-700 border border-gray-300 rounded-md"
						onChange={(e) => setImages(e.target.files)}
						multiple
					/>
					<input
						type="text"
						placeholder="Labelled Price"
						className="input-style"
						value={labelledPrice}
						onChange={(e) => setLabelledPrice(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Price"
						className="input-style"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Stock"
						className="input-style"
						value={stock}
						onChange={(e) => setStock(e.target.value)}
					/>
				</div>

				<div className="flex justify-end gap-4 mt-10">
					<Link
						to="/admin/products"
						className="px-6 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition"
					>
						Cancel
					</Link>
					<button
						onClick={EditProduct}
						className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
					>
						Update Product
					</button>
				</div>
			</div>
		</div>
	)
}
