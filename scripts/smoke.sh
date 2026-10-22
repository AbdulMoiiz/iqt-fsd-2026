#!/usr/bin/env bash
set -euo pipefail

base="http://localhost:${APP_PORT:-8080}/api/tasks"
created="$(curl -fsS -X POST "$base" -H 'Content-Type: application/json' -d '{"data":{"title":"Smoke test task"}}')"
id="$(jq -r '.data.id' <<< "$created")"
test "$id" != "null"
test "$(jq -r '.data.title' <<< "$created")" = "Smoke test task"

updated="$(curl -fsS -X PATCH "$base/$id" -H 'Content-Type: application/json' -d '{"data":{"completed":true}}')"
test "$(jq -r '.data.completed' <<< "$updated")" = "true"

invalid_status="$(curl -sS -o /tmp/iqt-invalid.json -w '%{http_code}' -X PATCH "$base/$id" -H 'Content-Type: application/json' -d '{"data":{}}')"
test "$invalid_status" = "400"
test "$(jq -r '.error.code' /tmp/iqt-invalid.json)" = "INVALID_UPDATE"

blank_status="$(curl -sS -o /tmp/iqt-blank.json -w '%{http_code}' -X POST "$base" -H 'Content-Type: application/json' -d '{"data":{"title":"   "}}')"
test "$blank_status" = "400"
test "$(jq -r '.error.code' /tmp/iqt-blank.json)" = "VALIDATION_ERROR"

docker compose restart db backend >/dev/null
docker compose up -d --wait >/dev/null
test "$(curl -fsS "$base" | jq --argjson id "$id" '.data[] | select(.id == $id) | .completed')" = "true"

delete_status="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE "$base/$id")"
test "$delete_status" = "204"
missing_status="$(curl -sS -o /tmp/iqt-missing.json -w '%{http_code}' -X DELETE "$base/$id")"
test "$missing_status" = "404"
test "$(jq -r '.error.code' /tmp/iqt-missing.json)" = "TASK_NOT_FOUND"

echo "Task API and persistence checks passed"
