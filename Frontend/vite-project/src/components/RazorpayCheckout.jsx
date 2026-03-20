import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ──────────────────────────────────────────────────────
// HOW TO USE:
// 1. npm install razorpay  (in Backend/)
// 2. Add to Backend/.env:
//    RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
//    RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
// 3. Add to Frontend/.env:
//    VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
// 4. Add paymentRoutes to Backend/server.js:
//    import paymentRoutes from "./routes/paymentRoutes.js";
//    app.use("/api/payment", paymentRoutes);
// 5. Replace the <PlaceOrder> button in Cart.jsx with:
//    <RazorpayCheckout amount={finalTotal} onSuccess={handleOrderSuccess} />
// ──────────────────────────────────────────────────────

const RazorpayCheckout = ({ amount, onSuccess, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) {
      toast.error("Please login first.");
      return;
    }
    setLoading(true);

    try {
      // Step 1 — Create Razorpay order on backend
      const { data } = await axios.post(
        `${API}/payment/create-order`,
        { amount },
        { headers: { Authorization: "Bearer " + token } },
      );

      // Step 2 — Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Luxe Store",
        description: "Order Payment",
        order_id: data.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#e8c547" },
        handler: async (response) => {
          // Step 3 — Verify payment on backend
          try {
            const verify = await axios.post(`${API}/payment/verify`, response, {
              headers: { Authorization: "Bearer " + token },
            });
            if (verify.data.success) {
              toast.success("Payment successful! 🎉");
              onSuccess?.(verify.data.paymentId);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch {
            toast.error("Verification error.");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled.", { icon: "ℹ️" });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Could not initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      <button
        onClick={handlePayment}
        disabled={loading || disabled}
        style={{
          width: "100%",
          background: loading ? "#9090a8" : "#e8c547",
          color: "#0a0a0f",
          border: "none",
          padding: "15px",
          borderRadius: "12px",
          fontWeight: "700",
          fontSize: "15px",
          cursor: loading || disabled ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "background 0.2s",
        }}
      >
        {loading ? (
          <>
            <div
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid rgba(0,0,0,0.2)",
                borderTop: "2px solid #0a0a0f",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Processing…
          </>
        ) : (
          <>💳 Pay Rs.{Number(amount).toLocaleString()} with Razorpay</>
        )}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export default RazorpayCheckout;
