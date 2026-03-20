// Grafico a barre che mostra gli articoli per categoria
// Riceve data (array) e loading (boolean) come props
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Paper, Typography, CircularProgress } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CategoryChart({ data, loading }) {
  if (loading) return <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><CircularProgress /></Paper>;

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [{
      label: 'Articoli',
      data: data.map(d => d.count),
      backgroundColor: '#1976d2',
      borderRadius: 6,
    }]
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        📂 Articoli per Categoria
      </Typography>
      <Bar data={chartData} options={{
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }} />
    </Paper>
  );
}

