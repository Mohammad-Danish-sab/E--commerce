import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const s = (key) => `var(--${key})`;

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then(({ data }) => setProducts(data))
      .catch(() => toast.error("Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    if (!products.length) return;
    const t = setInterval(
      () => setActiveHero((i) => (i + 1) % Math.min(5, products.length)),
      4000,
    );
    return () => clearInterval(t);
  }, [products.length]);

  const trending = [...products]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 8);
  const topRated = [...products]
    .filter((p) => p.avgRating >= 4)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 4);
  const newest = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  const hero = products.slice(0, 5);

  const ProductCard = ({ p, big = false }) => (
    <div
      onClick={() => navigate("/product/" + p._id)}
      style={{
        background: s("surface"),
        border: `1px solid ${s("border")}`,
        borderRadius: big ? "20px" : "14px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.25s, box-shadow 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          height: big ? "280px" : "200px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={p.image}
          alt={p.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.src =
              "https://placehold.co/400x280/1a1a24/9090a8?text=No+Image";
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(p);
            toast.success(isWishlisted(p._id) ? "Removed." : "Saved! ❤️");
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          {isWishlisted(p._id) ? "❤️" : "🤍"}
        </button>
        {p.avgRating >= 4.5 && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: s("gold"),
              color: "#0a0a0f",
              fontSize: "10px",
              fontWeight: "700",
              padding: "3px 8px",
              borderRadius: "20px",
            }}
          >
            ⭐ Top Rated
          </span>
        )}
        {new Date() - new Date(p.createdAt) < 7 * 24 * 3600 * 1000 && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#68d391",
              color: "#0a0a0f",
              fontSize: "10px",
              fontWeight: "700",
              padding: "3px 8px",
              borderRadius: "20px",
            }}
          >
            ✨ New
          </span>
        )}
      </div>
      <div style={{ padding: "14px" }}>
        <p
          style={{
            fontSize: "10px",
            color: s("gold"),
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "600",
            marginBottom: "5px",
          }}
        >
          {p.category}
        </p>
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: big ? "17px" : "15px",
            color: s("text"),
            marginBottom: "8px",
            lineHeight: "1.3",
          }}
        >
          {p.title}
        </h3>
        {p.numReviews > 0 && (
          <p
            style={{
              fontSize: "12px",
              color: s("muted"),
              marginBottom: "10px",
            }}
          >
            <span style={{ color: s("gold") }}>
              {"★".repeat(Math.round(p.avgRating || 0))}
            </span>{" "}
            {(p.avgRating || 0).toFixed(1)} ({p.numReviews})
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: big ? "20px" : "17px",
              fontWeight: "700",
              color: s("text"),
            }}
          >
            Rs.{Number(p.price).toLocaleString()}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(p);
              toast.success("Added to cart!");
            }}
            style={{
              background: s("gold"),
              color: "#0a0a0f",
              border: "none",
              padding: "7px 14px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}
    >
      {/* Hero Carousel */}
      {!loading && hero.length > 0 && (
        <div style={{ marginBottom: "60px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              height: "420px",
            }}
          >
            {hero.map((p, i) => (
              <div
                key={p._id}
                style={{
                  position: "absolute",
                  inset: 0,
                  transition: "opacity 0.8s ease",
                  opacity: i === activeHero ? 1 : 0,
                  pointerEvents: i === activeHero ? "auto" : "none",
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/1280x420/1a1a24/9090a8?text=No+Image";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, rgba(8,8,15,0.9) 30%, transparent)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "48px",
                    transform: "translateY(-50%)",
                    maxWidth: "480px",
                  }}
                >
                  <span
                    style={{
                      background: s("gold"),
                      color: "#0a0a0f",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    ✦ Featured
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "clamp(24px,3vw,42px)",
                      color: "#f0f0f5",
                      marginTop: "14px",
                      marginBottom: "10px",
                      lineHeight: 1.2,
                    }}
                  >
                    {p.title}
                  </h2>
                  <p
                    style={{
                      color: "#9090a8",
                      fontSize: "15px",
                      marginBottom: "20px",
                      lineHeight: 1.6,
                    }}
                  >
                    {(p.description || "").slice(0, 100)}…
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#e8c547",
                      }}
                    >
                      Rs.{Number(p.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(p);
                        toast.success("Added!");
                      }}
                      style={{
                        background: "#e8c547",
                        color: "#0a0a0f",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate("/product/" + p._id)}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#f0f0f5",
                        padding: "12px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Dots */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
              }}
            >
              {hero.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHero(i)}
                  style={{
                    width: i === activeHero ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    border: "none",
                    background:
                      i === activeHero ? "#e8c547" : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "80px", color: s("muted") }}
        >
          Loading featured products…
        </div>
      ) : (
        <>
          {/* Trending */}
          <Section title="🔥 Trending Now" sub="Most reviewed products">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: "18px",
              }}
            >
              {trending.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </Section>

          {/* Top Rated */}
          {topRated.length > 0 && (
            <Section title="⭐ Top Rated" sub="Highest customer ratings">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                  gap: "20px",
                }}
              >
                {topRated.map((p) => (
                  <ProductCard key={p._id} p={p} big />
                ))}
              </div>
            </Section>
          )}

          {/* Newest */}
          <Section title="✨ New Arrivals" sub="Just added to the store">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: "18px",
              }}
            >
              {newest.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
};

const Section = ({ title, sub, children }) => (
  <div style={{ marginBottom: "56px" }}>
    <div style={{ marginBottom: "24px" }}>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "28px",
          color: `var(--text)`,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{ color: `var(--muted)`, fontSize: "14px", marginTop: "4px" }}
        >
          {sub}
        </p>
      )}
    </div>
    {children}
  </div>
);

export default FeaturedProducts;
