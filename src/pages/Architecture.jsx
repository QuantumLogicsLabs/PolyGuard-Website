import { useState } from "react";
import { ExternalLink } from "lucide-react";

const tools = [
  {
    id: "colab",
    label: "Google Colab",
    tag: "Your Workshop",
    color: "#FAEEDA", tc: "#633806",
    darkBg: "rgba(65,36,2,0.4)", darkBorder: "rgba(250,199,117,0.2)", darkColor: "#FAC775",
    url: null,
    what: "Where you write and run code. A browser-based notebook with free GPU access.",
    stores: "Your .ipynb notebooks during the session. Forgets everything when closed.",
    use: "Run training jobs, data processing, model evaluation. Always save to Drive before closing.",
    nothere: "Do NOT rely on Colab for permanent storage — it resets.",
    notebooks: ["01_data_collection.ipynb", "02_preprocessing.ipynb", "03_train_model.ipynb", "04_evaluate.ipynb"],
  },
  {
    id: "drive",
    label: "Google Drive",
    tag: "Your Warehouse",
    color: "#EAF3DE", tc: "#27500A",
    darkBg: "rgba(23,52,4,0.4)", darkBorder: "rgba(192,221,151,0.2)", darkColor: "#C0DD97",
    url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV",
    what: "Free, permanent cloud storage mounted directly inside Colab.",
    stores: "train.csv / val.csv datasets, trained model weights, checkpoints.",
    use: "Colab reads dataset from here and writes model weights back here after training.",
    nothere: "Don't use for code — use GitHub instead.",
    structure: ["PolyGuard/01-data/ → train.csv, val.csv", "PolyGuard/03-models/ → polyguard_model/"],
  },
  {
    id: "github",
    label: "GitHub",
    tag: "Your Library",
    color: "#F1EFE8", tc: "#444441",
    darkBg: "rgba(44,44,42,0.4)", darkBorder: "rgba(211,209,199,0.2)", darkColor: "#D3D1C7",
    url: "https://github.com/QuantumLogicsLabs/PolyGuard",
    what: "Version-controlled code storage. Every commit saves a snapshot you can roll back to.",
    stores: "All .py files, notebooks, configs, requirements.txt. Anything under 100MB.",
    use: "Push code here so every team member has access. Use Issues to track tasks.",
    nothere: "Never push model files or datasets — GitHub rejects files >100MB.",
    structure: ["app.py → HF Spaces API server", "requirements.txt → dependencies", "notebooks/ → all Colab notebooks"],
  },
  {
    id: "hfhub",
    label: "HF Hub",
    tag: "Your Model Store",
    color: "#EEEDFE", tc: "#3C3489",
    darkBg: "rgba(38,33,92,0.4)", darkBorder: "rgba(206,203,246,0.2)", darkColor: "#CECBF6",
    url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model",
    what: "Free model hosting. Like GitHub but built for large ML model files.",
    stores: "Trained model weights, tokenizer, config.json. Currently: CodeBERT fine-tuned on CVE data.",
    use: "HF Spaces loads the model FROM here at startup via from_pretrained().",
    nothere: "Don't store training data or code here — use Drive and GitHub.",
    structure: ["MUHAMMADSAADAMIN/polyguard-model", "  → pytorch_model.bin (weights)", "  → tokenizer_config.json", "  → config.json"],
  },
  {
    id: "hfspace",
    label: "HF Spaces",
    tag: "Your Live Server",
    color: "#FAECE7", tc: "#712B13",
    darkBg: "rgba(74,27,12,0.4)", darkBorder: "rgba(245,196,179,0.2)", darkColor: "#F5C4B3",
    url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api",
    what: "A free server that runs your app.py 24/7. Your permanent API endpoint.",
    stores: "Only app.py, requirements.txt, and Dockerfile. Model is loaded from HF Hub.",
    use: "PolyCode and this website call the /analyze endpoint here for all predictions.",
    nothere: "Model weights do not live here — they're fetched from HF Hub at startup.",
    url2: "https://muhammadsaadamin-polyguard-api.hf.space/analyze",
    structure: ["app.py → FastAPI with /analyze endpoint", "requirements.txt → transformers, torch, fastapi", "Dockerfile → container config"],
  },
];

const flow = [
  { n: 1, from: "Colab", to: "Drive", text: "downloads HuggingFace datasets → saves train.csv", fromC: "#FAEEDA", fromT: "#633806", toC: "#EAF3DE", toT: "#27500A" },
  { n: 2, from: "Colab", to: "Drive", text: "reads train.csv → trains model → saves weights back", fromC: "#FAEEDA", fromT: "#633806", toC: "#EAF3DE", toT: "#27500A" },
  { n: 3, from: "Colab", to: "HF Hub", text: "uploads trained model weights via api.upload_folder()", fromC: "#FAEEDA", fromT: "#633806", toC: "#EEEDFE", toT: "#3C3489" },
  { n: 4, from: "Colab", to: "GitHub", text: "pushes code + notebooks for the whole team", fromC: "#FAEEDA", fromT: "#633806", toC: "#F1EFE8", toT: "#444441" },
  { n: 5, from: "HF Spaces", to: "HF Hub", text: "app.py runs, loads model via from_pretrained() at startup", fromC: "#FAECE7", fromT: "#712B13", toC: "#EEEDFE", toT: "#3C3489" },
  { n: 6, from: "PolyCode", to: "HF Spaces", text: "sends code via POST /analyze → gets back score + findings", fromC: "rgba(0,255,136,0.15)", fromT: "#00ff88", toC: "#FAECE7", toT: "#712B13" },
];

const retrainSteps = [
  { n: "01", title: "Add More Training Data", desc: "Open 01_data_collection.ipynb in Colab. Download new CVE datasets from HuggingFace or add manually labeled samples. Save a bigger train.csv to Drive. More + diverse data = smarter model.", file: "01_data_collection.ipynb" },
  { n: "02", title: "Retrain the Model", desc: "Open 03_train_model.ipynb. Enable T4 GPU (Runtime → Change runtime type). Run all cells. New weights saved to Drive/PolyGuard/03-models/. Takes 20–40 minutes.", file: "03_train_model.ipynb" },
  { n: "03", title: "Push Model to HF Hub", desc: "Run the upload cell: api.upload_folder(folder_path='...polyguard_model', repo_id='MUHAMMADSAADAMIN/polyguard-model'). This overwrites the old model.", code: 'api.upload_folder(\n  folder_path="Drive/PolyGuard/03-models/polyguard_model",\n  repo_id="MUHAMMADSAADAMIN/polyguard-model"\n)' },
  { n: "04", title: "Restart HF Spaces", desc: "Go to your Space → Settings → Restart Space. It reloads and downloads the new model from HF Hub automatically in 3–5 minutes.", file: "HF Spaces Dashboard" },
  { n: "05", title: "Verify the Improvement", desc: "Send the same test code snippet to the API. Compare the new score against the old one. If confidence improved, you're done. If not, collect more labeled examples and repeat.", code: 'curl -X POST https://muhammadsaadamin-polyguard-api.hf.space/analyze \\\n  -H "Content-Type: application/json" \\\n  -d \'{"code": "your test code", "language": "python"}\'' },
];

export default function Architecture() {
  const [active, setActive] = useState(null);

  const tool = tools.find(t => t.id === active);

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: 8 }}>// SYSTEM ARCHITECTURE</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>How PolyGuard Works</h2>
        <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }}>
          Five tools working together as one system. Click any component to understand its role.
        </p>
      </div>

      {/* Tool Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
        {tools.map(t => (
          <button key={t.id} onClick={() => setActive(active === t.id ? null : t.id)} style={{
            background: active === t.id ? t.darkBg : "var(--bg2)",
            border: "1px solid", borderColor: active === t.id ? t.darkBorder : "var(--border)",
            borderRadius: "var(--radius2)", padding: "1rem 0.75rem",
            cursor: "pointer", textAlign: "center", transition: "all 0.2s",
          }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: active === t.id ? t.darkColor : "var(--text)", marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>{t.tag}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {tool && (
        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius2)", padding: "1.5rem", marginBottom: 24,
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{tool.label}</h3>
              <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{tool.what}</p>
            </div>
            {tool.url && (
              <a href={tool.url} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "6px 12px",
                fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)",
                textDecoration: "none",
              }}>
                Open <ExternalLink size={11} />
              </a>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <InfoRow label="📦 What it stores" text={tool.stores} />
            <InfoRow label="🔧 When you use it" text={tool.use} />
            <InfoRow label="⚠ What does NOT go here" text={tool.nothere} />
            {tool.structure && (
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius)", padding: "12px 14px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginBottom: 8 }}>FILE STRUCTURE</div>
                {tool.structure.map((s, i) => (
                  <div key={i} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", lineHeight: 1.8 }}>{s}</div>
                ))}
              </div>
            )}
            {tool.notebooks && (
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius)", padding: "12px 14px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginBottom: 8 }}>NOTEBOOKS</div>
                {tool.notebooks.map((n, i) => (
                  <div key={i} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", lineHeight: 1.8 }}>→ {n}</div>
                ))}
              </div>
            )}
          </div>
          {tool.url2 && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: "var(--radius)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginRight: 8 }}>API ENDPOINT:</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)" }}>{tool.url2}</span>
            </div>
          )}
        </div>
      )}

      {/* Full Flow */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: 12 }}>// DATA FLOW — HOW ALL 5 TOOLS CONNECT</p>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius2)", overflow: "hidden" }}>
          {flow.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
              borderBottom: i < flow.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", minWidth: 20 }}>{f.n}</span>
              <span style={{ background: f.fromC, color: f.fromT, fontFamily: "var(--mono)", fontSize: 11, padding: "2px 8px", borderRadius: 4 }}>{f.from}</span>
              <span style={{ color: "var(--text3)", fontSize: 11 }}>→</span>
              <span style={{ background: f.toC, color: f.toT, fontFamily: "var(--mono)", fontSize: 11, padding: "2px 8px", borderRadius: 4 }}>{f.to}</span>
              <span style={{ fontSize: 12, color: "var(--text2)", flex: 1 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Retrain Guide */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", marginBottom: 12 }}>// HOW TO RETRAIN THE MODEL (MAKE IT SMARTER)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {retrainSteps.map(s => (
            <div key={s.n} style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius2)", padding: "1.25rem 1.5rem",
              display: "flex", gap: 20,
            }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, color: "rgba(0,255,136,0.2)", flexShrink: 0, lineHeight: 1.2 }}>{s.n}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: s.code ? 10 : 0 }}>{s.desc}</p>
                {s.code && (
                  <pre style={{
                    background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", padding: "10px 12px",
                    fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)",
                    overflow: "auto",
                  }}>{s.code}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, text }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius)", padding: "12px 14px" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}
