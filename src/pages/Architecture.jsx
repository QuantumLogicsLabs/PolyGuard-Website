import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronRight } from "lucide-react";

const TOOLS = [
  {
    id: "colab", label: "Google Colab", tag: "Workshop",
    accent: "#f59e0b",
    url: null,
    what: "Browser-based notebook with free GPU. Where you actually run code, train models, and experiment.",
    stores: "Your .ipynb notebooks during the session. Forgets everything when closed — always save outputs.",
    use: "Training runs, data processing, evaluation experiments. Enable T4 GPU for all training.",
    not: "Do NOT use as permanent storage — it resets. Don't store datasets or models here.",
    files: ["01_data_collection.ipynb", "02_preprocessing.ipynb", "03_train_model.ipynb", "04_evaluate.ipynb"],
  },
  {
    id: "drive", label: "Google Drive", tag: "Warehouse",
    accent: "#4ade80",
    url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV",
    what: "Permanent cloud storage mounted directly inside Colab. Never resets.",
    stores: "train.csv / val.csv datasets, trained model weights (.bin), checkpoints.",
    use: "Colab reads dataset from here, writes model weights back here after training.",
    not: "Not for code — use GitHub. Files over 15GB need Drive storage upgrade.",
    files: ["PolyGuard/01-data/train.csv", "PolyGuard/01-data/val.csv", "PolyGuard/03-models/polyguard_model/"],
  },
  {
    id: "github", label: "GitHub", tag: "Library",
    accent: "#94a3b8",
    url: "https://github.com/QuantumLogicsLabs/PolyGuard",
    what: "Version-controlled code storage. Every commit preserves history you can roll back to.",
    stores: "All .py files, notebooks, configs, requirements.txt — anything under 100MB.",
    use: "Push code here so every team member has access. Track tasks with Issues.",
    not: "Never push model files or datasets — GitHub rejects files over 100MB.",
    files: ["app.py → API server", "requirements.txt → dependencies", "notebooks/ → all notebooks"],
  },
  {
    id: "hfhub", label: "HF Hub", tag: "Model Store",
    accent: "#a78bfa",
    url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model",
    what: "Free model hosting built for large ML weight files. Like GitHub but for models.",
    stores: "Trained model weights, tokenizer, config.json — the actual CodeBERT checkpoint.",
    use: "HF Spaces loads the model FROM here at startup via from_pretrained().",
    not: "Not for training data or code — those go to Drive and GitHub respectively.",
    files: ["pytorch_model.bin → weights", "tokenizer_config.json", "config.json"],
  },
  {
    id: "hfspace", label: "HF Spaces", tag: "Live Server",
    accent: "#f97316",
    url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api",
    what: "Free 24/7 server running your app.py. The permanent API endpoint that never changes.",
    stores: "Only app.py, requirements.txt, and Dockerfile. Model is fetched from HF Hub.",
    use: "PolyCode and this website call /analyze here for all predictions.",
    not: "Model weights don't live here — they're pulled from HF Hub at every restart.",
    files: ["app.py → FastAPI /analyze endpoint", "requirements.txt", "Dockerfile"],
    endpoint: "https://muhammadsaadamin-polyguard-api.hf.space/analyze",
  },
];

const FLOW = [
  { n: 1, from: "Colab", to: "Drive", desc: "Downloads HF datasets → saves train.csv", fa: "#f59e0b", ta: "#4ade80" },
  { n: 2, from: "Colab", to: "Drive", desc: "Reads train.csv → trains model → writes weights", fa: "#f59e0b", ta: "#4ade80" },
  { n: 3, from: "Colab", to: "HF Hub", desc: "Uploads trained model via api.upload_folder()", fa: "#f59e0b", ta: "#a78bfa" },
  { n: 4, from: "Colab", to: "GitHub", desc: "Pushes code + notebooks for the whole team", fa: "#f59e0b", ta: "#94a3b8" },
  { n: 5, from: "HF Spaces", to: "HF Hub", desc: "Loads model via from_pretrained() at startup", fa: "#f97316", ta: "#a78bfa" },
  { n: 6, from: "PolyCode", to: "HF Spaces", desc: "POST /analyze → score, findings, tips", fa: "var(--cyan)", ta: "#f97316" },
];

const RETRAIN = [
  { n: "01", title: "Add More Data", desc: "Open 01_data_collection.ipynb. Download bigvul or draper_vdisc from HuggingFace. Combine with existing data. Save new train.csv to Drive.", code: null },
  { n: "02", title: "Retrain Model", desc: "Open 03_train_model.ipynb. Enable T4 GPU. Run all cells. New weights saved to Drive. Takes 20–40 min.", code: "Runtime → Change runtime type → T4 GPU" },
  { n: "03", title: "Push to HF Hub", desc: "Overwrite the old model on HF Hub so Spaces picks it up.", code: `api.upload_folder(\n  folder_path="Drive/PolyGuard/03-models/polyguard_model",\n  repo_id="MUHAMMADSAADAMIN/polyguard-model"\n)` },
  { n: "04", title: "Restart HF Space", desc: "Go to your Space → Settings → Restart Space. Downloads new model. Takes 3–5 min.", code: null },
  { n: "05", title: "Verify Improvement", desc: "Send the same test snippet to /analyze. Compare confidence scores. If vuln_confidence dropped, the model got smarter.", code: `curl -X POST https://muhammadsaadamin-polyguard-api.hf.space/analyze \\\n  -H "Content-Type: application/json" \\\n  -d '{"code": "test code here", "language": "python"}'` },
];

export default function Architecture() {
  const [active, setActive] = useState(null);
  const tool = TOOLS.find(t => t.id === active);

  return (
    <div className="page" style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <div className="label" style={{ marginBottom: 8 }}>// SYSTEM ARCHITECTURE</div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
          How PolyGuard Works
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Five tools working as one system. Click any component to explore its role.</p>
      </motion.div>

      {/* Tool Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
        {TOOLS.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setActive(active === t.id ? null : t.id)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: active === t.id ? `${t.accent}10` : "var(--bg2)",
              border: `1px solid ${active === t.id ? `${t.accent}35` : "rgba(255,255,255,0.07)"}`,
              borderRadius: "var(--r2)", padding: "1rem 0.75rem",
              cursor: "pointer", textAlign: "center",
              transition: "all 0.2s",
              boxShadow: active === t.id ? `0 8px 24px ${t.accent}15` : "none",
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: t.accent, boxShadow: `0 0 10px ${t.accent}60`,
              margin: "0 auto 10px",
            }} />
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: active === t.id ? t.accent : "var(--text)", marginBottom: 4 }}>
              {t.label}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--text3)", letterSpacing: "0.1em" }}>{t.tag}</div>
          </motion.button>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {tool && (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 20 }}
          >
            <div style={{
              background: "var(--bg2)", borderRadius: "var(--r3)", overflow: "hidden",
              border: `1px solid ${tool.accent}25`,
            }}>
              <div style={{
                padding: "1.25rem 1.5rem",
                borderBottom: `1px solid ${tool.accent}20`,
                background: `${tool.accent}08`,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: tool.accent, boxShadow: `0 0 10px ${tool.accent}` }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: tool.accent }}>{tool.label}</h3>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: tool.accent, opacity: 0.6, letterSpacing: "0.1em" }}>— {tool.tag.toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text2)", maxWidth: 600 }}>{tool.what}</p>
                </div>
                {tool.url && (
                  <a href={tool.url} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "var(--r)", padding: "7px 14px",
                    fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text2)", textDecoration: "none",
                    flexShrink: 0,
                  }}>
                    Open <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
                {[
                  { label: "📦 Stores", text: tool.stores },
                  { label: "🔧 Use for", text: tool.use },
                  { label: "⛔ Not for", text: tool.not },
                ].map((r, i) => (
                  <div key={i} style={{
                    padding: "1.1rem 1.25rem",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginBottom: 8 }}>{r.label}</div>
                    <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7 }}>{r.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.12em", marginBottom: 8 }}>FILES</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {tool.files.map((f, i) => (
                    <span key={i} style={{
                      fontFamily: "var(--mono)", fontSize: 10.5,
                      background: `${tool.accent}10`, border: `1px solid ${tool.accent}25`,
                      color: tool.accent, padding: "3px 10px", borderRadius: "var(--r)",
                    }}>{f}</span>
                  ))}
                </div>
                {tool.endpoint && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: "var(--r)" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>ENDPOINT · </span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--cyan)" }}>{tool.endpoint}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 14 }}>// DATA FLOW — HOW ALL 5 TOOLS CONNECT</div>
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "var(--r3)", overflow: "hidden" }}>
          {FLOW.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: "12px 20px",
                borderBottom: i < FLOW.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", minWidth: 18 }}>{f.n}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: f.fa, background: `${f.fa}15`, padding: "2px 9px", borderRadius: 4 }}>{f.from}</span>
              <ChevronRight size={13} color="var(--text3)" />
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: f.ta, background: `${f.ta}15`, padding: "2px 9px", borderRadius: 4 }}>{f.to}</span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Retrain Guide */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="label" style={{ marginBottom: 14 }}>// HOW TO RETRAIN THE MODEL</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {RETRAIN.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{
                background: "var(--bg2)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "var(--r2)", padding: "1.25rem 1.5rem",
                display: "flex", gap: 20, alignItems: "flex-start",
              }}
            >
              <span style={{
                fontFamily: "var(--mono)", fontSize: 28, fontWeight: 700,
                color: "rgba(0,229,255,0.15)", lineHeight: 1, flexShrink: 0,
              }}>{s.n}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: s.code ? 10 : 0 }}>{s.desc}</p>
                {s.code && (
                  <pre style={{
                    background: "rgba(0,0,0,0.35)", border: "1px solid rgba(0,229,255,0.12)",
                    borderRadius: "var(--r)", padding: "10px 14px",
                    fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", overflow: "auto", lineHeight: 1.7,
                  }}>{s.code}</pre>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
