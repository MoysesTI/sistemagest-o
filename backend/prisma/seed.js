// ==========================================
// SEED - APENAS ADMIN E PARÂMETROS
// Sistema zerado - cursos serão criados manualmente
// ==========================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...\n');
    console.log('📢 SISTEMA ZERADO - Cursos serão adicionados manualmente\n');

    // ==========================================
    // USUÁRIO ADMIN PEDAGÓGICO
    // ==========================================
    console.log('👤 Criando usuário admin pedagógico...');

    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@prismatech.com' },
        update: {
            senha: adminPassword,  // Atualiza a senha se já existir
            role: 'ADMIN'
        },
        create: {
            email: 'admin@prismatech.com',
            senha: adminPassword,
            nome: 'Administrador Pedagógico',
            role: 'ADMIN',
            telefone: '(11) 99999-9999'
        }
    });
    console.log(`   ✅ Admin criado/atualizado: ${admin.email}`);

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

    console.log('\n✨ Seed concluído com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Credenciais de acesso:');
    console.log('    📧 admin@prismatech.com / admin123');
    console.log('');
    console.log('  ⚠️  Sistema iniciado ZERADO');
    console.log('  📚 Adicione cursos, módulos e aulas manualmente');
    console.log('  👨‍🏫 Cadastre professores pelo sistema');
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
