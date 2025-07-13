import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Layout({ children, onDashboardClick, onCategoryClick, onProductClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex font-sans">
      <Sidebar onDashboardClick={onDashboardClick} onCategoryClick={onCategoryClick} onProductClick={onProductClick} />
      <div className="flex-1 flex flex-col">
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}   