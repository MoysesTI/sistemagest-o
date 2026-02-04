// ==========================================
// SERVER.JS - API BACKEND v2.0
// PrismaTech Code Academy
// ==========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// ==========================================
// MIDDLEWARE DE SEGURANÇA
// ==========================================

// Trust proxy (necessário para Render, Railway, Heroku, etc.)
// Permite que express-rate-limit funcione corretamente atrás de proxy
app.set('trust proxy', 1);

app.use(helmet());

// CORS configurado para produção
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:80', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Permite requisições sem origin (ex: mobile apps, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' }
});
app.use('/api/', limiter);

// Health check endpoint (para Docker/Kubernetes)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !await bcrypt.compare(senha, user.senha)) {
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
            user: { id: user.id, nome: user.nome, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha, telefone, cnpj, razaoSocial } = req.body;

        if (await prisma.user.findUnique({ where: { email } })) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        const user = await prisma.user.create({
            data: {
                nome, email, senha: hashedPassword, telefone, cnpj, razaoSocial,
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
            user: { id: user.id, nome: user.nome, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    res.json({ user: req.user });
});

// ==========================================
// ROTAS DE USUÁRIOS/PROFESSORES
// ==========================================

app.get('/api/users', authMiddleware, async (req, res) => {
    try {
        // Professor só vê a si mesmo
        const where = req.user.role === 'ADMIN' ? {} : { id: req.user.id };

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true, nome: true, email: true, role: true, telefone: true,
                cnpj: true, razaoSocial: true, certificadoMEI: true, ativo: true, createdAt: true,
                _count: { select: { turmas: true } }
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
            include: {
                modulosLecionados: { include: { modulo: { include: { curso: true } } } },
                _count: { select: { turmas: true, registrosHora: true } }
            }
        });

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/users/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const { nome, telefone, cnpj, razaoSocial, modulosIds } = req.body;

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { nome, telefone, cnpj, razaoSocial, certificadoMEI: !!cnpj }
        });

        // Atualizar módulos lecionados
        if (modulosIds && req.user.role === 'ADMIN') {
            await prisma.professorModulo.deleteMany({ where: { professorId: req.params.id } });
            for (const moduloId of modulosIds) {
                await prisma.professorModulo.create({
                    data: { professorId: req.params.id, moduloId }
                });
            }
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/users/:id/senha', authMiddleware, async (req, res) => {
    try {
        // Usuário só pode alterar própria senha
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const { senhaAtual, senhaNova } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
        if (!senhaValida) {
            return res.status(400).json({ error: 'Senha atual incorreta' });
        }

        const hashedSenha = await bcrypt.hash(senhaNova, 10);
        await prisma.user.update({
            where: { id: req.params.id },
            data: { senha: hashedSenha }
        });

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
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
                    include: { aulas: { where: { ativo: true }, orderBy: { numero: 'asc' } } },
                    orderBy: { ordem: 'asc' }
                },
                _count: { select: { turmas: true } }
            },
            orderBy: { ordem: 'asc' }
        });
        res.json(cursos);
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/cursos', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { codigo, nome, descricao, cor, arquivoReferencia } = req.body;
        const maxOrdem = await prisma.curso.aggregate({ _max: { ordem: true } });

        const curso = await prisma.curso.create({
            data: { codigo, nome, descricao, cor, arquivoReferencia, ordem: (maxOrdem._max.ordem || 0) + 1 }
        });

        res.status(201).json(curso);
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { codigo, nome, descricao, cor, arquivoReferencia, ordem, ativo } = req.body;
        const curso = await prisma.curso.update({
            where: { id: req.params.id },
            data: { codigo, nome, descricao, cor, arquivoReferencia, ordem, ativo }
        });
        res.json(curso);
    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/cursos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await prisma.curso.delete({ where: { id: req.params.id } });
        res.json({ message: 'Curso excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE MÓDULOS
// ==========================================

app.post('/api/cursos/:cursoId/modulos', authMiddleware, async (req, res) => {
    try {
        const { codigo, nome, descricao, arquivoReferencia } = req.body;
        const maxOrdem = await prisma.modulo.aggregate({
            where: { cursoId: req.params.cursoId },
            _max: { ordem: true }
        });

        const modulo = await prisma.modulo.create({
            data: {
                cursoId: req.params.cursoId,
                codigo, nome, descricao, arquivoReferencia,
                ordem: (maxOrdem._max.ordem || 0) + 1
            }
        });

        res.status(201).json(modulo);
    } catch (error) {
        console.error('Erro ao criar módulo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/modulos/:id', authMiddleware, async (req, res) => {
    try {
        const { codigo, nome, descricao, arquivoReferencia, ordem, ativo } = req.body;
        const modulo = await prisma.modulo.update({
            where: { id: req.params.id },
            data: { codigo, nome, descricao, arquivoReferencia, ordem, ativo }
        });
        res.json(modulo);
    } catch (error) {
        console.error('Erro ao atualizar módulo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/modulos/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await prisma.modulo.delete({ where: { id: req.params.id } });
        res.json({ message: 'Módulo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir módulo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE AULAS
// ==========================================

app.post('/api/modulos/:moduloId/aulas', authMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, duracao, topicos, arquivoReferencia } = req.body;
        const maxNumero = await prisma.aula.aggregate({
            where: { moduloId: req.params.moduloId },
            _max: { numero: true }
        });

        const aula = await prisma.aula.create({
            data: {
                moduloId: req.params.moduloId,
                numero: (maxNumero._max.numero || 0) + 1,
                titulo, descricao, duracao, topicos: topicos || [], arquivoReferencia
            }
        });

        res.status(201).json(aula);
    } catch (error) {
        console.error('Erro ao criar aula:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/aulas/:id', authMiddleware, async (req, res) => {
    try {
        const { titulo, descricao, duracao, topicos, arquivoReferencia, imagemSlide, ativo } = req.body;
        const aula = await prisma.aula.update({
            where: { id: req.params.id },
            data: { titulo, descricao, duracao, topicos, arquivoReferencia, imagemSlide, ativo }
        });
        res.json(aula);
    } catch (error) {
        console.error('Erro ao atualizar aula:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/aulas/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await prisma.aula.delete({ where: { id: req.params.id } });
        res.json({ message: 'Aula excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir aula:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE TURMAS
// ==========================================

app.get('/api/turmas', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { professorId: req.user.id };

        const turmas = await prisma.turma.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true, email: true } },
                curso: { select: { id: true, nome: true, cor: true, modulos: { select: { id: true, nome: true } } } },
                turmaModulos: { include: { modulo: true } }
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
        const {
            codigo, nome, local, qtdAlunos, diasSemana,
            horarioInicio, horarioFim, dataInicio, dataFim,
            cursoId, professorId
        } = req.body;

        // Admin pode definir qualquer professor, professor só pode criar para si
        const professorIdFinal = req.user.role === 'ADMIN' && professorId ? professorId : req.user.id;

        const turma = await prisma.turma.create({
            data: {
                codigo, nome, local, qtdAlunos,
                diasSemana, horarioInicio, horarioFim,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                professorId: professorIdFinal,
                cursoId,
                status: 'ATIVA'
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
        const turma = await prisma.turma.findUnique({ where: { id: req.params.id } });
        if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

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
        const turma = await prisma.turma.findUnique({ where: { id: req.params.id } });
        if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

        if (req.user.role !== 'ADMIN' && turma.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Excluir dependências (CronogramaItem e RegistroHora não têm Cascade no schema)
        await prisma.cronogramaItem.deleteMany({ where: { turmaId: turma.id } });
        await prisma.registroHora.deleteMany({ where: { turmaId: turma.id } });
        // TurmaModulo tem Cascade, mas garantindo para evitar erro
        await prisma.turmaModulo.deleteMany({ where: { turmaId: turma.id } });

        await prisma.turma.delete({ where: { id: req.params.id } });
        res.json({ message: 'Turma excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir turma:', error);
        res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
    }
});

// Avançar aula da turma
app.post('/api/turmas/:id/avancar', authMiddleware, async (req, res) => {
    try {
        const turma = await prisma.turma.findUnique({
            where: { id: req.params.id },
            include: { curso: { include: { modulos: { include: { aulas: true } } } } }
        });

        if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

        if (req.user.role !== 'ADMIN' && turma.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const totalAulas = turma.curso.modulos.reduce((acc, mod) => acc + mod.aulas.length, 0);
        if (turma.aulaAtual >= totalAulas) {
            return res.status(400).json({ error: 'Curso já concluído' });
        }

        const novaAula = turma.aulaAtual + 1;
        const novoStatus = novaAula >= totalAulas ? 'CONCLUIDA' : 'ATIVA';

        // Registrar hora
        const valorHora = parseFloat(process.env.VALOR_HORA_AULA) || 27.00;
        const duracaoMinutos = 150;

        await prisma.registroHora.create({
            data: {
                professorId: turma.professorId,
                turmaId: turma.id,
                data: new Date(),
                horaInicio: turma.horarioInicio,
                horaFim: turma.horarioFim,
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
        const where = { professorId: req.user.role === 'ADMIN' ? undefined : req.user.id };

        if (dataInicio && dataFim) {
            where.data = { gte: new Date(dataInicio), lte: new Date(dataFim) };
        }

        const items = await prisma.cronogramaItem.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true } },
                turma: { select: { id: true, nome: true, curso: { select: { nome: true, cor: true } } } },
                tarefaExtra: true
            },
            orderBy: [{ data: 'asc' }, { horaInicio: 'asc' }]
        });

        res.json(items);
    } catch (error) {
        console.error('Erro ao buscar cronograma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Importar turmas para o cronograma (usa datas da própria turma)
app.post('/api/cronograma/importar', authMiddleware, async (req, res) => {
    try {
        // Buscar turmas ativas do professor logado
        const turmas = await prisma.turma.findMany({
            where: {
                professorId: req.user.id,
                status: { in: ['PENDENTE', 'ATIVA'] }
            },
            include: {
                curso: { select: { nome: true } }
            }
        });

        if (turmas.length === 0) {
            return res.json({ message: 'Nenhuma turma encontrada para importar', criados: 0 });
        }

        let criados = 0;

        const diasMap = {
            'DOMINGO': 0, 'SEGUNDA': 1, 'TERCA': 2, 'QUARTA': 3,
            'QUINTA': 4, 'SEXTA': 5, 'SABADO': 6
        };

        for (const turma of turmas) {
            // Usar datas da própria turma
            const inicio = new Date(turma.dataInicio);
            const fim = new Date(turma.dataFim);

            // Iterar por cada dia desde o início até o fim do curso
            for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
                const diaSemanaJS = d.getDay();
                const diaSemana = Object.keys(diasMap).find(k => diasMap[k] === diaSemanaJS);

                // Se este dia está nos dias da semana da turma
                if (turma.diasSemana.includes(diaSemana)) {
                    // Verifica se já existe entrada para esta turma nesta data
                    const existente = await prisma.cronogramaItem.findFirst({
                        where: {
                            professorId: req.user.id,
                            turmaId: turma.id,
                            data: {
                                gte: new Date(d.toISOString().split('T')[0] + 'T00:00:00Z'),
                                lt: new Date(d.toISOString().split('T')[0] + 'T23:59:59Z')
                            }
                        }
                    });

                    if (!existente) {
                        await prisma.cronogramaItem.create({
                            data: {
                                professorId: req.user.id,
                                turmaId: turma.id,
                                data: new Date(d.toISOString().split('T')[0]),
                                horaInicio: turma.horarioInicio,
                                horaFim: turma.horarioFim,
                                descricao: `${turma.nome} - ${turma.curso.nome}`
                            }
                        });
                        criados++;
                    }
                }
            }
        }

        res.json({
            message: `${criados} aulas adicionadas ao cronograma`,
            criados,
            turmasProcessadas: turmas.length
        });
    } catch (error) {
        console.error('Erro ao importar cronograma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Buscar um item do cronograma por ID
app.get('/api/cronograma/:id', authMiddleware, async (req, res) => {
    try {
        const item = await prisma.cronogramaItem.findUnique({
            where: { id: req.params.id },
            include: {
                professor: { select: { id: true, nome: true } },
                turma: { select: { id: true, nome: true, curso: { select: { nome: true, cor: true } } } },
                tarefaExtra: true
            }
        });

        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        // Verificar permissão (admin ou próprio professor)
        if (req.user.role !== 'ADMIN' && item.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json(item);
    } catch (error) {
        console.error('Erro ao buscar item do cronograma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar um item do cronograma
app.put('/api/cronograma/:id', authMiddleware, async (req, res) => {
    try {
        const { tipo, data, titulo, horaInicio, horaFim, descricao } = req.body;

        const item = await prisma.cronogramaItem.findUnique({
            where: { id: req.params.id },
            include: { tarefaExtra: true }
        });

        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        // Verificar permissão (admin ou próprio professor)
        if (req.user.role !== 'ADMIN' && item.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Atualizar dados do cronograma item
        const updatedItem = await prisma.cronogramaItem.update({
            where: { id: req.params.id },
            data: {
                data: data ? new Date(data) : undefined,
                horaInicio,
                horaFim,
                descricao: titulo
            }
        });

        // Se tem tarefa extra, atualizar também
        if (item.tarefaExtraId) {
            await prisma.tarefaExtra.update({
                where: { id: item.tarefaExtraId },
                data: {
                    tipo,
                    titulo,
                    descricao
                }
            });
        }

        res.json(updatedItem);
    } catch (error) {
        console.error('Erro ao atualizar item do cronograma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Excluir um item do cronograma
app.delete('/api/cronograma/:id', authMiddleware, async (req, res) => {
    try {
        const item = await prisma.cronogramaItem.findUnique({
            where: { id: req.params.id }
        });

        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        // Verificar permissão (admin ou próprio professor)
        if (req.user.role !== 'ADMIN' && item.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Se tem tarefa extra, excluir também
        if (item.tarefaExtraId) {
            await prisma.tarefaExtra.delete({ where: { id: item.tarefaExtraId } });
        }

        await prisma.cronogramaItem.delete({ where: { id: req.params.id } });

        res.json({ message: 'Item excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir item do cronograma:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


// ==========================================
// MARCAR AULA DO CRONOGRAMA (para aulas temporais)
// Cria CronogramaItem se não existir e marca como realizada
// ==========================================
app.post('/api/cronograma/marcar-aula', authMiddleware, async (req, res) => {
    try {
        const { turmaId, data } = req.body;

        if (!turmaId || !data) {
            return res.status(400).json({ error: 'turmaId e data são obrigatórios' });
        }

        // Buscar a turma
        const turma = await prisma.turma.findUnique({
            where: { id: turmaId },
            include: { curso: { select: { nome: true } } }
        });

        if (!turma) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        // Verificar permissão (admin ou professor da turma)
        if (req.user.role !== 'ADMIN' && turma.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Normalizar a data para início do dia
        const dataAula = new Date(data);
        const dataInicio = new Date(dataAula.toISOString().split('T')[0] + 'T00:00:00Z');
        const dataFim = new Date(dataAula.toISOString().split('T')[0] + 'T23:59:59Z');

        // Verificar se já existe um CronogramaItem para esta turma nesta data
        let cronogramaItem = await prisma.cronogramaItem.findFirst({
            where: {
                turmaId: turmaId,
                data: {
                    gte: dataInicio,
                    lte: dataFim
                }
            }
        });

        // Calcular duração e valor
        const [horaIni, minIni] = turma.horarioInicio.split(':').map(Number);
        const [horaFim, minFim] = turma.horarioFim.split(':').map(Number);
        const duracaoMinutos = (horaFim * 60 + minFim) - (horaIni * 60 + minIni);

        // Buscar valor da hora
        const valorHoraParam = await prisma.parametro.findUnique({ where: { chave: 'VALOR_HORA_AULA' } });
        const valorHora = valorHoraParam ? parseFloat(valorHoraParam.valor) : 27.00;
        const valorCalculado = (duracaoMinutos / 60) * valorHora;

        if (cronogramaItem) {
            // Se já existe, atualizar para realizada
            cronogramaItem = await prisma.cronogramaItem.update({
                where: { id: cronogramaItem.id },
                data: {
                    realizada: true,
                    duracaoMinutos,
                    valorCalculado
                }
            });
        } else {
            // Se não existe, criar novo
            cronogramaItem = await prisma.cronogramaItem.create({
                data: {
                    professorId: turma.professorId,
                    turmaId: turmaId,
                    data: dataInicio,
                    horaInicio: turma.horarioInicio,
                    horaFim: turma.horarioFim,
                    descricao: `${turma.nome} - ${turma.curso?.nome || 'Aula'}`,
                    realizada: true,
                    duracaoMinutos,
                    valorCalculado
                }
            });
        }

        // Registrar na tabela RegistroHora
        // Primeiro verificar se já existe registro para esta data/turma
        const registroExistente = await prisma.registroHora.findFirst({
            where: {
                turmaId: turmaId,
                data: {
                    gte: dataInicio,
                    lte: dataFim
                }
            }
        });

        if (!registroExistente) {
            await prisma.registroHora.create({
                data: {
                    professorId: turma.professorId,
                    turmaId: turmaId,
                    data: dataInicio,
                    horaInicio: turma.horarioInicio,
                    horaFim: turma.horarioFim,
                    duracaoMinutos,
                    tipo: 'AULA',
                    descricao: `${turma.nome} - ${turma.curso?.nome || 'Aula'}`,
                    valorHora,
                    valorTotal: valorCalculado
                }
            });
        }

        // Atualizar aulaAtual da turma
        await prisma.turma.update({
            where: { id: turmaId },
            data: { aulaAtual: { increment: 1 } }
        });

        res.json({
            message: 'Aula marcada com sucesso!',
            cronogramaItem,
            valorCalculado: valorCalculado.toFixed(2),
            duracaoHoras: (duracaoMinutos / 60).toFixed(1)
        });

    } catch (error) {
        console.error('Erro ao marcar aula:', error);
        res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
    }
});

// Marcar presença (check)
app.put('/api/cronograma/:id/check', authMiddleware, async (req, res) => {
    try {
        const item = await prisma.cronogramaItem.findUnique({ where: { id: req.params.id } });
        if (!item) return res.status(404).json({ error: 'Item não encontrado' });

        if (req.user.role !== 'ADMIN' && item.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const updated = await prisma.cronogramaItem.update({
            where: { id: req.params.id },
            data: { realizada: !item.realizada }
        });

        // Se marcou como realizada, calcular duração e valor
        if (updated.realizada) {
            const [horaIni, minIni] = updated.horaInicio.split(':').map(Number);
            const [horaFim, minFim] = updated.horaFim.split(':').map(Number);
            const duracaoMinutos = (horaFim * 60 + minFim) - (horaIni * 60 + minIni);
            const valorHora = parseFloat(process.env.VALOR_HORA_AULA) || 27.00;
            const valorCalculado = (duracaoMinutos / 60) * valorHora;

            // Atualizar com valores calculados
            await prisma.cronogramaItem.update({
                where: { id: req.params.id },
                data: { duracaoMinutos, valorCalculado }
            });

            // Se é uma aula (tem turma), registrar hora
            if (updated.turmaId) {
                // Registrar na tabela RegistroHora
                await prisma.registroHora.create({
                    data: {
                        professorId: updated.professorId,
                        turmaId: updated.turmaId,
                        data: updated.data,
                        horaInicio: updated.horaInicio,
                        horaFim: updated.horaFim,
                        duracaoMinutos,
                        tipo: 'AULA',
                        valorHora,
                        valorTotal: valorCalculado
                    }
                });
            }
        }

        res.json(updated);
    } catch (error) {
        console.error('Erro ao marcar presença:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Validação do Admin - Aprovar/Reprovar tarefa
app.put('/api/cronograma/:id/validar', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { validar, bonus } = req.body; // validar: boolean, bonus: percentual opcional
        const item = await prisma.cronogramaItem.findUnique({ where: { id: req.params.id } });

        if (!item) return res.status(404).json({ error: 'Item não encontrado' });

        // Calcular duração e valor
        const [horaIni, minIni] = item.horaInicio.split(':').map(Number);
        const [horaFim, minFim] = item.horaFim.split(':').map(Number);
        const duracaoMinutos = (horaFim * 60 + minFim) - (horaIni * 60 + minIni);

        // Buscar valor da hora no banco ou usar padrão
        const valorHoraParam = await prisma.parametro.findUnique({ where: { chave: 'VALOR_HORA_AULA' } });
        const valorHora = valorHoraParam ? parseFloat(valorHoraParam.valor) : 27.00;

        // Calcular valor base
        let valorBase = (duracaoMinutos / 60) * valorHora;

        // Aplicar bônus se fornecido
        const bonusAplicado = bonus || 0;
        const valorFinal = valorBase * (1 + bonusAplicado / 100);

        const updated = await prisma.cronogramaItem.update({
            where: { id: req.params.id },
            data: {
                validadoAdmin: validar,
                validadoPorId: validar ? req.user.id : null,
                dataValidacao: validar ? new Date() : null,
                duracaoMinutos,
                valorCalculado: validar ? valorFinal : null,
                bonusAplicado: validar ? bonusAplicado : null
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Erro ao validar item:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Cronograma de um professor específico (Admin only)
app.get('/api/cronograma/professor/:professorId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;
        const where = { professorId: req.params.professorId };

        if (dataInicio && dataFim) {
            where.data = { gte: new Date(dataInicio), lte: new Date(dataFim) };
        }

        const items = await prisma.cronogramaItem.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true } },
                turma: { select: { id: true, nome: true, curso: { select: { nome: true, cor: true } } } },
                tarefaExtra: true
            },
            orderBy: [{ data: 'asc' }, { horaInicio: 'asc' }]
        });

        res.json(items);
    } catch (error) {
        console.error('Erro ao buscar cronograma do professor:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Relatório financeiro (Admin only)
app.get('/api/relatorios/financeiro', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { dataInicio, dataFim, professorId } = req.query;

        const where = { realizada: true }; // Itens com check do professor
        if (professorId) where.professorId = professorId;
        if (dataInicio && dataFim) {
            where.data = { gte: new Date(dataInicio), lte: new Date(dataFim) };
        }

        // Buscar todos os itens validados
        const itens = await prisma.cronogramaItem.findMany({
            where,
            include: {
                professor: { select: { id: true, nome: true } },
                turma: { select: { id: true, nome: true } },
                tarefaExtra: { select: { tipo: true, titulo: true } }
            },
            orderBy: [{ data: 'asc' }]
        });

        // Agrupar por professor
        const porProfessor = {};
        itens.forEach(item => {
            if (!porProfessor[item.professorId]) {
                porProfessor[item.professorId] = {
                    professor: item.professor,
                    totalHoras: 0,
                    totalValor: 0,
                    qtdAulas: 0,
                    qtdTarefas: 0,
                    itens: []
                };
            }
            porProfessor[item.professorId].totalHoras += (item.duracaoMinutos || 0) / 60;
            porProfessor[item.professorId].totalValor += item.valorCalculado || 0;
            if (item.turmaId) porProfessor[item.professorId].qtdAulas++;
            if (item.tarefaExtraId) porProfessor[item.professorId].qtdTarefas++;
            porProfessor[item.professorId].itens.push(item);
        });

        // Totais gerais
        const totais = {
            totalHoras: itens.reduce((acc, i) => acc + ((i.duracaoMinutos || 0) / 60), 0),
            totalValor: itens.reduce((acc, i) => acc + (i.valorCalculado || 0), 0),
            qtdItens: itens.length,
            qtdProfessores: Object.keys(porProfessor).length
        };

        res.json({ totais, porProfessor: Object.values(porProfessor), itens });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Parâmetros do sistema (listar e atualizar)
app.get('/api/parametros', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const parametros = await prisma.parametro.findMany();
        res.json(parametros);
    } catch (error) {
        console.error('Erro ao buscar parâmetros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/parametros/:chave', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { valor } = req.body;
        const parametro = await prisma.parametro.upsert({
            where: { chave: req.params.chave },
            update: { valor },
            create: { chave: req.params.chave, valor, descricao: req.body.descricao }
        });
        res.json(parametro);
    } catch (error) {
        console.error('Erro ao atualizar parâmetro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Recalcular valores de todos os itens realizados (Admin only)
app.post('/api/cronograma/recalcular', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const valorHora = parseFloat(process.env.VALOR_HORA_AULA) || 27.00;

        // Buscar todos os itens realizados sem valor calculado
        const itens = await prisma.cronogramaItem.findMany({
            where: {
                realizada: true,
                OR: [
                    { duracaoMinutos: null },
                    { valorCalculado: null }
                ]
            }
        });

        let atualizados = 0;
        for (const item of itens) {
            // Calcular duração
            const [horaIni, minIni] = item.horaInicio.split(':').map(Number);
            const [horaFim, minFim] = item.horaFim.split(':').map(Number);
            const duracaoMinutos = (horaFim * 60 + minFim) - (horaIni * 60 + minIni);
            const valorCalculado = (duracaoMinutos / 60) * valorHora;

            await prisma.cronogramaItem.update({
                where: { id: item.id },
                data: { duracaoMinutos, valorCalculado }
            });
            atualizados++;
        }

        res.json({
            message: `${atualizados} itens recalculados com sucesso`,
            valorHora,
            itensAtualizados: atualizados
        });
    } catch (error) {
        console.error('Erro ao recalcular valores:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// ROTAS DE TAREFAS EXTRAS
// ==========================================


app.get('/api/tarefas-extras', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { professorId: req.user.id };

        const tarefas = await prisma.tarefaExtra.findMany({
            where,
            include: { professor: { select: { id: true, nome: true } } },
            orderBy: { data: 'desc' }
        });

        res.json(tarefas);
    } catch (error) {
        console.error('Erro ao buscar tarefas extras:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/tarefas-extras', authMiddleware, async (req, res) => {
    try {
        const { tipo, titulo, descricao, data, horaInicio, horaFim } = req.body;

        const tarefa = await prisma.tarefaExtra.create({
            data: {
                professorId: req.user.id,
                tipo, titulo, descricao,
                data: new Date(data),
                horaInicio, horaFim
            }
        });

        // Criar item no cronograma
        await prisma.cronogramaItem.create({
            data: {
                professorId: req.user.id,
                tarefaExtraId: tarefa.id,
                data: new Date(data),
                horaInicio, horaFim,
                descricao: `${tipo}: ${titulo}`
            }
        });

        res.status(201).json(tarefa);
    } catch (error) {
        console.error('Erro ao criar tarefa extra:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/tarefas-extras/:id/concluir', authMiddleware, async (req, res) => {
    try {
        const tarefa = await prisma.tarefaExtra.findUnique({ where: { id: req.params.id } });
        if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });

        if (req.user.role !== 'ADMIN' && tarefa.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

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

        const updated = await prisma.tarefaExtra.update({
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
// DASHBOARD STATS
// ==========================================

app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { professorId: req.user.id };

        const agora = new Date();
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

        const [totalTurmas, turmasAtivas, totalProfessores, totalCursos, horasMes] = await Promise.all([
            prisma.turma.count({ where }),
            prisma.turma.count({ where: { ...where, status: 'ATIVA' } }),
            req.user.role === 'ADMIN' ? prisma.user.count({ where: { role: 'PROFESSOR', ativo: true } }) : 1,
            prisma.curso.count({ where: { ativo: true } }),
            prisma.registroHora.aggregate({
                where: {
                    ...(req.user.role === 'ADMIN' ? {} : { professorId: req.user.id }),
                    data: { gte: inicioMes, lte: fimMes }
                },
                _sum: { duracaoMinutos: true, valorTotal: true }
            })
        ]);

        res.json({
            totalTurmas,
            turmasAtivas,
            totalProfessores,
            totalCursos,
            horasMes: ((horasMes._sum.duracaoMinutos || 0) / 60).toFixed(1),
            valorMes: (horasMes._sum.valorTotal || 0).toFixed(2)
        });
    } catch (error) {
        console.error('Erro ao buscar stats:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

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
            orderBy: { horarioInicio: 'asc' }
        });

        res.json({
            aulasHoje: turmas.filter(t => t.diasSemana.includes(diaHoje)),
            aulasAmanha: turmas.filter(t => t.diasSemana.includes(diaAmanha))
        });
    } catch (error) {
        console.error('Erro ao buscar aulas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==========================================
// PARÂMETROS
// ==========================================

app.get('/api/parametros', authMiddleware, async (req, res) => {
    try {
        const parametros = await prisma.parametro.findMany();
        const params = {};
        parametros.forEach(p => { params[p.chave] = p.valor; });
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
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   PrismaTech - API de Gestão v2.0          ║
║   Servidor rodando na porta ${PORT}            ║
║   http://localhost:${PORT}                     ║
╚════════════════════════════════════════════╝
    `);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
