import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCard.jsx";
import SkeletonCard from "../components/Skeleton.jsx";
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

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter by search + category
  let filtered = products.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "All" ||
      p.category?.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCategory;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
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

      {/* Header Row: title + sort + add button */}
      <div style={S.headerRow}>
        <div>
          <h2 style={S.sectionTitle}>
            {category === "All" ? "All Products" : category}
          </h2>
          <p style={S.sectionSub}>
            {loading
              ? "Loading..."
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

      {/* Skeleton Loading */}
      {loading && (
        <div style={S.grid}>
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div style={S.emptyWrap}>
          <p style={S.emptyIcon}>📦</p>
          <h3 style={S.emptyTitle}>No products found</h3>
          <p style={S.emptySub}>
            {search
              ? `No results for "${search}" in ${category}`
              : `No products in "${category}" yet.`}
          </p>
          {(search || category !== "All") && (
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

      {/* Product Grid */}
      {!loading && filtered.length > 0 && (
        <div style={S.grid}>
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

const S = {
  page: { maxWidth: "1280px", margin: "0 auto", padding: "0 24px 60px" },
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
    fontFamily: "'Playfair Display', serif",
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
  },
  searchInput: {
    paddingLeft: "44px",
    fontSize: "15px",
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "50px",
    height: "50px",
    outline: "none",
    color: "#f0f0f5",
    width: "100%",
  },
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
    fontFamily: "'DM Sans', sans-serif",
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
    fontFamily: "'Playfair Display', serif",
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
    fontFamily: "'DM Sans', sans-serif",
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
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
  },
  emptyWrap: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
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
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default Home;
