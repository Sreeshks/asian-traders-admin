import { useState } from 'react';
import axios from 'axios';

function CategoryForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', formData);
      alert('Category added successfully');
      setFormData({ name: '', description: '' });
    } catch (error) {
      alert('Error adding category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Category</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Category
      </button>
    </form>
  );
}

export default CategoryForm;