import { createClient } from "@supabase/supabase-js";

const url ="https://eojysmwalpplwsgegiqo.supabase.co"
	const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvanlzbXdhbHBwbHdzZ2VnaXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODk1MjcsImV4cCI6MjA2MzU2NTUyN30.ulBxuH3n8IwNh2H9O8pgbeKZFP72yTkyXHBb7dPJ5bM"

const supabase = createClient(url, key)	

export default function mediaUpload(file){

	return new Promise((resolve, reject) => {

		if(file==null) {
			reject("No file selected");
			return;
		}	

		const timestamp = new Date().getTime();
		const newName = timestamp + file.name;
		
		supabase.storage.from("images").upload(newName, file,{
			upsert:false,
			cacheControl:"3600",	
		}).then(() => {
			const publicUrl = supabase.storage.from("images").getPublicUrl(newName).data.publicUrl
			resolve(publicUrl)

		}).catch(() => {
			reject("Error occured in supabase connection")
		})	
	})
}
	

