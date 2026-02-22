import { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Order placed successfully!");
      setCart(null); // Clear local state
    } catch (err) {
      alert("Order failed");
    }
  };

  if (!cart || !cart.items || cart.items.length === 0)
    return <h2>Cart Empty</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.items.map((item) => (
        <div key={item._id} style={styles.item}>
          <img
            src={item.productId.image}
            width="80"
            alt={item.productId.title}
          />
          <div>
            <h4>{item.productId.title}</h4>
            <p>₹ {item.productId.price}</p>
            <p>Qty: {item.quantity}</p>
          </div>
        </div>
      ))}
      <button
        onClick={placeOrder}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Place Order
      </button>
    </div>
  );
};

const styles = {
  item: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  },
};

export default Cart;
