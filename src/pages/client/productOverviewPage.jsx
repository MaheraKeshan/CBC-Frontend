import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart } from "../../utils/cart";
import StarRating from "../../components/StarRating";


export default function ProductOverviewPage({ currentUser }) {
    const params = useParams();
    const productId = params.id;
    const [status, setStatus] = useState("loading");
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("newest");
    const reviewsPerPage = 5;

    const [reviewForm, setReviewForm] = useState({
        rating: 0,
        comment: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}products/${productId}`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}reviews/${productId}`),
                ]);
                
                setProduct(productRes.data);
                sortReviews(reviewsRes.data, sortOption);
                setStatus("success");
            } catch (error) {
                console.error(error);
                setStatus("error");
                toast.error("Error fetching product details");
            }
        };

        fetchProduct();
    }, [productId]);

    const sortReviews = (reviewsToSort, option) => {
        const sorted = [...reviewsToSort];
        switch (option) {
            case "newest":
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "highest":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case "lowest":
                sorted.sort((a, b) => a.rating - b.rating);
                break;
            default:
                break;
        }
        setReviews(sorted);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!reviewForm.rating) {
            toast.error("Please select a rating");
            return;
        }
        
        if (!reviewForm.comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        try {
            setReviewLoading(true);
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}reviews`,
                {
                    productId,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                    userName: `${currentUser.firstName} ${currentUser.lastName}`,
                    userEmail: currentUser.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            // Refresh reviews
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}reviews/${productId}`
            );
            sortReviews(data, sortOption);
            setReviewForm({ rating: 0, comment: "" });
            toast.success("Review submitted successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setReviewLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}reviews/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            setReviews(reviews.filter((r) => r._id !== reviewId));
            toast.success("Review deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete review");
        }
    };

    const handleHelpfulVote = async (reviewId, isHelpful) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}reviews/${reviewId}/vote`,
                { isHelpful },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            
            setReviews(reviews.map(review => {
                if (review._id === reviewId) {
                    return {
                        ...review,
                        helpfulYes: isHelpful ? (review.helpfulYes || 0) + 1 : review.helpfulYes,
                        helpfulNo: !isHelpful ? (review.helpfulNo || 0) + 1 : review.helpfulNo
                    };
                }
                return review;
            }));
        } catch (error) {
            toast.error("Failed to submit vote");
            console.error(error);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    if (status === "loading") return <Loading />;
    if (status === "error") return <div className="container mx-auto py-10 text-center">Error loading product</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Main Section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Product Images */}
                <div className="lg:w-1/2">
                    <ImageSlider images={product.image} />
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {product.name}
                            {product.altNames.length > 0 && (
                                <span className="text-xl text-gray-500 ml-2">
                                    ({product.altNames.join(", ")})
                                </span>
                            )}
                        </h1>

                        <div className="flex items-center mb-4">
                            <StarRating rating={calculateAverageRating()} />
                            <span className="ml-2 text-gray-600">
                                {calculateAverageRating()} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>

                        <p className="text-gray-500 text-sm mb-4">Product ID: {product.productId}</p>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        <div className="mb-6">
                            {product.labelledPrice > product.price ? (
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold text-accent">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="ml-3 text-xl text-gray-400 line-through">
                                        ${product.labelledPrice.toFixed(2)}
                                    </span>
                                    <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                        {Math.round((1 - product.price / product.labelledPrice) * 100)}% OFF
                                    </span>
                                </div>
                            ) : (
                                <span className="text-3xl font-bold text-accent">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                                onClick={() => {
                                    addToCart(product, 1);
                                    toast.success("Added to cart!");
                                }}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                                onClick={() => {
                                    navigate("/checkout", {
                                        state: {
                                            cart: [
                                                {
                                                    productId: product.productId,
                                                    name: product.name,
                                                    image: product.images[0],
                                                    price: product.price,
                                                    labelledPrice: product.labelledPrice,
                                                    qty: 1,
                                                },
                                            ],
                                        },
                                    });
                                }}
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium text-gray-800 mb-2">Highlights</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {product.highlights?.map((highlight, i) => (
                                    <li key={i}>{highlight}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                        <select 
                            className="border rounded p-2 text-sm"
                            value={sortOption}
                            onChange={(e) => {
                                setSortOption(e.target.value);
                                sortReviews(reviews, e.target.value);
                            }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                        </select>
                    </div>

                    {/* Review Form */}
                    {currentUser && (
                        <div className="mb-8 border-b pb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Write a Review</h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Rating</label>
                                    <StarRating
                                        editable={true}
                                        rating={reviewForm.rating}
                                        onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Review</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        rows="4"
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        placeholder="Share your thoughts about this product..."
                                        maxLength={500}
                                    ></textarea>
                                    <div className="text-right text-sm text-gray-500">
                                        {reviewForm.comment.length}/500 characters
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={reviewLoading}
                                    className="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-6 rounded-md transition duration-300 disabled:opacity-50"
                                >
                                    {reviewLoading ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div>
                        {currentReviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        ) : (
                            <div className="space-y-6">
                                {currentReviews.map((review) => (
                                    <div key={review._id} className="border-b pb-4 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{review.userName}</h4>
                                                <div className="flex items-center">
                                                    <StarRating rating={review.rating} />
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {new Date(review.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            {(currentUser?.email === review.userEmail || currentUser?.role === "admin") && (
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-2">{review.comment}</p>
                                        <div className="flex items-center mt-2">
                                            <span className="text-sm text-gray-600 mr-2">Was this helpful?</span>
                                            <button 
                                                className="text-sm text-green-600 hover:text-green-800 mr-2"
                                                onClick={() => handleHelpfulVote(review._id, true)}
                                            >
                                                Yes ({review.helpfulYes || 0})
                                            </button>
                                            <button 
                                                className="text-sm text-red-600 hover:text-red-800"
                                                onClick={() => handleHelpfulVote(review._id, false)}
                                            >
                                                No ({review.helpfulNo || 0})
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {reviews.length > reviewsPerPage && (
                        <div className="flex justify-center mt-6">
                            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-accent text-white' : 'bg-gray-200'}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-2">Specifications</h3>
                        <ul className="space-y-2">
                            {Object.entries(product.specifications || {}).map(([key, value]) => (
                                <li key={key} className="flex">
                                    <span className="text-gray-600 w-1/3">{key}:</span>
                                    <span className="text-gray-800">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-800 mb-2">Additional Information</h3>
                        <ul className="space-y-2">
                            {Object.entries(product.additionalInfo || {}).map(([key, value]) => (
                                <li key={key} className="flex">
                                    <span className="text-gray-600 w-1/3">{key}:</span>
                                    <span className="text-gray-800">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
    );
}