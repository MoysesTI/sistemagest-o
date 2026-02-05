// ==========================================
// CRONOGRAMA.JS - Funções de Cronograma e Tarefas
// PrismaTech Code Academy
// ==========================================

let currentCronogramaItemId = null;

const Cronograma = {
    async render() {
        const container = document.getElementById('cronograma-container');
        if (!container) return;

        const hoje = new Date();
        // Fixar horário em 12:00 para evitar problemas de virada de dia ao converter para ISO/UTC
        hoje.setHours(12, 0, 0, 0);
        hoje.setDate(hoje.getDate() + (cronogramaSemanaOffset * 7));

        // Encontrar segunda-feira da semana
        const diaSemana = hoje.getDay();
        const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
        const segunda = new Date(hoje);
        segunda.setDate(hoje.getDate() + diff);

        const sabado = new Date(segunda);
        sabado.setDate(segunda.getDate() + 5);

        // Atualizar período
        document.getElementById('cronograma-periodo').textContent =
            `${segunda.toLocaleDateString('pt-BR')} - ${sabado.toLocaleDateString('pt-BR')}`;

        // Verificar se há filtro de professor selecionado (admin only)
        const professorSelect = document.getElementById('cronograma-professor');
        const professorIdFiltro = professorSelect ? professorSelect.value : '';

        // Buscar itens do cronograma da API
        let itensAPI = [];
        try {
            const dataInicio = segunda.toISOString().split('T')[0];
            const dataFim = sabado.toISOString().split('T')[0];

            // Admin pode filtrar por professor específico ou ver todos
            // Passa professorId para a API (vazio = meu cronograma, "todos" = todos)
            itensAPI = await API.cronograma.listar(dataInicio, dataFim, professorIdFiltro || undefined);
        } catch (error) {
            console.error('Erro ao buscar cronograma:', error);
        }

        const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const diasEnum = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

        let html = '<div class="cronograma-week">';

        for (let i = 0; i < 6; i++) {
            const dia = new Date(segunda);
            dia.setDate(segunda.getDate() + i);
            const isHoje = dia.toDateString() === new Date().toDateString();
            const diaStr = dia.toISOString().split('T')[0];

            // Filtrar itens da API para este dia
            const itensDia = itensAPI.filter(item => {
                const itemDate = new Date(item.data).toISOString().split('T')[0];
                return itemDate === diaStr;
            });

            // Também buscar turmas do cache que têm aula neste dia (fallback)
            // Inclui turmas ATIVAS, PENDENTES e CONCLUIDAS (para histórico)
            // Exclui apenas CANCELADAS
            // IMPORTANTE: Filtrar por professor baseado na seleção do dropdown
            const token = API.getToken();
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const currentUserId = payload ? (payload.userId || payload.id) : null;
            const turmasDia = turmasCache.filter(t => {
                // Lógica de filtro:
                // - Se "Meu Cronograma" (vazio): mostra apenas turmas do usuário logado
                // - Se "todos": mostra todas as turmas (apenas admin)
                // - Se professor específico: mostra apenas daquele professor
                if (professorIdFiltro === 'todos' && API.isAdmin()) {
                    // Admin escolheu "Todos os Professores" - não filtra
                } else if (professorIdFiltro && API.isAdmin()) {
                    // Admin selecionou professor específico
                    if (t.professorId !== professorIdFiltro) return false;
                } else {
                    // "Meu Cronograma" ou usuário comum - filtra pelo usuário logado
                    if (t.professorId !== currentUserId) return false;
                }
                return t.diasSemana.includes(diasEnum[i]) &&
                    t.status !== 'CANCELADA' &&
                    (!t.dataInicio || new Date(t.dataInicio).toISOString().split('T')[0] <= diaStr) &&
                    (!t.dataFim || new Date(t.dataFim).toISOString().split('T')[0] >= diaStr);
            });

            // Merge: usar itens da API como principal, adicionar turmas não presentes
            const itensFinais = [...itensDia];
            const turmaIdsJaAdicionados = itensDia.filter(i => i.turmaId).map(i => i.turmaId);

            turmasDia.forEach(turma => {
                if (!turmaIdsJaAdicionados.includes(turma.id)) {
                    itensFinais.push({
                        id: `temp-${turma.id}`,
                        turma: turma,
                        turmaId: turma.id,
                        horaInicio: turma.horarioInicio,
                        horaFim: turma.horarioFim,
                        descricao: `${turma.nome} - ${turma.curso?.nome || 'Aula'}`,
                        realizada: false,
                        isTemporal: true
                    });
                }
            });

            // Ordenar por horário
            itensFinais.sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));

            html += `
                <div class="cronograma-day ${isHoje ? 'today' : ''}">
                    <div class="cronograma-day-header">
                        <span class="day-name">${diasNomes[i]}</span>
                        <span class="day-date">${dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <div class="cronograma-day-content">
            `;

            if (itensFinais.length === 0) {
                html += '<div class="cronograma-empty">Sem aulas</div>';
            } else {
                itensFinais.forEach(item => {
                    const isTarefa = item.tarefaExtraId || (!item.turmaId && item.tarefaExtra);
                    const turma = item.turma || {};
                    const tarefaExtra = item.tarefaExtra || {};
                    const cor = isTarefa ? '#e74c3c' : (turma.curso?.cor || '#3498db');
                    const nome = isTarefa ? tarefaExtra.titulo || item.descricao : (turma.nome || item.descricao);
                    const subtitulo = isTarefa ? (tarefaExtra.tipo || 'Tarefa') : (turma.curso?.nome || '');
                    const checkClass = item.realizada ? 'checked' : '';

                    // Status: preencheu conteúdo mas não foi validado?
                    const aguardandoValidacao = !item.realizada && item.conteudoMinistrado;
                    const statusClass = aguardandoValidacao ? 'aguardando-validacao' : '';

                    // Aulas temporais mostram detalhes da turma, itens salvos mostram detalhes do item
                    const clickHandler = item.isTemporal
                        ? `onclick="showTurmaDetails('${item.turmaId}')"`
                        : `onclick="showCronogramaItemDetails('${item.id}')"`;

                    // BOTÕES: check apenas para Admin, conteúdo para Professor
                    let actionButton = '';
                    if (!item.isTemporal) {
                        if (API.isAdmin()) {
                            // Admin vê botão de check
                            actionButton = `
                                <button class="check-btn ${checkClass}" onclick="event.stopPropagation(); toggleCronogramaCheck('${item.id}')" title="${item.realizada ? 'Desmarcar' : 'Marcar como realizado'}">
                                    <i class="bi bi-${item.realizada ? 'check-circle-fill' : 'check-circle'}"></i>
                                </button>
                            `;
                        } else {
                            // Professor vê botão de editar conteúdo (apenas se for aula, não tarefa)
                            if (isTarefa) {
                                actionButton = '';
                            } else {
                                actionButton = item.conteudoMinistrado
                                    ? `<span class="badge-status aguardando" title="Aguardando validação do Admin"><i class="bi bi-clock"></i></span>`
                                    : `<button class="btn-content" onclick="event.stopPropagation(); showConteudoModal('${item.id}')" title="Registrar conteúdo ministrado">
                                        <i class="bi bi-pencil-square"></i>
                                       </button>`;
                            }
                        }
                    } else {
                        // Item temporal
                        if (API.isAdmin()) {
                            // Admin - botão de marcar aula
                            actionButton = `
                                <button class="check-btn" onclick="event.stopPropagation(); marcarAula('${item.turmaId}', '${dia.toISOString()}')" title="Marcar aula realizada">
                                    <i class="bi bi-check-circle"></i>
                                </button>
                            `;
                        } else {
                            // Professor - botão de registrar conteúdo (cria a aula e abre modal)
                            // Apenas se for dono da turma (validado pelo filtro, mas reforçar visualmente se necessário)
                            actionButton = `
                                <button class="btn-content" onclick="event.stopPropagation(); registrarConteudoTemporal('${item.turmaId}', '${dia.toISOString()}')" title="Registrar conteúdo nesta aula">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            `;
                        }
                    }

                    html += `
                        <div class="cronograma-item ${checkClass} ${statusClass} clickable" style="border-left-color: ${cor};" ${clickHandler}>
                            <div class="cronograma-item-header">
                                <span class="cronograma-time">${item.horaInicio || ''}</span>
                                ${actionButton}
                            </div>
                            <div class="cronograma-item-name">${nome}</div>
                            <div class="cronograma-item-curso ${isTarefa ? 'tarefa-badge' : ''}">${subtitulo}</div>
                        </div>
                    `;
                });
            }

            html += '</div></div>';
        }

        html += '</div>';
        container.innerHTML = html;
    },

    mudarSemana(offset) {
        if (offset === 0) {
            cronogramaSemanaOffset = 0;
        } else {
            cronogramaSemanaOffset += offset;
        }
        Cronograma.render();
    },

    async importar() {
        try {
            const result = await API.cronograma.importar();
            showNotification(result.message || 'Cronograma importado!', 'success');
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    async toggleCheck(itemId) {
        try {
            await API.cronograma.marcarPresenca(itemId);
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    async filtrar() {
        const dataInicioInput = document.getElementById('cronograma-data-inicio').value;
        const dataFimInput = document.getElementById('cronograma-data-fim').value;

        if (!dataInicioInput || !dataFimInput) {
            showNotification('Preencha as datas de início e fim para filtrar', 'warning');
            return;
        }

        const dataInicio = new Date(dataInicioInput + 'T00:00:00');
        const dataFim = new Date(dataFimInput + 'T00:00:00');

        if (dataFim < dataInicio) {
            showNotification('A data final deve ser maior ou igual à data inicial', 'error');
            return;
        }

        const diffDays = Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 31) {
            showNotification('O período máximo é de 31 dias', 'warning');
            return;
        }

        const container = document.getElementById('cronograma-container');
        if (!container) return;

        document.getElementById('cronograma-periodo').textContent =
            `${dataInicio.toLocaleDateString('pt-BR')} - ${dataFim.toLocaleDateString('pt-BR')}`;

        const professorSelect = document.getElementById('cronograma-professor');
        const professorIdFiltro = professorSelect ? professorSelect.value : '';

        let itensAPI = [];
        try {
            // Passa professorId para a API (vazio = meu cronograma, "todos" = todos)
            itensAPI = await API.cronograma.listar(dataInicioInput, dataFimInput, professorIdFiltro || undefined);
        } catch (error) {
            console.error('Erro ao buscar cronograma:', error);
            showNotification('Erro ao buscar cronograma: ' + error.message, 'error');
            return;
        }

        const diasNomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const diasEnum = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

        let html = '<div class="cronograma-week cronograma-filtered">';

        const currentDate = new Date(dataInicio);
        while (currentDate <= dataFim) {
            const diaStr = currentDate.toISOString().split('T')[0];
            const diaSemana = currentDate.getDay();
            const isHoje = currentDate.toDateString() === new Date().toDateString();

            const itensDia = itensAPI.filter(item => {
                const itemDate = new Date(item.data).toISOString().split('T')[0];
                return itemDate === diaStr;
            });

            // Inclui turmas ATIVAS, PENDENTES e CONCLUIDAS (para histórico)
            // IMPORTANTE: Filtrar por professor selecionado se Admin escolheu um
            const turmasDia = turmasCache.filter(t => {
                // Filtro por professor (se admin selecionou um específico)
                if (professorIdFiltro && API.isAdmin() && t.professorId !== professorIdFiltro) {
                    return false;
                }
                return t.diasSemana.includes(diasEnum[diaSemana]) &&
                    t.status !== 'CANCELADA' &&
                    (!t.dataInicio || new Date(t.dataInicio).toISOString().split('T')[0] <= diaStr) &&
                    (!t.dataFim || new Date(t.dataFim).toISOString().split('T')[0] >= diaStr);
            });

            const itensFinais = [...itensDia];
            const turmaIdsJaAdicionados = itensDia.filter(i => i.turmaId).map(i => i.turmaId);

            turmasDia.forEach(turma => {
                if (!turmaIdsJaAdicionados.includes(turma.id)) {
                    itensFinais.push({
                        id: `temp-${turma.id}-${diaStr}`,
                        turma: turma,
                        turmaId: turma.id,
                        horaInicio: turma.horarioInicio,
                        horaFim: turma.horarioFim,
                        descricao: `${turma.nome} - ${turma.curso?.nome || 'Aula'}`,
                        realizada: false,
                        isTemporal: true
                    });
                }
            });

            itensFinais.sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));

            html += `
                <div class="cronograma-day ${isHoje ? 'today' : ''}">
                    <div class="cronograma-day-header">
                        <span class="day-name">${diasNomes[diaSemana]}</span>
                        <span class="day-date">${currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                    <div class="cronograma-day-content">
            `;

            if (itensFinais.length === 0) {
                html += '<div class="cronograma-empty">Sem aulas</div>';
            } else {
                itensFinais.forEach(item => {
                    const isTarefa = item.tarefaExtraId || (!item.turmaId && item.tarefaExtra);
                    const turma = item.turma || {};
                    const tarefaExtra = item.tarefaExtra || {};
                    const cor = isTarefa ? '#e74c3c' : (turma.curso?.cor || '#3498db');
                    const nome = isTarefa ? tarefaExtra.titulo || item.descricao : (turma.nome || item.descricao);
                    const subtitulo = isTarefa ? (tarefaExtra.tipo || 'Tarefa') : (turma.curso?.nome || '');
                    const checkClass = item.realizada ? 'checked' : '';

                    // Aulas temporais mostram detalhes da turma, itens salvos mostram detalhes do item
                    const clickHandler = item.isTemporal
                        ? `onclick="showTurmaDetails('${item.turmaId}')"`
                        : `onclick="showCronogramaItemDetails('${item.id}')"`;

                    html += `
                        <div class="cronograma-item clickable ${checkClass}" style="border-left-color: ${cor};" ${clickHandler}>
                            <div class="cronograma-item-header">
                                <span class="cronograma-time">${item.horaInicio || ''}</span>
                                ${!item.isTemporal ? `
                                    <button class="check-btn ${checkClass}" onclick="event.stopPropagation(); toggleCronogramaCheck('${item.id}')" title="${item.realizada ? 'Desmarcar' : 'Marcar como realizado'}">
                                        <i class="bi bi-${item.realizada ? 'check-circle-fill' : 'check-circle'}"></i>
                                    </button>
                                ` : `
                                    <button class="check-btn" onclick="event.stopPropagation(); marcarAula('${item.turmaId}', '${new Date(currentDate).toISOString()}')" title="Marcar aula realizada">
                                        <i class="bi bi-check-circle"></i>
                                    </button>
                                `}
                            </div>
                            <div class="cronograma-item-name">${nome}</div>
                            <div class="cronograma-item-curso ${isTarefa ? 'tarefa-badge' : ''}">${subtitulo}</div>
                        </div>
                    `;
                });
            }

            html += '</div></div>';
            currentDate.setDate(currentDate.getDate() + 1);
        }

        html += '</div>';
        container.innerHTML = html;
        showNotification(`Exibindo ${diffDays} dia(s) do período selecionado`, 'success');
    },

    setupProfessorListener() {
        const select = document.getElementById('cronograma-professor');
        if (select) {
            select.addEventListener('change', () => {
                Cronograma.render();
            });
        }
    },

    // Modal Nova Tarefa
    showNovaTarefaModal() {
        let modal = document.getElementById('modal-tarefa');
        if (!modal) {
            modal = createModal('modal-tarefa', 'Nova Tarefa Extra', `
                <form id="form-tarefa" onsubmit="submitTarefa(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Tipo *</label>
                            <select id="tarefa-tipo" class="form-select" required>
                                <option value="PLANEJAMENTO">Planejamento de Aula</option>
                                <option value="ORGANIZACAO">Organização de Conteúdo</option>
                                <option value="PRODUCAO_MATERIAL">Produção de Material</option>
                                <option value="EDICAO_VIDEO">Edição de Vídeo</option>
                                <option value="PROJETO">Projeto Especial</option>
                                <option value="REUNIAO">Reunião Pedagógica</option>
                                <option value="OUTRO">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data *</label>
                            <input type="date" id="tarefa-data" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Título *</label>
                        <input type="text" id="tarefa-titulo" class="form-input" required placeholder="Ex: Preparar material Unity">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Horário Início *</label>
                            <input type="time" id="tarefa-hora-inicio" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Horário Fim *</label>
                            <input type="time" id="tarefa-hora-fim" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="tarefa-descricao" class="form-input" rows="2" placeholder="Detalhes da tarefa"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-tarefa')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Criar Tarefa</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        document.getElementById('tarefa-data').value = new Date().toISOString().split('T')[0];
        modal.classList.add('active');
    },

    async submitTarefa(e) {
        e.preventDefault();

        const data = {
            tipo: document.getElementById('tarefa-tipo').value,
            titulo: document.getElementById('tarefa-titulo').value,
            data: document.getElementById('tarefa-data').value,
            horaInicio: document.getElementById('tarefa-hora-inicio').value,
            horaFim: document.getElementById('tarefa-hora-fim').value,
            descricao: document.getElementById('tarefa-descricao').value
        };

        try {
            await API.tarefas.criar(data);
            showNotification('Tarefa criada com sucesso!', 'success');
            closeModal('modal-tarefa');
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    // Detalhes e Edição
    async showItemDetails(itemId) {
        try {
            const response = await API.request(`/cronograma/${itemId}`);
            if (!response) {
                showNotification('Item não encontrado', 'error');
                return;
            }

            const item = response;
            const isTarefa = item.tarefaExtraId || item.tarefaExtra;
            const turma = item.turma || {};
            const tarefaExtra = item.tarefaExtra || {};

            const titulo = isTarefa ? (tarefaExtra.titulo || item.descricao || 'Tarefa') : (turma.nome || item.descricao || 'Aula');
            const tipo = isTarefa ? (tarefaExtra.tipo || 'TAREFA') : 'AULA';
            const professor = item.professor?.nome || 'Não definido';
            const descricao = isTarefa ? (tarefaExtra.descricao || 'Sem descrição') : (turma.curso?.nome || 'Curso');
            const duracaoMinutos = item.duracaoMinutos || 0;
            const valorCalculado = item.valorCalculado || 0;

            const canEdit = API.isAdmin() || item.professorId === API.getCurrentUser()?.id;

            const content = `
                <div class="task-details">
                    <div class="detail-row">
                        <label>Tipo:</label>
                        <span class="badge ${isTarefa ? 'badge-tarefa' : 'badge-aula'}">${tipo}</span>
                    </div>
                    <div class="detail-row">
                        <label>Título:</label>
                        <span>${titulo}</span>
                    </div>
                    <div class="detail-row">
                        <label>Professor:</label>
                        <span>${professor}</span>
                    </div>
                    <div class="detail-row">
                        <label>Data:</label>
                        <span>${new Date(item.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="detail-row">
                        <label>Horário:</label>
                        <span>${item.horaInicio || '--:--'} às ${item.horaFim || '--:--'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Duração:</label>
                        <span>${(duracaoMinutos / 60).toFixed(1)}h (${duracaoMinutos} min)</span>
                    </div>
                    <div class="detail-row">
                        <label>Valor:</label>
                        <span class="valor">R$ ${valorCalculado.toFixed(2)}</span>
                    </div>
                    ${isTarefa ? `
                        <div class="detail-row">
                            <label>Descrição:</label>
                            <p>${descricao}</p>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <label>Status:</label>
                        <span class="badge ${item.realizada ? 'badge-success' : 'badge-pending'}">${item.realizada ? 'Realizada' : 'Pendente'}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    ${canEdit && isTarefa ? `<button class="btn btn-primary" onclick="showEditCronogramaItemModal('${item.id}')"><i class="bi bi-pencil"></i> Editar</button>` : ''}
                    ${canEdit ? `<button class="btn btn-danger" onclick="deleteCronogramaItem('${item.id}')"><i class="bi bi-trash"></i> Excluir</button>` : ''}
                    <button class="btn btn-secondary" onclick="closeModal('modal-item-details')">Fechar</button>
                </div>
            `;

            const existingModal = document.getElementById('modal-item-details');
            if (existingModal) existingModal.remove();

            const modal = createModal('modal-item-details', 'Detalhes do Item', content);
            document.body.appendChild(modal);
            modal.classList.add('active');

        } catch (error) {
            console.error('Erro ao buscar detalhes:', error);
            showNotification('Erro ao carregar detalhes: ' + error.message, 'error');
        }
    },

    async showEditItemModal(itemId) {
        try {
            const response = await API.request(`/cronograma/${itemId}`);
            if (!response) {
                showNotification('Item não encontrado', 'error');
                return;
            }

            currentCronogramaItemId = itemId;
            const item = response;
            const tarefaExtra = item.tarefaExtra || {};

            const dataFormatada = new Date(item.data).toISOString().split('T')[0];

            const content = `
                <form onsubmit="submitEditCronogramaItem(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-item-tipo">Tipo *</label>
                            <select id="edit-item-tipo" required>
                                <option value="PLANEJAMENTO" ${tarefaExtra.tipo === 'PLANEJAMENTO' ? 'selected' : ''}>Planejamento de Aula</option>
                                <option value="PRODUCAO_MATERIAL" ${tarefaExtra.tipo === 'PRODUCAO_MATERIAL' ? 'selected' : ''}>Produção de Material</option>
                                <option value="EDICAO_VIDEO" ${tarefaExtra.tipo === 'EDICAO_VIDEO' ? 'selected' : ''}>Edição de Vídeo</option>
                                <option value="REUNIAO" ${tarefaExtra.tipo === 'REUNIAO' ? 'selected' : ''}>Reunião</option>
                                <option value="OUTRO" ${tarefaExtra.tipo === 'OUTRO' ? 'selected' : ''}>Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-item-data">Data *</label>
                            <input type="date" id="edit-item-data" value="${dataFormatada}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-item-titulo">Título *</label>
                        <input type="text" id="edit-item-titulo" value="${tarefaExtra.titulo || item.descricao || ''}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-item-horaInicio">Horário Início *</label>
                            <input type="time" id="edit-item-horaInicio" value="${item.horaInicio || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-item-horaFim">Horário Fim *</label>
                            <input type="time" id="edit-item-horaFim" value="${item.horaFim || ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-item-descricao">Descrição</label>
                        <textarea id="edit-item-descricao" rows="3">${tarefaExtra.descricao || ''}</textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-item')">Cancelar</button>
                        <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Salvar Alterações</button>
                    </div>
                </form>
            `;

            closeModal('modal-item-details');

            const existingModal = document.getElementById('modal-edit-item');
            if (existingModal) existingModal.remove();

            const modal = createModal('modal-edit-item', 'Editar Tarefa', content);
            document.body.appendChild(modal);
            modal.classList.add('active');

        } catch (error) {
            console.error('Erro ao carregar tarefa para edição:', error);
            showNotification('Erro ao carregar tarefa: ' + error.message, 'error');
        }
    },

    async submitEditItem(e) {
        e.preventDefault();

        if (!currentCronogramaItemId) {
            showNotification('Erro: ID do item não encontrado', 'error');
            return;
        }

        try {
            const data = {
                tipo: document.getElementById('edit-item-tipo').value,
                data: document.getElementById('edit-item-data').value,
                titulo: document.getElementById('edit-item-titulo').value,
                horaInicio: document.getElementById('edit-item-horaInicio').value,
                horaFim: document.getElementById('edit-item-horaFim').value,
                descricao: document.getElementById('edit-item-descricao').value
            };

            await API.request(`/cronograma/${currentCronogramaItemId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });

            showNotification('Tarefa atualizada com sucesso!', 'success');
            closeModal('modal-edit-item');
            currentCronogramaItemId = null;
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro ao atualizar: ' + error.message, 'error');
        }
    },

    async deleteItem(itemId) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        try {
            await API.request(`/cronograma/${itemId}`, { method: 'DELETE' });
            showNotification('Tarefa excluída com sucesso!', 'success');
            closeModal('modal-item-details');
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro ao excluir: ' + error.message, 'error');
        }
    },

    // Registrar conteúdo para item temporal (cria a aula primeiro)
    async registrarConteudoTemporal(turmaId, dataIso) {
        try {
            const response = await API.cronograma.marcarAula(turmaId, dataIso);
            if (response && (response.cronogramaItem || response.id)) {
                const itemId = response.cronogramaItem ? response.cronogramaItem.id : response.id;
                // Pequeno delay para garantir atualização da interface
                setTimeout(() => {
                    Cronograma.showConteudoModal(itemId);
                }, 200);
            } else {
                showNotification('Erro ao inicializar aula.', 'error');
            }
        } catch (error) {
            console.error('Erro ao registrar temporal:', error);
            showNotification('Erro ao iniciar registro: ' + error.message, 'error');
        }
    },

    // Modal para professor registrar conteúdo ministrado
    async showConteudoModal(itemId) {
        try {
            const response = await API.request(`/cronograma/${itemId}`);
            if (!response) {
                showNotification('Item não encontrado', 'error');
                return;
            }

            const item = response;
            const turma = item.turma || {};
            const cursoId = turma.cursoId || turma.curso?.id;

            // Identificar usuário atual para ordenação
            const token = API.getToken();
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const currentUserId = payload ? (payload.userId || payload.id) : null;

            // Buscar módulos e aulas do curso
            let modulosHtml = '<option value="">-- Selecione (opcional) --</option>';
            if (cursoId) {
                try {
                    let modulos = await API.cronograma.buscarModulosAulas(cursoId);

                    // Ordenação inteligente: Meus Módulos > Templates > Outros
                    modulos.sort((a, b) => {
                        const aMine = a.professorId === currentUserId;
                        const bMine = b.professorId === currentUserId;
                        const aTemplate = !a.professorId;
                        const bTemplate = !b.professorId;

                        if (aMine && !bMine) return -1;
                        if (!aMine && bMine) return 1;
                        if (aTemplate && !bTemplate) return -1;
                        if (!aTemplate && bTemplate) return 1;
                        return 0; // Mantém ordem original (ordem do módulo)
                    });

                    modulos.forEach(modulo => {
                        const selected = item.moduloId === modulo.id ? 'selected' : '';

                        // Criar label informativo
                        let label = modulo.nome;
                        let style = '';

                        if (modulo.professorId === currentUserId) {
                            label = `👤 ${modulo.nome} (Seu)`;
                            style = 'font-weight: bold; color: #000;';
                        } else if (!modulo.professorId) {
                            label = `📋 ${modulo.nome} (Geral)`;
                        } else {
                            label = `👤 ${modulo.nome} (${modulo.professor?.nome || 'Outro'})`;
                            style = 'color: #666;';
                        }

                        // Nota: style em option tem suporte limitado, mas ajuda onde funciona
                        modulosHtml += `<option value="${modulo.id}" ${selected} style="${style}">${label}</option>`;
                    });

                    // Guardar os módulos para popular as aulas dinamicamente
                    window.modulosData = modulos;
                } catch (e) {
                    console.error('Erro ao buscar módulos:', e);
                }
            }

            // Aulas do módulo selecionado (se houver)
            let aulasHtml = '<option value="">-- Selecione o módulo primeiro --</option>';
            if (item.moduloId && window.modulosData) {
                const moduloSelecionado = window.modulosData.find(m => m.id === item.moduloId);
                if (moduloSelecionado) {
                    aulasHtml = '<option value="">-- Selecione (opcional) --</option>';
                    moduloSelecionado.aulas.forEach(aula => {
                        const selected = item.aulaId === aula.id ? 'selected' : '';
                        aulasHtml += `<option value="${aula.id}" ${selected}>Aula ${aula.numero}: ${aula.titulo}</option>`;
                    });
                }
            }

            const content = `
                <form id="form-conteudo" onsubmit="submitConteudoMinistrado(event, '${itemId}')">
                    <div class="detail-card">
                        <div class="detail-header">
                            <i class="bi bi-book"></i> ${turma.nome || 'Aula'}
                        </div>
                        <p style="color: var(--text-secondary); margin: 0;">${new Date(item.data).toLocaleDateString('pt-BR')} • ${item.horaInicio} - ${item.horaFim}</p>
                    </div>
                    
                    <div class="form-group" style="margin-top: 16px;">
                        <label class="form-label">Conteúdo Ministrado *</label>
                        <textarea id="conteudo-ministrado" class="form-input" rows="4" required placeholder="Descreva o que foi passado nesta aula...">${item.conteudoMinistrado || ''}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Módulo (opcional)</label>
                            <select id="conteudo-modulo" class="form-select" onchange="onModuloChange(this.value)">
                                ${modulosHtml}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Aula (opcional)</label>
                            <select id="conteudo-aula" class="form-select">
                                ${aulasHtml}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-conteudo')">Cancelar</button>
                        <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Salvar Conteúdo</button>
                    </div>
                </form>
            `;

            const existingModal = document.getElementById('modal-conteudo');
            if (existingModal) existingModal.remove();

            const modal = createModal('modal-conteudo', 'Registrar Conteúdo Ministrado', content);
            document.body.appendChild(modal);
            modal.classList.add('active');

        } catch (error) {
            console.error('Erro ao abrir modal de conteúdo:', error);
            showNotification('Erro ao carregar dados: ' + error.message, 'error');
        }
    },

    async submitConteudo(event, itemId) {
        event.preventDefault();

        const dados = {
            conteudoMinistrado: document.getElementById('conteudo-ministrado').value,
            moduloId: document.getElementById('conteudo-modulo').value || null,
            aulaId: document.getElementById('conteudo-aula').value || null
        };

        try {
            await API.cronograma.registrarConteudo(itemId, dados);
            showNotification('Conteúdo registrado com sucesso! Aguardando validação do Admin.', 'success');
            closeModal('modal-conteudo');
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro ao salvar: ' + error.message, 'error');
        }
    },

    // Ação do Admin para marcar aula temporal (cria e já marca como realizada)
    async marcarAula(turmaId, dataIso) {
        try {
            await API.cronograma.marcarAula(turmaId, dataIso);
            showNotification('Aula marcada como realizada!', 'success');
            await Cronograma.render();
        } catch (error) {
            showNotification('Erro ao marcar aula: ' + error.message, 'error');
        }
    }
};

// Função auxiliar para atualizar dropdown de aulas quando módulo muda
window.onModuloChange = function (moduloId) {
    const aulaSelect = document.getElementById('conteudo-aula');
    if (!moduloId || !window.modulosData) {
        aulaSelect.innerHTML = '<option value="">-- Selecione o módulo primeiro --</option>';
        return;
    }

    const modulo = window.modulosData.find(m => m.id === moduloId);
    if (!modulo) {
        aulaSelect.innerHTML = '<option value="">-- Nenhuma aula encontrada --</option>';
        return;
    }

    let html = '<option value="">-- Selecione (opcional) --</option>';
    modulo.aulas.forEach(aula => {
        html += `<option value="${aula.id}">Aula ${aula.numero}: ${aula.titulo}</option>`;
    });
    aulaSelect.innerHTML = html;
};

// Expor globalmente para compatibilidade
window.Cronograma = Cronograma;
window.renderCronograma = Cronograma.render.bind(Cronograma);
window.mudarSemana = Cronograma.mudarSemana.bind(Cronograma);
window.importarCronograma = Cronograma.importar.bind(Cronograma);
window.toggleCronogramaCheck = Cronograma.toggleCheck.bind(Cronograma);
window.filtrarCronograma = Cronograma.filtrar.bind(Cronograma);
window.setupCronogramaProfessorListener = Cronograma.setupProfessorListener.bind(Cronograma);
window.showNovaTarefaModal = Cronograma.showNovaTarefaModal.bind(Cronograma);
window.submitTarefa = Cronograma.submitTarefa.bind(Cronograma);
window.showCronogramaItemDetails = Cronograma.showItemDetails.bind(Cronograma);
window.showEditCronogramaItemModal = Cronograma.showEditItemModal.bind(Cronograma);
window.submitEditCronogramaItem = Cronograma.submitEditItem.bind(Cronograma);
window.deleteCronogramaItem = Cronograma.deleteItem.bind(Cronograma);
window.showConteudoModal = Cronograma.showConteudoModal.bind(Cronograma);
window.submitConteudoMinistrado = Cronograma.submitConteudo.bind(Cronograma);
// Adicionando as funções que faltavam
window.registrarConteudoTemporal = Cronograma.registrarConteudoTemporal.bind(Cronograma);
window.marcarAula = Cronograma.marcarAula.bind(Cronograma);
