/* eslint-disable no-unused-vars */
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import mediaUpload from '../../utils/mediaUpload'
import axios from 'axios'
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function EditProductPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Form state
  const [productId] = useState(location.state.productId)
  const [name, setName] = useState(location.state.name)
  const [altNames, setAltNames] = useState(location.state.altNames.join(", "))
  const [description, setDescription] = useState(location.state.description)
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState(location.state.image)
  const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
  const [price, setPrice] = useState(location.state.price)
  const [stock, setStock] = useState(location.state.stock)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviewUrls])
  }

  // Remove image from preview
  const removeImage = (index) => {
    const newPreviews = [...previewImages]
    newPreviews.splice(index, 1)
    setPreviewImages(newPreviews)
    
    // Also remove from upload queue if it's a new image
    if (index >= location.state.image.length) {
      const newImages = [...images]
      newImages.splice(index - location.state.image.length, 1)
      setImages(newImages)
    }
  }

  async function handleEditProduct() {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login first")
      return
    }

    setIsSubmitting(true)

    try {
      let imageURLs = [...location.state.image]
      
      // Upload new images if any
      if (images.length > 0) {
        const uploadPromises = images.map(file => mediaUpload(file))
        const newImageURLs = await Promise.all(uploadPromises)
        imageURLs = [...imageURLs, ...newImageURLs]
      }

      // Filter out removed images (keep only the ones still in preview)
      const finalImageURLs = imageURLs.filter((_, index) => 
        previewImages.includes(imageURLs[index]) || 
        index >= location.state.image.length
      )

      const updatedProduct = {
        productId,
        name,
        altNames: altNames.split(",").map(s => s.trim()).filter(s => s),
        description,
        image: finalImageURLs,
        labelledPrice: Number(labelledPrice),
        price: Number(price),
        stock: Number(stock),
      }

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}products/${productId}`,
        updatedProduct,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )

      toast.success("Product updated successfully")
      navigate("/admin/products")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error while updating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/admin/products"
                className="flex items-center text-white hover:text-gray-200 transition"
              >
                <FiArrowLeft className="mr-2" />
                Back to Products
              </Link>
              <h2 className="text-2xl font-bold text-white">Edit Product</h2>
              <div className="w-6"></div> {/* Spacer for alignment */}
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product ID (disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                <input
                  type="text"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={productId}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Alt Names */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Names</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  value={altNames}
                  onChange={(e) => setAltNames(e.target.value)}
                  placeholder="Comma separated list (e.g., Model X, Pro Version)"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  rows={3}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                
                {/* Image preview grid */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File upload */}
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Price*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    value={labelledPrice}
                    onChange={(e) => setLabelledPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity*</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <Link
                to="/admin/products"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <motion.button
                type="button"
                onClick={handleEditProduct}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Product"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}