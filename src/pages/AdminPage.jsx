import { Link, Routes, Route } from 'react-router-dom';
import AdminProductsPage from './admin/AdminProductsPage.jsx';
import AddProductPage from './admin/addProductPage.jsx';
import EditProductPage from './admin/editProductPage.jsx';	


export default function AdminPage() {
	return (
		<div className='w-full h-screen flex'>
			{/* Sidebar */}
			<div className='w-[300px] h-full flex flex col bg-gray-200'>	
				<Link to="products">Products</Link>
				<Link to="orders">Orders</Link>
				<Link to="users">Users</Link>
				<Link to="reviews">Reviews</Link>
			</div>

			{/* Main content */}
			<div className='h-full w-[calc(100%-300px)]'>
				<Routes path="/">	
					<Route path="/products" element={<AdminProductsPage />} />
					<Route path="/orders" element={<h1>Orders</h1>} />
					<Route path="/users" element={<h1>Users</h1>} />
					<Route path="/reviews" element={<h1>Reviews</h1>} />
					<Route path="/add-product" element={<AddProductPage/>} />
					<Route path="/edit-product" element={<EditProductPage/>} />
				</Routes>
			</div>
		</div>
	);
}
