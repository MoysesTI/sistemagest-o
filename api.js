// Detecta se está em desenvolvimento (localhost com porta separada) ou produção (nginx proxy)
const API_BASE = window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:5001/api'  // Desenvolvimento local
    : '/api';                       // Produção (nginx faz proxy)

const API = {
    getToken: () => localStorage.getItem('auth_token'),
    setToken: (token) => localStorage.setItem('auth_token', token),
    removeToken: () => localStorage.removeItem('auth_token'),

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('user'),
    isAdmin: () => API.getCurrentUser()?.role === 'ADMIN',

    async request(endpoint, options = {}) {
        const token = API.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers }
        });

        if (response.status === 401) {
            API.logout();
            return null;
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro na requisição');
        return data;
    },

    async login(email, senha) {
        const data = await API.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
        if (data) {
            API.setToken(data.token);
            API.setUser(data.user);
        }
        return data;
    },

    async register(dados) {
        const data = await API.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
        if (data) {
            API.setToken(data.token);
            API.setUser(data.user);
        }
        return data;
    },

    logout() {
        API.removeToken();
        API.removeUser();
        window.location.href = 'login.html';
    },

    async checkAuth() {
        if (!API.getToken()) return false;
        try {
            const data = await API.request('/auth/me');
            if (data) API.setUser(data.user);
            return !!data;
        } catch {
            return false;
        }
    },

    users: {
        listar: () => API.request('/users'),
        buscar: (id) => API.request(`/users/${id}`),
        atualizar: (id, dados) => API.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        }),
        alterarSenha: (id, senhaAtual, senhaNova) => API.request(`/users/${id}/senha`, {
            method: 'PUT',
            body: JSON.stringify({ senhaAtual, senhaNova })
        })
    },

    cursos: {
        listar: () => API.request('/cursos'),
        criar: (dados) => API.request('/cursos', {
            method: 'POST',
            body: JSON.stringify(dados)
        }),
        atualizar: (id, dados) => API.request(`/cursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        }),
        excluir: (id) => API.request(`/cursos/${id}`, { method: 'DELETE' }),
        criarModulo: (cursoId, dados) => API.request(`/cursos/${cursoId}/modulos`, {
            method: 'POST',
            body: JSON.stringify(dados)
        }),
        atualizarModulo: (moduloId, dados) => API.request(`/modulos/${moduloId}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        }),
        excluirModulo: (moduloId) => API.request(`/modulos/${moduloId}`, { method: 'DELETE' }),
        criarAula: (moduloId, dados) => API.request(`/modulos/${moduloId}/aulas`, {
            method: 'POST',
            body: JSON.stringify(dados)
        }),
        atualizarAula: (aulaId, dados) => API.request(`/aulas/${aulaId}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        }),
        excluirAula: (aulaId) => API.request(`/aulas/${aulaId}`, { method: 'DELETE' })
    },

    turmas: {
        listar: () => API.request('/turmas'),
        criar: (dados) => API.request('/turmas', {
            method: 'POST',
            body: JSON.stringify(dados)
        }),
        atualizar: (id, dados) => API.request(`/turmas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        }),
        excluir: (id) => API.request(`/turmas/${id}`, { method: 'DELETE' }),
        avancarAula: (id) => API.request(`/turmas/${id}/avancar`, { method: 'POST' })
    },

    cronograma: {
        listar: (dataInicio, dataFim) => {
            let url = '/cronograma';
            if (dataInicio && dataFim) url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
            return API.request(url);
        },
        importar: (dataInicio, dataFim) => API.request('/cronograma/importar', {
            method: 'POST',
            body: JSON.stringify({ dataInicio, dataFim })
        }),
        marcarPresenca: (id) => API.request(`/cronograma/${id}/check`, { method: 'PUT' }),
        validar: (id, validar, bonus = 0) => API.request(`/cronograma/${id}/validar`, {
            method: 'PUT',
            body: JSON.stringify({ validar, bonus })
        }),
        porProfessor: (professorId, dataInicio, dataFim) => {
            let url = `/cronograma/professor/${professorId}`;
            if (dataInicio && dataFim) url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
            return API.request(url);
        },
        recalcular: () => API.request('/cronograma/recalcular', { method: 'POST' })
    },

    relatorios: {
        financeiro: (dataInicio, dataFim, professorId) => {
            const params = [];
            if (dataInicio) params.push(`dataInicio=${dataInicio}`);
            if (dataFim) params.push(`dataFim=${dataFim}`);
            if (professorId) params.push(`professorId=${professorId}`);
            return API.request('/relatorios/financeiro?' + params.join('&'));
        }
    },

    tarefas: {
        listar: () => API.request('/tarefas-extras'),
        criar: (dados) => API.request('/tarefas-extras', {
            method: 'POST',
            body: JSON.stringify(dados)
        }),
        concluir: (id) => API.request(`/tarefas-extras/${id}/concluir`, { method: 'PUT' })
    },

    dashboard: {
        stats: () => API.request('/dashboard/stats'),
        aulasHoje: () => API.request('/dashboard/aulas-hoje')
    },

    parametros: {
        listar: () => API.request('/parametros'),
        atualizar: (chave, valor, descricao) => API.request(`/parametros/${chave}`, {
            method: 'PUT',
            body: JSON.stringify({ valor, descricao })
        })
    }
};

window.API = API;
