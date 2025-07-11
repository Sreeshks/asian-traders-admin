import React from 'react';

export default function ProductSection({
  prodLoading,
  editLoading,
  handleAddProduct,
  productForm,
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
      <form className="flex flex-col gap-3" onSubmit={handleAddProduct} encType="multipart/form-data">
        <div className="flex flex-col md:flex-row gap-3">
          <input type="text" name="name" placeholder="Name" value={productForm.name} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
          <input type="text" name="description" placeholder="Description (optional)" value={productForm.description} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" disabled={prodLoading} />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
          <input type="number" name="offerprice" placeholder="Offer Price (optional)" value={productForm.offerprice} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" disabled={prodLoading} />
          <input type="number" name="stock" placeholder="Stock (optional)" value={productForm.stock} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" disabled={prodLoading} />
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* Drag and Drop File Upload */}
          <div className="flex-1 flex flex-col">
            <div
              className={`border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('product-image-input').click()}
              style={{ minHeight: 56 }}
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
                <span className="text-blue-700 font-medium">{productForm.image.name}</span>
              ) : (
                <span className="text-gray-400">Drag & drop image here, or <span className="underline">click to select</span></span>
              )}
            </div>

            {/* ✅ Error below box */}
            {prodError && (
              <div className="text-red-500 text-sm mt-2">
                {prodError}
              </div>
            )}
          </div>
          <select name="categoryid" value={productForm.categoryid} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition self-start md:self-auto" disabled={prodLoading}>Add Product</button>
      </form>

      {/* Product Images Grid (all products) */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">All Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((prod) => (
              <div key={prod._id} className="relative group">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-32 w-full object-cover rounded-lg shadow"
                />
                {/* Product name below image */}
                <p className="text-sm font-medium text-center mt-1 text-gray-700 truncate">
                  {prod.name}
                </p>

                <button
                  className="absolute top-2 right-10 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                  title="Delete"
                  onClick={() => openDeleteDialog('product', prod._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-blue-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                  title="Edit"
                  onClick={() => handleEditProduct(prod)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 001.213 1.213l1-4a4 4 0 01.828-1.414z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
} 