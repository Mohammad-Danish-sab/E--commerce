import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);

  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order.");
      navigate("/login");
      return;
    }
    setOrdering(true);
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {},
        { headers: { Authorization: "Bearer " + token } },
      );
      clearCart();
      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
       toast.dismiss(loadingToast);
       toast.error(err.response?.data?.message || "Order failed try again.");
    } finally {
      setOrdering(false);
    }
  };

    const handleRemove = (item) => {
      removeFromCart(item._id);
      toast.success(item.title + " removed.");
    };


  if (!cart || cart.length === 0) {
    return (
      <div style={S.empty}>
        <p style={{ fontSize: "64px" }}>🛒</p>
        <h2 style={S.emptyTitle}>Your cart is empty</h2>
        <p style={S.emptySub}>Looks like you have not added anything yet.</p>
        <button onClick={() => navigate("/")} style={S.browseBtn}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <h1 style={S.heading}>Your Cart</h1>
      <p style={S.subheading}>
        {cart.length} item{cart.length > 1 ? "s" : ""}
      </p>

      <div style={S.layout}>
        {/* Cart Items */}
        <div style={S.items}>
          {cart.map((item) => (
            <div key={item._id} style={S.item}>
              <img
                src={item.image}
                alt={item.title}
                style={S.itemImg}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/85x85/1a1a24/9090a8?text=?";
                }}
              />
              <div style={S.itemInfo}>
                <span style={S.itemCat}>{item.category || "general"}</span>
                <h3 style={S.itemTitle}>{item.title}</h3>
                <p style={S.itemPrice}>
                  Rs.{Number(item.price).toLocaleString()}
                </p>
              </div>
              <div style={S.itemActions}>
                {/* Quantity controls */}
                <div style={S.qtyRow}>
                  <button
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    style={S.qtyBtn}
                  >
                    −
                  </button>
                  <span style={S.qtyNum}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    style={S.qtyBtn}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={S.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={S.summary}>
          <h3 style={S.summaryTitle}>Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} style={S.summaryRow}>
              <span style={S.summaryLabel}>
                {(item.title || "").slice(0, 20)}... ×{item.qty}
              </span>
              <span style={S.summaryVal}>
                Rs.{(item.price * item.qty).toLocaleString()}
              </span>
            </div>
          ))}
          <div style={S.divider}></div>
          <div style={S.totalRow}>
            <span style={S.totalLabel}>Total</span>
            <span style={S.totalVal}>Rs.{totalPrice.toLocaleString()}</span>
          </div>
          <button onClick={handleOrder} disabled={ordering} style={S.orderBtn}>
            {ordering ? "Placing Order..." : "Place Order"}
          </button>
          <button onClick={() => navigate("/")} style={S.continueBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

const S = {
  page: { maxWidth: "960px", margin: "0 auto", padding: "40px 24px" },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px",
    color: "#f0f0f5",
    marginBottom: "8px",
  },
  subheading: { color: "#9090a8", marginBottom: "36px" },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "28px",
    alignItems: "start",
  },
  items: { display: "flex", flexDirection: "column", gap: "14px" },
  item: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  itemImg: {
    width: "85px",
    height: "85px",
    objectFit: "cover",
    borderRadius: "10px",
    flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemCat: {
    fontSize: "11px",
    color: "#e8c547",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "600",
  },
  itemTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "16px",
    color: "#f0f0f5",
    margin: "4px 0 6px",
  },
  itemPrice: { fontSize: "16px", fontWeight: "700", color: "#f0f0f5" },
  itemActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#1a1a24",
    borderRadius: "8px",
    padding: "4px 8px",
  },
  qtyBtn: {
    background: "none",
    border: "none",
    color: "#f0f0f5",
    fontSize: "18px",
    cursor: "pointer",
    width: "28px",
    lineHeight: 1,
  },
  qtyNum: {
    color: "#f0f0f5",
    fontWeight: "600",
    minWidth: "20px",
    textAlign: "center",
  },
  removeBtn: {
    background: "rgba(255,77,109,0.1)",
    color: "#ff4d6d",
    border: "1px solid rgba(255,77,109,0.2)",
    padding: "5px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    cursor: "pointer",
  },
  summary: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
    position: "sticky",
    top: "90px",
  },
  summaryTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px",
    color: "#f0f0f5",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "13px",
  },
  summaryLabel: { color: "#9090a8" },
  summaryVal: { color: "#f0f0f5" },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    margin: "18px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  totalLabel: { color: "#f0f0f5", fontWeight: "600", fontSize: "16px" },
  totalVal: { color: "#e8c547", fontWeight: "700", fontSize: "22px" },
  orderBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    width: "100%",
    cursor: "pointer",
    marginBottom: "10px",
  },
  continueBtn: {
    background: "transparent",
    color: "#9090a8",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "11px",
    borderRadius: "10px",
    fontSize: "13px",
    width: "100%",
    cursor: "pointer",
  },
  empty: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    color: "#f0f0f5",
    fontSize: "28px",
  },
  emptySub: { color: "#9090a8" },
  browseBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default Cart;
