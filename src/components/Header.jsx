import { FaUserCircle } from 'react-icons/fa';

function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center w-full">
      {/* Left - Logo */}
      <img src="/logo.png" alt="Asian Traders Logo" className="h-10" />

      {/* Right - Profile Icon */}
      <div className="flex items-center">
        <FaUserCircle className="text-5xl text-orange-500 cursor-pointer hover:text-orange-600" />
      </div>
    </header>
  );
}

export default Header;
