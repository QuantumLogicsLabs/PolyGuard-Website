import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function SupportedLanguages() {
  return (
    <section
      style={{
        padding: "0 2rem 5rem",
        maxWidth: "var(--content-w)",
        margin: "0 auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginBottom: "1.5rem" }}
      >
        <div className="label mb-label">// SUPPORTED LANGUAGES</div>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          Pass <code>language</code> as one of:
        </h2>
      </motion.div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { name: "python", ext: ".py", color: "var(--accent)" },
          { name: "javascript", ext: ".js", color: "var(--amber)" },
          { name: "java", ext: ".java", color: "var(--orange)" },
          { name: "c", ext: ".c", color: "var(--purple)" },
          { name: "cpp", ext: ".cpp", color: "var(--purple)" },
          { name: "php", ext: ".php", color: "var(--teal)" },
          { name: "ruby", ext: ".rb", color: "var(--red)" },
          { name: "go", ext: ".go", color: "var(--accent)" },
        ].map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r2)",
              padding: "10px 16px",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: lang.color,
              }}
            />
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "var(--text)",
              }}
            >
              {lang.name}
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text3)",
              }}
            >
              {lang.ext}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="admonition admonition--tip" style={{ marginTop: 20 }}>
        <Lock
          size={15}
          color="var(--green)"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <div>
          <div className="admonition__title">Tip — language-aware patterns</div>
          Always pass the correct language. PolyGuard uses language-specific
          vulnerability patterns — SQL injection in PHP looks syntactically
          different than in Python. An incorrect language tag reduces detection
          accuracy.
        </div>
      </div>
    </section>
  );
}
