import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';
import ArticleCard from '../components/ArticleCard';
import SentimentChart from '../components/SentimentChart';
import CategoryChart from '../components/CategoryChart';
import TrendingChart from '../components/TrendingChart';
import {
  Box, Grid, Typography, AppBar, Toolbar, Button,
  FormControl, InputLabel, Select, MenuItem,
  TextField, Paper, Chip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Dashboard() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem('company_id');

  const [articles, setArticles] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [showRelevant, setShowRelevant] = useState(false);

  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      let res;
      if (showRelevant) {
        res = await API.get(`/articles/relevant/${companyId}`);
      } else {
        const params = new URLSearchParams();
        if (filterCategory) params.append('category', filterCategory);
        if (filterSentiment) params.append('sentiment', filterSentiment);
        if (filterSource) params.append('source', filterSource);
        params.append('limit', '30');
        res = await API.get(`/articles?${params.toString()}`);
      }
      setArticles(res.data.articles || []);
      setTotalArticles(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [sent, cat, trend] = await Promise.all([
        API.get('/stats/sentiment'),
        API.get('/stats/categories'),
        API.get('/stats/trending'),
      ]);
      setSentimentData(sent.data);
      setCategoryData(cat.data);
      setTrendingData(trend.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, [filterCategory, filterSentiment, filterSource, showRelevant]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            📰 Digital Twin News
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={`Azienda: ${companyId}`} variant="outlined" size="small" />
            <Button startIcon={<RefreshIcon />} onClick={() => { fetchArticles(); fetchStats(); }} size="small">
              Aggiorna
            </Button>
            <Button startIcon={<LogoutIcon />} onClick={handleLogout} color="error" size="small">
              Esci
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>📊 Panoramica</Typography>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <SentimentChart data={sentimentData} loading={loadingStats} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CategoryChart data={categoryData} loading={loadingStats} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>📈 Totale Articoli</Typography>
              <Typography variant="h2" color="primary" fontWeight="bold">{totalArticles}</Typography>
              <Typography color="text.secondary">articoli nel sistema</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box mb={4}>
          <TrendingChart data={trendingData} loading={loadingStats} />
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={2}>🗞️ Articoli</Typography>
        <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categoria</InputLabel>
                <Select value={filterCategory} label="Categoria" onChange={e => setFilterCategory(e.target.value)}>
                  <MenuItem value="">Tutte</MenuItem>
                  <MenuItem value="Tecnologia">Tecnologia</MenuItem>
                  <MenuItem value="Economia">Economia</MenuItem>
                  <MenuItem value="Generale">Generale</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sentiment</InputLabel>
                <Select value={filterSentiment} label="Sentiment" onChange={e => setFilterSentiment(e.target.value)}>
                  <MenuItem value="">Tutti</MenuItem>
                  <MenuItem value="Positive">Positive</MenuItem>
                  <MenuItem value="Neutral">Neutral</MenuItem>
                  <MenuItem value="Negative">Negative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth size="small" label="Fonte"
                value={filterSource} onChange={e => setFilterSource(e.target.value)}
                placeholder="es. TechCrunch"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth variant={showRelevant ? 'contained' : 'outlined'}
                onClick={() => setShowRelevant(!showRelevant)}
              >
                {showRelevant ? '✅ Solo rilevanti' : '🎯 Mostra rilevanti'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loadingArticles ? (
          <Typography textAlign="center" color="text.secondary">Caricamento articoli...</Typography>
        ) : articles.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">Nessun articolo trovato.</Typography>
        ) : (
          <Grid container spacing={2}>
            {articles.map((article, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}