/**
 * Módulo principal de inicialização da aplicação.
 * Liga a API (busca) aos Estados (renderização do DOM)
 * e faz o tratamento diferenciado de erros no catch.
 */

import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';

async function inicializar() {
  // 1. Aplica o estado "carregando" ANTES do await da requisição
  renderizarEstado('carregando');

  try {
    const tarefas = await carregarTarefas();

    // 2. Verifica se a lista retornou vazia (não é erro, é estado "vazio")
    if (!Array.isArray(tarefas) || tarefas.length === 0) {
      renderizarEstado('vazio');
      return;
    }

    // 3. Aplica o estado de sucesso passando o array de tarefas
    renderizarEstado('sucesso', tarefas);

  } catch (erro) {
    // 4. Distingue os tipos de falha por erro.name
    let mensagemErro = 'Ocorreu um erro ao carregar os dados.';

    if (erro.name === 'TypeError') {
      mensagemErro = 'Falha de conexão com a rede. Verifique se está online.';
    } else if (erro.name === 'SyntaxError') {
      mensagemErro = 'O arquivo de dados está em um formato inválido (JSON malformado).';
    } else {
      mensagemErro = erro.message; // Ex: Erro HTTP 404
    }

    renderizarEstado('erro', mensagemErro);
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializar);