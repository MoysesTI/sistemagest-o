# 📚 Sistema de Gestão de Aulas - PrismaTech

Sistema full-stack para gestão de turmas, professores, cronograma e horas trabalhadas.

![PrismaTech](assets/logo.png)

## 🛠️ Tecnologias

- **Frontend**: HTML, CSS, JavaScript (Bootstrap Icons)
- **Backend**: Node.js, Express
- **ORM**: Prisma
- **Banco**: PostgreSQL
- **Container**: Docker

---

## 🚀 Quick Start (Novo PC)

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clonar o Repositório
```bash
git clone https://github.com/MoysesTI/sistemagest-o.git
cd sistemagest-o
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar o arquivo de exemplo
cp .env.example .env
cp .env.example backend/.env
```

### 3. Subir o Banco de Dados
```bash
docker-compose up -d
```
> PostgreSQL rodará na porta **5433** e pgAdmin na **5050**

### 4. Configurar o Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 5. Iniciar o Servidor
```bash
npm run dev
```
> API disponível em http://localhost:5001

### 6. Acessar o Sistema
Abra o arquivo `login.html` no navegador ou use a extensão Live Server do VS Code.

---

## 🔑 Credenciais Padrão

| Perfil | Email | Senha |
|--------|-------|-------|
| **Admin** | admin@prismatech.com | admin123 |
| **Professor** | professor@prismatech.com | prof123 |

---

## 📁 Estrutura

```
├── docker-compose.yml      # PostgreSQL + pgAdmin
├── .env.example            # Template de variáveis
├── api.js                  # Cliente API (frontend)
├── index.html              # Dashboard
├── login.html              # Página de login
├── cadastro.html           # Cadastro de professor
├── styles.css              # Estilos
├── script.js               # Lógica frontend
└── backend/
    ├── package.json
    ├── server.js           # API Express
    └── prisma/
        ├── schema.prisma   # Modelo do banco
        └── seed.js         # Dados iniciais
```

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Cadastro |
| GET | /api/turmas | Listar turmas |
| POST | /api/turmas | Criar turma |
| GET | /api/horas | Horas trabalhadas |
| GET | /api/dashboard/stats | Estatísticas |

---

## 👤 Perfis de Acesso

### Administrador
- Acesso total a todos os dados
- Gerencia professores, cursos e turmas
- Visualiza horas de todos

### Professor
- Visualiza apenas suas turmas
- Registra tarefas e horas
- Não acessa dados de outros

---

## 🔧 Comandos Úteis

```bash
# Visualizar banco com Prisma Studio
npm run prisma:studio

# Resetar banco de dados
npx prisma migrate reset

# Logs do Docker
docker-compose logs -f postgres
```

---

## 📄 Licença

MIT License - PrismaTech Code Academy
