// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://claim-ai.up.railway.app';

export const API_ENDPOINTS = {
  health: '/api/v1/health',
  uploadDocument: '/api/v1/upload-document',
  evaluate: '/api/v1/evaluate',
};