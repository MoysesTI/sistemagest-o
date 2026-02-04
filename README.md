# Sistema de Gestão de Aulas - PrismaTech

Sistema de gestão de aulas, professores e financeiro para a PrismaTech Code Academy.
Desenvolvido com Vanilla JS (Frontend) e Node.js/Express/Prisma (Backend).

## 🚀 Instalação e Configuração

Siga os passos abaixo para rodar o projeto em uma nova máquina.

### 1. Clonar o Repositório

```bash
git clone https://github.com/MoysesTI/sistemagest-o.git
cd sistemagest-o
```

### 2. Configurar Variáveis de Ambiente

Copie os arquivos de exemplo para produção:

```bash
# Windows
copy .env.example .env
copy .env.example backend\.env

# Linux/Mac
cp .env.example .env
cp .env.example backend/.env
```

### 3. Iniciar Banco de Dados

Suba o container do PostgreSQL com Docker:

```bash
docker-compose up -d
```

### 4. Configurar Backend

Instale as dependências e configure o banco de dados:

```bash
cd backend
npm install

# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco (Migrations)
npx prisma migrate dev --name init

# Popular banco com dados iniciais (Seed)
npm run prisma:seed

# Iniciar backend (Porta 5001)
npm run dev
```

### 5. Iniciar Frontend

Em outro terminal, na raiz do projeto:

```bash
# Requer npx instalado
npx -y http-server . -p 3000 -c-1
```

Acesse o sistema em: http://localhost:3000

---

## 📦 Estrutura do Projeto

- **/js**: Módulos do frontend (dashboard, turmas, cronograma, etc.)
- **/backend**: API Node.js com Express e Prisma
- **/prisma**: Schema do banco de dados e migrações

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Modular)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Prisma ORM
- **Infra**: Docker Compose

## 👤 Credenciais Padrão (Seed)

- **Email**: admin@prismatech.com.br
- **Senha**: admin123
