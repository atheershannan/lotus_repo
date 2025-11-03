### Microservices Endpoints and Data Contracts (EN)

This document defines the communication contracts between the Backend API (gateway) and each corporate microservice. It complements `API_ENDPOINTS_SPECIFICATION.md` by detailing the per-service endpoints and the fields expected from each service.

---

## General Conventions

- Authentication: JWT in `Authorization: Bearer <token>` and optional `X-Corporate-ID`
- Content-Type: `application/json`
- Idempotency-Key: optional header for POST where retries may occur
- Pagination: `page`, `page_size`; responses include `total`, `page`, `page_size`
- Timestamps: ISO-8601 UTC (e.g., `2025-01-01T12:00:00Z`)
- Error model:
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

---

## 1) Course Builder Service

Purpose: Authoring and managing courses, modules, and lessons.

- Base URL: `/ms/course-builder`

Endpoints:
- GET `/courses`
  - Query: `page`, `page_size`, `search`, `updated_since`
  - Response fields per course:
    - `id`, `title`, `description`, `category`, `level`, `tags[]`
    - `status` (draft|published|archived)
    - `estimated_duration_min`
    - `skills_covered[]: { skill_id, name, level }`
    - `prerequisites[]`
    - `created_by`, `created_at`, `updated_at`
- GET `/courses/{id}`
  - Response:
    - All fields above, plus `modules[]: { id, title, order, lessons_count }`
    - `metadata` (JSON)
- GET `/courses/{id}/modules`
  - Response: `modules[]: { id, title, order, lessons[]: { id, title, order } }`
- POST `/sync`
  - Body: `{ since?: string, full?: boolean }`
  - Response: `{ sync_id, started_at, estimated_duration, status }`

---

## 2) Skills Engine Service

Purpose: Master data for skills, taxonomy, levels, relationships.

- Base URL: `/ms/skills-engine`

Endpoints:
- GET `/skills`
  - Query: `page`, `page_size`, `search`, `category`, `level`
  - Item fields: `id`, `name`, `description`, `category`, `level`, `aliases[]`, `created_at`, `updated_at`
- GET `/skills/{id}`
  - Response adds:
    - `relationships: { related_skills[], prerequisites[], supersedes[] }`
    - `learning_objectives[]`
- GET `/skills/{id}/graph`
  - Response: nodes/edges for visualization: `{ nodes[], edges[] }`

---

## 3) Content Studio Service

Purpose: Rich learning content repository (articles, videos, docs) with metadata and embeddings-ready payloads.

- Base URL: `/ms/content-studio`

Endpoints:
- GET `/contents`
  - Query: `page`, `page_size`, `type`, `skill_id`, `updated_since`
  - Item fields:
    - `id`, `title`, `content_type` (article|video|tutorial|reference|assessment)
    - `summary`, `language`, `source_service`
    - `skills_covered[]`, `estimated_duration_min`
    - `metadata` (JSON), `created_at`, `updated_at`
- GET `/contents/{id}`
  - Response adds:
    - `content` (plain text or structured blocks)
    - `attachments[] { id, name, content_type, url }`
- POST `/export`
  - Body: `{ ids?: string[], since?: string }`
  - Response: `{ export_id, items: [ { id, title, normalized_text, metadata } ] }`

---

## 4) Assessment Service

Purpose: Assessments, quizzes, grading, and results.

- Base URL: `/ms/assessment`

Endpoints:
- GET `/assessments`
  - Query: `page`, `page_size`, `skill_id`, `status`
  - Item fields: `id`, `title`, `skill_id`, `difficulty`, `status`, `questions_count`, `estimated_duration_min`, `created_at`, `updated_at`
- GET `/assessments/{id}`
  - Response adds: `questions[] { id, type, prompt, choices?, answer_schema }`
- POST `/attempts`
  - Body: `{ assessment_id, user_id, start_time? }`
  - Response: `{ attempt_id, status: started, started_at }`
- POST `/attempts/{attempt_id}/answers`
  - Body: `{ answers: [ { question_id, value } ] }`
  - Response: `{ status: submitted|in_progress, saved_at }`
- POST `/attempts/{attempt_id}/grade`
  - Response: `{ score, passed, breakdown: [ { question_id, correct, score } ] }`

---

## 5) DevLab Service

Purpose: Hands-on labs, coding tasks, sandbox telemetry.

- Base URL: `/ms/devlab`

Endpoints:
- GET `/labs`
  - Item fields: `id`, `title`, `skill_id`, `difficulty`, `estimated_duration_min`, `requirements[]`, `created_at`, `updated_at`
- GET `/labs/{id}`
  - Response adds: `steps[] { id, title, instructions, hints[] }`, `environment { image, resources }`
- POST `/labs/{id}/sessions`
  - Body: `{ user_id }`
  - Response: `{ session_id, status: active, started_at, url }`
- GET `/sessions/{session_id}/telemetry`
  - Response: `{ events: [ { ts, type, payload } ] }`

---

## 6) Marketplace Service

Purpose: External content/catalog integrations and purchases (free/entitled).

- Base URL: `/ms/marketplace`

Endpoints:
- GET `/catalog`
  - Query: `page`, `page_size`, `provider`, `skill_id`
  - Item fields: `id`, `provider`, `title`, `type`, `price`, `currency`, `url`, `skills_covered[]`, `rating`, `metadata`
- POST `/catalog/sync`
  - Body: `{ provider, since?: string, full?: boolean }`
  - Response: `{ sync_id, status, updated, created, removed }`

---

## 7) Learner AI Service

Purpose: Personalized recommendations and learning path generation.

- Base URL: `/ms/learner-ai`

Endpoints:
- POST `/recommendations`
  - Body: `{ user_id, context?: { goals?, skills_gap?, recent_activity? } }`
  - Response: `{ items: [ { id, type: content|skill|lab|assessment, reason, confidence, metadata } ] }`
- GET `/paths`
  - Query: `user_id`
  - Response: `{ paths: [ { id, title, steps: [ { type, ref_id, title } ] } ] }`

---

## 8) Learning Analytics Service

Purpose: Analytics on learning, engagement, and outcomes.

- Base URL: `/ms/learning-analytics`

Endpoints:
- GET `/overview`
  - Query: `user_id`, `since?`, `until?`
  - Response: `{ totals: { time_spent_min, contents_viewed, assessments_taken, labs_completed }, trends: [ { date, value, metric } ] }`
- GET `/skill-progress`
  - Query: `user_id`, `skill_id`
  - Response: `{ skill_id, progress_percent, last_activity_at, recommendations[] }`

---

## 9) Corporate Tools (Slack/Teams/Email) Interfaces

Purpose: Messaging and notifications pipelines.

- Base URL: `/ms/corp-tools`

Endpoints:
- POST `/slack/send`
  - Body: `{ channel, text, attachments?[] }`
  - Response: `{ message_id, timestamp }`
- POST `/teams/send`
  - Body: `{ conversation_id, text, cards?[] }`
  - Response: `{ activity_id, timestamp }`
- POST `/email/send`
  - Body: `{ to[], subject, body_text, body_html?, attachments?[] }`
  - Response: `{ message_id, queued: boolean }`

---

## 10) Integration Control (Status, Sync, Health)

Base URL: `/api/integrations/microservices`

- GET `/status`
  - Response: `{ microservices: [ { name, status, last_sync, data_count, response_time_ms, error_rate } ], overall_status, last_full_sync }`
- POST `/sync`
  - Body: `{ microservices?: string[], force_full_sync?: boolean }`
  - Response: `{ sync_id, status, estimated_duration, progress { completed, total, percentage } }`
- GET `/sync/{sync_id}`
  - Response: `{ sync_id, status, started_at, finished_at?, progress, errors?[] }`

---

## Minimal Field Maps for Backend Ingestion

These are the minimal normalized fields the Backend expects from each service (used for Prisma models and vectorization):

- Course Builder → Learning Content:
  - `id`, `title`, `description`, `content_type` = "course", `skills_covered[]`, `estimated_duration_min`, `prerequisites[]`, `learning_objectives[]`, `metadata`, `created_by`, `created_at`, `updated_at`
- Skills Engine → Skills:
  - `id`, `name`, `description`, `category`, `level`, `prerequisites[]`, `learning_objectives[]`, `aliases[]`, `updated_at`
- Content Studio → Learning Content (articles, videos, etc.):
  - `id`, `title`, `content_type`, `summary`, `content` (normalized_text), `skills_covered[]`, `estimated_duration_min`, `metadata`, `language`, `source_service`, `created_at`, `updated_at`
- Assessment → Assessments and Results:
  - Assessment: `id`, `title`, `skill_id`, `difficulty`, `questions_count`, `estimated_duration_min`, `updated_at`
  - Result: `attempt_id`, `assessment_id`, `user_id`, `score`, `passed`, `breakdown[]`, `submitted_at`
- DevLab → Labs and Telemetry:
  - Lab: `id`, `title`, `skill_id`, `difficulty`, `requirements[]`, `estimated_duration_min`, `updated_at`
  - Telemetry: `{ session_id, ts, type, payload }`
- Marketplace → External Content:
  - `id`, `provider`, `title`, `type`, `url`, `price`, `currency`, `skills_covered[]`, `rating`, `metadata`, `updated_at`
- Learner AI → Recommendations:
  - `id`, `type`, `target_id`, `target_type`, `reason`, `confidence`, `metadata`, `generated_at`
- Learning Analytics → Aggregates:
  - `user_id`, `metric_name`, `metric_value`, `metric_data`, `period_start`, `period_end`, `updated_at`

---

## Security & Rate Limits

- Per-service OAuth/JWT if required by provider; signed webhook secrets for callbacks.
- Rate limiting suggestions: 60 RPM per user for read, 10 RPM for write endpoints; burst tokens for sync ops.
- Retries with exponential backoff for 5xx and network errors; no retry on 4xx except 429 with `Retry-After`.

---

## Webhooks (Optional)

Inbound webhook receiver at `/api/integrations/webhooks/{service}` expects:
```json
{
  "event": "string",
  "idempotency_key": "string",
  "occurred_at": "2025-01-01T00:00:00Z",
  "payload": {}
}
```
Headers: `X-Signature` (HMAC), `X-Service-Name`.

---

## OpenAPI

Each microservice SHOULD expose an OpenAPI 3.0 spec at `/openapi.json` for contract verification and client generation.


