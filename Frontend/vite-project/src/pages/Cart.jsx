import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart } = useCart();

  if (!cart || cart.length === 0) {
    return <h2>Cart Empty</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item._id} style={styles.item}>
          <img src={item.image} width="80" alt={item.title} />
          <div>
            <h4>{item.title}</h4>
            <p>₹ {item.price}</p>
            <p>Qty: {item.qty}</p>
          </div>
        </div>
      ))}
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
