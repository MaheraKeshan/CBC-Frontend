import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header.jsx';
import ProductCard from './components/productCard.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import SignupPage from './pages/signup.jsx';
import AdminPage from './pages/AdminPage.jsx';
import TestPage from './pages/testPage.jsx';
import { Toaster } from 'react-hot-toast';  

function App() {

  return (
    <BrowserRouter>
      <div> 
        <Toaster position='top-right'/>
        {/* <Header /> */}  
        <Routes path="/"> 
          <Route path="/*" element={<Header />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/testing" element={<TestPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
