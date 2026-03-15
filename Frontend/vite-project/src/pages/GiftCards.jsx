import { useState } from "react";
import toast from "react-hot-toast";

const GIFT_CARDS = [
  {
    id: 1,
    amount: 500,
    label: "Starter",
    icon: "🎁",
    color: "#e8c547",
    desc: "Perfect for small treats",
  },
  {
    id: 2,
    amount: 1000,
    label: "Classic",
    icon: "💝",
    color: "#63b3ed",
    desc: "The popular choice",
  },
  {
    id: 3,
    amount: 2000,
    label: "Premium",
    icon: "👑",
    color: "#c084fc",
    desc: "Spoil someone special",
  },
  {
    id: 4,
    amount: 5000,
    label: "Luxury",
    icon: "💎",
    color: "#68d391",
    desc: "Go all out!",
  },
];

const VOUCHERS = {
  LUXE10: { type: "percent", value: 10, label: "10% off everything" },
  LUXE20: { type: "percent", value: 20, label: "20% off everything" },
  FLAT200: { type: "flat", value: 200, label: "Rs.200 flat off" },
  FLAT500: { type: "flat", value: 500, label: "Rs.500 flat off" },
  NEWUSER: { type: "percent", value: 15, label: "15% off — new users" },
  WELCOME: { type: "flat", value: 300, label: "Rs.300 welcome bonus" },
};

const s = (key) => `var(--${key})`;

const GiftCards = () => {
  const [tab, setTab] = useState("buy");
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [recipient, setRecipient] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [checkedVoucher, setCheckedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");
  const [purchased, setPurchased] = useState(null);

  const checkVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      setVoucherError("Enter a voucher code.");
      return;
    }
    const v = VOUCHERS[code];
    if (!v) {
      setVoucherError("Invalid or expired voucher code.");
      setCheckedVoucher(null);
      return;
    }
    setCheckedVoucher({ code, ...v });
    setVoucherError("");
  };

  const handleBuy = () => {
    const amount = selected ? selected.amount : parseInt(custom);
    if (!amount || amount < 100) {
      toast.error("Minimum gift card value is Rs.100.");
      return;
    }
    if (!recipient.email) {
      toast.error("Recipient email is required.");
      return;
    }
    const code =
      "GC" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setPurchased({
      code,
      amount,
      recipient: recipient.name || recipient.email,
    });
    toast.success("Gift card sent successfully! 🎁");
  };

  const generateCode = () => {
    const code =
      "LUXE" + Math.random().toString(36).substring(2, 6).toUpperCase();
    setVoucherCode(code);
    setCheckedVoucher(null);
    setVoucherError("");
  };

  return (
    <div
      style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px 80px" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p style={{ fontSize: "48px", marginBottom: "12px" }}>🎁</p>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "36px",
            color: s("text"),
            marginBottom: "8px",
          }}
        >
          Gift Cards & Vouchers
        </h1>
        <p style={{ color: s("muted"), fontSize: "15px" }}>
          Give the gift of choice — or redeem your savings
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: s("surface"),
          padding: "5px",
          borderRadius: "12px",
          marginBottom: "32px",
        }}
      >
        {[
          ["buy", "🎁 Buy Gift Card"],
          ["redeem", "🏷️ Redeem Voucher"],
        ].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "9px",
              border: "none",
              background: tab === t ? s("surface2") : "transparent",
              color: tab === t ? s("text") : s("muted"),
              fontWeight: tab === t ? "600" : "400",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Buy Tab */}
      {tab === "buy" && !purchased && (
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: s("text"),
              marginBottom: "20px",
            }}
          >
            Choose an Amount
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            {GIFT_CARDS.map((gc) => (
              <div
                key={gc.id}
                onClick={() => {
                  setSelected(gc);
                  setCustom("");
                }}
                style={{
                  background:
                    selected?.id === gc.id
                      ? `rgba(232,197,71,0.1)`
                      : s("surface"),
                  border: `2px solid ${selected?.id === gc.id ? s("gold") : s("border")}`,
                  borderRadius: "16px",
                  padding: "22px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                  {gc.icon}
                </div>
                <p
                  style={{
                    color: gc.color,
                    fontWeight: "700",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "6px",
                  }}
                >
                  {gc.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "26px",
                    fontWeight: "700",
                    color: s("text"),
                    marginBottom: "6px",
                  }}
                >
                  Rs.{gc.amount.toLocaleString()}
                </p>
                <p style={{ color: s("muted"), fontSize: "12px" }}>{gc.desc}</p>
              </div>
            ))}
          </div>

          {/* Custom amount */}
          <div
            style={{
              background:
                selected === null && custom
                  ? "rgba(232,197,71,0.08)"
                  : s("surface"),
              border: `1px solid ${selected === null && custom ? s("gold") : s("border")}`,
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                color: s("muted"),
                fontSize: "13px",
                marginBottom: "10px",
                fontWeight: "500",
              }}
            >
              Or enter a custom amount (Min Rs.100)
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setSelected(null);
                }}
                placeholder="e.g. 1500"
                style={{
                  flex: 1,
                  background: s("surface2"),
                  border: `1px solid ${s("border")}`,
                  borderRadius: "10px",
                  padding: "11px 16px",
                  color: s("text"),
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: s("muted"),
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                Rs. custom
              </span>
            </div>
          </div>

          {/* Recipient */}
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "20px",
              color: s("text"),
              marginBottom: "16px",
            }}
          >
            Recipient Details
          </h2>
          <div
            style={{
              background: s("surface"),
              border: `1px solid ${s("border")}`,
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {[
              ["name", "Recipient Name", "text", "John Doe"],
              ["email", "Recipient Email *", "email", "friend@email.com"],
            ].map(([key, label, type, ph]) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: "13px",
                    color: s("muted"),
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  value={recipient[key]}
                  onChange={(e) =>
                    setRecipient({ ...recipient, [key]: e.target.value })
                  }
                  placeholder={ph}
                  style={{
                    width: "100%",
                    background: s("surface2"),
                    border: `1px solid ${s("border")}`,
                    borderRadius: "10px",
                    padding: "11px 16px",
                    color: s("text"),
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <div>
              <label
                style={{
                  fontSize: "13px",
                  color: s("muted"),
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Personal Message (optional)
              </label>
              <textarea
                rows={3}
                value={recipient.message}
                onChange={(e) =>
                  setRecipient({ ...recipient, message: e.target.value })
                }
                placeholder="Happy Birthday! Enjoy shopping…"
                style={{
                  width: "100%",
                  background: s("surface2"),
                  border: `1px solid ${s("border")}`,
                  borderRadius: "10px",
                  padding: "11px 16px",
                  color: s("text"),
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Summary + Buy */}
          {(selected || (custom && parseInt(custom) >= 100)) && (
            <div
              style={{
                background: "rgba(232,197,71,0.08)",
                border: "1px solid rgba(232,197,71,0.2)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ color: s("muted"), fontSize: "13px" }}>
                  You're buying a gift card worth
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: s("gold"),
                  }}
                >
                  Rs.
                  {(selected
                    ? selected.amount
                    : parseInt(custom) || 0
                  ).toLocaleString()}
                </p>
              </div>
              <span style={{ fontSize: "36px" }}>{selected?.icon || "🎁"}</span>
            </div>
          )}

          <button
            onClick={handleBuy}
            style={{
              width: "100%",
              background: s("gold"),
              color: "#0a0a0f",
              border: "none",
              padding: "15px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Send Gift Card 🎁
          </button>
        </div>
      )}

      {/* Success */}
      {tab === "buy" && purchased && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "28px",
              color: s("text"),
              marginBottom: "10px",
            }}
          >
            Gift Card Sent!
          </h2>
          <p style={{ color: s("muted"), marginBottom: "28px" }}>
            Successfully sent to{" "}
            <strong style={{ color: s("text") }}>{purchased.recipient}</strong>
          </p>
          <div
            style={{
              background: s("surface"),
              border: `2px dashed ${s("gold")}`,
              borderRadius: "20px",
              padding: "32px",
              marginBottom: "28px",
              maxWidth: "380px",
              margin: "0 auto 28px",
            }}
          >
            <p
              style={{
                color: s("muted"),
                fontSize: "12px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Gift Card Code
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "28px",
                fontWeight: "700",
                color: s("gold"),
                letterSpacing: "4px",
                marginBottom: "12px",
              }}
            >
              {purchased.code}
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "36px",
                fontWeight: "700",
                color: s("text"),
              }}
            >
              Rs.{purchased.amount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setPurchased(null)}
            style={{
              background: s("gold"),
              color: "#0a0a0f",
              border: "none",
              padding: "12px 28px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Buy Another
          </button>
        </div>
      )}

      {/* Redeem Tab */}
      {tab === "redeem" && (
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: s("text"),
              marginBottom: "8px",
            }}
          >
            Redeem a Voucher
          </h2>
          <p
            style={{
              color: s("muted"),
              fontSize: "14px",
              marginBottom: "28px",
            }}
          >
            Enter your voucher code to check its value
          </p>

          <div
            style={{
              background: s("surface"),
              border: `1px solid ${s("border")}`,
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                fontSize: "13px",
                color: s("muted"),
                display: "block",
                marginBottom: "8px",
              }}
            >
              Voucher Code
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value.toUpperCase());
                  setCheckedVoucher(null);
                  setVoucherError("");
                }}
                placeholder="e.g. LUXE20"
                onKeyDown={(e) => e.key === "Enter" && checkVoucher()}
                style={{
                  flex: 1,
                  background: s("surface2"),
                  border: `1px solid ${s("border")}`,
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: s("text"),
                  fontSize: "15px",
                  outline: "none",
                  letterSpacing: "2px",
                  fontWeight: "600",
                }}
              />
              <button
                onClick={checkVoucher}
                style={{
                  background: s("gold"),
                  color: "#0a0a0f",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Check
              </button>
            </div>
            {voucherError && (
              <p style={{ color: s("red"), fontSize: "13px" }}>
                {voucherError}
              </p>
            )}
          </div>

          {checkedVoucher && (
            <div
              style={{
                background: "rgba(104,211,145,0.08)",
                border: "1px solid rgba(104,211,145,0.25)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "36px", marginBottom: "12px" }}>✅</p>
              <p
                style={{
                  color: s("text"),
                  fontWeight: "700",
                  fontSize: "18px",
                  marginBottom: "4px",
                }}
              >
                Valid Voucher!
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#68d391",
                  marginBottom: "8px",
                }}
              >
                {checkedVoucher.label}
              </p>
              <p
                style={{
                  color: s("muted"),
                  fontSize: "13px",
                  marginBottom: "20px",
                }}
              >
                Code:{" "}
                <strong style={{ color: s("text"), letterSpacing: "2px" }}>
                  {checkedVoucher.code}
                </strong>
              </p>
              <button
                onClick={() => {
                  toast.success(
                    `Voucher ${checkedVoucher.code} applied to your cart!`,
                  );
                }}
                style={{
                  background: "#68d391",
                  color: "#0a0a0f",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Apply to Cart
              </button>
            </div>
          )}

          {/* Available vouchers */}
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "20px",
              color: s("text"),
              marginBottom: "16px",
            }}
          >
            Available Voucher Codes
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: "12px",
            }}
          >
            {Object.entries(VOUCHERS).map(([code, v]) => (
              <div
                key={code}
                onClick={() => {
                  setVoucherCode(code);
                  setCheckedVoucher(null);
                  setVoucherError("");
                  setTab("redeem");
                }}
                style={{
                  background: s("surface"),
                  border: `1px solid ${s("border")}`,
                  borderRadius: "12px",
                  padding: "16px 18px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = s("gold"))
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = s("border"))
                }
              >
                <p
                  style={{
                    color: s("gold"),
                    fontWeight: "700",
                    fontSize: "16px",
                    letterSpacing: "2px",
                    marginBottom: "4px",
                  }}
                >
                  {code}
                </p>
                <p style={{ color: s("text"), fontSize: "13px" }}>{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCards;
