import { Shield, Zap, Brain, Code2, ArrowRight, ExternalLink } from "lucide-react";

const links = [
  { label: "GitHub", url: "https://github.com/QuantumLogicsLabs/PolyGuard", color: "#F1EFE8", tc: "#444441" },
  { label: "HF Model", url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model", color: "#EEEDFE", tc: "#3C3489" },
  { label: "HF Space / API", url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api", color: "#FAECE7", tc: "#712B13" },
  { label: "Google Drive", url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV", color: "#EAF3DE", tc: "#27500A" },
];

const features = [
  { icon: Shield, title: "Vulnerability Detection", desc: "Identifies SQL injection, XSS, buffer overflows, and 50+ other vulnerability patterns across multiple languages." },
  { icon: Brain, title: "ML-Powered Analysis", desc: "Fine-tuned CodeBERT model trained on real CVE datasets. Outputs confidence scores, not just yes/no verdicts." },
  { icon: Zap, title: "Instant Suggestions", desc: "Actionable security findings and code quality tips returned in milliseconds via our live HF Spaces API." },
  { icon: Code2, title: "Multi-Language", desc: "Python, JavaScript, Java, C/C++, PHP and more. The model understands language-specific vulnerability patterns." },
];

export default function Home({ setPage }) {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      {/* Hero */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "4rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }} />
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 800 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 100, padding: "6px 16px", marginBottom: "2rem",
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse-border 2s infinite" }} />
            API LIVE · muhammadsaadamin-polyguard-api.hf.space
          </div>

          <h1 style={{
            fontFamily: "var(--sans)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800,
            lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "1.5rem",
          }}>
            <span style={{ color: "var(--text)" }}>CODE</span><br />
            <span style={{ color: "var(--accent)" }} className="glow">SECURITY</span><br />
            <span style={{ color: "var(--text)" }}>INTELLIGENCE</span>
          </h1>

          <p style={{
            fontSize: 17, color: "var(--text2)", lineHeight: 1.7,
            maxWidth: 560, margin: "0 auto 2.5rem",
          }}>
            PolyGuard is an ML-powered code vulnerability scanner. Paste your code, get a security score, 
            specific vulnerability findings, and actionable improvement tips — instantly.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("analyzer")} style={{
              background: "var(--accent)", color: "#000", border: "none",
              padding: "14px 28px", borderRadius: "var(--radius)",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              ANALYZE CODE <ArrowRight size={14} />
            </button>
            <button onClick={() => setPage("architecture")} style={{
              background: "transparent", color: "var(--text)", border: "1px solid var(--border2)",
              padding: "14px 28px", borderRadius: "var(--radius)",
              fontSize: 13, letterSpacing: "0.08em",
              transition: "all 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
            >
              VIEW ARCHITECTURE
            </button>
          </div>
        </div>

        {/* API URL strip */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)",
          letterSpacing: "0.05em",
        }}>
          POST → https://muhammadsaadamin-polyguard-api.hf.space/analyze
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "4rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: "1rem" }}>// CAPABILITIES</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius2)", padding: "1.5rem",
              transition: "border-color 0.2s",
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = "rgba(0,255,136,0.25)"}
              onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "var(--radius)",
                background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem",
              }}>
                <Icon size={18} color="var(--accent)" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Response Preview */}
      <section style={{ padding: "2rem 2rem 4rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          <div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: "1rem" }}>// API RESPONSE SCHEMA</p>
            <pre style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius2)", padding: "1.5rem",
              fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)",
              lineHeight: 1.8, overflow: "auto",
            }}>{`{
  "score": 4.4,          // 0–10 security score
  "risk": "high",        // low / medium / high
  "verdict": "VULNERABLE",
  "clean_confidence": 44.3,
  "vuln_confidence": 55.7,
  "findings": [
    "Use parameterized queries instead
     of building SQL strings manually."
  ],
  "tips": [
    "Use list comprehensions instead
     of for loops where possible.",
    "Use f-strings for formatting."
  ]
}`}</pre>
          </div>
          <div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: "1rem" }}>// PROJECT LINKS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--bg2)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "12px 16px",
                  textDecoration: "none", color: "var(--text)",
                  transition: "border-color 0.2s",
                  fontFamily: "var(--mono)", fontSize: 13,
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "var(--border2)"}
                  onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                    {l.label}
                  </span>
                  <ExternalLink size={13} color="var(--text3)" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
