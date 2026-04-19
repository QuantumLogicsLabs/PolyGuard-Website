import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";

/* ─────────────────────────────── Components ──────────────────────────────── */

const WORDS = ["DETECT.", "PROTECT.", "ANALYZE.", "SECURE."];

function TypedText() {
  const [wi, setWi] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wi];
    let delay;
    if (!deleting && chars < word.length)
      delay = setTimeout(() => setChars((c) => c + 1), 65);
    else if (!deleting && chars === word.length)
      delay = setTimeout(() => setDeleting(true), 2000);
    else if (deleting && chars > 0)
      delay = setTimeout(() => setChars((c) => c - 1), 38);
    else
      delay = setTimeout(() => {
        setDeleting(false);
        setWi((w) => (w + 1) % WORDS.length);
      }, 400);
    return () => clearTimeout(delay);
  }, [chars, deleting, wi]);

  return (
    <span style={{ color: "var(--accent)" }}>
      {WORDS[wi].slice(0, chars)}
      {/* Improved cursor — CSS animated bar, not a character */}
      <span className="cursor-blink" />
    </span>
  );
}

/* Subtle dot-grid background for hero */
function HeroGrid() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.04,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="0.8" fill="#4a9eff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const heroRef = useRef(null);

  const handleMouse = useCallback(
    (e) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      mouseX.set((e.clientX - r.left - r.width / 2) / 30);
      mouseY.set((e.clientY - r.top - r.height / 2) / 30);
    },
    [mouseX, mouseY],
  );

  const glowX = useTransform(springX, (v) => `${50 + v}%`);
  const glowY = useTransform(springY, (v) => `${40 + v}%`);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouse}
      style={{
        minHeight: "calc(100vh - var(--nav-h))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem 4rem",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <HeroGrid />

      {/* Radial glow follows cursor */}
      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(74,158,255,0.07) 0%, transparent 65%)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />

      {/* Corner brackets */}
      {[
        {
          top: 32,
          left: 32,
          borderTop: "1px solid",
          borderLeft: "1px solid",
        },
        {
          top: 32,
          right: 32,
          borderTop: "1px solid",
          borderRight: "1px solid",
        },
        {
          bottom: 32,
          left: 32,
          borderBottom: "1px solid",
          borderLeft: "1px solid",
        },
        {
          bottom: 32,
          right: 32,
          borderBottom: "1px solid",
          borderRight: "1px solid",
        },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            borderColor: "rgba(74,158,255,0.3)",
            ...pos,
          }}
        />
      ))}

      <div style={{ position: "relative", maxWidth: 820, width: "100%" }}>
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "2rem" }}
        >
          <span className="pill pill--accent">
            <span
              className="dot dot--sm"
              style={{ background: "var(--accent)" }}
            />
            ML-POWERED · CODEBERT · REAL-TIME ANALYSIS
            <span
              className="dot dot--sm"
              style={{ background: "var(--accent)" }}
            />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--display)",
            fontWeight: 800,
            fontSize: "clamp(3rem, 9vw, 6.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            marginBottom: "1.75rem",
          }}
        >
          <span style={{ display: "block", color: "var(--text)" }}>SCAN.</span>
          <span style={{ display: "block" }}>
            <TypedText />
          </span>
          <span
            style={{
              display: "block",
              color: "var(--text2)",
              fontSize: "0.88em",
            }}
          >
            SHIP SAFE.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontSize: 16,
            color: "var(--text2)",
            lineHeight: 1.85,
            maxWidth: 560,
            margin: "0 auto 2.75rem",
            fontWeight: 300,
          }}
        >
          PolyGuard uses a fine-tuned CodeBERT model to detect SQL injection,
          XSS, buffer overflows, hardcoded secrets, and 50+ more vulnerability
          patterns — returning actionable security intelligence in milliseconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.64, duration: 0.5 }}
          className="flex-center"
          style={{ gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            onClick={() => navigate("/developers/docs/analyzer")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary btn-primary--lg"
          >
            <Zap size={14} /> Open Analyzer <ArrowRight size={14} />
          </motion.button>
          <motion.button
            onClick={() => navigate("/developers/docs/architecture")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-ghost"
          >
            How It Works <ChevronRight size={14} />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex-col" style={{ alignItems: "center", gap: 6 }}>
          <div
            className="float"
            style={{
              width: 1,
              height: 36,
              background:
                "linear-gradient(to bottom, rgba(74,158,255,0.5), transparent)",
            }}
          />
          <span className="meta-text" style={{ letterSpacing: "0.2em" }}>
            SCROLL
          </span>
        </div>
      </motion.div>
    </section>
  );
}
