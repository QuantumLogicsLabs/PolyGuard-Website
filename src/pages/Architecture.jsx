import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, ChevronRight } from "lucide-react";

const TOOLS = [
  {
    id: "colab", label: "Google Colab", tag: "Workshop", accent: "#f59e0b", url: null,
    what: "Browser-based notebook with free GPU. Where you actually run code, train models, and experiment.",
    stores: "Your .ipynb notebooks during the session. Forgets everything when closed — always save outputs to Drive.",
    use: "Training runs, data processing, evaluation experiments. Enable T4 GPU for all training jobs.",
    not: "Do NOT use as permanent storage — it resets. Don't store datasets or model weights here.",
    files: ["01_data_collection.ipynb", "02_preprocessing.ipynb", "03_train_model.ipynb", "04_evaluate.ipynb"],
    endpoint: null,
  },
  {
    id: "drive", label: "Google Drive", tag: "Warehouse", accent: "#4ade80",
    url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV",
    what: "Permanent cloud storage mounted directly inside Colab. Never resets between sessions.",
    stores: "train.csv / val.csv datasets, trained model weights (.bin), evaluation checkpoints.",
    use: "Colab reads the dataset from here, writes model weights back here after training completes.",
    not: "Not for code — use GitHub. Files over 15GB require a Drive storage upgrade.",
    files: ["PolyGuard/01-data/train.csv", "PolyGuard/01-data/val.csv", "PolyGuard/03-models/polyguard_model/"],
    endpoint: null,
  },
  {
    id: "github", label: "GitHub", tag: "Library", accent: "#94a3b8",
    url: "https://github.com/QuantumLogicsLabs/PolyGuard",
    what: "Version-controlled code storage. Every commit preserves history you can roll back to.",
    stores: "All .py files, notebooks, configs, requirements.txt — anything under 100MB.",
    use: "Push code here so every team member has access. Track tasks with GitHub Issues.",
    not: "Never push model files or large datasets — GitHub rejects files over 100MB.",
    files: ["app.py → API server", "requirements.txt → dependencies", "notebooks/ → all notebooks"],
    endpoint: null,
  },
  {
    id: "hfhub", label: "HF Hub", tag: "Model Store", accent: "#a78bfa",
    url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model",
    what: "Free model hosting built for large ML weight files. Like GitHub but designed for models.",
    stores: "Trained model weights, tokenizer files, config.json — the actual CodeBERT checkpoint.",
    use: "HF Spaces loads the model FROM here at startup via from_pretrained().",
    not: "Not for training data or code — those go to Drive and GitHub respectively.",
    files: ["pytorch_model.bin → weights", "tokenizer_config.json", "config.json"],
    endpoint: null,
  },
  {
    id: "hfspace", label: "HF Spaces", tag: "Live Server", accent: "#f97316",
    url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api",
    what: "Free 24/7 server running your app.py. The permanent API endpoint that never changes URL.",
    stores: "Only app.py, requirements.txt, and Dockerfile. Model is fetched from HF Hub at startup.",
    use: "PolyCode and this website call /analyze here for all vulnerability predictions.",
    not: "Model weights don't live here — they're pulled from HF Hub at every restart.",
    files: ["app.py → FastAPI /analyze endpoint", "requirements.txt", "Dockerfile"],
    endpoint: "https://muhammadsaadamin-polyguard-api.hf.space/analyze",
  },
];

const FLOW = [
  { n: 1, from: "Colab",    to: "Drive",    desc: "Downloads HF datasets → saves train.csv",             fa: "#f59e0b", ta: "#4ade80" },
  { n: 2, from: "Colab",    to: "Drive",    desc: "Reads train.csv → trains model → writes weights",      fa: "#f59e0b", ta: "#4ade80" },
  { n: 3, from: "Colab",    to: "HF Hub",   desc: "Uploads trained model via api.upload_folder()",        fa: "#f59e0b", ta: "#a78bfa" },
  { n: 4, from: "Colab",    to: "GitHub",   desc: "Pushes code + notebooks for the whole team",           fa: "#f59e0b", ta: "#94a3b8" },
  { n: 5, from: "HF Spaces",to: "HF Hub",   desc: "Loads model via from_pretrained() at startup",         fa: "#f97316", ta: "#a78bfa" },
  { n: 6, from: "PolyCode", to: "HF Spaces",desc: "POST /analyze → score, findings, tips",                fa: "var(--cyan)", ta: "#f97316" },
];

const RETRAIN = [
  { n: "01", title: "Add More Data",     desc: "Open 01_data_collection.ipynb. Download bigvul or draper_vdisc from HuggingFace. Combine with existing data. Save new train.csv to Drive.", code: null },
  { n: "02", title: "Retrain Model",     desc: "Open 03_train_model.ipynb. Enable T4 GPU. Run all cells. New weights saved to Drive. Takes 20–40 min.", code: "Runtime → Change runtime type → T4 GPU" },
  { n: "03", title: "Push to HF Hub",    desc: "Overwrite the old model on HF Hub so Spaces picks it up on next restart.", code: `api.upload_folder(\n  folder_path="Drive/PolyGuard/03-models/polyguard_model",\n  repo_id="MUHAMMADSAADAMIN/polyguard-model"\n)` },
  { n: "04", title: "Restart HF Space",  desc: "Go to your Space → Settings → Restart Space. It downloads the new model. Takes 3–5 min.", code: null },
  { n: "05", title: "Verify Improvement",desc: "Send the same test snippet to /analyze. Compare confidence scores. If vuln_confidence dropped, the model got smarter.", code: `curl -X POST https://muhammadsaadamin-polyguard-api.hf.space/analyze \\\n  -H "Content-Type: application/json" \\\n  -d '{"code": "test code here", "language": "python"}'` },
];

export default function Architecture() {
  const [active, setActive] = useState(null);
  const tool = TOOLS.find((t) => t.id === active);

  return (
    <div className="page page-container--md">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <div className="label-cyan page-header__eyebrow">// SYSTEM ARCHITECTURE</div>
        <h2 className="page-header__title">How PolyGuard Works</h2>
        <p className="page-header__sub">
          Five tools working as one system. Click any component to explore its role and data flow.
        </p>
      </motion.div>

      {/* Tool selector */}
      <div className="grid-5" style={{ marginBottom: 16 }}>
        {TOOLS.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            onClick={() => setActive(active === t.id ? null : t.id)}
            whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
            className="tool-btn"
            style={{
              background:   active === t.id ? `${t.accent}12` : "var(--bg2)",
              border:       `1px solid ${active === t.id ? `${t.accent}35` : "rgba(255,255,255,0.07)"}`,
              boxShadow:    active === t.id ? `0 8px 28px ${t.accent}18` : "none",
            }}
          >
            <div className="tool-btn__dot" style={{ background: t.accent, boxShadow: `0 0 12px ${t.accent}70` }} />
            <div className="tool-btn__label" style={{ color: active === t.id ? t.accent : "var(--text)" }}>
              {t.label}
            </div>
            <div className="tool-btn__tag">{t.tag}</div>
          </motion.button>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {tool && (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 20 }}
          >
            <div className="card" style={{ border: `1px solid ${tool.accent}22` }}>
              {/* Header */}
              <div
                className="detail-panel__header"
                style={{
                  borderBottomColor: `${tool.accent}20`,
                  background: `${tool.accent}08`,
                }}
              >
                <div>
                  <div className="flex-center--gap" style={{ marginBottom: 6 }}>
                    <span className="dot dot--lg" style={{ background: tool.accent, boxShadow: `0 0 10px ${tool.accent}` }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: tool.accent }}>{tool.label}</h3>
                    <span className="meta-text" style={{ color: tool.accent, opacity: 0.6 }}>
                      — {tool.tag.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text2)", maxWidth: 600 }}>{tool.what}</p>
                </div>
                {tool.url && (
                  <a href={tool.url} target="_blank" rel="noreferrer" className="open-link">
                    Open <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {/* 3-column body */}
              <div className="grid-3">
                {[
                  { label: "📦 Stores", text: tool.stores },
                  { label: "🔧 Use for", text: tool.use },
                  { label: "⛔ Not for", text: tool.not },
                ].map((col, i) => (
                  <div
                    key={i}
                    className="detail-panel__col"
                    style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  >
                    <div className="detail-panel__col-label">{col.label}</div>
                    <p className="detail-panel__col-text">{col.text}</p>
                  </div>
                ))}
              </div>

              {/* Files + endpoint */}
              <div className="detail-panel__files">
                <div className="label mb-label">FILES</div>
                <div className="flex-center" style={{ gap: 8, flexWrap: "wrap" }}>
                  {tool.files.map((f, i) => (
                    <span
                      key={i}
                      className="file-tag"
                      style={{
                        background: `${tool.accent}12`,
                        border: `1px solid ${tool.accent}26`,
                        color: tool.accent,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                {tool.endpoint && (
                  <div className="endpoint-chip" style={{ marginTop: 12 }}>
                    <span className="endpoint-chip__label">ENDPOINT · </span>
                    <span className="endpoint-chip__value">{tool.endpoint}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ marginBottom: 24 }}
      >
        <div className="label mb-label-lg">// DATA FLOW — HOW ALL 5 TOOLS CONNECT</div>
        <div className="card">
          {FLOW.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className={`flow-row${i < FLOW.length - 1 ? " flow-row__divider" : ""}`}
            >
              <span className="meta-text" style={{ minWidth: 18 }}>{f.n}</span>
              <span className="flow-badge" style={{ color: f.fa, background: `${f.fa}18` }}>{f.from}</span>
              <ChevronRight size={13} color="var(--text3)" />
              <span className="flow-badge" style={{ color: f.ta, background: `${f.ta}18` }}>{f.to}</span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Retrain guide */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="label mb-label-lg">// HOW TO RETRAIN THE MODEL</div>
        <div className="flex-col--gap">
          {RETRAIN.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="step-card"
            >
              <span className="step-card__num">{s.n}</span>
              <div style={{ flex: 1 }}>
                <h4 className="step-card__title">{s.title}</h4>
                <p className="step-card__desc" style={{ marginBottom: s.code ? 10 : 0 }}>{s.desc}</p>
                {s.code && <pre className="code-block">{s.code}</pre>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
