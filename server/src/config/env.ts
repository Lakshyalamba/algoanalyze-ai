type ServerEnv = {
  clientUrl: string;
  allowVercelPreviews: boolean;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  geminiApiKey?: string;
  isGeminiConfigured: boolean;
};

const requiredVariables = ['DATABASE_URL', 'JWT_SECRET'] as const;

function getMissingRequiredVariables() {
  return requiredVariables.filter((key) => !process.env[key]?.trim());
}

export function loadEnv(): ServerEnv {
  const missingVariables = getMissingRequiredVariables();
  const clientUrl = process.env.CLIENT_URL?.trim();

  if (missingVariables.length > 0) {
    throw new Error(
      [
        'Missing required backend environment variables:',
        ...missingVariables.map((key) => `- ${key}`),
        '',
        'Create server/.env from server/.env.example and set DATABASE_URL and JWT_SECRET before starting the API.',
      ].join('\n'),
    );
  }

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  if (!geminiApiKey) {
    console.warn(
      'GEMINI_API_KEY is not set. The server will start, and future AI routes should use mock responses.',
    );
  }

  if (process.env.NODE_ENV === 'production' && !clientUrl) {
    throw new Error('Missing CLIENT_URL. Set CLIENT_URL to the deployed frontend URL in production.');
  }

  return {
    clientUrl: clientUrl || 'http://localhost:5173',
    allowVercelPreviews: process.env.ALLOW_VERCEL_PREVIEWS === 'true',
    databaseUrl: process.env.DATABASE_URL!.trim(),
    jwtSecret: process.env.JWT_SECRET!.trim(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
    geminiApiKey,
    isGeminiConfigured: Boolean(geminiApiKey),
  };
}
