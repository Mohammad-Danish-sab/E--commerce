import { useState, useEffect, useRef } from "react";

const BOT_REPLIES = {
  hello: "Hi there! 👋 Welcome to Luxe Store. How can I help you today?",
  hi: "Hello! 😊 How can I assist you today?",
  order:
    "You can track your orders from the **Orders** page in the menu. Need help with a specific order?",
  payment:
    "We accept all major cards via Razorpay. Your payments are 100% secure 🔒",
  return:
    "We have a 7-day return policy. Visit your Orders page and click 'Return' on the item.",
  shipping:
    "Free shipping on orders over Rs.999! Standard delivery takes 3–5 business days 🚚",
  coupon: "Try these codes: LUXE10, LUXE20, FLAT200, FLAT500, NEWUSER 🎉",
  discount:
    "Use code LUXE20 for 20% off your next purchase! Also check our Gift Cards page 🎁",
  cancel:
    "To cancel an order, go to Orders page and the option will appear if the order is still processing.",
  contact:
    "You can reach us at support@luxestore.com or call +91-9999-000-111 📞",
  size: "Size guides are available on each product page. If in doubt, we recommend sizing up!",
  default:
    "Thanks for your message! Our support team will get back to you shortly. Meanwhile, can I help with something else?",
};

const getReply = (msg) => {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(BOT_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return val;
  }
  return BOT_REPLIES.default;
};

const QUICK_REPLIES = [
  "Track my order",
  "Coupon codes",
  "Shipping info",
  "Return policy",
  "Contact support",
];

const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm Luxe Support Bot. How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    setUnread(0);
  }, [open]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const userMsg = { from: "user", text: msg, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);

    setTimeout(
      () => {
        const reply = getReply(msg);
        setMessages((m) => [
          ...m,
          { from: "bot", text: reply, time: new Date() },
        ]);
        setTyping(false);
        if (!open) setUnread((n) => n + 1);
      },
      1000 + Math.random() * 800,
    );
  };

  const s = (key) => `var(--${key})`;
  const fmt = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "88px",
          right: "28px",
          zIndex: 990,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e8c547, #c9a227)",
          border: "none",
          cursor: "pointer",
          fontSize: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(232,197,71,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Live Chat"
      >
        {open ? "✕" : "💬"}
        {!open && unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ff4d6d",
              color: "#fff",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              fontSize: "10px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "154px",
            right: "28px",
            zIndex: 991,
            width: "340px",
            height: "460px",
            background: s("surface"),
            border: `1px solid ${s("border")}`,
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a24, #111118)",
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderBottom: `1px solid ${s("border")}`,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#e8c547,#c9a227)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              ✦
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: s("text"),
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Luxe Support
              </p>
              <p
                style={{
                  color: "#68d391",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#68d391",
                    display: "inline-block",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                Online · Typically replies instantly
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: s("muted"),
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: m.from === "user" ? "row-reverse" : "row",
                  gap: "8px",
                  alignItems: "flex-end",
                }}
              >
                {m.from === "bot" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#e8c547,#c9a227)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    ✦
                  </div>
                )}
                <div style={{ maxWidth: "220px" }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius:
                        m.from === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      background:
                        m.from === "user"
                          ? "linear-gradient(135deg,#e8c547,#c9a227)"
                          : s("surface2"),
                      color: m.from === "user" ? "#0a0a0f" : s("text"),
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    {m.text}
                  </div>
                  <p
                    style={{
                      color: s("muted"),
                      fontSize: "10px",
                      marginTop: "3px",
                      textAlign: m.from === "user" ? "right" : "left",
                    }}
                  >
                    {fmt(m.time)}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div
                style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#e8c547,#c9a227)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  ✦
                </div>
                <div
                  style={{
                    padding: "10px 16px",
                    background: s("surface2"),
                    borderRadius: "16px 16px 16px 4px",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: s("muted"),
                        display: "inline-block",
                        animation: `bounce 1s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              borderTop: `1px solid ${s("border")}`,
            }}
          >
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  flexShrink: 0,
                  padding: "5px 12px",
                  background: "rgba(232,197,71,0.1)",
                  border: "1px solid rgba(232,197,71,0.25)",
                  borderRadius: "20px",
                  color: s("gold"),
                  fontSize: "11px",
                  fontWeight: "500",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              borderTop: `1px solid ${s("border")}`,
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                background: s("surface2"),
                border: `1px solid ${s("border")}`,
                borderRadius: "20px",
                padding: "9px 14px",
                color: s("text"),
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={() => sendMessage()}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#e8c547,#c9a227)",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </>
  );
};

export default LiveChat;
