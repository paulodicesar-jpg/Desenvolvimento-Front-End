
export function renderizarTarefas(tarefas = []) {
  const main = document.querySelector('main');
  if (!main) return;

  main.textContent = '';
  
  const configuracaoColunas = [
    { status: 'afazer', titulo: 'A Fazer', id: 'status-afazer-titulo' },
    { status: 'andamento', titulo: 'Em Andamento', id: 'status-andamento-titulo' },
    { status: 'revisao', titulo: 'Em Revisão', id: 'status-revisao-titulo' },
    { status: 'concluido', titulo: 'Concluída', id: 'status-concluido-titulo' }
  ];

  // Helper para formatar a data de YYYY-MM-DD para DD/MM/YYYY
  function formatarData(dataISO) {
    if (!dataISO) return '';
    const partes = dataISO.split('-');
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Para cada status, cria a coluna <section>
  configuracaoColunas.forEach(coluna => {
    const section = document.createElement('section');
    section.setAttribute('aria-labelledby', coluna.id);

    const h2 = document.createElement('h2');
    h2.id = coluna.id;
    h2.textContent = coluna.titulo;
    section.appendChild(h2);

    const ul = document.createElement('ul');

    // Filtra as tarefas correspondentes à coluna atual
    const tarefasDaColuna = tarefas.filter(t => t.status === coluna.status);

    tarefasDaColuna.forEach(tarefa => {
      const li = document.createElement('li');
      const article = document.createElement('article');

      // Título da tarefa
      const h3 = document.createElement('h3');
      h3.textContent = tarefa.titulo;
      article.appendChild(h3);

      // Projeto
      if (tarefa.projeto) {
        const pProjeto = document.createElement('p');
        const strongProjeto = document.createElement('strong');
        strongProjeto.textContent = 'Projeto: ';
        pProjeto.appendChild(strongProjeto);
        pProjeto.appendChild(document.createTextNode(tarefa.projeto));
        article.appendChild(pProjeto);
      }

      // Responsável
      if (tarefa.responsavel) {
        const pResp = document.createElement('p');
        const strongResp = document.createElement('strong');
        strongResp.textContent = 'Responsável: ';
        pResp.appendChild(strongResp);
        pResp.appendChild(document.createTextNode(tarefa.responsavel));
        article.appendChild(pResp);
      }

      // Prazo
      if (tarefa.prazo) {
        const pPrazo = document.createElement('p');
        const strongPrazo = document.createElement('strong');
        strongPrazo.textContent = 'Prazo: ';
        pPrazo.appendChild(strongPrazo);

        const time = document.createElement('time');
        time.setAttribute('datetime', tarefa.prazo);
        time.textContent = formatarData(tarefa.prazo);
        pPrazo.appendChild(time);

        article.appendChild(pPrazo);
      }

      // Prioridade
      if (tarefa.prioridade) {
        const pPrio = document.createElement('p');
        const strongPrio = document.createElement('strong');
        strongPrio.textContent = 'Prioridade: ';
        pPrio.appendChild(strongPrio);
        pPrio.appendChild(document.createTextNode(tarefa.prioridade));
        article.appendChild(pPrio);
      }

      li.appendChild(article);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    main.appendChild(section);
  });
}