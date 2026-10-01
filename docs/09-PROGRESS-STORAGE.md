# Progress Storage

## Constraint

V1 is frontend only. Persistence uses browser `localStorage`.

No account. No backend. No cloud sync.

## Storage Key

Use a versioned key, e.g.:

```
kyvon-hardware-lab:progress:v1
```

## Schema

Persist a typed document:

```ts
ProgressDocument {
  version: 1
  updatedAt: string // ISO timestamp
  lessons: Record<LessonId, LessonProgress>
  experiments: Record<ExperimentId, ExperimentProgress>
  projects: Record<ProjectId, ProjectProgress>
  quizzes: Record<QuizId, QuizProgress>
  bookmarks: Bookmark[]
  recentlyViewedComponents: ComponentId[]
  lastActivityAt: string
}
```

Statuses:

```
NOT_STARTED | IN_PROGRESS | COMPLETED
```

## Rules

1. Never write unvalidated data.
2. Validate imported JSON before replacing storage.
3. Reject unknown schema versions unless a migration exists.
4. Fail soft on corrupt storage — reset to empty with a user-visible notice.
5. Keep writes debounced where high-frequency updates occur.

## Import / Export

Provide:

- Export progress as JSON download
- Import progress from JSON file

Import must:

- parse JSON
- validate shape and value ranges
- confirm overwrite when existing progress exists
- write only after validation succeeds

## Privacy

All learning history stays on the user's device.

Do not transmit progress data.
