import { useState } from 'react'
import mediaUpload from '../utils/mediaUpload.jsx';



export default function TestPage() {

	const[image, setImage] = useState(null)	


	function fileUpload() {
		mediaUpload(image).then((res) => {
			console.log(res)
		}).catch((res) => {
			console.log(res)
		})

		
	}	

	
	
	return (
		<div className="w-full h-screen flex flex-col justify-center items-center">
			<input type="file" className="file-input file-input-bordered w-full max-w-xs" 
			onChange={(e) => {
				setImage(e.target.files[0])
			}}/>
			<button className="bg-green-500 text-white font-bold py-2 px-4 rounded"onClick={fileUpload}>Upload</button>
			
		</div>
	)
} 