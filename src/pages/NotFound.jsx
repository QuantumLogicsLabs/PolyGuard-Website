import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="not-found__code"
      >
        404
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__sub">
          This route doesn't exist. Check the URL or head back to the docs.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,229,255,0.25)" }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/developers/docs")}
        className="btn-primary"
        style={{ marginTop: 8 }}
      >
        <ArrowLeft size={14} /> Back to Docs
      </motion.button>
    </div>
  );
}
