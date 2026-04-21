# Branching Strategy

## Branches

- `main` -> stable production-ready code
- `dev` -> integration branch for combined team work
- `feature/<module-name>` -> individual feature branches

## Recommended Flow

1. Pull the latest `dev`
2. Create a feature branch from `dev`
3. Commit changes frequently with clear messages
4. Open a pull request into `dev`
5. Merge tested changes into `main` when stable
