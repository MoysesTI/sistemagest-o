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

            if (professorIdFiltro && API.isAdmin()) {
                itensAPI = await API.cronograma.porProfessor(professorIdFiltro, dataInicio, dataFim);
            } else {
                itensAPI = await API.cronograma.listar(dataInicio, dataFim);
            }
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
            const turmasDia = turmasCache.filter(t =>
                t.diasSemana.includes(diasEnum[i]) &&
                t.status !== 'CONCLUIDA' &&
                (!t.dataInicio || new Date(t.dataInicio) <= dia) &&
                (!t.dataFim || new Date(t.dataFim) >= dia)
            );

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
                    const canClickDetails = !item.isTemporal ? `onclick="showCronogramaItemDetails('${item.id}')"` : '';

                    html += `
                        <div class="cronograma-item ${checkClass} clickable" style="border-left-color: ${cor};" ${canClickDetails}>
                            <div class="cronograma-item-header">
                                <span class="cronograma-time">${item.horaInicio || ''}</span>
                                ${!item.isTemporal ? `
                                    <button class="check-btn ${checkClass}" onclick="event.stopPropagation(); toggleCronogramaCheck('${item.id}')" title="${item.realizada ? 'Desmarcar' : 'Marcar como realizado'}">
                                        <i class="bi bi-${item.realizada ? 'check-circle-fill' : 'check-circle'}"></i>
                                    </button>
                                ` : `
                                    <button class="check-btn" onclick="event.stopPropagation(); marcarAula('${item.turmaId}', '${dia.toISOString()}')" title="Marcar aula realizada">
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
            if (professorIdFiltro && API.isAdmin()) {
                itensAPI = await API.cronograma.porProfessor(professorIdFiltro, dataInicioInput, dataFimInput);
            } else {
                itensAPI = await API.cronograma.listar(dataInicioInput, dataFimInput);
            }
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

            const turmasDia = turmasCache.filter(t =>
                t.diasSemana.includes(diasEnum[diaSemana]) &&
                t.status !== 'CONCLUIDA' &&
                (!t.dataInicio || new Date(t.dataInicio) <= currentDate) &&
                (!t.dataFim || new Date(t.dataFim) >= currentDate)
            );

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
                    const canClickDetails = !item.isTemporal ? `onclick="showCronogramaItemDetails('${item.id}')"` : '';

                    html += `
                        <div class="cronograma-item clickable ${checkClass}" style="border-left-color: ${cor};" ${canClickDetails}>
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
                    ${canEdit && isTarefa ? `<button class="btn btn-danger" onclick="deleteCronogramaItem('${item.id}')"><i class="bi bi-trash"></i> Excluir</button>` : ''}
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
    }
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
