import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="w-64 bg-blue-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-yellow-300' : 'hover:text-yellow-200'
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? 'text-yellow-300' : 'hover:text-yellow-200'
              }
            >
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? 'text-yellow-300' : 'hover:text-yellow-200'
              }
            >
              Products
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;