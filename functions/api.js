const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Importa as tuas rotas atuais do servidor
const authRoutes = require('../server/routes/auth');
const projectsRoutes = require('../server/routes/projects');
const app = express();

app.use(cors());
app.use(express.json());

// Liga as rotas à função do Netlify
app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/projects', projectsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);

module.exports.handler = serverless(app);