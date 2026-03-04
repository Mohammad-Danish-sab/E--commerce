import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.price || !imageFile) {
      setError("Title, price and image are required.");
      return;
    }
    setLoading(true);
    const loadingToast = toast.loading("Uploading product...");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", Number(form.price));
      formData.append("description", form.description);
      formData.append("category", form.category || "general");
      formData.append("image", imageFile);

      // FIX: Use Authorization token + admin key header together
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
          "x-admin-key": "danish123",
        },
      });
      toast.dismiss(loadingToast);
      toast.success("Product added successfully!");
      navigate("/");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <button onClick={() => navigate("/")} style={S.backBtn}>
        ← Back
      </button>
      <h1 style={S.heading}>Add Product</h1>
      <p style={S.sub}>Fill in the details below</p>

      {error && <div style={S.error}>{error}</div>}

      <form onSubmit={submitHandler} style={S.form}>
        {/* Title */}
        <div style={S.field}>
          <label style={S.label}>Product Title *</label>
          <input
            name="title"
            placeholder="e.g. Nike Air Max"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price + Category */}
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Price (Rs.) *</label>
            <input
              name="price"
              type="number"
              min="0"
              placeholder="999"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Category</label>
            <input
              name="category"
              placeholder="e.g. footwear"
              value={form.category}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div style={S.field}>
          <label style={S.label}>Description</label>
          <textarea
            name="description"
            placeholder="Describe the product..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Image Upload */}
        <div style={S.field}>
          <label style={S.label}>Product Image *</label>
          <div
            style={S.uploadBox}
            onClick={() => document.getElementById("imgInput").click()}
          >
            {preview ? (
              <img src={preview} alt="preview" style={S.preview} />
            ) : (
              <div style={S.uploadPlaceholder}>
                <p style={{ fontSize: "32px" }}>+</p>
                <p style={{ color: "#9090a8", fontSize: "13px" }}>
                  Click to upload image
                </p>
                <p
                  style={{
                    color: "#9090a8",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  JPG, PNG, WEBP — max 5MB
                </p>
              </div>
            )}
            <input
              id="imgInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

const S = {
  page: { maxWidth: "520px", margin: "0 auto", padding: "40px 20px 60px" },
  backBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9090a8",
    padding: "8px 18px",
    borderRadius: "8px",
    marginBottom: "28px",
    cursor: "pointer",
    fontSize: "13px",
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    color: "#f0f0f5",
    marginBottom: "8px",
  },
  sub: { color: "#9090a8", marginBottom: "32px" },
  error: {
    background: "rgba(255,77,109,0.1)",
    border: "1px solid rgba(255,77,109,0.3)",
    color: "#ff4d6d",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#9090a8" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  uploadBox: {
    border: "2px dashed rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    minHeight: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlaceholder: { textAlign: "center" },
  preview: {
    width: "100%",
    maxHeight: "220px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  btn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default AddProduct;
