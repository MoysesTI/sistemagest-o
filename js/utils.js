// ==========================================
// UTILS.JS - Funções Utilitárias
// PrismaTech Code Academy
// ==========================================

const Utils = {
    showLoading() {
        document.querySelectorAll('.loading-text').forEach(el => {
            el.style.display = 'block';
        });
    },

    hideLoading() {
        document.querySelectorAll('.loading-text').forEach(el => {
            el.style.display = 'none';
        });
    },

    createModal(id, title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="closeModal('${id}')">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        return modal;
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.querySelector('span').textContent = message;
        notification.querySelector('i').className = type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-circle';
        notification.style.background = type === 'success' ? 'var(--success)' : 'var(--danger)';
        notification.classList.add('show');

        setTimeout(() => notification.classList.remove('show'), 3000);
    }
};

// Expor globalmente para compatibilidade
window.Utils = Utils;
window.showLoading = Utils.showLoading;
window.hideLoading = Utils.hideLoading;
window.createModal = Utils.createModal;
window.closeModal = Utils.closeModal;
window.showNotification = Utils.showNotification;
