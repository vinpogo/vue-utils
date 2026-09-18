# Contributing to @vingy/vue-utilities

Thank you for contributing! This monorepo uses pnpm workspaces, and derives
versions and changelogs from the commit history with
[nimver](https://github.com/vinpogo/nimver).

## Development Setup

```bash
# Install dependencies (also wires up the commit-msg hook, see Versioning)
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
6. open a PR

> Please provide a description of the intended change in the PR.

> Commit messages **must** follow the [conventional commit standard](https://www.conventionalcommits.org/en/v1.0.0/) —
> they are the only input to versioning and the changelog. The `commit-msg` hook
> rejects anything it cannot read.

## Versioning

This monorepo uses [semantic versioning](https://semver.org). Each package is
versioned independently; `nimver` reads the commits since a package's last
release tag and works out both the next version and the changelog entry.

There are no changeset files to write. The commit message _is_ the changelog.

### Commit types

| Type                                            | Effect                    |
| ----------------------------------------------- | ------------------------- |
| `feat`                                          | minor bump                |
| `fix`, `perf`, `refactor`, `revert`             | patch bump                |
| `docs`, `style`, `chore`, `test`, `build`, `ci` | in the changelog, no bump |
| `version`, `wip`                                | not in the changelog      |

A `!` before the colon, or a `BREAKING CHANGE:` footer, is always a major bump.
Any other type is rejected by the `commit-msg` hook. The mapping lives in
[`.nimver/config.ini`](./.nimver/config.ini).

`pnpm install` installs that hook for you via a `postinstall` script, and
refreshes it on every install so it keeps pointing at the current binary. If you
ever need it back by hand:

```bash
pnpm exec nimver install-hooks --force
```

### Which package a commit belongs to

A changed file belongs to the package whose `package.json` is its nearest
ancestor, so `packages/vueltip/src/index.ts` releases `@vingy/vueltip`. Files
that belong to no package — `packages/shared/`, `demo/`, anything in the repo
root — count toward **every** package, which is how a change to the shared
types republishes the packages that inline them.

### Writing a better changelog line

By default the commit subject becomes the changelog line. A `Release-Note:`
footer overrides it when the subject is not what a consumer needs to read:

```
fix(vueltip): tighten the reference-element check

Release-Note: Tooltips no longer flicker when the reference is re-rendered.
```

### Cutting a release

```bash
pnpm exec nimver bump --dry-run   # preview versions + changelog entries
pnpm bump                         # write them, commit, and tag
git push --follow-tags            # pushing the tag publishes to npm
```

`bump` updates each affected `package.json` and `CHANGELOG.md`, makes one
`version:` commit, and tags it. Pushing the tag triggers
[`publish.yml`](./.github/workflows/publish.yml), which builds and publishes to
npm. To release a single package, pass its name:
`pnpm exec nimver bump @vingy/vueltip`.

Because versions come from history, CI needs the full history and the tags —
that is why release tooling never runs on a shallow clone.

## Code Quality

Code quality is checked automatically in CI.

## Project Structure

- `packages/shared/` - Shared types and utilities
- `packages/vuebugger/` - Vue debugging utilities
- `packages/vueltip/` - Vue tooltip components/composables
- `demo/` - Demo application for testing packages

## Questions?

See the [main README](./README.md) or open an issue for questions!
