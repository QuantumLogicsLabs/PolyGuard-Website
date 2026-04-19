import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import links from "../assets/NavbarLinks";

export default function Nav() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [scrolled, setScrolled]         = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef(null);
  const btnRefs      = useRef({});

  /* ── Scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Derive active link from current pathname ── */
  const activePath = (() => {
    // Exact match first, then prefix match for nested routes
    const exact = links.find((l) => l.path === location.pathname);
    if (exact) return exact.path;
    // Fallback: longest prefix wins
    const prefix = [...links]
      .sort((a, b) => b.path.length - a.path.length)
      .find((l) => location.pathname.startsWith(l.path));
    return prefix?.path ?? links[0].path;
  })();

  /* ── Slide indicator to the active button ── */
  useEffect(() => {
    const activeBtn = btnRefs.current[activePath];
    const container = containerRef.current;
    if (!activeBtn || !container) return;

    const btnRect = activeBtn.getBoundingClientRect();
    const conRect = container.getBoundingClientRect();

    setIndicatorStyle({
      left:   btnRect.left - conRect.left,
      top:    btnRect.top  - conRect.top,
      width:  btnRect.width,
      height: btnRect.height,
    });
  }, [activePath]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: 66,
        background: scrolled ? "rgba(1,4,8,0.97)" : "rgba(1,4,8,0.55)",
        backdropFilter: "blur(32px) saturate(180%)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,229,255,0.12)" : "rgba(0,229,255,0.05)"}`,
        transition: "background 0.4s, border-color 0.4s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
      }}
    >
      {/* ── Logo ── */}
      <div
        onClick={() => navigate("/developers/docs")}
        style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
      >
        <div style={{ position: "relative", width: 36, height: 36 }}>
          <svg viewBox="0 0 36 36" fill="none" width="36" height="36">
            <polygon points="18,2 34,11 34,25 18,34 2,25 2,11" stroke="rgba(0,229,255,0.32)" strokeWidth="1" fill="rgba(0,229,255,0.03)" />
            <polygon points="18,7 28,13 28,23 18,29 8,23 8,13" stroke="rgba(0,229,255,0.52)" strokeWidth="0.5" fill="none" />
            <path d="M18 11L18 25M12 15L24 15M12 21L24 21" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{
            position: "absolute", inset: -8,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)",
            animation: "glowPulse 3s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        </div>

        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1.2 }}>
            POLY<span style={{ color: "var(--cyan)" }}>GUARD</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "var(--text3)", letterSpacing: "0.2em" }}>
            v1.0 · SECURITY INTELLIGENCE
          </div>
        </div>
      </div>

      {/* ── Links ── */}
      <div ref={containerRef} style={{ display: "flex", gap: 2, position: "relative" }}>
        {links.map((l) => (
          <button
            key={l.path}
            ref={(el) => (btnRefs.current[l.path] = el)}
            onClick={() => navigate(l.path)}
            style={{
              position: "relative",
              background: "transparent",
              border: "none",
              color: activePath === l.path ? "var(--cyan)" : "var(--text2)",
              padding: "8px 16px",
              fontSize: 10,
              fontFamily: "var(--mono)",
              letterSpacing: "0.14em",
              cursor: "pointer",
              transition: "color 0.2s",
              zIndex: 1,
            }}
          >
            {l.label}
          </button>
        ))}

        {/* Sliding indicator */}
        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          style={{
            position: "absolute",
            background: "rgba(0,229,255,0.07)",
            border: "1px solid rgba(0,229,255,0.22)",
            borderRadius: "var(--r)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </div>

      {/* ── Status pill ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: "rgba(57,255,154,0.05)",
        border: "1px solid rgba(57,255,154,0.18)",
        borderRadius: 100,
        padding: "5px 14px",
      }}>
        <span style={{
          display: "block", width: 6, height: 6,
          borderRadius: "50%",
          background: "var(--green)",
          animation: "statusPulse 2.4s ease-in-out infinite",
        }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", letterSpacing: "0.14em" }}>
          API ONLINE
        </span>
      </div>
    </motion.nav>
  );
}
