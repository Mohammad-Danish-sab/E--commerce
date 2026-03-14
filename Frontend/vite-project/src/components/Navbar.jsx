import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifications = JSON.parse(
    localStorage.getItem("notifications") || "[]"
  );
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navBg =
    theme === "light"
      ? "rgba(245,245,240,0.97)"
      : "rgba(8,8,15,0.97)";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out.");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        style={{
          ...S.nav,
          background: navBg,
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Logo */}
        <Link to="/" style={S.logo}>
          <span style={S.star}>✦</span>
          <div>
            <span style={S.logoText}>LUXE</span>
            <span style={S.logoSub}>STORE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={S.desktopNav} className="luxe-desktop-nav">
          {[
            { to: "/", label: "Home" },
            { to: "/orders", label: "Orders" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...S.navLink,
                ...(isActive(to) ? S.navLinkActive : {}),
              }}
            >
              {label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              style={{ ...S.navLink, color: "#e8c547", fontWeight: "600" }}
            >
              ⚙️ Admin
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div style={S.desktopActions} className="luxe-desktop-actions">

          <ThemeToggle />

          <Link to="/wishlist" style={S.iconBtn}>
            🤍
            {wishlist.length > 0 && (
              <span style={S.badge}>{wishlist.length}</span>
            )}
          </Link>

          <Link to="/cart" style={S.iconBtn}>
            🛒
            {totalItems > 0 && (
              <span style={{ ...S.badge, background: "#e8c547" }}>
                {totalItems}
              </span>
            )}
          </Link>

          {token ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/profile" style={S.avatar}>
                {user?.name?.slice(0, 1).toUpperCase() || "U"}
              </Link>

              <button onClick={handleLogout} style={S.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to="/login" style={S.loginBtn}>
                Login
              </Link>

              <Link to="/register" style={S.registerBtn}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right */}
        <div style={S.mobileRight} className="luxe-mobile-right">
          <Link to="/cart" style={S.iconBtn}>
            🛒
            {totalItems > 0 && (
              <span style={{ ...S.badge, background: "#e8c547" }}>
                {totalItems}
              </span>
            )}
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} style={S.burger}>
            <div style={S.burgerLine}></div>
            <div style={S.burgerLine}></div>
            <div style={S.burgerLine}></div>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={S.overlay}></div>
      )}

      <div
        style={{
          ...S.drawer,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <Link to="/" style={S.drawerLink}>🏠 Home</Link>
        <Link to="/orders" style={S.drawerLink}>📦 Orders</Link>
        <Link to="/wishlist" style={S.drawerLink}>🤍 Wishlist</Link>
        <Link to="/cart" style={S.drawerLink}>🛒 Cart</Link>
        <Link to="/profile" style={S.drawerLink}>👤 Profile</Link>

        {user?.role === "admin" && (
          <Link to="/admin" style={S.drawerLink}>⚙️ Admin</Link>
        )}

        {token && (
          <button onClick={handleLogout} style={S.drawerLogout}>
            Logout
          </button>
        )}
      </div>
    </>
  );
};

const S = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "68px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    zIndex: 200,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
  },

  star: { color: "#e8c547", fontSize: "20px" },

  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f0f0f5",
    letterSpacing: "3px",
  },

  logoSub: {
    fontSize: "10px",
    color: "#e8c547",
    letterSpacing: "4px",
  },

  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  navLink: {
    color: "#9090a8",
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: "8px",
  },

  navLinkActive: {
    color: "#f0f0f5",
    background: "rgba(255,255,255,0.07)",
  },

  desktopActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  iconBtn: {
    position: "relative",
    textDecoration: "none",
    fontSize: "18px",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    background: "#ff4d6d",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    padding: "3px 6px",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#e8c547",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    textDecoration: "none",
  },

  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#9090a8",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  loginBtn: {
    color: "#9090a8",
    textDecoration: "none",
    padding: "7px 16px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
  },

  registerBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    padding: "7px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
  },

  mobileRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  burger: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  burgerLine: {
    width: "22px",
    height: "2px",
    background: "#f0f0f5",
    margin: "4px 0",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 198,
  },

  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "260px",
    height: "100vh",
    background: "#0d0d14",
    zIndex: 199,
    display: "flex",
    flexDirection: "column",
    paddingTop: "80px",
  },

  drawerLink: {
    padding: "14px 20px",
    textDecoration: "none",
    color: "#f0f0f5",
  },

  drawerLogout: {
    margin: "20px",
    padding: "10px",
    background: "#ff4d6d",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
  },
};

export default Navbar;

