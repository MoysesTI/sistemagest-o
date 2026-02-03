// ==========================================
// SEED - DADOS INICIAIS DO BANCO
// PrismaTech Code Academy
// ==========================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // ==========================================
    // USUÁRIO ADMIN
    // ==========================================
    console.log('👤 Criando usuário admin...');

    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@prismatech.com' },
        update: {},
        create: {
            email: 'admin@prismatech.com',
            senha: adminPassword,
            nome: 'Administrador PrismaTech',
            role: 'ADMIN',
            telefone: '(11) 99999-9999'
        }
    });
    console.log(`   ✅ Admin criado: ${admin.email}`);

    // ==========================================
    // PARÂMETROS DO SISTEMA
    // ==========================================
    console.log('\n⚙️ Criando parâmetros do sistema...');

    const parametros = [
        { chave: 'VALOR_HORA_AULA', valor: '27.00', descricao: 'Valor base da hora-aula em R$' },
        { chave: 'BONUS_PERCENTUAL', valor: '33', descricao: 'Percentual de bonificação' },
        { chave: 'RETENCAO_PERCENTUAL', valor: '80', descricao: 'Percentual de retenção' },
        { chave: 'DURACAO_AULA_PADRAO', valor: '150', descricao: 'Duração padrão de aula em minutos' }
    ];

    for (const param of parametros) {
        await prisma.parametro.upsert({
            where: { chave: param.chave },
            update: { valor: param.valor },
            create: param
        });
        console.log(`   ✅ ${param.chave}: ${param.valor}`);
    }

    // ==========================================
    // CURSOS
    // ==========================================
    console.log('\n📚 Criando cursos...');

    const cursosData = [
        {
            codigo: 'CANVA',
            nome: 'Canva',
            descricao: 'Design gráfico com Canva',
            cor: '#00C4CC',
            nivel: 'L1',
            modulos: [
                {
                    codigo: 'CANVA-M1',
                    nome: 'Fundamentos do Canva',
                    ordem: 1,
                    aulas: [
                        { numero: 1, titulo: 'Conhecendo o Canva', topicos: ['Interface', 'Ferramentas básicas', 'Navegação'] },
                        { numero: 2, titulo: 'Primeiro Projeto', topicos: ['Templates', 'Elementos', 'Edição básica'] },
                        { numero: 3, titulo: 'Textos e Tipografia', topicos: ['Fontes', 'Estilos', 'Hierarquia'] },
                        { numero: 4, titulo: 'Imagens e Cores', topicos: ['Upload', 'Filtros', 'Paleta de cores'] },
                        { numero: 5, titulo: 'Projeto Final', topicos: ['Post para redes', 'Banner', 'Exportação'] }
                    ]
                }
            ]
        },
        {
            codigo: 'FIGMA',
            nome: 'Figma',
            descricao: 'Design de interfaces com Figma',
            cor: '#F24E1E',
            nivel: 'L2',
            modulos: [
                {
                    codigo: 'FIGMA-M1',
                    nome: 'Introdução ao Figma',
                    ordem: 1,
                    aulas: [
                        { numero: 1, titulo: 'Interface do Figma', topicos: ['Workspace', 'Tools', 'Layers'] },
                        { numero: 2, titulo: 'Formas e Vetores', topicos: ['Shapes', 'Pen tool', 'Boolean'] },
                        { numero: 3, titulo: 'Componentes', topicos: ['Criação', 'Variantes', 'Instâncias'] },
                        { numero: 4, titulo: 'Auto Layout', topicos: ['Padding', 'Gap', 'Responsividade'] },
                        { numero: 5, titulo: 'Protótipo', topicos: ['Interações', 'Animações', 'Compartilhamento'] }
                    ]
                }
            ]
        },
        {
            codigo: 'EXCEL',
            nome: 'Excel',
            descricao: 'Planilhas e análise de dados',
            cor: '#217346',
            nivel: 'L1',
            modulos: [
                {
                    codigo: 'EXCEL-M1',
                    nome: 'Excel Básico',
                    ordem: 1,
                    aulas: [
                        { numero: 1, titulo: 'Introdução ao Excel', topicos: ['Interface', 'Células', 'Navegação'] },
                        { numero: 2, titulo: 'Fórmulas Básicas', topicos: ['SOMA', 'MÉDIA', 'Operadores'] },
                        { numero: 3, titulo: 'Formatação', topicos: ['Células', 'Tabelas', 'Estilos'] },
                        { numero: 4, titulo: 'Gráficos', topicos: ['Tipos', 'Criação', 'Formatação'] },
                        { numero: 5, titulo: 'Impressão e Exportação', topicos: ['Layout', 'PDF', 'Configurações'] }
                    ]
                }
            ]
        },
        {
            codigo: 'WORD',
            nome: 'Word',
            descricao: 'Edição de documentos',
            cor: '#2B579A',
            nivel: 'L1',
            modulos: [
                {
                    codigo: 'WORD-M1',
                    nome: 'Word Essencial',
                    ordem: 1,
                    aulas: [
                        { numero: 1, titulo: 'Interface do Word', topicos: ['Ferramentas', 'Faixa de opções', 'Backstage'] },
                        { numero: 2, titulo: 'Formatação de Texto', topicos: ['Fontes', 'Parágrafos', 'Estilos'] },
                        { numero: 3, titulo: 'Imagens e Tabelas', topicos: ['Inserção', 'Formatação', 'Layout'] },
                        { numero: 4, titulo: 'Páginas e Seções', topicos: ['Quebras', 'Cabeçalho', 'Rodapé'] },
                        { numero: 5, titulo: 'Revisão e Exportação', topicos: ['Ortografia', 'Comentários', 'PDF'] }
                    ]
                }
            ]
        },
        {
            codigo: 'UNITY',
            nome: 'Unity',
            descricao: 'Desenvolvimento de jogos',
            cor: '#000000',
            nivel: 'L3',
            modulos: [
                {
                    codigo: 'UNITY-M1',
                    nome: 'Introdução ao Unity',
                    ordem: 1,
                    aulas: [
                        { numero: 1, titulo: 'Conhecendo o Unity', topicos: ['Interface', 'Projeto', 'Cenas'] },
                        { numero: 2, titulo: 'GameObjects', topicos: ['Criação', 'Transform', 'Componentes'] },
                        { numero: 3, titulo: 'Scripts C#', topicos: ['Variáveis', 'Funções', 'MonoBehaviour'] },
                        { numero: 4, titulo: 'Física e Colisão', topicos: ['Rigidbody', 'Collider', 'Triggers'] },
                        { numero: 5, titulo: 'Primeiro Jogo', topicos: ['Gameplay', 'UI', 'Build'] }
                    ]
                }
            ]
        },
        {
            codigo: 'POWERBI',
            nome: 'Power BI',
            descricao: 'Análise e visualização de dados',
            cor: '#F2C811',
            nivel: 'L2',
            modulos: [
                {
                    codigo: 'POWERBI-M1',
                    nome: 'Power BI Essencial',
                    ordem: 1,
                    aulas: [
                        { numero: 1, titulo: 'Introdução ao Power BI', topicos: ['Interface', 'Conceitos', 'Fluxo'] },
                        { numero: 2, titulo: 'Conexão de Dados', topicos: ['Fontes', 'Transformação', 'Modelagem'] },
                        { numero: 3, titulo: 'Visualizações', topicos: ['Gráficos', 'Mapas', 'Tabelas'] },
                        { numero: 4, titulo: 'DAX Básico', topicos: ['Medidas', 'Cálculos', 'Contextos'] },
                        { numero: 5, titulo: 'Publicação', topicos: ['Relatórios', 'Dashboards', 'Compartilhamento'] }
                    ]
                }
            ]
        }
    ];

    for (const cursoData of cursosData) {
        const { modulos, ...cursoInfo } = cursoData;

        const curso = await prisma.curso.upsert({
            where: { codigo: cursoInfo.codigo },
            update: cursoInfo,
            create: cursoInfo
        });
        console.log(`   ✅ Curso: ${curso.nome}`);

        for (const moduloData of modulos) {
            const { aulas, ...moduloInfo } = moduloData;

            const modulo = await prisma.modulo.upsert({
                where: {
                    cursoId_codigo: {
                        cursoId: curso.id,
                        codigo: moduloInfo.codigo
                    }
                },
                update: moduloInfo,
                create: { ...moduloInfo, cursoId: curso.id }
            });
            console.log(`      📦 Módulo: ${modulo.nome}`);

            for (const aulaData of aulas) {
                await prisma.aula.upsert({
                    where: {
                        moduloId_numero: {
                            moduloId: modulo.id,
                            numero: aulaData.numero
                        }
                    },
                    update: aulaData,
                    create: { ...aulaData, moduloId: modulo.id }
                });
            }
            console.log(`         📝 ${aulas.length} aulas criadas`);
        }
    }

    // ==========================================
    // PROFESSOR DE EXEMPLO
    // ==========================================
    console.log('\n👨‍🏫 Criando professor de exemplo...');

    const professorPassword = await bcrypt.hash('prof123', 10);

    const professor = await prisma.user.upsert({
        where: { email: 'professor@prismatech.com' },
        update: {},
        create: {
            email: 'professor@prismatech.com',
            senha: professorPassword,
            nome: 'João Silva',
            role: 'PROFESSOR',
            telefone: '(11) 98888-8888',
            cnpj: '12.345.678/0001-90',
            razaoSocial: 'João Silva Ensino ME',
            certificadoMEI: true
        }
    });
    console.log(`   ✅ Professor: ${professor.nome} (${professor.email})`);

    console.log('\n✨ Seed concluído com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Usuários criados:');
    console.log('    📧 admin@prismatech.com / admin123');
    console.log('    📧 professor@prismatech.com / prof123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
