import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';

import authRoutes from '../server/db/routes/auth.js';
import projectsRoutes from '../server/db/routes/projects.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/projects', projectsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);

export const handler = serverless(app);