document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("user-name").innerText = user;

  const atividades = JSON.parse(localStorage.getItem("atividades")) || [];
  const tbody = document.querySelector("tbody");

  atividades.forEach(atv => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${atv.titulo}</td>
      <td>${atv.inicio}</td>
      <td>${atv.fim}</td>
      <td>${atv.prioridade}</td>
      <td>${atv.status}</td>
    `;
    tbody.appendChild(tr);
  });
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
