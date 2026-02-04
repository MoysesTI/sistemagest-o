// ==========================================
// TURMAS.JS - Funções de Turmas
// PrismaTech Code Academy
// ==========================================

const Turmas = {
    render(filter = 'all', search = '') {
        const container = document.getElementById('turma-container');
        if (!container) return;

        let turmas = [...turmasCache];

        if (filter !== 'all') {
            turmas = turmas.filter(t => t.diasSemana.includes(filter));
        }

        if (search) {
            const searchLower = search.toLowerCase();
            turmas = turmas.filter(t =>
                t.nome.toLowerCase().includes(searchLower) ||
                t.codigo.toLowerCase().includes(searchLower) ||
                t.curso?.nome?.toLowerCase().includes(searchLower)
            );
        }

        if (turmas.length === 0) {
            container.innerHTML = `
                <div class="empty-state full-width">
                    <i class="bi bi-inbox"></i>
                    <p>Nenhuma turma encontrada</p>
                    <button class="btn btn-accent" onclick="showNovaTurmaModal()">
                        <i class="bi bi-plus-lg"></i> Criar Primeira Turma
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = turmas.map(turma => Turmas.createCard(turma)).join('');
    },

    createCard(turma) {
        const curso = turma.curso || {};
        const statusClasses = {
            'PENDENTE': 'pending',
            'ATIVA': 'active',
            'CONCLUIDA': 'completed',
            'CANCELADA': 'cancelled'
        };

        const statusText = {
            'PENDENTE': 'Pendente',
            'ATIVA': 'Em Andamento',
            'CONCLUIDA': 'Concluída',
            'CANCELADA': 'Cancelada'
        };
        const dataInicio = turma.dataInicio ? new Date(turma.dataInicio).toLocaleDateString('pt-BR') : '-';
        const dataFim = turma.dataFim ? new Date(turma.dataFim).toLocaleDateString('pt-BR') : '-';
        const professor = turma.professor || {};

        return `
            <div class="turma-card">
                <div class="turma-card-header">
                    <div class="turma-card-top">
                        <span class="turma-code">${turma.codigo}</span>
                        <button class="turma-action-btn" onclick="deleteTurma('${turma.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <h3 class="turma-name">${turma.nome}</h3>
                    <div class="turma-info-row">
                        <span><i class="bi bi-person"></i> ${professor.nome || 'Sem professor'}</span>
                        <span><i class="bi bi-people"></i> ${turma.qtdAlunos} alunos</span>
                    </div>
                </div>
                
                <div class="turma-card-body">
                    <div class="module-badge" style="background: ${curso.cor}15; color: ${curso.cor}; border: 1px solid ${curso.cor}30">
                        <i class="bi bi-book"></i> ${curso.nome || 'Sem curso'}
                    </div>
                    
                    <div class="turma-info-row" style="margin: 0.5rem 0;">
                        <span><i class="bi bi-geo-alt"></i> ${turma.local}</span>
                    </div>
                    
                    <div class="turma-info-row" style="margin: 0.5rem 0; font-size: 0.8rem; color: var(--text-secondary);">
                        <span><i class="bi bi-calendar-event"></i> ${dataInicio} até ${dataFim}</span>
                    </div>
                    
                    <div class="days-badges">
                        ${turma.diasSemana.map(d => `<span class="day-badge">${Turmas.formatDia(d)}</span>`).join('')}
                    </div>
                    
                    <div class="turma-schedule">
                        <i class="bi bi-clock"></i>
                        <span>${turma.horarioInicio} - ${turma.horarioFim}</span>
                    </div>
                    
                    <div class="status-badge ${statusClasses[turma.status]}">
                        ${statusText[turma.status]}
                    </div>
                </div>
                
                <div class="turma-card-footer">
                    <button class="btn btn-sm btn-secondary" onclick="showTurmaDetails('${turma.id}')">
                        <i class="bi bi-eye"></i> Detalhes
                    </button>
                    ${turma.status !== 'CONCLUIDA' ? `
                        <button class="btn btn-sm btn-accent" onclick="avancarAula('${turma.id}')">
                            <i class="bi bi-check-lg"></i> Marcar Aula
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    formatDia(dia) {
        const map = {
            'SEGUNDA': 'Seg', 'TERCA': 'Ter', 'QUARTA': 'Qua',
            'QUINTA': 'Qui', 'SEXTA': 'Sex', 'SABADO': 'Sáb', 'DOMINGO': 'Dom'
        };
        return map[dia] || dia;
    },

    async avancar(turmaId) {
        try {
            await API.turmas.avancarAula(turmaId);
            showNotification('Aula registrada com sucesso!', 'success');
            turmasCache = await API.turmas.listar();
            Turmas.render();
            await updateDashboard();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    async delete(turmaId) {
        if (!confirm('Tem certeza que deseja excluir esta turma?')) return;

        try {
            await API.turmas.excluir(turmaId);
            showNotification('Turma excluída!', 'success');
            turmasCache = await API.turmas.listar();
            Turmas.render();
            await updateDashboard();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    showModal() {
        let modal = document.getElementById('modal-turma');
        if (!modal) {
            modal = createModal('modal-turma', 'Nova Turma', Turmas.getFormHTML());
            document.body.appendChild(modal);
        }

        const cursoSelect = document.getElementById('turma-curso');
        cursoSelect.innerHTML = '<option value="">Selecione um curso</option>' +
            cursosCache.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');

        const profRow = document.getElementById('row-professor');
        const profSelect = document.getElementById('turma-professor');

        if (API.isAdmin() && profRow && profSelect) {
            profRow.style.display = 'flex';
            const profs = professoresCache.filter(u => u.role === 'PROFESSOR');
            profSelect.innerHTML = '<option value="">Selecione um professor</option>' +
                profs.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
        } else if (profRow) {
            profRow.style.display = 'none';
        }

        document.getElementById('turma-codigo').value = '';
        document.getElementById('turma-nome').value = '';
        document.getElementById('turma-local').value = '';
        document.getElementById('turma-hora-inicio').value = '';
        document.getElementById('turma-hora-fim').value = '';
        document.getElementById('turma-data-inicio').value = '';
        document.getElementById('turma-data-fim').value = '';
        document.getElementById('turma-alunos').value = '10';
        document.querySelectorAll('input[name="turma-dias"]').forEach(cb => cb.checked = false);

        modal.classList.add('active');
    },

    getFormHTML() {
        return `
            <form id="form-turma" onsubmit="submitTurma(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" id="turma-codigo" class="form-input" required placeholder="Ex: TRM-001">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nome *</label>
                        <input type="text" id="turma-nome" class="form-input" required placeholder="Ex: GTA Seg e Qua - 9h">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Curso *</label>
                        <select id="turma-curso" class="form-select" required></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Local *</label>
                        <input type="text" id="turma-local" class="form-input" required placeholder="Sala/Unidade">
                    </div>
                </div>
                
                <div class="form-row admin-only" id="row-professor">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Professor *</label>
                        <select id="turma-professor" class="form-select"></select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Data Início *</label>
                        <input type="date" id="turma-data-inicio" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Data Fim *</label>
                        <input type="date" id="turma-data-fim" class="form-input" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Horário Início *</label>
                        <input type="time" id="turma-hora-inicio" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Horário Fim *</label>
                        <input type="time" id="turma-hora-fim" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Qtd. Alunos</label>
                        <input type="number" id="turma-alunos" class="form-input" value="10" min="1">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Dias da Semana *</label>
                    <div class="checkbox-group">
                        <label class="checkbox-item"><input type="checkbox" name="turma-dias" value="SEGUNDA"> Segunda</label>
                        <label class="checkbox-item"><input type="checkbox" name="turma-dias" value="TERCA"> Terça</label>
                        <label class="checkbox-item"><input type="checkbox" name="turma-dias" value="QUARTA"> Quarta</label>
                        <label class="checkbox-item"><input type="checkbox" name="turma-dias" value="QUINTA"> Quinta</label>
                        <label class="checkbox-item"><input type="checkbox" name="turma-dias" value="SEXTA"> Sexta</label>
                        <label class="checkbox-item"><input type="checkbox" name="turma-dias" value="SABADO"> Sábado</label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('modal-turma')">Cancelar</button>
                    <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Criar Turma</button>
                </div>
            </form>
        `;
    },

    async submit(e) {
        e.preventDefault();

        const dias = Array.from(document.querySelectorAll('input[name="turma-dias"]:checked')).map(cb => cb.value);

        if (dias.length === 0) {
            showNotification('Selecione ao menos um dia', 'error');
            return;
        }

        const dataInicio = document.getElementById('turma-data-inicio').value;
        const dataFim = document.getElementById('turma-data-fim').value;

        if (!dataInicio || !dataFim) {
            showNotification('Preencha as datas de início e fim', 'error');
            return;
        }

        if (new Date(dataFim) <= new Date(dataInicio)) {
            showNotification('A data fim deve ser após a data início', 'error');
            return;
        }

        const data = {
            codigo: document.getElementById('turma-codigo').value,
            nome: document.getElementById('turma-nome').value,
            cursoId: document.getElementById('turma-curso').value,
            local: document.getElementById('turma-local').value,
            horarioInicio: document.getElementById('turma-hora-inicio').value,
            horarioFim: document.getElementById('turma-hora-fim').value,
            qtdAlunos: parseInt(document.getElementById('turma-alunos').value) || 10,
            diasSemana: dias,
            dataInicio: dataInicio,
            dataFim: dataFim
        };

        const profSelect = document.getElementById('turma-professor');
        if (API.isAdmin() && profSelect && profSelect.value) {
            data.professorId = profSelect.value;
        }

        try {
            await API.turmas.criar(data);
            showNotification('Turma criada com sucesso!', 'success');
            closeModal('modal-turma');
            turmasCache = await API.turmas.listar();
            Turmas.render();
            await updateDashboard();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }
};

// Expor globalmente para compatibilidade
window.Turmas = Turmas;
window.renderTurmas = Turmas.render.bind(Turmas);
window.createTurmaCard = Turmas.createCard.bind(Turmas);
window.formatDia = Turmas.formatDia.bind(Turmas);
window.avancarAula = Turmas.avancar.bind(Turmas);
window.deleteTurma = Turmas.delete.bind(Turmas);
window.showNovaTurmaModal = Turmas.showModal.bind(Turmas);
window.getTurmaFormHTML = Turmas.getFormHTML.bind(Turmas);
window.submitTurma = Turmas.submit.bind(Turmas);
