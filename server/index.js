import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './db/routes/auth.js';
import projectsRouter from './db/routes/projects.js';

dotenv.config();

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRouter);


app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});