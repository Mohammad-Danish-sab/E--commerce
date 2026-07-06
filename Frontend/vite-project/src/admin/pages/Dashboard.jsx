import AdminLayout from "../layout/AdminLayout";

import DashboardCard from "../components/DashboardCard";

import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="dashboard-grid">
        <DashboardCard
          title="Revenue"
          value="₹2,45,000"
          icon={<DollarSign />}
          color="#10b981"
        />

        <DashboardCard
          title="Orders"
          value="152"
          icon={<ShoppingCart />}
          color="#3b82f6"
        />

        <DashboardCard
          title="Users"
          value="86"
          icon={<Users />}
          color="#f59e0b"
        />

        <DashboardCard
          title="Products"
          value="49"
          icon={<Package />}
          color="#ef4444"
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
