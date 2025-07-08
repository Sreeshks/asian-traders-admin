import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onCategoryClick, onProductClick }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span className="text-2xl">☰</span>
      </button>
      {/* Overlay and Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-black bg-opacity-40 w-full h-full" onClick={() => setOpen(false)}></div>
          <aside className="w-64 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col gap-8 h-full relative animate-slideInLeft border-l-4 border-blue-500">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-extrabold text-blue-700 tracking-tight">UEI</span>
              <span className="text-lg font-bold text-gray-800 tracking-wide">Urban Edge Interior</span>
            </div>
            <nav className="flex flex-col gap-4">
              <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`} onClick={() => setOpen(false)}><span>🏠</span>Dashboard</NavLink>
              <button type="button" className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700" onClick={() => { setOpen(false); onCategoryClick && onCategoryClick(); }}><span>📂</span>Categories</button>
              <button type="button" className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700" onClick={() => { setOpen(false); onProductClick && onProductClick(); }}><span>🛒</span>Products</button>
            </nav>
            <div className="mt-auto text-xs text-gray-400 font-semibold">&copy; {new Date().getFullYear()} Urban Edge Interior</div>
          </aside>
        </div>
      )}
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col gap-8 hidden md:flex border-l-4 border-blue-500">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl font-extrabold text-blue-700 tracking-tight">UEI</span>
          <span className="text-lg font-bold text-gray-800 tracking-wide">Urban Edge Interior</span>
        </div>
        <nav className="flex flex-col gap-4">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}><span>🏠</span>Dashboard</NavLink>
          <button type="button" className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700" onClick={onCategoryClick}><span>📂</span>Categories</button>
          <button type="button" className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700" onClick={onProductClick}><span>🛒</span>Products</button>
        </nav>
        <div className="mt-auto text-xs text-gray-400 font-semibold">&copy; {new Date().getFullYear()} Urban Edge Interior</div>
      </aside>
    </>
  );
}

// Add this to your global CSS or Tailwind config:
// .animate-slideInLeft { animation: slideInLeft 0.3s ease; }
// @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } } 