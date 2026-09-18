import express from 'express';
import { db } from '../server/connection.js';

const router = express.Router();

// 1. READ: Listar projetos
router.get('/', async (req, res) => {
  const { user_id } = req.query;

  try {
    let result;
    if (user_id) {
      result = await db.execute({
        sql: 'SELECT * FROM projects WHERE user_id = ? ORDER BY id DESC',
        args: [user_id]
      });
    } else {
      result = await db.execute('SELECT * FROM projects ORDER BY id DESC');
    }

    return res.status(200).json({
      success: true,
      projects: result.rows
    });
  } catch (error) {
    console.error('Erro ao procurar projetos:', error);
    return res.status(500).json({ success: false, message: error.message || String(error) });
  }
});

// 2. CREATE: Adicionar novo desenho
router.post('/', async (req, res) => {
  const { title, description, image_url, user_id } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'O título é obrigatório.' });
  }

  try {
    await db.execute({
      sql: 'INSERT INTO projects (title, description, image_url, user_id) VALUES (?, ?, ?, ?)',
      args: [
        title.trim(),
        description ? description.trim() : '',
        image_url ? image_url.trim() : '',
        user_id || 1
      ]
    });

    return res.status(201).json({ success: true, message: 'Desenho guardado com sucesso!' });
  } catch (error) {
    console.error('Erro ao inserir projeto:', error);
    return res.status(500).json({ success: false, message: error.message || String(error) });
  }
});

// 3. UPDATE: Editar projeto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'O título é obrigatório.' });
  }

  try {
    await db.execute({
      sql: 'UPDATE projects SET title = ?, description = ?, image_url = ? WHERE id = ?',
      args: [
        title.trim(),
        description ? description.trim() : '',
        image_url ? image_url.trim() : '',
        id
      ]
    });

    return res.status(200).json({ success: true, message: 'Projeto atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    return res.status(500).json({ success: false, message: error.message || String(error) });
  }
});

// 4. DELETE: Apagar projeto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute({
      sql: 'DELETE FROM projects WHERE id = ?',
      args: [id]
    });

    return res.status(200).json({ success: true, message: 'Projeto apagado com sucesso!' });
  } catch (error) {
    console.error('Erro ao apagar projeto:', error);
    return res.status(500).json({ success: false, message: error.message || String(error) });
  }
});

export default router;