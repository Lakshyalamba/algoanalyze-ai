type ServerEnv = {
  host: string;
  port: number;
  clientUrl: string;
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

function parsePort(value: string | undefined) {
  const port = Number(value ?? 5000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Invalid PORT. Expected a positive integer, for example PORT=5000.');
  }

  return port;
}

export function loadEnv(): ServerEnv {
  const missingVariables = getMissingRequiredVariables();

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

  return {
    host: process.env.HOST?.trim() || '127.0.0.1',
    port: parsePort(process.env.PORT),
    clientUrl: process.env.CLIENT_URL?.trim() || 'http://localhost:5173',
    databaseUrl: process.env.DATABASE_URL!.trim(),
    jwtSecret: process.env.JWT_SECRET!.trim(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
    geminiApiKey,
    isGeminiConfigured: Boolean(geminiApiKey),
  };
}
