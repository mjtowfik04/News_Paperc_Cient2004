import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50 ">
      {/* লোগো */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          DPI
        </Link>
      </div>

      {/* সার্চ + প্রোফাইল/লগইন */}
      <div className="flex gap-2 items-center">
        {/* সার্চ বার */}
        <input
          type="text"
          placeholder="সার্চ করুন..."
          className="input input-bordered w-24 md:w-64 hidden md:block"
        />

        {/* মোবাইলে সার্চ আইকন (অপশনাল) */}
        <button className="btn btn-ghost btn-circle md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* লগইন/প্রোফাইল */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="menu-title">
                <span className="font-bold">{user.username || "User"}</span>
                <span className="text-sm text-gray-600">{user.email}</span>
              </li>
              <li>
                <Link to="/profile" className="justify-between">
                  প্রোফাইল
                  <span className="badge badge-primary badge-sm">নতুন</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">সেটিংস</Link>
              </li>
              <li>
                <button onClick={logoutUser} className="text-error">
                  লগআউট
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-primary btn-sm">
              লগইন
            </Link>
            <Link to="/register" className="btn btn-outline btn-sm">
              রেজিস্টার
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;