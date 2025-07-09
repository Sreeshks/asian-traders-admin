import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onDashboardClick, onCategoryClick, onProductClick }) {
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
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 z-10" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo/logo.jpeg" alt="Urban Edge Interior Logo" className="h-12 w-12 rounded-full object-cover shadow" />
              <span className="text-lg font-bold text-gray-800 tracking-wide">Urban Edge Interior</span>
            </div>
            <nav className="flex flex-col gap-4">
              <button type="button" className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium" onClick={() => { setOpen(false); onDashboardClick && onDashboardClick(); }}><span>🏠</span>Dashboard</button>
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
          <img src="/logo/logo.jpeg" alt="Urban Edge Interior Logo" className="h-12 w-12 rounded-full object-cover shadow" />
          <span className="text-lg font-bold text-gray-800 tracking-wide">Urban Edge Interior</span>
        </div>
        <nav className="flex flex-col gap-4">
          <button type="button" className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium" onClick={onDashboardClick}><span>🏠</span>Dashboard</button>
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