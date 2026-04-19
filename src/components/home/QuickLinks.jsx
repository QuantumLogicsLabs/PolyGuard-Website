import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Cpu, GitBranch, AlertTriangle } from "lucide-react";

const QUICK_LINKS = [
  {
    icon: BookOpen,
    label: "Analyzer",
    sub: "Interactive scanner",
    path: "/developers/docs/analyzer",
  },
  {
    icon: Cpu,
    label: "Architecture",
    sub: "System design & data flow",
    path: "/developers/docs/architecture",
  },
  {
    icon: GitBranch,
    label: "Roadmap",
    sub: "Upcoming model improvements",
    path: "/developers/docs/roadmap",
  },
  {
    icon: AlertTriangle,
    label: "Vulnerabilities",
    sub: "50+ detected patterns",
    path: "/developers/docs/analyzer",
  },
];

export default function QuickLinks() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: "4rem 2rem 0",
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
        <div className="label mb-label">// Documentation</div>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Explore the Docs
        </h2>
      </motion.div>
      <div className="grid-4">
        {QUICK_LINKS.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            onClick={() => navigate(l.path)}
            className="doc-card"
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--r2)",
                background: "var(--accent-dim)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <l.icon size={16} color="var(--accent-text)" strokeWidth={1.5} />
            </div>
            <div className="doc-card__title">{l.label}</div>
            <div className="doc-card__desc">{l.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
