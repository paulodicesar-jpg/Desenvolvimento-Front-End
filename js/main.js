/**
 * Módulo principal de inicialização e filtragem da aplicação.
 * Liga a API (busca) aos Estados (renderização do DOM) e aplica os filtros de busca.
 */

import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';

let todasAsTarefas = [];

async function inicializar() {
  renderizarEstado('carregando');

  try {
    const tarefas = await carregarTarefas();

    if (!Array.isArray(tarefas) || tarefas.length === 0) {
      renderizarEstado('vazio');
      return;
    }

    todasAsTarefas = tarefas;
    renderizarEstado('sucesso', todasAsTarefas);
    configurarEventosDeFiltro();

  } catch (erro) {
    let mensagemErro = 'Ocorreu um erro ao carregar os dados.';

    if (erro.name === 'TypeError') {
      mensagemErro = 'Falha de conexão com a rede. Verifique se está online.';
    } else if (erro.name === 'SyntaxError') {
      mensagemErro = 'O arquivo de dados está em um formato inválido (JSON malformado).';
    } else {
      mensagemErro = erro.message;
    }

    renderizarEstado('erro', mensagemErro);
  }
}

function aplicarFiltros(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // 1. Termo de busca (Título, Projeto e Responsável)
  const inputBusca = document.querySelector('input[type="search"], input[type="text"]');
  const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : '';

  // 2. Radio Button de Status
  const radioStatus = document.querySelector('input[type="radio"]:checked');
  const valorRadio = radioStatus ? radioStatus.value.toLowerCase().trim() : 'todos';

  // 3. Select de Prioridade
  const selectPrioridade = document.querySelector('select');
  const valorPrioridade = selectPrioridade ? selectPrioridade.value.toLowerCase().trim() : 'todas as prioridades';

  const mapaStatus = {
    'todos': 'todos',
    'a fazer': 'afazer',
    'afazer': 'afazer',
    'em andamento': 'andamento',
    'andamento': 'andamento',
    'em revisão': 'revisao',
    'em revisao': 'revisao',
    'revisao': 'revisao',
    'concluída': 'concluido',
    'concluida': 'concluido',
    'concluido': 'concluido'
  };

  const statusFiltro = mapaStatus[valorRadio] || valorRadio;

  const tarefasFiltradas = todasAsTarefas.filter(tarefa => {
    // Busca abrangente: Título, Projeto ou Responsável
    const titulo = (tarefa.titulo || '').toLowerCase();
    const projeto = (tarefa.projeto || '').toLowerCase();
    const responsavel = (tarefa.responsavel || '').toLowerCase();
    
    const passaTexto = termoBusca === '' || 
                       titulo.includes(termoBusca) || 
                       projeto.includes(termoBusca) || 
                       responsavel.includes(termoBusca);

    // Validação de Status
    const statusTarefa = (tarefa.status || '').toLowerCase();
    const passaStatus = (statusFiltro === 'todos') ? true : (statusTarefa === statusFiltro);

    // Validação de Prioridade
    const prioridadeTarefa = (tarefa.prioridade || '').toLowerCase();
    const passaPrioridade = (valorPrioridade === 'todas as prioridades' || valorPrioridade === 'todas') 
      ? true 
      : (prioridadeTarefa === valorPrioridade);

    return passaTexto && passaStatus && passaPrioridade;
  });

  if (tarefasFiltradas.length === 0) {
    renderizarEstado('vazio');
  } else {
    renderizarEstado('sucesso', tarefasFiltradas);
  }
}

function configurarEventosDeFiltro() {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', aplicarFiltros);
  }

  const botoes = document.querySelectorAll('button');
  botoes.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      aplicarFiltros(e);
    });
  });

  const inputBusca = document.querySelector('input[type="search"], input[type="text"]');
  if (inputBusca) {
    inputBusca.addEventListener('input', aplicarFiltros);
  }

  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => radio.addEventListener('change', aplicarFiltros));

  const selectPrioridade = document.querySelector('select');
  if (selectPrioridade) {
    selectPrioridade.addEventListener('change', aplicarFiltros);
  }
}

document.addEventListener('DOMContentLoaded', inicializar);