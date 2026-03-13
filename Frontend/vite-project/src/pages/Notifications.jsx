import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    icon: "📦",
    title: "Order Shipped!",
    message: "Your order #A1B2C3D4 is on its way.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "promo",
    icon: "🎁",
    title: "Special Offer!",
    message: "Use code LUXE20 for 20% off your next order.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "order",
    icon: "✅",
    title: "Order Delivered",
    message: "Your order #X9Y8Z7W6 has been delivered.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    type: "account",
    icon: "👤",
    title: "Profile Updated",
    message: "Your profile name was updated successfully.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "promo",
    icon: "⭐",
    title: "New Arrivals!",
    message: "Check out our new premium collection.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 6,
    type: "order",
    icon: "🕐",
    title: "Order Processing",
    message: "Your order #M3N4O5P6 is being processed.",
    time: "4 days ago",
    read: true,
  },
  {
    id: 7,
    type: "promo",
    icon: "🏷️",
    title: "Flash Sale Today!",
    message: "Up to 40% off on Electronics. Ends tonight!",
    time: "5 days ago",
    read: true,
  },
  {
    id: 8,
    type: "account",
    icon: "🔒",
    title: "Password Changed",
    message: "Your account password was changed successfully.",
    time: "1 week ago",
    read: true,
  },
];

const TYPE_COLOR = {
  order: {
    bg: "rgba(99,179,237,0.1)",
    color: "#63b3ed",
    border: "rgba(99,179,237,0.2)",
  },
  promo: {
    bg: "rgba(232,197,71,0.1)",
    color: "#e8c547",
    border: "rgba(232,197,71,0.2)",
  },
  account: {
    bg: "rgba(192,132,252,0.1)",
    color: "#c084fc",
    border: "rgba(192,132,252,0.2)",
  },
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("notifications") ||
          JSON.stringify(SAMPLE_NOTIFICATIONS),
      );
    } catch {
      return SAMPLE_NOTIFICATIONS;
    }
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifs));
  }, [notifs]);

  const markRead = (id) =>
    setNotifs((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  const markAllRead = () =>
    setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const deleteNotif = (id) => setNotifs((n) => n.filter((x) => x.id !== id));
  const clearAll = () => setNotifs([]);

  const unread = notifs.filter((n) => !n.read).length;
  const filtered =
    filter === "all"
      ? notifs
      : filter === "unread"
        ? notifs.filter((n) => !n.read)
        : notifs.filter((n) => n.type === filter);

  const s = (key) => `var(--${key})`;

  return (
    <div
      style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "32px",
              color: s("text"),
            }}
          >
            Notifications
          </h1>
          <p style={{ color: s("muted"), fontSize: "14px", marginTop: "4px" }}>
            {unread > 0 ? (
              <span style={{ color: s("gold"), fontWeight: "600" }}>
                {unread} unread
              </span>
            ) : (
              "All caught up!"
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              style={{
                background: "rgba(232,197,71,0.1)",
                border: "1px solid rgba(232,197,71,0.25)",
                color: s("gold"),
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Mark all read
            </button>
          )}
          {notifs.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: "rgba(255,77,109,0.1)",
                border: "1px solid rgba(255,77,109,0.2)",
                color: s("red"),
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        {[
          ["all", "All"],
          ["unread", "Unread"],
          ["order", "Orders"],
          ["promo", "Promotions"],
          ["account", "Account"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: "7px 16px",
              borderRadius: "50px",
              border: `1px solid ${filter === val ? s("gold") : s("border")}`,
              background: filter === val ? s("gold") : "transparent",
              color: filter === val ? "#0a0a0f" : s("muted"),
              fontSize: "13px",
              fontWeight: filter === val ? "700" : "400",
              cursor: "pointer",
            }}
          >
            {label}
            {val === "unread" && unread > 0 && (
              <span
                style={{
                  marginLeft: "5px",
                  background: s("red"),
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "1px 5px",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          <p style={{ fontSize: "52px", marginBottom: "14px" }}>🔔</p>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: s("text"),
              marginBottom: "8px",
            }}
          >
            No notifications
          </h3>
          <p style={{ color: s("muted") }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((n) => {
            const tc = TYPE_COLOR[n.type] || TYPE_COLOR.account;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  background: n.read ? s("surface") : `${tc.bg}`,
                  border: `1px solid ${n.read ? s("border") : tc.border}`,
                  borderRadius: "14px",
                  padding: "16px 18px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  position: "relative",
                }}
              >
                {!n.read && (
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: s("gold"),
                    }}
                  />
                )}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: tc.bg,
                    border: `1px solid ${tc.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  {n.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <p
                      style={{
                        color: s("text"),
                        fontWeight: n.read ? "500" : "700",
                        fontSize: "14px",
                      }}
                    >
                      {n.title}
                    </p>
                    <span
                      style={{
                        color: s("muted"),
                        fontSize: "11px",
                        flexShrink: 0,
                      }}
                    >
                      {n.time}
                    </span>
                  </div>
                  <p
                    style={{
                      color: s("muted"),
                      fontSize: "13px",
                      marginTop: "4px",
                      lineHeight: "1.5",
                    }}
                  >
                    {n.message}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotif(n.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: s("muted"),
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0 4px",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
