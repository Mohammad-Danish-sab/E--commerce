import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div style={styles.card}>
      <img src={product.image} alt="" style={styles.img} />
      <h3>{product.title}</h3>
      <p>₹ {product.price}</p>
      <Link to={`/product/${product._id}`}>
        <button>View</button>
      </Link>
    </div>
  );
};

const styles = {
  card: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
};

export default ProductCard;
