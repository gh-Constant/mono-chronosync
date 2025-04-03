# Contributing Guidelines

Thank you for your interest in contributing to ChronoSync! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

There are many ways to contribute to ChronoSync:

1. **Reporting Bugs**: Report bugs by creating issues in the GitHub repository
2. **Suggesting Enhancements**: Suggest new features or improvements
3. **Code Contributions**: Submit pull requests with bug fixes or new features
4. **Documentation**: Improve or add documentation
5. **Testing**: Write tests or manually test features
6. **Design**: Contribute to UI/UX design
7. **Feedback**: Provide feedback on features and usability

## Getting Started

### Prerequisites

Before you begin, ensure you have met all the [prerequisites](../getting-started/prerequisites.md) for the project.

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/chronosync.git
   cd chronosync
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/original-owner/chronosync.git
   ```
4. Follow the [installation instructions](../getting-started/installation.md) to set up your development environment

## Development Workflow

### Branching Strategy

We follow a simplified Git flow:

- `main`: The main branch containing production-ready code
- `feature/*`: Feature branches for new features or enhancements
- `bugfix/*`: Bugfix branches for bug fixes
- `docs/*`: Documentation branches for documentation changes
- `refactor/*`: Refactoring branches for code refactoring

### Creating a Branch

Create a new branch for your contribution:

```bash
# For a new feature
git checkout -b feature/your-feature-name

# For a bug fix
git checkout -b bugfix/issue-description

# For documentation
git checkout -b docs/what-you-are-documenting

# For refactoring
git checkout -b refactor/what-you-are-refactoring
```

### Making Changes

1. Make your changes in your branch
2. Follow the [code style guidelines](./code-style.md)
3. Write or update tests as necessary
4. Ensure all tests pass:
   ```bash
   pnpm test
   ```
5. Update documentation if needed

### Committing Changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(auth): add Google OAuth integration
fix(api): correct response status code for invalid requests
docs(readme): update installation instructions
```

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin your-branch-name
   ```

2. Create a pull request from your branch to the main repository's `main` branch

3. In your pull request description:
   - Describe the changes you've made
   - Reference any related issues using GitHub keywords (e.g., "Fixes #123")
   - Mention any breaking changes
   - Include screenshots or GIFs for UI changes if applicable

4. Wait for a maintainer to review your pull request

### Pull Request Review Process

1. A maintainer will review your pull request
2. They may request changes or ask questions
3. Address any requested changes and push them to your branch
4. Once approved, a maintainer will merge your pull request

## Reporting Bugs

When reporting bugs, please include:

1. A clear, descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Your environment (OS, browser, etc.)
7. Any additional context

## Suggesting Enhancements

When suggesting enhancements, please include:

1. A clear, descriptive title
2. A detailed description of the proposed enhancement
3. The motivation behind the enhancement
4. Any alternative solutions you've considered
5. Any additional context or screenshots

## Documentation Guidelines

When contributing to documentation:

1. Use clear, concise language
2. Follow Markdown best practices
3. Include code examples where appropriate
4. Update the table of contents if necessary
5. Check for spelling and grammar errors

## Testing Guidelines

When writing tests:

1. Write tests for all new features
2. Ensure existing tests pass with your changes
3. Follow the testing patterns used in the project
4. Include both unit and integration tests where appropriate

## Additional Resources

- [Code Style Guide](./code-style.md)
- [Pull Request Process](./pull-request-process.md)
- [Development Workflow](../workflow/development.md)
- [Git Workflow](../workflow/git-workflow.md)

Thank you for contributing to ChronoSync!
