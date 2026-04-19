import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Loader, AlertTriangle, CheckCircle, Shield, Copy, Check, ChevronDown } from "lucide-react";

const API_URL = "https://muhammadsaadamin-polyguard-api.hf.space/analyze";
const LANGS = ["python", "javascript", "java", "c", "cpp", "php", "ruby", "go"];

const SAMPLES = {
  python: `import sqlite3

def get_user(username):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # ⚠ SQL Injection vulnerability
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()

def process_file(filename):
    f = open(filename, "r")
    data = f.read()
    f.close()
    return data

def format_greeting(name):
    return "Hello, %s!" % name`,
  javascript: `const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  const id = req.query.id;
  // ⚠ XSS vulnerability
  const html = '<h1>Welcome ' + id + '</h1>';
  res.send(html);
});

app.post('/login', (req, res) => {
  const { pass } = req.body;
  // ⚠ Hardcoded secret
  if (pass === "admin123") res.json({ token: "secret" });
});`,
  java: `import java.sql.*;

public class UserDAO {
    // ⚠ Hardcoded credentials
    private static final String DB_PASS = "root123";

    public User findUser(String name) throws Exception {
        Connection conn = DriverManager.getConnection(DB_URL, "root", DB_PASS);
        // ⚠ SQL Injection
        String sql = "SELECT * FROM users WHERE name = '" + name + "'";
        Statement stmt = conn.createStatement();
        return stmt.executeQuery(sql);
    }
}`,
};

function ScoreGauge({ score }) {
  const pct = score / 10;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = pct * circ;
  const color = score >= 7 ? "var(--green)" : score >= 4 ? "var(--amber)" : "var(--red)";
  const label = score >= 7 ? "SECURE" : score >= 4 ? "MODERATE" : "CRITICAL";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="65" cy="65" r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${filled} ${circ}` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{score.toFixed(1)}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textAlign: "center", letterSpacing: "0.1em" }}>/10</div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{
          fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
          color, padding: "3px 12px",
          background: `${color}12`, border: `1px solid ${color}30`,
          borderRadius: 100,
        }}
      >{label}</motion.div>
    </div>
  );
}

function ConfBar({ label, value, color, delay = 0 }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em" }}>{label}</span>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.5 }}
          style={{ fontFamily: "var(--mono)", fontSize: 10, color, fontWeight: 600 }}
        >{value?.toFixed(1)}%</motion.span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", background: color, borderRadius: 3, boxShadow: `0 0 10px ${color}60` }}
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
    setLoading(true); setError(null); setResult(null);
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

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const riskColor = r => !r ? "var(--text3)" : r === "high" ? "var(--red)" : r === "medium" ? "var(--amber)" : "var(--green)";

  return (
    <div className="page" style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <div className="label" style={{ marginBottom: 8 }}>// CODE ANALYZER</div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Security Scanner
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>
          Paste code → AI scans for vulnerabilities → get score, findings & fixes.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20, alignItems: "start" }}>
        {/* Left: Editor */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {/* Lang tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => { setLang(l); if (SAMPLES[l]) setCode(SAMPLES[l]); }} style={{
                background: lang === l ? "rgba(0,229,255,0.1)" : "var(--bg2)",
                border: "1px solid", borderColor: lang === l ? "rgba(0,229,255,0.35)" : "rgba(255,255,255,0.07)",
                color: lang === l ? "var(--cyan)" : "var(--text3)",
                padding: "5px 14px", borderRadius: "var(--r)",
                fontSize: 10.5, letterSpacing: "0.1em", cursor: "pointer",
                transition: "all 0.2s",
              }}>{l}</button>
            ))}
          </div>

          {/* Code area */}
          <div style={{
            background: "var(--bg1)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "var(--r3)", overflow: "hidden",
          }}>
            {/* Editor header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 16px", background: "var(--bg2)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                {lang} · {code.split('\n').length} lines
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                {code.length} chars
              </span>
            </div>

            {/* Line numbers + editor */}
            <div style={{ display: "flex", minHeight: 400 }}>
              <div style={{
                padding: "1rem 0", minWidth: 44,
                background: "rgba(0,0,0,0.2)",
                borderRight: "1px solid rgba(255,255,255,0.04)",
                userSelect: "none",
              }}>
                {code.split('\n').map((_, i) => (
                  <div key={i} style={{
                    fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)",
                    lineHeight: "1.7", padding: "0 10px", textAlign: "right",
                  }}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                style={{
                  flex: 1, padding: "1rem", background: "transparent", border: "none",
                  fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", lineHeight: 1.7,
                  resize: "none", outline: "none", minHeight: 400,
                }}
              />
            </div>
          </div>

          {/* Analyze button */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <motion.button
              onClick={analyze}
              disabled={loading || !code.trim()}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 30px rgba(0,229,255,0.25)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: loading ? "var(--bg3)" : "var(--cyan)",
                color: loading ? "var(--cyan)" : "#000",
                border: loading ? "1px solid rgba(0,229,255,0.25)" : "none",
                padding: "12px 28px", borderRadius: "var(--r)",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 0 16px rgba(0,229,255,0.18)",
              }}
            >
              {loading
                ? <><Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> SCANNING...</>
                : <><Zap size={14} /> RUN ANALYSIS</>}
            </motion.button>

            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              → {API_URL.replace("https://", "")}
            </span>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  marginTop: 12, padding: "12px 16px",
                  background: "rgba(255,61,90,0.08)", border: "1px solid rgba(255,61,90,0.25)",
                  borderRadius: "var(--r)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--red)",
                }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "var(--r3)", padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: 16, opacity: 0.2 }}>
                  <Shield size={48} color="var(--cyan)" strokeWidth={1} />
                </div>
                <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text3)" }}>Awaiting code submission</p>
                <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>Select language → paste code → click Run Analysis</p>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid rgba(0,229,255,0.15)",
                  borderRadius: "var(--r3)", padding: "4rem 2rem",
                  textAlign: "center", position: "relative", overflow: "hidden",
                }}
              >
                {/* Scanning animation */}
                <motion.div
                  animate={{ top: ["-5%", "105%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute", left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
                    boxShadow: "0 0 20px var(--cyan)",
                  }}
                />
                <Loader size={32} color="var(--cyan)" style={{ animation: "spin 1s linear infinite", marginBottom: 16 }} />
                <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cyan)", letterSpacing: "0.12em" }}>SCANNING...</p>
                <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 10 }}>Model analyzing vulnerability patterns</p>
              </motion.div>
            )}

            {result && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Score + verdict */}
                <div style={{
                  background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "var(--r3)", padding: "1.5rem", marginBottom: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    <div>
                      <div className="label" style={{ marginBottom: 8 }}>VERDICT</div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                        style={{
                          fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700,
                          color: riskColor(result.risk),
                          textShadow: `0 0 20px ${riskColor(result.risk)}50`,
                        }}
                      >{result.verdict}</motion.div>
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        style={{
                          display: "inline-block", marginTop: 8,
                          background: `${riskColor(result.risk)}12`,
                          border: `1px solid ${riskColor(result.risk)}30`,
                          color: riskColor(result.risk),
                          padding: "3px 12px", borderRadius: 100,
                          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
                        }}
                      >{result.risk?.toUpperCase()} RISK</motion.div>
                    </div>
                    <ScoreGauge score={result.score ?? 0} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <ConfBar label="CLEAN CONFIDENCE" value={result.clean_confidence} color="var(--green)" delay={0.3} />
                    <ConfBar label="VULN CONFIDENCE" value={result.vuln_confidence} color="var(--red)" delay={0.5} />
                  </div>
                </div>

                {/* Findings */}
                {result.findings?.length > 0 && (
                  <ResultBlock
                    title="SECURITY FINDINGS"
                    icon={<AlertTriangle size={12} color="var(--red)" />}
                    accentColor="var(--red)"
                    items={result.findings}
                    bg="rgba(255,61,90,0.06)"
                    border="rgba(255,61,90,0.18)"
                    prefix="⚠"
                    textColor="rgba(255,180,180,0.9)"
                  />
                )}

                {/* Tips */}
                {result.tips?.length > 0 && (
                  <ResultBlock
                    title="IMPROVEMENT TIPS"
                    icon={<CheckCircle size={12} color="var(--green)" />}
                    accentColor="var(--green)"
                    items={result.tips}
                    bg="rgba(0,255,157,0.04)"
                    border="rgba(0,255,157,0.15)"
                    prefix="→"
                    textColor="var(--text2)"
                  />
                )}

                {/* Raw JSON toggle */}
                <div style={{ background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--r2)" }}>
                  <button
                    onClick={() => setShowRaw(v => !v)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", background: "transparent", border: "none",
                      cursor: "pointer", color: "var(--text3)",
                    }}
                  >
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em" }}>RAW JSON</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={e => { e.stopPropagation(); copyJson(); }} style={{
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "var(--r)", color: copied ? "var(--green)" : "var(--text3)",
                        padding: "2px 8px", fontSize: 9, display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
                      }}>
                        {copied ? <Check size={9} /> : <Copy size={9} />}
                        {copied ? "COPIED" : "COPY"}
                      </button>
                      <motion.div animate={{ rotate: showRaw ? 180 : 0 }}>
                        <ChevronDown size={14} />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {showRaw && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <pre style={{
                          padding: "0 14px 14px",
                          fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)",
                          overflow: "auto", maxHeight: 200, lineHeight: 1.7,
                        }}>
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

function ResultBlock({ title, icon, accentColor, items, bg, border, prefix, textColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--r2)", padding: "1rem", marginBottom: 10,
        borderLeft: `2px solid ${accentColor}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, color: accentColor }}>
        {icon}
        <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.14em" }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((item, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              display: "flex", gap: 10, padding: "9px 12px",
              background: bg, border: `1px solid ${border}`,
              borderRadius: "var(--r)", fontSize: 12, color: textColor, lineHeight: 1.6,
            }}
          >
            <span style={{ fontFamily: "var(--mono)", flexShrink: 0, opacity: 0.5 }}>{prefix}</span>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
