// File: src/pages/ProductManagement.jsx
import React from 'react';

function ProductManagement({
  selectedCategory,
  filteredProducts,
  openDeleteDialog,
  handleEditProduct,
  catLoading,
}) {
  if (!selectedCategory) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 relative">
      {catLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20 rounded-xl">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-blue-700 font-semibold text-base">Loading...</span>
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-blue-700 mb-4">
        Products in Category
      </h3>
      {filteredProducts.length === 0 ? (
        <div className="text-gray-400 italic py-6 text-center">
          No products in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((prod) => (
            <div key={prod._id} className="relative group">
              <img
                src={prod.image}
                alt={prod.name}
                className="h-32 w-full object-cover rounded-lg shadow"
              />
              <button
                className="absolute top-2 right-10 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                title="Delete"
                onClick={() => openDeleteDialog('product', prod._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-blue-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                title="Edit"
                onClick={() => handleEditProduct(prod)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 001.213 1.213l1-4a4 4 0 01.828-1.414z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
