import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import SkeletonCard from "../components/SkeletonCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PAGE_SIZE = 12;
const CATEGORIES = [
  "All",
  "Electronics",
  "Footwear",
  "Clothing",
  "Books",
  "Accessories",
  "General",
];

const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisible] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then(({ data }) => setProducts(data))
      .catch(() => toast.error("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [debouncedSearch, category, sort]);

  const filtered = products
    .filter((p) => {
      const matchSearch = p.title
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchCat =
        category === "All" ||
        p.category?.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const visible = filtered.slice(0, visibleCount);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (visibleCount >= filtered.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisible((v) => v + PAGE_SIZE);
      setLoadingMore(false);
    }, 500);
  }, [visibleCount, filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div
      style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}
    >
      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px 48px",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,197,71,0.06), transparent 70%)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "#e8c547",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: "600",
            background: "rgba(232,197,71,0.1)",
            padding: "6px 18px",
            borderRadius: "20px",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          New Collection 2025
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(36px,7vw,72px)",
            color: "#f0f0f5",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Discover <span style={{ color: "#e8c547" }}>Premium</span> Products
        </h1>
        <p style={{ color: "#9090a8", fontSize: "16px", marginBottom: "36px" }}>
          Handpicked quality items delivered to your door
        </p>

        {/* Search */}
        <div
          style={{ position: "relative", maxWidth: "520px", margin: "0 auto" }}
        >
          <span
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{
              width: "100%",
              padding: "14px 48px",
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "50px",
              fontSize: "15px",
              color: "#f0f0f5",
              fontFamily: "'DM Sans',sans-serif",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(232,197,71,0.4)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#9090a8",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>
          )}
        </div>
        {debouncedSearch && (
          <p style={{ color: "#9090a8", fontSize: "13px", marginTop: "10px" }}>
            Showing results for{" "}
            <strong style={{ color: "#e8c547" }}>"{debouncedSearch}"</strong>
          </p>
        )}
      </div>

      {/* Category filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "8px 20px",
              borderRadius: "50px",
              border: `1px solid ${category === cat ? "#e8c547" : "rgba(255,255,255,0.08)"}`,
              background: category === cat ? "#e8c547" : "transparent",
              color: category === cat ? "#0a0a0f" : "#9090a8",
              fontSize: "13px",
              fontWeight: category === cat ? "700" : "500",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "26px",
              color: "#f0f0f5",
            }}
          >
            {category === "All" ? "All Products" : category}
          </h2>
          <p style={{ color: "#9090a8", fontSize: "13px", marginTop: "4px" }}>
            {loading
              ? "Loading…"
              : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f0f0f5",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            cursor: "pointer",
            outline: "none",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: "24px",
          }}
        >
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: "56px", marginBottom: "16px" }}>📦</p>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "24px",
              color: "#f0f0f5",
              marginBottom: "8px",
            }}
          >
            No products found
          </h3>
          <p style={{ color: "#9090a8", marginBottom: "24px" }}>
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : "Nothing in this category yet."}
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            style={{
              background: "transparent",
              border: "1px solid rgba(232,197,71,0.4)",
              color: "#e8c547",
              padding: "10px 24px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: "24px",
          }}
        >
          {visible.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              wishlisted={isWishlisted(p._id)}
              onWishlist={() => {
                toggleWishlist(p);
                toast.success(
                  isWishlisted(p._id)
                    ? "Removed from wishlist."
                    : p.title + " saved! ❤️",
                );
              }}
              onAddCart={() => {
                addToCart(p);
                toast.success(p.title + " added to cart!");
              }}
              onView={() => navigate("/product/" + p._id)}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {!loading && visibleCount < filtered.length && (
        <>
          <div ref={sentinelRef} style={{ height: "40px" }} />
          {loadingMore && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid rgba(255,255,255,0.1)",
                  borderTop: "3px solid #e8c547",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto",
                }}
              />
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              onClick={loadMore}
              style={{
                background: "transparent",
                border: "1px solid rgba(232,197,71,0.35)",
                color: "#e8c547",
                padding: "12px 32px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Load More ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        </>
      )}
      {!loading &&
        visibleCount >= filtered.length &&
        filtered.length > PAGE_SIZE && (
          <p
            style={{
              textAlign: "center",
              color: "#9090a8",
              fontSize: "13px",
              marginTop: "36px",
              letterSpacing: "2px",
            }}
          >
            ✦ You've seen all {filtered.length} products ✦
          </p>
        )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const ProductCard = ({
  product: p,
  wishlisted,
  onWishlist,
  onAddCart,
  onView,
}) => (
  <div
    onClick={onView}
    style={{
      background: "#111118",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
      e.currentTarget.style.borderColor = "rgba(232,197,71,0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
    }}
  >
    <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
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
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/400x220/1a1a24/9090a8?text=No+Image";
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWishlist();
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(8,8,15,0.7)",
          border: "none",
          borderRadius: "50%",
          width: "34px",
          height: "34px",
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>
    </div>
    <div style={{ padding: "16px" }}>
      <p
        style={{
          fontSize: "10px",
          color: "#e8c547",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontWeight: "600",
          marginBottom: "6px",
        }}
      >
        {p.category || "general"}
      </p>
      <h3
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "16px",
          color: "#f0f0f5",
          fontWeight: "600",
          marginBottom: "6px",
          lineHeight: "1.3",
        }}
      >
        {p.title}
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "#9090a8",
          lineHeight: "1.5",
          marginBottom: "14px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {p.description}
      </p>
      {p.numReviews > 0 && (
        <p style={{ fontSize: "12px", color: "#9090a8", marginBottom: "10px" }}>
          <span style={{ color: "#e8c547" }}>
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
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#f0f0f5" }}>
          Rs.{Number(p.price).toLocaleString()}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddCart();
          }}
          style={{
            background: "#e8c547",
            color: "#0a0a0f",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#c9a227")}
          onMouseLeave={(e) => (e.target.style.background = "#e8c547")}
        >
          + Cart
        </button>
      </div>
    </div>
  </div>
);

export default Home;
