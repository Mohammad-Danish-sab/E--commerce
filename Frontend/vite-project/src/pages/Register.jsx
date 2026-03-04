import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    // FIX: Original had NO try/catch — any API error crashed silently
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Full Name",
      type: "text",
      val: name,
      set: setName,
      ph: "Your full name",
    },
    {
      label: "Email",
      type: "email",
      val: email,
      set: setEmail,
      ph: "you@email.com",
    },
    {
      label: "Password",
      type: "password",
      val: password,
      set: setPassword,
      ph: "Min. 6 characters",
    },
  ];

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.top}>
          <span style={S.star}>✦</span>
          <h2 style={S.title}>Create Account</h2>
          <p style={S.sub}>Join us today</p>
        </div>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={registerHandler} style={S.form}>
          {fields.map(({ label, type, val, set, ph }) => (
            <div key={label} style={S.field}>
              <label style={S.label}>{label}</label>
              <input
                type={type}
                placeholder={ph}
                value={val}
                onChange={(e) => set(e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={S.btn}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={S.footer}>
          Have an account?{" "}
          <Link to="/login" style={S.flink}>
            Sign in
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

export default Register;
