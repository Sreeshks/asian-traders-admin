import React, { useState, useEffect, useRef } from 'react';

export default function ProductSection({
  prodLoading,
  editLoading,
  handleAddProduct,
  productForm,
  setProductForm,
  handleProductInput,
  handleFileInput,
  dragActive,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  categories,
  openDeleteDialog,
  handleEditProduct,
  products,
  prodError
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // Function to create preview URLs for secondary images
  const createImagePreview = (file) => {
    return URL.createObjectURL(file);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Handle category selection
  const handleCategorySelect = (categoryId, categoryName) => {
    setProductForm(prev => ({
      ...prev,
      categoryid: categoryId
    }));
    setCategorySearch(categoryName);
    setShowCategoryDropdown(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="mb-10 relative" id="products-section">
      {/* Loader Overlay for Products Section */}
      {(prodLoading || editLoading) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-blue-600 font-semibold mt-4 text-lg">
              {editLoading ? 'Updating product...' : 'Loading products...'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {editLoading ? 'Please wait while we update your product' : 'Please wait while we fetch your products'}
            </p>
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Product</h3>
      <form className="flex flex-col gap-6" onSubmit={handleAddProduct} encType="multipart/form-data">
        <div className="flex flex-col md:flex-row gap-3">
          <input type="text" name="name" placeholder="Name" value={productForm.name} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
          <input type="text" name="description" placeholder="Description (optional)" value={productForm.description} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" disabled={prodLoading} />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
          <input type="number" name="offerprice" placeholder="Offer Price (optional)" value={productForm.offerprice} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" disabled={prodLoading} />
          <input type="number" name="stock" placeholder="Stock (optional)" value={productForm.stock} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" disabled={prodLoading} />
        </div>
        
        {/* Main Image Upload */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-3">Main Image *</label>
            <div
              data-upload-type="main"
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('product-image-input').click()}
            >
              <input
                id="product-image-input"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={prodLoading}
              />
              
              {productForm.image ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(productForm.image)}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg shadow-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductForm(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-blue-700 font-medium text-sm">{productForm.image.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">Upload Main Image</p>
                    <p className="text-gray-500 text-sm">Drag & drop your main image here, or <span className="text-blue-500 underline">click to browse</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Category Selection with Search */}
          <div className="flex-1 relative" ref={categoryDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search and select category..."
                value={categorySearch}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  setShowCategoryDropdown(true);
                }}
                onFocus={() => setShowCategoryDropdown(true)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                disabled={prodLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Category Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {/* Search within dropdown */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  {/* Category List */}
                  <div className="py-1">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategorySelect(cat.id, cat.name)}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                        >
                          <span className="text-gray-700">{cat.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No categories found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Category Display */}
            {productForm.categoryid && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Selected:</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {categories.find(cat => cat.id === productForm.categoryid)?.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setProductForm(prev => ({ ...prev, categoryid: '' }));
                    setCategorySearch('');
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Images Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Secondary Images (Optional - Max 3)</label>
          <div 
            data-upload-type="secondary"
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
              dragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('secondary-images-input').click()}
          >
            <input
              id="secondary-images-input"
              type="file"
              name="secondary_images"
              accept="image/*"
              multiple
              onChange={handleProductInput}
              className="hidden"
              disabled={prodLoading}
            />
            
            {productForm.secondary_images && productForm.secondary_images.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Add More Images</p>
                    <p className="text-sm text-gray-500">Drag & drop or click to add more images</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Add Additional Images</p>
                    <p className="text-sm text-gray-500">Drag & drop your images here, or <span className="text-blue-500 underline">click to browse</span></p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Secondary Images Preview */}
            {productForm.secondary_images && productForm.secondary_images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Images ({productForm.secondary_images.length}/3)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {productForm.secondary_images.map((file, index) => (
                    <div key={index} className="relative group flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={createImagePreview(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-blue-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProductForm(prev => ({
                              ...prev,
                              secondary_images: prev.secondary_images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600 transition-colors opacity-80 hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 truncate w-24 text-center">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {prodError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-sm">{prodError}</p>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 self-start md:self-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
          disabled={prodLoading}
        >
          {prodLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Adding Product...
            </div>
          ) : (
            'Add Product'
          )}
        </button>
      </form>

      {/* Product Images Grid (all products) */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">All Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((prod) => (
              <div key={prod._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleProductClick(prod)}
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="bg-white bg-opacity-90 rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition-all duration-200"
                      title="Delete"
                      onClick={() => openDeleteDialog('product', prod._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      className="bg-white bg-opacity-90 rounded-full p-2 shadow-md hover:bg-blue-500 hover:text-white transition-all duration-200"
                      title="Edit"
                      onClick={() => handleEditProduct(prod)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 001.213 1.213l1-4a4 4 0 01.828-1.414z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 truncate">{prod.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{prod.description}</p>
                  
                  {/* Secondary Images Preview */}
                  {prod.secondary_images && prod.secondary_images.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Additional Images:</p>
                      <div className="flex gap-1">
                        {prod.secondary_images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${prod.name} - Image ${index + 1}`}
                            className="w-8 h-8 object-cover rounded border border-gray-200"
                          />
                        ))}
                        {prod.secondary_images.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{prod.secondary_images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Price Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-blue-600">${prod.price}</span>
                      {prod.offerprice && (
                        <span className="text-sm text-green-600 ml-2">${prod.offerprice}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Stock: {prod.stock || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl mx-4 relative transform transition-all duration-300 scale-100 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 z-10"
              onClick={closeProductModal}
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-600 text-lg">{selectedProduct.description}</p>
            </div>

            {/* Product Images */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-6">Product Images</h4>
              
              {/* Main Image */}
              <div className="mb-6">
                <h5 className="text-lg font-medium text-gray-600 mb-4">Main Image</h5>
                <div className="flex justify-center">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Secondary Images */}
              {selectedProduct.secondary_images && selectedProduct.secondary_images.length > 0 && (
                <div>
                  <h5 className="text-lg font-medium text-gray-600 mb-4">Additional Images</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {selectedProduct.secondary_images.map((image, index) => (
                      <div key={index} className="flex justify-center">
                        <img
                          src={image}
                          alt={`${selectedProduct.name} - Image ${index + 1}`}
                          className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">Product Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Price:</span>
                    <span className="text-2xl font-bold text-blue-600">${selectedProduct.price}</span>
                  </div>
                  {selectedProduct.offerprice && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Offer Price:</span>
                      <span className="text-xl font-bold text-green-600">${selectedProduct.offerprice}</span>
                    </div>
                  )}
                  {selectedProduct.stock && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Stock:</span>
                      <span className="text-lg font-semibold">{selectedProduct.stock}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Category:</span>
                    <span className="text-lg font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {categories.find(cat => cat.id === selectedProduct.categoryid)?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8">
              <button
                type="button"
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                onClick={closeProductModal}
              >
                Close
              </button>
              <button
                type="button"
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                onClick={() => {
                  closeProductModal();
                  handleEditProduct(selectedProduct);
                }}
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 