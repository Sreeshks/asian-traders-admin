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
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, secondary_images: [], categoryid: '' });
  const [prodError, setProdError] = useState('');
  const [prodLoading, setProdLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dragActive, setDragActive] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, secondary_images: [], categoryid: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [dashboardCategory, setDashboardCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedDashboardProduct, setSelectedDashboardProduct] = useState(null);


  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );


  const filteredDashboardProducts = products.filter((prod) => {
    const categoryMatch =
      dashboardCategory === 'all' || prod.categoryid === dashboardCategory;
    const searchMatch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });



  const [showAddInput, setShowAddInput] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '',
    id: null,
    deleteProducts: true // default to true
  });

  const openDeleteDialog = (type, id) => setDeleteDialog({
    open: true, type, id, deleteProducts: true, // default value, can change based on user choice in dialog
  });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, type: '', id: null });

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');

    if (deleteDialog.type === 'category') {
      setCatError('');
      setCatLoading(true);

      try {
        // 1. Delete the category itself
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
          return;
        }

        // Remove category from local state
        setCategories(prev => prev.filter(cat => cat.id !== deleteDialog.id));
        if (selectedCategory === deleteDialog.id) setSelectedCategory(null);

        // Handle associated products
        if (deleteDialog.deleteProducts) {
          // Call the new API to delete all products in this category
          const prodRes = await fetch(`${API_BASE_URL}/product/deletebycategory/${deleteDialog.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const prodData = await prodRes.json();
          if (!prodRes.ok || !prodData.success) {
            setCatError(prodData.message || 'Failed to delete products in this category.');
            setCatLoading(false);
            return;
          }
          // Remove products belonging to the deleted category from local state
          setProducts(prev =>
            prev.filter(prod => {
              const catId = typeof prod.categoryid === 'object' ? prod.categoryid._id : prod.categoryid;
              return catId !== deleteDialog.id;
            })
          );
        } else {
          // Reassign products to 'uncategorized'
          const updatedProducts = await Promise.all(
            products.map(async (prod) => {
              const catId = typeof prod.categoryid === 'object' ? prod.categoryid._id : prod.categoryid;
              if (catId !== deleteDialog.id) return prod;

              try {
                const formData = new FormData();
                formData.append('categoryid', 'uncategorized'); // or null

                const updateRes = await fetch(`${API_BASE_URL}/product/${prod._id}`, {
                  method: 'PATCH',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                  body: formData,
                });

                const updateData = await updateRes.json();
                return updateRes.ok && updateData.success ? updateData.data : prod;
              } catch {
                return prod; // fallback
              }
            })
          );
          setProducts(updatedProducts);
        }
      } catch (err) {
        setCatError('Network error. Please try again.');
      } finally {
        setCatLoading(false);
        closeDeleteDialog();
      }

    } else if (deleteDialog.type === 'product') {
      setProdError('');
      setProdLoading(true);

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
          return;
        }

        // Remove product from local state
        setProducts(prev => prev.filter(prod => prod._id !== deleteDialog.id));
      } catch (err) {
        setProdError('Network error. Please try again.');
      } finally {
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
    console.log('handleProductInput called:', name, value, files);
    
    if (name === 'secondary_images' && files) {
      setProductForm((prev) => {
        const prevFiles = prev.secondary_images || [];
        const newFiles = Array.from(files);
        // Only add files that are not already in prevFiles (by name and size)
        const uniqueFiles = newFiles.filter(
          nf => !prevFiles.some(pf => pf.name === nf.name && pf.size === nf.size)
        );
        const combined = [...prevFiles, ...uniqueFiles].slice(0, 3);
        return {
          ...prev,
          [name]: combined,
        };
      });
    } else if (files) {
      setProductForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setProductForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Check if the drop target is for main image or secondary images
      const target = e.target.closest('[data-upload-type]');
      if (target && target.dataset.uploadType === 'main') {
        setProductForm((prev) => ({ ...prev, image: e.dataTransfer.files[0] }));
      }
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
    console.log('handleFileInput called:', e.target.name, e.target.files);
    if (e.target.files && e.target.files[0]) {
      setProductForm((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log('Current productForm:', productForm);
    if (!productForm.image) {
      setProdError("Please upload an image for the product.");
      return;
    }
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
      
      // Add secondary images
      if (productForm.secondary_images && productForm.secondary_images.length > 0) {
        productForm.secondary_images.forEach((file, index) => {
          formData.append('secondary_images', file);
        });
      }
      
      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
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
      setProductForm({ name: '', description: '', price: '', offerprice: '', stock: '', image: null, secondary_images: [], categoryid: '' });
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

      // Normalize categoryid to string
      const normalizedProducts = data.data.map((prod) => ({
        ...prod,
        categoryid:
          typeof prod.categoryid === 'object' && prod.categoryid !== null
            ? prod.categoryid._id
            : prod.categoryid,
      }));

      setProducts(normalizedProducts);
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
      secondary_images: [],
      categoryid: product.categoryid && typeof product.categoryid === 'object' ? product.categoryid._id : product.categoryid || '',
    });
  };

  const handleEditInput = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'secondary_images' && files) {
      setEditForm((prev) => {
        const prevFiles = prev.secondary_images || [];
        const newFiles = Array.from(files);
        // Only add files that are not already in prevFiles (by name and size)
        const uniqueFiles = newFiles.filter(
          nf => !prevFiles.some(pf => pf.name === nf.name && pf.size === nf.size)
        );
        const combined = [...prevFiles, ...uniqueFiles].slice(0, 3);
        return {
          ...prev,
          [name]: combined,
        };
      });
    } else if (files) {
      setEditForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setProdError('');
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === 'secondary_images' && Array.isArray(value) && value.length > 0) {
          // Handle secondary images array
          value.forEach((file) => {
            formData.append('secondary_images', file);
          });
        } else if (value !== '' && value !== null && key !== 'secondary_images') {
          formData.append(key, value);
        }
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 bg-white rounded-xl p-6 shadow">
                {filteredDashboardProducts.map((prod) => (
                  <div key={prod._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Main Image */}
                    <div className="relative">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedDashboardProduct(prod)}
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
            )}
          </section>
        )}

        {/* Dashboard Product Detail Modal */}
        {selectedDashboardProduct && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-lg">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 relative transform transition-all duration-300 scale-100 animate-fadeIn max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 z-10"
                onClick={() => setSelectedDashboardProduct(null)}
                aria-label="Close"
              >
                ×
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedDashboardProduct.name}</h3>
                <p className="text-gray-600">{selectedDashboardProduct.description}</p>
              </div>

              {/* Product Images */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-700 mb-6">Product Images</h4>
                
                {/* Main Image */}
                <div className="mb-6">
                  <h5 className="text-lg font-medium text-gray-600 mb-4">Main Image</h5>
                  <div className="flex justify-center">
                    <img
                      src={selectedDashboardProduct.image}
                      alt={selectedDashboardProduct.name}
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                {/* Secondary Images */}
                {selectedDashboardProduct.secondary_images && selectedDashboardProduct.secondary_images.length > 0 && (
                  <div>
                    <h5 className="text-lg font-medium text-gray-600 mb-4">Additional Images</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {selectedDashboardProduct.secondary_images.map((image, index) => (
                        <div key={index} className="flex justify-center">
                          <img
                            src={image}
                            alt={`${selectedDashboardProduct.name} - Image ${index + 1}`}
                            className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Product Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">${selectedDashboardProduct.price}</span>
                    </div>
                    {selectedDashboardProduct.offerprice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offer Price:</span>
                        <span className="font-semibold text-green-600">${selectedDashboardProduct.offerprice}</span>
                      </div>
                    )}
                    {selectedDashboardProduct.stock && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-semibold">{selectedDashboardProduct.stock}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold">
                        {categories.find(cat => cat.id === selectedDashboardProduct.categoryid)?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setSelectedDashboardProduct(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200"
                  onClick={() => {
                    setSelectedDashboardProduct(null);
                    handleEditProduct(selectedDashboardProduct);
                  }}
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
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
            setProductForm={setProductForm}
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 relative transform transition-all duration-300 scale-100 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 z-10"
              onClick={() => setEditProduct(null)}
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Edit Product</h3>
              <p className="text-gray-600 text-lg">Update product information</p>
            </div>

            {/* Current Product Image Preview */}
            <div className="mb-8 text-center">
              <div className="relative inline-block">
                <img
                  src={editProduct.image}
                  alt={editProduct.name}
                  className="h-32 w-32 object-cover rounded-lg shadow-lg mx-auto mb-3"
                />
                <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Current
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-700">{editProduct.name}</p>
            </div>

            {/* Edit Form */}
            <form className="space-y-6" onSubmit={handleUpdateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={editForm.name}
                    onChange={handleEditInput}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="categoryid"
                    value={editForm.categoryid}
                    onChange={handleEditInput}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={editForm.description}
                  onChange={handleEditInput}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  rows="4"
                  disabled={editLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={editForm.price}
                    onChange={handleEditInput}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
                    required
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price</label>
                  <input
                    type="number"
                    name="offerprice"
                    placeholder="0.00"
                    value={editForm.offerprice}
                    onChange={handleEditInput}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={editForm.stock}
                    onChange={handleEditInput}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
                    disabled={editLoading}
                  />
                </div>
              </div>

              {/* Image Updates Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Image Updates</h4>
                
                {/* Main Image Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Update Main Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleEditInput}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={editLoading}
                    />
                    <p className="text-xs text-gray-500 mt-2">Leave empty to keep the current main image</p>
                  </div>
                </div>

                {/* Secondary Images Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Update Secondary Images (Optional - Max 3)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Add Additional Images</p>
                        <p className="text-sm text-gray-500">Select up to 3 more images for your product</p>
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      name="secondary_images"
                      accept="image/*"
                      multiple
                      onChange={handleEditInput}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                      disabled={editLoading}
                    />
                    
                    {/* Secondary Images Preview */}
                    {editForm.secondary_images && editForm.secondary_images.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Selected Images ({editForm.secondary_images.length}/3)</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {editForm.secondary_images.map((file, index) => (
                            <div key={index} className="relative group flex flex-col items-center">
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-blue-100"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditForm(prev => ({
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-red-300 text-red-700 font-semibold hover:bg-red-50 transition-all duration-200"
                  onClick={() => openDeleteDialog('product', editProduct._id)}
                  disabled={editLoading}
                >
                  Delete Product
                </button>
                <button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setEditProduct(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>

              {deleteDialog.type === 'category' && activeTab === 'categories' ? (
                <>
                  <p className="text-gray-600 mb-4">
                    This category may have products. Do you want to delete them too?<br />
                    <span className="text-red-500 font-medium">This action cannot be undone.</span>
                  </p>

                  <div className="mb-4 w-full flex flex-col items-start gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={deleteDialog.deleteProducts || false}
                        onChange={() =>
                          setDeleteDialog(prev => ({
                            ...prev,
                            deleteProducts: !prev.deleteProducts
                          }))
                        }
                        className="accent-red-500"
                      />
                      <span className="text-sm text-gray-700">Also delete all products in this category</span>
                    </label>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this {deleteDialog.type}?<br />
                  <span className="text-red-500 font-medium">This action cannot be undone.</span>
                </p>
              )}

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