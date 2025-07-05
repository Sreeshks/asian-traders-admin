import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import CategoryManagement from './pages/CategoryManagement';
import ProductManagement from './pages/ProductManagement';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/products" element={<ProductManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;