import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header.jsx';
import ProductCard from './components/productCard.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import AdminPage from './pages/AdminPage.jsx';
import TestPage from './pages/testPage.jsx';
import { Toaster } from 'react-hot-toast';  
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgetPasswordPage from './pages/forgetPassword.jsx';
import ReviewPage from './pages/client/reviews.jsx';
 // ✅ Import ReviewPage

function App() {


  return (
    <GoogleOAuthProvider clientId="1090295728336-hiv3505s2di1ha3983vu2pam96b9becv.apps.googleusercontent.com">
      <BrowserRouter>
        <div> 
          <Toaster position='top-right'/>
          {/* <Header /> */}  
          <Routes> 
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forget" element={<ForgetPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/testing" element={<TestPage />} />
            <Route path="/admin/*" element={<AdminPage />} /> 
            <Route path="/review" element={<ReviewPage />} /> {/* ✅ Added */}
            <Route path="*" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductCard />} />
          </Routes>
        </div>
      </BrowserRouter> 
    </GoogleOAuthProvider>
  );
}

export default App;


//https://eojysmwalpplwsgegiqo.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvanlzbXdhbHBwbHdzZ2VnaXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODk1MjcsImV4cCI6MjA2MzU2NTUyN30.ulBxuH3n8IwNh2H9O8pgbeKZFP72yTkyXHBb7dPJ5bM
