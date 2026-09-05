#!/usr/bin/env bash
# Applies the schema migration to the real Supabase database, using the
# credentials in .env (gitignored). Run from the project root:
#
#   bash scripts/db-apply.sh
#
# Requires psql (macOS: `brew install libpq` then follow its PATH hint,
# or use the Supabase Dashboard SQL Editor instead — paste the contents
# of supabase/migrations/001_init.sql and Run).
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env not found in project root (it's gitignored — see docs/db.md)." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; source .env; set +a

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "ERROR: SUPABASE_DB_URL not set in .env" >&2
  exit 1
fi

echo "Applying supabase/migrations/001_init.sql ..."
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/001_init.sql
echo "Done. Verify with: psql \"\$SUPABASE_DB_URL\" -c '\\dt'"
