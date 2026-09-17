# Contributing to @vingy/vue-utilities

Thank you for contributing! This monorepo uses pnpm workspaces and changesets for version management.

## Development Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests (both browser and unit tests)
pnpm test

# Run dev mode (watches for changes and rebuilds all packages)
pnpm dev

# Run the demo application
pnpm demo

# Lint and format code
pnpm oxlint
pnpm oxlint --fix
pnpm oxfmt
```

I usually run `pnpm demo` in parallel to `pnpm dev`.

## Making Changes

1. Create a branch from `main`
2. Make your changes in the relevant package under `packages/`
3. Add tests if applicable
4. Ensure code passes linting: `pnpm oxlint`
5. Run tests: `pnpm test`
6. [optional] add changeset
7. open a PR

> Please provide a description of the intended change in the PR.

> Commit messages should follow [convential commit standard](https://www.conventionalcommits.org/en/v1.0.0/)

## Versioning

This monorepo uses [semantic versioning](https://semver.org). Package versions are managed with [changesets](https://github.com/changesets/changesets) for independent package versions and changelogs.

### Creating a Changeset

After making changes, create a changeset:

```bash
pnpm changeset
```

This creates a file in `.changeset/` (e.g., `.changeset/brave-lions-enjoy.md`). Commit this file with your changes.

- **No changesets needed for:**
  - Documentation changes
  - CI/CD workflow updates
  - README changes

- **Always create changesets for:**
  - Code changes affecting the bundle
  - API additions or changes
  - Bug fixes

## Code Quality

Code quality is checked automatically in CI.

## Project Structure

- `packages/shared/` - Shared types and utilities
- `packages/vuebugger/` - Vue debugging utilities
- `packages/vueltip/` - Vue tooltip components/composables
- `packages/vuetification/` - Vue notifications
- `demo/` - Demo application for testing packages

## Questions?

See the [main README](./README.md) or open an issue for questions!
