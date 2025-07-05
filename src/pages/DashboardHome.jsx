function DashboardHome() {
  // Mock data (replace with API calls)
  const stats = {
    totalCategories: 10,
    totalProducts: 150,
    lowStock: 5,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Categories</h2>
          <p className="text-2xl">{stats.totalCategories}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
          <p className="text-2xl">{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;