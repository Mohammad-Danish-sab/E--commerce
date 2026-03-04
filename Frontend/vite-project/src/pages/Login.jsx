import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    // setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      // FIX: Save both token AND user object (original only saved token)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back, " + data.user.name + "!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.top}>
          <span style={S.star}>✦</span>
          <h2 style={S.title}>Welcome Back</h2>
          <p style={S.sub}>Sign in to your account</p>
        </div>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={loginHandler} style={S.form}>
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={S.btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={S.footer}>
          No account?{" "}
          <Link to="/register" style={S.flink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

const S = {
  page: {
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  top: { textAlign: "center", marginBottom: "32px" },
  star: {
    fontSize: "24px",
    color: "#e8c547",
    display: "block",
    marginBottom: "12px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px",
    color: "#f0f0f5",
    marginBottom: "8px",
  },
  sub: { color: "#9090a8", fontSize: "14px" },
  error: {
    background: "rgba(255,77,109,0.1)",
    border: "1px solid rgba(255,77,109,0.3)",
    color: "#ff4d6d",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#9090a8" },
  btn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    marginTop: "8px",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    color: "#9090a8",
    fontSize: "14px",
  },
  flink: { color: "#e8c547", fontWeight: "600" },
};

export default Login;
