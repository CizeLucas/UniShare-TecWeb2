# Como rodar o projeto

## Extensoes recomendadas no VS Code

- ESLint (dbaeumer.vscode-eslint) - lint e padroes de codigo
- Prettier - Code formatter (esbenp.prettier-vscode) - formatacao automatica
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss) - util para o frontend
- REST Client (humao.rest-client) - testar requests do backend em client.http

## Como rodar os projetos

### Banco de dados (PostgreSQL via Docker)

Os valores do banco ficam no .env na raiz do repositorio. Use o .env.example como base.

Suba o banco localmente:

```bash
docker compose up -d
```

Para parar:

```bash
docker compose down
```

Credenciais padrao (definidas no .env):

- Host: localhost
- Porta: 5432
- Banco: unishare
- Usuario: unishare

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

A API sobe por padrao em http://localhost:3000/.

Se for rodar backend e frontend ao mesmo tempo, escolha outra porta para o backend:

```powershell
$env:PORT=3001; npm run start:dev
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe por padrao em http://localhost:3000/.

Para trocar a porta do frontend, voce pode usar:

```bash
npm run dev -- -p 3001
```
