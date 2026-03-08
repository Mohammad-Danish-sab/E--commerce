import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
    toast.success(product.title + " moved to cart!");
  };

  if (wishlist.length === 0)
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <p style={{ fontSize: "64px" }}>❤️</p>
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "26px",
            color: "#f0f0f5",
          }}
        >
          Your wishlist is empty
        </h2>
        <p style={{ color: "#9090a8", maxWidth: "360px" }}>
          Tap the 🤍 heart on any product to save it here.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#e8c547",
            color: "#0a0a0f",
            border: "none",
            padding: "12px 28px",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Browse Products
        </button>
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
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "36px",
              color: "#f0f0f5",
              marginBottom: "6px",
            }}
          >
            Wishlist
          </h1>
          <p style={{ color: "#9090a8", fontSize: "14px" }}>
            {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#9090a8",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: "24px",
        }}
      >
        {wishlist.map((product) => (
          <div
            key={product._id}
            style={{
              background: "#111118",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "220px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => navigate("/product/" + product._id)}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x260/1a1a24/9090a8?text=No+Image";
                }}
              />
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(10,10,15,0.75)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(product._id);
                  toast.success(product.title + " removed.");
                }}
              >
                ❤️
              </button>
            </div>
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#e8c547",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "600",
                }}
              >
                {product.category || "general"}
              </span>
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "16px",
                  color: "#f0f0f5",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/product/" + product._id)}
              >
                {product.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#9090a8" }}>
                {(product.description || "").slice(0, 60)}...
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#f0f0f5",
                  }}
                >
                  Rs.{Number(product.price).toLocaleString()}
                </span>
                <button
                  onClick={() => handleMoveToCart(product)}
                  style={{
                    background: "#e8c547",
                    color: "#0a0a0f",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
