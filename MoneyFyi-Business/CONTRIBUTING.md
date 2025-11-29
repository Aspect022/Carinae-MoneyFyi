# Contributing to MoneyFyi

First off, thank you for considering contributing to MoneyFyi! It's people like you that make MoneyFyi such a great tool for Indian SMEs.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots** if applicable
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to MoneyFyi users
- **List any similar features** in other applications if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if you're changing functionality
5. **Write clear commit messages**
6. **Create a pull request** with a clear description of your changes

## Development Setup

1. Fork and clone the repository
   ```bash
   git clone https://github.com/your-username/moneyfyi.git
   cd moneyfyi/Frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials

4. Run the development server
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new files
- Follow the existing code style (we use ESLint)
- Use functional components with hooks for React
- Keep components small and focused on a single responsibility
- Use meaningful variable and function names
- Add comments for complex logic

### Example:

```typescript
// Good
const calculateTotalRevenue = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

// Avoid
const calc = (t: any[]) => t.reduce((s, x) => s + x.a, 0);
```

### Component Structure

```typescript
// Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Types
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// Component
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // State
  const [isLoading, setIsLoading] = useState(false);
  
  // Handlers
  const handleClick = () => {
    setIsLoading(true);
    onSubmit();
  };
  
  // Render
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={isLoading}>
        Submit
      </Button>
    </div>
  );
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme and design system
- Ensure mobile responsiveness
- Test in both light and dark modes

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

#### Examples:

```
feat: Add cashflow forecasting chart to dashboard
fix: Resolve transaction filter bug on mobile
docs: Update setup instructions for Windows users
style: Format code according to ESLint rules
refactor: Extract alert logic into separate hook
test: Add unit tests for transaction parser
```

### Commit Message Prefixes

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

## Testing

- Write unit tests for utility functions
- Test components with different props and states
- Ensure your changes don't break existing functionality
- Run tests before submitting PR:
  ```bash
  npm run test
  npm run lint
  ```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update TypeScript interfaces if you change data structures
- Document environment variables in SETUP.md

## Project Structure Guidelines

```
Frontend/
├── app/                    # Next.js pages
│   ├── (route)/           # Route groups
│   └── page.tsx           # Page components
├── components/            # Reusable components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── [feature]/        # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── api/              # API clients
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript types
└── public/                # Static assets
```

## Feature Development Workflow

1. **Create an issue** describing the feature
2. **Get feedback** from maintainers
3. **Fork and create a branch** (`feature/your-feature-name`)
4. **Implement the feature** following our guidelines
5. **Write tests** for your feature
6. **Update documentation**
7. **Submit a pull request**

## Review Process

1. Maintainers will review your PR within 2-3 business days
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release!

## Getting Help

- Check existing [Issues](https://github.com/yourusername/moneyfyi/issues)
- Ask questions in [Discussions](https://github.com/yourusername/moneyfyi/discussions)
- Join our community channels (coming soon)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Our website (coming soon)

## License

By contributing to MoneyFyi, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MoneyFyi! 🙏

Together, we're helping Indian SMEs detect financial problems before they hurt their business. 🇮🇳
