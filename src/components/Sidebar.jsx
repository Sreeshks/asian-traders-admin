import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col gap-8 hidden md:flex">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl font-bold text-blue-600">AT</span>
        <span className="text-lg font-semibold text-gray-700">Admin</span>
      </div>
      <nav className="flex flex-col gap-4">
        <NavLink to="/dashboard" className={({ isActive }) => `text-left px-4 py-2 rounded-lg hover:bg-blue-50 font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>Dashboard</NavLink>
        <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">Categories</button>
        <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">Products</button>
      </nav>
      <div className="mt-auto text-xs text-gray-400">&copy; 2024 Asian Traders</div>
    </aside>
  );
} 