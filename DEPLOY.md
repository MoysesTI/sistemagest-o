# 🚀 Guia de Deploy - Sistema de Gestão de Aulas

## Plataformas Gratuitas Recomendadas

| Plataforma | Frontend | Backend | DB PostgreSQL | Facilidade |
|------------|----------|---------|---------------|------------|
| **Render** | ✅ Static | ✅ Web Service | ✅ Free tier | ⭐⭐⭐⭐⭐ |
| **Railway** | ✅ | ✅ | ✅ $5 trial | ⭐⭐⭐⭐ |
| **Fly.io** | ✅ Docker | ✅ Docker | ✅ Free tier | ⭐⭐⭐ |

---

## 🏆 Deploy no Render (Recomendado)

### Passo 1: Preparar repositório GitHub

```bash
cd C:\Users\MOYSES\Downloads\Controle-de-aula-main\Controle-de-aula-main
git init
git add .
git commit -m "Prepare for production deploy"
git remote add origin https://github.com/SEU-USUARIO/controle-aulas.git
git push -u origin main
```

### Passo 2: Criar banco PostgreSQL no Render

1. Acesse [render.com](https://render.com) e faça login
2. **New → PostgreSQL**
3. Configure:
   - Name: `gestao-aulas-db`
   - Plan: **Free**
4. Copie a **Internal Database URL**

### Passo 3: Deploy do Backend

1. **New → Web Service**
2. Conecte seu repositório GitHub
3. Configure:
   - Name: `gestao-aulas-api`
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npx prisma db push`
   - Start Command: `node server.js`
   - Plan: **Free**
4. Adicione **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | production |
| `DATABASE_URL` | (colar Internal Database URL) |
| `JWT_SECRET` | (gerar novo com crypto) |
| `ALLOWED_ORIGINS` | https://seu-frontend.onrender.com |
| `ADMIN_EMAIL` | admin@seudominio.com |
| `ADMIN_PASSWORD` | SenhaForte123! |

### Passo 4: Deploy do Frontend

1. **New → Static Site**
2. Conecte o mesmo repositório
3. Configure:
   - Name: `gestao-aulas-frontend`
   - Root Directory: `. ` (raiz, não backend)
   - Build Command: (deixe vazio)
   - Publish Directory: `.`
4. Adicione Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

### Passo 5: Configurar API URL

Edite `api.js` e atualize a detecção de ambiente:

```javascript
const API_BASE = window.location.hostname.includes('onrender.com')
    ? 'https://gestao-aulas-api.onrender.com/api'
    : (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');
```

---

## 🐳 Deploy com Docker (Fly.io)

### Passo 1: Instalar flyctl

```bash
# Windows (PowerShell como Admin)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Fazer login
fly auth login
```

### Passo 2: Criar arquivo fly.toml

```toml
app = "gestao-aulas"
primary_region = "gru"  # São Paulo

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

### Passo 3: Criar banco Postgres

```bash
fly postgres create --name gestao-aulas-db
fly postgres attach gestao-aulas-db
```

### Passo 4: Definir secrets

```bash
fly secrets set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
fly secrets set ADMIN_EMAIL=admin@seudominio.com
fly secrets set ADMIN_PASSWORD=SenhaForte123!
```

### Passo 5: Deploy

```bash
fly deploy
```

---

## ✅ Checklist Pré-Deploy

- [ ] JWT_SECRET forte (128+ chars)
- [ ] ADMIN_PASSWORD forte
- [ ] ALLOWED_ORIGINS configurado
- [ ] DATABASE_URL apontando para produção
- [ ] Código commitado no Git
- [ ] Testes locais passando

---

## 🔒 Segurança em Produção

1. **Nunca** commite `.env` no Git
2. Use senhas fortes (mín. 12 chars, números, símbolos)
3. Ative 2FA nas plataformas de deploy
4. Monitore logs de acesso regularmente
5. Faça backup do banco regularmente
