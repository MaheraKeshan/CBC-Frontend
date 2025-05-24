import { useState } from 'react'
import { sampleProducts } from '../../assets/sampleDAta'
import axios from 'axios'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminProductsPage() {
	const [products, setProducts] = useState(sampleProducts)
	
	useEffect(
		() => {
			axios.get(import.meta.env.VITE_BACKEND_URL + "products").then((res) => {
				console.log(res.data)
				setProducts(res.data)
			});

	}
	,[]
);
	
	return (
		<div className = "w-full h-full max-h-full overflow-y-scroll relative" >
			<Link to="/admin/add-product" className="absolute bottom-5 right-5 bg-green-500 text-white text-xl px-4 py-2 rounded cursor-pointer">+</Link>
			<table className="w-full text-center">
				<thead>
					<tr>
						<th>Product 
							ID</th>
						<th>Name</th>
						<th>Image</th>
						
						<th>Labelled Price</th>
						<th>Price</th>
						<th>Stock</th>
						
					</tr>
				</thead>
				<tbody> 
					{products.map((item, index) => {
						return(
							<tr key={index}>
								<td>{item.productId}</td>
								<td>{item.name}</td>
								<td><img src={item.image[0]} className="w-[50px] h-[50px]"></img></td>
								<td>{item.labelledPrice}</td>
								<td>{item.price}</td>
								<td>{item.stock}</td>
							
						</tr>
						)
						
					
					})}
				</tbody>
			</table>
			
		</div>
	)
}	