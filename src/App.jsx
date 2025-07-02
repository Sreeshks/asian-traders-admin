import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation for cards on mount
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
      card.classList.remove('card-animate');
      setTimeout(() => card.classList.add('card-animate'), 100 + i * 120);
    });
    const charts = document.querySelectorAll('.chart-placeholder');
    charts.forEach((chart, i) => {
      chart.classList.remove('chart-animate');
      setTimeout(() => chart.classList.add('chart-animate'), 400 + i * 200);
    });
  }, [activeMenu]);

  return (
    <div className={`dashboard-container${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <aside className={`sidebar${sidebarOpen ? ' open' : ' closed'}`}>
        <div className="sidebar-logo">Asian Traders</div>
        <nav>
          <ul>
            {['Dashboard', 'Orders', 'Products', 'Customers', 'Reports', 'Settings'].map((item) => (
              <li
                key={item}
                className={activeMenu === item ? 'active' : ''}
                onClick={() => setActiveMenu(item)}
                tabIndex={0}
              >
                <span className="sidebar-icon">{getMenuIcon(item)}</span>
                <span className="sidebar-label">{item}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="main-section">
        <header className="topbar">
          {window.innerWidth <= 900 && (
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle sidebar"
            >
              <span className="hamburger"></span>
            </button>
          )}
          <h1>{activeMenu}</h1>
          <div className="admin-profile">
            <span>Admin</span>
            <img src="https://i.pravatar.cc/40?img=3" alt="Admin" />
          </div>
        </header>
        <main className="dashboard-main">
          <section className="summary-cards">
            <div className="card"> <h2>Total Sales</h2> <p>$12,500</p> </div>
            <div className="card"> <h2>Orders</h2> <p>320</p> </div>
            <div className="card"> <h2>Products</h2> <p>58</p> </div>
            <div className="card"> <h2>Customers</h2> <p>210</p> </div>
          </section>
          <section className="charts-section">
            <div className="chart-placeholder">[Sales Chart]</div>
            <div className="chart-placeholder">[Orders Chart]</div>
          </section>
        </main>
      </div>
    </div>
  );
}

function getMenuIcon(item) {
  // Simple SVG icons for each menu item
  switch (item) {
    case 'Dashboard':
      return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill="#fff"/><rect x="14" y="3" width="7" height="7" rx="2" fill="#fff"/><rect x="14" y="14" width="7" height="7" rx="2" fill="#fff"/><rect x="3" y="14" width="7" height="7" rx="2" fill="#fff"/></svg>
      );
    case 'Orders':
      return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
      );
    case 'Products':
      return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
      );
    case 'Customers':
      return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2"/></svg>
      );
    case 'Reports':
      return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#fff" strokeWidth="2"/><path d="M7 17V7M12 17V12M17 17V14" stroke="#fff" strokeWidth="2"/></svg>
      );
    case 'Settings':
      return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09c.7 0 1.31-.4 1.51-1V3a2 2 0 1 1 4 0v.09c0 .7.4 1.31 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c0 .7.4 1.31 1 1.51H21a2 2 0 1 1 0 4h-.09c-.7 0-1.31.4-1.51 1z" stroke="#fff" strokeWidth="2"/></svg>
      );
    default:
      return null;
  }
}

export default App;
