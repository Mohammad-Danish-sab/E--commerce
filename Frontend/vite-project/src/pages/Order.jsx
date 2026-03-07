import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_COLOR = {
  pending: { bg: "rgba(232,197,71,0.12)", color: "#e8c547" },
  processing: { bg: "rgba(99,179,237,0.12)", color: "#63b3ed" },
  shipped: { bg: "rgba(104,211,145,0.12)", color: "#68d391" },
  delivered: { bg: "rgba(104,211,145,0.2)", color: "#48bb78" },
  cancelled: { bg: "rgba(255,77,109,0.12)", color: "#ff4d6d" },
};

const STATUS_ICON = {
  pending: "🕐",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  if (loading)
    return (
      <div style={S.page}>
        <h1 style={S.heading}>Order History</h1>
        <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              style={{
                ...S.card,
                height: "90px",
                position: "relative",
                overflow: "hidden",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)",
                  animation: "shimmer 1.5s infinite",
                  position: "absolute",
                  inset: 0,
                }}
              ></div>
            </div>
          ))}
      </div>
    );

  if (orders.length === 0)
    return (
      <div style={S.page}>
        <h1 style={S.heading}>Order History</h1>
        <div style={S.empty}>
          <p style={{ fontSize: "64px" }}>📦</p>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "24px",
              color: "#f0f0f5",
            }}
          >
            No orders yet
          </h3>
          <p style={{ color: "#9090a8" }}>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/")} style={S.goldBtn}>
            Browse Products
          </button>
        </div>
      </div>
    );

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div>
          <h1 style={S.heading}>Order History</h1>
          <p style={S.sub}>
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        <button onClick={() => navigate("/")} style={S.ghostBtn}>
          Continue Shopping
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {orders.map((order) => {
          const status = order.status || "pending";
          const sc = STATUS_COLOR[status] || STATUS_COLOR.pending;
          const isOpen = expanded === order._id;
          const total =
            order.totalAmount ||
            order.products?.reduce((s, p) => s + p.price * p.quantity, 0) ||
            0;
          const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const itemCount =
            order.products?.reduce((s, p) => s + p.quantity, 0) || 0;

          return (
            <div key={order._id} style={S.card}>
              <div style={S.cardHead} onClick={() => toggle(order._id)}>
                <div style={S.cardLeft}>
                  <div
                    style={{
                      ...S.statusBadge,
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    <span>{STATUS_ICON[status]}</span>
                    <span style={{ textTransform: "capitalize" }}>
                      {status}
                    </span>
                  </div>
                  <div>
                    <p style={S.orderId}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={S.orderMeta}>
                      {date} · {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div style={S.cardRight}>
                  <span style={S.orderTotal}>
                    Rs.{Number(total).toLocaleString()}
                  </span>
                  <span
                    style={{
                      color: "#9090a8",
                      fontSize: "18px",
                      display: "inline-block",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: "0 24px 20px" }}>
                  <div style={S.divider}></div>
                  {order.products?.map((item, idx) => (
                    <div key={idx} style={S.itemRow}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={S.itemImg}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/56x56/1a1a24/9090a8?text=?";
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            color: "#f0f0f5",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {item.title}
                        </p>
                        <p
                          style={{
                            color: "#9090a8",
                            fontSize: "12px",
                            marginTop: "3px",
                          }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p
                        style={{
                          color: "#f0f0f5",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        Rs.{Number(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div style={S.divider}></div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#9090a8" }}>Order Total</span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#e8c547",
                      }}
                    >
                      Rs.{Number(total).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const S = {
  page: { maxWidth: "820px", margin: "0 auto", padding: "40px 24px 80px" },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
  },
  heading: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "36px",
    color: "#f0f0f5",
    marginBottom: "6px",
  },
  sub: { color: "#9090a8", fontSize: "14px" },
  ghostBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#9090a8",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    cursor: "pointer",
  },
  goldBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "8px",
  },
  card: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    cursor: "pointer",
  },
  cardLeft: { display: "flex", alignItems: "center", gap: "16px" },
  cardRight: { display: "flex", alignItems: "center", gap: "16px" },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: 0,
  },
  orderId: { color: "#f0f0f5", fontWeight: "600", fontSize: "15px" },
  orderMeta: { color: "#9090a8", fontSize: "12px", marginTop: "3px" },
  orderTotal: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#e8c547",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "14px 0",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "12px",
  },
  itemImg: {
    width: "56px",
    height: "56px",
    borderRadius: "10px",
    objectFit: "cover",
    flexShrink: 0,
    background: "#1a1a24",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
};

export default Orders;
