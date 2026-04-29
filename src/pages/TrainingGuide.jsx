import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Animation variants ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Data ─────────────────────────────────────────────────
const APPROACHES = [
  {
    id: "incremental",
    label: "Add New Data Only",
    tag: "RECOMMENDED",
    tagColor: "var(--green)",
    tagBg: "rgba(63, 185, 80, 0.08)",
    tagBorder: "rgba(63, 185, 80, 0.22)",
    time: "20–40 min",
    icon: "⚡",
    when: "You found new vulnerable code, added more CVEs, or want to teach it a new language pattern.",
    steps: [
      {
        n: "01",
        title: "Collect new samples",
        desc: "Add new vulnerable/fixed code pairs to your CSV. Each row needs: vulnerable_code, fixed_code, language, cwe_id.",
        code: `# Add to 01-data/new_samples.csv
# Format: same columns as crossvul_dataset.csv
# vulnerable_code, fixed_code, language, cwe_id, cwe_description`,
        lang: "python",
      },
      {
        n: "02",
        title: "Rebuild labeled dataset",
        desc: "Merge new data with the existing labeled_dataset.csv. The script deduplicates and shuffles automatically.",
        code: `import pandas as pd

# Load existing labeled data
existing = pd.read_csv(f'{CLEAN_DATA}/labeled_dataset.csv')

# Load new raw pairs
new_raw = pd.read_csv(f'{DATA}/new_samples.csv')

# Expand pairs into labeled samples
vuln_new = pd.DataFrame({'code': new_raw['vulnerable_code'], 'language': new_raw['language'], 'label': 1, 'cwe_id': new_raw['cwe_id'], 'cwe_description': new_raw['cwe_description']})
clean_new = pd.DataFrame({'code': new_raw['fixed_code'], 'language': new_raw['language'], 'label': 0, 'cwe_id': new_raw['cwe_id'], 'cwe_description': new_raw['cwe_description']})

new_labeled = pd.concat([vuln_new, clean_new], ignore_index=True)

# Merge with existing
combined = pd.concat([existing, new_labeled], ignore_index=True)
combined = combined.drop_duplicates(subset=['code']).sample(frac=1, random_state=42)
combined.to_csv(f'{CLEAN_DATA}/labeled_dataset.csv', index=False)

print(f"Dataset: {len(existing)} → {len(combined)} samples (+{len(combined)-len(existing)})")`,
        lang: "python",
      },
      {
        n: "03",
        title: "Fine-tune FROM current production model",
        desc: "Load the existing production model (not CodeBERT base) so you keep everything it already learned. Use a lower LR to avoid forgetting.",
        code: `from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer

# ← Load FROM production, not from codebert-base
tokenizer = AutoTokenizer.from_pretrained('/content/polyguard_model', local_files_only=True)
model     = AutoModelForSequenceClassification.from_pretrained('/content/polyguard_model', local_files_only=True)

# Use lower LR than original training to avoid catastrophic forgetting
training_args = TrainingArguments(
    output_dir                  = f'{MODELS}/v6_incremental',
    num_train_epochs            = 3,           # fewer epochs — already trained
    per_device_train_batch_size = 16,
    learning_rate               = 5e-6,        # ← much lower than original 2e-5
    warmup_ratio                = 0.05,
    weight_decay                = 0.01,
    eval_strategy               = 'epoch',
    save_strategy               = 'epoch',
    load_best_model_at_end      = True,
    metric_for_best_model       = 'f1',
    save_total_limit            = 2,
    fp16                        = True,
    report_to                   = 'none',
)`,
        lang: "python",
      },
      {
        n: "04",
        title: "Save and deploy",
        desc: "Save the updated model over production, push to HF Hub, then restart the Space.",
        code: `# Save
model.save_pretrained(f'{MODELS}/production')
tokenizer.save_pretrained(f'{MODELS}/production')

# Push to HF Hub
from huggingface_hub import HfApi, login
login(token="your_hf_token")
api = HfApi()
api.upload_folder(
    folder_path = f'{MODELS}/production',
    repo_id     = "MUHAMMADSAADAMIN/PolyGuard",
    repo_type   = "model",
)
print("✓ Model updated on HF Hub")

# Restart Space via API
import requests
r = requests.post(
    "https://huggingface.co/api/spaces/MUHAMMADSAADAMIN/polyguard-api/restart",
    headers={"Authorization": f"Bearer your_hf_token"}
)
print(f"Space restart: {r.status_code}")`,
        lang: "python",
      },
    ],
  },
  {
    id: "rules",
    label: "Add Static Rules Only",
    tag: "INSTANT",
    tagColor: "var(--accent)",
    tagBg: "var(--accent-dim)",
    tagBorder: "var(--accent-border)",
    time: "< 5 min",
    icon: "🔧",
    when: "You found a new vulnerability pattern that the model misses but has a clear syntactic signature.",
    steps: [
      {
        n: "01",
        title: "Identify the pattern",
        desc: "Find the regex that matches the vulnerable pattern. Test it on real examples before adding.",
        code: `import re

# Test your pattern before adding
pattern = r"yaml\\.load\\s*\\("   # example: unsafe yaml.load()
test_code = "data = yaml.load(open('config.yml'))"

if re.search(pattern, test_code, re.IGNORECASE):
    print("✓ Pattern matches")
else:
    print("✗ Pattern does not match — check regex")`,
        lang: "python",
      },
      {
        n: "02",
        title: "Add to VULN_RULES in app.py",
        desc: "Open app.py and add your pattern to the correct language section. Follow the existing tuple format.",
        code: `# In app.py, find VULN_RULES and add to the correct language:
VULN_RULES = {
    "python": [
        # ... existing rules ...

        # ← Add your new rule here:
        (r"yaml\\.load\\s*\\(",
         "Use yaml.safe_load() instead of yaml.load() to prevent code execution."),

        (r"tempfile\\.mktemp\\s*\\(",
         "Use tempfile.mkstemp() instead of mktemp() to avoid race conditions."),
    ],
}`,
        lang: "python",
      },
      {
        n: "03",
        title: "Add matching smart tip",
        desc: "Add a SMART_TIPS entry so the tip shown is specific to this finding.",
        code: `SMART_TIPS = {
    # ... existing tips ...

    # ← Add matching tip:
    "unsafe_yaml": "Replace yaml.load() with yaml.safe_load() — it disables Python object deserialization.",
    "insecure_temp": "Use tempfile.mkstemp() which atomically creates the file, preventing TOCTOU attacks.",
}

# Then in the rule scan loop, add the category tag:
elif "yaml" in message.lower():
    matched_categories.add("unsafe_yaml")`,
        lang: "python",
      },
      {
        n: "04",
        title: "Redeploy",
        desc: "Push updated app.py to the HF Space. No model retraining needed.",
        code: `from huggingface_hub import HfApi, login
login(token="your_hf_token")
api = HfApi()

api.upload_file(
    path_or_fileobj = '/tmp/hf_space/app.py',
    path_in_repo    = 'app.py',
    repo_id         = "MUHAMMADSAADAMIN/polyguard-api",
    repo_type       = "space",
)
print("✓ app.py updated — Space will rebuild in ~2 min")`,
        lang: "python",
      },
    ],
  },
  {
    id: "full",
    label: "Full Retrain from Scratch",
    tag: "NUCLEAR",
    tagColor: "var(--orange)",
    tagBg: "rgba(232, 131, 79, 0.08)",
    tagBorder: "rgba(232, 131, 79, 0.22)",
    time: "6–8 hours",
    icon: "☢️",
    when: "F1 drops below 0.75, you have a fundamentally new dataset, or the model is confidently wrong on obvious cases.",
    steps: [
      {
        n: "01",
        title: "When to actually do this",
        desc: "Full retrain is rarely needed. Only do it if: (a) incremental training made the model worse, (b) you changed the label scheme, or (c) F1 dropped below 0.75 on the sanity check.",
        code: `# Quick F1 check — if this is below 0.75, consider full retrain
from sklearn.metrics import f1_score
import numpy as np

model.eval()
all_preds, all_labels = [], []
for i in range(0, len(val_dataset), 32):
    batch = list(range(i, min(i+32, len(val_dataset))))
    ids   = torch.stack([val_dataset[j]['input_ids'] for j in batch]).to(device)
    mask  = torch.stack([val_dataset[j]['attention_mask'] for j in batch]).to(device)
    with torch.no_grad():
        logits = model(input_ids=ids, attention_mask=mask).logits
    all_preds.extend(torch.argmax(logits, 1).cpu().numpy())
    all_labels.extend([val_dataset[j]['labels'].item() for j in batch])

f1 = f1_score(all_labels, all_preds)
print(f"Current F1: {f1:.4f}")
print("→ Incremental retrain" if f1 >= 0.75 else "→ Consider full retrain")`,
        lang: "python",
      },
      {
        n: "02",
        title: "Rebuild dataset from scratch",
        desc: "Start from the raw CSV, re-expand pairs, re-augment, re-split. This ensures no stale data carries over.",
        code: `# Run EXTENDED CELL 2 and EXTENDED CELL 3 from the training notebook
# They rebuild labeled_dataset_augmented.csv fresh from raw data

# Key difference from incremental: start from codebert-base, NOT from production
MODEL_BASE = 'microsoft/codebert-base'   # ← back to base
tokenizer  = AutoTokenizer.from_pretrained(MODEL_BASE)
model      = AutoModelForSequenceClassification.from_pretrained(MODEL_BASE, num_labels=2)`,
        lang: "python",
      },
      {
        n: "03",
        title: "Train with full config",
        desc: "Use the full 20-epoch config with early stopping. This is the same as EXTENDED CELL 5.",
        code: `training_args = TrainingArguments(
    output_dir                  = f'{MODELS}/v6_full',
    num_train_epochs            = 20,
    per_device_train_batch_size = 16,
    learning_rate               = 2e-5,        # ← back to original LR
    lr_scheduler_type           = 'cosine',
    warmup_ratio                = 0.06,
    weight_decay                = 0.01,
    eval_strategy               = 'epoch',
    save_strategy               = 'epoch',
    load_best_model_at_end      = True,
    metric_for_best_model       = 'f1',
    save_total_limit            = 3,
    fp16                        = True,
    report_to                   = 'none',
)
# Add EarlyStoppingCallback — stops if F1 doesn't improve for 4 epochs
from transformers import EarlyStoppingCallback
callbacks = [EarlyStoppingCallback(early_stopping_patience=4)]`,
        lang: "python",
      },
    ],
  },
];

const DECISION_TREE = [
  {
    q: "Model gives wrong answer on obvious eval()/print()?",
    a: "Incremental retrain — lower LR, 3 epochs from production model",
  },
  {
    q: "New CWE pattern not being caught?",
    a: "Add a static rule first. If pattern is complex, also add augmented examples + incremental retrain",
  },
  {
    q: "New language support needed?",
    a: "Add 20+ labelled examples for that language to augmented set, incremental retrain",
  },
  {
    q: "F1 below 0.80 after incremental retrain?",
    a: "Full retrain from codebert-base with rebuilt dataset",
  },
  {
    q: "Model confidently wrong on known-clean code?",
    a: "Add more clean examples to augmented set, incremental retrain",
  },
  {
    q: "Only tips or scoring logic needs changing?",
    a: "Edit app.py only — no retraining needed at all",
  },
];

const CHECKLIST = [
  "Run sanity check (Cell 7) — all 16 tests passing",
  "F1 ≥ 0.88 on validation set",
  "print('Hello World') scores 0 vuln confidence",
  "eval(input()) scores > 95% vuln confidence",
  "Model saved to Google Drive production folder",
  "Model pushed to MUHAMMADSAADAMIN/PolyGuard on HF Hub",
  "HF Space restarted and showing Running status",
  "Live API /health returns 200",
  "curl test on /analyze returns expected verdict",
];

const KEY_CONCEPTS = [
  {
    title: "Catastrophic Forgetting",
    color: "var(--orange)",
    dimColor: "rgba(232, 131, 79, 0.08)",
    borderColor: "rgba(232, 131, 79, 0.2)",
    body: "When you train a neural network on new data with too high a learning rate, it overwrites weights that represented old knowledge. Fix: use 5e-6 LR for incremental runs instead of 2e-5.",
  },
  {
    title: "Learning Rate",
    color: "var(--accent)",
    dimColor: "var(--accent-dim)",
    borderColor: "var(--accent-border)",
    body: "Full retrain: 2e-5. Incremental: 5e-6. Think of LR as how aggressive each weight update is. Too high on a pretrained model = forgetting. Too low = no learning.",
  },
  {
    title: "Early Stopping",
    color: "var(--purple)",
    dimColor: "rgba(188, 140, 255, 0.08)",
    borderColor: "rgba(188, 140, 255, 0.2)",
    body: "Training stops automatically when validation F1 stops improving for 4 consecutive epochs. This prevents overfitting without having to manually watch the training logs.",
  },
  {
    title: "Data Augmentation",
    color: "var(--green)",
    dimColor: "rgba(63, 185, 80, 0.08)",
    borderColor: "rgba(63, 185, 80, 0.2)",
    body: "The 80 hand-curated examples repeated 5x add 400 high-confidence training samples. These anchor the model on obvious cases it must never get wrong.",
  },
  {
    title: "Static Rules as Fallback",
    color: "var(--text2)",
    dimColor: "rgba(139, 153, 167, 0.06)",
    borderColor: "rgba(139, 153, 167, 0.15)",
    body: "When the model's clean/vuln confidence are within 15% of each other (uncertain), scoring ignores the model and relies purely on regex pattern matching.",
  },
  {
    title: "Pair Expansion",
    color: "var(--teal)",
    dimColor: "rgba(57, 197, 207, 0.08)",
    borderColor: "rgba(57, 197, 207, 0.2)",
    body: "The CrossVUL dataset stores vulnerable + fixed code in one row. We expand each row into 2 labeled samples: vulnerable=1, fixed=0. This is why 9,313 raw rows become 18,626 training samples.",
  },
];

// ── Code block component ─────────────────────────────────
function CodeBlock({ code, lang = "python" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="code-pane" style={{ marginTop: 12 }}>
      <div className="code-pane__header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="mac-dots">
            <span className="mac-dot mac-dot--red" />
            <span className="mac-dot mac-dot--amber" />
            <span className="mac-dot mac-dot--green" />
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
              marginLeft: 4,
              letterSpacing: "0.08em",
            }}
          >
            {lang}
          </span>
        </div>
        <button
          className="tool-btn"
          onClick={copy}
          style={{
            padding: "2px 10px",
            fontSize: 10,
            minHeight: "unset",
            height: 24,
            transition: "all 0.2s",
            background: copied ? "rgba(63, 185, 80, 0.12)" : undefined,
            borderColor: copied ? "rgba(63, 185, 80, 0.3)" : undefined,
            color: copied ? "var(--green)" : undefined,
          }}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <pre className="code-pane__body" style={{ margin: 0, overflowX: "auto" }}>
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

// ── Step accordion ───────────────────────────────────────
function Step({ step }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} style={{ marginBottom: 6 }}>
      <div
        style={{
          background: open ? "var(--bg3)" : "var(--bg2)",
          border: `1px solid ${open ? "var(--border-strong)" : "var(--border)"}`,
          borderRadius: "var(--r2)",
          overflow: "hidden",
          transition: "all 0.22s ease",
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            textAlign: "left",
          }}
        >
          {/* Step number badge */}
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--accent-text)",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
              borderRadius: "var(--r)",
              padding: "2px 8px",
              flexShrink: 0,
              letterSpacing: "0.06em",
            }}
          >
            {step.n}
          </span>

          {/* Title */}
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: 13.5,
              fontWeight: 600,
              color: open ? "var(--text)" : "var(--text)",
              flex: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {step.title}
          </span>

          {/* Chevron */}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              color: "var(--text3)",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            ▾
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "0 16px 16px" }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text2)",
                    lineHeight: 1.75,
                    marginBottom: 0,
                    paddingTop: 2,
                  }}
                >
                  {step.desc}
                </p>
                <CodeBlock code={step.code} lang={step.lang} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Checklist item with interactive checkbox ─────────────
function ChecklistItem({ item }) {
  const [checked, setChecked] = useState(false);
  return (
    <motion.div
      variants={slideIn}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer",
        transition: "opacity 0.2s",
        opacity: checked ? 0.5 : 1,
      }}
      onClick={() => setChecked((c) => !c)}
    >
      {/* Checkbox */}
      <motion.div
        animate={{
          background: checked ? "rgba(63, 185, 80, 0.15)" : "var(--bg2)",
          borderColor: checked
            ? "rgba(63, 185, 80, 0.5)"
            : "var(--border-strong)",
        }}
        transition={{ duration: 0.15 }}
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          flexShrink: 0,
          border: "1.5px solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "backOut" }}
              style={{ fontSize: 10, color: "var(--green)" }}
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <span
        style={{
          fontSize: 13,
          color: checked ? "var(--text3)" : "var(--text2)",
          textDecoration: checked ? "line-through" : "none",
          transition: "all 0.2s",
        }}
      >
        {item}
      </span>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────
export default function TrainingGuide() {
  const [active, setActive] = useState("incremental");
  const approach = APPROACHES.find((a) => a.id === active);

  return (
    <div className="page" style={{ padding: "112px 176px" }}>
      {/* ── Header ────────────────────────────────────── */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
              borderRadius: "var(--r)",
              padding: "2px 8px",
            }}
          >
            Developer Docs
          </span>
          <span style={{ color: "var(--border-strong)", fontSize: 10 }}>·</span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9.5,
              color: "var(--text3)",
              letterSpacing: "0.1em",
            }}
          >
            Model Maintenance
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "var(--text)",
            marginBottom: 12,
          }}
        >
          Training Guide
        </h1>
        <p
          style={{
            color: "var(--text2)",
            fontSize: 14.5,
            lineHeight: 1.8,
            maxWidth: 560,
          }}
        >
          How to improve the PolyGuard model without retraining from scratch —
          incremental fine-tuning, static rule additions, and when a full
          retrain is actually needed.
        </p>
      </motion.div>

      {/* ── Golden rule admonition ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          gap: 14,
          background: "rgba(74, 158, 255, 0.06)",
          border: "1px solid var(--accent-border)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "var(--r3)",
          padding: "16px 18px",
          marginBottom: 32,
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
        <p
          style={{
            fontSize: 13,
            color: "var(--text2)",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          <span style={{ color: "var(--text)", fontWeight: 600 }}>
            The golden rule:{" "}
          </span>
          Never retrain from scratch unless incremental fine-tuning has already
          failed. The v5_extended model took 6+ hours to train. Loading it as
          the starting point and running 3 more epochs at a lower learning rate
          takes{" "}
          <span
            style={{
              color: "var(--accent-text)",
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}
          >
            20 minutes
          </span>{" "}
          and preserves everything it already learned.
        </p>
      </motion.div>

      {/* ── Approach selector ─────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 36 }}
      >
        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: "var(--display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.01em",
            marginBottom: 16,
          }}
        >
          Choose Your Approach
        </motion.h2>

        {/* Selector cards */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {APPROACHES.map((a) => {
            const isActive = active === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                style={{
                  background: isActive ? a.tagBg : "var(--bg2)",
                  border: `1px solid ${isActive ? a.tagBorder : "var(--border)"}`,
                  borderRadius: "var(--r2)",
                  padding: "14px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.22s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Active indicator stripe */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: a.tagColor,
                      borderRadius: "2px 2px 0 0",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--display)",
                      fontSize: 13,
                      color: isActive ? "var(--text)" : "var(--text2)",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {a.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 8.5,
                      fontWeight: 700,
                      color: a.tagColor,
                      letterSpacing: "0.1em",
                      background: a.tagBg,
                      border: `1px solid ${a.tagBorder}`,
                      borderRadius: "var(--r)",
                      padding: "2px 6px",
                      whiteSpace: "nowrap",
                      marginLeft: 6,
                    }}
                  >
                    {a.tag}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                  }}
                >
                  <span>⏱</span>
                  <span>{a.time}</span>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* When-to-use + steps panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* When to use */}
            <div
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${approach.tagColor}`,
                borderRadius: "var(--r2)",
                padding: "14px 18px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9.5,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 6,
                }}
              >
                When to use this
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  margin: 0,
                  lineHeight: 1.75,
                }}
              >
                {approach.when}
              </p>
            </div>

            {/* Steps */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
            >
              {approach.steps.map((step, i) => (
                <Step key={step.n} step={step} index={i} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* ── Decision tree ─────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 36 }}
      >
        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: "var(--display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.01em",
            marginBottom: 6,
          }}
        >
          Decision Tree
        </motion.h2>
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 13,
            color: "var(--text2)",
            marginBottom: 16,
            lineHeight: 1.7,
          }}
        >
          Not sure which approach to take? Find your situation below.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r3)",
            overflow: "hidden",
          }}
        >
          {DECISION_TREE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom:
                  i < DECISION_TREE.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
              }}
            >
              {/* Question */}
              <div
                style={{
                  padding: "13px 18px",
                  borderRight: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text3)",
                    flexShrink: 0,
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ?
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.q}
                </span>
              </div>

              {/* Answer */}
              <div
                style={{
                  padding: "13px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(74, 158, 255, 0.02)",
                }}
              >
                <span
                  style={{
                    color: "var(--accent)",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--accent-text)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.a}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Key concepts ──────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 36 }}
      >
        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: "var(--display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.01em",
            marginBottom: 16,
          }}
        >
          Key Concepts
        </motion.h2>

        <motion.div
          variants={stagger}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          {KEY_CONCEPTS.map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              whileHover={{ y: -2, transition: { duration: 0.18 } }}
              style={{
                background: "var(--bg2)",
                border: `1px solid var(--border)`,
                borderTop: `2px solid ${c.color}`,
                borderRadius: "var(--r2)",
                padding: "16px 18px",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Glow spot */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  left: -20,
                  width: 80,
                  height: 80,
                  background: c.color,
                  opacity: 0.04,
                  borderRadius: "50%",
                  filter: "blur(20px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10.5,
                  color: c.color,
                  fontWeight: 600,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {c.title}
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: "var(--text2)",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {c.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Pre-deploy checklist ──────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 36 }}
      >
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.01em",
            }}
          >
            Pre-Deploy Checklist
          </h2>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              color: "var(--green)",
              background: "rgba(63, 185, 80, 0.08)",
              border: "1px solid rgba(63, 185, 80, 0.2)",
              borderRadius: "var(--r)",
              padding: "2px 7px",
              letterSpacing: "0.1em",
            }}
          >
            INTERACTIVE
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 13,
            color: "var(--text2)",
            marginBottom: 16,
            lineHeight: 1.7,
          }}
        >
          Run through this after every training run before pushing to
          production. Click items to mark them complete.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r3)",
            padding: "6px 20px",
            overflow: "hidden",
          }}
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            {CHECKLIST.map((item, i) => (
              <ChecklistItem key={i} item={item} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Quick command reference ───────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 40 }}
      >
        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: "var(--display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.01em",
            marginBottom: 6,
          }}
        >
          Quick Command Reference
        </motion.h2>
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 13,
            color: "var(--text2)",
            marginBottom: 14,
            lineHeight: 1.7,
          }}
        >
          The complete incremental retrain flow in one block. Copy and run in
          your Colab notebook.
        </motion.p>
        <motion.div variants={fadeUp}>
          <CodeBlock
            lang="python"
            code={`# ── Incremental retrain (most common) ─────────────────────
# 1. Copy production model to local
shutil.copytree(f'{MODELS}/production', '/content/polyguard_model')

# 2. Load it
tokenizer = AutoTokenizer.from_pretrained('/content/polyguard_model', local_files_only=True)
model     = AutoModelForSequenceClassification.from_pretrained('/content/polyguard_model', local_files_only=True)

# 3. Train with low LR
training_args = TrainingArguments(
    output_dir       = f'{MODELS}/v6_incremental',
    num_train_epochs = 3,
    learning_rate    = 5e-6,    # ← key: low LR
    fp16             = True,
    eval_strategy    = 'epoch',
    load_best_model_at_end = True,
    metric_for_best_model  = 'f1',
    report_to        = 'none',
)

# 4. Save back to production
model.save_pretrained(f'{MODELS}/production')
tokenizer.save_pretrained(f'{MODELS}/production')

# 5. Push to HF Hub
api.upload_folder(folder_path=f'{MODELS}/production', repo_id="MUHAMMADSAADAMIN/PolyGuard", repo_type="model")

# 6. Restart Space
requests.post("https://huggingface.co/api/spaces/MUHAMMADSAADAMIN/polyguard-api/restart",
              headers={"Authorization": "Bearer your_token"})`}
          />
        </motion.div>
      </motion.section>
    </div>
  );
}
