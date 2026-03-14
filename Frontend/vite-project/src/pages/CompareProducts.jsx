import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const MAX = 3;

const CompareProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then(({ data }) => setProducts(data))
      .catch(() => toast.error("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (product) => {
    if (selected.find((p) => p._id === product._id)) {
      setSelected((s) => s.filter((p) => p._id !== product._id));
    } else if (selected.length >= MAX) {
      toast.error(`You can compare up to ${MAX} products.`);
    } else {
      setSelected((s) => [...s, product]);
    }
  };

  const isSelected = (id) => selected.some((p) => p._id === id);

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const s = (key) => `var(--${key})`;

  const SPECS = [
    {
      key: "price",
      label: "Price",
      render: (p) => `Rs.${Number(p.price).toLocaleString()}`,
    },
    { key: "category", label: "Category", render: (p) => p.category || "—" },
    {
      key: "avgRating",
      label: "Avg. Rating",
      render: (p) =>
        p.avgRating
          ? `${"★".repeat(Math.round(p.avgRating))} ${p.avgRating.toFixed(1)}`
          : "No ratings",
    },
    { key: "numReviews", label: "Reviews", render: (p) => p.numReviews || 0 },
    {
      key: "stock",
      label: "In Stock",
      render: (p) => (p.stock > 0 ? `✅ ${p.stock} units` : "❌ Out of stock"),
    },
    {
      key: "description",
      label: "Description",
      render: (p) => (
        <span style={{ fontSize: "12px", lineHeight: "1.6" }}>
          {(p.description || "").slice(0, 100)}
          {p.description?.length > 100 ? "…" : ""}
        </span>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "32px",
            color: s("text"),
          }}
        >
          Compare Products
        </h1>
        <p style={{ color: s("muted"), fontSize: "14px", marginTop: "4px" }}>
          Select up to {MAX} products to compare side by side
        </p>
      </div>

      {/* Selected slots */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MAX}, 1fr)`,
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {Array(MAX)
          .fill(0)
          .map((_, i) => {
            const p = selected[i];
            return (
              <div
                key={i}
                style={{
                  background: p ? s("surface") : "transparent",
                  border: `2px dashed ${p ? s("gold") : s("border")}`,
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center",
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                {p ? (
                  <>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/80x80/1a1a24/9090a8?text=?";
                      }}
                    />
                    <p
                      style={{
                        color: s("text"),
                        fontWeight: "600",
                        fontSize: "13px",
                        lineHeight: "1.3",
                      }}
                    >
                      {p.title}
                    </p>
                    <p style={{ color: s("gold"), fontWeight: "700" }}>
                      Rs.{Number(p.price).toLocaleString()}
                    </p>
                    <button
                      onClick={() => toggle(p)}
                      style={{
                        background: "rgba(255,77,109,0.1)",
                        border: "1px solid rgba(255,77,109,0.2)",
                        color: s("red"),
                        padding: "5px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "32px", opacity: 0.3 }}>➕</span>
                    <p style={{ color: s("muted"), fontSize: "13px" }}>
                      Select product {i + 1}
                    </p>
                  </>
                )}
              </div>
            );
          })}
      </div>

      {/* Comparison table */}
      {selected.length >= 2 && (
        <div
          style={{
            background: s("surface"),
            border: `1px solid ${s("border")}`,
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${s("border")}`,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "22px",
                color: s("text"),
              }}
            >
              Comparison
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: s("surface2") }}>
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "left",
                      color: s("muted"),
                      fontSize: "13px",
                      fontWeight: "600",
                      width: "160px",
                    }}
                  >
                    Spec
                  </th>
                  {selected.map((p) => (
                    <th
                      key={p._id}
                      style={{
                        padding: "14px 20px",
                        textAlign: "center",
                        color: s("text"),
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {p.title.slice(0, 20)}
                      {p.title.length > 20 ? "…" : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPECS.map(({ key, label, render }) => (
                  <tr
                    key={key}
                    style={{ borderTop: `1px solid ${s("border")}` }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        color: s("muted"),
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {label}
                    </td>
                    {selected.map((p, i) => {
                      const vals = selected.map((x) => x[key]);
                      const isNumber =
                        key === "price" ||
                        key === "numReviews" ||
                        key === "stock";
                      const numVals = isNumber
                        ? selected.map((x) => Number(x[key]) || 0)
                        : null;
                      const isBest =
                        isNumber &&
                        numVals &&
                        numVals[i] === Math.max(...numVals);
                      return (
                        <td
                          key={p._id}
                          style={{
                            padding: "14px 20px",
                            textAlign: "center",
                            color: isBest ? s("gold") : s("text"),
                            fontWeight: isBest ? "700" : "400",
                            fontSize: "13px",
                          }}
                        >
                          {render(p)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr style={{ borderTop: `1px solid ${s("border")}` }}>
                  <td
                    style={{
                      padding: "14px 20px",
                      color: s("muted"),
                      fontSize: "13px",
                    }}
                  >
                    Action
                  </td>
                  {selected.map((p) => (
                    <td
                      key={p._id}
                      style={{ padding: "14px 20px", textAlign: "center" }}
                    >
                      <button
                        onClick={() => {
                          addToCart(p);
                          toast.success(p.title + " added!");
                        }}
                        style={{
                          background: s("gold"),
                          color: "#0a0a0f",
                          border: "none",
                          padding: "8px 18px",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                          display: "block",
                          margin: "0 auto 6px",
                        }}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate("/product/" + p._id)}
                        style={{
                          background: "transparent",
                          border: `1px solid ${s("border")}`,
                          color: s("muted"),
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product picker */}
      <div>
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "22px",
            color: s("text"),
            marginBottom: "16px",
          }}
        >
          {selected.length < MAX
            ? "Select products to compare"
            : "Comparison full — remove one to swap"}
        </h2>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
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
              padding: "12px 14px 12px 40px",
              background: s("surface"),
              border: `1px solid ${s("border")}`,
              borderRadius: "50px",
              fontSize: "14px",
              color: s("text"),
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        {loading ? (
          <p
            style={{ color: s("muted"), textAlign: "center", padding: "40px" }}
          >
            Loading products…
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
              gap: "14px",
            }}
          >
            {filtered.map((p) => {
              const sel = isSelected(p._id);
              return (
                <div
                  key={p._id}
                  onClick={() => toggle(p)}
                  style={{
                    background: sel ? "rgba(232,197,71,0.08)" : s("surface"),
                    border: `1px solid ${sel ? s("gold") : s("border")}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  {sel && (
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: s("gold"),
                        color: "#0a0a0f",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "130px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/200x130/1a1a24/9090a8?text=No+Image";
                    }}
                  />
                  <div style={{ padding: "12px" }}>
                    <p
                      style={{
                        color: s("text"),
                        fontWeight: "600",
                        fontSize: "13px",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        color: s("gold"),
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      Rs.{Number(p.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareProducts;
