import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    Promise.all([
      axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: "Bearer " + token },
      }),
      axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: "Bearer " + token },
      }),
    ])
      .then(([u, o]) => {
        setUser(u.data);
        setForm({ name: u.data.name });
        setOrders(o.data);
      })
      .catch(() => toast.error("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/me",
        { name: form.name },
        { headers: { Authorization: "Bearer " + token } },
      );
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out.");
    navigate("/login");
  };

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const lastOrder = orders[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  if (loading)
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#1a1a24",
            margin: "0 auto 20px",
            animation: "pulse 1.5s infinite",
          }}
        ></div>
        {[200, 140].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 16,
              background: "#1a1a24",
              borderRadius: 8,
              margin: "12px auto",
              animation: "pulse 1.5s infinite",
            }}
          ></div>
        ))}
      </div>
    );

  return (
    <div style={S.page}>
      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={S.avatar}>{initials}</div>
        {editing ? (
          <input
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            style={S.nameInput}
            autoFocus
          />
        ) : (
          <h1 style={S.name}>{user?.name}</h1>
        )}
        <p style={{ color: "#9090a8", fontSize: "14px", marginBottom: "12px" }}>
          {user?.email}
        </p>
        <div style={S.memberBadge}>
          ✦ Member since{" "}
          {new Date(user?.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsRow}>
        {[
          { label: "Total Orders", val: orders.length },
          {
            label: "Total Spent",
            val: `Rs.${Number(totalSpent).toLocaleString()}`,
          },
          { label: "Last Order", val: lastOrder },
        ].map(({ label, val }) => (
          <div key={label} style={S.statCard}>
            <p style={S.statVal}>{val}</p>
            <p style={{ color: "#9090a8", fontSize: "12px" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={S.actionRow}>
        {editing ? (
          <>
            <button onClick={handleSave} disabled={saving} style={S.goldBtn}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => setEditing(false)} style={S.ghostBtn}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} style={S.goldBtn}>
            ✏️ Edit Profile
          </button>
        )}
        <button onClick={handleLogout} style={S.dangerBtn}>
          Logout
        </button>
      </div>

      {/* Quick Links */}
      <div style={S.linksGrid}>
        {[
          { to: "/orders", icon: "📦", label: "My Orders" },
          { to: "/wishlist", icon: "❤️", label: "Wishlist" },
          { to: "/cart", icon: "🛒", label: "My Cart" },
          { to: "/", icon: "🏠", label: "Home" },
        ].map(({ to, icon, label }) => (
          <Link key={to} to={to} style={S.linkCard}>
            <span style={{ fontSize: "22px" }}>{icon}</span>
            <span
              style={{
                color: "#f0f0f5",
                fontSize: "14px",
                fontWeight: "500",
                flex: 1,
              }}
            >
              {label}
            </span>
            <span style={{ color: "#9090a8" }}>→</span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "20px",
                color: "#f0f0f5",
              }}
            >
              Recent Orders
            </h2>
            <Link
              to="/orders"
              style={{
                color: "#e8c547",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              See All →
            </Link>
          </div>
          {orders.slice(0, 3).map((order) => {
            const SC = {
              pending: "#e8c547",
              processing: "#63b3ed",
              shipped: "#68d391",
              delivered: "#48bb78",
              cancelled: "#ff4d6d",
            };
            return (
              <div key={order._id} style={S.recentOrder}>
                <div>
                  <p
                    style={{
                      color: "#f0f0f5",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p
                    style={{
                      color: "#9090a8",
                      fontSize: "12px",
                      marginTop: "3px",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: SC[order.status || "pending"],
                    textTransform: "capitalize",
                  }}
                >
                  ● {order.status || "pending"}
                </span>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#e8c547",
                  }}
                >
                  Rs.{Number(order.totalAmount || 0).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const S = {
  page: { maxWidth: "600px", margin: "0 auto", padding: "48px 24px 80px" },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#e8c547,#c9a227)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display',serif",
    fontSize: "32px",
    fontWeight: "700",
    color: "#0a0a0f",
    margin: "0 auto 18px",
    boxShadow: "0 0 0 4px rgba(232,197,71,0.2)",
  },
  name: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "28px",
    color: "#f0f0f5",
    marginBottom: "6px",
  },
  nameInput: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "22px",
    color: "#f0f0f5",
    background: "#1a1a24",
    border: "1px solid rgba(232,197,71,0.4)",
    borderRadius: "10px",
    padding: "8px 16px",
    outline: "none",
    textAlign: "center",
    width: "100%",
    maxWidth: "280px",
    marginBottom: "6px",
  },
  memberBadge: {
    display: "inline-block",
    fontSize: "12px",
    color: "#e8c547",
    background: "rgba(232,197,71,0.1)",
    padding: "5px 14px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "12px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "20px 16px",
    textAlign: "center",
  },
  statVal: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "#e8c547",
    marginBottom: "6px",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  goldBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "11px 24px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#9090a8",
    padding: "11px 24px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  dangerBtn: {
    background: "rgba(255,77,109,0.1)",
    border: "1px solid rgba(255,77,109,0.25)",
    color: "#ff4d6d",
    padding: "11px 24px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  linksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "12px",
    marginBottom: "36px",
  },
  linkCard: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  recentOrder: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
};

export default Profile;
