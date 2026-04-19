import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Eraser,
  Brain,
  Star,
  Server,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   NOTEBOOK DATA
───────────────────────────────────────────────────────────── */
const NOTEBOOKS = [
  {
    id: "nb01",
    n: "01",
    filename: "01_data_collection.ipynb",
    title: "Data Collection",
    icon: Database,
    accent: "var(--cyan)",
    tag: "DATA",
    summary:
      "Downloads vulnerability datasets from HuggingFace and builds the raw training corpus. This is step one — before any training can happen, you need labeled examples of vulnerable and clean code.",
    what: [
      "Mounts Google Drive so data is saved permanently (not lost when Colab shuts down).",
      "Installs required libraries: transformers, torch, datasets, scikit-learn.",
      "Downloads google/code_x_glue_cc_defect_detection — a dataset of real-world C/C++ vulnerability samples with binary labels (0 = clean, 1 = vulnerable).",
      "Downloads code_search_net (Python subset) for additional clean-code examples.",
      "Verifies GPU is available — this notebook itself doesn't need GPU, but it confirms the environment.",
    ],
    inputs: "None (downloads from HuggingFace automatically)",
    outputs:
      "Raw DataFrames in memory, ready to pass into 02_data_cleaning.ipynb",
    howToRun: [
      "Open the notebook in Google Colab.",
      'Go to Runtime → Change runtime type → select "T4 GPU" (optional here, but good habit).',
      "Click Runtime → Run all.",
      'When prompted, click "Connect to Google Drive" and allow access.',
      "Wait for all cells to finish — green checkmarks appear on the left of each cell.",
    ],
    tip: "If a dataset fails to download, it may be temporarily unavailable on HuggingFace. Try re-running just that cell (click the ▶ button on the left of the cell).",
  },
  {
    id: "nb02",
    n: "02",
    filename: "02_data_cleaning.ipynb",
    title: "Data Cleaning",
    icon: Eraser,
    accent: "var(--green)",
    tag: "CLEANING",
    summary:
      "Takes the raw dataset and makes it usable for training. Machine learning models are very sensitive to bad data — duplicates, tiny snippets, and inconsistent columns will cause poor results. This notebook fixes all of that.",
    what: [
      "Loads the raw dataset downloaded in notebook 01.",
      "Removes duplicate code snippets (same code appearing twice confuses training).",
      "Filters out very short code (fewer than 3 lines — too little context for the model).",
      "Renames columns to simple names: 'func' → 'code', 'target' → 'label'.",
      "Mounts Google Drive and saves the cleaned data to /PolyGuard/01-data/train.csv.",
      "Verifies the file was saved correctly by reading it back.",
    ],
    inputs: "Raw dataset from HuggingFace (loaded fresh in this notebook)",
    outputs: "train.csv saved to Google Drive → /PolyGuard/01-data/train.csv",
    howToRun: [
      "Open the notebook in Google Colab.",
      "Click Runtime → Run all.",
      "Allow Drive access when prompted.",
      'At the end, you should see a printed message like: "Saved successfully! Total rows: XXXX".',
      "Check your Google Drive — you should see a file at MyDrive/PolyGuard/01-data/train.csv.",
    ],
    tip: "If you see fewer rows than expected, that's normal — duplicates were removed. As long as you have at least a few thousand rows, training will work.",
  },
  {
    id: "nb03",
    n: "03",
    filename: "03_train_model.ipynb",
    title: "Train Model",
    icon: Brain,
    accent: "var(--purple)",
    tag: "TRAINING",
    summary:
      "The core of the entire system. This notebook fine-tunes Microsoft's CodeBERT model on your cleaned dataset. After running, you have a custom ML model that understands code security. This is the longest step — expect 20–40 minutes with a GPU.",
    what: [
      "Loads train.csv from Google Drive.",
      "Splits data into 80% training / 20% testing sets.",
      "Loads the pre-trained CodeBERT tokenizer (converts code text into numbers the model understands).",
      "Creates a PyTorch Dataset class to feed batches into the model efficiently.",
      "Loads the CodeBERT model with 2 output classes (clean / vulnerable).",
      "Configures training: 3 epochs, batch size 8, saves checkpoints to Drive after each epoch.",
      "Runs training via Hugging Face Trainer — prints loss and accuracy at each step.",
      "Saves the final model + tokenizer to Drive at /PolyGuard/03-models/polyguard_model/.",
    ],
    inputs: "/PolyGuard/01-data/train.csv from Google Drive",
    outputs:
      "Trained model files saved to /PolyGuard/03-models/polyguard_model/ in Google Drive",
    howToRun: [
      "IMPORTANT: You must enable GPU first. Go to Runtime → Change runtime type → T4 GPU.",
      "Click Runtime → Run all.",
      "Allow Drive access when prompted.",
      "Wait — training takes 20–40 minutes. You can watch the loss numbers drop in real time.",
      'When it finishes, you\'ll see: "Model saved to Drive!"',
      "Do not close the Colab tab during training or you will lose progress.",
    ],
    tip: "If training crashes with CUDA out of memory, reduce per_device_train_batch_size from 8 to 4 in the TrainingArguments cell and re-run from that cell.",
    warning:
      "Google Colab free tier may disconnect after ~90 minutes. Checkpoints are saved to Drive every epoch, so you won't lose everything if it disconnects.",
  },
  {
    id: "nb04",
    n: "04",
    filename: "04_scorer.ipynb",
    title: "Scorer System",
    icon: Star,
    accent: "var(--amber)",
    tag: "SCORER",
    summary:
      "Defines and tests the scoring system — the logic that turns raw model probabilities into a human-readable security score (0–10), risk level (low/medium/high), findings list, and improvement tips.",
    what: [
      "Loads the trained model from Google Drive.",
      "Defines get_score(code_text) — the core function that runs inference and computes the 0–10 score.",
      "Score formula: if vulnerable confidence > 50%, score = 10 × clean_confidence. Otherwise score = 10 × clean_confidence clamped to a safe range.",
      "Defines a suggestions dictionary — maps detected vulnerability keywords (sqli, xss, secrets, crypto) to specific fix recommendations.",
      "Defines language_tips — per-language general best practices shown alongside vulnerability warnings.",
      "Tests the scorer against a known SQL injection sample to verify output.",
    ],
    inputs: "/PolyGuard/03-models/polyguard_model/ from Google Drive",
    outputs:
      "A tested get_score() function — this exact function is copy-pasted into 05_api.ipynb",
    howToRun: [
      "No GPU needed for this notebook — CPU inference is fast enough for testing.",
      "Click Runtime → Run all.",
      "At the end, you should see a result block showing Score, Risk, Verdict, Confidence, and Tips for the test SQL injection snippet.",
      "Try changing the sample_code variable to test your own snippets.",
    ],
    tip: "This is the best notebook to experiment with. You can add new vulnerability keywords to the suggestions dict or new languages to language_tips without any retraining.",
  },
  {
    id: "nb05",
    n: "05",
    filename: "05_api.ipynb",
    title: "FastAPI + ngrok",
    icon: Server,
    accent: "var(--orange)",
    tag: "API",
    summary:
      "Wraps the scorer in a live FastAPI server and exposes it to the internet via ngrok. This is how you test the full pipeline end-to-end before deploying to HuggingFace Spaces. The URL is temporary — it expires when you close Colab.",
    what: [
      "Installs fastapi, uvicorn, and pyngrok.",
      "Loads the trained model and defines the same get_score() logic as notebook 04.",
      "Creates a FastAPI app with a POST /analyze endpoint.",
      "Adds CORS middleware so the PolyGuard website can call this API from the browser.",
      "Uses ngrok to create a temporary public HTTPS URL that tunnels to the Colab machine.",
      "Starts the server in a background thread using nest_asyncio.",
      "Tests the API with two sample requests (one vulnerable, one clean) using the requests library.",
    ],
    inputs:
      "/PolyGuard/03-models/polyguard_model/ from Drive + ngrok authtoken from Colab secrets",
    outputs:
      "A live public HTTPS URL like https://xxxx-xxxx.ngrok-free.app — usable immediately",
    howToRun: [
      "Get a free ngrok account at ngrok.com → copy your authtoken from the dashboard.",
      "In Colab, click the 🔑 key icon in the left sidebar → Add a new secret named NGROK_TOKEN → paste your authtoken.",
      "No GPU needed for API serving.",
      "Click Runtime → Run all.",
      "Look for the printed ngrok URL in the output of the ngrok cell.",
      "Copy that URL — you can test it with curl, Postman, or paste it into the PolyGuard website's API endpoint field.",
    ],
    tip: "The ngrok URL changes every time you restart the notebook. For a permanent URL, deploy to HuggingFace Spaces using upload_to_hf_hub.ipynb.",
    warning:
      "Free ngrok accounts show a browser warning page on first visit. This is normal — the API itself still works from code/curl.",
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function Notebooks() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page page-container--md">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div className="label-cyan page-header__eyebrow">// NOTEBOOK GUIDE</div>
        <h2 className="page-header__title">The 5 Notebooks Explained</h2>
        <p className="page-header__sub">
          PolyGuard is built through five Jupyter notebooks that run in
          sequence. Each one does one job. Click any notebook below to see
          exactly what it does, what files it reads, what it produces, and how
          to run it — even if you've never used Colab or Python before.
        </p>
      </motion.div>

      {/* ── Pipeline overview strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: 24 }}
      >
        <div className="label mb-label">// PIPELINE OVERVIEW</div>
        <div className="card">
          {NOTEBOOKS.map((nb, i) => (
            <motion.div
              key={nb.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`flow-row${i < NOTEBOOKS.length - 1 ? " flow-row__divider" : ""}`}
            >
              <span className="meta-text" style={{ minWidth: 18 }}>
                {nb.n}
              </span>
              <span
                className="flow-badge"
                style={{ color: nb.accent, background: `${nb.accent}18` }}
              >
                {nb.filename}
              </span>
              <ChevronRight size={13} color="var(--text3)" />
              <span style={{ fontSize: 12, color: "var(--text2)" }}>
                {nb.summary.split(".")[0]}.
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Notebook accordions ── */}
      <div className="label mb-label-lg">// NOTEBOOK DETAILS</div>
      <div className="flex-col--gap">
        {NOTEBOOKS.map((nb, i) => {
          const isOpen = open === nb.id;
          const Icon = nb.icon;
          return (
            <motion.div
              key={nb.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card"
              style={{
                border: `1px solid ${isOpen ? nb.accent + "40" : "rgba(255,255,255,0.07)"}`,
                overflow: "visible",
              }}
            >
              {/* Accordion header */}
              <button
                onClick={() => setOpen(isOpen ? null : nb.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "1.1rem 1.4rem",
                  background: isOpen ? `${nb.accent}08` : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderBottom: isOpen ? `1px solid ${nb.accent}20` : "none",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--r)",
                    background: `${nb.accent}14`,
                    border: `1px solid ${nb.accent}28`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color={nb.accent} />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        color: nb.accent,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {nb.n} / {nb.tag}
                    </span>
                    <span
                      className="file-tag"
                      style={{
                        background: `${nb.accent}10`,
                        border: `1px solid ${nb.accent}22`,
                        color: nb.accent,
                        opacity: 0.8,
                      }}
                    >
                      {nb.filename}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--display)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {nb.title}
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  color="var(--text3)"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s",
                    flexShrink: 0,
                  }}
                />
              </button>

              {/* Accordion body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "1.5rem 1.4rem" }}>
                      {/* Summary */}
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text2)",
                          lineHeight: 1.85,
                          marginBottom: 20,
                        }}
                      >
                        {nb.summary}
                      </p>

                      {/* What it does */}
                      <div className="label mb-label">
                        // WHAT EACH CELL DOES
                      </div>
                      <div
                        style={{
                          background: "var(--bg1)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--r2)",
                          marginBottom: 20,
                          overflow: "hidden",
                        }}
                      >
                        {nb.what.map((step, si) => (
                          <div
                            key={si}
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "10px 14px",
                              borderBottom:
                                si < nb.what.length - 1
                                  ? "1px solid var(--border)"
                                  : "none",
                              fontSize: 12.5,
                              color: "var(--text2)",
                              lineHeight: 1.75,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--mono)",
                                fontSize: 10,
                                color: nb.accent,
                                background: `${nb.accent}14`,
                                border: `1px solid ${nb.accent}22`,
                                borderRadius: "var(--r)",
                                padding: "1px 7px",
                                height: "fit-content",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              Cell {si + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>

                      {/* I/O row */}
                      <div className="grid-2" style={{ marginBottom: 20 }}>
                        {[
                          {
                            label: "📥 READS",
                            text: nb.inputs,
                            color: "var(--accent)",
                          },
                          {
                            label: "📤 PRODUCES",
                            text: nb.outputs,
                            color: "var(--green)",
                          },
                        ].map((col, ci) => (
                          <div
                            key={ci}
                            style={{
                              background: "var(--bg3)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--r2)",
                              padding: "1rem",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "var(--mono)",
                                fontSize: 9.5,
                                letterSpacing: "0.12em",
                                color: col.color,
                                marginBottom: 8,
                              }}
                            >
                              {col.label}
                            </div>
                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--text2)",
                                lineHeight: 1.7,
                              }}
                            >
                              {col.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* How to run */}
                      <div className="label mb-label">// HOW TO RUN</div>
                      <div
                        className="flex-col--gap"
                        style={{ marginBottom: 16 }}
                      >
                        {nb.howToRun.map((step, si) => (
                          <div
                            key={si}
                            className="step-card"
                            style={{ padding: "0.9rem 1rem" }}
                          >
                            <span className="step-card__num">
                              {String(si + 1).padStart(2, "0")}
                            </span>
                            <p
                              className="step-card__desc"
                              style={{ margin: 0 }}
                            >
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tip / Warning */}
                      {nb.tip && (
                        <div
                          className="admonition admonition--tip"
                          style={{ marginBottom: nb.warning ? 10 : 0 }}
                        >
                          <Lightbulb
                            size={15}
                            color="var(--green)"
                            className="admonition__icon"
                          />
                          <div>
                            <div className="admonition__title">Tip</div>
                            {nb.tip}
                          </div>
                        </div>
                      )}
                      {nb.warning && (
                        <div className="admonition admonition--warning">
                          <AlertTriangle
                            size={15}
                            color="var(--amber)"
                            className="admonition__icon"
                          />
                          <div>
                            <div className="admonition__title">Watch out</div>
                            {nb.warning}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
