import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import mediaUpload from '../../utils/mediaUpload'
import axios from 'axios'

export default function AddProductPage() {

	const [productId, setProductId] = useState('')
	const [name, setName] = useState('')
	const [altNames, setAltNames] = useState('')
	const [description, setDescription] = useState('')
	const [images, setImages] = useState('')
	const [labelledPrice, setLabelledPrice] = useState('')
	const [price, setPrice] = useState('')
	const [stock, setStock] = useState('')
	const navigate = useNavigate()

	async function AddProduct() {
		const token = localStorage.getItem("token")
		if (!token) {
			toast.error("Please login first to add product")
			return
		}
		if (!images || images.length <= 0) {
			toast.error("Please select at least one image")
			return
		}

		const uploadPromises = []
		for (let i = 0; i < images.length; i++) {
			uploadPromises.push(mediaUpload(images[i]))
		}

		try {
			const imageURLs = await Promise.all(uploadPromises)
			const altNamesArray = altNames.split(",")

			const product = {
				productId,
				name,
				altNames: altNamesArray,
				description,
				image: imageURLs,
				labelledPrice,
				price,
				stock,
			}

			await axios.post(`${import.meta.env.VITE_BACKEND_URL}products`, product, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})

			toast.success("Product added successfully")
			navigate("/admin/products")
		} catch (err) {
			console.error(err)
			toast.error("Error occurred while adding product")
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-900 px-4 py-10">
			<div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-10">
				<h2 className="text-3xl font-bold text-center text-green-700 mb-8">Add New Product</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<input
						type="text"
						placeholder="Product ID"
						className="input-style"
						value={productId}
						onChange={(e) => setProductId(e.target.value)}
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
						onClick={AddProduct}
						className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
					>
						Add Product
					</button>
				</div>
			</div>
		</div>
	)
}
