// ==========================================
// DASHBOARD.JS - Funções do Dashboard
// PrismaTech Code Academy
// ==========================================

const Dashboard = {
    async update() {
        try {
            const stats = await API.dashboard.stats();

            document.getElementById('stat-total-turmas').textContent = stats.totalTurmas || 0;
            document.getElementById('stat-turmas-ativas').textContent = stats.turmasAtivas || 0;
            document.getElementById('stat-professores').textContent = stats.totalProfessores || 0;
            document.getElementById('stat-cursos').textContent = stats.totalCursos || 0;

            await Dashboard.renderAulasHoje();
            await Dashboard.renderTopProfessores();
        } catch (error) {
            console.error('Erro ao atualizar dashboard:', error);
        }
    },

    async renderAulasHoje() {
        const container = document.getElementById('proximas-aulas');
        if (!container) return;

        try {
            const { aulasHoje, aulasAmanha } = await API.dashboard.aulasHoje();

            if (aulasHoje.length === 0 && aulasAmanha.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-calendar-x"></i>
                        <p>Nenhuma aula programada</p>
                    </div>
                `;
                return;
            }

            let html = '';

            if (aulasHoje.length > 0) {
                html += '<div class="section-label">HOJE</div>';
                aulasHoje.forEach(turma => {
                    html += Dashboard.createAulaItem(turma, false);
                });
            }

            if (aulasAmanha.length > 0) {
                html += '<div class="section-label" style="margin-top: 1rem;">AMANHÃ</div>';
                aulasAmanha.forEach(turma => {
                    html += Dashboard.createAulaItem(turma, true);
                });
            }

            container.innerHTML = html;
        } catch (error) {
            console.error('Erro ao carregar aulas:', error);
            container.innerHTML = '<p class="error-text">Erro ao carregar aulas</p>';
        }
    },

    createAulaItem(turma, isAmanha) {
        const cor = turma.curso?.cor || '#3498db';
        return `
            <div class="upcoming-item ${isAmanha ? 'future' : ''}" style="border-left-color: ${cor};">
                <div class="upcoming-time">${turma.horarioInicio || turma.horario}</div>
                <div class="upcoming-info">
                    <div class="upcoming-name">${turma.nome}</div>
                    <div class="upcoming-module">${turma.curso?.nome || '-'}</div>
                </div>
                <div class="upcoming-progress">${turma.qtdAlunos} alunos</div>
            </div>
        `;
    },

    async renderTopProfessores() {
        const container = document.getElementById('top-professores');
        if (!container) return;

        if (!API.isAdmin()) {
            const turmasAtivas = turmasCache.filter(t => t.status === 'ATIVA').length;
            container.innerHTML = `
                <div class="profile-summary">
                    <div class="profile-avatar">${currentUser.nome.charAt(0)}</div>
                    <div class="profile-info">
                        <h4>${currentUser.nome}</h4>
                        <p>${currentUser.email}</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="stat-number">${turmasCache.length}</span>
                        <span class="stat-text">Turmas</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-number">${turmasAtivas}</span>
                        <span class="stat-text">Ativas</span>
                    </div>
                </div>
            `;
            return;
        }

        const profs = professoresCache.filter(u => u.role === 'PROFESSOR');

        if (profs.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum professor cadastrado</p></div>';
            return;
        }

        let html = '';
        profs.slice(0, 5).forEach(prof => {
            const turmasProf = turmasCache.filter(t => t.professorId === prof.id);
            html += `
                <div class="employee-item">
                    <div class="employee-avatar">${prof.nome.charAt(0)}</div>
                    <div class="employee-info">
                        <div class="employee-name">${prof.nome}</div>
                        <div class="employee-sub">${prof.email}</div>
                    </div>
                    <div class="employee-value">${turmasProf.length} turmas</div>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};

// Expor globalmente para compatibilidade
window.Dashboard = Dashboard;
window.updateDashboard = Dashboard.update.bind(Dashboard);
window.renderAulasHoje = Dashboard.renderAulasHoje.bind(Dashboard);
window.createAulaItem = Dashboard.createAulaItem.bind(Dashboard);
window.renderTopProfessores = Dashboard.renderTopProfessores.bind(Dashboard);
