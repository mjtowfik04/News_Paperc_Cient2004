import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { FiMenu, FiX, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

const Naber = ({ sidebarOpen, toggleSidebar }) => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 border-b shadow-md fixed top-0 left-0 right-0 z-40">
      {/* মোবাইল মেনু বাটন */}
      <div className="flex-none lg:hidden">
        <button
          onClick={toggleSidebar}
          className="btn btn-square btn-ghost"
        >
          {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* টাইটেল */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-primary pl-4">অ্যাডমিন ড্যাশবোর্ড</h2>
      </div>

      {/* ডান পাশে */}
      <div className="flex-none gap-3 pr-4">
        <Link
          to="/dashboard"
          className="btn btn-ghost btn-circle tooltip tooltip-bottom"
          data-tip="ড্যাশবোর্ড"
        >
          <FiHome className="h-5 w-5" />
        </Link>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-2">
              <img
                alt="Admin"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li className="menu-title">
              <span className="font-bold">{user?.username || "Admin"}</span>
              <span className="text-sm text-gray-600">{user?.email}</span>
            </li>
            <li><Link to="/profile">প্রোফাইল</Link></li>
            <li><Link to="/settings">সেটিংস</Link></li>
            <li>
              <button onClick={logoutUser} className="text-error">
                লগআউট
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Naber;