import { Card, CardContent, Typography, Grid } from '@mui/material';

export default function StatsCard({ stats }) {
  const statItems = [
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Total Profit', value: `$${stats.totalProfit.toFixed(2)}` },
    { label: 'Total Sales', value: `$${stats.totalSales.toFixed(2)}` },
  ];

  return (
    <Card sx={{ bgcolor: '#1f2937', color: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Statistics</Typography>
        <Grid container spacing={2}>
          {statItems.map((item) => (
            <Grid item xs={6} key={item.label}>
              <Typography variant="body2" color="gray.400">{item.label}</Typography>
              <Typography variant="h6">{item.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}