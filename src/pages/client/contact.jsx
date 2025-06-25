/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
	FiMapPin, 
	FiPhone, 
	FiMail, 
	FiClock,
	FiSend,
	FiCheckCircle
	} from "react-icons/fi";
	import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

	export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const [submitted, setSubmitted] = useState(false);

	function handleChange(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		// TODO: Integrate with backend or email service
		setSubmitted(true);
	}

	return (
		<div className="w-full min-h-screen bg-white text-slate-800 overflow-hidden">
		{/* Hero Section */}
		<section className="relative bg-gradient-to-br from-sky-50 to-rose-50 py-20 px-4">
			<div className="max-w-screen-xl mx-auto text-center">
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-4"
			>
				Contact Crystal Beauty
			</motion.h1>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.8 }}
				className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
			>
				We're here to help and answer any questions you might have.
			</motion.p>
			</div>
		</section>

		{/* Main Content */}
		<section className="py-16 px-4">
			<div className="max-w-screen-xl mx-auto">
			{submitted ? (
				<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-xl text-center max-w-2xl mx-auto shadow-sm"
				>
				<FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2">Thank You!</h2>
				<p className="text-lg mb-4">
					Your message has been sent successfully. We'll get back to you soon.
				</p>
				<button
					onClick={() => setSubmitted(false)}
					className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors"
				>
					Send another message
				</button>
				</motion.div>
			) : (
				<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
				className="flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto"
				>
				{/* Contact Form */}
				<motion.div
					initial={{ x: -50 }}
					whileInView={{ x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-slate-100"
				>
					<h2 className="text-2xl font-bold text-sky-700 mb-6">Send Us a Message</h2>
					<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block mb-2 font-medium text-slate-700">
						Your Name
						</label>
						<input
						type="text"
						id="name"
						name="name"
						required
						value={formData.name}
						onChange={handleChange}
						className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
						placeholder="Jane Doe"
						/>
					</div>

					<div>
						<label htmlFor="email" className="block mb-2 font-medium text-slate-700">
						Your Email
						</label>
						<input
						type="email"
						id="email"
						name="email"
						required
						value={formData.email}
						onChange={handleChange}
						className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
						placeholder="jane@example.com"
						/>
					</div>

					<div>
						<label htmlFor="message" className="block mb-2 font-medium text-slate-700">
						Message
						</label>
						<textarea
						id="message"
						name="message"
						required
						rows={6}
						value={formData.message}
						onChange={handleChange}
						className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none transition-all"
						placeholder="Write your message here..."
						/>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
					>
						<FiSend size={18} />
						Send Message
					</motion.button>
					</form>
				</motion.div>

				{/* Contact Details */}
				<motion.div
					initial={{ x: 50 }}
					whileInView={{ x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="flex-1 bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-100"
				>
					<h2 className="text-2xl font-bold text-sky-700 mb-6">Contact Information</h2>
					<p className="text-slate-600 mb-8">
					We'd love to hear from you! Reach out with any questions or feedback.
					</p>

					<ul className="space-y-6 mb-10">
					<li className="flex items-start gap-4">
						<div className="bg-sky-100 p-3 rounded-full text-sky-600">
						<FiMapPin size={20} />
						</div>
						<div>
						<h3 className="font-semibold text-slate-800">Our Location</h3>
						<p className="text-slate-600">123 Crystal St, Beauty City, CA 90210</p>
						</div>
					</li>
					<li className="flex items-start gap-4">
						<div className="bg-sky-100 p-3 rounded-full text-sky-600">
						<FiPhone size={20} />
						</div>
						<div>
						<h3 className="font-semibold text-slate-800">Phone</h3>
						<p className="text-slate-600">+1 (555) 123-4567</p>
						</div>
					</li>
					<li className="flex items-start gap-4">
						<div className="bg-sky-100 p-3 rounded-full text-sky-600">
						<FiMail size={20} />
						</div>
						<div>
						<h3 className="font-semibold text-slate-800">Email</h3>
						<a
							href="mailto:support@crystalbeauty.com"
							className="text-sky-600 hover:underline"
						>
							support@crystalbeauty.com
						</a>
						</div>
					</li>
					<li className="flex items-start gap-4">
						<div className="bg-sky-100 p-3 rounded-full text-sky-600">
						<FiClock size={20} />
						</div>
						<div>
						<h3 className="font-semibold text-slate-800">Hours</h3>
						<p className="text-slate-600">Mon-Fri: 9am - 6pm</p>
						<p className="text-slate-600">Sat-Sun: 10am - 4pm</p>
						</div>
					</li>
					</ul>

					<div>
					<h3 className="font-semibold text-slate-800 mb-4">Follow Us</h3>
					<div className="flex gap-4">
						<a href="#" className="bg-slate-200 hover:bg-blue-100 text-blue-600 p-3 rounded-full transition-colors">
						<FaFacebook size={18} />
						</a>
						<a href="#" className="bg-slate-200 hover:bg-pink-100 text-pink-600 p-3 rounded-full transition-colors">
						<FaInstagram size={18} />
						</a>
						<a href="#" className="bg-slate-200 hover:bg-sky-100 text-sky-500 p-3 rounded-full transition-colors">
						<FaTwitter size={18} />
						</a>
					</div>
					</div>
				</motion.div>
				</motion.div>
			)}
			</div>
		</section>

		{/* Map Section */}
		<section className="px-4 pb-20">
			<div className="max-w-screen-xl mx-auto rounded-xl overflow-hidden shadow-xl border border-slate-200">
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291865!2d-73.9878449245376!3d40.74844047138971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1711237897725!5m2!1sen!2sus"
				width="100%"
				height="400"
				style={{ border: 0 }}
				allowFullScreen=""
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				className="rounded-xl"
			></iframe>
			</div>
		</section>
		</div>
	);
}