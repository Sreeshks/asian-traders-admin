import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`/api/products${filterCategory ? `?category_id=${filterCategory}` : ''}`),
          axios.get('/api/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [filterCategory]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Filter by Category</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full md:w-1/4 border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">{product.stock}</td>
              <td className="border px-4 py-2">{product.category_name}</td>
              <td className="border px-4 py-2">
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover" />
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;