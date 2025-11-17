import React, { useContext, } from "react";
import AuthContext from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router";

const Naber = ({sidebarOpen}) => {
    const { user, logoutUser } = useContext(AuthContext);
  


  
  return (
    <div>
      <div className="navbar bg-base-100 border-b">
        <div className="flex-none lg:hidden">
          <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
            {sidebarOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </label>
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>

              <li>
                <Link to="/settings">Settings</Link>
              </li>

              <li className="flex flex-col gap-1 py-2">
                <p className="font-semibold">{user?.email}</p>

                <button
                  onClick={logoutUser}
                  className="btn btn-error btn-sm w-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Naber;
