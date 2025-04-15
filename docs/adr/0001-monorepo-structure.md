# ADR-0001: Monorepo Structure for LegacyChain Project

## Status

Accepted

## Date

2025-04-20

## Context

LegacyChain is being developed as a voice-first memory vault for families, with both a backend API (Flask) and frontend application (Next.js). As the project grows, we need to establish a clear organizational structure that allows for:

- Efficient collaboration between backend and frontend teams
- Sharing of types, interfaces, and utilities between codebases
- Consistent CI/CD processes
- Clear boundaries between system components
- Simplified dependency management

Current challenges include:
- Duplication of models/types between frontend and backend
- Difficulty in coordinating changes that span both backend and frontend
- Inconsistent development environment setup between team members
- Proliferation of git repositories as the project grows

## Decision

We will adopt a monorepo structure for the LegacyChain project, with the following top-level organization:

```
/
├── backend/           # Flask API application
├── frontend/          # Next.js web application
├── shared/            # Shared types, utilities, and constants
├── migrations/        # Database migration scripts
├── scripts/           # Utility scripts for development and deployment
├── tests/             # Integration and end-to-end tests
└── docs/              # Project documentation
```

The monorepo will use a combination of npm workspaces (for JavaScript/TypeScript code) and Python virtual environments (for backend code).

We will use the following tools to manage the monorepo:
- Git for version control
- GitHub Actions for CI/CD
- pnpm for JavaScript package management (with workspaces)
- Poetry for Python dependency management

## Consequences

### Positive Consequences

- **Single Source of Truth**: All code lives in one repository, making it easier to understand the state of the entire system.
- **Atomic Commits**: Changes that span backend and frontend can be committed together.
- **Simplified CI/CD**: Single pipeline for testing and deploying the entire system.
- **DRY Code**: Shared types and utilities prevent duplication between backend and frontend.
- **Consistent Tooling**: Development environment setup is standardized across the team.
- **Easier Onboarding**: New team members can get the entire system running with fewer steps.

### Negative Consequences

- **Repository Size**: As the project grows, the repository will become larger and may slow down certain Git operations.
- **Increased Build Times**: CI pipelines may take longer as they need to process the entire repository.
- **Permissions Complexity**: More complex permissions management for different parts of the codebase.
- **Learning Curve**: Developers need to learn the organization and conventions of the monorepo.

### Mitigations

- We will use Git LFS for binary assets to reduce repository size.
- CI/CD pipelines will be optimized to only build and test affected components.
- We will implement a CODEOWNERS file to manage permissions.
- Clear documentation will be provided for monorepo conventions.

## Compliance

- **Security**: Centralizes security scanning and vulnerability management.
- **GDPR**: Ensures consistent implementation of privacy features across backend and frontend.
- **Accessibility**: Enables shared component libraries with built-in accessibility features.
- **Performance**: Allows for shared performance monitoring and optimization strategies.

## Alternatives Considered

### Alternative 1: Multiple Repositories

- **Description**: Separate repositories for backend, frontend, and shared libraries.
- **Reasons for not selecting**: Introduces coordination overhead, makes atomic changes across systems difficult, and can lead to version drift between shared dependencies.

### Alternative 2: Hybrid Model with Submodules

- **Description**: Main repository with Git submodules for major components.
- **Reasons for not selecting**: Git submodules add complexity and are often difficult for developers to work with. They also don't solve the problem of coordinating changes across repositories.

## References

- [Microsoft's Monorepo Strategy](https://docs.microsoft.com/en-us/azure/devops/repos/git/monorepo-scale)
- [Google's Monorepo Approach](https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext)
- [Nx Monorepo Tools](https://nx.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces) 