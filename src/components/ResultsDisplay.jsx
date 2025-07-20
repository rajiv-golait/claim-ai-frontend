import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import { ExpandMore, CheckCircle, Cancel, Help } from '@mui/icons-material';

function ResultsDisplay({ results }) {
  const getDecisionIcon = (decision) => {
    switch (decision?.toLowerCase()) {
      case 'covered':
        return <CheckCircle color="success" />;
      case 'not covered':
        return <Cancel color="error" />;
      default:
        return <Help color="warning" />;
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision?.toLowerCase()) {
      case 'covered':
        return 'success';
      case 'not covered':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Evaluation Results
      </Typography>

      {results.decision && (
        <Alert 
          severity={getDecisionColor(results.decision)}
          icon={getDecisionIcon(results.decision)}
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Decision: {results.decision}
          </Typography>
        </Alert>
      )}

      {results.justification && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Justification
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {results.justification}
          </Typography>
        </Box>
      )}

      {results.referenced_clauses && results.referenced_clauses.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Referenced Policy Clauses
          </Typography>
          {results.referenced_clauses.map((clause, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">
                  {clause.title || `Clause ${index + 1}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {clause.content}
                </Typography>
                {clause.page && (
                  <Chip
                    label={`Page ${clause.page}`}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}

      {results.confidence_score && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Confidence Score: {(results.confidence_score * 100).toFixed(1)}%
          </Typography>
        </Box>
      )}

      {/* Raw JSON display for debugging */}
      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="caption">View Raw Response</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre style={{ 
            fontSize: '12px', 
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px'
          }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ResultsDisplay;