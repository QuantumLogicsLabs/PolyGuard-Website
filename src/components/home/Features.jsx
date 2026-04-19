import { motion } from "framer-motion";
import { Shield, Brain, Zap, Code2 } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    color: "var(--accent)",
    title: "Vulnerability Detection",
    desc: "SQL injection, XSS, buffer overflows, hardcoded secrets — 50+ patterns across 8 languages, each mapped to a real CVE class.",
  },
  {
    icon: Brain,
    color: "var(--green)",
    title: "ML Confidence Scores",
    desc: "Fine-tuned CodeBERT outputs separate clean/vuln confidence percentages — not a binary verdict. You see exactly how certain the model is.",
  },
  {
    icon: Zap,
    color: "var(--amber)",
    title: "Sub-500ms Analysis",
    desc: "Results in milliseconds via a 24/7 HuggingFace Spaces endpoint. No signup, no API key, no rate limits. Paste and scan.",
  },
  {
    icon: Code2,
    color: "var(--purple)",
    title: "8-Language Support",
    desc: "Python, JavaScript, Java, C, C++, PHP, Ruby, Go — each with language-aware vulnerability patterns tuned to its attack surface.",
  },
];

export default function Features() {
  return (
    <section
      style={{
        padding: "4rem 2rem",
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
        <div className="label mb-label">// CAPABILITIES</div>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Everything you need to{" "}
          <span style={{ color: "var(--accent-text)" }}>ship secure code.</span>
        </h2>
      </motion.div>
      <div className="grid-auto">
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.5 }}
            className="feature-card"
          >
            <div
              className="feature-card__icon-wrap"
              style={{
                background: `${f.color}14`,
                border: `1px solid ${f.color}28`,
              }}
            >
              <f.icon size={20} color={f.color} strokeWidth={1.5} />
            </div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
