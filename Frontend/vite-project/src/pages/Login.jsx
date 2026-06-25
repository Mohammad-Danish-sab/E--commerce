import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome ${data.user.name}`);

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <div style={styles.logo}>
          <ShoppingBag size={42} color="#E8C547" />
        </div>

        <h1 style={styles.heading}>Welcome Back</h1>

        <p style={styles.subtitle}>Login to continue shopping</p>

        <form onSubmit={loginHandler}>
          <div style={styles.inputBox}>
            <Mail size={18} color="#999" />

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputBox}>
            <Lock size={18} color="#999" />

            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={styles.row}>
            <label style={styles.checkbox}>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password" style={styles.link}>
              Forgot Password?
            </Link>
          </div>

          <button disabled={loading} style={styles.button}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={styles.bottom}>
          Don't have an account?
          <Link to="/register" style={styles.register}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#050507,#111118,#0b0b10)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },

  overlay: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "rgba(232,197,71,.12)",
    filter: "blur(120px)",
    top: -100,
    right: -100,
  },

  card: {
    width: 430,
    maxWidth: "100%",
    background: "rgba(17,17,24,.92)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 25,
    padding: 40,
    color: "#fff",
    zIndex: 10,
    boxShadow: "0 20px 60px rgba(0,0,0,.45)",
  },

  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },

  heading: {
    textAlign: "center",
    fontSize: 34,
    marginBottom: 10,
    color: "#fff",
  },

  subtitle: {
    textAlign: "center",
    color: "#999",
    marginBottom: 35,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "#1B1B24",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 18,
    border: "1px solid rgba(255,255,255,.06)",
  },

  input: {
    flex: 1,
    marginLeft: 12,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 15,
  },

  eyeBtn: {
    background: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    color: "#999",
    fontSize: 14,
  },

  checkbox: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },

  link: {
    color: "#E8C547",
    textDecoration: "none",
  },

  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#E8C547,#C79A17)",
    color: "#111",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
  },

  bottom: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
  },

  register: {
    marginLeft: 8,
    color: "#E8C547",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
