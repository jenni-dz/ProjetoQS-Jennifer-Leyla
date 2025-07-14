document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  
  document.getElementById("user-name").innerText = user;
  
  // Carrega atividades do localStorage
  const atividades = JSON.parse(localStorage.getItem("atividades")) || [];
  
  // Containers por status
  const containers = {
    "Pendente": document.getElementById("pendente"),
    "Em Andamento": document.getElementById("em-andamento"),
    "Finalizado": document.getElementById("finalizado")
  };
  
  // Função para formatar data corretamente
  function formatarData(dataString) {
    if (!dataString) return "Data inválida";
    
    try {
      // Se a data está no formato YYYY-MM-DD
      if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
      }
      
      // Se já está no formato brasileiro
      if (dataString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dataString;
      }
      
      // Tenta criar uma data e formatar
      const data = new Date(dataString + 'T00:00:00'); // Adiciona horário para evitar problema de fuso
      if (!isNaN(data.getTime())) {
        return data.toLocaleDateString('pt-BR');
      }
      
      return dataString; // Retorna original se não conseguir formatar
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dataString;
    }
  }
  
  // Função para ordenar por prioridade
  function ordenarPorPrioridade(atividades) {
    const ordemPrioridade = {
      'Alta': 1,
      'Média': 2,
      'Baixa': 3
    };
    
    return atividades.sort((a, b) => {
      const prioridadeA = ordemPrioridade[a.prioridade] || 4;
      const prioridadeB = ordemPrioridade[b.prioridade] || 4;
      
      // Ordena primeiro por prioridade
      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }
      
      // Se prioridades são iguais, ordena por data de fim (mais urgentes primeiro)
      const dataA = new Date(a.fim);
      const dataB = new Date(b.fim);
      return dataA - dataB;
    });
  }
  
  // Renderiza atividades nos respectivos containers
  function renderizar() {
    Object.values(containers).forEach(container => container.innerHTML = "");
    
    // Verifica se há atividades
    if (atividades.length === 0) {
      Object.values(containers).forEach(container => {
        container.innerHTML = '<div class="empty-state">Nenhuma atividade encontrada</div>';
      });
      return;
    }
    
    // Agrupa atividades por status
    const atividadesPorStatus = {
      "Pendente": [],
      "Em Andamento": [],
      "Finalizado": []
    };
    
    // Adiciona índice original para manter referência
    atividades.forEach((atv, index) => {
      const atvComIndex = { ...atv, originalIndex: index };
      if (atividadesPorStatus[atv.status]) {
        atividadesPorStatus[atv.status].push(atvComIndex);
      }
    });
    
    // Ordena cada grupo por prioridade
    Object.keys(atividadesPorStatus).forEach(status => {
      atividadesPorStatus[status] = ordenarPorPrioridade(atividadesPorStatus[status]);
    });
    
    // Renderiza cada grupo ordenado
    Object.keys(atividadesPorStatus).forEach(status => {
      const container = containers[status];
      const atividadesDoStatus = atividadesPorStatus[status];
      
      if (atividadesDoStatus.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhuma atividade nesta seção</div>';
        return;
      }
      
      atividadesDoStatus.forEach((atv) => {
        const card = document.createElement("div");
        card.className = "card";
        
        // Adiciona classe CSS baseada na prioridade para estilização
        const prioridadeClass = `prioridade-${String(atv.prioridade).toLowerCase()}`;
        card.classList.add(prioridadeClass);
        
        card.innerHTML = `
          <div class="card-header">
            <h4>${atv.titulo}</h4>
            <span class="prioridade ${String(atv.prioridade).toLowerCase()}">${atv.prioridade}</span>
          </div>
          <div class="card-info">
            <p><strong>Início:</strong> ${formatarData(atv.inicio)}</p>
            <p><strong>Fim:</strong> ${formatarData(atv.fim)}</p>
          </div>
          <div class="actions">
            <button onclick="editar(${atv.originalIndex})">Editar</button>
            <button onclick="excluir(${atv.originalIndex})">Excluir</button>
          </div>
        `;
        
        container.appendChild(card);
      });
    });
  }
  
  // Excluir atividade
  window.excluir = function (index) {
    if (confirm("Deseja excluir esta atividade?")) {
      atividades.splice(index, 1);
      localStorage.setItem("atividades", JSON.stringify(atividades));
      renderizar();
    }
  };
  
  // Editar atividade
  window.editar = function (index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "adicionar.html";
  };
  
  // Inicializa renderização
  renderizar();
});

// Sair
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("editIndex");
  window.location.href = "index.html";
}