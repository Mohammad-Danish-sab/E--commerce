import { motion } from "framer-motion";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
      }}
      className="dashboard-card"
    >
      <div>
        <h4>{title}</h4>

        <h2>{value}</h2>
      </div>

      <div className="card-icon" style={{ background: color }}>
        {icon}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
