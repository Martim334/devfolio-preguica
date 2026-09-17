import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('ERRO CRÍTICO: Variáveis do Turso em falta no Netlify!');
}

export const db = createClient({
  url: url || '',
  authToken: authToken || '',
});