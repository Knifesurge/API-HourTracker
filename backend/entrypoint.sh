#!/bin/sh

# Exit immediately if any step fails
set -e

echo "Waiting for PostgreSQL container to be fully ready..."

# Loop until the PostgreSQL container is ready
until pg_isready -h postgres_db -p 5432 -U postgres; do
  sleep 1
done

echo "PostgreSQL is ready! Executing clean table wipe and schema sync..."

# Run the Prisma migration to sync the schema
npm run db:rebuild

echo "Seeding database with some data..."
npm run db:seed --schema=./prisma/schema.prisma

echo "Database build sequence complete! Launching Express server..."

# Executes Docker CMD as final operational loop
exec "$@"