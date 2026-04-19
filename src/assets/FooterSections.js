import { Section } from "lucide-react";

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
      //    { label: "Notebook Guide",   path: "/developers/docs/notebooks" },
      //    { label: "Training Guide",   path: "/developers/docs/training-guide" },
    ],
  },
];

export default SECTIONS;
