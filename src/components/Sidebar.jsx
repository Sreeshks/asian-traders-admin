import React, { useState, useEffect } from 'react';

export default function Sidebar({ onDashboardClick, onCategoryClick, onProductClick }) {
  const [open, setOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.sidebar-container')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleNavClick = (callback) => {
    setOpen(false);
    if (callback) callback();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar Container */}
          <div className="sidebar-container absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out">
                         {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-100">
               <div className="flex items-center gap-3">
                 <img src="/logo/logo.jpeg" alt="Urban Edge Interior Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
                 <div>
                   <h1 className="text-lg font-bold text-gray-800 tracking-wide">Urban Edge Interior</h1>
                   <p className="text-xs text-gray-500">Navigation Menu</p>
                 </div>
               </div>
              
              {/* Close Button */}
              <button
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col p-4 space-y-2">
              <button
                type="button"
                className="flex items-center gap-4 px-4 py-4 rounded-xl text-left hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-medium transition-all duration-200 group"
                onClick={() => handleNavClick(onDashboardClick)}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Dashboard</div>
                  <div className="text-xs text-gray-500">Overview & Analytics</div>
                </div>
              </button>

              <button
                type="button"
                className="flex items-center gap-4 px-4 py-4 rounded-xl text-left hover:bg-green-50 hover:text-green-700 text-gray-700 font-medium transition-all duration-200 group"
                onClick={() => handleNavClick(onCategoryClick)}
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Categories</div>
                  <div className="text-xs text-gray-500">Manage Categories</div>
                </div>
              </button>

              <button
                type="button"
                className="flex items-center gap-4 px-4 py-4 rounded-xl text-left hover:bg-purple-50 hover:text-purple-700 text-gray-700 font-medium transition-all duration-200 group"
                onClick={() => handleNavClick(onProductClick)}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Products</div>
                  <div className="text-xs text-gray-500">Manage Products</div>
                </div>
              </button>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Admin User</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white shadow-xl rounded-r-3xl p-6 flex flex-col gap-8 hidden md:flex border-l-4 border-blue-500">
                 {/* Header */}
      <div className="flex items-center gap-3 mb-8">
           <img src="/logo/logo.jpeg" alt="Urban Edge Interior Logo" className="h-12 w-12 rounded-2xl object-cover shadow-lg" />
           <div>
             <h1 className="text-xl font-bold text-gray-800 tracking-wide">Urban Edge Interior</h1>
             <p className="text-sm text-gray-500">Management System</p>
           </div>
         </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-medium transition-all duration-200 group"
            onClick={onDashboardClick}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <span className="font-semibold">Dashboard</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-green-50 hover:text-green-700 text-gray-700 font-medium transition-all duration-200 group"
            onClick={onCategoryClick}
          >
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="font-semibold">Categories</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-purple-50 hover:text-purple-700 text-gray-700 font-medium transition-all duration-200 group"
            onClick={onProductClick}
          >
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
      </div>
            <span className="font-semibold">Products</span>
          </button>
      </nav>

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Admin User</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Admin Panel
          </div>
        </div>
    </aside>
    </>
  );
} 