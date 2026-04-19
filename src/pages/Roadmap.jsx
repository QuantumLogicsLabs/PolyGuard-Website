import { CheckCircle, Circle, Clock, ArrowRight, Cpu, Database, Zap, Target, TrendingUp } from "lucide-react";

const done = [
  "Fine-tuned CodeBERT on CVE vulnerability dataset",
  "FastAPI server deployed to HF Spaces (free, 24/7)",
  "POST /analyze endpoint with score, risk, verdict, findings, tips",
  "Multi-language support in request body (python, js, java, c, php...)",
  "React frontend with live API integration",
];

const phases = [
  {
    phase: "Phase 1 — Better Training Data",
    goal: "Make the model understand more vulnerability types",
    color: "var(--accent)",
    items: [
      { title: "Collect more CVE samples", desc: "Download datasets from HuggingFace: code_search_net, bigvul, draper_vdisc. More labeled examples = better pattern recognition." },
      { title: "Add language-specific examples", desc: "Currently model sees all languages the same. Add separate labeling for Python, JS, Java patterns — SQL injection in PHP looks different from Python." },
      { title: "Add severity labels", desc: "Instead of just vulnerable/clean, label samples as critical/high/medium/low. This enables the model to output nuanced risk levels." },
    ]
  },
  {
    phase: "Phase 2 — Better Model Architecture",
    goal: "Improve the model so findings are more specific and actionable",
    color: "var(--accent2)",
    items: [
      { title: "Multi-label classification", desc: "Instead of one output (vuln/clean), output a vector: [sql_injection, xss, buffer_overflow, hardcoded_secret, ...]. Score each independently." },
      { title: "Span detection", desc: "Instead of flagging the whole file as vulnerable, highlight the exact vulnerable line(s). This requires token-level classification, not just CLS token." },
      { title: "Fine-tune on specific CWEs", desc: "Train separate heads for top 10 OWASP vulnerabilities. Each head is a binary classifier. Ensemble their outputs." },
    ]
  },
  {
    phase: "Phase 3 — Better Suggestions",
    goal: "Make suggestions feel like a senior code reviewer, not a linter",
    color: "var(--accent3)",
    items: [
      { title: "Connect to a generative model", desc: "After the classifier identifies a vulnerability, pass the flagged code snippet to a code LLM (CodeLlama, StarCoder) to generate a FIXED version of the code." },
      { title: "Rule-based augmentation", desc: "Pair ML findings with AST-based rules (using tree-sitter). Rules are 100% precise for known patterns, ML catches novel ones. Combine both." },
      { title: "Explanation generation", desc: "Generate natural language explanations: WHY this code is vulnerable, WHAT an attacker could do, and HOW to fix it with a code example." },
    ]
  },
  {
    phase: "Phase 4 — Production Hardening",
    goal: "Make it reliable enough for real teams to depend on",
    color: "#ff6b35",
    items: [
      { title: "Upgrade HF Spaces to GPU", desc: "The free tier uses CPU. Upgrade to GPU-backed Space so inference is <500ms instead of 3-5s. Costs ~$0.60/hour on HF." },
      { title: "Add caching layer", desc: "Hash the code input, cache results in Redis. 90% of scans are repeated (same code re-submitted). Instant response, no model needed." },
      { title: "Batch endpoint", desc: "Add POST /analyze/batch accepting up to 50 code snippets. Needed for CI/CD integration — scan entire repos on pull request." },
    ]
  },
];

const apiImprove = [
  {
    label: "Current response",
    code: `{
  "score": 4.4,
  "risk": "high",
  "verdict": "VULNERABLE",
  "findings": ["Use parameterized queries..."],
  "tips": ["Use list comprehensions..."]
}`,
    color: "var(--text3)"
  },
  {
    label: "Target response (Phase 2+3)",
    code: `{
  "score": 4.4,
  "risk": "high", 
  "verdict": "VULNERABLE",
  "vulnerabilities": [
    {
      "type": "SQL_INJECTION",
      "cwe": "CWE-89",
      "severity": "CRITICAL",
      "line": 7,
      "snippet": "query = \\"SELECT * FROM \\" + name",
      "explanation": "String concatenation in SQL allows attackers...",
      "fixed_code": "cursor.execute(\\"SELECT * FROM users WHERE name=?\\", [name])"
    }
  ],
  "quality_score": 6.2,
  "tips": [...]
}`,
    color: "var(--accent)"
  }
];

export default function Roadmap() {
  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: 8 }}>// MISSION & ROADMAP</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>How to Make PolyGuard Smarter</h2>
        <div style={{
          background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: "var(--radius2)", padding: "1.25rem 1.5rem",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Target size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>The Mission</p>
              <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.8 }}>
                Train the ML model such that it <strong style={{ color: "var(--accent)" }}>judges code and gives suggestions in the best way possible</strong> — 
                not just a binary vulnerable/clean verdict, but specific vulnerability types, exact line numbers, 
                explanations of WHY it's dangerous, and working fixed code examples. Think of it as a senior security 
                engineer reviewing every commit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What's done */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", letterSpacing: "0.15em", marginBottom: 12 }}>// ALREADY DONE</p>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius2)", padding: "1rem 1.25rem" }}>
          {done.map((d, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "center", padding: "8px 0",
              borderBottom: i < done.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <CheckCircle size={14} color="var(--accent)" />
              <span style={{ fontSize: 13, color: "var(--text2)" }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Before/After */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", letterSpacing: "0.15em", marginBottom: 12 }}>// API RESPONSE: NOW vs. TARGET</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {apiImprove.map(a => (
            <div key={a.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius2)", overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" }}>{a.label}</span>
              </div>
              <pre style={{ padding: "1rem 1.25rem", fontFamily: "var(--mono)", fontSize: 11, color: a.color === "var(--text3)" ? "var(--text2)" : "var(--accent)", lineHeight: 1.7, overflow: "auto" }}>
                {a.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", letterSpacing: "0.15em", marginBottom: 16 }}>// IMPROVEMENT ROADMAP</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {phases.map((phase, pi) => (
            <div key={pi} style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius2)", overflow: "hidden",
            }}>
              <div style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                background: `linear-gradient(90deg, ${phase.color}10 0%, transparent 60%)`,
                borderLeft: `3px solid ${phase.color}`,
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: phase.color }}>{phase.phase}</h3>
                <p style={{ fontSize: 12, color: "var(--text2)" }}>Goal: {phase.goal}</p>
              </div>
              <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
                {phase.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: 14 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: `${phase.color}15`, border: `1px solid ${phase.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                      fontFamily: "var(--mono)", fontSize: 10, color: phase.color,
                    }}>{ii + 1}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick wins */}
      <div style={{ marginTop: 24, padding: "1.5rem", background: "rgba(0,204,255,0.04)", border: "1px solid rgba(0,204,255,0.15)", borderRadius: "var(--radius2)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <TrendingUp size={18} color="var(--accent2)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: "var(--accent2)", marginBottom: 8 }}>Quickest Win Right Now</p>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8 }}>
              The fastest way to improve the model is to <strong style={{ color: "var(--text)" }}>add more labeled training data</strong>. 
              Open <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 3, fontFamily: "var(--mono)", fontSize: 11 }}>01_data_collection.ipynb</code> in Colab, 
              download the <strong style={{ color: "var(--text)" }}>bigvul</strong> or <strong style={{ color: "var(--text)" }}>draper_vdisc</strong> datasets from HuggingFace, 
              combine with your current data, and retrain. Even 2x the data typically improves accuracy by 5–15%. 
              No architecture changes needed — just more examples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
