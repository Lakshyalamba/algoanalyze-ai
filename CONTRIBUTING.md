# Contributing to AlgoAnalyze AI

Thank you for your interest in contributing to AlgoAnalyze AI.

## Contribution Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Run the relevant build checks:

```bash
cd client
npm run build

cd ../server
npm run build
```

5. Commit your changes with a clear message.
6. Push your branch.
7. Create a pull request with a short description of the change.

## Guidelines

- Keep changes focused and easy to review.
- Do not commit `.env` files or secrets.
- Follow the existing TypeScript and project structure.
- Update documentation when behavior, setup, or deployment steps change.
