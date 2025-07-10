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
  filteredProducts,
  handleEditProduct,
  addCategoryInputRef
}) {
  return (
    <section className="mb-10 relative" id="categories-section">
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-6 mb-8 relative overflow-hidden">
        {/* Accent bar and title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-2"></div>
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">Category Management</h2>
        </div>
        {/* Category Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none shadow-md transition-all duration-200"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400"
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
        {/* Add Category Floating Button (mobile) */}
        <button
          type="button"
          className="md:hidden fixed bottom-8 right-8 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl hover:bg-blue-700 transition-all duration-200"
          onClick={() => setShowAddInput((v) => !v)}
          style={{ display: showAddInput ? 'none' : undefined }}
          aria-label="Add Category"
        >
          +
        </button>
        {/* Add Category Input (inline on desktop, floating on mobile) */}
        {(showAddInput || window.innerWidth >= 768) && (
          <form className="flex flex-col md:flex-row gap-3 mb-2 animate-fadeIn" onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="Add new category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none shadow-md"
              disabled={catLoading}
              ref={addCategoryInputRef}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition" disabled={catLoading}>Add</button>
            {window.innerWidth < 768 && (
              <button type="button" className="text-gray-400 px-4 py-2 rounded-xl hover:bg-gray-100 transition" onClick={() => setShowAddInput(false)}>Cancel</button>
            )}
          </form>
        )}
        {catError && <div className="text-red-500 text-sm mt-2">{catError}</div>}
        <hr className="my-4 border-blue-100" />
        {/* Category Table */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
          {catLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-blue-700 font-semibold text-base mt-2">Loading categories...</span>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-gray-400 italic py-6 text-center bg-white rounded-xl shadow">No categories found.</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full bg-white rounded-xl shadow text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, idx) => (
                    <tr key={cat.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors animate-fadeIn" style={{ animationDelay: `${idx * 40}ms` }}>
                      <td className="px-2 md:px-6 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow-sm`}>{cat.name}</span>
                      </td>
                      <td className="px-2 md:px-6 py-3">
                        <button className="text-red-500 hover:text-white hover:bg-red-500 font-medium transition-colors px-3 py-1 rounded-full shadow-sm relative group" onClick={() => openDeleteDialog('category', cat.id)} disabled={catLoading} title="Delete category">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-black bg-opacity-80 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-all">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Product Images for Selected Category */}
      {selectedCategory && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 relative">
          {/* Loader Overlay for Category's Products Grid */}
          {catLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20 rounded-xl">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-blue-700 font-semibold text-base">Loading...</span>
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Products in Category</h3>
          {filteredProducts.length === 0 ? (
            <div className="text-gray-400 italic py-6 text-center">No products in this category.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.map((prod) => (
                <div key={prod._id} className="relative group">
                  <img src={prod.image} alt={prod.name} className="h-32 w-full object-cover rounded-lg shadow" />
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
          )}
        </div>
      )}
    </section>
  );
} 