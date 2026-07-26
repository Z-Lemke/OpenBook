# OpenBook web application

This is the local Next.js learner shell. I03 renders only validated,
declarative `CourseArtifact` fixture data: it never interprets generated HTML or
scripts and it emits learner-command intents rather than writing learning state.

Run it locally with `npm run dev --workspace @openbook/web`, then open
`http://localhost:3000`. The course fixture is available at `/`; its first lesson
is available at `/lessons/lesson-greetings-1`.

Useful checks:

- `npm run test --workspace @openbook/web`
- `npm run typecheck`
- `npm run build --workspace @openbook/web`
