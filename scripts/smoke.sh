#!/usr/bin/env bash
set -euo pipefail
trap 'echo "Smoke check failed at line $LINENO" >&2' ERR

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

invalid_id_status="$(curl -sS -o /tmp/iqt-invalid-id.json -w '%{http_code}' -X DELETE "$base/not-a-number")"
printf 'Invalid ID response: %s %s\n' "$invalid_id_status" "$(cat /tmp/iqt-invalid-id.json)"
test "$invalid_id_status" = "400"
test "$(jq -r '.error.code' /tmp/iqt-invalid-id.json)" = "INVALID_PATH"

media_status="$(curl -sS -o /tmp/iqt-media.json -w '%{http_code}' -X POST "$base" -d '{"data":{"title":"Wrong media type"}}')"
printf 'Unsupported media response: %s %s\n' "$media_status" "$(cat /tmp/iqt-media.json)"
test "$media_status" = "415"
test "$(jq -r '.error.code' /tmp/iqt-media.json)" = "UNSUPPORTED_MEDIA_TYPE"

docker compose restart db backend >/dev/null
docker compose up -d --wait >/dev/null
test "$(curl -fsS "$base" | jq --argjson id "$id" '.data[] | select(.id == $id) | .completed')" = "true"

delete_status="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE "$base/$id")"
test "$delete_status" = "204"
missing_status="$(curl -sS -o /tmp/iqt-missing.json -w '%{http_code}' -X DELETE "$base/$id")"
test "$missing_status" = "404"
test "$(jq -r '.error.code' /tmp/iqt-missing.json)" = "TASK_NOT_FOUND"

echo "Task API and persistence checks passed"
