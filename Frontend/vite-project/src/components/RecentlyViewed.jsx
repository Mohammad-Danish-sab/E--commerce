import { useNavigate } from "react-router-dom";

const RecentlyViewed = ({ currentId }) => {
  const navigate = useNavigate();
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem("recently_viewed") || "[]")
      .filter((p) => p._id !== currentId)
      .slice(0, 6);
  } catch {}

  if (items.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "48px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingTop: "40px",
      }}
    >
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "22px",
          color: "#f0f0f5",
          marginBottom: "16px",
        }}
      >
        Recently Viewed
      </h2>
      <div
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {items.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate("/product/" + p._id)}
            style={{
              flexShrink: 0,
              width: "150px",
              cursor: "pointer",
              background: "#111118",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            <img
              src={p.image}
              alt={p.title}
              style={{
                width: "100%",
                height: "110px",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/150x110/1a1a24/9090a8?text=?";
              }}
            />
            <div style={{ padding: "10px" }}>
              <p
                style={{
                  color: "#f0f0f5",
                  fontSize: "12px",
                  fontWeight: "500",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  color: "#e8c547",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginTop: "4px",
                }}
              >
                Rs.{Number(p.price).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
