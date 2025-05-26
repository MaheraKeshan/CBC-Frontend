import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import  mediaUpload  from '../../utils/mediaUpload'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'


export default function EditProductPage() {

	const location = useLocation() // to access the state passed from the previous page
	const [productId, setProductId] = useState(location.state.productId);
	const [name, setName] = useState(location.state.name);
	const[altNames, setAltNames] = useState(location.state.altNames.join(", "))
	const [description, setDescription] = useState(location.state.description)
	const [images, setImages] = useState('')
	const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
	const [price, setPrice] = useState(location.state.price)
	const [stock, setStock] = useState(location.state.stock)
	const navigate = useNavigate()
	
	console.log(location)

	async function EditProduct() {

		const token = localStorage.getItem("token")
		if(!token){
			toast.error("Please login first to add product")
			return
		}

		let imageURLs = location.state.image;

		const promisesArray = []

		for(let i=0; i<images.length; i++){
			promisesArray[i] = mediaUpload(images[i])
		}
		try{

		if(images.length > 0){
			imageURLs = await Promise.all(promisesArray)
		}
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
		axios.put(import.meta.env.VITE_BACKEND_URL + "products/" + productId, product, {
			headers: {
				"Authorization": "Bearer " +token
			}
		}).then((res) => {
			console.log(res.data)
			toast.success("Product update successfully")
			navigate("/admin/products")
		}).catch((err) => {
			console.log(err)
			toast.error("Error occured while editing product")
		})

	}catch(e){
		console.log(e)
	}
	
	}
	return (
		<div className="w-full h-full flex flex-col justify-center items-center bg-green-900">
			<input type="text" disabled placeholder="Product ID" className="w-[300px] h-[50px] mb-5" value={productId} onChange={(e) => setProductId(e.target.value)} />
			<input type="text" placeholder="Name" className="w-[300px] h-[50px] mb-5" value={name} onChange={(e) => setName(e.target.value)} />	
			<input type="text" placeholder="Alternative Names" className="w-[300px] h-[50px] mb-5" value={altNames} onChange={(e) => setAltNames(e.target.value)} />
			<input type="text" placeholder="Description" className="w-[300px] h-[50px] mb-5" value={description} onChange={(e) => setDescription(e.target.value)} />
			<input type="file" placeholder="Images" className="w-[300px] h-[50px] mb-5" onChange={(e) => setImages(e.target.files)} multiple />
			<input type="text" placeholder="Labelled Price" className="w-[300px] h-[50px] mb-5" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} />
			<input type="text" placeholder="Price" className="w-[300px] h-[50px] mb-5" value={price} onChange={(e) => setPrice(e.target.value)} />
			<input type="text" placeholder="Stock" className="w-[300px] h-[50px] mb-5" value={stock} onChange={(e) => setStock(e.target.value)} />
			<div className="w-full flex justify-center flex flex-row items-center mt-4">
				<Link to="/admin/products" className="bg-red-500 text-white font-bold px-4 py-2 rounded mr-4">Cancel</Link>
				<button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={EditProduct}>Update Product</button>
				
				</div>	
		
		</div>
	)
	

}