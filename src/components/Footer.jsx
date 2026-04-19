import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const SECTIONS = [
  {
    title: "Documentation",
    links: [
      { label: "Getting Started", path: "/developers/docs" },
      { label: "Code Analyzer", path: "/developers/docs/analyzer" },
      { label: "System Architecture", path: "/developers/docs/architecture" },
      { label: "Roadmap", path: "/developers/docs/roadmap" },
    ],
  },
  {
    title: "API Reference",
    links: [
      {
        label: "POST /analyze",
        href: "https://muhammadsaadamin-polyguard-api.hf.space/analyze",
      },
      { label: "API Schema", path: "/developers/docs" },
      { label: "Rate Limits", path: "/developers/docs" },
      { label: "Error Codes", path: "/developers/docs" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "GitHub Repo",
        href: "https://github.com/QuantumLogicsLabs/PolyGuard",
      },
      {
        label: "HF Model",
        href: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model",
      },
      {
        label: "HF Spaces API",
        href: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api",
      },
      {
        label: "Dataset (Drive)",
        href: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV",
      },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleLink = (link) => {
    if (link.href) window.open(link.href, "_blank", "noreferrer");
    else if (link.path) navigate(link.path);
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Brand column */}
        <div>
          <div className="footer__brand-name">
            <svg viewBox="0 0 36 36" fill="none" width="18" height="18">
              <polygon
                points="18,2 34,11 34,25 18,34 2,25 2,11"
                stroke="rgba(74,158,255,0.5)"
                strokeWidth="1.5"
                fill="rgba(74,158,255,0.06)"
              />
              <path
                d="M18 11L18 25M12 15L24 15M12 21L24 21"
                stroke="#4a9eff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            POLY<span>GUARD</span>
          </div>

          <p className="footer__brand-desc">
            ML-powered code security intelligence. Fine-tuned CodeBERT detects
            vulnerabilities across 8 languages in real time.
          </p>

          <div className="footer__status">
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
            API ONLINE · v1.0
          </div>
        </div>

        {/* Link columns */}
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <div className="footer__col-title">{s.title}</div>
            <ul className="footer__links">
              {s.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href || l.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLink(l);
                    }}
                    rel={l.href ? "noreferrer" : undefined}
                  >
                    {l.label}
                    {l.href && (
                      <ExternalLink
                        size={10}
                        style={{
                          display: "inline",
                          marginLeft: 5,
                          opacity: 0.4,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span className="footer__copy">
          © 2025 QuantumLogicsLabs · PolyGuard · MIT License
        </span>
        <div className="footer__tech">
          {["React", "Vite", "FastAPI", "CodeBERT", "HuggingFace"].map((t) => (
            <span key={t} className="footer__tech-badge">
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
