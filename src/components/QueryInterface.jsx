// src/components/QueryInterface.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  Fade,
  Grow,
  Snackbar,
  Alert,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Send,
  AutoAwesome,
  AttachFile,
  Code,
  HelpOutline,
  Policy,
  CheckCircle,
  Cancel,
  WarningAmber,
  FormatQuote,
  DescriptionOutlined,
  SearchOff,
  PersonOutline, // NEW ICON
  Autorenew,      // NEW ICON
  TimerOutlined,  // NEW ICON
  KingBedOutlined,// NEW ICON
  ChildFriendly,  // NEW ICON
  ReceiptLong,    // NEW ICON
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// --- Internal Components ---

const SuggestionCard = ({ icon, title, subtitle, onClick }) => (
  <Grow in>
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{ p: 2, cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { bgcolor: 'action.hover' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Grow>
);

const UserBubble = ({ content }) => {
  const theme = useTheme();
  return (
    <Box sx={{ alignSelf: 'flex-end', maxWidth: {xs: '90%', sm: '85%'}, mb: 2 }}>
      <Typography
        sx={{
          p: '10px 16px',
          bgcolor: 'primary.main',
          color: theme.palette.getContrastText(theme.palette.primary.main),
          borderRadius: '20px 20px 4px 20px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};

const AIResponseCard = ({ responseData }) => {
  const theme = useTheme();
  const {
    decision,
    justification,
    amount,
    currency,
    referenced_clauses = [],
    warnings = [],
  } = responseData;

  const isApproved = decision?.toLowerCase() === 'approved';
  const decisionColor = isApproved ? 'success.main' : 'error.main';
  const DecisionIcon = isApproved ? CheckCircle : Cancel;
  
  const actualClauses = referenced_clauses.filter(
    (clause) => !clause.clause_text?.includes('No relevant clause found')
  );

  return (
    <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 2 }}>
      <Paper elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: {xs: 1.5, sm: 2} }}>
          <AutoAwesome sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Analysis Complete
          </Typography>
          <Chip
            icon={<DecisionIcon sx={{ color: decisionColor + ' !important' }} />}
            label={decision || 'Review'}
            size="medium"
            variant="outlined"
            sx={{ borderColor: decisionColor, color: decisionColor, fontWeight: 600 }}
          />
        </Box>

        <Divider />

        <Box sx={{ p: {xs: 2, sm: 2.5} }}>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            {justification || 'No justification provided.'}
          </Typography>
        </Box>

        {amount > 0 && (
          <Box sx={{ px: {xs: 2, sm: 2.5}, pb: {xs: 2, sm: 2.5} }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: {xs: 0.5, sm: 2}, alignItems: {xs: 'flex-start', sm: 'center' } }}>
                <Typography variant="body2" color="text.secondary">Approved Amount:</Typography>
                <Typography variant="h6" fontWeight="600">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(amount)}</Typography>
            </Paper>
          </Box>
        )}
        
        <Divider />

        <Box sx={{ p: {xs: 2, sm: 2.5} }}>
          {actualClauses.length > 0 ? (
            <>
              <Typography variant="overline" color="text.secondary">
                Referenced Clauses
              </Typography>
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {actualClauses.map((clause, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{ p: 2, borderLeft: 4, borderColor: 'primary.main', bgcolor: 'action.hover' }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <FormatQuote sx={{ color: 'text.secondary', transform: 'scaleX(-1)', flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                        {clause.clause_text}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 1.5 }}>
                      <DescriptionOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {clause.document_ref}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                <SearchOff sx={{ color: 'text.secondary' }} />
                <Box>
                    <Typography variant="body1" fontWeight="500">No Specific Clauses Found</Typography>
                    <Typography variant="body2" color="text.secondary">The decision was based on general policy rules.</Typography>
                </Box>
            </Box>
          )}
        </Box>

        {warnings.length > 0 && warnings[0] && (
           <>
            <Divider />
            <Box sx={{ p: {xs: 2, sm: 2.5} }}>
              {warnings.map((warning, index) => (
                <Alert key={index} severity="warning" icon={<WarningAmber fontSize="inherit" />}>
                  {warning}
                </Alert>
              ))}
            </Box>
           </>
        )}
      </Paper>
    </Box>
  );
};


// --- Main Query Interface Component ---

function QueryInterface() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, loading]);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };
  
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length) {
      setFiles(prev => [...prev, ...selectedFiles]);
      showNotification(`${selectedFiles.length} file(s) attached.`, 'info');
    }
    if(fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleRemoveFile = (fileName) => {
    setFiles(files.filter(f => f.name !== fileName));
  };

  const handleSend = async () => {
    const queryText = input.trim();
    if (!queryText && files.length === 0) return;

    setLoading(true);

    if (queryText) {
      setConversation(prev => [...prev, { role: 'user', content: queryText }]);
    }
    setInput('');

    try {
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.uploadDocument}`, formData);
        showNotification('Documents ready for analysis.', 'success');
        setFiles([]);
      }
      
      if(queryText) {
          const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.evaluate}`, { query: queryText });
          const aiMessage = { role: 'ai', content: response.data };
          setConversation(prev => [...prev, aiMessage]);
      }
    } catch (error) {
        const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
        showNotification(errorMessage, 'error');
        const errorResponse = {
            decision: 'Error',
            justification: `Sorry, the analysis could not be completed. The server responded with an error.`,
            warnings: [errorMessage]
        };
        setConversation(prev => [...prev, { role: 'ai', content: errorResponse }]);
    } finally {
        setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // UPDATED: New list of general queries
  const suggestions = [
    { icon: <PersonOutline color="primary" />, title: "Entry Age", subtitle: "Min & max age for policy", query: "What is the minimum and maximum entry age for this health insurance policy?" },
    { icon: <Autorenew color="primary" />, title: "Lifelong Renewal", subtitle: "Check renewal options", query: "Is there a lifelong renewal option or does coverage stop after a certain age?"},
    { icon: <TimerOutlined color="primary" />, title: "Waiting Periods", subtitle: "For initial illnesses", query: "What is the initial waiting period for all illnesses except accidents?"},
    { icon: <KingBedOutlined color="primary" />, title: "Room Rent Limits", subtitle: "Daily limits & ICU", query: "What is the room rent limit per day? Does it cover ICU charges?"},
    { icon: <ChildFriendly color="primary" />, title: "Newborn Coverage", subtitle: "From birth or later", query: "Is a newborn baby covered from birth, or after 90 days?"},
    { icon: <ReceiptLong color="primary" />, title: "Claims Process", subtitle: "How to file a claim", query: "What is the process to file a claim?"},
  ];

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Messages Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column' }}>
          {conversation.length === 0 && !loading ? (
            <Fade in>
              <Box sx={{ m: 'auto', textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ mb: 1, fontSize: {xs: '1.8rem', sm: '2.125rem'} }}>Hello</Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontSize: {xs: '1.2rem', sm: '1.5rem'} }}>How can I help today?</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, maxWidth: '800px', mx: 'auto' }}>
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={i} {...s} onClick={() => setInput(s.query)} />
                  ))}
                </Box>
              </Box>
            </Fade>
          ) : (
            conversation.map((msg, idx) =>
              msg.role === 'user' ? (
                <UserBubble key={idx} content={msg.content} />
              ) : (
                <AIResponseCard key={idx} responseData={msg.content} />
              )
            )
          )}
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, alignSelf: 'flex-start', pl: 1, mt: 2 }}>
                <AutoAwesome sx={{ color: 'primary.main' }} />
                <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: { xs: 1, sm: 2 }, pt: 1, width: '100%', mx: 'auto', flexShrink: 0 }}>
           {files.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5, pl: 2, justifyContent: 'flex-start' }}>
              {files.map(file => (
                <Chip key={file.name} label={file.name} onDelete={() => handleRemoveFile(file.name)} />
              ))}
            </Box>
          )}
          <Paper
            elevation={0}
            sx={{ p: '4px 12px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '28px', bgcolor: 'background.paper' }}
          >
            <IconButton sx={{p:1}} onClick={() => fileInputRef.current?.click()} disabled={loading}>
              <AttachFile />
            </IconButton>
            <input ref={fileInputRef} type="file" hidden multiple accept=".pdf,.docx,.eml" onChange={handleFileSelect} />
            <TextField
              fullWidth
              multiline
              maxRows={5}
              variant="standard"
              placeholder="Attach documents and ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '1rem', py: 1.25 },
              }}
            />
            <IconButton sx={{p:1}} onClick={handleSend} disabled={loading || (!input.trim() && files.length === 0)} color="primary">
              <Send />
            </IconButton>
          </Paper>
        </Box>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default QueryInterface;