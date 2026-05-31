#!/bin/sh

# Exit immediately if any step fails
set -e

echo "Waiting for PostgreSQL container to be fully ready..."

# Loop until the PostgreSQL container is ready
until npx prisma db validate --schema=./prisma/schema.prisma > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready! Executing clean table wipe and schema sync..."

# Run the Prisma migration to sync the schema
npx prisma migrate reset --force --schema=./prisma/schema.prisma

echo "Database build sequence complete! Launching Express server..."

# Executes Docker CMD as final operational loop
exec "$@"