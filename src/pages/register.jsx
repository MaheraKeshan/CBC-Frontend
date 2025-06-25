/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
		...prev,
		[name]: value
		}));
	};

	async function handleRegister(e) {
		e.preventDefault();
		setIsSubmitting(true);
		
		try {
		await axios.post(import.meta.env.VITE_BACKEND_URL + "users", formData);
		toast.success("Registration successful!");
		navigate('/login');
		} catch (e) {
		toast.error(e.response?.data?.message || "Registration failed. Please try again.");
		} finally {
		setIsSubmitting(false);
		}
	}

	// Animation variants
	const container = {
		hidden: { opacity: 0 },
		show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
	};

	return (
		<div className="w-full h-screen bg-[url('/login.jpg')] bg-cover bg-center flex justify-end items-center pr-8 md:pr-16 lg:pr-24">
		<motion.div 
			initial={{ opacity: 0, scale: 0.95, x: 50 }}
			animate={{ opacity: 1, scale: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-md"
		>
			<motion.div 
			variants={container}
			initial="hidden"
			animate="show"
			className="backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10"
			>
			{/* Header */}
			<motion.div 
				className="text-center mb-8"
				variants={item}
			>
				<h1 className="text-3xl font-bold text-white">
				Create Account
				</h1>
				<p className="mt-2 text-blue-100">
				Join our community today
				</p>
			</motion.div>

			{/* Form */}
			<motion.form 
				onSubmit={handleRegister}
				className="space-y-6"
				variants={container}
			>
				<motion.div variants={item}>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<FiUser className="h-5 w-5 text-gray-200" />
					</div>
					<input
					name="firstName"
					onChange={handleChange}
					value={formData.firstName}
					placeholder="First Name"
					className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition backdrop-blur-sm"
					required
					/>
				</div>
				</motion.div>

				<motion.div variants={item}>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<FiUser className="h-5 w-5 text-gray-200" />
					</div>
					<input
					name="lastName"
					onChange={handleChange}
					value={formData.lastName}
					placeholder="Last Name"
					className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition backdrop-blur-sm"
					required
					/>
				</div>
				</motion.div>

				<motion.div variants={item}>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<FiMail className="h-5 w-5 text-gray-200" />
					</div>
					<input
					name="email"
					type="email"
					onChange={handleChange}
					value={formData.email}
					placeholder="Email"
					className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition backdrop-blur-sm"
					required
					/>
				</div>
				</motion.div>

				<motion.div variants={item}>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<FiLock className="h-5 w-5 text-gray-200" />
					</div>
					<input
					name="password"
					type="password"
					onChange={handleChange}
					value={formData.password}
					placeholder="Password"
					className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition backdrop-blur-sm"
					required
					minLength="6"
					/>
				</div>
				</motion.div>

				<motion.div variants={item} className="pt-2">
				<motion.button
					type="submit"
					disabled={isSubmitting}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full bg-blue-500/90 hover:bg-blue-600/90 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
				>
					{isSubmitting ? (
					<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					) : (
					<>
						Register
						<FiArrowRight className="ml-2" />
					</>
					)}
				</motion.button>
				</motion.div>
			</motion.form>

			{/* Footer */}
			<motion.div 
				className="mt-6 text-center"
				variants={item}
			>
				<p className="text-gray-200">
				Already have an account?{' '}
				<motion.button
					onClick={() => navigate('/login')}
					className="text-blue-300 font-medium hover:text-white focus:outline-none"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Sign in
				</motion.button>
				</p>
			</motion.div>
			</motion.div>
		</motion.div>
		</div>
	);
}