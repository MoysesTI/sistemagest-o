// ==========================================
// CURSOS.JS - Funções de Cursos, Módulos e Aulas
// PrismaTech Code Academy
// ==========================================

let editingModuloId = null;
let editingAulaId = null;

const Cursos = {
    async render() {
        const container = document.getElementById('cursos-container');
        if (!container) return;

        if (cursosCache.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-book"></i>
                    <p>Nenhum curso cadastrado</p>
                    ${API.isAdmin() ? `
                        <button class="btn btn-accent" onclick="showNovoCursoModal()">
                            <i class="bi bi-plus-lg"></i> Criar Primeiro Curso
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        container.innerHTML = cursosCache.map(curso => Cursos.createCard(curso)).join('');
    },

    createCard(curso) {
        const totalModulos = curso.modulos?.length || 0;
        const totalAulas = curso.modulos?.reduce((acc, m) => acc + (m.aulas?.length || 0), 0) || 0;
        const isAdmin = API.isAdmin();

        return `
            <div class="curso-card" style="border-left: 4px solid ${curso.cor};">
                <div class="curso-header">
                    <div class="curso-icon" style="background: ${curso.cor}20; color: ${curso.cor};">
                        <i class="bi bi-book"></i>
                    </div>
                    <div class="curso-info">
                        <h3>${curso.nome}</h3>
                        <span class="curso-code">${curso.codigo}</span>
                    </div>
                    ${isAdmin ? `
                        <div class="curso-actions">
                            <button class="btn btn-icon" onclick="editCurso('${curso.id}')" title="Editar curso"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-icon danger" onclick="deleteCurso('${curso.id}')" title="Excluir curso"><i class="bi bi-trash"></i></button>
                        </div>
                    ` : ''}
                </div>
                
                <p class="curso-descricao">${curso.descricao || 'Sem descrição'}</p>
                
                ${curso.arquivoReferencia ? `
                    <a href="${curso.arquivoReferencia}" target="_blank" class="curso-link">
                        <i class="bi bi-file-earmark-text"></i> Arquivo de Referência
                    </a>
                ` : ''}
                
                <div class="curso-stats">
                    <span><i class="bi bi-collection"></i> ${totalModulos} módulos</span>
                    <span><i class="bi bi-play-circle"></i> ${totalAulas} aulas</span>
                    <span><i class="bi bi-people"></i> ${curso._count?.turmas || 0} turmas</span>
                </div>
                
                <div class="curso-modulos">
                    <div class="modulos-header">
                        <h4>Módulos</h4>
                        <button class="btn btn-sm btn-secondary" onclick="showNovoModuloModal('${curso.id}')">
                            <i class="bi bi-plus"></i> Módulo
                        </button>
                    </div>
                    
                    <div class="modulos-list" id="modulos-${curso.id}">
                        ${curso.modulos?.length === 0 ? '<p class="no-modulos">Nenhum módulo</p>' : ''}
                        ${(curso.modulos || []).map(modulo => Cursos.createModuloItem(modulo)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    createModuloItem(modulo) {
        const totalAulas = modulo.aulas?.length || 0;
        const canEdit = true;

        return `
            <div class="modulo-item">
                <div class="modulo-header" onclick="toggleModuloAulas('${modulo.id}')">
                    <i class="bi bi-chevron-right modulo-chevron" id="chevron-${modulo.id}"></i>
                    <span class="modulo-nome">${modulo.nome}</span>
                    <span class="modulo-aulas">${totalAulas} aulas</span>
                    ${modulo.arquivoReferencia ? `<a href="${modulo.arquivoReferencia}" target="_blank" class="modulo-link" onclick="event.stopPropagation()"><i class="bi bi-link-45deg"></i></a>` : ''}
                    ${canEdit ? `
                        <button class="btn btn-icon small" onclick="event.stopPropagation(); showNovaAulaModal('${modulo.id}')" title="Adicionar aula"><i class="bi bi-plus"></i></button>
                        <button class="btn btn-icon small" onclick="event.stopPropagation(); showEditModuloModal('${modulo.id}')" title="Editar módulo"><i class="bi bi-pencil"></i></button>
                    ` : ''}
                </div>
                <div class="modulo-aulas-list" id="aulas-${modulo.id}" style="display: none;">
                    ${(modulo.aulas || []).map(aula => `
                        <div class="aula-item">
                            <span class="aula-numero">${aula.numero}</span>
                            <span class="aula-titulo">${aula.titulo}</span>
                            ${aula.arquivoReferencia ? `<a href="${aula.arquivoReferencia}" target="_blank"><i class="bi bi-link"></i></a>` : ''}
                            ${canEdit ? `<button class="btn btn-icon small" onclick="showEditAulaModal('${aula.id}')" title="Editar aula"><i class="bi bi-pencil"></i></button>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    toggleModuloAulas(moduloId) {
        const aulasList = document.getElementById(`aulas-${moduloId}`);
        const chevron = document.getElementById(`chevron-${moduloId}`);

        if (aulasList.style.display === 'none') {
            aulasList.style.display = 'block';
            chevron.classList.add('open');
        } else {
            aulasList.style.display = 'none';
            chevron.classList.remove('open');
        }
    },

    // Modal Novo Curso
    showNovoCursoModal() {
        let modal = document.getElementById('modal-curso');
        if (!modal) {
            modal = createModal('modal-curso', 'Novo Curso', `
                <form id="form-curso" onsubmit="submitCurso(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Código *</label>
                            <input type="text" id="curso-codigo" class="form-input" required placeholder="Ex: GTA">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cor</label>
                            <input type="color" id="curso-cor" class="form-input" value="#2980b9">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Nome *</label>
                        <input type="text" id="curso-nome" class="form-input" required placeholder="Ex: Gestão Tecnológica Administrativa">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="curso-descricao" class="form-input" rows="2" placeholder="Descrição do curso"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Link do Arquivo de Referência</label>
                        <input type="url" id="curso-arquivo" class="form-input" placeholder="https://...">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-curso')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Criar Curso</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        modal.classList.add('active');
    },

    async submitCurso(e) {
        e.preventDefault();

        const data = {
            codigo: document.getElementById('curso-codigo').value,
            nome: document.getElementById('curso-nome').value,
            descricao: document.getElementById('curso-descricao').value,
            cor: document.getElementById('curso-cor').value,
            arquivoReferencia: document.getElementById('curso-arquivo').value || null
        };

        try {
            await API.cursos.criar(data);
            showNotification('Curso criado!', 'success');
            closeModal('modal-curso');
            cursosCache = await API.cursos.listar();
            Cursos.render();
            await updateDashboard();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    // Modal Novo Módulo
    showNovoModuloModal(cursoId) {
        let modal = document.getElementById('modal-modulo');
        if (!modal) {
            modal = createModal('modal-modulo', 'Novo Módulo', `
                <form id="form-modulo" onsubmit="submitModulo(event)">
                    <input type="hidden" id="modulo-curso-id">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Código *</label>
                            <input type="text" id="modulo-codigo" class="form-input" required placeholder="Ex: EXCEL">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nome *</label>
                            <input type="text" id="modulo-nome" class="form-input" required placeholder="Ex: Excel - Pacote Office">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="modulo-descricao" class="form-input" rows="2" placeholder="Descrição do módulo"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Link do Arquivo de Referência</label>
                        <input type="url" id="modulo-arquivo" class="form-input" placeholder="https://...">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-modulo')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Criar Módulo</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        document.getElementById('modulo-curso-id').value = cursoId;
        modal.classList.add('active');
    },

    async submitModulo(e) {
        e.preventDefault();

        const cursoId = document.getElementById('modulo-curso-id').value;
        const data = {
            codigo: document.getElementById('modulo-codigo').value,
            nome: document.getElementById('modulo-nome').value,
            descricao: document.getElementById('modulo-descricao').value,
            arquivoReferencia: document.getElementById('modulo-arquivo').value || null
        };

        try {
            await API.cursos.criarModulo(cursoId, data);
            showNotification('Módulo criado!', 'success');
            closeModal('modal-modulo');
            cursosCache = await API.cursos.listar();
            Cursos.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    // Modal Nova Aula
    showNovaAulaModal(moduloId) {
        let modal = document.getElementById('modal-aula');
        if (!modal) {
            modal = createModal('modal-aula', 'Nova Aula', `
                <form id="form-aula" onsubmit="submitAula(event)">
                    <input type="hidden" id="aula-modulo-id">
                    
                    <div class="form-group">
                        <label class="form-label">Título *</label>
                        <input type="text" id="aula-titulo" class="form-input" required placeholder="Ex: Introdução ao Excel">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Duração</label>
                            <input type="text" id="aula-duracao" class="form-input" value="2h30min" placeholder="2h30min">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="aula-descricao" class="form-input" rows="2" placeholder="Descrição da aula"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Link do Arquivo/Apresentação</label>
                        <input type="url" id="aula-arquivo" class="form-input" placeholder="https://...">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tópicos (um por linha)</label>
                        <textarea id="aula-topicos" class="form-input" rows="3" placeholder="Tópico 1&#10;Tópico 2&#10;Tópico 3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-aula')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Criar Aula</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        document.getElementById('aula-modulo-id').value = moduloId;
        modal.classList.add('active');
    },

    async submitAula(e) {
        e.preventDefault();

        const moduloId = document.getElementById('aula-modulo-id').value;
        const topicosText = document.getElementById('aula-topicos').value;
        const topicos = topicosText ? topicosText.split('\n').filter(t => t.trim()) : [];

        const data = {
            titulo: document.getElementById('aula-titulo').value,
            duracao: document.getElementById('aula-duracao').value,
            descricao: document.getElementById('aula-descricao').value,
            arquivoReferencia: document.getElementById('aula-arquivo').value || null,
            topicos
        };

        try {
            await API.cursos.criarAula(moduloId, data);
            showNotification('Aula criada!', 'success');
            closeModal('modal-aula');
            cursosCache = await API.cursos.listar();
            Cursos.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    // Edição de Módulos
    async showEditModuloModal(moduloId) {
        let modulo = null;
        for (const curso of cursosCache) {
            modulo = (curso.modulos || []).find(m => m.id === moduloId);
            if (modulo) break;
        }
        if (!modulo) {
            showNotification('Módulo não encontrado', 'error');
            return;
        }

        editingModuloId = moduloId;

        let modal = document.getElementById('modal-edit-modulo');
        if (!modal) {
            modal = createModal('modal-edit-modulo', 'Editar Módulo', `
                <form id="form-edit-modulo" onsubmit="submitEditModulo(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Código *</label>
                            <input type="text" id="edit-modulo-codigo" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nome *</label>
                            <input type="text" id="edit-modulo-nome" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="edit-modulo-descricao" class="form-input" rows="2"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Link de Referência</label>
                        <input type="url" id="edit-modulo-arquivo" class="form-input" placeholder="https://...">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-modulo')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Salvar</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        document.getElementById('edit-modulo-codigo').value = modulo.codigo || '';
        document.getElementById('edit-modulo-nome').value = modulo.nome || '';
        document.getElementById('edit-modulo-descricao').value = modulo.descricao || '';
        document.getElementById('edit-modulo-arquivo').value = modulo.arquivoReferencia || '';

        modal.classList.add('active');
    },

    async submitEditModulo(e) {
        e.preventDefault();

        const data = {
            codigo: document.getElementById('edit-modulo-codigo').value,
            nome: document.getElementById('edit-modulo-nome').value,
            descricao: document.getElementById('edit-modulo-descricao').value,
            arquivoReferencia: document.getElementById('edit-modulo-arquivo').value || null
        };

        try {
            await API.cursos.atualizarModulo(editingModuloId, data);
            showNotification('Módulo atualizado!', 'success');
            closeModal('modal-edit-modulo');
            cursosCache = await API.cursos.listar();
            Cursos.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    },

    // Edição de Aulas
    async showEditAulaModal(aulaId) {
        let aula = null;
        for (const curso of cursosCache) {
            for (const modulo of (curso.modulos || [])) {
                aula = (modulo.aulas || []).find(a => a.id === aulaId);
                if (aula) break;
            }
            if (aula) break;
        }
        if (!aula) {
            showNotification('Aula não encontrada', 'error');
            return;
        }

        editingAulaId = aulaId;

        let modal = document.getElementById('modal-edit-aula');
        if (!modal) {
            modal = createModal('modal-edit-aula', 'Editar Aula', `
                <form id="form-edit-aula" onsubmit="submitEditAula(event)">
                    <div class="form-group">
                        <label class="form-label">Título *</label>
                        <input type="text" id="edit-aula-titulo" class="form-input" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Duração</label>
                            <input type="text" id="edit-aula-duracao" class="form-input" placeholder="Ex: 2h30">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="edit-aula-descricao" class="form-input" rows="2"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Link de Referência</label>
                        <input type="url" id="edit-aula-arquivo" class="form-input" placeholder="https://...">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tópicos (um por linha)</label>
                        <textarea id="edit-aula-topicos" class="form-input" rows="4" placeholder="Tópico 1&#10;Tópico 2&#10;Tópico 3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-aula')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Salvar</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        document.getElementById('edit-aula-titulo').value = aula.titulo || '';
        document.getElementById('edit-aula-duracao').value = aula.duracao || '';
        document.getElementById('edit-aula-descricao').value = aula.descricao || '';
        document.getElementById('edit-aula-arquivo').value = aula.arquivoReferencia || '';
        document.getElementById('edit-aula-topicos').value = (aula.topicos || []).join('\n');

        modal.classList.add('active');
    },

    async submitEditAula(e) {
        e.preventDefault();

        const topicosText = document.getElementById('edit-aula-topicos').value;
        const topicos = topicosText ? topicosText.split('\n').filter(t => t.trim()) : [];

        const data = {
            titulo: document.getElementById('edit-aula-titulo').value,
            duracao: document.getElementById('edit-aula-duracao').value,
            descricao: document.getElementById('edit-aula-descricao').value,
            arquivoReferencia: document.getElementById('edit-aula-arquivo').value || null,
            topicos
        };

        try {
            await API.cursos.atualizarAula(editingAulaId, data);
            showNotification('Aula atualizada!', 'success');
            closeModal('modal-edit-aula');
            cursosCache = await API.cursos.listar();
            Cursos.render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }
};

// Expor globalmente para compatibilidade
window.Cursos = Cursos;
window.renderCursos = Cursos.render.bind(Cursos);
window.createCursoCard = Cursos.createCard.bind(Cursos);
window.createModuloItem = Cursos.createModuloItem.bind(Cursos);
window.toggleModuloAulas = Cursos.toggleModuloAulas.bind(Cursos);
window.showNovoCursoModal = Cursos.showNovoCursoModal.bind(Cursos);
window.submitCurso = Cursos.submitCurso.bind(Cursos);
window.showNovoModuloModal = Cursos.showNovoModuloModal.bind(Cursos);
window.submitModulo = Cursos.submitModulo.bind(Cursos);
window.showNovaAulaModal = Cursos.showNovaAulaModal.bind(Cursos);
window.submitAula = Cursos.submitAula.bind(Cursos);
window.showEditModuloModal = Cursos.showEditModuloModal.bind(Cursos);
window.submitEditModulo = Cursos.submitEditModulo.bind(Cursos);
window.showEditAulaModal = Cursos.showEditAulaModal.bind(Cursos);
window.submitEditAula = Cursos.submitEditAula.bind(Cursos);
