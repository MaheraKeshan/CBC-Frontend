import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiMinus, BiPlus, BiTrash, BiArrowBack } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [cart, setCart] = useState(location.state?.cart || []);
	const [formData, setFormData] = useState({
		phoneNumber: "",
		address: "",
		paymentMethod: "cash",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getTotal = () => {
		return cart.reduce((total, item) => total + item.price * item.qty, 0);
	};

	const removeFromCart = (index) => {
		const newCart = [...cart];
		newCart.splice(index, 1);
		setCart(newCart);
		toast.success("Item removed from cart");
	};

	const changeQty = (index, qty) => {
		const newCart = [...cart];
		const newQty = newCart[index].qty + qty;

		if (newQty <= 0) {
		removeFromCart(index);
		return;
		}

		newCart[index].qty = newQty;
		setCart(newCart);
		toast.success("Quantity updated");
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const placeOrder = async () => {
		if (!formData.phoneNumber || !formData.address) {
		toast.error("Please fill all required fields");
		return;
		}

		const token = localStorage.getItem("token");
		if (!token) {
		toast.error("Please login to place order");
		navigate("/login", { state: { from: location } });
		return;
		}

		setIsSubmitting(true);

		try {
		const orderItems = cart.map(item => ({
			productId: item.productId,
			qty: item.qty
		}));

		const res = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}orders`,
			{
			products: orderItems,
			phone: formData.phoneNumber,
			address: formData.address,
			paymentMethod: formData.paymentMethod
			},
			{
			headers: {
				Authorization: `Bearer ${token}`,
			},
			}
		);

		toast.success("Order placed successfully!");
		navigate("/order-confirmation", { state: { order: res.data } });
		} catch (err) {
		console.error(err);
		toast.error(err.response?.data?.message || "Error placing order");
		} finally {
		setIsSubmitting(false);
		}
	};

	if (cart.length === 0) {
		return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
			<FiShoppingBag className="text-gray-300 text-6xl mb-4" />
			<h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
			<p className="text-gray-500 mb-6 text-center">
			Looks like you haven't added anything to your cart yet
			</p>
			<Link
			to="/products"
			className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
			>
			Continue Shopping
			</Link>
		</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<button
			onClick={() => navigate(-1)}
			className="flex items-center text-gray-600 hover:text-accent mb-6 transition-colors"
		>
			<BiArrowBack className="mr-2" /> Back to Cart
		</button>

		<h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

		<div className="flex flex-col lg:flex-row gap-8">
			{/* Order Summary */}
			<div className="lg:w-2/3">
			<div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
				<h2 className="text-xl font-medium text-gray-900 p-4 border-b">Order Summary</h2>
				
				{cart.map((item, index) => (
				<div key={`${item.productId}-${index}`} className="grid grid-cols-12 p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
					{/* Product Info */}
					<div className="col-span-12 md:col-span-5 flex items-center">
					<img 
						src={item.image} 
						alt={item.name}
						className="w-20 h-20 object-cover rounded-lg mr-4"
					/>
					<div>
						<h3 className="font-medium text-gray-900">{item.name}</h3>
						<p className="text-sm text-gray-500">{item.productId}</p>
					</div>
					</div>

					{/* Price */}
					<div className="col-span-4 md:col-span-2 flex items-center md:justify-center mt-4 md:mt-0">
					{item.labelledPrice > item.price ? (
						<div className="flex flex-col">
						<span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
						<span className="text-sm text-gray-400 line-through">${item.labelledPrice.toFixed(2)}</span>
						</div>
					) : (
						<span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
					)}
					</div>

					{/* Quantity */}
					<div className="col-span-4 md:col-span-3 flex items-center justify-center mt-4 md:mt-0">
					<div className="flex items-center border rounded-md">
						<button
						onClick={() => changeQty(index, -1)}
						className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
						disabled={item.qty <= 1}
						>
						<BiMinus />
						</button>
						<span className="px-4 py-1 text-gray-900">{item.qty}</span>
						<button
						onClick={() => changeQty(index, 1)}
						className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
						>
						<BiPlus />
						</button>
					</div>
					</div>

					{/* Total */}
					<div className="col-span-4 md:col-span-2 flex items-center justify-end mt-4 md:mt-0">
					<span className="font-medium text-gray-900">
						${(item.price * item.qty).toFixed(2)}
					</span>
					<button 
						onClick={() => removeFromCart(index)}
						className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
					>
						<BiTrash />
					</button>
					</div>
				</div>
				))}
			</div>

			{/* Shipping Information */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-medium text-gray-900 mb-6">Shipping Information</h2>
				
				<div className="space-y-4">
				<div>
					<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
					Phone Number *
					</label>
					<input
					type="tel"
					id="phoneNumber"
					name="phoneNumber"
					placeholder="Enter your phone number"
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
					value={formData.phoneNumber}
					onChange={handleInputChange}
					required
					/>
				</div>

				<div>
					<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
					Shipping Address *
					</label>
					<textarea
					id="address"
					name="address"
					rows={3}
					placeholder="Enter your complete shipping address"
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
					value={formData.address}
					onChange={handleInputChange}
					required
					/>
				</div>

				<div>
					<label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
					Payment Method
					</label>
					<select
					id="paymentMethod"
					name="paymentMethod"
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
					value={formData.paymentMethod}
					onChange={handleInputChange}
					>
					<option value="cash">Cash on Delivery</option>
					<option value="card">Credit/Debit Card</option>
					<option value="bank">Bank Transfer</option>
					</select>
				</div>
				</div>
			</div>
			</div>

			{/* Order Total */}
			<div className="lg:w-1/3">
			<div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
				<h2 className="text-lg font-medium text-gray-900 mb-6">Order Total</h2>
				
				<div className="space-y-4 mb-6">
				<div className="flex justify-between">
					<span className="text-gray-600">Subtotal</span>
					<span className="text-gray-900">${getTotal().toFixed(2)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-600">Shipping</span>
					<span className="text-gray-900">Free</span>
				</div>
				<div className="flex justify-between border-t pt-4">
					<span className="text-gray-600">Tax</span>
					<span className="text-gray-900">Calculated at checkout</span>
				</div>
				<div className="flex justify-between border-t pt-4">
					<span className="font-medium text-gray-900">Total</span>
					<span className="font-bold text-lg text-accent">${getTotal().toFixed(2)}</span>
				</div>
				</div>

				<button
				onClick={placeOrder}
				disabled={isSubmitting}
				className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 flex justify-center items-center"
				>
				{isSubmitting ? (
					<>
					<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Processing...
					</>
				) : "Place Order"}
				</button>

				<div className="mt-4 text-center text-sm text-gray-500">
				By placing your order, you agree to our <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
				</div>
			</div>
			</div>
		</div>
		</div>
	);
}