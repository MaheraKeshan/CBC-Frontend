import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart } from "../../utils/cart";

export default function ProductOverviewPage() {
    const params = useParams();
    const productId = params.id;
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "products/" + productId)
            .then((response) => {
                setProduct(response.data);
                setStatus("success");
            })
            .catch((error) => {
                console.log(error);
                setStatus("error");
                toast.error("Error fetching product details");
            });
    }, [productId]);

    const fetchReviews = (page = 1, limit = 5, sort = 'recent') => {
        setReviewsLoading(true);
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}reviews/${productId}`, {
                params: { page, limit, sort }
            })
            .then((response) => {
                setReviews(response.data.reviews);
                setReviewStats(response.data.ratingStats);
                setReviewsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching reviews:", error);
                setReviewsLoading(false);
                // Don't show error toast as it might not be critical for the page
            });
    };


    const handleAddToCart = () => {
        addToCart(product, 1);
        toast.success("added to cart!");
    };

    const handleBuyNow = () => {
        // Create a temporary cart with just this product
        const tempCart = {
            items: [{
                productId: product.productId,
                name: product.name,
                image: product.images?.[0] || product.image?.[0],
                price: product.price,
                labelledPrice: product.labelledPrice,
                qty: 1,
            }],
            subtotal: product.price,
            total: product.price,
            // Add any other required cart fields
        };

        // Save to localStorage or state management
        localStorage.setItem('tempCheckoutCart', JSON.stringify(tempCart));

        // Navigate to checkout
        navigate("/checkout", { 
            state: { 
                directCheckout: true,
                product: tempCart.items[0] 
            }
        });
    };

    return (
        <>
            {status === "success" && (
                <div className="w-full h-full flex flex-col md:flex-row md:max-h-full md:overflow-y-scroll pt-23">
                    <h1 className="w-full md:hidden block my-8 text-center text-4xl text-secondary font-semibold">
                        {product.name}
                        {product.altNames?.map((altName, index) => (
                            <span key={index} className="text-4xl text-gray-600">
                                {" | " + altName}
                            </span>
                        ))}
                    </h1>
                    <div className="w-full md:w-[50%] md:h-full flex justify-center">
                        <ImageSlider images={product.image} />
                    </div>
                    <div className="w-full md:w-[50%] flex justify-center md:h-full">
                        <div className="w-full md:w-[500px] md:h-[600px] flex flex-col items-center">
                            <h1 className="w-full hidden md:block text-center text-4xl text-secondary font-semibold">
                                {product.name}
                                {product.altNames?.map((altName, index) => (
                                    <span key={index} className="text-4xl text-gray-600">
                                        {" | " + altName}
                                    </span>
                                ))}
                            </h1>
                            <h1 className="w-full text-center my-2 text-md text-gray-600 font-semibold">
                                {product.productId}
                            </h1>
                            <p className="w-full text-center my-2 text-md text-gray-600 font-semibold">
                                {product.description}
                            </p>
                            {product.labelledPrice > product.price ? (
                                <div>
                                    <span className="text-4xl mx-4 text-gray-500 line-through">
                                        {product.labelledPrice.toFixed(2)}
                                    </span>
                                    <span className="text-4xl mx-4 font-bold text-accent">
                                        {product.price.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-4xl mx-4 font-bold text-accent">
                                    {product.price.toFixed(2)}
                                </span>
                            )}
                            <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center mt-4">
                                <button
                                    className="w-[200px] h-[50px] mx-4 cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                                <button
    className="w-[200px] h-[50px] mx-4 cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300"
    onClick={() => {
        // Create cart item structure matching your checkout page expectations
        const cartItem = {
            productId: product._id, // Make sure this matches what your backend expects
            name: product.name,
            image: product.image[0], // Assuming image is an array
            price: product.price,
            labelledPrice: product.labelledPrice,
            qty: 1
        };
        
        navigate("/checkout", {
            state: {
                cart: [cartItem] // Pass as an array with single item
            }
        });
    }}
>
    Buy Now
</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {status === "loading" && <Loading />}
        </>
    );
}