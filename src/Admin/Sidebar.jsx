import {
  FiBarChart2,
  FiPackage,
  FiPlusCircle,
  FiShoppingCart,
  FiStar,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router";
import AuthContext from "../context/AuthContext";
// import { useContext } from "react";

const Sidebar = () => {
//   const { user } = useContext(AuthContext);

  // ✅ Sidebar এ এখন শুধুই admin menu থাকবে
  const adminMenus = [
    { to: "/", icon: FiBarChart2, label: "Dashboard" },
    { to: "/products", icon: FiPackage, label: "Products" },
    { to: "/dashboard/products/add", icon: FiPlusCircle, label: "Add Product" },
    { to: "/categories/add", icon: FiPlusCircle, label: "Add Category" },
    { to: "/comment", icon: FiStar, label: "Comment" },
    { to: "/users", icon: FiUsers, label: "Users" },
  ];

  const menuItems = adminMenus; // 👈 সরাসরি admin menu সেট করা হয়েছে

  return (
    <div className="drawer-side z-10">
      <label
        htmlFor="drawer-toggle"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <aside className="menu bg-base-200 w-64 min-h-full p-4 text-base-content">
        {/* Sidebar Header */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-6 px-2">
            <FiShoppingCart className="h-6 w-6" />
            <h1 className="text-xl font-bold">PhiMart</h1>
          </Link>
        </div>

        {/* Sidebar Menu */}
        <ul className="menu menu-md gap-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to} className="flex items-center">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-6 text-xs text-base-content/70">
          © 2025 PhiMart Admin
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
