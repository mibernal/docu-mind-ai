export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AI_ENGINES = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
  FALLBACK: 'fallback'
} as const;

export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  EXCEL: 'excel'
} as const;
