import { useState } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // For demo: static products per category
  const demoProducts = [
    { id: 1, name: 'Product A', price: '$10' },
    { id: 2, name: 'Product B', price: '$20' },
    { id: 3, name: 'Product C', price: '$30' },
  ];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setCategories([
      ...categories,
      { id: Date.now(), name: categoryName.trim() },
    ]);
    setCategoryName('');
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (selectedCategory === id) setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col gap-8 hidden md:flex">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl font-bold text-blue-600">AT</span>
          <span className="text-lg font-semibold text-gray-700">Admin</span>
        </div>
        <nav className="flex flex-col gap-4">
          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium">Dashboard</button>
          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">Categories</button>
          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">Products</button>
        </nav>
        <div className="mt-auto text-xs text-gray-400">&copy; 2024 Asian Traders</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow flex items-center justify-between px-8 py-4">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Welcome, Admin</span>
            <img src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff" alt="Admin" className="w-10 h-10 rounded-full shadow" />
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10 bg-transparent">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600">{categories.length}</span>
              <span className="text-gray-500 mt-2">Categories</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600">3</span>
              <span className="text-gray-500 mt-2">Products (Demo)</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600">Premium</span>
              <span className="text-gray-500 mt-2">Status</span>
            </div>
          </div>
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
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Add</button>
            </form>
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
      </div>
    </div>
  );
}

export default App;
