import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Architecture from "./pages/Architecture";
import Roadmap from "./pages/Roadmap";
import Nav from "./components/Nav";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import { Notebook } from "lucide-react";
import TrainingGuide from "./pages/TrainingGuide";
import Notebooks from "./pages/Notebook";

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="main-content">
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={<Navigate to="/developers/docs" replace />}
          />

          {/* Base docs route → Home */}
          <Route path="/developers/docs" element={<Home />} />

          {/* Sub-routes */}
          <Route path="/developers/docs/analyzer" element={<Analyzer />} />
          <Route
            path="/developers/docs/architecture"
            element={<Architecture />}
          />
          <Route path="/developers/docs/roadmap" element={<Roadmap />} />
          <Route path="/developers/docs/notebooks" element={<Notebooks />} />
          <Route
            path="/developers/docs/training-guide"
            element={<TrainingGuide />}
          />
          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
