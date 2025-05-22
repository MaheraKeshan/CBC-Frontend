import UserData from "./userdata";


export default function Header() {
	console.log("Header component rendered")
	return (
		<div className= "bg-red-500">
			<Link to="/">Home</Link>
			<Link to="/login">Login</Link>
			<Link to="/signup">Sign Up</Link>
			
		</div>
	)
	// <header>
}