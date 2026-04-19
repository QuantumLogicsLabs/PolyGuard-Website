import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

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

export default function APIReference() {
  const navigate = useNavigate();

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
              <span style={{ color: "var(--purple)" }}>"clean_confidence"</span>
              <span style={{ color: "var(--text3)" }}>: </span>
              <span style={{ color: "var(--amber)" }}>12.3</span>
              <span style={{ color: "var(--text3)" }}>,</span>
              {"\n"}
              <span style={{ color: "var(--text3)" }}> </span>
              <span style={{ color: "var(--purple)" }}>"vuln_confidence"</span>
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
                  <div className="dot dot--md" style={{ background: l.dot }} />
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
  );
}
