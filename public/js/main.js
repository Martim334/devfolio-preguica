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

loadProjects();