import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      localStorage.removeItem("token");
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-9 py-4 shadow border border-yellow-300">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Link to="/" className="text-xl font-bold">
          Campus Connect
        </Link>

        <div className="flex gap-4 items-center flex-wrap">
          <Link to="/" className="hover:underline">
            Jobs
          </Link>

          {user?.role === "COMPANY" && (
            <Link to="/post-job" className="hover:underline">
              Post Job
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="text-sm bg-white text-blue-600 px-2 py-1 rounded">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
