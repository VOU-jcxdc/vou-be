#!/bin/bash 
echo "Copying env"

env_path=".env"

# Check if .env file exists
if [ ! -f "$env_path" ]; then
    echo "No .env file found"
    exit 1
fi

# Find all *-serivce in apps folder
services=($(find apps -type d -name "*-service"))

# Check variable
env_validation=true

# Iterate over the array and copy the .env file to each service (force overwrite)
for service in "${services[@]}"; do
    if ! cp -f "$env_path" "$service/.env.build"; then
        env_validation=false
    fi
done

# Copy env to ./docker
if ! cp -f "$env_path" "./docker"; then
    env_validation=false
fi

# Check env validation
if [ "$env_validation" = false ]; then 
    echo "Copy env failed" 
    exit 1 
fi 
echo "Copy env complete"