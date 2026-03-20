// Grafico orizzontale per i trending topics
// Mostra i topic più popolari con colori diversi
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Paper, Typography, CircularProgress } from '@mui/material';

const COLORS = ['#1976d2','#388e3c','#f57c00','#d32f2f','#7b1fa2','#0288d1','#c2185b','#00796b','#5d4037','#455a64'];

export default function TrendingChart({ data, loading }) {
  if (loading) return <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><CircularProgress /></Paper>;

  const chartData = data.map(d => ({ name: d._id, count: d.count }));

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        🔥 Top Trending Topics
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
