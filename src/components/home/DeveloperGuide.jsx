import { motion } from "framer-motion";
import { Terminal, CheckCircle, GitBranch } from "lucide-react";

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

export default function DeveloperGuide() {
  return (
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
  );
}
