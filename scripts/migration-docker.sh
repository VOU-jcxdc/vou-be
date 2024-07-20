#!/bin/bash
echo "Starting migration"

# Find all typeorm.config.ts files matching the pattern and store them in an array
configs=($(find . -type f -name "typeorm.config.ts" -path "*/apps/*/*"))

# Iterate over the array and run the migration command for each config
for config in "${configs[@]}"; do
    npx typeorm-ts-node-commonjs migration:run -d "$config"
done

# Notfiy the user that the migration is complete
echo "Migration complete"