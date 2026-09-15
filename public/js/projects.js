// 1. Identificar utilizador logado
const storedUser = JSON.parse(localStorage.getItem('user'));
const userId = storedUser ? (storedUser.id || storedUser.user_id) : 1;

// 2. Função para carregar e renderizar os projetos
async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  try {
    const res = await fetch(`/api/projects?user_id=${userId}`);
    const data = await res.json();

    if (data.success && data.projects && data.projects.length > 0) {
      container.innerHTML = data.projects.map(project => {
        const title = project.title || 'Sem título';
        const desc = project.description || 'Sem descrição.';
        const github = project.github_Url || project.github_url || '';
        const deploy = project.deploy || project.live_Url || project.deploy_url || '';

        return `
          <div class="project-card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            <h3>${title}</h3>
            <p>${desc}</p>
            ${github ? `<a href="${github}" target="_blank">GitHub</a> ` : ''}
            ${deploy ? `<a href="${deploy}" target="_blank">Demo/Deploy</a>` : ''}
            <br/><br/>
            <button onclick="deleteProject(${project.id})">Apagar</button>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = '<p>Nenhum projeto encontrado.</p>';
    }
  } catch (err) {
    console.error('Erro ao carregar projetos:', err);
  }
}

// 3. Registar o envio do formulário e carregar lista ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();

  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('projectTitle').value;
      const description = document.getElementById('projectDescription').value;
      const github_url = document.getElementById('projectGithub').value;
      const deploy_url = document.getElementById('projectDeploy').value;

      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            title,
            description,
            github_url,
            deploy_url
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          alert('Projeto guardado com sucesso!');
          projectForm.reset();
          
          // Se o formulário estiver na página project-form.html, redireciona para a lista
          if (window.location.pathname.includes('project-form.html')) {
            window.location.href = '/dashboard/projects.html';
          } else {
            loadProjects(); // Recarrega se estiver na mesma página
          }
        } else {
          alert(data.message || 'Erro ao guardar projeto.');
        }
      } catch (err) {
        console.error('Erro ao submeter:', err);
      }
    });
  }
});

// 4. Função para apagar projeto
async function deleteProject(id) {
  if (!confirm('Tens a certeza que queres apagar este projeto?')) return;

  try {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
      loadProjects();
    } else {
      alert(data.message || 'Erro ao apagar.');
    }
  } catch (err) {
    console.error('Erro ao apagar:', err);
  }
}