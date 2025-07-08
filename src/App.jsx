import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from "./pages/Login";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import CategoryManagement from './pages/CategoryManagement';
import ProductManagement from './pages/ProductManagement';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  if (isLoginPage) {
    // 🟠 Render Login only, without layout
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  // 🟢 Render full layout with sidebar/header for other pages
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/products" element={<ProductManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
