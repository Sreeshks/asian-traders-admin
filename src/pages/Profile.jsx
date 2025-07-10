import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setEditedUser(parsed); // initialize with existing user data
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedUser(user); // discard changes
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser(editedUser);
    localStorage.setItem('user', JSON.stringify(editedUser));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        No user information found. Please log in again.
      </div>
    );
  }

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
          src={`https://ui-avatars.com/api/?name=${user.email}&background=2563eb&color=fff`}
          alt="Admin"
          className="w-24 h-24 rounded-full border-4 border-blue-200 shadow mb-4"
        />

        {/* Info */}
        <div className="text-gray-700 w-full max-w-sm space-y-4 mb-8">
          <div>
            <label className="font-semibold">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="block w-full mt-1 px-3 py-2 border rounded-md"
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">Role:</label>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={editedUser.role}
                onChange={handleChange}
                className="block w-full mt-1 px-3 py-2 border rounded-md"
              />
            ) : (
              <p>{user.role}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">User ID:</label>
            <p>{user._id}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-auto">
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 transition shadow"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-5 py-2 rounded-md text-sm hover:bg-green-700 transition shadow"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-400 text-white px-5 py-2 rounded-md text-sm hover:bg-gray-500 transition shadow"
              >
                Cancel
              </button>
            </>
          )}

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
