

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================

let cursosCache = [];
let turmasCache = [];
let professoresCache = [];
let currentUser = null;
let cronogramaSemanaOffset = 0;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    const isAuth = await API.checkAuth();
    if (!isAuth) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = API.getCurrentUser();
    updateUserUI();
    configureProfileAccess();
    await loadInitialData();
    setupEventListeners();

    // Garantir que apenas dashboard esteja visível ao carregar
    showSection('dashboard');
});

function updateUserUI() {
    document.getElementById('user-name').textContent = currentUser.nome;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-avatar').textContent = currentUser.nome.charAt(0).toUpperCase();
}

function configureProfileAccess() {
    const isAdmin = API.isAdmin();

    // Esconder itens do menu só para admin
    document.querySelectorAll('.nav-item-admin').forEach(el => {
        el.style.display = isAdmin ? 'flex' : 'none';
    });

    // Esconder elementos só para admin
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
    });

    // Stats só para admin
    document.querySelectorAll('.stat-card-admin').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
    });

    // Título do card de professores
    const titleProfCard = document.getElementById('title-professores-card');
    if (titleProfCard && !isAdmin) {
        titleProfCard.innerHTML = '<i class="bi bi-person"></i> Meus Dados';
    }
}

async function loadInitialData() {
    try {
        showLoading();

        cursosCache = await API.cursos.listar() || [];
        turmasCache = await API.turmas.listar() || [];

        if (API.isAdmin()) {
            professoresCache = await API.users.listar() || [];
            // Popular filtro de professor no cronograma e setup listener
            populateCronogramaProfessorFilter();
            setupCronogramaProfessorListener();
        }

        await updateDashboard();
        hideLoading();

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showNotification('Erro ao carregar dados', 'error');
        hideLoading();
    }
}


function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const section = document.getElementById(`section-${sectionName}`);
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);

    if (section) section.style.display = 'block';
    if (navItem) navItem.classList.add('active');

    const titles = {
        'dashboard': 'Overview',
        'turmas': 'Gestão de Turmas',
        'cursos': 'Gestão de Cursos',
        'professores': 'Professores',
        'cronograma': 'Cronograma',
        'relatorios': 'Relatórios Financeiros',
        'dados': 'Configurações'
    };

    document.getElementById('page-title').textContent = titles[sectionName] || 'Overview';

    // Carregar dados específicos
    switch (sectionName) {
        case 'turmas': renderTurmas(); break;
        case 'cursos': renderCursos(); break;
        case 'professores': renderProfessores(); break;
        case 'cronograma': renderCronograma(); break;
        case 'relatorios': renderRelatorios(); break;
        case 'dados': renderConfiguracoes(); break;
    }


    // Mobile: fechar sidebar
    if (window.innerWidth <= 768) toggleSidebar();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// createModal, closeModal, showNotification movidos para js/utils.js

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Filtros de turma
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTurmas(btn.dataset.filter);
        });
    });

    // Busca de turmas
    const searchTurmas = document.getElementById('search-turmas');
    if (searchTurmas) {
        searchTurmas.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-btn.active');
            renderTurmas(activeFilter?.dataset.filter || 'all', e.target.value);
        });
    }
}

// ==========================================
// EXPOSIÇÃO GLOBAL
// ==========================================

window.showSection = showSection;
window.toggleSidebar = toggleSidebar;
window.showNovaTurmaModal = showNovaTurmaModal;
window.submitTurma = submitTurma;
window.avancarAula = avancarAula;
window.deleteTurma = deleteTurma;
window.showNovoCursoModal = showNovoCursoModal;
window.submitCurso = submitCurso;
window.showNovoModuloModal = showNovoModuloModal;
window.submitModulo = submitModulo;
window.showNovaAulaModal = showNovaAulaModal;
window.submitAula = submitAula;
window.toggleModuloAulas = toggleModuloAulas;
window.showNovaTarefaModal = showNovaTarefaModal;
window.submitTarefa = submitTarefa;
window.mudarSemana = mudarSemana;
window.importarCronograma = importarCronograma;
window.toggleCronogramaCheck = toggleCronogramaCheck;
window.closeModal = closeModal;
// showTurmaDetails, showEditTurmaModal e submitEditTurma são exportados de turmas.js
window.editCurso = (id) => console.log('Editar curso:', id);
window.deleteCurso = (id) => console.log('Deletar curso:', id);
window.editProfessor = (id) => console.log('Editar professor:', id);
// Edição de módulos e aulas
window.showEditModuloModal = showEditModuloModal;
window.submitEditModulo = submitEditModulo;
window.showEditAulaModal = showEditAulaModal;
window.submitEditAula = submitEditAula;
window.marcarAula = async (turmaId, data) => {
    try {
        // Criar item de cronograma manualmente se não existir
        await API.turmas.avancarAula(turmaId);
        await renderCronograma();
        showNotification('Aula marcada!', 'success');
    } catch (error) {
        showNotification('Erro: ' + error.message, 'error');
    }
};

// Configurações e perfil
window.renderConfiguracoes = renderConfiguracoes;
window.showEditProfileModal = showEditProfileModal;
window.submitEditProfile = submitEditProfile;
window.showChangePasswordModal = showChangePasswordModal;
window.submitChangePassword = submitChangePassword;

// Relatórios e validação
window.renderRelatorios = renderRelatorios;
window.gerarRelatorio = gerarRelatorio;
window.validarCronogramaItem = validarCronogramaItem;
window.exportarRelatorio = exportarRelatorio;
window.populateCronogramaProfessorFilter = populateCronogramaProfessorFilter;

// Cronograma
window.filtrarCronograma = filtrarCronograma;
window.setupCronogramaProfessorListener = setupCronogramaProfessorListener;

// Recalculo
window.recalcularValores = recalcularValores;

// Detalhes e edição de itens do cronograma
window.showCronogramaItemDetails = showCronogramaItemDetails;
window.showEditCronogramaItemModal = showEditCronogramaItemModal;
window.submitEditCronogramaItem = submitEditCronogramaItem;
window.deleteCronogramaItem = deleteCronogramaItem;
