import { useNavigate } from "react-router-dom";

const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    avatar: "👨‍💼",
    bio: "10+ years in e-commerce & luxury retail.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Design",
    avatar: "👩‍🎨",
    bio: "Passionate about crafting beautiful experiences.",
  },
  {
    name: "Rahul Kumar",
    role: "Lead Engineer",
    avatar: "👨‍💻",
    bio: "Building scalable systems for the future.",
  },
  {
    name: "Sneha Patel",
    role: "Customer Experience",
    avatar: "👩‍💼",
    bio: "Ensuring every customer feels valued.",
  },
];

const STATS = [
  { val: "50,000+", label: "Happy Customers", icon: "😊" },
  { val: "10,000+", label: "Products Listed", icon: "📦" },
  { val: "4.8★", label: "Average Rating", icon: "⭐" },
  { val: "98%", label: "On-time Delivery", icon: "🚚" },
];

const VALUES = [
  {
    icon: "💎",
    title: "Premium Quality",
    desc: "Every product is curated and quality-checked before listing.",
  },
  {
    icon: "🔒",
    title: "Secure Shopping",
    desc: "Bank-grade encryption protects every transaction.",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Express shipping across India with real-time tracking.",
  },
  {
    icon: "💝",
    title: "Customer First",
    desc: "24/7 support with a 7-day hassle-free return policy.",
  },
  {
    icon: "🌱",
    title: "Sustainable",
    desc: "Eco-friendly packaging and carbon-neutral shipping.",
  },
  {
    icon: "🤝",
    title: "Fair Pricing",
    desc: "Best prices guaranteed with our price match promise.",
  },
];

const About = () => {
  const navigate = useNavigate();
  const S = (k) => `var(--${k})`;

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,197,71,0.08), transparent 60%)",
          padding: "80px 24px 60px",
          textAlign: "center",
          borderBottom: `1px solid ${S("border")}`,
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: S("gold"),
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          EST. 2024
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(40px,7vw,80px)",
            fontWeight: "700",
            color: S("text"),
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          About <span style={{ color: S("gold") }}>Luxe</span> Store
        </h1>
        <p
          style={{
            color: S("muted"),
            fontSize: "18px",
            maxWidth: "560px",
            margin: "0 auto 36px",
            lineHeight: "1.8",
          }}
        >
          We're on a mission to bring premium, curated products to every home in
          India — at prices that make sense.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              background: S("gold"),
              color: "#0a0a0f",
              border: "none",
              padding: "14px 32px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Shop Now
          </button>
          <button
            onClick={() => navigate("/contact")}
            style={{
              background: "transparent",
              color: S("text"),
              border: `1px solid ${S("border")}`,
              padding: "14px 32px",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Contact Us
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "60px 24px 80px",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: "16px",
            marginBottom: "72px",
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: S("surface"),
                border: `1px solid ${S("border")}`,
                borderRadius: "16px",
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "32px", marginBottom: "10px" }}>{s.icon}</p>
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: S("gold"),
                  marginBottom: "6px",
                }}
              >
                {s.val}
              </p>
              <p style={{ color: S("muted"), fontSize: "13px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
            marginBottom: "72px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                color: S("gold"),
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Our Story
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "36px",
                color: S("text"),
                marginBottom: "18px",
                lineHeight: "1.2",
              }}
            >
              From a small idea to India's premium marketplace
            </h2>
            <p
              style={{
                color: S("muted"),
                fontSize: "15px",
                lineHeight: "1.9",
                marginBottom: "16px",
              }}
            >
              Luxe Store started in 2024 with a simple idea: everyone deserves
              access to premium products without the premium confusion. We
              hand-pick every item, verify every seller, and ensure quality at
              every step.
            </p>
            <p
              style={{ color: S("muted"), fontSize: "15px", lineHeight: "1.9" }}
            >
              Today, we serve over 50,000 happy customers across India, offering
              everything from electronics to fashion — all under one beautifully
              curated roof.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {[
              "2024\nFounded",
              "50K+\nCustomers",
              "10K+\nProducts",
              "4.8★\nRating",
            ].map((block) => {
              const [val, label] = block.split("\n");
              return (
                <div
                  key={label}
                  style={{
                    background: S("surface"),
                    border: `1px solid ${S("border")}`,
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: S("gold"),
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      color: S("muted"),
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: "72px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p
              style={{
                fontSize: "11px",
                color: S("gold"),
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              What We Stand For
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "32px",
                color: S("text"),
              }}
            >
              Our Core Values
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: "18px",
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.title}
                style={{
                  background: S("surface"),
                  border: `1px solid ${S("border")}`,
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(232,197,71,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = S("border"))
                }
              >
                <p style={{ fontSize: "28px", marginBottom: "12px" }}>
                  {v.icon}
                </p>
                <h3
                  style={{
                    color: S("text"),
                    fontWeight: "700",
                    fontSize: "16px",
                    marginBottom: "8px",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    color: S("muted"),
                    fontSize: "14px",
                    lineHeight: "1.7",
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: "72px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p
              style={{
                fontSize: "11px",
                color: S("gold"),
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              The People
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "32px",
                color: S("text"),
              }}
            >
              Meet Our Team
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  background: S("surface"),
                  border: `1px solid ${S("border")}`,
                  borderRadius: "18px",
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#e8c547,#c9a227)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    margin: "0 auto 14px",
                    boxShadow: "0 0 0 4px rgba(232,197,71,0.15)",
                  }}
                >
                  {member.avatar}
                </div>
                <h3
                  style={{
                    color: S("text"),
                    fontWeight: "700",
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    color: S("gold"),
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                  }}
                >
                  {member.role}
                </p>
                <p
                  style={{
                    color: S("muted"),
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(232,197,71,0.08), rgba(232,197,71,0.02))",
            border: "1px solid rgba(232,197,71,0.2)",
            borderRadius: "24px",
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "36px",
              color: S("text"),
              marginBottom: "12px",
            }}
          >
            Ready to Shop Premium?
          </h2>
          <p
            style={{
              color: S("muted"),
              fontSize: "16px",
              marginBottom: "28px",
            }}
          >
            Join 50,000+ customers who trust Luxe Store for quality products.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                background: S("gold"),
                color: "#0a0a0f",
                border: "none",
                padding: "14px 36px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate("/featured")}
              style={{
                background: "transparent",
                color: S("text"),
                border: `1px solid ${S("border")}`,
                padding: "14px 36px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              View Featured
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
