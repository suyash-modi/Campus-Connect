import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      localStorage.setItem("role", decoded.role);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="btn mt-2" onClick={loginUser}>Login</button>
    </div>
  );
}
