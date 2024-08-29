#!/bin/bash

# Find and remove all *.spec.ts files in all subdirectories
find . -type f -name "*.spec.ts" -exec rm -f {} \;

echo "All *.spec.ts files have been removed from all subdirectories."