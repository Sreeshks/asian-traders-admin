import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Layout({ children, onDashboardClick, onCategoryClick, onProductClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex font-sans">
      <Sidebar onDashboardClick={onDashboardClick} onCategoryClick={onCategoryClick} onProductClick={onProductClick} />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}   