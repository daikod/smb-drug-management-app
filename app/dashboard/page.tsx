// app/dashboard/page.tsx
import { getDashboardStats, getLowStockDrugs, getExpiringDrugs, getRecentTransactions } from '@/lib/dashboard-stats';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/sidebar';

export default async function DashboardPage() {
  // Get current user using Stack Auth
  
  const user = await getCurrentUser();
  const userId = user.id;


  // Fetch all dashboard data in parallel
  const [stats, lowStockDrugs, expiringDrugs, recentTransactions] = await Promise.all([
  getDashboardStats(userId),
  getLowStockDrugs(userId, 5),
  getExpiringDrugs(userId, 30, 5),
  getRecentTransactions(userId, 5),
]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user.displayName || user.primaryEmail}! Here is an overview of your drug inventory.
              </p>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Drugs"
          value={stats.totalDrugs}
          icon="📦"
          color="blue"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          icon="⚠️"
          color="yellow"
          trend={stats.lowStockCount > 0 ? 'warning' : 'good'}
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStockCount}
          icon="❌"
          color="red"
          trend={stats.outOfStockCount > 0 ? 'critical' : 'good'}
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringCount}
          icon="⏰"
          color="orange"
          trend={stats.expiringCount > 0 ? 'warning' : 'good'}
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue (Last 30 Days)</h3>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            From {stats.recentTransactions} transactions
          </p>
        </div>
      </div>

      {/* Low Stock Drugs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Low Stock Drugs</h2>
        </div>
        <div className="p-6">
          {lowStockDrugs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No low stock items</p>
          ) : (
            <div className="space-y-4">
              {lowStockDrugs.map((drug: any) => (
                <div
                  key={drug.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{drug.name}</h3>
                    <p className="text-sm text-gray-600">{drug.genericName}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {drug.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-red-600">
                        {drug.totalQuantity}
                      </span>
                      <span className="text-sm text-gray-500">units</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {drug.minimumStockLevel} | Reorder: {drug.reorderLevel}
                    </p>
                    <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                        drug.stockPercentage < 10
                          ? 'bg-red-600'
                          : drug.stockPercentage < 25
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(drug.stockPercentage, 100)}%` }} 
                        />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expiring Drugs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Expiring Soon (Next 30 Days)</h2>
        </div>
        <div className="p-6">
          {expiringDrugs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expiring drugs</p>
          ) : (
            <div className="space-y-4">
              {expiringDrugs.map((drug: any) => (
                <div
                  key={drug.id}
                  className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{drug.name}</h3>
                      <p className="text-sm text-gray-600">{drug.genericName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-700">
                        {drug.expiringQuantity} units expiring
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(drug.nearestExpiry!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {drug.batches.slice(0, 3).map((batch: any) => (
                      <div key={batch.id} className="text-xs text-gray-600 flex justify-between">
                        <span>Batch: {batch.batchNumber}</span>
                        <span>
                          {batch.quantityAvailable} units - Expires{' '}
                          {new Date(batch.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No recent transactions
                  </td>
                </tr>
              ) : (
                recentTransactions.map((transaction: any) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'SALE'
                            ? 'bg-green-100 text-green-800'
                            : transaction.type === 'PURCHASE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.drug.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.customer
                        ? `${transaction.customer.firstName} ${transaction.customer.lastName}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${Number(transaction.totalPrice).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: 'good' | 'warning' | 'critical';
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
  };

  const trendClasses = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${trend ? trendClasses[trend] : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-full ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-10 flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}