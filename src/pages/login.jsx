import axios from "axios"
import { useState } from 'react';	
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
	

export default function LoginPage() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	async function handleLogin() {
		try{
			const response = await 			   
			axios.post(import.meta.env.VITE_BACKEND_URL + "users/login", {
						email: email,
						password: password
					})
					toast.success("Login successful")
					console.log(response.data)
					localStorage.setItem('token', response.data.token)
					if(response.data.role === 'admin'){
						navigate('/admin')	
					}else{
						navigate('/')
					}
					
					
					
				
					
		}catch(e){
			toast.error(e.response.data.message)
		}
		
	}
    return (
		<div className="w-full h-screen bg-[url('/login.jpg')] bg-cover bg-center flex justify-evenly items-center">
			<div className="w-[50%] h-full">

			</div>
			<div className="w-[50%] h-full flex justify-center items-center">	
					<div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">	
						<input onChange={(e)=>{
							setEmail(e.target.value)
						}}
						
						value={email}

						className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px]"></input>
						<input onChange={(e)=>{
							setPassword(e.target.value)
						}}

						value={password}

						type="password" className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px]"></input>
						<button onClick={handleLogin} className="w-[300px] h-[50px] bg-[#c3efe9] rounded-[20px] text-bold text-white mb-[20px] cursor-pointer">Login</button>
					</div>	

			</div>
		</div>
		
)} 