import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.logo}>
        <span style={S.star}>✦</span>
        <span style={S.logoText}>Shop</span>
        <span style={S.logoSub}>Sphere</span>
      </Link>

      <div style={S.links}>
        <Link to="/" style={S.link}>
          Home
        </Link>
        <Link to="/add-product" style={S.link}>
          Add Product
        </Link>

        <Link to="/cart" style={S.cartWrap}>
          <span style={{ fontSize: "20px" }}>🛒</span>
          {totalItems > 0 && <span style={S.badge}>{totalItems}</span>}
        </Link>

        {token ? (
          <div style={S.userRow}>
            <span style={S.userName}>Hi, {user?.name?.split(" ")[0]}</span>
            <button onClick={handleLogout} style={S.logoutBtn}>
              Logout
            </button>
          </div>
        ) : (
          <div style={S.userRow}>
            <Link to="/login" style={S.link}>
              Login
            </Link>
            <Link to="/register" style={S.regBtn}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const S = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: "70px",
    background: "rgba(10,10,15,0.97)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
  },
  star: { color: "#e8c547", fontSize: "18px" },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#f0f0f5",
    letterSpacing: "3px",
  },
  logoSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    color: "#e8c547",
    letterSpacing: "4px",
    fontWeight: "500",
    marginTop: "3px",
  },
  links: { display: "flex", alignItems: "center", gap: "28px" },
  link: {
    color: "#9090a8",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
  },
  cartWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    background: "#e8c547",
    color: "#0a0a0f",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userRow: { display: "flex", alignItems: "center", gap: "12px" },
  userName: { fontSize: "13px", color: "#e8c547", fontWeight: "500" },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#9090a8",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  regBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    padding: "8px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default Navbar;
