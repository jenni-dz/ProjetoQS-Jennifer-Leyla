function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === '' || password === '') {
    alert('Preencha todos os campos!');
    return;
  }

  localStorage.setItem('username', email);
  if (!localStorage.getItem('atividades')) {
    localStorage.setItem('atividades', JSON.stringify([]));
  }
  window.location.href = 'home.html';
}

function logout() {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

function getUserName() {
  return localStorage.getItem('username') || 'Usuário';
}