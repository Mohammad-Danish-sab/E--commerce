import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // FIX: Added dependency array [id] and proper error/loading handling
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/" + id)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error("Failed to load product."))
      .finally(() => setLoading(false));
  }, [id]);

    const handleAdd = () => {
      addToCart(product);
      toast.success(product.title + " added to cart!");
    };
    
  if (loading) {
    return (
      <div style={S.center}>
        <div style={S.spinner}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={S.center}>
        <p style={{ color: "#9090a8", fontSize: "18px" }}>Product not found.</p>
        <button onClick={() => navigate("/")} style={S.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <button onClick={() => navigate(-1)} style={S.backBtn}>
        ← Back
      </button>

      <div style={S.layout}>
        {/* Image */}
        <div style={S.imgWrap}>
          <img
            src={product.image}
            alt={product.title}
            style={S.img}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x500/1a1a24/9090a8?text=No+Image";
            }}
          />
        </div>

        {/* Info */}
        <div style={S.info}>
          <span style={S.cat}>{product.category || "general"}</span>
          <h1 style={S.title}>{product.title}</h1>
          <p style={S.price}>Rs.{Number(product.price).toLocaleString()}</p>
          <div style={S.divider}></div>
          <p style={S.desc}>{product.description}</p>

          <div style={S.btnRow}>
            <button
              onClick={handleAdd}
              style={
                added
                  ? { ...S.addBtn, background: "#2ecc71", color: "#fff" }
                  : S.addBtn
              }
            >
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button onClick={() => navigate("/cart")} style={S.cartBtn}>
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const S = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #e8c547",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  backBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9090a8",
    padding: "8px 18px",
    borderRadius: "8px",
    marginBottom: "32px",
    cursor: "pointer",
    fontSize: "13px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "start",
  },
  imgWrap: { borderRadius: "20px", overflow: "hidden", background: "#111118" },
  img: {
    width: "100%",
    maxHeight: "500px",
    objectFit: "cover",
    display: "block",
  },
  info: { display: "flex", flexDirection: "column", gap: "16px" },
  cat: {
    fontSize: "12px",
    color: "#e8c547",
    textTransform: "uppercase",
    letterSpacing: "3px",
    fontWeight: "600",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(26px, 4vw, 40px)",
    color: "#f0f0f5",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  price: { fontSize: "32px", fontWeight: "700", color: "#f0f0f5" },
  divider: { height: "1px", background: "rgba(255,255,255,0.07)" },
  desc: { color: "#9090a8", fontSize: "15px", lineHeight: "1.8" },
  btnRow: { display: "flex", gap: "12px", marginTop: "8px" },
  addBtn: {
    flex: 1,
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  cartBtn: {
    flex: 1,
    background: "transparent",
    color: "#f0f0f5",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default ProductDetails;
