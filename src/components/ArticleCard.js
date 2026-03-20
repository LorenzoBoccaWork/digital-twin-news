import React, { useState } from 'react';
import API from '../api/client';
import {
  Card, CardContent, Typography, Chip,
  Box, IconButton, Tooltip, Snackbar, Alert
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const sentimentColor = { Positive: 'success', Negative: 'error', Neutral: 'warning' };

export default function ArticleCard({ article }) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const companyId = localStorage.getItem('company_id');

  const sendFeedback = async (interested) => {
    if (feedbackSent) return;
    try {
      await API.post(`/companies/${companyId}/feedback`, {
        article_id: article.article_id,
        interested,
        category: article.category
      });
      setFeedbackSent(true);
      setSnackbar({
        open: true,
        message: interested ? '✅ Feedback positivo registrato!' : '❌ Feedback negativo registrato!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({ open: true, message: 'Errore nel feedback.', severity: 'error' });
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip label={article.source} size="small" variant="outlined" />
            {article.sentiment && (
              <Chip label={article.sentiment} size="small" color={sentimentColor[article.sentiment] || 'default'} />
            )}
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {article.title}
          </Typography>

          {article.content_summary && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              {article.content_summary}
            </Typography>
          )}

          {article.entities?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {article.entities.map((e, i) => (
                <Chip key={i} label={e} size="small" sx={{ fontSize: '0.7rem' }} />
              ))}
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            {article.category} · {new Date(article.timestamp).toLocaleDateString('it-IT')}
          </Typography>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 1 }}>
          <Box>
            <Tooltip title="Interessato">
              <span>
                <IconButton size="small" color="success" onClick={() => sendFeedback(true)} disabled={feedbackSent}>
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Non interessato">
              <span>
                <IconButton size="small" color="error" onClick={() => sendFeedback(false)} disabled={feedbackSent}>
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          {article.link && (
            <Tooltip title="Apri articolo">
              <IconButton size="small" href={article.link} target="_blank">
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}