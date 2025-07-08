import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}   