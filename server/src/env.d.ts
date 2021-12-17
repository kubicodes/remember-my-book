declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    SESSION_SECRET: string;
  }
}