# Contributing to LegacyChain

Thank you for your interest in contributing to LegacyChain! This document outlines the process for contributing to the project and helps you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Security Considerations](#security-considerations)

## Code of Conduct

Our project aims to foster an inclusive and respectful community. We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.10+
- Docker (for local development)
- pnpm (for frontend package management)
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/legacychain.git
   cd legacychain
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend/my-app
   pnpm install
   ```

4. Create a `.env` file based on `.env.example` for both backend and frontend.

5. Start the development servers:
   ```bash
   # Backend (in backend directory)
   flask run --debug

   # Frontend (in frontend/my-app directory)
   pnpm dev
   ```

## Branching Strategy

We follow a trunk-based development approach with short-lived feature branches:

- `main` - Production-ready code. Protected branch.
- `develop` - Integration branch for features. Protected branch.
- `feature/*` - Feature branches created from `develop`.
- `bugfix/*` - Bug fix branches created from `develop` or `main`.
- `release/*` - Release preparation branches.
- `hotfix/*` - Urgent fixes for production.

Always create new branches from `develop` unless you're fixing a critical production issue.

## Development Workflow

1. Create a new feature branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with meaningful messages:
   ```bash
   git add .
   git commit -m "feat: Add voice recording functionality"
   ```
   
   We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:
   - `feat:` - A new feature
   - `fix:` - A bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, indentation)
   - `refactor:` - Code changes that neither fix bugs nor add features
   - `perf:` - Performance improvements
   - `test:` - Adding or fixing tests
   - `chore:` - Changes to the build process or auxiliary tools

3. Push your changes to the remote repository:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Open a pull request against the `develop` branch.

## Pull Request Process

1. Fill out the PR template completely.
2. Ensure all CI checks pass.
3. Request reviews from relevant team members.
4. Address all review comments.
5. Once approved, the PR will be merged by a maintainer.

PRs must meet these requirements to be merged:
- Pass all CI checks (tests, linting, type checking)
- Have at least one approval from a code owner
- Have no unresolved comments
- Maintain or improve test coverage

## Code Style Guidelines

### Backend (Python)
- Follow [PEP 8](https://pep8.org/) style guide
- Use [Black](https://black.readthedocs.io/) for formatting
- Document all public functions and classes with docstrings
- Maximum line length of 88 characters (Black default)

### Frontend (TypeScript/React)
- Follow the project's ESLint and Prettier configuration
- Use TypeScript for all new code
- Keep components under 300 lines of code
- Follow React hooks best practices
- Use descriptive variable and function names

## Testing Requirements

- Backend: Minimum 80% test coverage
- Frontend: Minimum 70% test coverage
- Write unit tests for all new functions and components
- Include integration tests for API endpoints
- Add accessibility tests for UI components

Run tests locally before submitting PRs:
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend/my-app
pnpm test
```

## Documentation

- Document all new features, components, and API endpoints
- Update existing documentation when changing behavior
- Follow JSDoc or Python docstring standards
- Create or update ADRs for architectural decisions

## Security Considerations

- Never commit secrets or credentials
- Validate all user inputs
- Follow the principle of least privilege
- Run the security scan before submitting PRs:
  ```bash
  ./scripts/security-scan.sh
  ```
- Report security vulnerabilities to security@yourcompany.com

---

## Getting Help

If you have questions or need help, please:
- Open a discussion on GitHub
- Ask in our Slack channel (#legacychain-dev)
- Check the documentation in the `/docs` directory

Thank you for contributing to LegacyChain! 