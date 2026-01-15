import React from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiPackage,
  FiPlusCircle,
  FiStar,
  FiTag,
  FiUsers,
  FiShoppingCart,
} from "react-icons/fi";

const Sidebar = () => {
  const adminMenus = [
    { to: "/dashboard", icon: FiBarChart2, label: "ড্যাশবোর্ড" },
    { to: "/all-news-manage", icon: FiPackage, label: "সব নিউজ" },
    { to: "/news/add", icon: FiPlusCircle, label: "নিউজ যোগ করুন" },
    { to: "/categories-manage", icon: FiTag, label: "ক্যাটাগরি" },
    { to: "/comment", icon: FiStar, label: "কমেন্ট" },
    { to: "/users", icon: FiUsers, label: "ইউজার" },
  ];

  return (
    <aside className="bg-base-200 w-64 min-h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Link to="/dashboard" className="flex items-center gap-3">
          <FiShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">DPI News</h1>
        </Link>
      </div>

      {/* Menu */}
      <ul className="menu p-4 flex-1">
        {adminMenus.map((item, index) => (
          <li key={index} className="mb-2">
            <Link
              to={item.to}
              className="flex items-center gap-3 text-lg hover:bg-primary hover:text-white rounded-lg transition"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="p-4 border-t text-center text-sm text-gray-600">
        © 2025 DPI News Admin
      </div>
    </aside>
  );
};

export default Sidebar;