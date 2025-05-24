import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import  mediaUpload  from '../../utils/mediaUpload'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddProductPage() {

	const [productId, setProductId] = useState('')
	const [name, setName] = useState('')
	const[altNames, setAltNames] = useState('')
	const [description, setDescription] = useState('')
	const [images, setImages] = useState('')
	const [labelledPrice, setLabelledPrice] = useState('')
	const [price, setPrice] = useState('')
	const [stock, setStock] = useState('')
	const navigate = useNavigate()

	async function AddProduct() {

		const token = localStorage.getItem("token")
		if(!token){
			toast.error("Please login first to add product")
			return
		}

		if(images.length<=0){
			toast.error("Please select at least one image")
			return
		}

		const promisesArray = []

		for(let i=0; i<images.length; i++){
			promisesArray[i] = mediaUpload(images[i])
		}
		try{

		const imageURLs = await Promise.all(promisesArray)	
		console.log(imageURLs)

		const altNamesArray = altNames.split(",")

		const product ={
			productId : productId,
			name : name,
			altNames:altNamesArray,
			description : description,
			image:imageURLs,
			labelledPrice : labelledPrice,
			price : price,
			stock : stock,
		}
		axios.post(import.meta.env.VITE_BACKEND_URL + "products", product, {
			headers: {
				"Authorization": "Bearer " +token
			}
		}).then((res) => {
			console.log(res.data)
			toast.success("Product added successfully")
			navigate("/admin/products")
		}).catch((err) => {
			console.log(err)
			toast.error("Error occured while adding product")
		})

	}catch(e){
		console.log(e)
	}
	
	}
	return (
		<div className="w-full h-full flex flex-col justify-center items-center bg-green-900">
			<input type="text" placeholder="Product ID" className="w-[300px] h-[50px] mb-5" value={productId} onChange={(e) => setProductId(e.target.value)} />
			<input type="text" placeholder="Name" className="w-[300px] h-[50px] mb-5" value={name} onChange={(e) => setName(e.target.value)} />	
			<input type="text" placeholder="Alternative Names" className="w-[300px] h-[50px] mb-5" value={altNames} onChange={(e) => setAltNames(e.target.value)} />
			<input type="text" placeholder="Description" className="w-[300px] h-[50px] mb-5" value={description} onChange={(e) => setDescription(e.target.value)} />
			<input type="file" placeholder="Images" className="w-[300px] h-[50px] mb-5" onChange={(e) => setImages(e.target.files)} multiple />
			<input type="text" placeholder="Labelled Price" className="w-[300px] h-[50px] mb-5" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} />
			<input type="text" placeholder="Price" className="w-[300px] h-[50px] mb-5" value={price} onChange={(e) => setPrice(e.target.value)} />
			<input type="text" placeholder="Stock" className="w-[300px] h-[50px] mb-5" value={stock} onChange={(e) => setStock(e.target.value)} />
			<div className="w-full flex justify-center flex flex-row items-center mt-4">
				<Link to="/admin/products" className="bg-red-500 text-white font-bold px-4 py-2 rounded mr-4">Cancel</Link>
				<button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={AddProduct}>Add Product</button>
				
				</div>	
		
		</div>
	)
	

}