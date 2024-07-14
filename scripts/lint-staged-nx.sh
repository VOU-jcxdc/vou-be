#!/bin/bash

# Get the list of staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM)

# Convert the list of staged files to a comma-separated string of relative file paths
relative_files=$(echo $staged_files | tr ' ' ',')

# Run nx affected on the affected projects
npx nx affected --target=typecheck --files=$relative_files || exit 1