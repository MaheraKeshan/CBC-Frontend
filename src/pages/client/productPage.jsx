import {useEffect, useState} from 'react'
import axios from 'axios'
import ProductCard from '../../components/productCard'

export default function ProductPage(){
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {	
		if (isLoading) {
			axios.get(import.meta.env.VITE_BACKEND_URL + "products").then((res) => {
				setProducts(res.data)
				setIsLoading(false) // stop loading spinner
			    }
		    )
	    }
    },[isLoading] // re-fetch products when isLoading changes	
);
	return (
	<div className='w-full h-screen flex flex-wrap justify-center items-center'>
		{
			products.map((product)=>{
				return(
					<ProductCard key={product.productId} product={product}/>
				)
			})
		}

		{
			products.map((product)=>{
				return(
					<ProductCard key={product.productId} product={product}/>
				)
			})
		}
		
	</div>
	)
}
	
