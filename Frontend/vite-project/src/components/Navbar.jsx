import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

    const notifications = JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    const unreadNotifs = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
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
   const S = (k) => `var(--${k})`;

   const navBg =
     theme === "light" ? `rgba(245,245,240,0.97)` : `rgba(8,8,15,0.97)`;
     
  return (
    <>
      <nav
        style={{
          ...S.nav,
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
        <div style={S.desktopNav}>
          {[
            { to: "/", label: "Home" },
            { to: "/orders", label: "Orders" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ ...S.navLink, ...(isActive(to) ? S.navLinkActive : {}) }}
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
        <div style={S.desktopActions}>
          <Link to="/wishlist" style={S.iconBtn}>
            <span style={{ fontSize: "18px" }}>🤍</span>
            {wishlist.length > 0 && (
              <span style={S.badge}>{wishlist.length}</span>
            )}
          </Link>
          <Link to="/cart" style={S.iconBtn}>
            <span style={{ fontSize: "18px" }}>🛒</span>
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

        {/* Mobile: cart + burger */}
        <div style={S.mobileRight}>
          <Link to="/cart" style={S.iconBtn}>
            <span style={{ fontSize: "20px" }}>🛒</span>
            {totalItems > 0 && (
              <span style={{ ...S.badge, background: "#e8c547" }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen((o) => !o)} style={S.burger}>
            <div
              style={{
                ...S.burgerLine,
                transform: menuOpen
                  ? "rotate(45deg) translate(5px,5px)"
                  : "none",
              }}
            ></div>
            <div style={{ ...S.burgerLine, opacity: menuOpen ? 0 : 1 }}></div>
            <div
              style={{
                ...S.burgerLine,
                transform: menuOpen
                  ? "rotate(-45deg) translate(5px,-5px)"
                  : "none",
              }}
            ></div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={S.overlay}></div>
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          ...S.drawer,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {token && (
          <div style={S.drawerUser}>
            <div style={S.drawerAvatar}>
              {user?.name?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div>
              <p
                style={{
                  color: "#f0f0f5",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                {user?.name}
              </p>
              <p style={{ color: "#9090a8", fontSize: "12px" }}>
                {user?.email}
              </p>
            </div>
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {[
            { to: "/", icon: "🏠", label: "Home" },
            { to: "/orders", icon: "📦", label: "My Orders" },
            {
              to: "/wishlist",
              icon: "🤍",
              label: `Wishlist ${wishlist.length > 0 ? "(" + wishlist.length + ")" : ""}`,
            },
            {
              to: "/cart",
              icon: "🛒",
              label: `Cart ${totalItems > 0 ? "(" + totalItems + ")" : ""}`,
            },
            { to: "/profile", icon: "👤", label: "Profile" },
            { to: "/add-product", icon: "➕", label: "Add Product" },
          ].map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...S.drawerLink,
                background: isActive(to)
                  ? "rgba(232,197,71,0.08)"
                  : "transparent",
                color: isActive(to) ? "#e8c547" : "#f0f0f5",
              }}
            >
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link to="/admin" style={{ ...S.drawerLink, color: "#e8c547" }}>
              <span style={{ fontSize: "18px" }}>⚙️</span>
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {token ? (
            <button onClick={handleLogout} style={S.drawerLogout}>
              🚪 Logout
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                to="/login"
                style={{ ...S.registerBtn, flex: 1, textAlign: "center" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ ...S.registerBtn, flex: 1, textAlign: "center" }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .luxe-desktop-nav,.luxe-desktop-actions{ display:none!important; }
          .luxe-mobile-right{ display:flex!important; }
        }
        @media(min-width:769px){
          .luxe-mobile-right{ display:none!important; }
          .luxe-desktop-nav,.luxe-desktop-actions{ display:flex!important; }
        }
      `}</style>
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
    background: "rgba(10,10,15,0.97)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    zIndex: 200,
    transition: "box-shadow 0.3s",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    flexShrink: 0,
  },
  star: { color: "#e8c547", fontSize: "20px" },
  logoText: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#f0f0f5",
    letterSpacing: "3px",
  },
  logoSub: {
    fontSize: "10px",
    color: "#e8c547",
    letterSpacing: "4px",
    fontWeight: "500",
    display: "block",
    lineHeight: 1,
    marginTop: "2px",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    className: "luxe-desktop-nav",
  },
  navLink: {
    color: "#9090a8",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  navLinkActive: { color: "#f0f0f5", background: "rgba(255,255,255,0.07)" },
  desktopActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    className: "luxe-desktop-actions",
  },
  iconBtn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    width: "36px",
    height: "36px",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-6px",
    background: "#ff4d6d",
    color: "#fff",
    borderRadius: "50%",
    width: "17px",
    height: "17px",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#e8c547,#c9a227)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    color: "#0a0a0f",
    fontSize: "13px",
    textDecoration: "none",
    flexShrink: 0,
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#9090a8",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  loginBtn: {
    color: "#9090a8",
    fontSize: "13px",
    fontWeight: "500",
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
    fontSize: "13px",
    fontWeight: "700",
    textDecoration: "none",
  },
  mobileRight: {
    display: "none",
    alignItems: "center",
    gap: "12px",
    className: "luxe-mobile-right",
  },
  burger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  burgerLine: {
    width: "22px",
    height: "2px",
    background: "#f0f0f5",
    borderRadius: "2px",
    transition: "all 0.3s",
    display: "block",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 198,
    backdropFilter: "blur(4px)",
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "280px",
    height: "100vh",
    background: "#0d0d14",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    zIndex: 199,
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease",
    paddingTop: "80px",
  },
  drawerUser: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    marginBottom: "8px",
  },
  drawerAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#e8c547,#c9a227)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    color: "#0a0a0f",
    fontSize: "16px",
    flexShrink: 0,
  },
  drawerLink: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "13px 20px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "0",
    transition: "background 0.15s",
  },
  drawerLogout: {
    width: "100%",
    background: "rgba(255,77,109,0.1)",
    border: "1px solid rgba(255,77,109,0.2)",
    color: "#ff4d6d",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: "600",
  },
};

export default Navbar;
