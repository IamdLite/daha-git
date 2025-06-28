#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  sleep 2
done

echo "Checking if database needs initialization..."
if [ -z "$(psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_database WHERE datname='$POSTGRES_DB'")" ]; then
  echo "Creating database..."
  psql -U "$POSTGRES_USER" -c "CREATE DATABASE $POSTGRES_DB;"
fi

TABLE_COUNT=$(psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT count(*) FROM pg_tables WHERE schemaname='public'")
if [ "$TABLE_COUNT" -eq 0 ]; then
  echo "Restoring database from backup..."
  for f in /docker-entrypoint-initdb.d/sql/*.sql; do
    echo "Executing $f"
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
  done
  echo "Restore complete!"
else
  echo "Database already contains $TABLE_COUNT tables - skipping restore"
fi