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
  const [activeTab, setActiveTab] = useState('categories');
  const [dragActive, setDragActive] = useState(false);

  // For demo: static products per category
  const demoProducts = [
    { id: 1, name: 'Product A', price: '$10' },
    { id: 2, name: 'Product B', price: '$20' },
    { id: 3, name: 'Product C', price: '$30' },
  ];

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
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  // Delete product handler
  const handleDeleteProduct = async (id) => {
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

  // Handlers for sidebar tab switching
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

  return (
    <Layout onCategoryClick={handleSidebarCategoryClick} onProductClick={handleSidebarProductClick}>
      <main className="flex-1 p-2 md:p-10 bg-transparent">
        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-4 md:mb-8 flex-wrap">
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
        </div>
        {/* Category Management */}
        {activeTab === 'categories' && (
          <section className="mb-10" id="categories-section">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Category Management</h2>
            <form className="flex flex-col md:flex-row gap-3" onSubmit={handleAddCategory}>
              <input
                type="text"
                placeholder="Add new category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                disabled={catLoading}
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition" disabled={catLoading}>Add</button>
            </form>
            {catError && <div className="text-red-500 text-sm mt-2">{catError}</div>}
            {/* Category Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
              {categories.length === 0 ? (
                <div className="text-gray-400 italic py-6 text-center bg-white rounded-xl shadow">No categories yet.</div>
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
                      {categories.map((cat) => (
                        <tr key={cat.id} className="border-b last:border-b-0 hover:bg-blue-50">
                          <td className="px-2 md:px-6 py-3">
                            <button
                              className={`text-blue-600 font-semibold hover:underline${selectedCategory === cat.id ? ' underline' : ''}`}
                              onClick={() => setSelectedCategory(cat.id)}
                            >
                              {cat.name}
                            </button>
                          </td>
                          <td className="px-2 md:px-6 py-3">
                            <button className="text-red-500 hover:text-red-700 font-medium" onClick={() => handleDeleteCategory(cat.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
        {/* Product Management */}
        {activeTab === 'products' && (
          <section className="mb-10" id="products-section">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Product</h3>
            <form className="flex flex-col gap-3" onSubmit={handleAddProduct} encType="multipart/form-data">
              <div className="flex flex-col md:flex-row gap-3">
                <input type="text" name="name" placeholder="Name" value={productForm.name} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
                <input type="text" name="description" placeholder="Description" value={productForm.description} onChange={handleProductInput} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" required disabled={prodLoading} />
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
            {/* Product Images Grid */}
            {products.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {products.map((prod) => (
                    <div key={prod._id} className="relative group">
                      <img src={prod.image} alt={prod.name} className="h-32 w-full object-cover rounded-lg shadow" />
                      <button
                        className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                        title="Delete"
                        onClick={() => handleDeleteProduct(prod._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
    </Layout>
  );
}

export default Dashboard; 