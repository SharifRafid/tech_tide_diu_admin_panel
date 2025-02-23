"use client";
import { motion } from "framer-motion";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalProfit: number;
  totalSales: number;
}

interface StatItem {
  label: string;
  value: string | number;
}

export default function StatsCard({ stats }: { stats: Stats }) {
  const statItems: StatItem[] = [
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Profit", value: `$${stats.totalProfit.toFixed(2)}` },
    { label: "Total Sales", value: `$${stats.totalSales.toFixed(2)}` },
  ];

  // Animation variants for the card and items
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 h-full border border-gray-700 hover:shadow-2xl transition-shadow duration-300"
    >
      <h2 className="text-2xl font-bold text-indigo-100 mb-6 tracking-tight">
        Statistics
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <span className="text-gray-400 text-sm font-medium">{item.label}</span>
            <span className="text-xl font-semibold text-white mt-1">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}