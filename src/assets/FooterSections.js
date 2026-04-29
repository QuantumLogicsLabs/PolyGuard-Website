// src/assets/FooterSections.js
const SECTIONS = [
  {
    title: "Documentation",
    links: [
      { label: "Getting Started", path: "/developers/docs" },
      { label: "Code Analyzer", path: "/developers/docs/analyzer" },
      { label: "System Architecture", path: "/developers/docs/architecture" },
      { label: "Model Status", path: "/developers/docs/model-status" }, // ← new
      { label: "Roadmap", path: "/developers/docs/roadmap" },
    ],
  },
  {
    title: "Training",
    links: [
      { label: "Training Guide", path: "/developers/docs/training-guide" },
      { label: "Notebooks", path: "/developers/docs/notebooks" },
      { label: "Model Status", path: "/developers/docs/model-status" },
    ],
  },
  {
    title: "API Reference",
    links: [
      {
        label: "POST /analyze",
        href: "https://muhammadsaadamin-polyguard-api.hf.space/analyze",
      },
      {
        label: "POST /analyze_batch",
        href: "https://muhammadsaadamin-polyguard-api.hf.space/analyze_batch",
      },
      {
        label: "GET /health",
        href: "https://muhammadsaadamin-polyguard-api.hf.space/health",
      },
      {
        label: "Swagger Docs",
        href: "https://muhammadsaadamin-polyguard-api.hf.space/docs",
      },
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
        href: "https://huggingface.co/MUHAMMADSAADAMIN/PolyGuard",
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

export default SECTIONS;
