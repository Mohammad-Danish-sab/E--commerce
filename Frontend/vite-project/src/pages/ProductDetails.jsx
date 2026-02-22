import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Make sure this name is exactly "ProductDetails"
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    await axios.post(
      "http://localhost:5000/api/cart",
      { productId: id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    alert("Added to cart");
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <img src={product.image} alt="" style={{ width: "300px" }} />
      <div>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <h2>₹ {product.price}</h2>
        <button onClick={addToCart}>Add To Cart</button>
      </div>
    </div>
  );
};

// This MUST match the const name above
export default ProductDetails;
