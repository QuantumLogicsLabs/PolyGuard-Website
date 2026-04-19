import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import links from "../assets/NavbarLinks";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef(null);
  const btnRefs = useRef({});

  /* ── Scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Derive active link from current pathname ── */
  const activePath = (() => {
    const exact = links.find((l) => l.path === location.pathname);
    if (exact) return exact.path;
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
      left: btnRect.left - conRect.left,
      top: btnRect.top - conRect.top,
      width: btnRect.width,
      height: btnRect.height,
    });
  }, [activePath]);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 56,
        background: scrolled
          ? "rgba(13, 15, 17, 0.98)"
          : "rgba(13, 15, 17, 0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)"}`,
        transition: "background 0.3s, border-color 0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
      }}
    >
      {/* ── Logo ── */}
      <div
        onClick={() => navigate("/developers/docs")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <div style={{ position: "relative", width: 32, height: 32 }}>
          <svg viewBox="0 0 36 36" fill="none" width="32" height="32">
            <polygon
              points="18,2 34,11 34,25 18,34 2,25 2,11"
              stroke="rgba(74,158,255,0.4)"
              strokeWidth="1.2"
              fill="rgba(74,158,255,0.05)"
            />
            <polygon
              points="18,7 28,13 28,23 18,29 8,23 8,13"
              stroke="rgba(74,158,255,0.6)"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M18 11L18 25M12 15L24 15M12 21L24 21"
              stroke="#4a9eff"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              color: "var(--text)",
            }}
          >
            POLY<span style={{ color: "var(--accent)" }}>GUARD</span>
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 8,
              color: "var(--text3)",
              letterSpacing: "0.16em",
              marginTop: 1,
            }}
          >
            v1.0 · SECURITY INTELLIGENCE
          </div>
        </div>
      </div>

      {/* ── Links ── */}
      <div
        ref={containerRef}
        style={{ display: "flex", gap: 2, position: "relative" }}
      >
        {links.map((l) => (
          <button
            key={l.path}
            ref={(el) => (btnRefs.current[l.path] = el)}
            onClick={() => navigate(l.path)}
            style={{
              position: "relative",
              background: "transparent",
              border: "none",
              color: activePath === l.path ? "var(--text)" : "var(--text3)",
              padding: "6px 14px",
              fontSize: 12,
              fontFamily: "var(--sans)",
              fontWeight: activePath === l.path ? 600 : 400,
              letterSpacing: "0.02em",
              cursor: "pointer",
              transition: "color 0.15s",
              zIndex: 1,
            }}
          >
            {l.label}
          </button>
        ))}

        {/* Sliding indicator */}
        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 480, damping: 36 }}
          style={{
            position: "absolute",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </div>

      {/* ── Status pill ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(63,185,80,0.08)",
          border: "1px solid rgba(63,185,80,0.22)",
          borderRadius: "4px",
          padding: "4px 12px",
        }}
      >
        <span
          style={{
            display: "block",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--green)",
            animation: "statusPulse 2.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            color: "var(--green)",
            letterSpacing: "0.1em",
          }}
        >
          API ONLINE
        </span>
      </div>
    </motion.nav>
  );
}
