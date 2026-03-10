// pages/OrderTracking.jsx  →  route: /orders/:id/track
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const STEPS = ["pending", "processing", "shipped", "delivered"];

const STEP_META = {
  pending: {
    icon: "🕐",
    label: "Order Placed",
    desc: "Your order has been received.",
  },
  processing: {
    icon: "⚙️",
    label: "Processing",
    desc: "We're preparing your items.",
  },
  shipped: {
    icon: "🚚",
    label: "Out for Delivery",
    desc: "Your order is on the way!",
  },
  delivered: {
    icon: "✅",
    label: "Delivered",
    desc: "Your order has been delivered.",
  },
};

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(({ data }) => setOrder(data))
      .catch(() => toast.error("Order not found."))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
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
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  if (!order)
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#9090a8" }}>
        Order not found.
      </div>
    );

  const status = order.status || "pending";
  const currentStep = STEPS.indexOf(status);
  const isCancelled = status === "cancelled";
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px" }}
    >
      <button
        onClick={() => navigate("/orders")}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#9090a8",
          padding: "8px 18px",
          borderRadius: "8px",
          marginBottom: "32px",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        ← Back to Orders
      </button>

      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
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
          Order Tracking
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "30px",
            color: "#f0f0f5",
            marginBottom: "6px",
          }}
        >
          #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p style={{ color: "#9090a8", fontSize: "14px" }}>Placed on {date}</p>
      </div>

      {/* Cancelled State */}
      {isCancelled && (
        <div
          style={{
            background: "rgba(255,77,109,0.08)",
            border: "1px solid rgba(255,77,109,0.2)",
            borderRadius: "14px",
            padding: "20px 24px",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "36px", marginBottom: "8px" }}>❌</p>
          <p style={{ color: "#ff4d6d", fontWeight: "700", fontSize: "16px" }}>
            Order Cancelled
          </p>
          <p style={{ color: "#9090a8", fontSize: "14px", marginTop: "6px" }}>
            This order was cancelled.
          </p>
        </div>
      )}

      {/* Progress Tracker */}
      {!isCancelled && (
        <div
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Progress line */}
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: "22px",
                right: "22px",
                height: "2px",
                background: "rgba(255,255,255,0.07)",
                zIndex: 0,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: "22px",
                height: "2px",
                background: "#e8c547",
                zIndex: 1,
                width: `${Math.max(0, currentStep / (STEPS.length - 1)) * 100}%`,
                transition: "width 1s ease",
              }}
            ></div>

            {/* Steps */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 2,
              }}
            >
              {STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                const meta = STEP_META[step];
                return (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        background: done
                          ? "linear-gradient(135deg,#e8c547,#c9a227)"
                          : "#1a1a24",
                        border: active
                          ? "3px solid #e8c547"
                          : done
                            ? "none"
                            : "2px solid rgba(255,255,255,0.1)",
                        boxShadow: active
                          ? "0 0 20px rgba(232,197,71,0.4)"
                          : "none",
                        transition: "all 0.4s",
                      }}
                    >
                      {done ? (
                        meta.icon
                      ) : (
                        <span style={{ color: "#9090a8", fontSize: "14px" }}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: done ? "#f0f0f5" : "#9090a8",
                        }}
                      >
                        {meta.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current step desc */}
          <div
            style={{
              marginTop: "28px",
              padding: "16px 20px",
              background: "rgba(232,197,71,0.08)",
              border: "1px solid rgba(232,197,71,0.2)",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p
              style={{ fontSize: "15px", fontWeight: "600", color: "#e8c547" }}
            >
              {STEP_META[status]?.label}
            </p>
            <p style={{ color: "#9090a8", fontSize: "13px", marginTop: "4px" }}>
              {STEP_META[status]?.desc}
            </p>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "18px",
            color: "#f0f0f5",
            marginBottom: "18px",
          }}
        >
          Items in This Order
        </h3>
        {order.products?.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "10px",
                objectFit: "cover",
                background: "#1a1a24",
              }}
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/60x60/1a1a24/9090a8?text=?";
              }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "#f0f0f5",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {item.title}
              </p>
              <p
                style={{ color: "#9090a8", fontSize: "12px", marginTop: "3px" }}
              >
                Qty: {item.quantity}
              </p>
            </div>
            <p style={{ color: "#f0f0f5", fontWeight: "600" }}>
              Rs.{Number(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "14px",
            display: "flex",
            justifyContent: "space-between",
          }}
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
            Rs.{Number(order.totalAmount || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
