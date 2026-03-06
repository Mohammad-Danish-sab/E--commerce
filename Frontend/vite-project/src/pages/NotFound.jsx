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
    <div style={S.page}>
      {/* 404 number */}
      <div style={S.codeWrap}>
        <span style={S.four}>4</span>
        <span style={S.zero}>0</span>
        <span style={S.four}>4</span>
      </div>

      <div style={S.divider}></div>

      <h2 style={S.title}>Page Not Found</h2>
      <p style={S.sub}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Countdown */}
      <div style={S.countWrap}>
        <div style={S.countRing}>
          <span style={S.countNum}>{count}</span>
        </div>
        <p style={S.countLabel}>Redirecting to home...</p>
      </div>

      {/* Buttons */}
      <div style={S.btnRow}>
        <button onClick={() => navigate("/")} style={S.homeBtn}>
          Go Home Now
        </button>
        <button onClick={() => navigate(-1)} style={S.backBtn}>
          Go Back
        </button>
      </div>

      {/* Background watermark */}
      <div style={S.bgText}>404</div>
    </div>
  );
};

const S = {
  page: {
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
  },
  codeWrap: { display: "flex", gap: "8px", marginBottom: "24px" },
  four: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(80px,15vw,140px)",
    fontWeight: "700",
    color: "#e8c547",
    lineHeight: 1,
    textShadow: "0 0 40px rgba(232,197,71,0.3)",
  },
  zero: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(80px,15vw,140px)",
    fontWeight: "700",
    color: "#f0f0f5",
    lineHeight: 1,
    opacity: 0.15,
  },
  divider: {
    width: "60px",
    height: "2px",
    background: "#e8c547",
    borderRadius: "2px",
    marginBottom: "24px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(22px,4vw,32px)",
    color: "#f0f0f5",
    marginBottom: "12px",
    fontWeight: "700",
  },
  sub: {
    color: "#9090a8",
    fontSize: "15px",
    maxWidth: "400px",
    lineHeight: "1.7",
    marginBottom: "36px",
  },
  countWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "36px",
  },
  countRing: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "2px solid rgba(232,197,71,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(232,197,71,0.08)",
  },
  countNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#e8c547",
  },
  countLabel: { color: "#9090a8", fontSize: "13px" },
  btnRow: { display: "flex", gap: "12px" },
  homeBtn: {
    background: "#e8c547",
    color: "#0a0a0f",
    border: "none",
    padding: "13px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  backBtn: {
    background: "transparent",
    color: "#9090a8",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "13px 28px",
    borderRadius: "10px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  bgText: {
    position: "absolute",
    fontSize: "clamp(160px,30vw,320px)",
    fontFamily: "'Playfair Display', serif",
    fontWeight: "700",
    color: "rgba(255,255,255,0.015)",
    userSelect: "none",
    pointerEvents: "none",
    zIndex: 0,
    bottom: "-40px",
    letterSpacing: "-10px",
  },
};

export default NotFound;
