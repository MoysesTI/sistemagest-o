// ==========================================
// SEED - ADMIN E PARÂMETROS DO SISTEMA
// Usa variáveis de ambiente para credenciais
// ==========================================

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // ==========================================
    // USUÁRIO ADMIN
    // ==========================================

    // Usa variáveis de ambiente ou valores padrão
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@prismatech.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    console.log(`👤 Configurando admin: ${adminEmail}`);

    const hashedPassword = await bcrypt.hash(adminPass, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            senha: hashedPassword,
            role: 'ADMIN'
        },
        create: {
            email: adminEmail,
            senha: hashedPassword,
            nome: 'Administrador',
            role: 'ADMIN',
            telefone: '(11) 99999-9999'
        }
    });
    console.log(`   ✅ Admin configurado: ${admin.email}`);

    // ==========================================
    // PARÂMETROS DO SISTEMA
    // ==========================================
    console.log('\n⚙️ Configurando parâmetros do sistema...');

    const valorHoraAula = process.env.VALOR_HORA_AULA || '27.00';

    const parametros = [
        { chave: 'VALOR_HORA_AULA', valor: valorHoraAula, descricao: 'Valor base da hora-aula em R$' },
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
    console.log(`  Admin: ${adminEmail}`);
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
