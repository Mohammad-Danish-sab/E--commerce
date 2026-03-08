const SkeletonCard = () => (
  <div
    style={{
      background: "#111118",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{ width: "100%", height: "220px", background: "#1a1a24" }}
    ></div>
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          background: "#1a1a24",
          borderRadius: "6px",
          height: "10px",
          width: "40%",
        }}
      ></div>
      <div
        style={{
          background: "#1a1a24",
          borderRadius: "6px",
          height: "16px",
          width: "85%",
        }}
      ></div>
      <div
        style={{
          background: "#1a1a24",
          borderRadius: "6px",
          height: "12px",
          width: "65%",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            background: "#1a1a24",
            borderRadius: "6px",
            height: "18px",
            width: "35%",
          }}
        ></div>
        <div
          style={{
            background: "#1a1a24",
            borderRadius: "8px",
            height: "34px",
            width: "70px",
          }}
        ></div>
      </div>
    </div>
    <div
      style={{
        background:
          "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)",
        animation: "shimmer 1.5s infinite",
        position: "absolute",
        inset: 0,
      }}
    ></div>
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

export default SkeletonCard;
