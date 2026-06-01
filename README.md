# DocuAsk — AI-Powered Document Q&A

Upload a PDF, ask questions, get AI answers. Built with Node.js + Express +
MongoDB + Azure Blob Storage + Angular + Anthropic Claude AI.

---

## What you will learn building this

- Node.js: middleware, JWT auth, file uploads, error handling, project structure
- MongoDB: schemas, indexes, aggregation pipelines, relationships
- Azure: Blob Storage for file storage, App Service for deployment
- Angular: Signals, standalone components, HttpClient, interceptors
- AI integration: calling Claude API from a Node.js backend

---

## Setup — Step by step

### Step 1: Prerequisites

Install these if you don't have them:
- Node.js 20+ → https://nodejs.org
- MongoDB Atlas free cluster → https://mongodb.com/atlas (click "Try Free")
- Angular CLI → `npm install -g @angular/cli`

### Step 2: Get your API keys

**Anthropic API key (for AI):**
1. Go to https://console.anthropic.com
2. Sign up → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

**Azure Storage (for file uploads):**
1. Go to https://portal.azure.com (free account at azure.microsoft.com/free)
2. Create a "Storage account"
3. Go to your storage account → Security → Access keys
4. Copy "Connection string" from key1

**MongoDB URI:**
1. Create free cluster at mongodb.com/atlas
2. Click Connect → Drivers → Copy connection string
3. Replace `<password>` with your DB password

### Step 3: Setup backend

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your keys
npm install
npm run dev
```

You should see:
```
Server running on port 3000
MongoDB connected: cluster0.xxxxx.mongodb.net
```

Test it: open http://localhost:3000/api/health — should return `{"status":"ok"}`

### Step 4: Create your Angular project

```bash
ng new docuask-frontend --standalone --routing
cd docuask-frontend

# Copy the service and component files provided into src/app/
# Copy environment.ts into src/environments/
```

File placement:
```
src/
  app/
    services/
      auth.service.ts         ← copy auth.service.ts here
      query.service.ts        ← copy query.service.ts here
    interceptors/
      auth.interceptor.ts     ← copy auth.interceptor.ts here
    components/
      dashboard/
        dashboard.component.ts  ← copy dashboard.component.ts here
    app.config.ts             ← copy app.config.ts here
  environments/
    environment.ts            ← copy environment.ts here
```

```bash
ng serve
```

Open http://localhost:4200 — register, upload a PDF, ask a question!

### Step 5: Deploy to Azure (Month 2 goal)

```bash
# Install Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli
az login

# Create App Service and deploy backend
az webapp up --name docuask-api --runtime "NODE:20-lts" --sku F1

# Set environment variables on Azure
az webapp config appsettings set --name docuask-api --settings \
  MONGODB_URI="your-uri" \
  JWT_SECRET="your-secret" \
  ANTHROPIC_API_KEY="your-key" \
  AZURE_STORAGE_CONNECTION_STRING="your-conn-string" \
  AZURE_STORAGE_CONTAINER="docuask-files"
```

---

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Get JWT token |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/queries/ask | Yes | Upload PDF + ask question |
| GET | /api/queries/history | Yes | Get Q&A history |
| DELETE | /api/queries/:id | Yes | Delete a query |

---

## Test the API with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Ask a question (replace yourfile.pdf with an actual PDF)
curl -X POST http://localhost:3000/api/queries/ask \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@yourfile.pdf" \
  -F "question=What is this document about?"

# Get history
curl http://localhost:3000/api/queries/history \
  -H "Authorization: Bearer $TOKEN"
```

---

## Project structure

```
docuask/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Register, login
│   │   │   └── query.controller.js  # Upload PDF, ask AI, history
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # JWT verification
│   │   ├── models/
│   │   │   ├── user.model.js        # User schema
│   │   │   └── query.model.js       # Q&A history schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── query.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js        # Claude API calls
│   │   │   └── blob.service.js      # Azure Blob Storage
│   │   └── server.js                # Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    └── src/app/
        ├── services/
        │   ├── auth.service.ts      # Login, register, JWT storage
        │   └── query.service.ts     # API calls for queries
        ├── interceptors/
        │   └── auth.interceptor.ts  # Auto-attach JWT to requests
        ├── components/
        │   └── dashboard/
        │       └── dashboard.component.ts
        └── app.config.ts
```

---

## What to build next (extend this project)

1. Add a login/register Angular component with reactive forms
2. Add an Angular route guard that redirects to /login if not authenticated
3. Swap `@anthropic-ai/sdk` for `@azure/openai` to practice Azure OpenAI
4. Add a BullMQ job queue so large PDFs are processed in the background
5. Add MongoDB Atlas Vector Search to find similar past questions
6. Write Jest unit tests for the auth controller
7. Set up an Azure DevOps pipeline to auto-deploy on every git push
