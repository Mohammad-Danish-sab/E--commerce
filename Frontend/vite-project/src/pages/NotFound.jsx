import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <span
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "120px",
            fontWeight: "700",
            color: "#e8c547",
            lineHeight: 1,
          }}
        >
          4
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "120px",
            fontWeight: "700",
            color: "#f0f0f5",
            lineHeight: 1,
            opacity: 0.15,
          }}
        >
          0
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "120px",
            fontWeight: "700",
            color: "#e8c547",
            lineHeight: 1,
          }}
        >
          4
        </span>
      </div>
      <div
        style={{
          width: "60px",
          height: "2px",
          background: "#e8c547",
          marginBottom: "24px",
        }}
      ></div>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "32px",
          color: "#f0f0f5",
          marginBottom: "12px",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          color: "#9090a8",
          fontSize: "15px",
          maxWidth: "400px",
          lineHeight: "1.7",
          marginBottom: "36px",
        }}
      >
        The page you're looking for doesn't exist.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "2px solid rgba(232,197,71,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(232,197,71,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              fontWeight: "700",
              color: "#e8c547",
            }}
          >
            {count}
          </span>
        </div>
        <p style={{ color: "#9090a8", fontSize: "13px" }}>
          Redirecting to home...
        </p>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#e8c547",
            color: "#0a0a0f",
            border: "none",
            padding: "13px 28px",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Go Home Now
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            color: "#9090a8",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "13px 28px",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
