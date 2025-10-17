// Updated ReviewsPage.js (Frontend)
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiStar, FiSend, FiArrowLeft, FiEdit } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../components/loading";
import Header from "../../components/header";

export default function ReviewsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  // Product search handler
  // Updated product search handler
const handleSearch = useCallback(async (searchQuery) => {
  if (searchQuery.length === 0) {
    setProducts([]);
    setHasSearched(false);
    return;
  }

  setIsLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}products/search/${encodeURIComponent(searchQuery)}`
    );
    
    // Fetch reviews for each product in parallel
    const productsWithReviews = await Promise.all(
      response.data.map(async (product) => {
        try {
          const reviewsResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}reviews/product/${product._id}`
          );
          const reviews = reviewsResponse.data || [];
          
          // Calculate average rating and count
          const averageRating = reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0;
          
          return {
            ...product,
            reviews,
            averageRating: parseFloat(averageRating),
            reviewCount: reviews.length
          };
        } catch (error) {
          console.error(`Error fetching reviews for product ${product._id}:`, error);
          // Return product with empty reviews if there's an error
          return {
            ...product,
            reviews: [],
            averageRating: 0,
            reviewCount: 0
          };
        }
      })
    );
    
    setProducts(productsWithReviews);
    setHasSearched(true);
  } catch (error) {
    toast.error("Error fetching products");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}, []);
  // Debounced search input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        handleSearch(value);
      }, 500)
    );
  };

  const clearSearch = () => {
    setQuery("");
    setProducts([]);
    setHasSearched(false);
    if (typingTimeout) clearTimeout(typingTimeout);
  };

  // Load user reviews and product reviews for selected product
  useEffect(() => {
    if (selectedProduct) {
      loadUserReviews();
      loadProductReviews();
    }
  }, [selectedProduct]);

  const loadUserReviews = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}reviews/user/${selectedProduct._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
   
    setUserReviews(response.data || []);
  } catch (error) {
    console.error("Error loading user reviews:", error);
  }
};
  const loadProductReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}reviews/product/${selectedProduct._id}`
      );
      
      setProductReviews(response.data || []);
    } catch (error) {
      console.error("Error loading product reviews:", error);
      toast.error("Failed to load product reviews");
      setProductReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Submit review handler
  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error("Please select a product first");
      return;
    }

    if (review.comment.trim().length < 10) {
      toast.error("Please write a more detailed review (at least 10 characters)");
      return;
    }

    try {
      setIsLoading(true);
      
      const reviewData = {
        productId: selectedProduct._id,
        rating: review.rating,
        comment: review.comment,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Review submitted successfully!");
      setReview({ rating: 5, comment: "" });
      loadUserReviews();
      loadProductReviews();
    } catch (error) {
      console.error("Review submission error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Please log in to submit a review");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate average rating for product
  const calculateAverageRating = () => {
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  // Star rating component
  const StarRating = ({ rating, setRating, disabled = false, size = "md" }) => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && setRating(star)}
            className={`focus:outline-none ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={disabled}
          >
            <FiStar
              className={`${starSize} ${
                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className={`ml-2 text-gray-600 ${size === "sm" ? "text-sm" : ""}`}>
          {rating}.0
        </span>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="pt-30 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {selectedProduct ? "Write Your Review" : "Find a Product to Review"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {selectedProduct
              ? `Share your experience with ${selectedProduct.name}`
              : "Search for products you've purchased to leave a review"}
          </p>
        </motion.div>

        {/* Product Search Section */}
        {!selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products to review..."
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  value={query}
                  onChange={handleInputChange}
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {query.length === 0 && !hasSearched ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="max-w-md mx-auto">
                    <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Find products to review
                    </h3>
                    <p className="text-gray-500">
                      Search for products you've purchased to share your experience
                    </p>
                  </div>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-64"
                >
                  <Loading />
                </motion.div>
              ) : products.length === 0 && hasSearched ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="max-w-md mx-auto">
                    <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500">
                      We couldn't find any products matching "
                      <span className="font-semibold">{query}</span>"
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product.image || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {product.description}
                          </p>
                          {product.category && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                              {product.category}
                            </span>
                          )}
                          {product.averageRating > 0 && (
                            <div className="flex items-center mt-1">
                              <FiStar className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm text-gray-600 ml-1">
                                {product.averageRating.toFixed(1)} ({product.reviewCount || 0} reviews)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Review Form Section */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6"
          >
            <div className="flex items-start mb-6">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setUserReviews([]);
                  setProductReviews([]);
                  setReview({ rating: 5, comment: "" });
                }}
                className="mr-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-shrink-0 mx-4">
                <img
                  src={selectedProduct.image || "/placeholder-product.jpg"}
                  alt={selectedProduct.name}
                  className="h-16 w-16 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {selectedProduct.description}
                </p>
                {selectedProduct.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                    {selectedProduct.category}
                  </span>
                )}
                {/* Updated: Show calculated average rating from reviews */}
                <div className="flex items-center mt-1">
                  <FiStar className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">
                    {calculateAverageRating()} ({productReviews.length} reviews)
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setUserReviews([]);
                  setProductReviews([]);
                  setReview({ rating: 5, comment: "" });
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <StarRating
                  rating={review.rating}
                  setRating={(rating) => setReview({ ...review, rating })}
                />
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={5}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                  placeholder="Share your honest thoughts about this product..."
                  value={review.comment}
                  onChange={(e) =>
                    setReview({ ...review, comment: e.target.value })
                  }
                  required
                  minLength={10}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {review.comment.length}/500 characters (minimum 10 required)
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setUserReviews([]);
                    setProductReviews([]);
                    setReview({ rating: 5, comment: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || review.comment.trim().length < 10}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loading className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* User's Reviews Section */}
        {selectedProduct && userReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Reviews</h3>
            <div className="space-y-4">
              {userReviews.map((userReview) => (
                <div key={userReview._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarRating rating={userReview.rating} disabled={true} size="sm" />
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDate(userReview.date)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{userReview.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Product Reviews Section - UPDATED */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews ({productReviews.length})
              </h3>
              {productReviews.length > 0 && (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">
                    {calculateAverageRating()}
                  </span>
                  <div className="flex flex-col">
                    <StarRating rating={parseFloat(calculateAverageRating())} disabled={true} size="sm" />
                    <span className="text-sm text-gray-500">
                      Based on {productReviews.length} review{productReviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loading />
              </div>
            ) : productReviews.length === 0 ? (
              <div className="text-center py-8">
                <FiStar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                <p className="text-gray-500">
                  Be the first to review {selectedProduct.name}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {productReviews.map((productReview) => (
                  <div key={productReview._id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {productReview.userName || 'Anonymous User'}
                        </h4>
                        <div className="flex items-center mt-1">
                          <StarRating rating={productReview.rating} disabled={true} size="sm" />
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDate(productReview.date)}
                          </span>
                        </div>
                      </div>
                      {productReview.verifiedPurchase && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    {productReview.title && (
                      <h5 className="font-medium text-gray-900 mb-2">{productReview.title}</h5>
                    )}
                    <p className="text-gray-700 leading-relaxed">{productReview.comment}</p>
                    
                    {/* Review helpfulness section (optional) */}
                    <div className="flex items-center mt-3 space-x-4">
                      <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                        Helpful?
                      </button>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        Was this review helpful?
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}