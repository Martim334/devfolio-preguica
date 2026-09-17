document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. FORMULÁRIO DE LOGIN
  // ==========================================
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          alert('Login efetuado com sucesso!');
          window.location.href = '/dashboard/index.html';
        } else {
          alert(data.message || 'Credenciais inválidas.');
        }
      } catch (err) {
        console.error('Erro no login:', err);
        alert('Erro ao ligar ao servidor.');
      }
    });
  }

  // ==========================================
  // 2. FORMULÁRIO DE REGISTO
  // ==========================================
  
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        // Dentro do evento de submit do formulário de registo em public/js/auth.js:
        const response = await fetch('/api/auth/register', {
          method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email, password, bio })
      });

      const data = await response.json();

  if (response.ok && data.success) {
      alert('Conta criada com sucesso!');
       window.location.href = '/login.html';
  } else {
      // Mostra o erro exato vindo do servidor
       alert(data.message || 'Erro ao criar conta.');
  }
      } catch (err) {
        console.error('Erro no registo:', err);
        alert('Erro ao ligar ao servidor.');
      }
    });
  }
});