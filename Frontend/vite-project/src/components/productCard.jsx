import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(product.title + " added to cart!");
  };

  return (
    <div style={S.card}>
      <Link to={"/product/" + product._id} style={{ display: "block" }}>
        <div style={S.imgWrap}>
          <img
            src={product.image}
            alt={product.title}
            style={S.img}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x280/1a1a24/9090a8?text=No+Image";
            }}
          />
        </div>
      </Link>
      <div style={S.info}>
        <span style={S.cat}>{product.category || "general"}</span>
        <h3 style={S.title}>{product.title}</h3>
        <p style={S.desc}>{(product.description || "").slice(0, 65)}...</p>
        <div style={S.bottom}>
          <span style={S.price}>
            Rs.{Number(product.price).toLocaleString()}
          </span>
          <button onClick={handleAdd} style={S.btn}>
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const S = {
  card: {
    background: "#111118",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  imgWrap: { height: "220px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  info: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  cat: {
    fontSize: "11px",
    color: "#e8c547",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "600",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "17px",
    color: "#f0f0f5",
    fontWeight: "600",
    lineHeight: "1.3",
  },
  desc: { fontSize: "13px", color: "#9090a8", lineHeight: "1.5" },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "4px",
  },
  price: { fontSize: "18px", fontWeight: "700", color: "#f0f0f5" },
  btn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
};

export default ProductCard;
