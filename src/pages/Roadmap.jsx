import { motion } from "framer-motion";
import { CheckCircle, Target, TrendingUp, ArrowRight } from "lucide-react";

const DONE = [
  "Fine-tuned CodeBERT on CVE vulnerability dataset",
  "FastAPI server deployed to HF Spaces (free, 24/7, permanent URL)",
  "POST /analyze endpoint — score, risk, verdict, confidence, findings, tips",
  "Multi-language support: Python, JS, Java, C, C++, PHP, Ruby, Go",
  "React frontend with live API integration and real-time scoring",
];

const PHASES = [
  {
    n: "01", title: "Better Training Data", color: "var(--cyan)",
    goal: "Make the model see more vulnerability types across more languages",
    items: [
      { t: "More CVE Samples", d: "Download bigvul and draper_vdisc from HuggingFace. 10x more labeled examples directly improves accuracy with zero architecture changes." },
      { t: "Language-Specific Labels", d: "SQL injection in PHP looks different from Python. Add language-tagged samples so the model learns syntax-aware patterns." },
      { t: "Severity Labels", d: "Replace binary vuln/clean with critical/high/medium/low. Requires re-labeling but unlocks much richer API output." },
    ]
  },
  {
    n: "02", title: "Better Model Architecture", color: "var(--green)",
    goal: "Output specific vulnerability types, not just a single binary verdict",
    items: [
      { t: "Multi-Label Classification", d: "Add one output head per vulnerability type: [sql_injection, xss, buffer_overflow, ...]. Score each independently instead of a single score." },
      { t: "Token-Level Span Detection", d: "Instead of flagging the whole file, highlight the exact vulnerable lines. Requires switching from CLS-token to token-level classification." },
      { t: "CWE Mapping", d: "Map each detection to its official CWE identifier (CWE-89 for SQL injection, CWE-79 for XSS). Adds credibility and interoperability with security tools." },
    ]
  },
  {
    n: "03", title: "Better Suggestions", color: "var(--amber)",
    goal: "Generate fixed code automatically — not just warnings",
    items: [
      { t: "Generative Fix Output", d: "After the classifier flags a snippet, pass it to CodeLlama or StarCoder to generate a corrected version. Return both original + fixed code in the API." },
      { t: "AST-Based Rule Augmentation", d: "Pair ML detections with tree-sitter rules. Rules are 100% precise for known patterns; ML catches novel ones. Combine both for best results." },
      { t: "Explanation Generation", d: "Generate natural language: WHY this is vulnerable, WHAT an attacker could do, HOW to fix it with example. Transforms a score into a tutorial." },
    ]
  },
  {
    n: "04", title: "Production Hardening", color: "#f97316",
    goal: "Make it fast and reliable enough for real CI/CD pipelines",
    items: [
      { t: "GPU-Backed Inference", d: "Upgrade HF Space to GPU tier. Brings inference from 3–5s (CPU) down to <500ms. Costs ~$0.60/hr on HF — worth it for production use." },
      { t: "Response Caching", d: "Hash the code input, cache results in Redis for 24h. 90% of submissions are re-scans of the same code. Instant response, no model needed." },
      { t: "Batch Endpoint", d: "Add POST /analyze/batch accepting up to 50 snippets. Required for CI/CD integration — scan an entire repo on every pull request." },
    ]
  },
];

const API_NOW = `{
  "score": 4.4,
  "risk": "high",
  "verdict": "VULNERABLE",
  "findings": [
    "Use parameterized queries."
  ],
  "tips": [
    "Use f-strings for formatting."
  ]
}`;

const API_TARGET = `{
  "score": 4.4,
  "risk": "high",
  "vulnerabilities": [
    {
      "type": "SQL_INJECTION",
      "cwe": "CWE-89",
      "severity": "CRITICAL",
      "line": 7,
      "snippet": "query = 'SELECT...' + name",
      "explanation": "Allows arbitrary SQL execution...",
      "fixed_code": "cursor.execute('SELECT...', [name])"
    }
  ],
  "quality_score": 6.2,
  "tips": [...]
}`;

export default function Roadmap() {
  return (
    <div className="page" style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2.5rem" }}>
        <div className="label" style={{ marginBottom: 8 }}>// MISSION & ROADMAP</div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Making PolyGuard Smarter
        </h2>

        {/* Mission card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(0,255,157,0.03) 100%)",
          border: "1px solid rgba(0,229,255,0.2)", borderRadius: "var(--r3)", padding: "1.5rem",
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Target size={22} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--cyan)" }}>The Mission</p>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.85, fontWeight: 300 }}>
                Train the ML model so it <strong style={{ color: "var(--text)" }}>judges code and gives suggestions in the best way possible</strong> — 
                not a binary verdict, but specific vulnerability types, exact line numbers, explanations of WHY the code 
                is dangerous, and working fixed code examples. The goal is a senior security engineer reviewing every commit, automatically.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Done */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 28 }}>
        <div className="label" style={{ marginBottom: 12 }}>// COMPLETED</div>
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "var(--r3)", overflow: "hidden" }}>
          {DONE.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{
                display: "flex", gap: 12, alignItems: "center", padding: "12px 20px",
                borderBottom: i < DONE.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <CheckCircle size={14} color="var(--green)" />
              <span style={{ fontSize: 13, color: "var(--text2)" }}>{d}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* API Comparison */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 28 }}>
        <div className="label" style={{ marginBottom: 12 }}>// API: NOW vs TARGET</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Current Response", code: API_NOW, accent: "var(--text3)", dot: "#555" },
            { label: "Target Response (Phase 2+)", code: API_TARGET, accent: "var(--cyan)", dot: "var(--cyan)" },
          ].map((col, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "var(--r3)", overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", background: "var(--bg3)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot, boxShadow: `0 0 6px ${col.dot}` }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em" }}>{col.label}</span>
              </div>
              <pre style={{ padding: "1.25rem", fontFamily: "var(--mono)", fontSize: 11, color: col.accent === "var(--text3)" ? "var(--text2)" : "var(--cyan)", lineHeight: 1.85, overflow: "auto" }}>
                {col.code}
              </pre>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Phases */}
      <div className="label" style={{ marginBottom: 14 }}>// IMPROVEMENT ROADMAP</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {PHASES.map((p, pi) => (
          <motion.div
            key={pi}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: pi * 0.08 }}
            style={{
              background: "var(--bg2)", border: `1px solid rgba(255,255,255,0.07)`,
              borderRadius: "var(--r3)", overflow: "hidden",
              borderTop: `2px solid ${p.color}`,
            }}
          >
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", items: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: p.color, opacity: 0.7, letterSpacing: "0.1em" }}>PHASE {p.n}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: p.color, marginBottom: 6 }}>{p.title}</h3>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>{p.goal}</p>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
              {p.items.map((item, ii) => (
                <div key={ii} style={{ display: "flex", gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    background: `${p.color}12`, border: `1px solid ${p.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--mono)", fontSize: 9, color: p.color,
                  }}>{ii + 1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{item.t}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick win callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{
          marginTop: 20, padding: "1.5rem",
          background: "rgba(0,255,157,0.04)", border: "1px solid rgba(0,255,157,0.18)",
          borderRadius: "var(--r3)", display: "flex", gap: 14,
        }}
      >
        <TrendingUp size={20} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: "var(--green)", marginBottom: 8 }}>Quickest Win Right Now</p>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, fontWeight: 300 }}>
            The fastest path to a smarter model is more labeled training data — no architecture changes needed.
            Open <code style={{ fontFamily: "var(--mono)", fontSize: 11, background: "rgba(0,255,157,0.1)", padding: "1px 6px", borderRadius: 3, color: "var(--green)" }}>01_data_collection.ipynb</code>,
            download <strong style={{ color: "var(--text)" }}>bigvul</strong> or <strong style={{ color: "var(--text)" }}>draper_vdisc</strong> from HuggingFace,
            combine with your current data, and retrain. Even 2× the data typically improves accuracy by 5–15%.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
