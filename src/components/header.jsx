/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsCart3, BsSearch } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Reviews", path: "/review" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`fixed w-full h-20 z-50 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"
      } transition-all duration-300`}
    >
      <div className="container mx-auto h-full px-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSideDrawerOpened(true)}
          className="md:hidden text-2xl text-gray-700"
        >
          <GiHamburgerMenu />
        </motion.button>

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/search" className="text-xl text-gray-700">
              <BsSearch />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/cart" className="text-xl text-gray-700 relative">
              <BsCart3 />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </motion.div>

          {token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="hidden md:flex items-center text-gray-700 gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiLogOut />
              <span>Logout</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center text-gray-700 gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiUser />
              <span>Login</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Side Drawer */}
      <AnimatePresence>
        {sideDrawerOpened && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSideDrawerOpened(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-80 h-full bg-white z-50 shadow-xl"
            >
              <div className="h-20 flex items-center px-4 border-b">
                <button
                  onClick={() => setSideDrawerOpened(false)}
                  className="text-2xl mr-4"
                >
                  &times;
                </button>
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div className="p-4 space-y-6">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.path}
                      className="block text-lg font-medium py-3 border-b border-gray-100"
                      onClick={() => setSideDrawerOpened(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-8">
                  {token ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate("/login");
                        setSideDrawerOpened(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg"
                    >
                      <FiUser />
                      <span>Login</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}