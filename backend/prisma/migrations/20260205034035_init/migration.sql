-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROFESSOR');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "StatusTurma" AS ENUM ('PENDENTE', 'ATIVA', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoTarefa" AS ENUM ('PLANEJAMENTO', 'ORGANIZACAO', 'PRODUCAO_MATERIAL', 'EDICAO_VIDEO', 'PROJETO', 'REUNIAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusTarefa" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PROFESSOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cnpj" TEXT,
    "razaoSocial" TEXT,
    "certificadoMEI" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cor" TEXT NOT NULL DEFAULT '#2980b9',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "arquivoReferencia" TEXT,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "arquivoReferencia" TEXT,
    "professorId" TEXT,
    "cursoId" TEXT NOT NULL,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "duracao" TEXT NOT NULL DEFAULT '2h30min',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "arquivoReferencia" TEXT,
    "imagemSlide" TEXT,
    "topicos" TEXT[],
    "professorId" TEXT,
    "moduloId" TEXT NOT NULL,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_modulos" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professor_modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "qtdAlunos" INTEGER NOT NULL DEFAULT 0,
    "diasSemana" "DiaSemana"[],
    "horarioInicio" TEXT NOT NULL,
    "horarioFim" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "aulaAtual" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusTurma" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professorId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turma_modulos" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "aulaAtual" INTEGER NOT NULL DEFAULT 0,
    "concluido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turma_modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cronograma_items" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "descricao" TEXT,
    "realizada" BOOLEAN NOT NULL DEFAULT false,
    "validadoAdmin" BOOLEAN NOT NULL DEFAULT false,
    "validadoPorId" TEXT,
    "dataValidacao" TIMESTAMP(3),
    "duracaoMinutos" INTEGER,
    "valorCalculado" DOUBLE PRECISION,
    "bonusAplicado" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conteudoMinistrado" TEXT,
    "moduloId" TEXT,
    "aulaId" TEXT,
    "professorId" TEXT NOT NULL,
    "turmaId" TEXT,
    "tarefaExtraId" TEXT,

    CONSTRAINT "cronograma_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas_extras" (
    "id" TEXT NOT NULL,
    "tipo" "TipoTarefa" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "status" "StatusTarefa" NOT NULL DEFAULT 'PENDENTE',
    "validadoAdmin" BOOLEAN NOT NULL DEFAULT false,
    "validadoPorId" TEXT,
    "dataValidacao" TIMESTAMP(3),
    "duracaoMinutos" INTEGER,
    "valorCalculado" DOUBLE PRECISION,
    "bonusAplicado" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "tarefas_extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_hora" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "valorHora" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professorId" TEXT NOT NULL,
    "turmaId" TEXT,

    CONSTRAINT "registros_hora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametros" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_codigo_key" ON "cursos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_cursoId_codigo_professorId_key" ON "modulos"("cursoId", "codigo", "professorId");

-- CreateIndex
CREATE UNIQUE INDEX "aulas_moduloId_numero_professorId_key" ON "aulas"("moduloId", "numero", "professorId");

-- CreateIndex
CREATE UNIQUE INDEX "professor_modulos_professorId_moduloId_key" ON "professor_modulos"("professorId", "moduloId");

-- CreateIndex
CREATE UNIQUE INDEX "turmas_codigo_key" ON "turmas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "turma_modulos_turmaId_moduloId_key" ON "turma_modulos"("turmaId", "moduloId");

-- CreateIndex
CREATE UNIQUE INDEX "parametros_chave_key" ON "parametros"("chave");

-- AddForeignKey
ALTER TABLE "modulos" ADD CONSTRAINT "modulos_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulos" ADD CONSTRAINT "modulos_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_modulos" ADD CONSTRAINT "professor_modulos_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_modulos" ADD CONSTRAINT "professor_modulos_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_modulos" ADD CONSTRAINT "turma_modulos_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_modulos" ADD CONSTRAINT "turma_modulos_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronograma_items" ADD CONSTRAINT "cronograma_items_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronograma_items" ADD CONSTRAINT "cronograma_items_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "aulas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronograma_items" ADD CONSTRAINT "cronograma_items_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronograma_items" ADD CONSTRAINT "cronograma_items_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronograma_items" ADD CONSTRAINT "cronograma_items_tarefaExtraId_fkey" FOREIGN KEY ("tarefaExtraId") REFERENCES "tarefas_extras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas_extras" ADD CONSTRAINT "tarefas_extras_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_hora" ADD CONSTRAINT "registros_hora_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_hora" ADD CONSTRAINT "registros_hora_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
