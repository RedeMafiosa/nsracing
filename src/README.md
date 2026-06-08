# NsRacing — Plataforma de Sim Racing

## Stack
- React + Vite + Tailwind CSS
- Supabase (auth, base de dados, storage)
- Framer Motion, shadcn/ui, TanStack Query

---

## 1. Configurar o Supabase

### A. Criar as tabelas
1. Vai ao teu projeto Supabase → **SQL Editor**
2. Cola e executa o conteúdo do ficheiro `SUPABASE_SETUP.sql`

### B. Ativar confirmação de email (opcional)
- Em **Authentication → Settings → Email**, podes desativar "Confirm email" para testes.

### C. Variáveis de ambiente
Cria um ficheiro `.env` na raiz com:
```
VITE_SUPABASE_URL=https://kjvdxteoqpklngucrlcb.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_-u055CrwcWqpWVDmFgkxmg_csO8dGIU
```

---

## 2. Fazer o primeiro Admin

Após registares a tua conta, vai ao **Supabase → Table Editor → profiles** e altera o teu `role` para `admin`.

---

## 3. Deploy no Render

### A. Exportar para GitHub
1. No Base44, vai a **Settings → GitHub Sync** e liga ao teu repositório

### B. Criar Static Site no Render
1. [render.com](https://render.com) → New → Static Site
2. Ligar ao repositório GitHub
3. Configurações:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Em **Environment Variables**, adicionar:
   - `VITE_SUPABASE_URL` = `https://kjvdxteoqpklngucrlcb.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = a tua anon key

---

## 4. Estrutura do Projeto

```
src/
├── pages/
│   ├── Casa.jsx          # Landing page
│   ├── Lives.jsx         # Lives de racing
│   ├── Arquivo.jsx       # Top 10 arquivo
│   ├── Suporte.jsx       # Formulário de suporte
│   ├── Perfil.jsx        # Perfil do utilizador
│   ├── Admin.jsx         # Gestão de membros
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   └── Navbar.jsx
│   ├── home/
│   │   ├── NeonTitle.jsx
│   │   ├── StatsCounter.jsx
│   │   └── MembersList.jsx
│   ├── lives/LiveCard.jsx
│   └── arquivo/ArchivedCard.jsx
├── lib/
│   ├── supabase.js              # Cliente Supabase
│   └── SupabaseAuthContext.jsx  # Contexto de autenticação
└── SUPABASE_SETUP.sql           # SQL para criar tabelas
```

---

## 5. Tabelas Supabase

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Dados dos utilizadores (cargo, estrelas, role, avatar, banner) |
| `live_streams` | Lives de sim racing |
| `archived_streams` | Arquivo Top 10 |
| `support_tickets` | Tickets de suporte |

Storage bucket: `avatars` (público) — para fotos de perfil e banners.