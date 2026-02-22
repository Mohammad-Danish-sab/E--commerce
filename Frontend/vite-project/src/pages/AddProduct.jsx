import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [form, setForm] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/products", form);
    alert("Product added");
  };

  return (
    <form
      onSubmit={submitHandler}
      style={{ maxWidth: "300px", margin: "40px auto" }}
    >
      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Price"
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        placeholder="Image URL"
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <textarea
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button>Add Product</button>
    </form>
  );
};

export default AddProduct;
