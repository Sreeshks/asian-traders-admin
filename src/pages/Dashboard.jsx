import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { API_BASE_URL } from '../common';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catError, setCatError] = useState('');
  const [catLoading, setCatLoading] = useState(false);

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

  return (
    <Layout>
      <main className="flex-1 p-6 md:p-10 bg-transparent">
        {/* Category Management */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Category Management</h2>
          <form className="flex gap-3" onSubmit={handleAddCategory}>
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
        </section>
        {/* Category Table */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
          {categories.length === 0 ? (
            <div className="text-gray-400 italic py-6 text-center bg-white rounded-xl shadow">No categories yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b last:border-b-0 hover:bg-blue-50">
                      <td className="px-6 py-3">
                        <button
                          className={`text-blue-600 font-semibold hover:underline${selectedCategory === cat.id ? ' underline' : ''}`}
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          {cat.name}
                        </button>
                      </td>
                      <td className="px-6 py-3">
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
        </section>
        {/* Product Table */}
        <section>
          {selectedCategory && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">Products in "{categories.find((c) => c.id === selectedCategory)?.name}"</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoProducts.map((prod) => (
                      <tr key={prod.id} className="border-b last:border-b-0 hover:bg-blue-50">
                        <td className="px-6 py-3">{prod.name}</td>
                        <td className="px-6 py-3">{prod.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}

export default Dashboard; 