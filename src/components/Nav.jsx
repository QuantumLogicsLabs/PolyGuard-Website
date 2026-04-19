import { Shield } from "lucide-react";

const links = [
  { id: "home", label: "Home" },
  { id: "analyzer", label: "Analyzer" },
  { id: "architecture", label: "Architecture" },
  { id: "roadmap", label: "Roadmap" },
];

export default function Nav({ page, setPage }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem",
      background: "rgba(8,12,16,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
        <Shield size={22} color="var(--accent)" strokeWidth={1.5} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", color: "var(--text)" }}>
          POLY<span style={{ color: "var(--accent)" }}>GUARD</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(l => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{
            background: page === l.id ? "rgba(0,255,136,0.08)" : "transparent",
            border: "1px solid",
            borderColor: page === l.id ? "rgba(0,255,136,0.3)" : "transparent",
            color: page === l.id ? "var(--accent)" : "var(--text2)",
            padding: "6px 14px",
            borderRadius: "var(--radius)",
            fontSize: 12,
            letterSpacing: "0.08em",
            transition: "all 0.2s",
          }}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
}
