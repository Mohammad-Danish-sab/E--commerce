import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCard.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // FIX: Removed duplicate fetchProducts definition and duplicate .map() render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()),
  );

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

      {/* Header Row */}
      <div style={S.headerRow}>
        <div>
          <h2 style={S.sectionTitle}>All Products</h2>
          <p style={S.sectionSub}>{filtered.length} items found</p>
        </div>
        <button style={S.uploadBtn} onClick={() => navigate("/add-product")}>
          + Add Product
        </button>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div style={S.center}>
          <div style={S.spinner}></div>
          <p style={{ color: "#9090a8", marginTop: "16px" }}>
            Loading products...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={S.center}>
          <p style={{ fontSize: "48px" }}>📦</p>
          <p style={{ color: "#9090a8", marginTop: "12px", fontSize: "16px" }}>
            {search ? "No products match your search." : "No products yet."}
          </p>
        </div>
      )}

      {/* Product Grid — FIX: single .map(), no duplicates */}
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
    padding: "80px 20px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "48px",
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
    fontSize: "clamp(36px, 6vw, 64px)",
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
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "28px",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px",
    fontWeight: "700",
    color: "#f0f0f5",
  },
  sectionSub: { color: "#9090a8", fontSize: "14px", marginTop: "4px" },
  uploadBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
  },
  center: { textAlign: "center", padding: "80px 20px" },
  spinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #e8c547",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default Home;
