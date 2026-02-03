// ==========================================
// SERVER.JS - API BACKEND
// PrismaTech Code Academy
// ==========================================

require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || !user.ativo) {
            return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Requer perfil de administrador.' });
    }
    next();
};

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        if (!user.ativo) {
            return res.status(401).json({ error: 'Usuário inativo' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Cadastro
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha, telefone, cnpj, razaoSocial } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const user = await prisma.user.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                telefone,
                cnpj,
                razaoSocial,
                role: 'PROFESSOR',
                certificadoMEI: !!cnpj
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Verificar token
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            nome: req.user.nome,
            email: req.user.email,
            role: req.user.role,
            telefone: req.user.telefone,
            cnpj: req.user.cnpj,
            razaoSocial: req.user.razaoSocial,
            certificadoMEI: req.user.certificadoMEI
        }
    });
});

// ==========================================
// ROTAS DE USUÁRIOS (ADMIN)
// ==========================================

app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                telefone: true,
                cnpj: true,
                razaoSocial: true,
                certificadoMEI: true,
                ativo: true,
                createdAt: true
            },
            orderBy: { nome: 'asc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/users/:id', authMiddleware, async (req, res) => {
    try {
        // Professor só pode ver próprio perfil
        if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                telefone: true,
                cnpj: true,
                razaoSocial: true,
                certificadoMEI: true,
                ativo: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE CURSOS
// ==========================================

app.get('/api/cursos', authMiddleware, async (req, res) => {
    try {
        const cursos = await prisma.curso.findMany({
            where: { ativo: true },
            include: {
                modulos: {
                    where: { ativo: true },
                    include: {
                        aulas: {
                            where: { ativo: true },
                            orderBy: { numero: 'asc' }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                }
            },
            orderBy: { nome: 'asc' }
        });
        res.json(cursos);
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/cursos', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { codigo, nome, descricao, cor, nivel } = req.body;

        const curso = await prisma.curso.create({
            data: { codigo, nome, descricao, cor, nivel }
        });

        res.status(201).json(curso);
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { codigo, nome, descricao, cor, nivel, ativo } = req.body;

        const curso = await prisma.curso.update({
            where: { id: req.params.id },
            data: { codigo, nome, descricao, cor, nivel, ativo }
        });

        res.json(curso);
    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE MÓDULOS
// ==========================================

app.post('/api/modulos', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { cursoId, codigo, nome, descricao, ordem } = req.body;

        const modulo = await prisma.modulo.create({
            data: { cursoId, codigo, nome, descricao, ordem }
        });

        res.status(201).json(modulo);
    } catch (error) {
        console.error('Erro ao criar módulo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE AULAS
// ==========================================

app.post('/api/aulas', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { moduloId, numero, titulo, topicos, duracao } = req.body;

        const aula = await prisma.aula.create({
            data: { moduloId, numero, titulo, topicos, duracao }
        });

        res.status(201).json(aula);
    } catch (error) {
        console.error('Erro ao criar aula:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE TURMAS
// ==========================================

app.get('/api/turmas', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN'
            ? {}
            : { professorId: req.user.id };

        const turmas = await prisma.turma.findMany({
            where,
            include: {
                professor: {
                    select: { id: true, nome: true, email: true }
                },
                curso: {
                    select: { id: true, nome: true, cor: true, nivel: true }
                },
                modulo: {
                    select: { id: true, nome: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(turmas);
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/turmas', authMiddleware, async (req, res) => {
    try {
        const { codigo, nome, local, qtdAlunos, diasSemana, horario, cursoId, moduloId } = req.body;

        const turma = await prisma.turma.create({
            data: {
                codigo,
                nome,
                local,
                qtdAlunos,
                diasSemana,
                horario,
                professorId: req.user.id,
                cursoId,
                moduloId
            },
            include: {
                professor: { select: { id: true, nome: true } },
                curso: { select: { id: true, nome: true, cor: true } }
            }
        });

        res.status(201).json(turma);
    } catch (error) {
        console.error('Erro ao criar turma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/turmas/:id', authMiddleware, async (req, res) => {
    try {
        const turma = await prisma.turma.findUnique({
            where: { id: req.params.id }
        });

        if (!turma) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        // Professor só pode editar próprias turmas
        if (req.user.role !== 'ADMIN' && turma.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const updated = await prisma.turma.update({
            where: { id: req.params.id },
            data: req.body
        });

        res.json(updated);
    } catch (error) {
        console.error('Erro ao atualizar turma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/turmas/:id', authMiddleware, async (req, res) => {
    try {
        const turma = await prisma.turma.findUnique({
            where: { id: req.params.id }
        });

        if (!turma) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        if (req.user.role !== 'ADMIN' && turma.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        await prisma.turma.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Turma excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir turma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Avançar aula
app.post('/api/turmas/:id/avancar', authMiddleware, async (req, res) => {
    try {
        const turma = await prisma.turma.findUnique({
            where: { id: req.params.id },
            include: { curso: { include: { modulos: { include: { aulas: true } } } } }
        });

        if (!turma) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        if (req.user.role !== 'ADMIN' && turma.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Calcular total de aulas do curso
        const totalAulas = turma.curso.modulos.reduce((acc, mod) => acc + mod.aulas.length, 0);

        if (turma.aulaAtual >= totalAulas) {
            return res.status(400).json({ error: 'Curso já concluído' });
        }

        const novaAula = turma.aulaAtual + 1;
        const novoStatus = novaAula >= totalAulas ? 'CONCLUIDA' : 'ATIVA';

        // Registrar hora da aula
        const valorHora = parseFloat(process.env.VALOR_HORA_AULA) || 27.00;
        const duracaoMinutos = 150; // 2h30min padrão

        await prisma.registroHora.create({
            data: {
                professorId: turma.professorId,
                turmaId: turma.id,
                data: new Date(),
                horaInicio: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                horaFim: new Date(Date.now() + duracaoMinutos * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                duracaoMinutos,
                tipo: 'AULA',
                valorHora,
                valorTotal: (duracaoMinutos / 60) * valorHora
            }
        });

        const updated = await prisma.turma.update({
            where: { id: req.params.id },
            data: { aulaAtual: novaAula, status: novoStatus }
        });

        res.json(updated);
    } catch (error) {
        console.error('Erro ao avançar aula:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE CRONOGRAMA
// ==========================================

app.get('/api/cronograma', authMiddleware, async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;

        const where = {
            professorId: req.user.role === 'ADMIN' ? undefined : req.user.id
        };

        if (dataInicio && dataFim) {
            where.data = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }

        const cronogramas = await prisma.cronograma.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true } },
                turma: {
                    select: {
                        id: true,
                        nome: true,
                        curso: { select: { nome: true, cor: true } }
                    }
                }
            },
            orderBy: { data: 'asc' }
        });

        res.json(cronogramas);
    } catch (error) {
        console.error('Erro ao buscar cronograma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE TAREFAS
// ==========================================

app.get('/api/tarefas', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN'
            ? {}
            : { professorId: req.user.id };

        const tarefas = await prisma.tarefa.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true } }
            },
            orderBy: { data: 'desc' }
        });

        res.json(tarefas);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/tarefas', authMiddleware, async (req, res) => {
    try {
        const { tipo, titulo, descricao, data, horaInicio, horaFim } = req.body;

        const tarefa = await prisma.tarefa.create({
            data: {
                professorId: req.user.id,
                tipo,
                titulo,
                descricao,
                data: new Date(data),
                horaInicio,
                horaFim
            }
        });

        res.status(201).json(tarefa);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/tarefas/:id/concluir', authMiddleware, async (req, res) => {
    try {
        const tarefa = await prisma.tarefa.findUnique({
            where: { id: req.params.id }
        });

        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        if (req.user.role !== 'ADMIN' && tarefa.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Calcular duração e registrar hora
        const [horaIni, minIni] = tarefa.horaInicio.split(':').map(Number);
        const [horaFim, minFim] = tarefa.horaFim.split(':').map(Number);
        const duracaoMinutos = (horaFim * 60 + minFim) - (horaIni * 60 + minIni);
        const valorHora = parseFloat(process.env.VALOR_HORA_AULA) || 27.00;

        await prisma.registroHora.create({
            data: {
                professorId: tarefa.professorId,
                data: tarefa.data,
                horaInicio: tarefa.horaInicio,
                horaFim: tarefa.horaFim,
                duracaoMinutos,
                tipo: tarefa.tipo,
                descricao: tarefa.titulo,
                valorHora,
                valorTotal: (duracaoMinutos / 60) * valorHora
            }
        });

        const updated = await prisma.tarefa.update({
            where: { id: req.params.id },
            data: { status: 'CONCLUIDA' }
        });

        res.json(updated);
    } catch (error) {
        console.error('Erro ao concluir tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE HORAS E PAGAMENTOS
// ==========================================

app.get('/api/horas', authMiddleware, async (req, res) => {
    try {
        const { mes, ano, professorId } = req.query;

        const where = {};

        // Professor só vê próprias horas
        if (req.user.role !== 'ADMIN') {
            where.professorId = req.user.id;
        } else if (professorId) {
            where.professorId = professorId;
        }

        if (mes && ano) {
            const dataInicio = new Date(ano, mes - 1, 1);
            const dataFim = new Date(ano, mes, 0);
            where.data = {
                gte: dataInicio,
                lte: dataFim
            };
        }

        const registros = await prisma.registroHora.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true } },
                turma: {
                    select: {
                        id: true,
                        nome: true,
                        curso: { select: { nome: true } }
                    }
                }
            },
            orderBy: { data: 'desc' }
        });

        // Calcular totais
        const totalMinutos = registros.reduce((acc, r) => acc + r.duracaoMinutos, 0);
        const totalValor = registros.reduce((acc, r) => acc + r.valorTotal, 0);

        res.json({
            registros,
            resumo: {
                totalHoras: (totalMinutos / 60).toFixed(2),
                totalMinutos,
                totalValor: totalValor.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar horas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE PARÂMETROS
// ==========================================

app.get('/api/parametros', authMiddleware, async (req, res) => {
    try {
        const parametros = await prisma.parametro.findMany();
        const params = {};
        parametros.forEach(p => {
            params[p.chave] = p.valor;
        });
        res.json(params);
    } catch (error) {
        console.error('Erro ao buscar parâmetros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/parametros/:chave', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { valor, descricao } = req.body;

        const parametro = await prisma.parametro.upsert({
            where: { chave: req.params.chave },
            update: { valor, descricao },
            create: { chave: req.params.chave, valor, descricao }
        });

        res.json(parametro);
    } catch (error) {
        console.error('Erro ao atualizar parâmetro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// DASHBOARD STATS
// ==========================================

app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { professorId: req.user.id };
        const whereHoras = req.user.role === 'ADMIN' ? {} : { professorId: req.user.id };

        // Datas do mês atual
        const agora = new Date();
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

        whereHoras.data = { gte: inicioMes, lte: fimMes };

        const [totalTurmas, turmasAtivas, totalProfessores, horasMes] = await Promise.all([
            prisma.turma.count({ where }),
            prisma.turma.count({ where: { ...where, status: 'ATIVA' } }),
            req.user.role === 'ADMIN'
                ? prisma.user.count({ where: { role: 'PROFESSOR', ativo: true } })
                : 1,
            prisma.registroHora.aggregate({
                where: whereHoras,
                _sum: { duracaoMinutos: true, valorTotal: true }
            })
        ]);

        res.json({
            totalTurmas,
            turmasAtivas,
            totalProfessores,
            horasMes: ((horasMes._sum.duracaoMinutos || 0) / 60).toFixed(1),
            valorMes: (horasMes._sum.valorTotal || 0).toFixed(2)
        });
    } catch (error) {
        console.error('Erro ao buscar stats:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Aulas de hoje e amanhã
app.get('/api/dashboard/aulas-hoje', authMiddleware, async (req, res) => {
    try {
        const hoje = new Date();
        const diasSemana = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
        const diaHoje = diasSemana[hoje.getDay()];
        const diaAmanha = diasSemana[(hoje.getDay() + 1) % 7];

        const where = req.user.role === 'ADMIN' ? {} : { professorId: req.user.id };

        const turmas = await prisma.turma.findMany({
            where: {
                ...where,
                status: { not: 'CONCLUIDA' },
                diasSemana: { hasSome: [diaHoje, diaAmanha] }
            },
            include: {
                professor: { select: { id: true, nome: true } },
                curso: { select: { nome: true, cor: true } }
            },
            orderBy: { horario: 'asc' }
        });

        const aulasHoje = turmas.filter(t => t.diasSemana.includes(diaHoje));
        const aulasAmanha = turmas.filter(t => t.diasSemana.includes(diaAmanha));

        res.json({ aulasHoje, aulasAmanha });
    } catch (error) {
        console.error('Erro ao buscar aulas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   PrismaTech - API de Gestão de Aulas      ║
║   Servidor rodando na porta ${PORT}            ║
║   http://localhost:${PORT}                     ║
╚════════════════════════════════════════════╝
    `);
});

// Fechar conexão Prisma ao encerrar
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
