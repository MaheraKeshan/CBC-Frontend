/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { FiEye, FiPrinter, FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

Modal.setAppElement('#root');

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeOrder, setActiveOrder] = useState(null);

	const [filterStatus, setFilterStatus] = useState("all");

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = () => {
		setIsLoading(true);
		const token = localStorage.getItem("token");
		if (!token) {
		toast.error("Please login first");
		setIsLoading(false);
		return;
		}
		
		axios.get(import.meta.env.VITE_BACKEND_URL + "orders", {
		headers: { Authorization: "Bearer " + token },
		})
		.then((res) => {
		setOrders(res.data);
		setIsLoading(false);
		})
		.catch((e) => {
		toast.error(e.response?.data?.message || "Error fetching orders");
		setIsLoading(false);
		});
	};

	const updateOrderStatus = async (orderId, newStatus) => {
		try {
		const token = localStorage.getItem("token");
		await axios.put(
			`${import.meta.env.VITE_BACKEND_URL}orders/${orderId}/${newStatus}`,
			{},
			{ headers: { Authorization: "Bearer " + token } }
		);
		
		setOrders(orders.map(order => 
			order.orderId === orderId ? { ...order, status: newStatus } : order
		));
		
		if (activeOrder?.orderId === orderId) {
			setActiveOrder({ ...activeOrder, status: newStatus });
		}
		
		toast.success(`Order status updated to ${newStatus}`);
		} catch (e) {
		toast.error("Failed to update order status");
		console.error(e);
		}
	};

	const filteredOrders = orders.filter(order => 
		filterStatus === "all" || order.status === filterStatus
	);

	const getStatusColor = (status) => {
		switch(status) {
		case 'pending': return 'bg-yellow-100 text-yellow-800';
		case 'completed': return 'bg-green-100 text-green-800';
		case 'cancelled': return 'bg-red-100 text-red-800';
		case 'returned': return 'bg-purple-100 text-purple-800';
		default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
		<div className="max-w-7xl mx-auto">
			{/* Header and Controls */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
			<h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
			<div className="flex items-center space-x-4 mt-4 md:mt-0">
				<div className="relative">
				<select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
				>
					<option value="all">All Orders</option>
					<option value="pending">Pending</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
					<option value="returned">Returned</option>
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<FiChevronDown className="text-gray-400" />
				</div>
				</div>
				<button
				onClick={fetchOrders}
				className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
				title="Refresh orders"
				>
				<FiRefreshCw className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
				</button>
			</div>
			</div>

			{/* Orders Table */}
			{isLoading ? (
			<div className="flex justify-center items-center h-64">
				<Loading />
			</div>
			) : (
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
				<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
					<tr>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Order ID</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Customer</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Amount</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
						<th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
					</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
					{filteredOrders.length > 0 ? (
						filteredOrders.map((order) => (
						<motion.tr 
							key={order.orderId}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="hover:bg-gray-50"
						>
							<td className="py-4 px-4 font-medium text-gray-900">{order.orderId}</td>
							<td className="py-4 px-4">
							<div className="font-medium">{order.name}</div>
							<div className="text-sm text-gray-500">{order.email}</div>
							</td>
							<td className="py-4 px-4 text-gray-700">
							{new Date(order.date).toLocaleDateString("en-GB")}
							</td>
							<td className="py-4 px-4 font-medium">
							{order.total.toLocaleString("en-LK", {
								style: "currency",
								currency: "LKR",
							})}
							</td>
							<td className="py-4 px-4">
							<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
								{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
							</span>
							</td>
							<td className="py-4 px-4">
							<div className="flex space-x-2">
								<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => {
									setActiveOrder(order);
									setIsModalOpen(true);
								}}
								className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
								title="View details"
								>
								<FiEye />
								</motion.button>
							</div>
							</td>
						</motion.tr>
						))
					) : (
						<tr>
						<td colSpan="6" className="py-8 text-center text-gray-500">
							No orders found
						</td>
						</tr>
					)}
					</tbody>
				</table>
				</div>
			</div>
			)}

			{/* Order Details Modal - Preserving your original transparency */}
			<Modal
			isOpen={isModalOpen}
			onRequestClose={() => setIsModalOpen(false)}
			className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-10 p-6 outline-none"
			overlayClassName="fixed inset-0 bg-[#00000040] flex justify-center items-center"
			>
			{activeOrder && (
				<div className="space-y-4">
				<h2 className="text-2xl font-bold text-[var(--color-accent)]">
					Order Details - {activeOrder.orderId}
				</h2>
				<div className="grid grid-cols-2 gap-4">
					<div>
					<p>
						<span className="font-semibold">Name:</span>{" "}
						{activeOrder.name}
					</p>
					<p>
						<span className="font-semibold">Email:</span>{" "}
						{activeOrder.email}
					</p>
					<p>
						<span className="font-semibold">Phone:</span>{" "}
						{activeOrder.phone}
					</p>
					<p>
						<span className="font-semibold">Address:</span>{" "}
						{activeOrder.address}
					</p>
					</div>
					<div>
					<p>
						<span className="font-semibold">Status:</span>{" "}
						<span
						className={`font-bold ${
							activeOrder.status === "pending"
							? "text-yellow-500"
							: activeOrder.status === "completed"
							? "text-green-600"
							: "text-red-500"
						}`}
						>
						{activeOrder.status.toUpperCase()}
						</span>
						<select
						onChange={async (e) => {
							const updatedValue = e.target.value;
							await updateOrderStatus(activeOrder.orderId, updatedValue);
						}}
						className="ml-2 border rounded p-1 text-sm"
						>
						<option selected disabled>
							Change status
						</option>
						<option value="pending">Pending</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
						<option value="returned">Returned</option>
						</select>
					</p>
					<p>
						<span className="font-semibold">Date:</span>{" "}
						{new Date(activeOrder.date).toLocaleDateString("en-GB")}
					</p>
					<p>
						<span className="font-semibold">Total:</span>{" "}
						{activeOrder.total.toLocaleString("en-LK", {
						style: "currency",
						currency: "LKR",
						})}
					</p>
					<p>
						<span className="font-semibold">Labelled Total:</span>{" "}
						{activeOrder.labelledTotal.toLocaleString("en-LK", {
						style: "currency",
						currency: "LKR",
						})}
					</p>
					</div>
				</div>

				<h3 className="text-xl font-semibold mt-4">Products</h3>
				<table className="w-full text-center border border-gray-200 shadow rounded">
					<thead className="bg-[var(--color-accent)] text-white">
					<tr>
						<th className="py-2 px-2">Image</th>
						<th className="py-2 px-2">Product</th>
						<th className="py-2 px-2">Price</th>
						<th className="py-2 px-2">Quantity</th>
						<th className="py-2 px-2">Subtotal</th>
					</tr>
					</thead>
					<tbody>
					{activeOrder.products.map((item, idx) => (
						<tr
						key={idx}
						className={`${
							idx % 2 === 0
							? "bg-[var(--color-primary)]"
							: "bg-gray-100"
						}`}
						>
						<td className="py-2 px-2">
							<img
							src={item.productInfo.image[0]}
							alt={item.productInfo.name}
							className="w-12 h-12 object-cover rounded"
							/>
						</td>
						<td className="py-2 px-2">{item.productInfo.name}</td>
						<td className="py-2 px-2">
							{item.productInfo.price.toLocaleString("en-LK", {
							style: "currency",
							currency: "LKR",
							})}
						</td>
						<td className="py-2 px-2">{item.quantity}</td>
						<td className="py-2 px-2">
							{(
							item.productInfo.price * item.quantity
							).toLocaleString("en-LK", {
							style: "currency",
							currency: "LKR",
							})}
						</td>
						</tr>
					))}
					</tbody>
				</table>
				<div className="flex justify-end space-x-4">
					<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => window.print()}
					className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-secondary)] transition flex items-center"
					>
					<FiPrinter className="mr-2" /> Print
					</motion.button>
					<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setIsModalOpen(false)}
					className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
					>
					Close
					</motion.button>
				</div>
				</div>
			)}
			</Modal>
		</div>
		</div>
	);
}