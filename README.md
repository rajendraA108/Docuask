# 📄 DocuAsk — AI-Powered Document Q&A

**Upload a PDF, ask questions, get AI answers.** A full-stack application powered by Node.js, Express, MongoDB, Azure Blob Storage, Angular, and Anthropic's Claude AI.

[![GitHub](https://img.shields.io/badge/GitHub-rajendraA108%2FDocuask-blue?logo=github)](https://github.com/rajendraA108/Docuask)
![Status](https://img.shields.io/badge/Status-Active%20Development-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Overview

DocuAsk is an intelligent document analysis platform that allows users to:
- Upload PDF documents securely
- Ask natural language questions about document contents
- Get AI-powered answers using Claude AI
- Maintain a history of queries and answers
- Access documents across devices with cloud storage

---

## 🎓 What You'll Learn

- **Node.js & Express**: Middleware, JWT authentication, file uploads, error handling, RESTful API design
- **MongoDB**: Schema design, indexing, aggregation pipelines, data relationships
- **Azure Cloud**: Blob Storage for scalable file storage, deployment options
- **Angular**: Standalone components, Signals, HttpClient, interceptors, reactive forms
- **AI Integration**: Calling Claude API, prompt engineering, handling AI responses
- **Security**: Password hashing, JWT tokens, environment variable management

---

## 🏗️ Project Structure

```
docuask/
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── server.js                 # Entry point
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   └── query.controller.js   # Query/AI logic
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # JWT validation
│   │   ├── models/
│   │   │   ├── user.model.js         # User schema
│   │   │   └── query.model.js        # Query schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth endpoints
│   │   │   ├── query.routes.js       # Query endpoints
│   │   │   └── document.routes.js    # Document endpoints
│   │   └── services/
│   │       ├── ai.service.js         # Claude AI integration
│   │       └── blob.service.js       # Azure Blob Storage
│   └── package.json
│
├── docuask-frontend/                 # Angular SPA
│   ├── src/
│   │   ├── main.ts                   # Bootstrap file
│   │   ├── app/
│   │   │   ├── app.routes.ts         # Routing configuration
│   │   │   ├── app.config.ts         # App configuration
│   │   │   ├── app.component.ts      # Root component
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts   # Authentication service
│   │   │   │   └── query.service.ts  # Query service
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts # JWT interceptor
│   │   │   └── components/
│   │   │       ├── login/
│   │   │       └── dashboard/
│   │   └── environments/
│   │       └── environment.ts        # Configuration
│   └── angular.json
│
├── .gitignore
└── README.md
```

---

## 💻 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Node.js, Express | 20+, 4.x |
| **Database** | MongoDB | 5.0+ |
| **Cloud Storage** | Azure Blob Storage | Latest |
| **Frontend** | Angular | 18+ |
| **Authentication** | JWT | - |
| **AI** | Anthropic Claude | Latest |
| **Styling** | SCSS | - |

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js 20+** → [Download](https://nodejs.org)
- **MongoDB** → [MongoDB Atlas (Free)](https://mongodb.com/atlas) or [Local Installation](https://docs.mongodb.com/manual/installation/)
- **Angular CLI** → `npm install -g @angular/cli`
- **Git** → [Download](https://git-scm.com)

---

## 🔑 Required API Keys & Services

### 1️⃣ Anthropic API Key (for AI)
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up → Create API Key
3. Copy the key (format: `sk-ant-...`)

### 2️⃣ Azure Storage Connection String
1. Create free account at [Azure Portal](https://portal.azure.com) ([Free Tier](https://azure.microsoft.com/free))
2. Create a "Storage account"
3. Navigate to **Security + networking** → **Access keys**
4. Copy **Connection string** from Key 1

### 3️⃣ MongoDB Connection String
1. Create free cluster at [MongoDB Atlas](https://mongodb.com/atlas)
2. Click **Connect** → **Drivers**
3. Copy connection string
4. Replace `<password>` with your database password
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/docuask`

---

## ⚙️ Setup — Step by Step

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/rajendraA108/Docuask.git
cd Docuask

# Backend setup
cd backend
npm install

# Frontend setup (in a new terminal)
cd docuask-frontend
npm install
```

### Step 2: Create Environment Files

**Backend (.env):**

```bash
cd backend
```

Create `backend/.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/docuask

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-here
JWT_EXPIRE=7d

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER=docuask-files

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-...
```

**Frontend (environment.ts):**

The frontend is already configured to hit `http://localhost:3000/api` in development.

### Step 3: Start the Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:3000
✓ MongoDB connected to cluster0.xxxxx.mongodb.net
✓ API ready at http://localhost:3000/api
```

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok"}
```

### Step 4: Start the Frontend

In a new terminal:

```bash
cd docuask-frontend
ng serve --open
```

Or visit: `http://localhost:4200`

The app will automatically open in your browser!

### Step 5: Test the Application

1. **Register** → Create a new account
2. **Login** → Sign in with your credentials
3. **Upload PDF** → Select a PDF file from your computer
4. **Ask Question** → Type a question about the document
5. **Get Answer** → Wait for Claude AI to analyze and respond

---

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Get JWT token |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/auth/logout` | ✅ | Logout user |

### Query Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/queries/ask` | ✅ | Upload PDF + ask question |
| GET | `/api/queries/history` | ✅ | Get all Q&A history |
| GET | `/api/queries/:id` | ✅ | Get specific query |
| DELETE | `/api/queries/:id` | ✅ | Delete query |

### Document Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/documents` | ✅ | List uploaded documents |
| DELETE | `/api/documents/:id` | ✅ | Delete document |

---

## 🧪 Test the API with cURL

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Login & Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### 3. Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Ask a Question (Upload PDF)

```bash
curl -X POST http://localhost:3000/api/queries/ask \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "question=What are the main points in this document?"
```

### 5. Get Query History

```bash
curl http://localhost:3000/api/queries/history \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📱 Frontend Features

- ✅ User registration & authentication
- ✅ JWT-based secure API calls
- ✅ PDF file upload with drag-and-drop
- ✅ Real-time query processing
- ✅ Query history with timestamp
- ✅ Responsive design (mobile-friendly)
- ✅ Error handling & user feedback
- ✅ Auto token refresh with interceptor

---

## 🚀 Deployment

### Deploy Backend to Azure App Service

```bash
# Install Azure CLI
# Windows: choco install azure-cli
# Mac: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create App Service Plan
az appservice plan create --name docuask-plan --resource-group myResourceGroup --sku F1 --is-linux

# Create Web App
az webapp create --name docuask-api --resource-group myResourceGroup --plan docuask-plan --runtime "NODE:20-lts"

# Set environment variables
az webapp config appsettings set --name docuask-api --resource-group myResourceGroup --settings \
  MONGODB_URI="your-mongodb-uri" \
  JWT_SECRET="your-jwt-secret" \
  ANTHROPIC_API_KEY="your-api-key" \
  AZURE_STORAGE_CONNECTION_STRING="your-connection-string" \
  AZURE_STORAGE_CONTAINER="docuask-files"

# Deploy backend
cd backend && npm run build
az webapp up --name docuask-api --resource-group myResourceGroup
```

### Deploy Frontend to Netlify/Vercel

```bash
# Build Angular app
cd docuask-frontend
ng build --configuration production

# Deploy using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist/docuask-frontend/browser
```

Or use GitHub Actions for automatic deployment on every push!

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
```
✅ Solution:
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0 for dev)
- Ensure MongoDB username & password are correct

### Azure Storage Errors
```
Error: Invalid Storage Account Connection String
```
✅ Solution:
- Copy the complete connection string (not just account name)
- Check connection string is set in `.env`
- Verify container name exists in Azure Storage

### JWT Token Issues
```
Error: Invalid token
```
✅ Solution:
- Clear browser localStorage: `localStorage.clear()`
- Re-login to get fresh token
- Verify JWT_SECRET in backend .env

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
✅ Solution:
- Backend should allow frontend origin (check cors middleware)
- For development: add `http://localhost:4200` to CORS whitelist

### File Upload Fails
```
Error: File too large
```
✅ Solution:
- Check file size limit in backend (usually 25MB)
- Ensure Azure Storage has space
- Verify AZURE_STORAGE_CONNECTION_STRING is valid

---

## 📚 Documentation & Resources

### Backend Documentation
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Schema Design](https://docs.mongodb.com/manual/core/data-model-design/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)

### Frontend Documentation
- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular HTTP Client](https://angular.io/guide/http)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contributing Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update README if adding new features

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

MIT License allows you to:
- ✅ Use for personal & commercial projects
- ✅ Modify the code
- ✅ Distribute the code
- ✅ Include in proprietary applications

Just include a copy of the license in your distribution.

---

## 🆘 Getting Help

- 📖 **Documentation**: Check the [README](README.md)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/rajendraA108/Docuask/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/rajendraA108/Docuask/discussions)
- 📧 **Email**: [Contact Developer](mailto:rajendra@example.com)

---

## 🗺️ Roadmap

- [ ] User profile management
- [ ] Batch processing for multiple PDFs
- [ ] Vector search for similar questions
- [ ] Email notifications
- [ ] API rate limiting & analytics
- [ ] Docker & Docker Compose setup
- [ ] Unit & integration tests
- [ ] CI/CD with GitHub Actions
- [ ] Mobile app (React Native)
- [ ] Premium tier with priority processing

---

## 👥 Team & Credits

- **Developer**: Rajendra
- **Frontend Framework**: Angular
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: Anthropic Claude
- **Cloud**: Microsoft Azure

---

## ⭐ Show Your Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

---

## 📞 Contact

For questions, suggestions, or collaboration:
- GitHub: [@rajendraA108](https://github.com/rajendraA108)
- Email: [rajendra@example.com](mailto:rajendra@example.com)

---

**Made with ❤️ by Rajendra**

Last updated: June 2026
