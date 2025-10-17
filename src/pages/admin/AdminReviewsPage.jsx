/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { FiEye, FiTrash2, FiRefreshCw, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import Modal from "react-modal";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

Modal.setAppElement('#root');

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(null);
  const [filterProduct, setFilterProduct] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }
    
    axios.get(import.meta.env.VITE_BACKEND_URL + "reviews", {
      headers: { Authorization: "Bearer " + token },
    })
    .then((res) => {
      setReviews(res.data.reviews);
      setIsLoading(false);
    })
    .catch((e) => {
      toast.error(e.response?.data?.message || "Error fetching reviews");
      setIsLoading(false);
    });
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "products", {
        headers: { Authorization: "Bearer " + token }
      });
      setProducts(response.data);
    } catch (e) {
      toast.error("Failed to fetch products");
      console.error(e);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}reviews/${reviewId}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      
      setReviews(reviews.filter(review => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (e) {
      toast.error("Failed to delete review");
      console.error(e);
    }
  };

  const filteredReviews = reviews.filter(review => 
    filterProduct === "all" || review.productId === filterProduct
  );

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : "Unknown Product";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Review Management</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="all">All Products</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
            <button
              onClick={fetchReviews}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Refresh reviews"
            >
              <FiRefreshCw className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Reviews Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Product</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">User</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Rating</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Comment</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <motion.tr 
                        key={review._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {getProductName(review.productId)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-gray-500">{review.userEmail}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-gray-600">({review.rating})</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xs truncate">{review.comment}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {new Date(review.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setActiveReview(review);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View details"
                            >
                              <FiEye />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteReview(review._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete review"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        No reviews found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Review Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-10 p-6 outline-none"
          overlayClassName="fixed inset-0 bg-[#00000040] flex justify-center items-center"
        >
          {activeReview && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--color-accent)]">
                Review Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-semibold">Product:</span>{" "}
                    {getProductName(activeReview.productId)}
                  </p>
                  <p>
                    <span className="font-semibold">User:</span>{" "}
                    {activeReview.userName} ({activeReview.userEmail})
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(activeReview.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div>
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">Rating:</span>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < activeReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1">({activeReview.rating}/5)</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mt-4">Full Review</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-line">{activeReview.comment}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteReview(activeReview._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
                >
                  <FiTrash2 className="mr-2" /> Delete Review
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Close
                </motion.button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}