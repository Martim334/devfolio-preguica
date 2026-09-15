// server/middleware/auth.js

export function requireAuth(req, res, next) {
  // Recebe o ID do utilizador através do header da requisição ou da sessão
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acesso negado. Faça login para continuar.' 
    });
  }

  // Anexa o ID do utilizador ao request para ser usado nas rotas
  req.userId = userId;
  next();
}