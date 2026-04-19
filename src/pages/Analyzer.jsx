import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Zap,
  Loader,
  AlertTriangle,
  CheckCircle,
  Shield,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import SAMPLES from "../assets/CodingSamples";
import ResultBlock from "../components/ResultBlock";

const API_URL = "https://muhammadsaadamin-polyguard-api.hf.space/analyze";
const LANGS = ["python", "javascript", "java", "c", "cpp", "php", "ruby", "go"];

/* ── Score gauge (SVG ring) ── */
function ScoreGauge({ score }) {
  const pct = score / 10;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = pct * circ;
  const color =
    score >= 7 ? "var(--green)" : score >= 4 ? "var(--amber)" : "var(--red)";
  const label = score >= 7 ? "SECURE" : score >= 4 ? "MODERATE" : "CRITICAL";

  return (
    <div className="flex-col" style={{ alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <motion.circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${filled} ${circ}` }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div
          style={{ position: "absolute", inset: 0 }}
          className="flex-col"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            style={{
              opacity: 1,
              top: "42px",
              transform: "none",
              position: "absolute",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 30,
                fontWeight: 700,
                color,
                lineHeight: 1,
              }}
            >
              {score.toFixed(1)}
            </div>
            <div className="meta-text" style={{ textAlign: "center" }}>
              /10
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="badge"
        style={{
          color,
          background: `${color}14`,
          border: `1px solid ${color}32`,
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
        }}
      >
        {label}
      </motion.div>
    </div>
  );
}

/* ── Confidence bar ── */
function ConfBar({ label, value, color, delay = 0 }) {
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 6 }}>
        <span className="meta-text">{label}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color,
            fontWeight: 600,
          }}
        >
          {value?.toFixed(1)}%
        </motion.span>
      </div>
      <div
        style={{
          height: 5,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: "100%",
            background: color,
            borderRadius: 3,
            boxShadow: `0 0 10px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

export default function Analyzer() {
  const [code, setCode] = useState(SAMPLES.python);
  const [lang, setLang] = useState("python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const copyJson = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const riskColor = (r) =>
    !r
      ? "var(--text3)"
      : r === "high"
        ? "var(--red)"
        : r === "medium"
          ? "var(--amber)"
          : "var(--green)";

  const lines = code.split("\n");

  return (
    <div className="page page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div className="label-cyan page-header__eyebrow">// CODE ANALYZER</div>
        <h2 className="page-header__title">Security Scanner</h2>
        <p className="page-header__sub">
          Paste your code → PolyGuard's fine-tuned CodeBERT model scans for
          vulnerabilities → get a security score, confidence percentages,
          findings &amp; fix recommendations.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── Left: Editor ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Language tabs */}
          <div
            className="flex-center"
            style={{ gap: 6, marginBottom: 12, flexWrap: "wrap" }}
          >
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  if (SAMPLES[l]) setCode(SAMPLES[l]);
                }}
                className={`lang-tab ${lang === l ? "lang-tab--active" : "lang-tab--inactive"}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Code area */}
          <div className="card">
            {/* Editor header */}
            <div className="card-header">
              <div className="mac-dots">
                <span className="mac-dot mac-dot--red" />
                <span className="mac-dot mac-dot--amber" />
                <span className="mac-dot mac-dot--green" />
              </div>
              <div className="flex-center" style={{ gap: 18 }}>
                <span className="meta-text">{lang}</span>
                <span className="meta-text">{lines.length} lines</span>
                <span className="meta-text">{code.length} chars</span>
              </div>
            </div>

            {/* Line numbers + textarea */}
            <div style={{ display: "flex", minHeight: 400 }}>
              <div
                style={{
                  padding: "1rem 0",
                  minWidth: 46,
                  background: "rgba(0,0,0,0.18)",
                  borderRight: "1px solid rgba(255,255,255,0.04)",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                {lines.map((_, i) => (
                  <div
                    key={i}
                    className="meta-text"
                    style={{
                      lineHeight: "1.7",
                      padding: "0 10px",
                      textAlign: "right",
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const s = e.target.selectionStart;
                    setCode(
                      (c) =>
                        c.slice(0, s) + "  " + c.slice(e.target.selectionEnd),
                    );
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd = s + 2;
                    });
                  }
                }}
                style={{
                  flex: 1,
                  padding: "1rem",
                  background: "transparent",
                  border: "none",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--text)",
                  lineHeight: 1.7,
                  resize: "none",
                  outline: "none",
                  minHeight: 400,
                  caretColor: "var(--cyan)",
                }}
              />
            </div>
          </div>

          {/* Analyze button */}
          <div
            className="flex-center"
            style={{ gap: 14, marginTop: 14, flexWrap: "wrap" }}
          >
            <motion.button
              onClick={analyze}
              disabled={loading || !code.trim()}
              whileHover={
                !loading
                  ? { scale: 1.02, boxShadow: "0 0 32px rgba(0,229,255,0.28)" }
                  : {}
              }
              whileTap={!loading ? { scale: 0.97 } : {}}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader size={14} className="spin" /> SCANNING...
                </>
              ) : (
                <>
                  <Zap size={14} /> RUN ANALYSIS
                </>
              )}
            </motion.button>
            <span className="meta-text">
              → {API_URL.replace("https://", "")}
            </span>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="alert alert--error"
                style={{ marginTop: 12 }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Right: Results ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {/* Empty state */}
            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="state-box--border"
              >
                <div className="state-icon">
                  <Shield size={48} color="var(--cyan)" strokeWidth={1} />
                </div>
                <p className="state-title">Awaiting code submission</p>
                <p className="state-sub">
                  Select language → paste code → click Run Analysis
                </p>
              </motion.div>
            )}

            {/* Loading state */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="state-box--loading"
              >
                <div
                  className="scanbar"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, var(--cyan), transparent)",
                    boxShadow: "0 0 20px var(--cyan)",
                  }}
                />
                <Loader
                  size={32}
                  color="var(--cyan)"
                  className="spin"
                  style={{ marginBottom: 16 }}
                />
                <p
                  className="state-title"
                  style={{ color: "var(--cyan)", letterSpacing: "0.14em" }}
                >
                  SCANNING...
                </p>
                <p className="meta-text" style={{ marginTop: 10 }}>
                  Model analyzing vulnerability patterns
                </p>
              </motion.div>
            )}

            {/* Results */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Score + verdict card */}
                <div className="card--p mb-card">
                  <div
                    className="flex-between"
                    style={{
                      marginBottom: "1.25rem",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div className="label mb-label">VERDICT</div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 22,
                          fontWeight: 700,
                          color: riskColor(result.risk),
                          textShadow: `0 0 24px ${riskColor(result.risk)}55`,
                        }}
                      >
                        {result.verdict}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="badge"
                        style={{
                          marginTop: 8,
                          background: `${riskColor(result.risk)}14`,
                          border: `1px solid ${riskColor(result.risk)}32`,
                          color: riskColor(result.risk),
                        }}
                      >
                        {(result.risk || "unknown").toUpperCase()} RISK
                      </motion.div>
                    </div>
                    <ScoreGauge score={result.score || 0} />
                  </div>

                  {/* Confidence bars */}
                  <div className="flex-col--gap">
                    <ConfBar
                      label="CLEAN CONFIDENCE"
                      value={result.clean_confidence}
                      color="var(--green)"
                      delay={0.1}
                    />
                    <ConfBar
                      label="VULN CONFIDENCE"
                      value={result.vuln_confidence}
                      color="var(--red)"
                      delay={0.2}
                    />
                  </div>
                </div>

                {/* Findings */}
                {result.findings?.length > 0 && (
                  <ResultBlock
                    title="VULNERABILITY FINDINGS"
                    icon={<AlertTriangle size={12} />}
                    accentColor="var(--red)"
                    items={result.findings}
                    bg="rgba(255,51,85,0.06)"
                    border="rgba(255,51,85,0.15)"
                    prefix="⚠"
                    textColor="rgba(255,160,170,0.92)"
                  />
                )}

                {/* Tips */}
                {result.tips?.length > 0 && (
                  <ResultBlock
                    title="IMPROVEMENT TIPS"
                    icon={<CheckCircle size={12} />}
                    accentColor="var(--cyan)"
                    items={result.tips}
                    bg="rgba(0,229,255,0.04)"
                    border="rgba(0,229,255,0.12)"
                    prefix="→"
                    textColor="rgba(160,225,240,0.92)"
                  />
                )}

                {/* Raw JSON toggle */}
                <div className="card--r2">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      onClick={() => setShowRaw((v) => !v)}
                      style={{
                        width: "100%",
                        maxWidth: "420px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {/* LEFT */}
                      <span
                        style={{
                          letterSpacing: "0.14em",
                          fontSize: "11px",
                          color: "var(--text3)",
                          fontWeight: 600,
                        }}
                      >
                        RAW JSON
                      </span>

                      {/* RIGHT */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyJson();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: copied ? "var(--green)" : "var(--text3)",
                            fontWeight: 600,
                          }}
                        >
                          {copied ? <Check size={10} /> : <Copy size={10} />}
                          {copied ? "COPIED" : "COPY"}
                        </button>

                        <motion.div
                          animate={{ rotate: showRaw ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showRaw && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <pre
                          style={{
                            padding: "0 14px 14px",
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            color: "var(--text2)",
                            overflow: "auto",
                            maxHeight: 220,
                            lineHeight: 1.7,
                          }}
                        >
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
