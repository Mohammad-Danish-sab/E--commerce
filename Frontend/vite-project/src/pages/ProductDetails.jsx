import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const saveRecentlyViewed = (p) => {
  try {
    const existing = JSON.parse(
      localStorage.getItem("recently_viewed") || "[]",
    );
    const filtered = existing.filter((x) => x._id !== p._id);
    localStorage.setItem(
      "recently_viewed",
      JSON.stringify(
        [
          {
            _id: p._id,
            title: p.title,
            price: p.price,
            image: p.image,
            category: p.category,
          },
          ...filtered,
        ].slice(0, 8),
      ),
    );
  } catch {}
};

const StarRating = ({ value = 0, onChange, readOnly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !readOnly && onChange?.(s)}
          onMouseEnter={() => !readOnly && setHover(s)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize: size + "px",
            cursor: readOnly ? "default" : "pointer",
            color: s <= (hover || value) ? "#e8c547" : "#2a2a38",
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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewTab, setReviewTab] = useState("list");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(data);
      saveRecentlyViewed(data);
    } catch {
      toast.error("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReview = async () => {
    if (!rating) {
      toast.error("Please select a rating.");
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
    setSubmitting(true);
    try {
      await axios.post(
        `${API}/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: "Bearer " + token } },
      );
      toast.success("Review submitted! ⭐");
      setRating(0);
      setComment("");
      setReviewTab("list");
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const shareProduct = () => {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => toast.success("Link copied!"))
      .catch(() => toast.error("Copy failed."));
  };

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
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#9090a8" }}>
        Product not found.
      </div>
    );

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image].filter(Boolean);
  const reviews = product.reviews || [];
  const avg = product.avgRating || 0;
  const wishlisted = isWishlisted(product._id);
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    s,
    c: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length
      ? Math.round(
          (reviews.filter((r) => r.rating === s).length / reviews.length) * 100,
        )
      : 0,
  }));

  // Related products
  const [related, setRelated] = useState([]);
  useEffect(() => {
    if (!product.category) return;
    axios
      .get(`${API}/products?category=${product.category}`)
      .then(({ data }) =>
        setRelated(data.filter((p) => p._id !== id).slice(0, 4)),
      )
      .catch(() => {});
  }, [product.category]);

  // Recently viewed
  const recentlyViewed = (() => {
    try {
      return JSON.parse(localStorage.getItem("recently_viewed") || "[]")
        .filter((p) => p._id !== id)
        .slice(0, 6);
    } catch {
      return [];
    }
  })();

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

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "start",
          marginBottom: "64px",
        }}
      >
        {/* Gallery */}
        <div>
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              aspectRatio: "1/1",
              background: "#111118",
              cursor: "zoom-in",
            }}
            onClick={() => setZoomed(true)}
          >
            <img
              src={images[activeImg]}
              alt={product.title}
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
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                    cursor: "pointer",
                    border:
                      activeImg === i
                        ? "2px solid #e8c547"
                        : "2px solid transparent",
                  }}
                >
                  <img
                    src={img}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/72x72/1a1a24/9090a8?text=?";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
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
                src={images[activeImg]}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                  borderRadius: "12px",
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

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span
            style={{
              fontSize: "11px",
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
              fontSize: "clamp(24px,3.5vw,38px)",
              color: "#f0f0f5",
              fontWeight: "700",
              lineHeight: "1.2",
            }}
          >
            {product.title}
          </h1>
          {avg > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StarRating value={Math.round(avg)} readOnly size={18} />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#e8c547",
                }}
              >
                {avg.toFixed(1)}
              </span>
              <span style={{ color: "#9090a8", fontSize: "13px" }}>
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
          <p style={{ fontSize: "30px", fontWeight: "700", color: "#f0f0f5" }}>
            Rs.{Number(product.price).toLocaleString()}
          </p>
          <div
            style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
          />
          <p style={{ color: "#9090a8", fontSize: "15px", lineHeight: "1.8" }}>
            {product.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "#9090a8", fontSize: "14px" }}>Quantity</span>
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
                padding: "15px",
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
                  wishlisted ? "Removed." : product.title + " saved! ❤️",
                );
              }}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                border: `1px solid ${wishlisted ? "#e8c547" : "rgba(255,255,255,0.15)"}`,
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
                padding: "15px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Go to Cart
            </button>
          </div>
          <button
            onClick={shareProduct}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#9090a8",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "fit-content",
            }}
          >
            🔗 Share Product
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "48px",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
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
          {avg > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "48px",
                  fontWeight: "700",
                  color: "#e8c547",
                  lineHeight: 1,
                }}
              >
                {avg.toFixed(1)}
              </span>
              <div>
                <StarRating value={Math.round(avg)} readOnly size={20} />
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
          <div style={{ maxWidth: "380px", marginBottom: "28px" }}>
            {dist.map(({ s, c, pct }) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: "#9090a8",
                    fontSize: "13px",
                    width: "24px",
                    textAlign: "right",
                  }}
                >
                  {s}★
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
                    }}
                  />
                </div>
                <span
                  style={{ color: "#9090a8", fontSize: "12px", width: "20px" }}
                >
                  {c}
                </span>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "#111118",
            padding: "5px",
            borderRadius: "12px",
            width: "fit-content",
            marginBottom: "24px",
          }}
        >
          {[
            ["list", `All Reviews (${reviews.length})`],
            ["write", "✏️ Write a Review"],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setReviewTab(t)}
              style={{
                padding: "9px 20px",
                borderRadius: "9px",
                border: "none",
                background: reviewTab === t ? "#1a1a24" : "transparent",
                color: reviewTab === t ? "#f0f0f5" : "#9090a8",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: reviewTab === t ? "600" : "400",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {reviewTab === "list" &&
          (reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>⭐</p>
              <p style={{ color: "#9090a8" }}>No reviews yet — be the first!</p>
              <button
                onClick={() => setReviewTab("write")}
                style={{
                  background: "#e8c547",
                  color: "#0a0a0f",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "16px",
                }}
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {reviews.map((r, i) => {
                const init = (r.name || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div
                    key={i}
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
                        marginBottom: "12px",
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
                        {init}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            color: "#f0f0f5",
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          {r.name || "Anonymous"}
                        </p>
                        <p style={{ color: "#9090a8", fontSize: "12px" }}>
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <StarRating value={r.rating} readOnly size={16} />
                    </div>
                    <p
                      style={{
                        color: "#c0c0d0",
                        fontSize: "14px",
                        lineHeight: "1.7",
                      }}
                    >
                      {r.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}

        {reviewTab === "write" && (
          <div
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "560px",
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
            <p
              style={{
                fontSize: "13px",
                color: "#9090a8",
                marginBottom: "8px",
              }}
            >
              Your Rating
            </p>
            <div style={{ marginBottom: "16px" }}>
              <StarRating value={rating} onChange={setRating} size={32} />
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#9090a8",
                marginBottom: "8px",
              }}
            >
              Your Review
            </p>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience…"
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
                marginBottom: "16px",
              }}
            />
            <button
              onClick={submitReview}
              disabled={submitting}
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
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "48px",
            marginBottom: "48px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "26px",
              color: "#f0f0f5",
              marginBottom: "24px",
            }}
          >
            Related Products
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            {related.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate("/product/" + p._id)}
                style={{
                  background: "#111118",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/220x180/1a1a24/9090a8?text=No+Image";
                  }}
                />
                <div style={{ padding: "14px" }}>
                  <p
                    style={{
                      color: "#f0f0f5",
                      fontWeight: "600",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    {p.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#e8c547", fontWeight: "700" }}>
                      Rs.{Number(p.price).toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                        toast.success("Added!");
                      }}
                      style={{
                        background: "rgba(232,197,71,0.15)",
                        color: "#e8c547",
                        border: "1px solid rgba(232,197,71,0.3)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: "#f0f0f5",
              marginBottom: "16px",
            }}
          >
            Recently Viewed
          </h2>
          <div
            style={{
              display: "flex",
              gap: "14px",
              overflowX: "auto",
              paddingBottom: "8px",
            }}
          >
            {recentlyViewed.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate("/product/" + p._id)}
                style={{
                  flexShrink: 0,
                  width: "150px",
                  cursor: "pointer",
                  background: "#111118",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "110px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/150x110/1a1a24/9090a8?text=?";
                  }}
                />
                <div style={{ padding: "10px" }}>
                  <p
                    style={{
                      color: "#f0f0f5",
                      fontSize: "12px",
                      fontWeight: "500",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    style={{
                      color: "#e8c547",
                      fontSize: "13px",
                      fontWeight: "700",
                      marginTop: "4px",
                    }}
                  >
                    Rs.{Number(p.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default ProductDetails;
