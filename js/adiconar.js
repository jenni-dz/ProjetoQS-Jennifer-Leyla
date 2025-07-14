document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o usuário está logado
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("user-name").innerText = user;

  // Verifica se está editando
  const editIndex = localStorage.getItem("editIndex");
  const isEditing = editIndex !== null;

  if (isEditing) {
    document.getElementById("page-title").innerText = "Editar Atividade";
    document.getElementById("submit-btn").innerText = "Atualizar";
    
    // Carrega dados para edição
    const atividades = JSON.parse(localStorage.getItem("atividades")) || [];
    const atividade = atividades[editIndex];
    
    if (atividade) {
      document.getElementById("titulo").value = atividade.titulo;
      document.getElementById("inicio").value = atividade.inicio;
      document.getElementById("fim").value = atividade.fim;
      document.getElementById("prioridade").value = atividade.prioridade;
      document.getElementById("status").value = atividade.status;
    }
  }
});

// Função para salvar atividade
function salvarAtividade() {
  // Coleta dados do formulário
  const titulo = document.getElementById("titulo").value.trim();
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;
  const prioridade = document.getElementById("prioridade").value;
  const status = document.getElementById("status").value;

  // Validações básicas
  if (!titulo) {
    alert("O título é obrigatório!");
    return false;
  }

  if (!inicio || !fim) {
    alert("As datas de início e fim são obrigatórias!");
    return false;
  }

  // Verifica se a data de fim não é anterior à data de início
  if (new Date(fim) < new Date(inicio)) {
    alert("A data de fim não pode ser anterior à data de início!");
    return false;
  }

  // Cria objeto da atividade
  const atividade = {
    titulo: titulo,
    inicio: inicio,
    fim: fim,
    prioridade: prioridade,
    status: status
  };

  // Carrega atividades existentes
  let atividades = JSON.parse(localStorage.getItem("atividades")) || [];

  // Verifica se está editando
  const editIndex = localStorage.getItem("editIndex");
  
  if (editIndex !== null) {
    // Atualiza atividade existente
    atividades[editIndex] = atividade;
    localStorage.removeItem("editIndex");
  } else {
    // Adiciona nova atividade
    atividades.push(atividade);
  }

  // Salva no localStorage
  localStorage.setItem("atividades", JSON.stringify(atividades));

  // Redireciona para home
  window.location.href = "home.html";
  
  return false; // Impede o submit padrão do form
}

// Função para cancelar
function cancelar() {
  localStorage.removeItem("editIndex");
  window.location.href = "home.html";
}

// Função de logout
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("editIndex");
  window.location.href = "index.html";
}