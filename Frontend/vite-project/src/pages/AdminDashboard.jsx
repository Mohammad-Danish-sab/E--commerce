import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StatCard = ({ icon, label, value, sub, color = "#e8c547" }) => (
  <div
    style={{
      background: "#111118",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <p style={{ color: "#9090a8", fontSize: "13px", marginBottom: "10px" }}>
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "28px",
            fontWeight: "700",
            color,
          }}
        >
          {value}
        </p>
        {sub && (
          <p style={{ color: "#9090a8", fontSize: "12px", marginTop: "5px" }}>
            {sub}
          </p>
        )}
      </div>
      <span style={{ fontSize: "26px" }}>{icon}</span>
    </div>
  </div>
);

const BarChart = ({ data, max }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: "8px",
      height: "100px",
    }}
  >
    {data.map((item, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <p style={{ color: "#9090a8", fontSize: "11px", fontWeight: "600" }}>
          {item.value > 0 ? `Rs.${item.value}` : ""}
        </p>
        <div
          style={{
            width: "100%",
            height: "64px",
            display: "flex",
            alignItems: "flex-end",
            background: "rgba(232,197,71,0.06)",
            borderRadius: "6px 6px 0 0",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "linear-gradient(to top,#e8c547,#c9a227)",
              borderRadius: "6px 6px 0 0",
              height: `${max ? (item.value / max) * 100 : 0}%`,
              minHeight: item.value > 0 ? "4px" : "0",
              transition: "height 0.8s ease",
            }}
          ></div>
        </div>
        <span
          style={{ fontSize: "10px", color: "#9090a8", whiteSpace: "nowrap" }}
        >
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

const STATUS_COLOR = {
  pending: "#e8c547",
  processing: "#63b3ed",
  shipped: "#68d391",
  delivered: "#48bb78",
  cancelled: "#ff4d6d",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "admin") {
      toast.error("Admin access required.");
      navigate("/");
      return;
    }
    const h = { Authorization: "Bearer " + token };
    Promise.all([
      axios.get("http://localhost:5000/api/orders/all", { headers: h }),
      axios.get("http://localhost:5000/api/products", { headers: h }),
      axios.get("http://localhost:5000/api/auth/users", { headers: h }),
    ])
      .then(([o, p, u]) => {
        setOrders(o.data);
        setProducts(p.data);
        setUsers(u.data);
        const totalRevenue = o.data.reduce(
          (s, x) => s + (x.totalAmount || 0),
          0,
        );
        const pending = o.data.filter(
          (x) => (x.status || "pending") === "pending",
        ).length;
        setStats({
          totalRevenue,
          totalOrders: o.data.length,
          totalProducts: p.data.length,
          totalUsers: u.data.length,
          pending,
        });
      })
      .catch(() => toast.error("Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: "Bearer " + token } },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
      toast.success("Order status updated!");
    } catch {
      toast.error("Failed to update.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const revenueChart = Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      const value = orders
        .filter(
          (o) => new Date(o.createdAt).toDateString() === d.toDateString(),
        )
        .reduce((s, o) => s + (o.totalAmount || 0), 0);
      return { label, value };
    });
  const chartMax = Math.max(...revenueChart.map((d) => d.value), 1);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTop: "3px solid #e8c547",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        ></div>
        <p style={{ color: "#9090a8" }}>Loading dashboard...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "36px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "12px",
              color: "#e8c547",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Admin Panel
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "36px",
              color: "#f0f0f5",
            }}
          >
            Dashboard
          </h1>
        </div>
        <button
          onClick={() => navigate("/add-product")}
          style={{
            background: "#e8c547",
            color: "#0a0a0f",
            border: "none",
            padding: "11px 24px",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`Rs.${Number(stats.totalRevenue).toLocaleString()}`}
        />
        <StatCard
          icon="📦"
          label="Total Orders"
          value={stats.totalOrders}
          sub={`${stats.pending} pending`}
          color="#63b3ed"
        />
        <StatCard
          icon="🛍️"
          label="Total Products"
          value={stats.totalProducts}
          color="#68d391"
        />
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers}
          color="#c084fc"
        />
      </div>

      {/* Revenue Chart */}
      <div
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "18px",
            color: "#f0f0f5",
            marginBottom: "24px",
          }}
        >
          Revenue — Last 7 Days
        </h3>
        <BarChart data={revenueChart} max={chartMax} />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: "#111118",
          padding: "5px",
          borderRadius: "12px",
          width: "fit-content",
          marginBottom: "28px",
        }}
      >
        {["overview", "orders", "products", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "9px 20px",
              borderRadius: "9px",
              border: "none",
              background: tab === t ? "#1a1a24" : "transparent",
              color: tab === t ? "#f0f0f5" : "#9090a8",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: tab === t ? "600" : "400",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "18px",
                color: "#f0f0f5",
                marginBottom: "16px",
              }}
            >
              Recent Orders
            </h3>
            {orders.slice(0, 5).map((o) => (
              <div
                key={o._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#f0f0f5",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    #{o._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ color: "#9090a8", fontSize: "11px" }}>
                    {o.user?.name || "Guest"}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: STATUS_COLOR[o.status || "pending"],
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  ● {o.status || "pending"}
                </span>
                <p
                  style={{
                    color: "#e8c547",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  Rs.{Number(o.totalAmount || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "18px",
                color: "#f0f0f5",
                marginBottom: "16px",
              }}
            >
              Products
            </h3>
            {products.slice(0, 5).map((p) => (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <img
                  src={p.image}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    background: "#1a1a24",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/40x40/1a1a24/9090a8?text=?";
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: "#f0f0f5",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {p.title}
                  </p>
                  <p style={{ color: "#9090a8", fontSize: "11px" }}>
                    {p.category}
                  </p>
                </div>
                <p
                  style={{
                    color: "#e8c547",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  Rs.{Number(p.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "160px" }}>
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
                    marginTop: "2px",
                  }}
                >
                  {order.user?.name || "Guest"} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p
                style={{
                  color: "#e8c547",
                  fontWeight: "700",
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "16px",
                }}
              >
                Rs.{Number(order.totalAmount || 0).toLocaleString()}
              </p>
              <select
                value={order.status || "pending"}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                style={{
                  background: "#1a1a24",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: STATUS_COLOR[order.status || "pending"],
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  outline: "none",
                  fontWeight: "600",
                  minWidth: "130px",
                }}
              >
                {[
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((s) => (
                  <option key={s} value={s} style={{ color: "#f0f0f5" }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/240x160/1a1a24/9090a8?text=No+Image";
                }}
              />
              <div style={{ padding: "14px" }}>
                <p
                  style={{
                    color: "#f0f0f5",
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "3px",
                  }}
                >
                  {p.title}
                </p>
                <p
                  style={{
                    color: "#9090a8",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  {p.category}
                </p>
                <p
                  style={{
                    color: "#e8c547",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  Rs.{Number(p.price).toLocaleString()}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => navigate("/product/" + p._id)}
                    style={{
                      flex: 1,
                      background: "rgba(99,179,237,0.1)",
                      color: "#63b3ed",
                      border: "1px solid rgba(99,179,237,0.2)",
                      padding: "7px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    style={{
                      flex: 1,
                      background: "rgba(255,77,109,0.1)",
                      color: "#ff4d6d",
                      border: "1px solid rgba(255,77,109,0.2)",
                      padding: "7px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {users.map((u) => (
            <div
              key={u._id}
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#e8c547,#c9a227)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  color: "#0a0a0f",
                  fontSize: "15px",
                  flexShrink: 0,
                }}
              >
                {u.name?.slice(0, 1).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "#f0f0f5",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {u.name}
                </p>
                <p style={{ color: "#9090a8", fontSize: "12px" }}>{u.email}</p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background:
                    u.role === "admin"
                      ? "rgba(232,197,71,0.15)"
                      : "rgba(255,255,255,0.05)",
                  color: u.role === "admin" ? "#e8c547" : "#9090a8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {u.role || "user"}
              </span>
              <p style={{ color: "#9090a8", fontSize: "12px", flexShrink: 0 }}>
                Joined{" "}
                {new Date(u.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AdminDashboard;
