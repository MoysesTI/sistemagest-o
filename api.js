// ==========================================
// API CLIENT - COMUNICAÇÃO COM BACKEND
// PrismaTech Code Academy
// ==========================================

const API_URL = 'http://localhost:5001/api';

// ==========================================
// GERENCIAMENTO DE TOKEN
// ==========================================

function getToken() {
    return localStorage.getItem('prismatech_token');
}

function setToken(token) {
    localStorage.setItem('prismatech_token', token);
}

function removeToken() {
    localStorage.removeItem('prismatech_token');
    localStorage.removeItem('prismatech_user');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('prismatech_user');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('prismatech_user', JSON.stringify(user));
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

function isLoggedIn() {
    return !!getToken();
}

// ==========================================
// REQUISIÇÕES HTTP
// ==========================================

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (response.status === 401) {
            // Token expirado ou inválido
            removeToken();
            window.location.href = 'login.html';
            throw new Error('Sessão expirada');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// ==========================================
// AUTENTICAÇÃO
// ==========================================

const authAPI = {
    async login(email, senha) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        setToken(response.token);
        setCurrentUser(response.user);

        return response;
    },

    async register(dados) {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(dados)
        });

        setToken(response.token);
        setCurrentUser(response.user);

        return response;
    },

    async me() {
        return apiRequest('/auth/me');
    },

    logout() {
        removeToken();
        window.location.href = 'login.html';
    }
};

// ==========================================
// CURSOS
// ==========================================

const cursosAPI = {
    async listar() {
        return apiRequest('/cursos');
    },

    async criar(dados) {
        return apiRequest('/cursos', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    },

    async atualizar(id, dados) {
        return apiRequest(`/cursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
    }
};

// ==========================================
// TURMAS
// ==========================================

const turmasAPI = {
    async listar() {
        return apiRequest('/turmas');
    },

    async criar(dados) {
        return apiRequest('/turmas', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    },

    async atualizar(id, dados) {
        return apiRequest(`/turmas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
    },

    async excluir(id) {
        return apiRequest(`/turmas/${id}`, {
            method: 'DELETE'
        });
    },

    async avancarAula(id) {
        return apiRequest(`/turmas/${id}/avancar`, {
            method: 'POST'
        });
    }
};

// ==========================================
// USUÁRIOS/PROFESSORES
// ==========================================

const usersAPI = {
    async listar() {
        return apiRequest('/users');
    },

    async buscar(id) {
        return apiRequest(`/users/${id}`);
    }
};

// ==========================================
// CRONOGRAMA
// ==========================================

const cronogramaAPI = {
    async listar(dataInicio, dataFim) {
        let url = '/cronograma';
        if (dataInicio && dataFim) {
            url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
        }
        return apiRequest(url);
    },

    async criar(dados) {
        return apiRequest('/cronograma', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    }
};

// ==========================================
// TAREFAS
// ==========================================

const tarefasAPI = {
    async listar() {
        return apiRequest('/tarefas');
    },

    async criar(dados) {
        return apiRequest('/tarefas', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    },

    async concluir(id) {
        return apiRequest(`/tarefas/${id}/concluir`, {
            method: 'PUT'
        });
    }
};

// ==========================================
// HORAS E PAGAMENTOS
// ==========================================

const horasAPI = {
    async listar(mes, ano, professorId) {
        let url = '/horas';
        const params = new URLSearchParams();
        if (mes) params.append('mes', mes);
        if (ano) params.append('ano', ano);
        if (professorId) params.append('professorId', professorId);
        if (params.toString()) url += `?${params}`;
        return apiRequest(url);
    }
};

// ==========================================
// DASHBOARD
// ==========================================

const dashboardAPI = {
    async stats() {
        return apiRequest('/dashboard/stats');
    },

    async aulasHoje() {
        return apiRequest('/dashboard/aulas-hoje');
    }
};

// ==========================================
// PARÂMETROS
// ==========================================

const parametrosAPI = {
    async listar() {
        return apiRequest('/parametros');
    },

    async atualizar(chave, valor, descricao) {
        return apiRequest(`/parametros/${chave}`, {
            method: 'PUT',
            body: JSON.stringify({ valor, descricao })
        });
    }
};

// ==========================================
// VERIFICAR AUTH NA INICIALIZAÇÃO
// ==========================================

async function checkAuth() {
    if (!isLoggedIn()) {
        return false;
    }

    try {
        const response = await authAPI.me();
        setCurrentUser(response.user);
        return true;
    } catch (error) {
        removeToken();
        return false;
    }
}

// Exportar para uso global
window.API = {
    auth: authAPI,
    cursos: cursosAPI,
    turmas: turmasAPI,
    users: usersAPI,
    cronograma: cronogramaAPI,
    tarefas: tarefasAPI,
    horas: horasAPI,
    dashboard: dashboardAPI,
    parametros: parametrosAPI,
    checkAuth,
    isLoggedIn,
    isAdmin,
    getCurrentUser,
    logout: authAPI.logout
};
