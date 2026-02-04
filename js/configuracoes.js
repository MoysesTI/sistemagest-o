// ==========================================
// CONFIGURAÇÕES - js/configuracoes.js
// Funções de perfil e configurações do usuário
// ==========================================

(function (window) {
    'use strict';

    // Renderizar tela de configurações
    async function render() {
        // Atualizar informações do perfil
        const avatar = document.getElementById('profile-avatar');
        const nome = document.getElementById('profile-nome');
        const email = document.getElementById('profile-email');
        const role = document.getElementById('profile-role');
        const telefone = document.getElementById('profile-telefone');

        if (avatar) avatar.textContent = currentUser.nome.charAt(0).toUpperCase();
        if (nome) nome.textContent = currentUser.nome;
        if (email) email.textContent = currentUser.email;
        if (role) {
            role.textContent = currentUser.role === 'ADMIN' ? 'Administrador' : 'Professor';
            role.className = `role-badge ${currentUser.role === 'ADMIN' ? 'admin-badge' : 'professor-badge'}`;
        }
        if (telefone) telefone.textContent = currentUser.telefone || '-';

        // Atualizar estatísticas
        try {
            const stats = await API.dashboard.stats();
            const minhasTurmas = turmasCache.filter(t => t.professorId === currentUser.id);
            const aulasDadas = minhasTurmas.reduce((acc, t) => acc + (t.aulaAtual - 1), 0);

            document.getElementById('stat-minhas-turmas').textContent = minhasTurmas.length;
            document.getElementById('stat-aulas-dadas').textContent = aulasDadas;
            document.getElementById('stat-horas-mes').textContent = `${(aulasDadas * 2).toFixed(0)}h`;
            document.getElementById('stat-tarefas-pendentes').textContent = '0';
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    // Modal editar perfil
    function showEditProfileModal() {
        let modal = document.getElementById('modal-edit-profile');
        if (!modal) {
            modal = createModal('modal-edit-profile', 'Editar Perfil', `
                <form id="form-edit-profile" onsubmit="submitEditProfile(event)">
                    <div class="form-group">
                        <label class="form-label">Nome *</label>
                        <input type="text" id="edit-profile-nome" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="tel" id="edit-profile-telefone" class="form-input" placeholder="(00) 00000-0000">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-profile')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-check-lg"></i> Salvar</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        document.getElementById('edit-profile-nome').value = currentUser.nome || '';
        document.getElementById('edit-profile-telefone').value = currentUser.telefone || '';

        modal.classList.add('active');
    }

    // Submit edição de perfil
    async function submitEditProfile(e) {
        e.preventDefault();

        const data = {
            nome: document.getElementById('edit-profile-nome').value,
            telefone: document.getElementById('edit-profile-telefone').value
        };

        try {
            const updated = await API.users.atualizar(currentUser.id, data);
            currentUser.nome = updated.nome;
            currentUser.telefone = updated.telefone;

            // Atualizar armazenamento local
            localStorage.setItem('user', JSON.stringify(currentUser));

            showNotification('Perfil atualizado!', 'success');
            closeModal('modal-edit-profile');
            updateUserUI();
            render();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }

    // Modal alterar senha
    function showChangePasswordModal() {
        let modal = document.getElementById('modal-change-password');
        if (!modal) {
            modal = createModal('modal-change-password', 'Alterar Senha', `
                <form id="form-change-password" onsubmit="submitChangePassword(event)">
                    <div class="form-group">
                        <label class="form-label">Senha Atual *</label>
                        <input type="password" id="change-senha-atual" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Nova Senha *</label>
                        <input type="password" id="change-senha-nova" class="form-input" required minlength="6">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Confirmar Nova Senha *</label>
                        <input type="password" id="change-senha-confirma" class="form-input" required minlength="6">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-change-password')">Cancelar</button>
                        <button type="submit" class="btn btn-accent"><i class="bi bi-key"></i> Alterar Senha</button>
                    </div>
                </form>
            `);
            document.body.appendChild(modal);
        }

        // Limpar campos
        document.getElementById('change-senha-atual').value = '';
        document.getElementById('change-senha-nova').value = '';
        document.getElementById('change-senha-confirma').value = '';

        modal.classList.add('active');
    }

    // Submit alteração de senha
    async function submitChangePassword(e) {
        e.preventDefault();

        const senhaAtual = document.getElementById('change-senha-atual').value;
        const senhaNova = document.getElementById('change-senha-nova').value;
        const senhaConfirma = document.getElementById('change-senha-confirma').value;

        if (senhaNova !== senhaConfirma) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }

        try {
            await API.users.alterarSenha(currentUser.id, senhaAtual, senhaNova);
            showNotification('Senha alterada com sucesso!', 'success');
            closeModal('modal-change-password');
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }

    // Expor módulo
    const Configuracoes = {
        render: render,
        showEditProfileModal: showEditProfileModal,
        submitEditProfile: submitEditProfile,
        showChangePasswordModal: showChangePasswordModal,
        submitChangePassword: submitChangePassword
    };

    // Alias globais para compatibilidade
    window.Configuracoes = Configuracoes;
    window.renderConfiguracoes = render;
    window.showEditProfileModal = showEditProfileModal;
    window.submitEditProfile = submitEditProfile;
    window.showChangePasswordModal = showChangePasswordModal;
    window.submitChangePassword = submitChangePassword;

})(window);
