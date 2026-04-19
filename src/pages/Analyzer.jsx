import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader, ChevronRight, Copy, Zap } from "lucide-react";

const API_URL = "https://muhammadsaadamin-polyguard-api.hf.space/analyze";

const LANGUAGES = ["python", "javascript", "java", "c", "cpp", "php", "ruby", "go"];

const SAMPLE_CODE = {
  python: `import sqlite3

def get_user(username):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # Vulnerable: SQL injection
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()

def process_file(filename):
    f = open(filename, "r")
    data = f.read()
    f.close()
    return data`,
  javascript: `const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  const id = req.query.id;
  // Vulnerable: no input validation
  const html = '<h1>User: ' + id + '</h1>';
  res.send(html);
});`,
  java: `import java.sql.*;

public class UserDAO {
    public User findUser(String name) throws Exception {
        Connection conn = DriverManager.getConnection(DB_URL);
        // Vulnerable: SQL injection
        String sql = "SELECT * FROM users WHERE name = '" + name + "'";
        Statement stmt = conn.createStatement();
        return stmt.executeQuery(sql);
    }
}`,
};

function ScoreRing({ score }) {
  const pct = score / 10;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = score >= 7 ? "var(--safe)" : score >= 4 ? "var(--warn)" : "var(--danger)";

  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color }}>{score.toFixed(1)}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.1em" }}>/10</span>
      </div>
    </div>
  );
}

export default function Analyzer() {
  const [code, setCode] = useState(SAMPLE_CODE.python);
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "API request failed. Check your connection.");
    }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const riskColor = (risk) => {
    if (!risk) return "var(--text3)";
    const r = risk.toLowerCase();
    if (r === "high") return "var(--danger)";
    if (r === "medium") return "var(--warn)";
    return "var(--safe)";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: 8 }}>// CODE ANALYZER</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Security Analysis</h2>
        <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }}>
          Paste your code below. The PolyGuard ML model will scan for vulnerabilities and suggest improvements.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>
        {/* Editor Panel */}
        <div>
          {/* Language Selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => { setLanguage(l); if (SAMPLE_CODE[l]) setCode(SAMPLE_CODE[l]); }} style={{
                background: language === l ? "rgba(0,255,136,0.1)" : "var(--bg2)",
                border: "1px solid", borderColor: language === l ? "rgba(0,255,136,0.4)" : "var(--border)",
                color: language === l ? "var(--accent)" : "var(--text2)",
                padding: "5px 12px", borderRadius: "var(--radius)",
                fontSize: 11, letterSpacing: "0.08em", transition: "all 0.15s",
              }}>{l}</button>
            ))}
          </div>

          {/* Code editor */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: 12, left: 16,
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em",
            }}>{language} · {code.split('\n').length} lines</div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                width: "100%", minHeight: 380,
                background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: "var(--radius2)", padding: "2.5rem 1.5rem 1.5rem",
                fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)",
                lineHeight: 1.7, resize: "vertical", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(0,255,136,0.3)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
              placeholder="Paste your code here..."
              spellCheck={false}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
            <button onClick={analyze} disabled={loading || !code.trim()} style={{
              background: loading ? "rgba(0,255,136,0.1)" : "var(--accent)",
              color: loading ? "var(--accent)" : "#000",
              border: "1px solid", borderColor: loading ? "rgba(0,255,136,0.3)" : "transparent",
              padding: "11px 24px", borderRadius: "var(--radius)",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s", cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? <><Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> ANALYZING...</> : <><Zap size={14} /> ANALYZE CODE</>}
            </button>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              → {API_URL.replace("https://", "")}
            </span>
          </div>

          {error && (
            <div style={{
              marginTop: 12, padding: "12px 16px",
              background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)",
              borderRadius: "var(--radius)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--danger)",
            }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div>
          {!result && !loading && (
            <div style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius2)", padding: "3rem 2rem",
              textAlign: "center", color: "var(--text3)",
            }}>
              <Shield size={40} strokeWidth={1} style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "var(--mono)", fontSize: 12 }}>Results will appear here</p>
              <p style={{ fontSize: 12, marginTop: 8 }}>Click Analyze Code to scan</p>
            </div>
          )}

          {loading && (
            <div style={{
              background: "var(--bg2)", border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: "var(--radius2)", padding: "3rem 2rem",
              textAlign: "center", animation: "pulse-border 2s infinite",
            }}>
              <Loader size={32} color="var(--accent)" style={{ animation: "spin 1s linear infinite", marginBottom: 16 }} />
              <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)" }}>SCANNING CODE...</p>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>Model is analyzing patterns</p>
            </div>
          )}

          {result && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {/* Score Card */}
              <div style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: "var(--radius2)", padding: "1.5rem", marginBottom: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginBottom: 4 }}>SECURITY VERDICT</div>
                    <div style={{
                      fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700,
                      color: riskColor(result.risk),
                      textShadow: `0 0 20px ${riskColor(result.risk)}40`,
                    }}>{result.verdict}</div>
                    <div style={{
                      display: "inline-block", marginTop: 6,
                      background: `${riskColor(result.risk)}15`,
                      border: `1px solid ${riskColor(result.risk)}40`,
                      color: riskColor(result.risk),
                      padding: "2px 10px", borderRadius: 100,
                      fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
                    }}>{result.risk?.toUpperCase()} RISK</div>
                  </div>
                  <ScoreRing score={result.score ?? 0} />
                </div>

                {/* Confidence bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <ConfBar label="Clean" value={result.clean_confidence} color="var(--safe)" />
                  <ConfBar label="Vulnerable" value={result.vuln_confidence} color="var(--danger)" />
                </div>
              </div>

              {/* Findings */}
              {result.findings?.length > 0 && (
                <ResultSection title="SECURITY FINDINGS" icon={<AlertTriangle size={13} />} color="var(--danger)">
                  {result.findings.map((f, i) => (
                    <Item key={i} icon="⚠" text={f} color="rgba(255,68,68,0.08)" borderColor="rgba(255,68,68,0.15)" />
                  ))}
                </ResultSection>
              )}

              {/* Tips */}
              {result.tips?.length > 0 && (
                <ResultSection title="IMPROVEMENT TIPS" icon={<CheckCircle size={13} />} color="var(--safe)">
                  {result.tips.map((t, i) => (
                    <Item key={i} icon="→" text={t} color="rgba(0,255,136,0.04)" borderColor="rgba(0,255,136,0.12)" />
                  ))}
                </ResultSection>
              )}

              {/* Raw JSON */}
              <div style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: "var(--radius2)", padding: "1rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em" }}>RAW RESPONSE</span>
                  <button onClick={copyResult} style={{
                    background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                    color: copied ? "var(--accent)" : "var(--text3)", padding: "3px 10px",
                    fontSize: 10, display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <Copy size={10} /> {copied ? "COPIED!" : "COPY"}
                  </button>
                </div>
                <pre style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)", overflow: "auto", maxHeight: 180 }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ConfBar({ label, value, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>{label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color }}>{value?.toFixed(1)}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          width: `${value}%`, height: "100%", background: color,
          borderRadius: 2, transition: "width 0.8s ease",
          boxShadow: `0 0 6px ${color}60`,
        }} />
      </div>
    </div>
  );
}

function ResultSection({ title, icon, color, children }) {
  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)",
      borderRadius: "var(--radius2)", padding: "1rem", marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color }}>
        {icon}
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em" }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
    </div>
  );
}

function Item({ icon, text, color, borderColor }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "8px 12px",
      background: color, border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius)", fontSize: 12, color: "var(--text2)", lineHeight: 1.6,
    }}>
      <span style={{ fontFamily: "var(--mono)", opacity: 0.6, flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
