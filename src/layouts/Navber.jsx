import { Link } from "react-router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          DPI
        </Link>
      </div>

      <div className="flex-none gap-4">
        {/* Logged in হলে */}
        {user ? (
          <>
            <p className="font-semibold">{user.email}</p>

            <button onClick={logoutUser} className="btn btn-error btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Logged out হলে */}
            <div className="flex gap-4">
              {" "}
              {/* parent কে flex দিয়ে gap নির্ধারণ */}
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm">
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
