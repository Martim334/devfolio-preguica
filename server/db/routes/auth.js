import express from 'express';

import bcrypt from 'bcryptjs';
import { db } from '../server/connection.js';

const router = express.Router();

// ==========================================
// ROTA DE REGISTO (POST /api/auth/register)
// ==========================================
router.post('/register', async (req, res) => {
  const { name, email, password, bio } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: 'INSERT INTO users (name, email, password, bio) VALUES (?, ?, ?, ?)',
      args: [name, email, hashedPassword, bio || '']
    });

    return res.status(201).json({ success: true, message: 'Utilizador criado com sucesso!' });
  } catch (error) {
    console.error('Erro no registo:', error);

    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, message: 'Este email já está registado.' });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
});

// ===============================================
// ROTA DE LOGIN (POST /api/auth/login)
// ===============================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Preencha o email e a password.' });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT id, name, email, password, bio FROM users WHERE LOWER(email) = LOWER(?)',
      args: [String(email).trim()]
    });
    
    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const rawUser = result.rows[0];
    const user = {
      id: rawUser.id ?? rawUser[0],
      name: rawUser.name ?? rawUser[1],
      email: rawUser.email ?? rawUser[2],
      password: rawUser.password ?? rawUser[3],
      bio: rawUser.bio ?? rawUser[4]
    };

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login efetuado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;