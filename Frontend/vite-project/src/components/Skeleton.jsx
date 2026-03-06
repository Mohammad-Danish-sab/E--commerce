const SkeletonCard = () => {
  return (
    <div style={S.card}>
      <div style={S.imgSkeleton}></div>
      <div style={S.body}>
        <div style={{ ...S.line, width: "40%", height: "10px" }}></div>
        <div style={{ ...S.line, width: "85%", height: "16px" }}></div>
        <div style={{ ...S.line, width: "65%", height: "12px" }}></div>
        <div style={S.bottom}>
          <div
            style={{ ...S.line, width: "35%", height: "18px", margin: 0 }}
          ></div>
          <div style={S.btnSkeleton}></div>
        </div>
      </div>
      <div style={S.shimmer}></div>
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

const S = {
  card: {
    background: "#111118",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.07)",
    overflow: "hidden",
    position: "relative",
  },
  imgSkeleton: {
    width: "100%",
    height: "220px",
    background: "#1a1a24",
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  line: {
    background: "#1a1a24",
    borderRadius: "6px",
    height: "12px",
    marginBottom: "2px",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "4px",
  },
  btnSkeleton: {
    width: "70px",
    height: "34px",
    background: "#1a1a24",
    borderRadius: "8px",
  },
  shimmer: {
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
    animation: "shimmer 1.5s infinite",
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
};

export default SkeletonCard;
