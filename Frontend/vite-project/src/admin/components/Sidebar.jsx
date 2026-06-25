import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ShoppingCart,
  Users,
  Star,
  Tag,
  Settings,
  Ticket,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <PlusSquare size={20} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: <Star size={20} />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <Tag size={20} />,
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: <Ticket size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>NextShop</h2>
        <span>Admin Panel</span>
      </div>

      <nav>
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? "menu active" : "menu")}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
