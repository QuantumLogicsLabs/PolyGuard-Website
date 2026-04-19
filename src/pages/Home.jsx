import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Shield, Zap, Brain, Code2, ChevronRight } from "lucide-react";

const LINKS = [
  { label: "GitHub Repo", sub: "QuantumLogicsLabs/PolyGuard", url: "https://github.com/QuantumLogicsLabs/PolyGuard", dot: "#aaa" },
  { label: "HF Model", sub: "MUHAMMADSAADAMIN/polyguard-model", url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model", dot: "#a78bfa" },
  { label: "HF Spaces API", sub: "polyguard-api · LIVE", url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api", dot: "#f97316" },
  { label: "Google Drive", sub: "Dataset & Model Weights", url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV", dot: "#4ade80" },
];

const FEATURES = [
  { icon: Shield, title: "Vulnerability Detection", desc: "SQL injection, XSS, buffer overflows, hardcoded secrets — 50+ patterns detected across languages.", color: "var(--cyan)" },
  { icon: Brain, title: "ML-Powered Scoring", desc: "Fine-tuned CodeBERT outputs confidence percentages, not just yes/no — nuanced risk assessment.", color: "var(--green)" },
  { icon: Zap, title: "Instant Analysis", desc: "Results in milliseconds via our 24/7 HF Spaces endpoint. No signup, no limits.", color: "var(--amber)" },
  { icon: Code2, title: "Multi-Language", desc: "Python, JavaScript, Java, C, C++, PHP, Ruby, Go — language-aware vulnerability patterns.", color: "#a78bfa" },
];

// Animated hex grid background
function HexGrid() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="15,2 45,2 58,26 45,50 15,50 2,26" fill="none" stroke="#00e5ff" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

// Animated typing text
function TypedText({ words }) {
  const [wi, setWi] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wi];
    if (!deleting && chars < word.length) {
      const t = setTimeout(() => setChars(c => c + 1), 60);
      return () => clearTimeout(t);
    }
    if (!deleting && chars === word.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && chars > 0) {
      const t = setTimeout(() => setChars(c => c - 1), 35);
      return () => clearTimeout(t);
    }
    if (deleting && chars === 0) {
      setDeleting(false);
      setWi(i => (i + 1) % words.length);
    }
  }, [chars, deleting, wi, words]);

  return (
    <span style={{ color: "var(--cyan)" }}>
      {words[wi].slice(0, chars)}
      <span style={{ animation: "blink 1s step-end infinite", color: "var(--cyan)", opacity: 0.8 }}>▋</span>
    </span>
  );
}

// Stat counter
function StatNum({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

export default function Home({ setPage }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const heroRef = useRef(null);
  const handleMouse = (e) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left - r.width / 2) / 30);
    mouseY.set((e.clientY - r.top - r.height / 2) / 30);
  };

  const glowX = useTransform(springX, v => `${50 + v}%`);
  const glowY = useTransform(springY, v => `${40 + v}%`);

  return (
    <div className="page">
      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleMouse}
        style={{
          minHeight: "calc(100vh - 68px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "4rem 2rem", position: "relative", overflow: "hidden",
        }}
      >
        <HexGrid />

        {/* Mouse-following glow */}
        <motion.div style={{
          position: "absolute",
          left: glowX, top: glowY,
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 60%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }} />

        {/* Vertical line decorations */}
        <div style={{ position: "absolute", left: "8%", top: "20%", bottom: "20%", width: 1, background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.15), transparent)" }} />
        <div style={{ position: "absolute", right: "8%", top: "20%", bottom: "20%", width: 1, background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.15), transparent)" }} />

        {/* Corner brackets */}
        {[["top:24px","left:24px","border-top","border-left"],["top:24px","right:24px","border-top","border-right"],
          ["bottom:24px","left:24px","border-bottom","border-left"],["bottom:24px","right:24px","border-bottom","border-right"]].map((pos, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.5 }} style={{
            position: "absolute",
            [pos[0].split(":")[0]]: pos[0].split(":")[1],
            [pos[1].split(":")[0]]: pos[1].split(":")[1],
            width: 24, height: 24,
            [pos[2]]: "1px solid rgba(0,229,255,0.3)",
            [pos[3]]: "1px solid rgba(0,229,255,0.3)",
          }} />
        ))}

        <div style={{ position: "relative", textAlign: "center", maxWidth: 900 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(0,229,255,0.06)",
              border: "1px solid rgba(0,229,255,0.2)",
              borderRadius: 100, padding: "6px 18px", marginBottom: "2.5rem",
              fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--cyan)", letterSpacing: "0.14em",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", flexShrink: 0 }} />
            ML-POWERED · CODEBERT · REAL-TIME ANALYSIS
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", flexShrink: 0 }} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--sans)", fontWeight: 900,
              fontSize: "clamp(3.2rem, 9vw, 7rem)", lineHeight: 0.9,
              letterSpacing: "-0.04em", marginBottom: "1.5rem",
            }}
          >
            <span style={{ display: "block", color: "var(--text)" }}>SCAN.</span>
            <span style={{ display: "block" }}>
              <TypedText words={["DETECT.", "PROTECT.", "ANALYZE.", "SECURE."]} />
            </span>
            <span style={{ display: "block", color: "var(--text2)" }}>SHIP SAFE.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontSize: 17, color: "var(--text2)", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 3rem", fontWeight: 300 }}
          >
            PolyGuard uses a fine-tuned CodeBERT model to detect vulnerabilities in your code — SQL injection, XSS, buffer overflows and more — and returns actionable security findings instantly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              onClick={() => setPage("analyzer")}
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,229,255,0.3)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--cyan)", color: "#000",
                border: "none", padding: "14px 32px",
                borderRadius: "var(--r)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(0,229,255,0.2)",
              }}
            >
              <Zap size={14} /> ANALYZE CODE <ArrowRight size={14} />
            </motion.button>
            <motion.button
              onClick={() => setPage("architecture")}
              whileHover={{ scale: 1.03, borderColor: "rgba(0,229,255,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent", color: "var(--text)",
                border: "1px solid rgba(255,255,255,0.12)", padding: "14px 32px",
                borderRadius: "var(--r)", fontSize: 12, letterSpacing: "0.1em",
                cursor: "pointer", transition: "border-color 0.2s",
              }}
            >
              HOW IT WORKS <ChevronRight size={14} />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          >
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,229,255,0.5), transparent)" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.2em" }}>SCROLL</span>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <motion.section
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{
          borderTop: "1px solid rgba(0,229,255,0.08)",
          borderBottom: "1px solid rgba(0,229,255,0.08)",
          background: "rgba(0,229,255,0.02)",
          padding: "1.5rem 2rem",
          display: "flex", justifyContent: "center",
          gap: "clamp(2rem, 6vw, 6rem)",
          flexWrap: "wrap",
        }}
      >
        {[
          { val: 50, suf: "+", label: "Vulnerability Patterns" },
          { val: 8, suf: "", label: "Languages Supported" },
          { val: 99, suf: "%", label: "API Uptime" },
          { val: 500, suf: "ms", label: "Avg Response Time" },
        ].map((s, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "var(--cyan)", lineHeight: 1 }}>
              <StatNum to={s.val} suffix={s.suf} />
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.12em", marginTop: 6 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* FEATURES */}
      <section style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="label" style={{ marginBottom: 12 }}>// CAPABILITIES</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "3rem" }}>
            Everything you need to<br /><span style={{ color: "var(--cyan)" }}>ship secure code.</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}25` }}
              style={{
                background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "var(--r3)", padding: "1.75rem",
                transition: "box-shadow 0.3s",
                cursor: "default",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "var(--r2)",
                background: `${f.color}12`, border: `1px solid ${f.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <f.icon size={20} color={f.color} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* API PREVIEW + LINKS */}
      <section style={{ padding: "0 2rem 5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Terminal preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ background: "var(--bg1)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "var(--r3)", overflow: "hidden" }}
          >
            <div style={{
              padding: "12px 16px", background: "var(--bg2)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", marginLeft: 8 }}>API Response</span>
            </div>
            <pre style={{ padding: "1.5rem", fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.9, overflow: "auto" }}>
<span style={{ color: "var(--text3)" }}>{"{"}</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"score"</span><span style={{ color: "var(--text3)" }}>: </span><span style={{ color: "var(--amber)" }}>4.4</span><span style={{ color: "var(--text3)" }}>,</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"risk"</span><span style={{ color: "var(--text3)" }}>: </span><span style={{ color: "var(--red)" }}>"high"</span><span style={{ color: "var(--text3)" }}>,</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"verdict"</span><span style={{ color: "var(--text3)" }}>: </span><span style={{ color: "var(--red)" }}>"VULNERABLE"</span><span style={{ color: "var(--text3)" }}>,</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"clean_confidence"</span><span style={{ color: "var(--text3)" }}>: </span><span style={{ color: "var(--amber)" }}>44.3</span><span style={{ color: "var(--text3)" }}>,</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"vuln_confidence"</span><span style={{ color: "var(--text3)" }}>: </span><span style={{ color: "var(--red)" }}>55.7</span><span style={{ color: "var(--text3)" }}>,</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"findings"</span><span style={{ color: "var(--text3)" }}>: [</span>{"\n"}
<span style={{ color: "var(--text3)" }}>    </span><span style={{ color: "var(--green)" }}>"Use parameterized queries..."</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  ],</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  </span><span style={{ color: "#a78bfa" }}>"tips"</span><span style={{ color: "var(--text3)" }}>: [</span>{"\n"}
<span style={{ color: "var(--text3)" }}>    </span><span style={{ color: "var(--cyan)" }}>"Use f-strings for formatting."</span>{"\n"}
<span style={{ color: "var(--text3)" }}>  ]</span>{"\n"}
<span style={{ color: "var(--text3)" }}>{"}"}</span>
            </pre>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="label" style={{ marginBottom: 16 }}>// PROJECT LINKS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LINKS.map((l, i) => (
                <motion.a
                  key={i} href={l.url} target="_blank" rel="noreferrer"
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "var(--r2)", padding: "14px 18px",
                    textDecoration: "none", color: "var(--text)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"; e.currentTarget.style.background = "var(--bg3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "var(--bg2)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.dot, boxShadow: `0 0 8px ${l.dot}60`, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600 }}>{l.label}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{l.sub}</div>
                    </div>
                  </div>
                  <ExternalLink size={13} color="var(--text3)" />
                </motion.a>
              ))}
            </div>

            {/* API URL chip */}
            <div style={{
              marginTop: 16, padding: "12px 16px",
              background: "rgba(0,229,255,0.04)",
              border: "1px solid rgba(0,229,255,0.14)",
              borderRadius: "var(--r2)",
            }}>
              <div className="label" style={{ marginBottom: 6 }}>ENDPOINT</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", wordBreak: "break-all" }}>
                POST https://muhammadsaadamin-polyguard-api.hf.space/analyze
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
