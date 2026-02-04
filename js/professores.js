// ==========================================
// PROFESSORES - js/professores.js
// Funções de gestão de professores
// ==========================================

(function (window) {
    'use strict';

    // Renderizar lista de professores
    async function render() {
        const container = document.getElementById('professores-container');
        if (!container) return;

        if (!API.isAdmin()) {
            // Professor vê apenas seu próprio perfil
            const user = await API.users.buscar(currentUser.id);
            container.innerHTML = createCard(user);
            return;
        }

        const profs = professoresCache.filter(u => u.role === 'PROFESSOR');

        if (profs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-people"></i>
                    <p>Nenhum professor cadastrado</p>
                </div>
            `;
            return;
        }

        container.innerHTML = profs.map(prof => createCard(prof)).join('');
    }

    // Criar card de professor
    function createCard(prof) {
        const turmasProf = turmasCache.filter(t => t.professorId === prof.id);

        return `
            <div class="professor-card">
                <div class="professor-header">
                    <div class="professor-avatar">${prof.nome.charAt(0)}</div>
                    <div class="professor-info">
                        <h3>${prof.nome}</h3>
                        <p>${prof.email}</p>
                    </div>
                    ${prof.certificadoMEI ? '<span class="mei-badge">MEI Ativo</span>' : ''}
                </div>
                
                <div class="professor-stats">
                    <div class="professor-stat">
                        <span class="stat-value">${turmasProf.length}</span>
                        <span class="stat-label">Turmas</span>
                    </div>
                    <div class="professor-stat">
                        <span class="stat-value">${turmasProf.filter(t => t.status === 'ATIVA').length}</span>
                        <span class="stat-label">Ativas</span>
                    </div>
                </div>
                
                ${API.isAdmin() ? `
                    <div class="professor-actions">
                        <button class="btn btn-sm btn-secondary" onclick="editProfessor('${prof.id}')">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Expor módulo
    const Professores = {
        render: render,
        createCard: createCard
    };

    // Alias global para compatibilidade
    window.Professores = Professores;
    window.renderProfessores = render;
    window.createProfessorCard = createCard;

})(window);
