import {  useState } from "react";
import {
  FiBarChart2,
  FiPackage,
  FiPlusCircle,
  FiShoppingCart,
  FiStar,
  FiTag,
  FiUsers,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router"; // ✅ FIXED
import AuthContext from "../context/AuthContext";
import Sidebar from "../Admin/Sidebar";
import Naber from "../Admin/Naber";
import Main_content from "../Admin/Main_content";

export default function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={toggleSidebar}
      />

      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Naber sidebarOpen={sidebarOpen} />

        {/* Main content */}
        <Main_content/>
        
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
