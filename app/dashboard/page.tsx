"use client";

import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button, CircularProgress, Paper } from "@mui/material";
import { motion } from "framer-motion";
import ProductsPage from "./products/page";
import StatsCard from "../../components/StatsCard";
import OrdersPage from "./orders/page";
import SourcesPage from "./sources/page";
import Invoice from "@/components/Invoice";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalProfit: number;
  totalSales: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalProfit: 0,
    totalSales: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsRes, productsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/products"),
      ]);

      if (!statsRes.ok || !productsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const statsData: Stats = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      setIsLoading(false);

      console.log(err);
      // setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#111827",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress sx={{ color: "#9333ea" }} />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#111827",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchStats}
            sx={{
              background: "linear-gradient(45deg, #ef4444, #dc2626)",
              "&:hover": {
                background: "linear-gradient(45deg, #dc2626, #ef4444)",
              },
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Retry
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111827",
        p: { xs: 2, sm: 3, md: 4, lg: 5 },
        color: "white",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4, md: 5 },
            background: "linear-gradient(45deg, #9333ea, #ec4899)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: { xs: "center", md: "left" },
            fontWeight: "bold",
          }}
        >
          Dashboard
        </Typography>
      </motion.div>

      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <StatsCard stats={stats} />
      </Box>

      <div>
      <Invoice
        invoiceTo="FAB Lab DIU"
        phone="+880"
        address="Daffodil International University, Dhaka"
        totalDue={540}
        invoiceNumber="0017"
        invoiceDate="23/02/2025"
        items={[
          {
            description: '28BYJ-48 5V Stepper Motor With Driver',
            quantity: 3,
            price: 180,
            total: 540,
          },
        ]}
        subTotal={540}
        deliveryFee={0}
        paymentMethod="CASH"
        adminName="sharifrafid"
        companyInfo={{
          name: 'TechTideDIU',
          address: 'Daffodil Smart City, Ashulia, Savar, Dhaka',
          website: 'https://facebook.com/tech.tide.diu',
        }}
        logoUrl="/techtidelogo.png" // Path to your logo in the public folder
        qrCodeUrl="/techtideqr.png"
      />
    </div>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={3.5}>
            <motion.div variants={itemVariants}>
              <Paper
                sx={{
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <ProductsPage />
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={5}>
            <motion.div variants={itemVariants}>
              <Paper
                sx={{
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <OrdersPage />
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <motion.div variants={itemVariants}>
              <Paper
                sx={{
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <SourcesPage />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}