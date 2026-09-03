/**
 * Módulo responsável exclusivamente por buscar dados da rede.
 * Não realiza qualquer manipulação de DOM.
 */

export async function carregarTarefas() {
  const resposta = await fetch('./dados.json');

  // Verifica se a resposta do servidor foi bem-sucedida (status 200-299)
  if (!resposta.ok) {
    throw new Error(`Erro na requisição HTTP: ${resposta.status}`);
  }

  const dados = await resposta.json();
  return dados.tarefas;
}