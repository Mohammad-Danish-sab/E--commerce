import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <SalesChart />

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
