import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic (e.g., clear JWT token)
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <img src="/logo.png" alt="Asian Traders Logo" className="h-10" />
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;