export interface ApiConfig {
  port: number;
  prefix: string;
  corsOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
  bodyLimit: string;
}

export const apiConfig: ApiConfig = {
  port: 3001,
  prefix: '/api',
  corsOrigins: ['http://localhost:3000', 'https://t.me'],
  rateLimit: {
    windowMs: 60 * 1000,
    max: 100,
  },
  bodyLimit: '10mb',
};
