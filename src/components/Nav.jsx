import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { id: "home", label: "HOME" },
  { id: "analyzer", label: "ANALYZER" },
  { id: "architecture", label: "ARCHITECTURE" },
  { id: "roadmap", label: "ROADMAP" },
];

export default function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [tick, setTick] = useState(true);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(v => !v), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 68,
        background: scrolled ? "rgba(2,5,8,0.95)" : "rgba(2,5,8,0.6)",
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,229,255,0.14)" : "rgba(0,229,255,0.06)"}`,
        transition: "background 0.3s, border-color 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem",
      }}
    >
      {/* Logo */}
      <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ position: "relative", width: 36, height: 36 }}>
          <svg viewBox="0 0 36 36" fill="none" style={{ width: 36, height: 36 }}>
            <polygon points="18,2 34,11 34,25 18,34 2,25 2,11" stroke="rgba(0,229,255,0.35)" strokeWidth="1" fill="rgba(0,229,255,0.03)" />
            <polygon points="18,7 28,13 28,23 18,29 8,23 8,13" stroke="rgba(0,229,255,0.5)" strokeWidth="0.5" fill="none" />
            <path d="M18 11 L18 25 M12 15 L24 15 M12 21 L24 21" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{
            position: "absolute", inset: -6, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)",
          }} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1.2 }}>
            POLY<span style={{ color: "var(--cyan)" }}>GUARD</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.18em" }}>
            v1.0 · SECURITY INTELLIGENCE
          </div>
        </div>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 2, position: "relative" }}>
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => setPage(l.id)}
            style={{
              position: "relative", background: "transparent", border: "none",
              color: page === l.id ? "var(--cyan)" : "var(--text2)",
              padding: "8px 16px", fontSize: 10.5, letterSpacing: "0.12em",
              cursor: "pointer", transition: "color 0.2s",
            }}
          >
            {l.label}
            {page === l.id && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,229,255,0.07)",
                  border: "1px solid rgba(0,229,255,0.22)",
                  borderRadius: "var(--r)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: "rgba(0,255,157,0.05)",
        border: "1px solid rgba(0,255,157,0.18)",
        borderRadius: 100, padding: "5px 14px",
      }}>
        <motion.span
          animate={{ opacity: tick ? 1 : 0.25, scale: tick ? 1 : 0.8 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "block", width: 6, height: 6, borderRadius: "50%",
            background: "var(--green)", boxShadow: "0 0 8px var(--green)",
          }}
        />
        <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--green)", letterSpacing: "0.12em" }}>
          API ONLINE
        </span>
      </div>
    </motion.nav>
  );
}
