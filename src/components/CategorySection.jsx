import React from 'react';

export default function CategorySection({
  categorySearch,
  setCategorySearch,
  categoryName,
  setCategoryName,
  showAddInput,
  setShowAddInput,
  handleAddCategory,
  catLoading,
  catError,
  filteredCategories,
  openDeleteDialog,
  selectedCategory,
  setSelectedCategory,
  filteredProducts,
  handleEditProduct,
  addCategoryInputRef,
  products, // 👈 ADD THIS

}) {
  return (
    <section className="mb-10 relative" id="categories-section">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-xl p-8 mb-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full opacity-30 translate-y-12 -translate-x-12"></div>

        {/* Title and Description */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Category Management</h2>
              <p className="text-gray-600 mt-1">Organize your products with custom categories</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                className="w-full px-6 py-4 pl-12 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none shadow-lg transition-all duration-300 text-lg"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Add Category Section */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Add Category Input */}
            <form className="flex-1 flex flex-col sm:flex-row gap-3" onSubmit={handleAddCategory}>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter new category name..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none shadow-lg transition-all duration-300 text-lg"
                  disabled={catLoading}
                  ref={addCategoryInputRef}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={catLoading}
              >
                {catLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  'Add Category'
                )}
              </button>
            </form>

            {/* Stats */}
            <div className="flex gap-4 text-center">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">{filteredCategories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-2xl font-bold text-green-600">{filteredProducts.length}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {catError && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{catError}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Your Categories
        </h3>

        {catLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
              <p className="text-blue-600 font-semibold mt-6 text-xl">Loading categories...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your categories</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No categories yet</h4>
            <p className="text-gray-500 mb-6">Create your first category to start organizing products</p>
            <button
              onClick={() => addCategoryInputRef.current?.focus()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => (
              <div
                key={cat.id}
                className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-2 ${selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-blue-200'
                  }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    onClick={() => openDeleteDialog('category', cat.id)}
                    disabled={catLoading}
                    title="Delete category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Category Name */}
                <h4 className="text-xl font-bold text-gray-800 mb-3">{cat.name}</h4>

                {/* Category Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {products.filter(prod => {

                        const catId = typeof prod.categoryid === 'object' ? prod.categoryid._id : prod.categoryid;
                        return catId === cat.id;
                      }).length} products
                    </span>
                  </div>
                  {selectedCategory === cat.id && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Selected
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${selectedCategory === cat.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    onClick={() => {
                      // Toggle selection
                      if (selectedCategory === cat.id) {
                        // Deselect
                        setSelectedCategory(null);
                      } else {
                        // Select
                        setSelectedCategory(cat.id);
                      }
                    }}
                  >
                    {selectedCategory === cat.id ? 'Viewing' : 'View Products'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid for Selected Category */}
      {selectedCategory && (
        <div className="bg-white rounded-3xl shadow-xl p-8 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Products in "{filteredCategories.find(cat => cat.id === selectedCategory)?.name}"
              </h3>
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No products in this category</h4>
              <p className="text-gray-500">Add some products to this category to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.map((prod, idx) => (
                <div
                  key={prod._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Action Buttons */}
                    <div className="absolute inset-0 pointer-events-none">
                      <button
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                        title="Delete"
                        onClick={() => openDeleteDialog('product', prod._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
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
                  <div className="p-3">
                    <h5 className="font-semibold text-gray-800 text-sm truncate mb-1">{prod.name}</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold text-sm">${prod.price}</span>
                      {prod.stock && (
                        <span className="text-xs text-gray-500">Stock: {prod.stock}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
} 