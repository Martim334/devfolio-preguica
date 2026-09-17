const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Caminhos exatos conforme a estrutura das tuas pastas (server/db/routes/...)
const authRoutes = require('../server/db/routes/auth.js');
const projectsRoutes = require('../server/db/routes/projects.js');

const app = express();

app.use(cors());
app.use(express.json());

// Suporte para chamadas com ou sem o prefixo da função
app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/projects', projectsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);

module.exports.handler = serverless(app);