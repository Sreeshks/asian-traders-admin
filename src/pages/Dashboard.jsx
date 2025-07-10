import React, { useState, useEffect, useRef } from 'react';
import Layout from '../layout/Layout';
import { API_BASE_URL } from '../common';
import CategorySection from '../components/CategorySection';
import ProductSection from '../components/ProductSection';

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

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dragActive, setDragActive] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, categoryid: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [dashboardCategory, setDashboardCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');


  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );


  const filteredDashboardProducts = products
    .filter((prod) => {

      const categoryMatch = dashboardCategory === 'all' ||
        (typeof prod.categoryid === 'object'
          ? prod.categoryid._id === dashboardCategory
          : prod.categoryid === dashboardCategory);
      const searchMatch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });


  const [showAddInput, setShowAddInput] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null });

  const openDeleteDialog = (type, id) => setDeleteDialog({ open: true, type, id });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, type: '', id: null });

  const handleConfirmDelete = async () => {
    if (deleteDialog.type === 'category') {
      setCatError('');
      setCatLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/category/${deleteDialog.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setCatError(data.message || 'Failed to delete category.');
          setCatLoading(false);
          closeDeleteDialog();
          return;
        }
        setCategories(categories.filter((cat) => cat.id !== deleteDialog.id));
        if (selectedCategory === deleteDialog.id) setSelectedCategory(null);
        setCatLoading(false);
        closeDeleteDialog();
      } catch (err) {
        setCatError('Network error. Please try again.');
        setCatLoading(false);
        closeDeleteDialog();
      }
    } else if (deleteDialog.type === 'product') {
      setProdError('');
      setProdLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/product/${deleteDialog.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setProdError(data.message || 'Failed to delete product.');
          setProdLoading(false);
          closeDeleteDialog();
          return;
        }
        setProducts(products.filter((prod) => prod._id !== deleteDialog.id));
        setProdLoading(false);
        closeDeleteDialog();
      } catch (err) {
        setProdError('Network error. Please try again.');
        setProdLoading(false);
        closeDeleteDialog();
      }
    }
  };

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
      // Focus the input after adding
      if (addCategoryInputRef.current) {
        addCategoryInputRef.current.focus();
      }
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

  useEffect(() => {
    if (activeTab === 'products' || activeTab === 'dashboard') {
      fetchProducts();
    }
  }, [activeTab]);



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

  const handleEditInput = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

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

  const filteredProducts = selectedCategory
    ? products.filter((prod) => {
      if (!prod.categoryid) return false;
      if (typeof prod.categoryid === 'object') return prod.categoryid._id === selectedCategory;
      return prod.categoryid === selectedCategory;
    })
    : [];

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

  const isLoading = catLoading || prodLoading || editLoading;

  const addCategoryInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'categories' && addCategoryInputRef.current) {
      addCategoryInputRef.current.focus();
    }
  }, [activeTab, categories.length]);

  return (
    <Layout onDashboardClick={handleSidebarDashboardClick} onCategoryClick={handleSidebarCategoryClick} onProductClick={handleSidebarProductClick}>
      <main className="flex-1 p-2 md:p-10 bg-transparent relative">


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
          </section>
        )}

        {/* Category Management */}
        {activeTab === 'categories' && (
          <CategorySection
            categorySearch={categorySearch}
            setCategorySearch={setCategorySearch}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            showAddInput={showAddInput}
            setShowAddInput={setShowAddInput}
            handleAddCategory={handleAddCategory}
            catLoading={catLoading}
            catError={catError}
            filteredCategories={filteredCategories}
            openDeleteDialog={openDeleteDialog}
            selectedCategory={selectedCategory}
            filteredProducts={filteredProducts}
            handleEditProduct={handleEditProduct}
            addCategoryInputRef={addCategoryInputRef}
          />
        )}
        {/* Product Management */}
        {activeTab === 'products' && (
          <ProductSection
            prodLoading={prodLoading}
            editLoading={editLoading}
            handleAddProduct={handleAddProduct}
            productForm={productForm}
            handleProductInput={handleProductInput}
            handleFileInput={handleFileInput}
            dragActive={dragActive}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            categories={categories}
            openDeleteDialog={openDeleteDialog}
            handleEditProduct={handleEditProduct}
            products={products}
            prodError={prodError}
          />
        )}
      </main>
      {/* Edit Product Modal - Moved outside sections to work from all tabs */}
      {editProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-lg">
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
      {/* Custom Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs mx-4 relative animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {deleteDialog.type === 'category' ? 'category' : 'product'}?
                <br />This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  onClick={closeDeleteDialog}
                  disabled={catLoading || prodLoading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmDelete}
                  disabled={catLoading || prodLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard; 