/**
 * Módulo responsável por gerenciar a exibição dos 4 estados da tela
 * e informar leitores de tela via região viva de acessibilidade.
 */

import { renderizarTarefas } from './renderizacao.js';

export function renderizarEstado(estado, dados = null) {
  const regiaoStatus = document.getElementById('status-regiao');
  const main = document.querySelector('main');

  if (!regiaoStatus || !main) return;

  switch (estado) {
    case 'carregando':
      regiaoStatus.textContent = 'Carregando tarefas, por favor aguarde...';
      main.textContent = 'Carregando tarefas...';
      break;

    case 'vazio':
      regiaoStatus.textContent = 'Nenhuma tarefa encontrada.';
      main.textContent = 'Não há tarefas disponíveis no momento.';
      break;

    case 'erro':
      regiaoStatus.textContent = `Erro: ${dados}`;
      main.textContent = `Não foi possível carregar as tarefas. (${dados})`;
      break;

    case 'sucesso':
      // Garante que o container principal seja limpo antes de desenhar o quadro
      main.textContent = '';
      
      // Renderiza as colunas e cartões usando a função intocada da E2
      renderizarTarefas(dados);

      // Anuncia o sucesso e a quantidade para a região viva
      const total = Array.isArray(dados) ? dados.length : 0;
      regiaoStatus.textContent = `Tarefas carregadas com sucesso. Total de ${total} tarefa(s).`;
      break;

    default:
      break;
  }
}