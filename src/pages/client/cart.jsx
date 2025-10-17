import { useState } from "react";
import { addToCart, getCart, getTotal, removeFromCart } from "../../utils/cart";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());

  const updateQuantity = (item, change) => {
    addToCart(item, change);
    setCart(getCart());
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
    setCart(getCart());
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <FiShoppingBag className="text-gray-300 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
        <Link
          to="/products"
          className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 border-b">
              <div className="col-span-5 font-medium text-gray-700">Product</div>
              <div className="col-span-2 font-medium text-gray-700 text-center">Price</div>
              <div className="col-span-3 font-medium text-gray-700 text-center">Quantity</div>
              <div className="col-span-2 font-medium text-gray-700 text-right">Total</div>
            </div>

            {/* Cart Items */}
            {cart.map((item) => (
              <div key={item.productId} className="grid grid-cols-12 p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                {/* Product Info */}
                <div className="col-span-12 md:col-span-5 flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.productId}</p>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="md:hidden text-red-500 hover:text-red-700 text-sm mt-1 flex items-center"
                    >
                      <BiTrash className="mr-1" /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 flex items-center md:justify-center mt-4 md:mt-0">
                  {item.labelledPrice > item.price ? (
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${item.labelledPrice.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                  )}
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-3 flex items-center justify-center mt-4 md:mt-0">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item, -1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      disabled={item.qty <= 1}
                    >
                      <BiMinus />
                    </button>
                    <span className="px-4 py-1 text-gray-900">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <BiPlus />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-end mt-4 md:mt-0">
                  <span className="font-medium text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="hidden md:block ml-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <BiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-lg text-accent">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              state={{ cart }}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex justify-center"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 text-center text-sm text-gray-500">
              or <Link to="/products" className="text-accent hover:underline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}