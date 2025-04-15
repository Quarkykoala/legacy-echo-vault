# LegacyChain: Voice-First Memory Vault

LegacyChain is a secure, emotionally resonant memory vault for families. It allows users to preserve voice messages, memories, and personal reflections in a secure, intergenerational space that serves as a time capsule of human experience.

## 🎯 Project Vision

LegacyChain provides a platform where ancestral wisdom, family love, and personal stories can be captured and passed on through voice recordings, timelines, and intentional memory threading. It's where your descendants can hear not just your words, but your soul.

## 📋 Core Features

- **Family Vaults**: Create and manage private memory collections
- **Voice/Text Recording**: Capture memories up to 5 minutes in length
- **Time Capsules**: Set memories to unlock at future dates (up to 100 years)
- **Family Tree UI**: Visual exploration of memories through family connections
- **Responsive Design**: Works across mobile and desktop with a beautiful UI

## 🏗️ Project Structure

LegacyChain is a monorepo containing both backend and frontend code:

```
/
├── backend/           # Flask API application
├── frontend/          # Next.js web application
├── shared/            # Shared types, utilities, and constants
├── migrations/        # Database migration scripts
├── scripts/           # Utility scripts for development and deployment
├── tests/             # Integration and end-to-end tests
└── docs/              # Project documentation and ADRs
```

## 🛠️ Technology Stack

### Backend
- Flask (Python 3.10+)
- SQLAlchemy
- JWT Authentication
- Structured Logging (structlog)
- Error Tracking (Sentry)

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- Shadcn/UI
- React Hook Form + Zod
- Supabase Storage (for voice recordings)

### Infrastructure
- GitHub Actions for CI/CD
- Supabase for storage and authentication
- Vercel for frontend hosting
- Docker for containerization

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.10+
- pnpm (for frontend package management)
- Docker (optional, for local development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/legacychain.git
   cd legacychain
   ```

2. Set up the backend
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend
   ```bash
   cd frontend/my-app
   pnpm install
   ```

4. Create a `.env` file based on `.env.example`

5. Start the development servers
   ```bash
   # Terminal 1 - Backend (in backend directory)
   flask run --debug

   # Terminal 2 - Frontend (in frontend/my-app directory)
   pnpm dev
   ```

6. Open your browser to http://localhost:3000

## 🧪 Testing

- Backend: `pytest` (from backend directory)
- Frontend: `pnpm test` (from frontend/my-app directory)

## 🔄 Development Workflow

Please refer to our [Contributing Guide](CONTRIBUTING.md) for details on our development process, branching strategy, and pull request workflow.

## 📚 Documentation

- Architecture Decision Records (ADRs) are in the [docs/adr](docs/adr) directory
- API documentation is available at http://localhost:5000/api/docs when running locally
- Technical specifications can be found in [docs/](docs/)

## 🔒 Security

Security is a top priority for LegacyChain. We follow best practices for:
- Data encryption (in transit and at rest)
- Authentication and authorization
- Input validation and sanitization
- GDPR compliance

To report a security vulnerability, please contact security@yourcompany.com.

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distributing, or use of this software is strictly prohibited.

## 👥 Team

- Product Owner: [Name]
- Tech Lead: [Name]
- Backend Team: [Names]
- Frontend Team: [Names]
- Design: [Names]

---

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md) to get started.
