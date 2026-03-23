import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Flash sale end time — change this to any future date/time
const SALE_END = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

const SALE_CONFIG = {
  title: "⚡ Big Billion Days Sale",
  subtitle: "The biggest sale of the year — up to 70% off!",
  bannerBg: "linear-gradient(135deg, #1a0a00 0%, #2d1500 40%, #08080f 100%)",
  accent: "#ff6b1a",
  discounts: {
    Electronics: 70,
    Footwear: 50,
    Clothing: 60,
    Books: 40,
    Accessories: 55,
    General: 30,
  },
};

const useCountdown = (endTime) => {
  const calc = () => {
    const diff = Math.max(0, new Date(endTime) - new Date());
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      total: diff,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const FlashSale = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const countdown = useCountdown(SALE_END);

  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then(({ data }) => setProducts(data))
      .catch(() => toast.error("Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const getSalePrice = (p) => {
    const disc = SALE_CONFIG.discounts[p.category] || 30;
    return Math.round(p.price * (1 - disc / 100));
  };
  const getDisc = (p) => SALE_CONFIG.discounts[p.category] || 30;

  const categories = ["All", ...Object.keys(SALE_CONFIG.discounts)];
  const filtered = products.filter(
    (p) => filter === "All" || p.category === filter,
  );

  const S = (k) => `var(--${k})`;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 0 80px" }}>
      {/* Hero Banner */}
      <div
        style={{
          background: SALE_CONFIG.bannerBg,
          padding: "60px 40px",
          marginBottom: "40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated sparks */}
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: `${8 + Math.random() * 14}px`,
              opacity: 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${1.5 + Math.random() * 2}s infinite ${Math.random()}s`,
            }}
          >
            ⚡
          </span>
        ))}
        <p
          style={{
            fontSize: "13px",
            color: SALE_CONFIG.accent,
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: "700",
            marginBottom: "14px",
          }}
        >
          Limited Time Offer
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(32px,6vw,72px)",
            color: "#fff",
            fontWeight: "700",
            marginBottom: "10px",
            lineHeight: 1.1,
          }}
        >
          {SALE_CONFIG.title}
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            marginBottom: "36px",
          }}
        >
          {SALE_CONFIG.subtitle}
        </p>

        {/* Countdown */}
        {countdown.total > 0 ? (
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                marginBottom: "12px",
                letterSpacing: "2px",
              }}
            >
              SALE ENDS IN
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "12px" }}
            >
              {[
                ["HOURS", countdown.hours],
                ["MINS", countdown.minutes],
                ["SECS", countdown.seconds],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    padding: "16px 22px",
                    minWidth: "80px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "40px",
                      fontWeight: "700",
                      color: SALE_CONFIG.accent,
                      lineHeight: 1,
                    }}
                  >
                    {pad(val)}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "11px",
                      letterSpacing: "2px",
                      marginTop: "4px",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,77,109,0.2)",
              border: "1px solid rgba(255,77,109,0.4)",
              borderRadius: "12px",
              padding: "16px 32px",
              display: "inline-block",
            }}
          >
            <p
              style={{ color: "#ff4d6d", fontWeight: "700", fontSize: "18px" }}
            >
              ⏰ Sale has ended!
            </p>
          </div>
        )}

        {/* Discount badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "32px",
          }}
        >
          {Object.entries(SALE_CONFIG.discounts).map(([cat, disc]) => (
            <span
              key={cat}
              style={{
                background: `rgba(255,107,26,0.15)`,
                border: `1px solid rgba(255,107,26,0.3)`,
                color: SALE_CONFIG.accent,
                padding: "5px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {cat} — {disc}% OFF
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Category filter */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "8px 18px",
                borderRadius: "50px",
                border: `1px solid ${filter === c ? SALE_CONFIG.accent : S("border")}`,
                background: filter === c ? SALE_CONFIG.accent : "transparent",
                color: filter === c ? "#fff" : S("muted"),
                fontSize: "13px",
                fontWeight: filter === c ? "700" : "400",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: "20px",
            }}
          >
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: S("surface"),
                    borderRadius: "16px",
                    height: "360px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: "20px",
            }}
          >
            {filtered.map((p) => {
              const salePrice = getSalePrice(p);
              const disc = getDisc(p);
              return (
                <div
                  key={p._id}
                  style={{
                    background: S("surface"),
                    border: `1px solid ${S("border")}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => navigate("/product/" + p._id)}
                >
                  {/* Discount badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: SALE_CONFIG.accent,
                      color: "#fff",
                      fontWeight: "800",
                      fontSize: "13px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      zIndex: 2,
                    }}
                  >
                    -{disc}%
                  </div>

                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.06)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x200/1a1a24/9090a8?text=No+Image";
                      }}
                    />
                  </div>

                  <div style={{ padding: "16px" }}>
                    <p
                      style={{
                        fontSize: "10px",
                        color: SALE_CONFIG.accent,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      {p.category}
                    </p>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "15px",
                        color: S("text"),
                        marginBottom: "12px",
                        lineHeight: "1.3",
                      }}
                    >
                      {p.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "14px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Playfair Display',serif",
                          fontSize: "20px",
                          fontWeight: "700",
                          color: SALE_CONFIG.accent,
                        }}
                      >
                        Rs.{salePrice.toLocaleString()}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: S("muted"),
                          textDecoration: "line-through",
                        }}
                      >
                        Rs.{Number(p.price).toLocaleString()}
                      </p>
                    </div>
                    {/* Stock bar */}
                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ fontSize: "11px", color: S("muted") }}>
                          Available
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: SALE_CONFIG.accent,
                            fontWeight: "600",
                          }}
                        >
                          {Math.floor(Math.random() * 20 + 5)} left!
                        </span>
                      </div>
                      <div
                        style={{
                          height: "4px",
                          background: S("surface2"),
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${30 + Math.random() * 50}%`,
                            background: SALE_CONFIG.accent,
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...p, price: salePrice });
                        toast.success("Added at sale price!");
                      }}
                      style={{
                        width: "100%",
                        background: SALE_CONFIG.accent,
                        color: "#fff",
                        border: "none",
                        padding: "11px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Add at Sale Price
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.3)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
};

export default FlashSale;
