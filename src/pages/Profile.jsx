import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center p-6">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition text-sm shadow"
        >
          ← Back
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Admin Profile</h2>

        {/* Avatar */}
        <img
          src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
          alt="Admin"
          className="w-24 h-24 rounded-full border-4 border-blue-200 shadow mb-4"
        />

        {/* Info */}
        <div className="text-gray-700 w-full max-w-sm space-y-2 mb-8">
          <p><strong>Name:</strong> Admin</p>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Role:</strong> Super Admin</p>
          <p><strong>Address:</strong> Asian Traders HQ, Kochi, Kerala</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-auto">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 transition shadow">
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-md text-sm hover:bg-red-600 transition shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
