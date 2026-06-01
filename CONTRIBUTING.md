# Contributing to DocuAsk

Thank you for your interest in contributing to DocuAsk! We welcome contributions from the community and are excited to collaborate with you.

## Getting Started

### Prerequisites
- Node.js 20+
- Git
- MongoDB Atlas account (free tier available)
- Azure account (free tier available)
- Anthropic API key

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Visit https://github.com/rajendraA108/Docuask
   # Click the "Fork" button in the top-right corner
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Docuask.git
   cd Docuask
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/rajendraA108/Docuask.git
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend (in a new terminal)
   cd docuask-frontend
   npm install
   ```

5. **Create environment files**
   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env with your credentials
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd docuask-frontend
   ng serve
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout master
git merge upstream/master

# Create a new branch for your feature
git checkout -b feature/my-amazing-feature
```

### Making Changes

1. **Write clean, readable code**
   - Follow the existing code style
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Test your changes**
   ```bash
   # Backend
   cd backend
   npm test
   
   # Frontend
   cd docuask-frontend
   ng test
   ```

3. **Commit frequently**
   ```bash
   git add .
   git commit -m "feat: Add user profile feature"
   ```

### Commit Message Guidelines

Follow the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, or tooling changes
- `perf`: Performance improvements

**Examples:**
```bash
git commit -m "feat(auth): Add JWT refresh token functionality"
git commit -m "fix(api): Resolve MongoDB connection timeout issue"
git commit -m "docs: Update API documentation"
```

### Pushing Your Changes

```bash
# Push to your fork
git push origin feature/my-amazing-feature
```

### Creating a Pull Request

1. **Go to GitHub**
   - Visit your fork: `https://github.com/YOUR-USERNAME/Docuask`
   - Click "Compare & pull request" button

2. **Fill in the PR template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Related Issue
   Fixes #(issue number)
   
   ## Testing
   How to test your changes
   
   ## Screenshots (if applicable)
   Add screenshots for UI changes
   ```

3. **Submit the PR**
   - Make sure all CI checks pass
   - Request a review from maintainers

## Code Style Guidelines

### Backend (Node.js)

```javascript
// Use const and let, avoid var
const apiKey = process.env.ANTHROPIC_API_KEY;

// Use async/await, avoid callback hell
async function getUserData(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Use meaningful function names
function validateUserEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Frontend (Angular/TypeScript)

```typescript
// Use strict TypeScript
export interface User {
  id: string;
  name: string;
  email: string;
}

// Use typed services
export class UserService {
  private users$ = new BehaviorSubject<User[]>([]);
  
  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }
}

// Use meaningful component/service names
export class UserDashboardComponent implements OnInit {
  ngOnInit(): void {
    this.loadUserData();
  }
}
```

## Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests

```bash
cd docuask-frontend
ng test
ng test --code-coverage
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments to complex functions
- Document new API endpoints
- Add examples for new features

## Reporting Issues

### Before Creating an Issue
- Search existing issues to avoid duplicates
- Check the documentation
- Try to reproduce the issue in a fresh environment

### When Creating an Issue

**Use this template:**

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node version: 20.x
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots/Logs
Add relevant screenshots or error logs
```

## Pull Request Review Process

1. **Automated Checks**
   - Code style (ESLint, Prettier)
   - Unit tests pass
   - No breaking changes

2. **Manual Review**
   - Code quality
   - Architecture
   - Documentation
   - Security

3. **Feedback & Revisions**
   - Address reviewer comments
   - Push additional commits
   - Request re-review

4. **Merging**
   - Squash commits if needed
   - Merge to master
   - Delete feature branch

## Areas for Contribution

We welcome contributions in these areas:

### High Priority
- [ ] Bug fixes and error handling
- [ ] Test coverage improvements
- [ ] Documentation enhancements
- [ ] Performance optimizations

### Medium Priority
- [ ] New features (please open an issue first)
- [ ] Refactoring existing code
- [ ] Dependency updates
- [ ] CI/CD improvements

### Low Priority
- [ ] Code style improvements
- [ ] Typo fixes
- [ ] Minor UI tweaks

## Questions?

- Check the [README](README.md)
- Review existing [Issues](https://github.com/rajendraA108/Docuask/issues)
- Start a [Discussion](https://github.com/rajendraA108/Docuask/discussions)
- Email: rajendra@example.com

---

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Provide constructive feedback
- Accept criticism gracefully
- Focus on what's best for the community

## License

By contributing to DocuAsk, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DocuAsk! 🎉
