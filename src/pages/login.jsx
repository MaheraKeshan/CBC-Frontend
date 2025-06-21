import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const googleLogin = useGoogleLogin({
		onSuccess: async (response) => {
			const accessToken = response.access_token;
			try {
				const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "users/login/google", {
					accessToken,
				});
				toast.success("Login successful");
				localStorage.setItem("token", res.data.token);
				navigate(res.data.role === "admin" ? "/admin" : "/");
			} catch (error) {
				toast.error(error.response?.data?.message || "Google login failed");
			}
		}
	});

	async function handleLogin() {
		try {
			const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "users/login", {
				email,
				password,
			});
			toast.success("Login successful");
			localStorage.setItem("token", response.data.token);
			navigate(response.data.role === "admin" ? "/admin" : "/");
		} catch (e) {
			toast.error(e.response?.data?.message || "Login failed");
		}
	}

	return (
		<div className="w-full h-screen bg-[url('/login.jpg')] bg-cover bg-center flex justify-end items-center">
			<div className="w-[500px] p-10 mr-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl text-white flex flex-col gap-6 items-center">
				<h2 className="text-3xl font-semibold text-white">Welcome Back</h2>

				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#c3efe9] transition"
				/>

				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#c3efe9] transition"
				/>

				<div className="w-full flex justify-end text-sm">
					<Link to="/forget-password" className="text-[#c3efe9] hover:underline transition">
						Forgot Password?
					</Link>
				</div>

				<button
					onClick={handleLogin}
					className="w-full py-3 bg-[#c3efe9] text-gray-800 font-bold rounded-xl hover:bg-[#a2d9cd] transition"
				>
					Login
				</button>

				<div className="flex items-center w-full gap-2">
					<div className="h-px flex-grow bg-white/30"></div>
					<span className="text-white/60 text-sm">OR</span>
					<div className="h-px flex-grow bg-white/30"></div>
				</div>

				<button
					onClick={googleLogin}
					className="w-full py-3 bg-white text-gray-700 font-semibold flex items-center justify-center gap-3 rounded-xl hover:bg-gray-100 transition"
				>
					<GrGoogle className="text-xl" />
					<span>Login with Google</span>
				</button>

				<p className="text-sm text-white/80">
					Don't have an account?{" "}
					<Link to="/signup" className="text-[#c3efe9] hover:underline transition">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
