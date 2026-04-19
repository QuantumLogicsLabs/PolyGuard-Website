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

  c: `#include <stdio.h>
#include <string.h>

void process_input(char* input) {
    char buffer[64];
    // ⚠ Buffer overflow — strcpy does no bounds check
    strcpy(buffer, input);
    printf("Input: %s\\n", buffer);
}

int main() {
    char* user_input = get_user_data();
    process_input(user_input);
    return 0;
}`,

  cpp: `#include <iostream>
#include <cstring>

class LoginManager {
    // ⚠ Hardcoded password in source
    const char* admin_pass = "secret123";

    bool authenticate(const char* pass) {
        char buffer[32];
        // ⚠ Buffer overflow
        strcpy(buffer, pass);
        return strcmp(buffer, admin_pass) == 0;
    }
};`,

  php: `<?php
$conn = mysqli_connect("localhost", "root", "root123", "mydb");

// ⚠ SQL Injection
$user = $_GET['user'];
$query = "SELECT * FROM users WHERE name = '$user'";
$result = mysqli_query($conn, $query);

// ⚠ XSS
echo "<h1>Hello " . $_GET['name'] . "</h1>";
?>`,

  ruby: `require 'sqlite3'

class UserService
  # ⚠ Hardcoded API key
  API_KEY = "sk-prod-abc123secret"

  def find_user(name)
    db = SQLite3::Database.new("users.db")
    # ⚠ SQL Injection via string interpolation
    rows = db.execute("SELECT * FROM users WHERE name = '#{name}'")
    rows.first
  end
end`,

  go: `package main

import (
    "database/sql"
    "fmt"
    "net/http"
)

// ⚠ Hardcoded credential
const dbPassword = "admin123"

func getUser(db *sql.DB, name string) {
    // ⚠ SQL Injection
    query := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", name)
    rows, _ := db.Query(query)
    defer rows.Close()
}`,
};

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
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
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
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
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                color: "var(--text3)",
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
            >
              /10
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color,
          padding: "3px 14px",
          background: `${color}14`,
          border: `1px solid ${color}32`,
          borderRadius: 100,
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </span>
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

/* ── Result block (findings / tips) ── */
function ResultBlock({
  title,
  icon,
  accentColor,
  items,
  bg,
  border,
  prefix,
  textColor,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--bg2)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--r2)",
        padding: "1rem",
        marginBottom: 10,
        borderLeft: `2px solid ${accentColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 10,
          color: accentColor,
        }}
      >
        {icon}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            letterSpacing: "0.14em",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: "flex",
              gap: 10,
              padding: "9px 12px",
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: "var(--r)",
              fontSize: 12,
              color: textColor,
              lineHeight: 1.65,
            }}
          >
            <span
              style={{ fontFamily: "var(--mono)", flexShrink: 0, opacity: 0.5 }}
            >
              {prefix}
            </span>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
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
    <div
      className="page"
      style={{ padding: "2rem", maxWidth: 1260, margin: "0 auto" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <div className="label-cyan" style={{ marginBottom: 8 }}>
          // CODE ANALYZER
        </div>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(1.8rem,4vw,2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Security Scanner
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7 }}>
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
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  if (SAMPLES[l]) setCode(SAMPLES[l]);
                }}
                style={{
                  background: lang === l ? "rgba(0,229,255,0.1)" : "var(--bg2)",
                  border: "1px solid",
                  borderColor:
                    lang === l
                      ? "rgba(0,229,255,0.35)"
                      : "rgba(255,255,255,0.07)",
                  color: lang === l ? "var(--cyan)" : "var(--text3)",
                  padding: "5px 14px",
                  borderRadius: "var(--r)",
                  fontFamily: "var(--mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Code area */}
          <div
            style={{
              background: "var(--bg1)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "var(--r3)",
              overflow: "hidden",
            }}
          >
            {/* Editor header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "var(--bg2)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ff5f57",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#febc2e",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#28c840",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 18 }}>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                  }}
                >
                  {lang}
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                  }}
                >
                  {lines.length} lines
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                  }}
                >
                  {code.length} chars
                </span>
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
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: "var(--text3)",
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 14,
              flexWrap: "wrap",
            }}
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: loading ? "var(--bg3)" : "var(--cyan)",
                color: loading ? "var(--cyan)" : "#000",
                border: loading ? "1px solid rgba(0,229,255,0.25)" : "none",
                padding: "12px 28px",
                borderRadius: "var(--r)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 0 18px rgba(0,229,255,0.2)",
              }}
            >
              {loading ? (
                <>
                  {/* ← Correct: apply spin class via style, not inline animation prop */}
                  <Loader
                    size={14}
                    style={{ animation: "spin 0.9s linear infinite" }}
                  />
                  SCANNING...
                </>
              ) : (
                <>
                  <Zap size={14} /> RUN ANALYSIS
                </>
              )}
            </motion.button>

            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text3)",
              }}
            >
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
                style={{
                  marginTop: 12,
                  padding: "12px 16px",
                  background: "rgba(255,51,85,0.08)",
                  border: "1px solid rgba(255,51,85,0.26)",
                  borderRadius: "var(--r)",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--red)",
                }}
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
                style={{
                  background: "var(--bg2)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "var(--r3)",
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: 16, opacity: 0.18 }}>
                  <Shield size={48} color="var(--cyan)" strokeWidth={1} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--text3)",
                  }}
                >
                  Awaiting code submission
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text3)",
                    marginTop: 8,
                    opacity: 0.7,
                  }}
                >
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
                style={{
                  background: "var(--bg2)",
                  border: "1px solid rgba(0,229,255,0.15)",
                  borderRadius: "var(--r3)",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Scan bar — CSS animation, no Framer top prop bug */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, var(--cyan), transparent)",
                    boxShadow: "0 0 20px var(--cyan)",
                    animation: "scanBar 1.8s linear infinite",
                  }}
                />
                <Loader
                  size={32}
                  color="var(--cyan)"
                  style={{
                    animation: "spin 0.9s linear infinite",
                    marginBottom: 16,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--cyan)",
                    letterSpacing: "0.14em",
                  }}
                >
                  SCANNING...
                </p>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                    marginTop: 10,
                  }}
                >
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
                <div
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "var(--r3)",
                    padding: "1.5rem",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.25rem",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div className="label" style={{ marginBottom: 8 }}>
                        VERDICT
                      </div>
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
                        style={{
                          display: "inline-block",
                          marginTop: 8,
                          background: `${riskColor(result.risk)}14`,
                          border: `1px solid ${riskColor(result.risk)}32`,
                          borderRadius: 100,
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          color: riskColor(result.risk),
                          padding: "3px 12px",
                        }}
                      >
                        {(result.risk || "unknown").toUpperCase()} RISK
                      </motion.div>
                    </div>

                    <ScoreGauge score={result.score || 0} />
                  </div>

                  {/* Confidence bars */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
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
                <div
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "var(--r2)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setShowRaw((v) => !v)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                      }}
                    >
                      RAW JSON
                    </span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <button
                        onClick={copyJson}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "var(--r)",
                          color: copied ? "var(--green)" : "var(--text3)",
                          padding: "2px 8px",
                          fontSize: 9,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          cursor: "pointer",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {copied ? <Check size={9} /> : <Copy size={9} />}
                        {copied ? "COPIED" : "COPY"}
                      </button>
                      <motion.div
                        animate={{ rotate: showRaw ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} />
                      </motion.div>
                    </div>
                  </button>

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
