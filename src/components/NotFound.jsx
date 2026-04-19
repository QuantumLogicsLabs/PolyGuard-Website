import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page page-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <div className="label-red page-header__eyebrow">// 404 ERROR</div>
        <h2 className="page-header__title">Page Not Found</h2>
        <p className="page-header__sub">
          The page you're looking for doesn't exist. Check the URL or navigate
          back to the home page.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="state-box--border"
        style={{ textAlign: "center" }}
      >
        <div className="state-icon">
          <AlertTriangle size={48} color="var(--red)" strokeWidth={1} />
        </div>
        <p className="state-title">404 - Page Not Found</p>
        <p className="state-sub">
          This route doesn't exist in our documentation.
        </p>
      </motion.div>
    </div>
  );
}
