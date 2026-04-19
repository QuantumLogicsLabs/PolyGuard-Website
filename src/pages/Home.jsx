import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  Brain,
  Code2,
  ChevronRight,
  Terminal,
  BookOpen,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Lock,
  Cpu,
} from "lucide-react";

/* ────────────────────────────────── Data ─────────────────────────────────── */
const LINKS = [
  {
    label: "GitHub Repo",
    sub: "QuantumLogicsLabs/PolyGuard",
    dot: "var(--text3)",
    url: "https://github.com/QuantumLogicsLabs/PolyGuard",
  },
  {
    label: "HF Model",
    sub: "MUHAMMADSAADAMIN/polyguard-model",
    dot: "var(--purple)",
    url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model",
  },
  {
    label: "HF Spaces API",
    sub: "polyguard-api · LIVE",
    dot: "var(--orange)",
    url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api",
  },
  {
    label: "Google Drive",
    sub: "Dataset & Model Weights",
    dot: "var(--green)",
    url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV",
  },
];

const FEATURES = [
  {
    icon: Shield,
    color: "var(--accent)",
    title: "Vulnerability Detection",
    desc: "SQL injection, XSS, buffer overflows, hardcoded secrets — 50+ patterns across 8 languages, each mapped to a real CVE class.",
  },
  {
    icon: Brain,
    color: "var(--green)",
    title: "ML Confidence Scores",
    desc: "Fine-tuned CodeBERT outputs separate clean/vuln confidence percentages — not a binary verdict. You see exactly how certain the model is.",
  },
  {
    icon: Zap,
    color: "var(--amber)",
    title: "Sub-500ms Analysis",
    desc: "Results in milliseconds via a 24/7 HuggingFace Spaces endpoint. No signup, no API key, no rate limits. Paste and scan.",
  },
  {
    icon: Code2,
    color: "var(--purple)",
    title: "8-Language Support",
    desc: "Python, JavaScript, Java, C, C++, PHP, Ruby, Go — each with language-aware vulnerability patterns tuned to its attack surface.",
  },
];

const STATS = [
  { val: 50, suf: "+", label: "VULNERABILITY PATTERNS" },
  { val: 8, suf: "", label: "LANGUAGES SUPPORTED" },
  { val: 99, suf: "%", label: "API UPTIME" },
  { val: 500, suf: "ms", label: "AVG RESPONSE TIME" },
];

/* Developer guide content */
const GUIDE_STEPS = [
  {
    n: "01",
    icon: Terminal,
    title: "Make a Request",
    desc: "Send a POST request to the /analyze endpoint with your code and language. No authentication required.",
    code: `curl -X POST \\
  https://muhammadsaadamin-polyguard-api.hf.space/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"code": "SELECT * FROM users WHERE name = \\'" + username + "\\'", "language": "python"}'`,
  },
  {
    n: "02",
    icon: CheckCircle,
    title: "Parse the Response",
    desc: "The API returns a structured JSON object with a security score, risk level, verdict, and actionable findings.",
    code: `{
  "score":    4.4,
  "risk":     "high",
  "verdict":  "VULNERABLE",
  "clean_confidence": 12.3,
  "vuln_confidence":  87.7,
  "findings": [
    "SQL injection via string concatenation"
  ],
  "tips": [
    "Use parameterized queries instead"
  ]
}`,
  },
  {
    n: "03",
    icon: GitBranch,
    title: "Integrate in CI/CD",
    desc: "Drop PolyGuard into your pipeline. Fail the build when score < threshold — ship with confidence.",
    code: `# .github/workflows/security.yml
- name: Run PolyGuard Scan
  run: |
    SCORE=$(curl -s -X POST $POLYGUARD_URL \\
      -H "Content-Type: application/json" \\
      -d "{\"code\": \\"$(cat src/app.py)\\", \"language\": \"python\"}" \\
      | jq '.score')
    if (( $(echo "$SCORE < 6" | bc -l) )); then
      echo "Security score $SCORE below threshold"; exit 1
    fi`,
  },
];

const API_PARAMS = [
  {
    name: "code",
    type: "string",
    required: true,
    desc: "The source code snippet to analyze. Any length is accepted.",
  },
  {
    name: "language",
    type: "string",
    required: true,
    desc: "Target language: python, javascript, java, c, cpp, php, ruby, go",
  },
];

const API_RESPONSE_FIELDS = [
  {
    name: "score",
    type: "float",
    desc: "Security score from 0–10. Higher is safer.",
  },
  { name: "risk", type: "string", desc: "Risk level: low, medium, or high." },
  { name: "verdict", type: "string", desc: "SECURE or VULNERABLE." },
  {
    name: "clean_confidence",
    type: "float",
    desc: "Model confidence (%) that code is clean.",
  },
  {
    name: "vuln_confidence",
    type: "float",
    desc: "Model confidence (%) that code is vulnerable.",
  },
  {
    name: "findings",
    type: "string[]",
    desc: "List of identified vulnerability descriptions.",
  },
  {
    name: "tips",
    type: "string[]",
    desc: "Actionable remediation suggestions.",
  },
];

const QUICK_LINKS = [
  {
    icon: BookOpen,
    label: "Analyzer",
    sub: "Interactive scanner",
    path: "/developers/docs/analyzer",
  },
  {
    icon: Cpu,
    label: "Architecture",
    sub: "System design & data flow",
    path: "/developers/docs/architecture",
  },
  {
    icon: GitBranch,
    label: "Roadmap",
    sub: "Upcoming model improvements",
    path: "/developers/docs/roadmap",
  },
  {
    icon: AlertTriangle,
    label: "Vulnerabilities",
    sub: "50+ detected patterns",
    path: "/developers/docs/analyzer",
  },
];

/* ─────────────────────────────── Components ──────────────────────────────── */

const WORDS = ["DETECT.", "PROTECT.", "ANALYZE.", "SECURE."];

function TypedText() {
  const [wi, setWi] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wi];
    let delay;
    if (!deleting && chars < word.length)
      delay = setTimeout(() => setChars((c) => c + 1), 65);
    else if (!deleting && chars === word.length)
      delay = setTimeout(() => setDeleting(true), 2000);
    else if (deleting && chars > 0)
      delay = setTimeout(() => setChars((c) => c - 1), 38);
    else
      delay = setTimeout(() => {
        setDeleting(false);
        setWi((w) => (w + 1) % WORDS.length);
      }, 400);
    return () => clearTimeout(delay);
  }, [chars, deleting, wi]);

  return (
    <span style={{ color: "var(--accent)" }}>
      {WORDS[wi].slice(0, chars)}
      {/* Improved cursor — CSS animated bar, not a character */}
      <span className="cursor-blink" />
    </span>
  );
}

function StatNum({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = to / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setVal(to);
        clearInterval(t);
      } else setVal(Math.floor(cur));
    }, 26);
    return () => clearInterval(t);
  }, [to]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

/* Subtle dot-grid background for hero */
function HeroGrid() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.04,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="0.8" fill="#4a9eff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ──────────────────────────────── Page ───────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const heroRef = useRef(null);

  const handleMouse = useCallback(
    (e) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      mouseX.set((e.clientX - r.left - r.width / 2) / 30);
      mouseY.set((e.clientY - r.top - r.height / 2) / 30);
    },
    [mouseX, mouseY],
  );

  const glowX = useTransform(springX, (v) => `${50 + v}%`);
  const glowY = useTransform(springY, (v) => `${40 + v}%`);

  return (
    <div className="page">
      {/* ════════════════ HERO ════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouse}
        style={{
          minHeight: "calc(100vh - var(--nav-h))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 2rem 4rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <HeroGrid />

        {/* Radial glow follows cursor */}
        <motion.div
          style={{
            position: "absolute",
            left: glowX,
            top: glowY,
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(74,158,255,0.07) 0%, transparent 65%)",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Corner brackets */}
        {[
          {
            top: 32,
            left: 32,
            borderTop: "1px solid",
            borderLeft: "1px solid",
          },
          {
            top: 32,
            right: 32,
            borderTop: "1px solid",
            borderRight: "1px solid",
          },
          {
            bottom: 32,
            left: 32,
            borderBottom: "1px solid",
            borderLeft: "1px solid",
          },
          {
            bottom: 32,
            right: 32,
            borderBottom: "1px solid",
            borderRight: "1px solid",
          },
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            style={{
              position: "absolute",
              width: 22,
              height: 22,
              borderColor: "rgba(74,158,255,0.3)",
              ...pos,
            }}
          />
        ))}

        <div style={{ position: "relative", maxWidth: 820, width: "100%" }}>
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ marginBottom: "2rem" }}
          >
            <span className="pill pill--accent">
              <span
                className="dot dot--sm"
                style={{ background: "var(--accent)" }}
              />
              ML-POWERED · CODEBERT · REAL-TIME ANALYSIS
              <span
                className="dot dot--sm"
                style={{ background: "var(--accent)" }}
              />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--display)",
              fontWeight: 800,
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              marginBottom: "1.75rem",
            }}
          >
            <span style={{ display: "block", color: "var(--text)" }}>
              SCAN.
            </span>
            <span style={{ display: "block" }}>
              <TypedText />
            </span>
            <span
              style={{
                display: "block",
                color: "var(--text2)",
                fontSize: "0.88em",
              }}
            >
              SHIP SAFE.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontSize: 16,
              color: "var(--text2)",
              lineHeight: 1.85,
              maxWidth: 560,
              margin: "0 auto 2.75rem",
              fontWeight: 300,
            }}
          >
            PolyGuard uses a fine-tuned CodeBERT model to detect SQL injection,
            XSS, buffer overflows, hardcoded secrets, and 50+ more vulnerability
            patterns — returning actionable security intelligence in
            milliseconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64, duration: 0.5 }}
            className="flex-center"
            style={{ gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              onClick={() => navigate("/developers/docs/analyzer")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary btn-primary--lg"
            >
              <Zap size={14} /> Open Analyzer <ArrowRight size={14} />
            </motion.button>
            <motion.button
              onClick={() => navigate("/developers/docs/architecture")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost"
            >
              How It Works <ChevronRight size={14} />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex-col" style={{ alignItems: "center", gap: 6 }}>
            <div
              className="float"
              style={{
                width: 1,
                height: 36,
                background:
                  "linear-gradient(to bottom, rgba(74,158,255,0.5), transparent)",
              }}
            />
            <span className="meta-text" style={{ letterSpacing: "0.2em" }}>
              SCROLL
            </span>
          </div>
        </motion.div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="stats-bar"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="stat-item"
          >
            <div className="stat-item__value">
              <StatNum to={s.val} suffix={s.suf} />
            </div>
            <div className="stat-item__label">{s.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* ════════════════ QUICK LINKS ════════════════ */}
      <section
        style={{
          padding: "4rem 2rem 0",
          maxWidth: "var(--content-w)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div className="label mb-label">// Documentation</div>
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Explore the Docs
          </h2>
        </motion.div>
        <div className="grid-4">
          {QUICK_LINKS.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => navigate(l.path)}
              className="doc-card"
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "var(--r2)",
                  background: "var(--accent-dim)",
                  border: "1px solid var(--accent-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <l.icon
                  size={16}
                  color="var(--accent-text)"
                  strokeWidth={1.5}
                />
              </div>
              <div className="doc-card__title">{l.label}</div>
              <div className="doc-card__desc">{l.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section
        style={{
          padding: "4rem 2rem",
          maxWidth: "var(--content-w)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div className="label mb-label">// CAPABILITIES</div>
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need to{" "}
            <span style={{ color: "var(--accent-text)" }}>
              ship secure code.
            </span>
          </h2>
        </motion.div>
        <div className="grid-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.5 }}
              className="feature-card"
            >
              <div
                className="feature-card__icon-wrap"
                style={{
                  background: `${f.color}14`,
                  border: `1px solid ${f.color}28`,
                }}
              >
                <f.icon size={20} color={f.color} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ DEVELOPER GUIDE ════════════════ */}
      <section
        style={{
          padding: "0 2rem 4rem",
          maxWidth: "var(--content-w)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div className="label mb-label">// DEVELOPER GUIDE</div>
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Integrate in 3 steps
          </h2>
          <p style={{ fontSize: 14, color: "var(--text2)", maxWidth: 540 }}>
            No SDK. No API key. No account. Just a single HTTP endpoint that
            accepts JSON and returns structured security intelligence.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {GUIDE_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: 0,
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r3)",
                overflow: "hidden",
              }}
            >
              {/* Left: description */}
              <div
                style={{
                  padding: "1.75rem",
                  borderRight: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "var(--r)",
                      background: "var(--accent-dim)",
                      border: "1px solid var(--accent-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <step.icon size={14} color="var(--accent-text)" />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      color: "var(--accent)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    STEP {step.n}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text2)",
                    lineHeight: 1.8,
                  }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Right: code */}
              <div style={{ background: "var(--bg1)", position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "var(--bg3)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9.5,
                      color: "var(--text3)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {i === 0 ? "SHELL" : i === 1 ? "JSON" : "YAML"}
                  </span>
                </div>
                <pre
                  style={{
                    padding: "1.25rem",
                    fontFamily: "var(--mono)",
                    fontSize: 11.5,
                    color: "var(--text2)",
                    lineHeight: 1.85,
                    overflow: "auto",
                    whiteSpace: "pre",
                    margin: 0,
                  }}
                >
                  {step.code}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ API REFERENCE ════════════════ */}
      <section
        style={{
          padding: "0 2rem 4rem",
          maxWidth: "var(--content-w)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "2rem" }}
        >
          <div className="label mb-label">// API REFERENCE</div>
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Endpoint Specification
          </h2>
        </motion.div>

        <div className="grid-2--gap-lg">
          {/* Request params */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Endpoint badge */}
            <div style={{ marginBottom: 18 }}>
              <div className="endpoint-chip">
                <span className="endpoint-chip__method">POST</span>
                <span className="endpoint-chip__value">
                  https://muhammadsaadamin-polyguard-api.hf.space/analyze
                </span>
              </div>
            </div>

            <div className="label mb-label">Request Body</div>
            <table className="param-table" style={{ marginBottom: 24 }}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {API_PARAMS.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>
                      <span className="type-badge">{p.type}</span>{" "}
                      {p.required && (
                        <span className="required-badge">required</span>
                      )}
                    </td>
                    <td>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="label mb-label">Response Fields</div>
            <table className="param-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {API_RESPONSE_FIELDS.map((f) => (
                  <tr key={f.name}>
                    <td>{f.name}</td>
                    <td>
                      <span className="type-badge">{f.type}</span>
                    </td>
                    <td>{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Right column: example response + links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {/* Example response */}
            <div className="code-pane" style={{ marginBottom: 20 }}>
              <div className="code-pane__header">
                <div className="mac-dots">
                  <span className="mac-dot mac-dot--red" />
                  <span className="mac-dot mac-dot--amber" />
                  <span className="mac-dot mac-dot--green" />
                </div>
                <span className="meta-text">POST /analyze → 200 OK</span>
              </div>
              <pre className="code-pane__body">
                <span style={{ color: "var(--text3)" }}>{"{"}</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>"score"</span>
                <span style={{ color: "var(--text3)" }}>: </span>
                <span style={{ color: "var(--amber)" }}>4.4</span>
                <span style={{ color: "var(--text3)" }}>,</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>"risk"</span>
                <span style={{ color: "var(--text3)" }}>: </span>
                <span style={{ color: "var(--red)" }}>"high"</span>
                <span style={{ color: "var(--text3)" }}>,</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>"verdict"</span>
                <span style={{ color: "var(--text3)" }}>: </span>
                <span style={{ color: "var(--red)" }}>"VULNERABLE"</span>
                <span style={{ color: "var(--text3)" }}>,</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>
                  "clean_confidence"
                </span>
                <span style={{ color: "var(--text3)" }}>: </span>
                <span style={{ color: "var(--amber)" }}>12.3</span>
                <span style={{ color: "var(--text3)" }}>,</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>
                  "vuln_confidence"
                </span>
                <span style={{ color: "var(--text3)" }}>: </span>
                <span style={{ color: "var(--amber)" }}>87.7</span>
                <span style={{ color: "var(--text3)" }}>,</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>"findings"</span>
                <span style={{ color: "var(--text3)" }}>: [</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--green)" }}>
                  "SQL injection via string concat"
                </span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> ],</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--purple)" }}>"tips"</span>
                <span style={{ color: "var(--text3)" }}>: [</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> </span>
                <span style={{ color: "var(--accent-text)" }}>
                  "Use parameterized queries"
                </span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}> ]</span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}>{"}"}</span>
              </pre>
            </div>

            {/* Note callout */}
            <div
              className="admonition admonition--note"
              style={{ marginBottom: 20 }}
            >
              <div>
                <div className="admonition__title">No Authentication</div>
                The PolyGuard API is completely open. No API key, no OAuth, no
                account required. Just POST and go. Hosted free on HuggingFace
                Spaces.
              </div>
            </div>

            {/* Project links */}
            <div className="label mb-label">Project Links</div>
            <div className="flex-col--gap">
              {LINKS.map((l, i) => (
                <motion.a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 3 }}
                  className="link-row"
                >
                  <div className="flex-center--gap">
                    <div
                      className="dot dot--md"
                      style={{ background: l.dot }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {l.label}
                      </div>
                      <div className="meta-text" style={{ marginTop: 2 }}>
                        {l.sub}
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={12} color="var(--text3)" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SUPPORTED LANGUAGES ════════════════ */}
      <section
        style={{
          padding: "0 2rem 5rem",
          maxWidth: "var(--content-w)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div className="label mb-label">// SUPPORTED LANGUAGES</div>
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Pass <code>language</code> as one of:
          </h2>
        </motion.div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { name: "python", ext: ".py", color: "var(--accent)" },
            { name: "javascript", ext: ".js", color: "var(--amber)" },
            { name: "java", ext: ".java", color: "var(--orange)" },
            { name: "c", ext: ".c", color: "var(--purple)" },
            { name: "cpp", ext: ".cpp", color: "var(--purple)" },
            { name: "php", ext: ".php", color: "var(--teal)" },
            { name: "ruby", ext: ".rb", color: "var(--red)" },
            { name: "go", ext: ".go", color: "var(--accent)" },
          ].map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r2)",
                padding: "10px 16px",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: lang.color,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--text)",
                }}
              >
                {lang.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--text3)",
                }}
              >
                {lang.ext}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="admonition admonition--tip" style={{ marginTop: 20 }}>
          <Lock
            size={15}
            color="var(--green)"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <div>
            <div className="admonition__title">
              Tip — language-aware patterns
            </div>
            Always pass the correct language. PolyGuard uses language-specific
            vulnerability patterns — SQL injection in PHP looks syntactically
            different than in Python. An incorrect language tag reduces
            detection accuracy.
          </div>
        </div>
      </section>
    </div>
  );
}
