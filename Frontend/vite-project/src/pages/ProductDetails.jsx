import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

const RECENTLY_VIEWED_KEY = "recently_viewed";

const saveRecentlyViewed = (product) => {
  try {
    const existing = JSON.parse(
      localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]",
    );
    const filtered = existing.filter((p) => p._id !== product._id);
    const updated = [
      {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      ...filtered,
    ].slice(0, 8);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
};

const StarRating = ({ value, onChange, readOnly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize: size + "px",
            cursor: readOnly ? "default" : "pointer",
            color: star <= (hover || value) ? "#e8c547" : "#2a2a38",
            transition: "color 0.15s",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ImageGallery = ({ images = [], title = "" }) => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const allImages = images.length > 0 ? images : [null];

  return (
    <div>
      {/* Main image */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          background: "#111118",
          position: "relative",
          cursor: "zoom-in",
          aspectRatio: "1/1",
        }}
        onClick={() => setZoomed(true)}
      >
        <img
          src={allImages[active]}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x600/1a1a24/9090a8?text=No+Image";
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: "8px",
            padding: "5px 10px",
            fontSize: "12px",
            color: "#f0f0f5",
          }}
        >
          🔍 Click to zoom
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            overflowX: "auto",
          }}
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "10px",
                overflow: "hidden",
                flexShrink: 0,
                cursor: "pointer",
                border:
                  active === i ? "2px solid #e8c547" : "2px solid transparent",
                transition: "border 0.2s",
              }}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/72x72/1a1a24/9090a8?text=?";
                }}
              />
            </div>
          ))}
        </div>
      )}
      {/* Zoom lightbox */}
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            cursor: "zoom-out",
          }}
        >
          <img
            src={allImages[active]}
            alt={title}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "12px",
            }}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/800x800/1a1a24/9090a8?text=No+Image";
            }}
          />
          <button
            onClick={() => setZoomed(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#f0f0f5",
              fontSize: "24px",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewForm = ({ productId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to submit a review.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: "Bearer " + token } },
      );
      toast.success("Review submitted! ⭐");
      setRating(0);
      setComment("");
      onSubmitted();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "28px",
      }}
    >
      <h3
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "20px",
          color: "#f0f0f5",
          marginBottom: "20px",
        }}
      >
        Write a Review
      </h3>
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#9090a8", marginBottom: "8px" }}>
          Your Rating
        </p>
        <StarRating value={rating} onChange={setRating} size={32} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#9090a8", marginBottom: "8px" }}>
          Your Review
        </p>
        <textarea
          rows={4}
          placeholder="Share your experience…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            background: "#1a1a24",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#f0f0f5",
            fontSize: "14px",
            fontFamily: "'DM Sans',sans-serif",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: "#e8c547",
          color: "#0a0a0f",
          border: "none",
          padding: "12px 28px",
          borderRadius: "10px",
          fontWeight: "700",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const initials = (review.user?.name || review.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#e8c547,#c9a227)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            color: "#0a0a0f",
            fontSize: "13px",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <p style={{ color: "#f0f0f5", fontWeight: "600", fontSize: "14px" }}>
            {review.user?.name || review.name || "Anonymous"}
          </p>
          <p style={{ color: "#9090a8", fontSize: "12px", marginTop: "2px" }}>
            {date}
          </p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <StarRating value={review.rating} readOnly size={16} />
        </div>
      </div>
      <p style={{ color: "#c0c0d0", fontSize: "14px", lineHeight: "1.7" }}>
        {review.comment}
      </p>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`,
      );
      setProduct(data);
      setReviews(data.reviews || []);
    } catch {
      toast.error("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const wishlisted = product ? isWishlisted(product._id) : false;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length
      ? Math.round(
          (reviews.filter((r) => r.rating === star).length / reviews.length) *
            100,
        )
      : 0,
  }));

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
  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#9090a8" }}>
        Product not found.
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
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
        ← Back
      </button>

      {/* Product */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "start",
          marginBottom: "64px",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            background: "#111118",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x500/1a1a24/9090a8?text=No+Image";
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "12px",
              color: "#e8c547",
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontWeight: "600",
            }}
          >
            {product.category || "general"}
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(26px,4vw,40px)",
              color: "#f0f0f5",
              fontWeight: "700",
              lineHeight: "1.2",
            }}
          >
            {product.title}
          </h1>
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StarRating value={Math.round(avgRating)} readOnly size={20} />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#e8c547",
                }}
              >
                {avgRating}
              </span>
              <span style={{ color: "#9090a8", fontSize: "13px" }}>
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#f0f0f5" }}>
            Rs.{Number(product.price).toLocaleString()}
          </p>
          <div
            style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
          ></div>
          <p style={{ color: "#9090a8", fontSize: "15px", lineHeight: "1.8" }}>
            {product.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{ color: "#9090a8", fontSize: "14px", fontWeight: "500" }}
            >
              Quantity
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#1a1a24",
                borderRadius: "10px",
                padding: "6px 12px",
              }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f0f0f5",
                  fontSize: "20px",
                  cursor: "pointer",
                  width: "28px",
                }}
              >
                −
              </button>
              <span
                style={{
                  color: "#f0f0f5",
                  fontWeight: "700",
                  fontSize: "16px",
                  minWidth: "24px",
                  textAlign: "center",
                }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f0f0f5",
                  fontSize: "20px",
                  cursor: "pointer",
                  width: "28px",
                }}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                for (let i = 0; i < qty; i++) addToCart(product);
                toast.success(`${qty}× ${product.title} added!`);
              }}
              style={{
                flex: 1,
                background: "#e8c547",
                color: "#0a0a0f",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                toggleWishlist(product);
                toast.success(
                  wishlisted
                    ? product.title + " removed."
                    : product.title + " saved! ❤️",
                );
              }}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                border:
                  "1px solid " +
                  (wishlisted ? "#e8c547" : "rgba(255,255,255,0.15)"),
                background: wishlisted
                  ? "rgba(232,197,71,0.15)"
                  : "transparent",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
            <button
              onClick={() => navigate("/cart")}
              style={{
                flex: 1,
                background: "transparent",
                color: "#f0f0f5",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "16px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "28px",
              color: "#f0f0f5",
            }}
          >
            Reviews &amp; Ratings
          </h2>
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "52px",
                  fontWeight: "700",
                  color: "#e8c547",
                  lineHeight: 1,
                }}
              >
                {avgRating}
              </span>
              <div>
                <StarRating value={Math.round(avgRating)} readOnly size={22} />
                <p
                  style={{
                    color: "#9090a8",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "32px",
              maxWidth: "400px",
            }}
          >
            {distribution.map(({ star, count, pct }) => (
              <div
                key={star}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    color: "#9090a8",
                    fontSize: "13px",
                    width: "24px",
                    textAlign: "right",
                  }}
                >
                  {star}★
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "#1a1a24",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: pct + "%",
                      background: "#e8c547",
                      borderRadius: "4px",
                      transition: "width 0.5s",
                    }}
                  ></div>
                </div>
                <span
                  style={{ color: "#9090a8", fontSize: "12px", width: "20px" }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "28px",
            background: "#111118",
            padding: "5px",
            borderRadius: "12px",
            width: "fit-content",
          }}
        >
          {[
            ["reviews", `All Reviews (${reviews.length})`],
            ["write", "✏️ Write a Review"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "9px 20px",
                borderRadius: "9px",
                border: "none",
                background: activeTab === tab ? "#1a1a24" : "transparent",
                color: activeTab === tab ? "#f0f0f5" : "#9090a8",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: activeTab === tab ? "600" : "500",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "reviews" &&
          (reviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <p style={{ fontSize: "40px" }}>⭐</p>
              <p style={{ color: "#9090a8" }}>No reviews yet. Be the first!</p>
              <button
                onClick={() => setActiveTab("write")}
                style={{
                  background: "#e8c547",
                  color: "#0a0a0f",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {reviews.map((r, i) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
          ))}

        {activeTab === "write" && (
          <ReviewForm
            productId={id}
            onSubmitted={() => {
              fetchProduct();
              setActiveTab("reviews");
            }}
          />
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default ProductDetails;
