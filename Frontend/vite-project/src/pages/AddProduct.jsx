import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ handle text fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // ⭐ preview
  };

  // ✅ submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !imageFile) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", Number(form.price));
      formData.append("description", form.description);
      formData.append("image", imageFile);

    await axios.post("http://localhost:5000/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-admin-key": "danish123", // ⭐ ADD HERE
      },
    });

      alert("✅ Product added successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Product</h2>

      <form onSubmit={submitHandler} style={styles.form}>
        <input
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          style={styles.input}
        />

        {/* ⭐ Image Upload */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* ⭐ Preview */}
        {preview && <img src={preview} alt="preview" style={styles.preview} />}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "420px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  preview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AddProduct;
