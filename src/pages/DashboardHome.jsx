function DashboardHome() {
  const stats = {
    totalCategories: 10,
    totalProducts: 150,
    lowStock: 5,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Categories */}
        <div className="bg-orange-500 text-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-600">
          <h2 className="text-xl font-semibold">Total Categories</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalCategories}</p>
        </div>

        {/* Total Products */}
        <div className="bg-orange-500 text-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-600">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-orange-500 text-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-600">
          <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
          <p className="text-3xl font-bold mt-2">{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
