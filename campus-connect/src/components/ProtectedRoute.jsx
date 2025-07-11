import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const user = jwtDecode(token);
  if (user.role !== allowedRole) return <Navigate to="/" />;

  return <Outlet />;
}
