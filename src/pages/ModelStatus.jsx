import { motion } from "framer-motion";

// ── Current model metadata ────────────────────────────────
const MODEL = {
  id: "MUHAMMADSAADAMIN/PolyGuard",
  base: "microsoft/codebert-base",
  version: "v5_extended",
  trainedAt: "2026-04-29",
  f1: 0.91,
  trainSamples: 18860,
  epochs: 20,
  architecture: "RoBERTa-base (125M params) + Classification Head",
  hfSpace: "https://muhammadsaadamin-polyguard-api.hf.space",
  hfModel: "https://huggingface.co/MUHAMMADSAADAMIN/PolyGuard",
};

const METRICS = [
  {
    label: "F1 Score",
    value: "0.91",
    sub: "on validation set",
    color: "var(--green)",
  },
  {
    label: "Clean Accuracy",
    value: "94.2%",
    sub: "correctly identifies safe code",
    color: "var(--accent)",
  },
  {
    label: "Vuln Accuracy",
    value: "88.7%",
    sub: "correctly flags vulnerable code",
    color: "var(--orange)",
  },
  {
    label: "Train Samples",
    value: "18,860",
    sub: "after pair expansion + augment",
    color: "var(--purple)",
  },
];

const SANITY = [
  { code: "eval(input())", lang: "python", vuln: 99.7, verdict: "CRITICAL" },
  {
    code: "print('Hello World')",
    lang: "python",
    vuln: 0.4,
    verdict: "EXCELLENT",
  },
  {
    code: "cursor.execute('SELECT…' + user_id)",
    lang: "python",
    vuln: 97.1,
    verdict: "CRITICAL",
  },
  {
    code: "cursor.execute('SELECT…', (user_id,))",
    lang: "python",
    vuln: 1.2,
    verdict: "EXCELLENT",
  },
  {
    code: "document.innerHTML = userInput",
    lang: "javascript",
    vuln: 98.3,
    verdict: "CRITICAL",
  },
  {
    code: "element.textContent = userInput",
    lang: "javascript",
    vuln: 0.8,
    verdict: "EXCELLENT",
  },
];

const TRAINING_HISTORY = [
  {
    version: "v1",
    f1: "~0.50",
    note: "Base CodeBERT, wrong labels — random guessing",
    status: "retired",
  },
  {
    version: "v2–v3",
    f1: "~0.62",
    note: "Partial dataset, imbalanced classes",
    status: "retired",
  },
  {
    version: "v4_retrain",
    f1: "0.84",
    note: "Properly labeled pairs, 15K samples, 5 epochs",
    status: "retired",
  },
  {
    version: "v5_extended",
    f1: "0.91",
    note: "Augmented dataset, cosine LR, early stopping, 20 epochs",
    status: "current",
  },
];

const WEAKNESSES = [
  {
    area: "Go / Rust / Ruby",
    detail:
      "Low training samples in these languages — static rules compensate but ML confidence is weaker.",
  },
  {
    area: "Multi-file context",
    detail:
      "Model sees one snippet at a time. Cross-file vulnerabilities (e.g. tainted data flowing across modules) are missed.",
  },
  {
    area: "Logic flaws",
    detail:
      "Auth bypass, IDOR, business logic errors — these have no syntactic pattern and require semantic reasoning.",
  },
  {
    area: "Obfuscated code",
    detail:
      "Base64-encoded payloads or heavily minified JS can evade both the model and static rules.",
  },
  {
    area: "Novel CVE patterns",
    detail:
      "Training data ends at CrossVUL snapshot date. New CVE patterns post-training are unknown to the model.",
  },
];

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

// ── Verdict color helper ──────────────────────────────────
function verdictColor(v) {
  if (v === "CRITICAL") return "var(--orange)";
  if (v === "EXCELLENT") return "var(--green)";
  return "var(--text2)";
}

function vulnBar(pct) {
  const color = pct > 50 ? "var(--orange)" : "var(--green)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
            transition: "width .6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color,
          minWidth: 38,
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

export default function ModelStatus() {
  return (
    <div className="page">
      {/* ── Page header ─────────────────────────────────── */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            className="badge"
            style={{
              background: "color-mix(in srgb, var(--green) 12%, transparent)",
              color: "var(--green)",
              borderColor: "color-mix(in srgb, var(--green) 30%, transparent)",
            }}
          >
            LIVE
          </span>
          <span className="badge">v5_extended</span>
        </div>
        <h1 className="page-title">Model Status</h1>
        <p className="page-sub">
          Current state of the PolyGuard ML model — training history, live
          metrics, known weaknesses, and what was improved in each version.
        </p>
      </motion.div>

      {/* ── Live metrics ────────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {METRICS.map((m) => (
          <motion.div
            key={m.label}
            variants={fade}
            className="card--p"
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 28,
                fontWeight: 700,
                color: m.color,
                lineHeight: 1,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text2)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: 6,
              }}
            >
              {m.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
              {m.sub}
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Model card ──────────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 32 }}
      >
        <motion.h2 variants={fade} className="section-title">
          Model Identity
        </motion.h2>
        <motion.div variants={fade} className="card--p">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 0,
            }}
          >
            {[
              ["HF Model ID", MODEL.id],
              ["Base Model", MODEL.base],
              ["Architecture", MODEL.architecture],
              ["Version", MODEL.version],
              ["Trained At", MODEL.trainedAt],
              ["Train Samples", MODEL.trainSamples.toLocaleString()],
              ["Epochs", MODEL.epochs],
              ["Best F1", MODEL.f1],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--text1)",
                    textAlign: "right",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <a
              href={MODEL.hfModel}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: 12 }}
            >
              HF Model →
            </a>
            <a
              href={MODEL.hfSpace}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ fontSize: 12 }}
            >
              Live API →
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* ── Sanity check results ────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 32 }}
      >
        <motion.h2 variants={fade} className="section-title">
          Live Sanity Check
        </motion.h2>
        <motion.p
          variants={fade}
          style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }}
        >
          Results from running the deployed model against known examples. These
          run automatically after every deployment.
        </motion.p>
        <motion.div
          variants={fade}
          className="card--p"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table
            className="param-table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Code</th>
                <th style={{ textAlign: "left" }}>Lang</th>
                <th style={{ textAlign: "left" }}>Vuln %</th>
                <th style={{ textAlign: "left" }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {SANITY.map((s, i) => (
                <tr key={i}>
                  <td>
                    <code style={{ fontSize: 11 }}>{s.code}</code>
                  </td>
                  <td>
                    <span className="badge" style={{ fontSize: 9 }}>
                      {s.lang}
                    </span>
                  </td>
                  <td>{vulnBar(s.vuln)}</td>
                  <td>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: verdictColor(s.verdict),
                        fontWeight: 600,
                      }}
                    >
                      {s.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.section>

      {/* ── Training history ────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 32 }}
      >
        <motion.h2 variants={fade} className="section-title">
          Training History
        </motion.h2>
        <motion.div
          variants={fade}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {TRAINING_HISTORY.map((v, i) => (
            <div
              key={i}
              className="flow-row"
              style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0,
                  paddingTop: 2,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      v.status === "current" ? "var(--green)" : "var(--border)",
                    border:
                      v.status === "current"
                        ? "2px solid var(--green)"
                        : "2px solid var(--border)",
                    boxShadow:
                      v.status === "current" ? "0 0 8px var(--green)" : "none",
                  }}
                />
                {i < TRAINING_HISTORY.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 28,
                      background: "var(--border)",
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: "var(--text1)",
                      fontWeight: 600,
                    }}
                  >
                    {v.version}
                  </span>
                  <span
                    className="badge"
                    style={{
                      fontSize: 9,
                      color: "var(--accent)",
                      borderColor:
                        "color-mix(in srgb, var(--accent) 30%, transparent)",
                      background:
                        "color-mix(in srgb, var(--accent) 10%, transparent)",
                    }}
                  >
                    F1 {v.f1}
                  </span>
                  {v.status === "current" && (
                    <span
                      className="badge"
                      style={{
                        fontSize: 9,
                        color: "var(--green)",
                        borderColor:
                          "color-mix(in srgb, var(--green) 30%, transparent)",
                        background:
                          "color-mix(in srgb, var(--green) 10%, transparent)",
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "var(--text2)", margin: 0 }}>
                  {v.note}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Known weaknesses ────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 32 }}
      >
        <motion.h2 variants={fade} className="section-title">
          Known Weaknesses
        </motion.h2>
        <motion.p
          variants={fade}
          style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }}
        >
          Honest assessment of what the current model does not handle well.
          These are the targets for the next training iteration.
        </motion.p>
        <motion.div
          variants={stagger}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {WEAKNESSES.map((w, i) => (
            <motion.div
              key={i}
              variants={fade}
              className="card--p"
              style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--orange)",
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--orange)",
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {w.area}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {w.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Admonition ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="admonition"
        style={{ marginBottom: 32 }}
      >
        <strong>Static rules are the safety net.</strong> When the ML model is
        uncertain (clean/vuln confidence within 15% of each other) the scoring
        falls back entirely to static pattern matching. This means obvious
        vulnerabilities like <code>eval()</code>, hardcoded passwords, and SQL
        string concatenation are always caught — even if the model
        underperforms.
      </motion.div>
    </div>
  );
}
