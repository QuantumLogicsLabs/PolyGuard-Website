import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const STATS = [
  { val: 50, suf: "+", label: "VULNERABILITY PATTERNS" },
  { val: 8, suf: "", label: "LANGUAGES SUPPORTED" },
  { val: 99, suf: "%", label: "API UPTIME" },
  { val: 500, suf: "ms", label: "AVG RESPONSE TIME" },
];

function StatNum({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = to / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setVal(to);
        clearInterval(t);
      } else setVal(Math.floor(cur));
    }, 26);
    return () => clearInterval(t);
  }, [to]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

export default function StatsBar() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="stats-bar"
    >
      {STATS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="stat-item"
        >
          <div className="stat-item__value">
            <StatNum to={s.val} suffix={s.suf} />
          </div>
          <div className="stat-item__label">{s.label}</div>
        </motion.div>
      ))}
    </motion.section>
  );
}
