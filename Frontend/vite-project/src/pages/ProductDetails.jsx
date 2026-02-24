import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${id}`,
    );
    setProduct(data);
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <img src={product.image} width="300" />
      <h2>{product.title}</h2>
      <h3>₹{product.price}</h3>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetails;
