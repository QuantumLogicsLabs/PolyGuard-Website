import { motion } from "framer-motion";

/* ── Result block (findings / tips) ── */
function ResultBlock({
  title,
  icon,
  accentColor,
  items,
  bg,
  border,
  prefix,
  textColor,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--bg2)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--r2)",
        padding: "1rem",
        marginBottom: 10,
        borderLeft: `2px solid ${accentColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 10,
          color: accentColor,
        }}
      >
        {icon}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            letterSpacing: "0.14em",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: "flex",
              gap: 10,
              padding: "9px 12px",
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: "var(--r)",
              fontSize: 12,
              color: textColor,
              lineHeight: 1.65,
            }}
          >
            <span
              style={{ fontFamily: "var(--mono)", flexShrink: 0, opacity: 0.5 }}
            >
              {prefix}
            </span>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
export default ResultBlock;
