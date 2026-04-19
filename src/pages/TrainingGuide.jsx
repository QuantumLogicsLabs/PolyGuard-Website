import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardDrive,
  Cloud,
  Globe,
  Database,
  Zap,
  Plus,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Info,
  CheckCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   SECTION: Google Colab explained
───────────────────────────────────────────────────────────── */
const COLAB_STEPS = [
  {
    n: "01",
    title: "Go to colab.google.com",
    desc: 'Open your browser and navigate to colab.google.com. Sign in with a Google account — the same one you use for Gmail or Drive. Click "New notebook" or open an existing .ipynb file from GitHub or Drive.',
  },
  {
    n: "02",
    title: 'Enable GPU: Runtime → Change runtime type → "T4 GPU"',
    desc: "By default Colab uses CPU. For training ML models you MUST switch to GPU. In the menu bar: Runtime → Change runtime type → select T4 GPU → Save. You'll see a green indicator in the top-right showing GPU is connected.",
  },
  {
    n: "03",
    title: "Run cells with the ▶ button or Shift+Enter",
    desc: 'Each grey box in a notebook is a "cell". Click the ▶ play button on its left side to run it, or press Shift+Enter on your keyboard. Cells run top to bottom — always run them in order. A spinning circle means it\'s still running.',
  },
  {
    n: "04",
    title: "Watch for errors in red",
    desc: 'If a cell fails, the output turns red with an error message. Read the last line — it usually tells you exactly what went wrong. Common fix: re-run "Run all" from the top, since some cells depend on previous ones.',
  },
  {
    n: "05",
    title: "Keep the tab open while training",
    desc: "Colab will disconnect if you close the tab or if your laptop sleeps. If this happens during training, model checkpoints saved to Drive are safe — you can resume from the last checkpoint.",
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION: Google Drive explained
───────────────────────────────────────────────────────────── */
const DRIVE_FOLDER = [
  { path: "MyDrive/PolyGuard/", desc: "Root folder created automatically" },
  {
    path: "  01-data/train.csv",
    desc: "Cleaned dataset — output of 02_data_cleaning.ipynb",
  },
  {
    path: "  03-models/checkpoints/",
    desc: "Saved after each training epoch (safety net)",
  },
  {
    path: "  03-models/polyguard_model/",
    desc: "Final trained model — used by the API",
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION: ngrok explained
───────────────────────────────────────────────────────────── */
const NGROK_STEPS = [
  {
    n: "01",
    title: "Create a free account at ngrok.com",
    desc: "Go to ngrok.com and sign up. It's free — no credit card needed. You get one permanent subdomain and unlimited temporary tunnels.",
  },
  {
    n: "02",
    title: "Copy your authtoken from the dashboard",
    desc: 'After signing in, go to the ngrok dashboard → "Your Authtoken". It looks like: 2abc123xyz_XXXXXXXXXXXX. Copy it.',
  },
  {
    n: "03",
    title: "Add the token as a Colab secret",
    desc: 'In Colab, click the 🔑 key icon in the left sidebar → "Add new secret" → Name it NGROK_TOKEN → paste your authtoken → toggle "Notebook access" on.',
  },
  {
    n: "04",
    title: "Run 05_api.ipynb — a URL appears in the output",
    desc: 'After the ngrok cell runs, look for a line like: "Public URL: https://xxxx-xxxx.ngrok-free.app". That\'s your live API endpoint. Copy it.',
  },
  {
    n: "05",
    title: "Test it with curl or the PolyGuard website",
    desc: 'Paste the URL into curl or Postman: curl -X POST https://xxxx.ngrok-free.app/analyze -H "Content-Type: application/json" -d \'{"code": "your code here", "language": "python"}\'. You should get a JSON response back.',
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION: How to train the model
───────────────────────────────────────────────────────────── */
const TRAIN_MECHANISM = [
  {
    step: "1",
    title: "Tokenization",
    color: "var(--cyan)",
    desc: "The code text is converted into numbers. CodeBERT's tokenizer splits code into sub-word tokens — keywords, operators, identifiers — and maps each to an integer ID. Max 256 tokens; longer code is truncated.",
    code: `tokenizer("def get_user(name):\\n  return db.query(name)")
# → [101, 4532, 1996, 3435, 102, ...]  (integer IDs)`,
  },
  {
    step: "2",
    title: "Forward Pass",
    color: "var(--green)",
    desc: "Token IDs pass through 12 transformer layers. Each layer uses attention to understand relationships between tokens — e.g. that 'name' connects to 'query()' in a dangerous way. The [CLS] token at position 0 accumulates the full context.",
    code: `# CodeBERT base: 125M parameters
# 12 transformer layers × 768 hidden dims
# [CLS] token → classification head → 2 logits`,
  },
  {
    step: "3",
    title: "Classification Head",
    color: "var(--purple)",
    desc: "A linear layer maps the 768-dim [CLS] vector to 2 logits (one per class). Softmax converts logits to probabilities. The class with higher probability wins: 0 = clean, 1 = vulnerable.",
    code: `logits = model(input_ids)         # [batch, 2]
probs = softmax(logits, dim=-1)   # [clean_p, vuln_p]
# e.g. [0.123, 0.877] → VULNERABLE`,
  },
  {
    step: "4",
    title: "Loss & Backprop",
    color: "var(--amber)",
    desc: "Cross-entropy loss measures how wrong the prediction was vs the true label. Gradients flow backward through all 12 layers, nudging weights slightly in the right direction. After 3 epochs over the full dataset, the model has seen every example 3 times.",
    code: `loss = cross_entropy(logits, labels)
loss.backward()     # compute gradients
optimizer.step()    # update weights
# Repeat ~3x the dataset size`,
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION: How to add more datasets
───────────────────────────────────────────────────────────── */
const NEW_DATASETS = [
  {
    name: "bigvul",
    hf: "VHLabDukeECE/bigvul",
    desc: "Large C/C++ vulnerability dataset. 188k functions, real CVEs. Best for expanding the current model.",
    label_col: "vul (0/1)",
    code_col: "func_before",
    accent: "var(--cyan)",
  },
  {
    name: "draper_vdisc",
    hf: "umarbutool/draper_vdisc_cc",
    desc: "Draper Labs dataset. C/C++ functions labeled for buffer overflow, resource management, arithmetic errors.",
    label_col: "target (0/1)",
    code_col: "code",
    accent: "var(--green)",
  },
  {
    name: "code_search_net",
    hf: "code_search_net",
    desc: "Clean code in Python, JS, Java, PHP, Ruby, Go. Use to add negative (non-vulnerable) examples in more languages.",
    label_col: "Manually add label=0",
    code_col: "func_code_string",
    accent: "var(--purple)",
  },
  {
    name: "CTF writeups / custom",
    hf: null,
    desc: "Collect vulnerable code from CTF challenges, GitHub security advisories, or your own examples. Label them manually (1 = vulnerable) and add them to train.csv.",
    label_col: "Manual",
    code_col: "Manual",
    accent: "var(--orange)",
  },
];

const ADD_DATASET_STEPS = [
  "Open 01_data_collection.ipynb in Colab.",
  'Add a new cell at the bottom: ds_new = load_dataset("VHLabDukeECE/bigvul")',
  "Convert to a DataFrame: df_new = pd.DataFrame(ds_new['train'])",
  'Rename columns to match the schema: df_new = df_new.rename(columns={"func_before": "code", "vul": "label"})',
  'Keep only needed columns: df_new = df_new[["code", "label"]]',
  "Run 02_data_cleaning.ipynb — it will merge and deduplicate automatically.",
  "Re-run 03_train_model.ipynb with the larger dataset. Expect longer training time.",
];

/* ─────────────────────────────────────────────────────────────
   SECTION: How to improve the scorer
───────────────────────────────────────────────────────────── */
const SCORER_IMPROVEMENTS = [
  {
    title: "Add more vulnerability keyword → tip mappings",
    difficulty: "Easy",
    diffColor: "var(--green)",
    desc: "The suggestions dict in 04_scorer.ipynb maps keywords like 'sqli' and 'xss' to fix recommendations. Open the dict and add new entries for any vulnerability type you care about.",
    code: `# In 04_scorer.ipynb — suggestions dict
suggestions = {
    "sqli":    "Use parameterized queries.",
    "xss":     "Sanitize all user inputs.",
    # ── Add your own ──
    "path_traversal": "Validate and sanitize file paths. Use os.path.realpath().",
    "insecure_deserial": "Avoid pickle/eval. Use JSON with schema validation.",
    "ssrf":    "Whitelist allowed domains. Never fetch arbitrary user-supplied URLs.",
}`,
  },
  {
    title: "Add new languages to language_tips",
    difficulty: "Easy",
    diffColor: "var(--green)",
    desc: "The language_tips dict shows general best-practice advice per language. Add a new language key and a list of tips — they'll show up automatically in the API response for that language.",
    code: `# In 04_scorer.ipynb — language_tips dict
language_tips = {
    "python": ["Use f-strings.", "Use 'with open()'."],
    # ── Add your own ──
    "rust": [
        "Avoid unsafe blocks unless absolutely necessary.",
        "Use Result<T, E> for error handling instead of panics.",
        "Prefer owned types over raw pointers.",
    ],
    "kotlin": [
        "Use data classes for immutable value objects.",
        "Avoid !! (null assertion). Use safe calls and elvis operator.",
    ],
}`,
  },
  {
    title: "Tune the score formula",
    difficulty: "Medium",
    diffColor: "var(--amber)",
    desc: "The current formula maps clean_confidence directly to a 0–10 score. If your model is miscalibrated (everything scores 5–6), adjust the formula to amplify differences.",
    code: `# Current formula in get_score()
score = round(clean_confidence * 10, 2)

# Alternative: amplify the signal with a power curve
# Scores below 50% confidence become much lower
import math
score = round(10 * (clean_confidence ** 1.5), 2)

# Or use a threshold-based approach
if vuln_confidence > 0.8:
    score = round(clean_confidence * 4, 2)      # 0–4 range
elif vuln_confidence > 0.5:
    score = round(4 + clean_confidence * 3, 2)  # 4–7 range
else:
    score = round(7 + clean_confidence * 3, 2)  # 7–10 range`,
  },
  {
    title: "Add regex-based rule detection",
    difficulty: "Medium",
    diffColor: "var(--amber)",
    desc: "The ML model catches semantic patterns, but simple regex rules are 100% precise for known signatures. Combine both: if regex fires, add to findings regardless of model confidence.",
    code: `import re

# Add to get_score() — after model inference
RULES = {
    "sqli":    r'(execute|query)\\(.*[+%].*\\)',
    "secrets": r'(password|api_key|secret)\\s*=\\s*["\\\'][^"\\\']{6,}["\\\']',
    "eval":    r'\\beval\\s*\\(',
    "pickle":  r'pickle\\.loads?\\(',
}

rule_findings = []
for vuln_type, pattern in RULES.items():
    if re.search(pattern, code_text, re.IGNORECASE):
        rule_findings.append(f"[RULE] {vuln_type} pattern detected")

findings = model_findings + rule_findings  # merge both sources`,
  },
  {
    title: "Retrain on a larger / more balanced dataset",
    difficulty: "Hard",
    diffColor: "var(--orange)",
    desc: "The most powerful improvement. If the model scores everything as 'medium risk', it's likely seeing an imbalanced dataset (far more clean samples than vulnerable). Fix this by oversampling vulnerable examples or using weighted loss.",
    code: `# In 03_train_model.ipynb — TrainingArguments
# Option 1: class weights in loss function
from torch.nn import CrossEntropyLoss

n_vuln  = (df['label'] == 1).sum()
n_clean = (df['label'] == 0).sum()
weight = torch.tensor([1.0, n_clean / n_vuln])   # up-weight vulnerable

# Pass to Trainer via compute_loss override
class WeightedTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        loss = CrossEntropyLoss(weight=weight.to(model.device))(outputs.logits, labels)
        return (loss, outputs) if return_outputs else loss`,
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function TrainingGuide() {
  const [tab, setTab] = useState("colab");

  const TABS = [
    { id: "colab", label: "Google Colab", icon: Cloud },
    { id: "drive", label: "Google Drive", icon: HardDrive },
    { id: "ngrok", label: "ngrok", icon: Globe },
    { id: "train", label: "How Training Works", icon: Zap },
    { id: "datasets", label: "Add Datasets", icon: Plus },
    { id: "scorer", label: "Improve Scorer", icon: TrendingUp },
  ];

  return (
    <div className="page page-container--md">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div className="label-cyan page-header__eyebrow">// TRAINING GUIDE</div>
        <h2 className="page-header__title">Run, Train & Improve PolyGuard</h2>
        <p className="page-header__sub">
          A plain-English walkthrough of every tool in the workflow — Google
          Colab, Drive, and ngrok — followed by a deep-dive into how the model
          actually trains, how to add new data, and how to make the scorer
          smarter.
        </p>
      </motion.div>

      {/* ── Tab bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 24,
          padding: "10px",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
        }}
      >
        {TABS.map((t) => {
          const TabIcon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 14px",
                borderRadius: "var(--r2)",
                border: active
                  ? "1px solid var(--accent-border)"
                  : "1px solid transparent",
                background: active ? "var(--accent-dim)" : "transparent",
                color: active ? "var(--accent-text)" : "var(--text3)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <TabIcon size={13} />
              {t.label}
            </button>
          );
        })}
      </motion.div>

      {/* ── Tab panels ── */}
      <AnimatePresence mode="wait">
        {/* ── COLAB ── */}
        {tab === "colab" && (
          <motion.div
            key="colab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="label mb-label">// WHAT IS GOOGLE COLAB?</div>
            <div
              className="admonition admonition--note"
              style={{ marginBottom: 20 }}
            >
              <Info
                size={15}
                color="var(--accent-text)"
                className="admonition__icon"
              />
              <div>
                <div className="admonition__title">No setup needed</div>
                Google Colab is a free, cloud-based coding environment that runs
                in your browser. You don't install anything — Python, PyTorch,
                and all libraries are already available. Colab also gives you a
                free GPU (NVIDIA T4) that makes model training 10–50x faster
                than a regular laptop.
              </div>
            </div>

            <div className="label mb-label">// HOW TO USE IT</div>
            <div className="flex-col--gap" style={{ marginBottom: 20 }}>
              {COLAB_STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="step-card"
                >
                  <span className="step-card__num">{s.n}</span>
                  <div>
                    <h4 className="step-card__title">{s.title}</h4>
                    <p className="step-card__desc">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="https://colab.google.com"
              target="_blank"
              rel="noreferrer"
              className="link-row"
              style={{ textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Cloud size={14} color="var(--accent)" />
                <span style={{ fontSize: 13 }}>Open Google Colab</span>
              </div>
              <ExternalLink size={12} color="var(--text3)" />
            </a>
          </motion.div>
        )}

        {/* ── DRIVE ── */}
        {tab === "drive" && (
          <motion.div
            key="drive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="label mb-label">
              // WHAT IS GOOGLE DRIVE USED FOR?
            </div>
            <div
              className="admonition admonition--note"
              style={{ marginBottom: 20 }}
            >
              <Info
                size={15}
                color="var(--accent-text)"
                className="admonition__icon"
              />
              <div>
                <div className="admonition__title">Persistent storage</div>
                Colab notebooks are temporary — when a session ends, all files
                inside the virtual machine are deleted. Google Drive is
                permanent. Mounting Drive inside Colab lets notebooks save and
                load files that survive between sessions. All PolyGuard
                notebooks use Drive for datasets and model weights.
              </div>
            </div>

            <div className="label mb-label">// HOW TO MOUNT DRIVE IN COLAB</div>
            <div className="code-pane" style={{ marginBottom: 20 }}>
              <div className="code-pane__header">
                <div className="mac-dots">
                  <span className="mac-dot mac-dot--red" />
                  <span className="mac-dot mac-dot--amber" />
                  <span className="mac-dot mac-dot--green" />
                </div>
                <span className="meta-text">Python — runs in any notebook</span>
              </div>
              <pre className="code-pane__body">
                <span style={{ color: "var(--accent-text)" }}>from</span>
                {" google.colab "}
                <span style={{ color: "var(--accent-text)" }}>import</span>
                {" drive\n"}
                {"drive.mount("}
                <span style={{ color: "var(--green)" }}>'/content/drive'</span>
                {")\n\n"}
                <span style={{ color: "var(--text3)" }}>
                  {"# A popup appears — click 'Connect to Google Drive'"}
                </span>
                {"\n"}
                <span style={{ color: "var(--text3)" }}>
                  {"# Your Drive is now accessible at /content/drive/MyDrive/"}
                </span>
              </pre>
            </div>

            <div className="label mb-label">
              // POLYGUARD FOLDER STRUCTURE IN YOUR DRIVE
            </div>
            <div className="code-pane" style={{ marginBottom: 20 }}>
              <div className="code-pane__header">
                <div className="mac-dots">
                  <span className="mac-dot mac-dot--red" />
                  <span className="mac-dot mac-dot--amber" />
                  <span className="mac-dot mac-dot--green" />
                </div>
                <span className="meta-text">Google Drive folder layout</span>
              </div>
              <pre className="code-pane__body">
                {DRIVE_FOLDER.map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 24 }}>
                    <span
                      style={{ color: "var(--accent-text)", minWidth: 340 }}
                    >
                      {row.path}
                    </span>
                    <span style={{ color: "var(--text3)" }}>← {row.desc}</span>
                  </div>
                ))}
              </pre>
            </div>

            <div
              className="admonition admonition--tip"
              style={{ marginBottom: 16 }}
            >
              <Lightbulb
                size={15}
                color="var(--green)"
                className="admonition__icon"
              />
              <div>
                <div className="admonition__title">Tip</div>
                You can browse your Drive at drive.google.com to verify files
                were saved. If train.csv doesn't appear after cleaning, re-run
                the save cell in 02_data_cleaning.ipynb.
              </div>
            </div>

            <a
              href="https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV"
              target="_blank"
              rel="noreferrer"
              className="link-row"
              style={{ textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <HardDrive size={14} color="var(--green)" />
                <span style={{ fontSize: 13 }}>
                  View PolyGuard dataset on Drive
                </span>
              </div>
              <ExternalLink size={12} color="var(--text3)" />
            </a>
          </motion.div>
        )}

        {/* ── NGROK ── */}
        {tab === "ngrok" && (
          <motion.div
            key="ngrok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="label mb-label">// WHAT IS NGROK?</div>
            <div
              className="admonition admonition--note"
              style={{ marginBottom: 20 }}
            >
              <Info
                size={15}
                color="var(--accent-text)"
                className="admonition__icon"
              />
              <div>
                <div className="admonition__title">Temporary public tunnel</div>
                Colab runs on a Google server that's not accessible from the
                internet. ngrok creates a secure tunnel from a public HTTPS URL
                to that server. When you run the API notebook, ngrok gives you a
                URL like https://xxxx.ngrok-free.app — anyone can hit that URL
                and reach your Colab machine. The URL only works while the
                notebook is running.
              </div>
            </div>

            <div className="label mb-label">// SETUP STEPS</div>
            <div className="flex-col--gap" style={{ marginBottom: 20 }}>
              {NGROK_STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="step-card"
                >
                  <span className="step-card__num">{s.n}</span>
                  <div>
                    <h4 className="step-card__title">{s.title}</h4>
                    <p className="step-card__desc">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="label mb-label">// EXAMPLE CURL TEST</div>
            <div className="code-pane" style={{ marginBottom: 20 }}>
              <div className="code-pane__header">
                <div className="mac-dots">
                  <span className="mac-dot mac-dot--red" />
                  <span className="mac-dot mac-dot--amber" />
                  <span className="mac-dot mac-dot--green" />
                </div>
                <span className="meta-text">
                  Shell — replace URL with your ngrok URL
                </span>
              </div>
              <pre className="code-pane__body">
                <span style={{ color: "var(--green)" }}>curl</span>
                {" -X POST https://xxxx-xxxx.ngrok-free.app/analyze \\\n"}
                {"  "}
                <span style={{ color: "var(--green)" }}>-H</span>
                {' "Content-Type: application/json" \\\n'}
                {"  "}
                <span style={{ color: "var(--green)" }}>-d</span>
                {" '{\n"}
                {"    "}
                <span style={{ color: "var(--purple)" }}>"code"</span>
                {": "}
                <span style={{ color: "var(--amber)" }}>
                  "query = 'SELECT * FROM users WHERE id=' + user_id"
                </span>
                {",\n"}
                {"    "}
                <span style={{ color: "var(--purple)" }}>"language"</span>
                {": "}
                <span style={{ color: "var(--amber)" }}>"python"</span>
                {"\n  }'"}
              </pre>
            </div>

            <div className="admonition admonition--warning">
              <AlertTriangle
                size={15}
                color="var(--amber)"
                className="admonition__icon"
              />
              <div>
                <div className="admonition__title">Temporary URL</div>
                The ngrok URL is different every time you restart. For a
                permanent endpoint, use upload_to_hf_hub.ipynb to deploy to
                HuggingFace Spaces — the production URL never changes.
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HOW TRAINING WORKS ── */}
        {tab === "train" && (
          <motion.div
            key="train"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="label mb-label">
              // MECHANISM — WHAT HAPPENS INSIDE TRAINING
            </div>
            <div
              className="admonition admonition--note"
              style={{ marginBottom: 20 }}
            >
              <Info
                size={15}
                color="var(--accent-text)"
                className="admonition__icon"
              />
              <div>
                <div className="admonition__title">
                  Fine-tuning, not training from scratch
                </div>
                PolyGuard doesn't train CodeBERT from zero — that would require
                months and thousands of dollars. Instead it fine-tunes: start
                with a model that already understands code structure (CodeBERT,
                trained by Microsoft on 6M code files), then show it labeled
                vulnerability examples so it learns the security-specific
                patterns. This takes 20–40 minutes on a free GPU.
              </div>
            </div>

            <div className="flex-col--gap">
              {TRAIN_MECHANISM.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "280px 1fr",
                    gap: 0,
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${step.color}`,
                    borderRadius: "var(--r3)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "1.5rem",
                      borderRight: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        color: step.color,
                        letterSpacing: "0.12em",
                        marginBottom: 8,
                      }}
                    >
                      STEP {step.step}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--display)",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: 10,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "var(--text2)",
                        lineHeight: 1.8,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                  <div style={{ background: "var(--bg1)" }}>
                    <div
                      style={{
                        padding: "7px 14px",
                        background: "var(--bg3)",
                        borderBottom: "1px solid var(--border)",
                        fontFamily: "var(--mono)",
                        fontSize: 9.5,
                        color: "var(--text3)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      PYTHON
                    </div>
                    <pre
                      style={{
                        padding: "1.1rem",
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
          </motion.div>
        )}

        {/* ── ADD DATASETS ── */}
        {tab === "datasets" && (
          <motion.div
            key="datasets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="label mb-label">// RECOMMENDED DATASETS TO ADD</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {NEW_DATASETS.map((ds, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="doc-card"
                  style={{ borderTop: `2px solid ${ds.accent}` }}
                >
                  <div className="doc-card__label" style={{ color: ds.accent }}>
                    {ds.hf ? "HUGGINGFACE DATASET" : "CUSTOM DATA"}
                  </div>
                  <div className="doc-card__title">{ds.name}</div>
                  <p className="doc-card__desc" style={{ marginBottom: 12 }}>
                    {ds.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      className="file-tag"
                      style={{
                        background: `${ds.accent}10`,
                        border: `1px solid ${ds.accent}22`,
                        color: ds.accent,
                      }}
                    >
                      label: {ds.label_col}
                    </span>
                    <span
                      className="file-tag"
                      style={{
                        background: `${ds.accent}10`,
                        border: `1px solid ${ds.accent}22`,
                        color: ds.accent,
                      }}
                    >
                      code: {ds.code_col}
                    </span>
                  </div>
                  {ds.hf && (
                    <a
                      href={`https://huggingface.co/datasets/${ds.hf}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: ds.accent,
                        textDecoration: "none",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      huggingface.co/datasets/{ds.hf} <ExternalLink size={10} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="label mb-label">
              // HOW TO ADD A DATASET (STEP BY STEP)
            </div>
            <div className="flex-col--gap" style={{ marginBottom: 20 }}>
              {ADD_DATASET_STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="step-card"
                >
                  <span className="step-card__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="step-card__desc" style={{ margin: 0 }}>
                    {s}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="label mb-label">// MERGE CODE EXAMPLE</div>
            <div className="code-pane">
              <div className="code-pane__header">
                <div className="mac-dots">
                  <span className="mac-dot mac-dot--red" />
                  <span className="mac-dot mac-dot--amber" />
                  <span className="mac-dot mac-dot--green" />
                </div>
                <span className="meta-text">
                  Python — add this to 01_data_collection.ipynb
                </span>
              </div>
              <pre className="code-pane__body">
                <span style={{ color: "var(--accent-text)" }}>from</span>
                {" datasets "}
                <span style={{ color: "var(--accent-text)" }}>import</span>
                {" load_dataset\n"}
                <span style={{ color: "var(--accent-text)" }}>import</span>
                {" pandas as pd\n\n"}
                <span style={{ color: "var(--text3)" }}>
                  {"# Load new dataset"}
                </span>
                {"\n"}
                {"ds_new = load_dataset("}
                <span style={{ color: "var(--green)" }}>
                  '"VHLabDukeECE/bigvul"'
                </span>
                {")\n"}
                {"df_new = pd.DataFrame(ds_new["}
                <span style={{ color: "var(--green)" }}>'train'</span>
                {"])\n\n"}
                <span style={{ color: "var(--text3)" }}>
                  {"# Align column names to PolyGuard schema"}
                </span>
                {"\n"}
                {"df_new = df_new.rename(columns={\n"}
                {"  "}
                <span style={{ color: "var(--green)" }}>"func_before"</span>
                {": "}
                <span style={{ color: "var(--green)" }}>"code"</span>
                {",\n"}
                {"  "}
                <span style={{ color: "var(--green)" }}>"vul"</span>
                {": "}
                <span style={{ color: "var(--green)" }}>"label"</span>
                {"\n})\n"}
                {"df_new = df_new[["}
                <span style={{ color: "var(--green)" }}>"code"</span>
                {", "}
                <span style={{ color: "var(--green)" }}>"label"</span>
                {"]]\n\n"}
                <span style={{ color: "var(--text3)" }}>
                  {"# Load existing data and merge"}
                </span>
                {"\n"}
                {"df_existing = pd.read_csv("}
                <span style={{ color: "var(--green)" }}>
                  "'/content/drive/MyDrive/PolyGuard/01-data/train.csv'"
                </span>
                {")\n"}
                {"df_merged = pd.concat([df_existing, df_new], ignore_index="}
                <span style={{ color: "var(--accent-text)" }}>True</span>
                {")\n"}
                {"df_merged = df_merged.drop_duplicates(subset=["}
                <span style={{ color: "var(--green)" }}>"code"</span>
                {"])\n\n"}
                {"print("}
                <span style={{ color: "var(--green)" }}>
                  f'"Merged: {"{len(df_merged)}"} total rows"'
                </span>
                {")"}
              </pre>
            </div>
          </motion.div>
        )}

        {/* ── IMPROVE SCORER ── */}
        {tab === "scorer" && (
          <motion.div
            key="scorer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="label mb-label">// WAYS TO IMPROVE THE SCORER</div>
            <div className="flex-col--gap">
              {SCORER_IMPROVEMENTS.map((imp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r3)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid var(--border)",
                      background: "var(--bg3)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--display)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {imp.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9.5,
                        letterSpacing: "0.1em",
                        color: imp.diffColor,
                        background: `${imp.diffColor}14`,
                        border: `1px solid ${imp.diffColor}28`,
                        borderRadius: "var(--r)",
                        padding: "2px 8px",
                        flexShrink: 0,
                      }}
                    >
                      {imp.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "1.1rem 1.25rem" }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text2)",
                        lineHeight: 1.8,
                        marginBottom: 14,
                      }}
                    >
                      {imp.desc}
                    </p>
                    <div className="code-pane">
                      <div className="code-pane__header">
                        <div className="mac-dots">
                          <span className="mac-dot mac-dot--red" />
                          <span className="mac-dot mac-dot--amber" />
                          <span className="mac-dot mac-dot--green" />
                        </div>
                        <span className="meta-text">PYTHON</span>
                      </div>
                      <pre className="code-pane__body">{imp.code}</pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
