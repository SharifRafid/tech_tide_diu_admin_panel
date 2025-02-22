"use client";

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, CircularProgress, Pagination } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProductsPage from './products/page';
import StatsCard from '../../components/StatsCard';
import OrdersPage from './orders/page';
import SourcesPage from './sources/page';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalProfit: 0,
    totalSales: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsRes, productsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/products')
      ]);

      if (!statsRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
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
      transition: { staggerChildren: 0.1 }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#9333ea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={fetchStats}
          sx={{ mt: 2, background: '#ef4444' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#111827', 
      p: { xs: 2, sm: 4 },
      color: 'white'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Dashboard
        </Typography>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <StatsCard stats={stats} />
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <ProductsPage />
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <OrdersPage />
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <SourcesPage />
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}