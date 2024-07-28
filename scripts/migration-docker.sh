#!/bin/bash 
echo "Starting migration" 
 
# Rename the .env.build file to .env in *-service directories, overriding any existing .env file 
build_envs=($(find . -type f -name ".env.build" -path "*/apps/*-service/*")) 
 
# Echo all paths to the .env.build files 
for build_env in "${build_envs[@]}"; do 
    echo "Renaming $build_env to ${build_env/.build/}" 
    mv -f "$build_env" "${build_env/.build/}" 
done 
 
# Find all typeorm.config.ts files matching the pattern and store them in an array 
configs=($(find . -type f -name "typeorm.config.ts" -path "*/apps/*-service/*")) 
 
# Iterate over the array and run the migration command for each config 
migration_validation=true 
for config in "${configs[@]}"; do 
    # Check if the migration is valid 
    if ! npx typeorm-ts-node-commonjs migration:run -d "$config"; then 
        migration_validation=false 
    fi 
done 
 
# Notfiy the user that the migration is complete 
if [ "$migration_validation" = false ]; then 
    echo "Migration failed" 
    exit 1 
fi 
echo "Migration complete"