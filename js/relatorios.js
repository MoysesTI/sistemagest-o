// ==========================================
// RELATÓRIOS - js/relatorios.js
// Funções de relatórios financeiros
// ==========================================

(function (window) {
    'use strict';

    // Renderizar tela de relatórios
    async function render() {
        // Popular select de professores
        const select = document.getElementById('relatorio-professor');
        if (select) {
            select.innerHTML = '<option value="">Todos os Professores</option>';
            professoresCache.filter(u => u.role === 'PROFESSOR').forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
            });
        }

        // Definir período padrão (mês atual)
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        document.getElementById('relatorio-data-inicio').value = primeiroDia.toISOString().split('T')[0];
        document.getElementById('relatorio-data-fim').value = ultimoDia.toISOString().split('T')[0];
    }

    // Gerar relatório financeiro
    async function gerar() {
        const dataInicio = document.getElementById('relatorio-data-inicio').value;
        const dataFim = document.getElementById('relatorio-data-fim').value;
        const professorId = document.getElementById('relatorio-professor').value;

        try {
            const dados = await API.relatorios.financeiro(dataInicio, dataFim, professorId);

            // Atualizar resumo
            document.getElementById('rel-total-horas').textContent = `${dados.totais.totalHoras.toFixed(1)}h`;
            document.getElementById('rel-total-valor').textContent = `R$ ${dados.totais.totalValor.toFixed(2)}`;
            document.getElementById('rel-qtd-itens').textContent = dados.totais.qtdItens;
            document.getElementById('rel-qtd-profs').textContent = dados.totais.qtdProfessores;

            // Gerar tabela por professor
            const container = document.getElementById('relatorio-detalhes');
            if (dados.porProfessor.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <p>Nenhum item validado neste período</p>
                    </div>
                `;
                return;
            }

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Professor</th>
                            <th>Aulas</th>
                            <th>Tarefas</th>
                            <th>Horas</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            dados.porProfessor.forEach(p => {
                html += `
                    <tr>
                        <td><strong>${p.professor.nome}</strong></td>
                        <td>${p.qtdAulas}</td>
                        <td>${p.qtdTarefas}</td>
                        <td>${p.totalHoras.toFixed(1)}h</td>
                        <td class="valor">R$ ${p.totalValor.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;

        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }

    // Validar item do cronograma
    async function validarItem(itemId, validar, bonus = 0) {
        try {
            await API.cronograma.validar(itemId, validar, bonus);
            showNotification(validar ? 'Item validado!' : 'Validação removida', 'success');
            await renderCronograma();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }

    // Exportar relatório
    function exportar() {
        showNotification('Exportação em desenvolvimento', 'info');
    }

    // Recalcular valores de todos os itens realizados
    async function recalcular() {
        try {
            showNotification('Recalculando valores...', 'info');
            const result = await API.cronograma.recalcular();
            showNotification(result.message || 'Valores recalculados!', 'success');
            // Atualizar o relatório automaticamente
            await gerar();
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    }

    // Popular filtro de professor no cronograma (admin only)
    function populateCronogramaProfessorFilter() {
        const select = document.getElementById('cronograma-professor');
        if (!select || !API.isAdmin()) return;

        select.innerHTML = '<option value="">Meu Cronograma</option>';
        professoresCache.filter(u => u.role === 'PROFESSOR').forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
        });
    }

    // Expor módulo
    const Relatorios = {
        render: render,
        gerar: gerar,
        validarItem: validarItem,
        exportar: exportar,
        recalcular: recalcular,
        populateCronogramaProfessorFilter: populateCronogramaProfessorFilter
    };

    // Alias globais para compatibilidade
    window.Relatorios = Relatorios;
    window.renderRelatorios = render;
    window.gerarRelatorio = gerar;
    window.validarCronogramaItem = validarItem;
    window.exportarRelatorio = exportar;
    window.recalcularValores = recalcular;
    window.populateCronogramaProfessorFilter = populateCronogramaProfessorFilter;

})(window);
