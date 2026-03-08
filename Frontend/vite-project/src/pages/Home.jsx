import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import ProductCard from "../components/productCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
  "Electronics",
  "Footwear",
  "Clothing",
  "Books",
  "Accessories",
  "General",
];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];
const PAGE_SIZE = 12;

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setIsSearching(search !== debouncedSearch);
  }, [search, debouncedSearch]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then(({ data }) => setAllProducts(data))
      .catch(() => toast.error("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  const filtered = allProducts
    .filter((p) => {
      const matchSearch = p.title
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchCategory =
        category === "All" ||
        p.category?.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const handleObserver = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setPage((p) => p + 1);
          setLoadingMore(false);
        }, 500);
      }
    },
    [hasMore, loadingMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <p style={S.heroTag}>New Collection 2025</p>
        <h1 style={S.heroTitle}>
          Discover Premium
          <br />
          Products
        </h1>
        <p style={S.heroSub}>Handpicked quality items delivered to your door</p>
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
          {isSearching && <span style={S.searchSpinner}></span>}
          {search && (
            <button onClick={() => setSearch("")} style={S.clearX}>
              ✕
            </button>
          )}
        </div>
        {debouncedSearch && !isSearching && (
          <p style={S.searchHint}>
            Showing results for{" "}
            <strong style={{ color: "#e8c547" }}>"{debouncedSearch}"</strong>
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div style={S.filterRow}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={
              category === cat
                ? { ...S.filterBtn, ...S.filterBtnActive }
                : S.filterBtn
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={S.headerRow}>
        <div>
          <h2 style={S.sectionTitle}>
            {category === "All" ? "All Products" : category}
          </h2>
          <p style={S.sectionSub}>
            {loading
              ? "Loading…"
              : isSearching
                ? "Searching…"
                : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <div style={S.rightRow}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={S.sortSelect}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button style={S.uploadBtn} onClick={() => navigate("/add-product")}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={S.grid}>
          {Array(PAGE_SIZE)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={S.emptyWrap}>
          <p style={{ fontSize: "56px" }}>📦</p>
          <h3 style={S.emptyTitle}>No products found</h3>
          <p style={S.emptySub}>
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : `No products in "${category}"`}
          </p>
          {(debouncedSearch || category !== "All") && (
            <button
              style={S.clearBtn}
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && visible.length > 0 && (
        <>
          <div style={S.grid}>
            {visible.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div
            ref={loaderRef}
            style={{
              height: "40px",
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loadingMore && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div style={S.spinner}></div>
                <span style={{ color: "#9090a8", fontSize: "14px" }}>
                  Loading more…
                </span>
              </div>
            )}
            {!loadingMore && hasMore && (
              <button
                style={S.loadMoreBtn}
                onClick={() => setPage((p) => p + 1)}
              >
                Load More ({filtered.length - visible.length} remaining)
              </button>
            )}
          </div>
          {!hasMore && filtered.length > PAGE_SIZE && (
            <p style={S.endText}>
              ✦ You've seen all {filtered.length} products ✦
            </p>
          )}
        </>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const S = {
  page: { maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" },
  hero: {
    textAlign: "center",
    padding: "80px 20px 48px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "36px",
  },
  heroTag: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#e8c547",
    letterSpacing: "3px",
    textTransform: "uppercase",
    background: "rgba(232,197,71,0.1)",
    padding: "6px 16px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  heroTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "clamp(36px,6vw,64px)",
    fontWeight: "700",
    color: "#f0f0f5",
    lineHeight: "1.15",
    marginBottom: "16px",
  },
  heroSub: { color: "#9090a8", fontSize: "16px", marginBottom: "36px" },
  searchWrap: { position: "relative", maxWidth: "480px", margin: "0 auto" },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    zIndex: 1,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    paddingLeft: "44px",
    paddingRight: "80px",
    fontSize: "15px",
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "50px",
    height: "50px",
    outline: "none",
    color: "#f0f0f5",
    fontFamily: "'DM Sans',sans-serif",
  },
  searchSpinner: {
    position: "absolute",
    right: "44px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.1)",
    borderTop: "2px solid #e8c547",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "block",
  },
  clearX: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#9090a8",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px 8px",
  },
  searchHint: { color: "#9090a8", fontSize: "13px", marginTop: "12px" },
  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  filterBtn: {
    padding: "8px 20px",
    borderRadius: "50px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#9090a8",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
  },
  filterBtnActive: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "1px solid #e8c547",
    fontWeight: "700",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "26px",
    fontWeight: "700",
    color: "#f0f0f5",
  },
  sectionSub: { color: "#9090a8", fontSize: "13px", marginTop: "4px" },
  rightRow: { display: "flex", gap: "12px", alignItems: "center" },
  sortSelect: {
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0f0f5",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
  },
  uploadBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
    gap: "24px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.1)",
    borderTop: "2px solid #e8c547",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  loadMoreBtn: {
    background: "transparent",
    border: "1px solid rgba(232,197,71,0.4)",
    color: "#e8c547",
    padding: "12px 28px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
  },
  endText: {
    textAlign: "center",
    color: "#9090a8",
    fontSize: "13px",
    marginTop: "36px",
    letterSpacing: "2px",
  },
  emptyWrap: { textAlign: "center", padding: "80px 20px" },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "24px",
    color: "#f0f0f5",
    marginBottom: "10px",
  },
  emptySub: { color: "#9090a8", fontSize: "15px", marginBottom: "24px" },
  clearBtn: {
    background: "transparent",
    border: "1px solid rgba(232,197,71,0.5)",
    color: "#e8c547",
    padding: "10px 24px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
  },
};

export default Home;
