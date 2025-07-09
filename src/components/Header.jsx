import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link

export default function Header() {
  return (
    <header className="bg-white shadow flex items-center justify-between px-4 md:px-8 py-4">
      <div className="flex items-center gap-3">

        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 tracking-tight">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-medium">Welcome, Admin</span>
        <Link to="/profile">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
            alt="Admin"
            className="w-10 h-10 rounded-full shadow cursor-pointer"
          />
        </Link>

        {/* <img src="https://ui-avatars.com/api/?name=Urban+Edge+Interior&background=2563eb&color=fff" alt="Admin" className="w-10 h-10 rounded-full shadow" /> */}
      </div>
    </header>
  );
} 