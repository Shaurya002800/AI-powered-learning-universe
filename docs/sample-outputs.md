# Sample Outputs

## Example AI Output

```json
{
  "summary": "Discussed workspace onboarding, AI summary flow, and public sharing.",
  "actionItems": [
    "prepare final UI polish",
    "validate metrics cards before shipping"
  ],
  "suggestedTitle": "Discussed workspace onboarding AI summary flow and public"
}
```

## Example `POST /api/auth/login` Response

```json
{
  "user": {
    "id": "usr_demo",
    "name": "Peblo Demo",
    "email": "demo@peblo.app"
  }
}
```

## Example `POST /api/notes` Response

```json
{
  "note": {
    "id": "note_123",
    "title": "Sprint Planning Notes",
    "content": "Discussed onboarding flow and AI summary generation.",
    "category": "Work",
    "tags": ["planning", "ai"],
    "isArchived": false,
    "isPublic": false,
    "shareId": null,
    "aiSummary": null,
    "aiSuggestedTitle": null,
    "aiActionItems": [],
    "createdAt": "2026-05-16T12:00:00.000Z",
    "updatedAt": "2026-05-16T12:00:00.000Z"
  }
}
```

## Data Model

- `users`
- `notes`
- `tags`
- `note_tags`
- `ai_usage_events`

This structure supports authentication, note organization, public sharing, and dashboard metrics without adding unnecessary complexity for a take-home scope.
