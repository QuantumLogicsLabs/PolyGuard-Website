import { useState } from "react";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Architecture from "./pages/Architecture";
import Roadmap from "./pages/Roadmap";
import Nav from "./components/Nav";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <Nav page={page} setPage={setPage} />
      <main className="main-content">
        {page === "home" && <Home setPage={setPage} />}
        {page === "analyzer" && <Analyzer />}
        {page === "architecture" && <Architecture />}
        {page === "roadmap" && <Roadmap />}
      </main>
    </div>
  );
}
