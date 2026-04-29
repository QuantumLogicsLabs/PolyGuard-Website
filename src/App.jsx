// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Architecture from "./pages/Architecture";
import Notebook from "./pages/Notebook";
import TrainingGuide from "./pages/TrainingGuide";
import ModelStatus from "./pages/ModelStatus";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        {/* redirect "/" → "/developers/docs" */}
        <Route path="/" element={<Navigate to="/developers/docs" replace />} />

        <Route path="/developers/docs" element={<Home />} />
        <Route path="/developers/docs/analyzer" element={<Analyzer />} />
        <Route
          path="/developers/docs/architecture"
          element={<Architecture />}
        />
        <Route path="/developers/docs/notebooks" element={<Notebook />} />
        <Route
          path="/developers/docs/training-guide"
          element={<TrainingGuide />}
        />
        <Route path="/developers/docs/model-status" element={<ModelStatus />} />
        <Route path="/developers/docs/roadmap" element={<Roadmap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
