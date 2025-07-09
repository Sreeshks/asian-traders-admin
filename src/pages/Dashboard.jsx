import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { API_BASE_URL } from '../common';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catError, setCatError] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, categoryid: '' });
  const [prodError, setProdError] = useState('');
  const [prodLoading, setProdLoading] = useState(false);
  // const [activeTab, setActiveTab] = useState('categories');
  const [activeTab, setActiveTab] = useState('dashboard'); // instead of 'categories'

  const [dragActive, setDragActive] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, categoryid: '' });
  const [editLoading, setEditLoading] = useState(false);
  //for tabs in dashboard
  const [dashboardCategory, setDashboardCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Filtered categories for search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Filter products by search query and category
  const filteredDashboardProducts = products
    .filter((prod) => {
      // First filter by category
      const categoryMatch = dashboardCategory === 'all' ||
        (typeof prod.categoryid === 'object'
          ? prod.categoryid._id === dashboardCategory
          : prod.categoryid === dashboardCategory);
      
      // Then filter by search query
      const searchMatch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && searchMatch;
    });

  // For floating add button
  const [showAddInput, setShowAddInput] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      setCatError('');
      setCatLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/category`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setCatError(data.message || 'Failed to fetch categories.');
          setCatLoading(false);
          return;
        }
        setCategories(data.data.map(cat => ({ id: cat._id, name: cat.name })));
        setCatLoading(false);
      } catch (err) {
        setCatError('Network error. Please try again.');
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setCatError('');
    setCatLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName.trim(), description: 'Sample' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCatError(data.message || 'Failed to add category.');
        setCatLoading(false);
        return;
      }
      setCategories([
        ...categories,
        { id: data.data._id, name: data.data.name },
      ]);
      setCategoryName('');
      setCatLoading(false);
    } catch (err) {
      setCatError('Network error. Please try again.');
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setCatError('');
    setCatLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/category/category/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCatError(data.message || 'Failed to delete category.');
        setCatLoading(false);
        return;
      }
      setCategories(categories.filter((cat) => cat.id !== id));
      if (selectedCategory === id) setSelectedCategory(null);
      setCatLoading(false);
    } catch (err) {
      setCatError('Network error. Please try again.');
      setCatLoading(false);
    }
  };

  const handleProductInput = (e) => {
    const { name, value, files } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProductForm((prev) => ({ ...prev, image: e.dataTransfer.files[0] }));
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductForm((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProdError('');
    setProdLoading(true);
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('offerprice', productForm.offerprice);
      formData.append('stock', productForm.stock);
      formData.append('image', productForm.image);
      formData.append('categoryid', productForm.categoryid);
      const res = await fetch(`${API_BASE_URL}/product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProdError(data.message || 'Failed to add product.');
        setProdLoading(false);
        return;
      }
      setProducts([...products, data.data]);
      setProductForm({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, categoryid: '' });
      setProdLoading(false);
    } catch (err) {
      setProdError('Network error. Please try again.');
      setProdLoading(false);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    setProdError('');
    setProdLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/product`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProdError(data.message || 'Failed to fetch products.');
        setProdLoading(false);
        return;
      }
      setProducts(data.data);
      setProdLoading(false);
    } catch (err) {
      setProdError('Network error. Please try again.');
      setProdLoading(false);
    }
  };

  // Fetch products when tab is switched to 'products'
  useEffect(() => {
    if (activeTab === 'products' || activeTab === 'dashboard') {
      fetchProducts();
    }
  }, [activeTab]);


  // Delete product handler
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setProdError('');
    setProdLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProdError(data.message || 'Failed to delete product.');
        setProdLoading(false);
        return;
      }
      setProducts(products.filter((prod) => prod._id !== id));
      setProdLoading(false);
    } catch (err) {
      setProdError('Network error. Please try again.');
      setProdLoading(false);
    }
  };

  // Open edit modal and populate form
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      offerprice: product.offerprice || '',
      stock: product.stock || '',
      image: null,
      categoryid: product.categoryid && typeof product.categoryid === 'object' ? product.categoryid._id : product.categoryid || '',
    });
  };

  // Handle edit form input
  const handleEditInput = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit edit form
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setProdError('');
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== '' && value !== null) formData.append(key, value);
      });
      const res = await fetch(`${API_BASE_URL}/product/${editProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProdError(data.message || 'Failed to update product.');
        setEditLoading(false);
        return;
      }
      setProducts(products.map((p) => (p._id === data.data._id ? data.data : p)));
      setEditProduct(null);
      setEditLoading(false);
    } catch (err) {
      setProdError('Network error. Please try again.');
      setEditLoading(false);
    }
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((prod) => {
      if (!prod.categoryid) return false;
      if (typeof prod.categoryid === 'object') return prod.categoryid._id === selectedCategory;
      return prod.categoryid === selectedCategory;
    })
    : [];

  // Handlers for sidebar tab switching
  const handleSidebarDashboardClick = () => {
    setActiveTab('dashboard');
    setTimeout(() => {
      const el = document.getElementById('dashboard-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  const handleSidebarCategoryClick = () => {
    setActiveTab('categories');
    setTimeout(() => {
      const el = document.getElementById('categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  const handleSidebarProductClick = () => {
    setActiveTab('products');
    setTimeout(() => {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Loader overlay
  const isLoading = catLoading || prodLoading || editLoading;

  return (
    <Layout onDashboardClick={handleSidebarDashboardClick} onCategoryClick={handleSidebarCategoryClick} onProductClick={handleSidebarProductClick}>
      <main className="flex-1 p-2 md:p-10 bg-transparent relative">
        {/* Tabs */}
        {/* <div className="flex gap-2 md:gap-4 mb-4 md:mb-8 flex-wrap">
          <button
            className={`flex-1 min-w-[120px] px-2 md:px-6 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-200 ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-700 bg-white shadow' : 'border-transparent text-gray-500 bg-blue-50 hover:bg-white'}`}
            onClick={() => setActiveTab('dashboard')}
            id="dashboard"
          >
            🏠 Dashboard
          </button>

          <button
            className={`flex-1 min-w-[120px] px-2 md:px-6 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-200 ${activeTab === 'categories' ? 'border-blue-600 text-blue-700 bg-white shadow' : 'border-transparent text-gray-500 bg-blue-50 hover:bg-white'}`}
            onClick={() => setActiveTab('categories')}
            id="categories"
          >📂 Categories</button>
          <button
            className={`flex-1 min-w-[120px] px-2 md:px-6 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-200 ${activeTab === 'products' ? 'border-blue-600 text-blue-700 bg-white shadow' : 'border-transparent text-gray-500 bg-blue-50 hover:bg-white'}`}
            onClick={() => setActiveTab('products')}
            id="products"
          >🛒 Products</button>
        </div> */}
        {/* Dashboard  */}
        {activeTab === 'dashboard' && (
          <section className="mb-10" id="dashboard-section">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`px-4 py-1.5 rounded-lg font-semibold border transition ${dashboardCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                  }`}
                onClick={() => setDashboardCategory('all')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-4 py-1.5 rounded-lg font-semibold border transition ${dashboardCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  onClick={() => setDashboardCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4">Dashboard Overview</h2>
            {prodLoading ? (
              <div className="flex justify-center items-center py-16">
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
                  <p className="text-blue-600 font-semibold mt-4 text-lg">Loading products...</p>
                  <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your products</p>
                </div>
              </div>
            ) : filteredDashboardProducts.length === 0 ? (
              <div className="text-gray-400 italic py-6 text-center bg-white rounded-xl shadow">
                {searchQuery ? 'No products found matching your search.' : 'No products available.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-white rounded-xl p-4 shadow">
                {filteredDashboardProducts.map((prod) => (
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
                      onClick={() => handleDeleteProduct(prod._id)}
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
          </section>
        )}

        {/* Category Management */}
        {activeTab === 'categories' && (
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
                              <button className="text-red-500 hover:text-white hover:bg-red-500 font-medium transition-colors px-3 py-1 rounded-full shadow-sm relative group" onClick={() => handleDeleteCategory(cat.id)} disabled={catLoading} title="Delete category">
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
                          onClick={() => handleDeleteProduct(prod._id)}
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
        )}
        {/* Product Management */}
        {activeTab === 'products' && (
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
                <input type="number" name="offerprice" placeholder="Offer Price" value={productForm.offerprice} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
                <input type="number" name="stock" placeholder="Stock" value={productForm.stock} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
              </div>
              <div className="flex flex-col md:flex-row gap-3 items-center">
                {/* Drag and Drop File Upload */}
                <div
                  className={`flex-1 border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
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
                    required
                    disabled={prodLoading}
                  />
                  {productForm.image ? (
                    <span className="text-blue-700 font-medium">{productForm.image.name}</span>
                  ) : (
                    <span className="text-gray-400">Drag & drop image here, or <span className="underline">click to select</span></span>
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
            {prodError && <div className="text-red-500 text-sm mt-2">{prodError}</div>}
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
                        onClick={() => handleDeleteProduct(prod._id)}
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
        )}
      </main>
      {/* Edit Product Modal - Moved outside sections to work from all tabs */}
      {editProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-100 bg-opacity-80 backdrop-blur-[6px]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 relative transform transition-all duration-300 scale-100 animate-fadeIn">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 z-10" 
              onClick={() => setEditProduct(null)} 
              aria-label="Close"
            >
              ×
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Edit Product</h3>
              <p className="text-gray-600">Update product information</p>
            </div>

            {/* Current Product Image Preview */}
            <div className="mb-6 text-center">
              <img 
                src={editProduct.image} 
                alt={editProduct.name} 
                className="h-24 w-24 object-cover rounded-lg shadow-lg mx-auto mb-2"
              />
              <p className="text-sm text-gray-600">{editProduct.name}</p>
            </div>

            {/* Edit Form */}
            <form className="space-y-4" onSubmit={handleUpdateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter product name" 
                    value={editForm.name} 
                    onChange={handleEditInput} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200" 
                    required 
                    disabled={editLoading} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    name="categoryid" 
                    value={editForm.categoryid} 
                    onChange={handleEditInput} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200" 
                    required 
                    disabled={editLoading}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  placeholder="Enter product description" 
                  value={editForm.description} 
                  onChange={handleEditInput} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 resize-none" 
                  rows="3"
                  required 
                  disabled={editLoading} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    value={editForm.price} 
                    onChange={handleEditInput} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200" 
                    required 
                    disabled={editLoading} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                  <input 
                    type="number" 
                    name="offerprice" 
                    placeholder="0.00" 
                    value={editForm.offerprice} 
                    onChange={handleEditInput} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200" 
                    required 
                    disabled={editLoading} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    value={editForm.stock} 
                    onChange={handleEditInput} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200" 
                    required 
                    disabled={editLoading} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Image (Optional)</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  onChange={handleEditInput} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  disabled={editLoading} 
                />
              </div>

              {/* Error Message */}
              {prodError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{prodError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200" 
                  onClick={() => setEditProduct(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    'Update Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard; 