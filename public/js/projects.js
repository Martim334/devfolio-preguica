// 1. Identificar utilizador logado (garante que fica '1' e não '1.0')
      const storedUser = JSON.parse(localStorage.getItem('user'));
      let rawId = storedUser ? (storedUser.id || storedUser.user_id) : 1;
      const userId = String(rawId).split('.')[0];

// 2. Carregar e listar os projetos no Dashboard
async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  try {
    const res = await fetch(`/api/projects?user_id=${userId}`);
    const data = await res.json();
    const projectsList = Array.isArray(data) ? data : (data.projects || []);

    if (projectsList.length > 0) {
      container.innerHTML = projectsList.map(project => {
        const title = project.title || 'Sem título';
        const desc = project.description || 'Sem descrição.';
        const img = project.image_url || '';

        return `
          <div class="project-card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            ${img ? `<img src="${img}" alt="${title}" style="max-width: 200px; display: block; margin-bottom: 10px; border-radius: 4px;">` : ''}
            <h3>${title}</h3>
            <p>${desc}</p>
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

// 3. Adicionar novo projeto / desenho
const projectForm = document.getElementById('projectForm');

if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title')?.value;
    const description = document.getElementById('description')?.value;
    const image_url = document.getElementById('image_url')?.value;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          image_url, 
          user_id: userId 
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Desenho adicionado com sucesso!');
        window.location.href = '/dashboard/projects.html';
      } else {
        alert('Erro do Servidor: ' + (data.message || `Status ${res.status}`));
      }
    } catch (err) {
      console.error('Erro ao guardar:', err);
      alert('Erro de conexão: ' + err.message);
    }
  });
}

// 4. Apagar projeto
async function deleteProject(id) {
  if (!confirm('Tem a certeza que quer apagar este projeto?')) return;

  try {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok && data.success) {
      loadProjects();
    } else {
      alert(data.message || 'Erro ao apagar.');
    }
  } catch (err) {
    console.error('Erro ao apagar:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);