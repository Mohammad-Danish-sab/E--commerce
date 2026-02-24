import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  return (
    <div style={styles.container}>
      {/* 🔷 Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🛍️ Our Products</h1>

        {/* ⬆️ Upload Button */}
        <button
          style={styles.uploadBtn}
          onClick={() => alert("Navigate to upload page")}
        >
          + Upload Product
        </button>
      </div>

      {/* 🔄 Loading */}
      {loading && <p style={styles.message}>Loading products...</p>}

      {/* 📦 Empty State */}
      {!loading && products.length === 0 && (
        <p style={styles.message}>No products found.</p>
      )}

      {/* 🧱 Product Grid */}
      <div style={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },

  title: {
    margin: 0,
  },

  uploadBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: "20px",
    padding: "20px",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    padding: "20px",
  },
};

export default Home;
