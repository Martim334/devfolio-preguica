console.log('DevPortfolio JS Carregado!');

// 1. Carregar Projetos da API
async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return; // Proteção se não estiver na página de projetos

  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<p>Nenhum projeto encontrado.</p>';
      return;
    }

    container.innerHTML = projects.map(p => `
      <div class="project-card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.githubUrl}" target="_blank">GitHub</a>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p>Erro ao carregar projetos.</p>';
  }
}

async function loadPublicProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<p>Nenhum projeto adicionado ainda.</p>';
      return;
    }

    container.innerHTML = projects.map(project => `
      <div class="project-card">
        <h3>${project.title}</h3>
        <p>${project.description || ''}</p>
        ${project.github_url ? `<a href="${project.github_url}" target="_blank">Ver no GitHub</a>` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar projetos:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadPublicProjects);
loadProjects();