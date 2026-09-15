import express from 'express';
import { db } from '../server/connection.js';
const router = express.Router();

// ===============================================
// 1. READ: Listar projetos (GET /api/projects?user_id=1)
// ===============================================
router.get('/', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'ID do utilizador é obrigatório.' });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      args: [user_id]
    });

    return res.status(200).json({
      success: true,
      projects: result.rows
    });
  } catch (error) {
    console.error('Erro ao procurar projetos:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ===============================================
// 2. CREATE: Adicionar novo projeto (POST /api/projects)
// ===============================================
// READ: Listar projetos do utilizador
router.get('/', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'ID do utilizador é obrigatório.' });
  }

  try {
    const result = await db.execute({
      // ⚠️ Corrigido de created_at para createdAt:
      sql: 'SELECT * FROM projects WHERE user_id = ? ORDER BY createdAt DESC',
      args: [user_id]
    });

    return res.status(200).json({
      success: true,
      projects: result.rows
    });
  } catch (error) {
    console.error('Erro ao procurar projetos:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ===============================================
// 3. UPDATE: Editar projeto (PUT /api/projects/:id)
// ===============================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, github_url, deploy_url, image_url } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'O título é obrigatório.' });
  }

  try {
    await db.execute({
      sql: `UPDATE projects 
            SET title = ?, description = ?, github_url = ?, deploy_url = ?, image_url = ? 
            WHERE id = ?`,
      args: [
        title.trim(),
        description ? description.trim() : '',
        github_url ? github_url.trim() : '',
        deploy_url ? deploy_url.trim() : '',
        image_url ? image_url.trim() : '',
        id
      ]
    });

    return res.status(200).json({ success: true, message: 'Projeto atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ===============================================
// 4. DELETE: Apagar projeto (DELETE /api/projects/:id)
// ===============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute({
      sql: 'DELETE FROM projects WHERE id = ?',
      args: [id]
    });

    return res.status(200).json({ success: true, message: 'Projeto removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao apagar projeto:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;