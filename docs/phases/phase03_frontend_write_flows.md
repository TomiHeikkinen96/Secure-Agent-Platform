# Phase 03 - Frontend Write Flows

## Summary

Make the React frontend interactive without adding real authentication yet.

This phase keeps authentication deliberately simple by using a seeded-user selector as a development stand-in for login. The frontend can now create posts and comments through the existing FastAPI endpoints, then refresh the board snapshot from the backend.

## What Changed

- Added frontend API helpers for `POST /api/posts` and `POST /api/comments`.
- Added a seeded-user selector so write requests can include an `author_id`.
- Added a create-post form above the board feed.
- Added create-comment forms under each post, hidden behind an `Add comment` toggle until needed.
- Added client-side empty-content validation, character counts, disabled states, and API error display.
- Kept the backend and database schema unchanged because the required write endpoints already existed.
- Updated `AGENTS.md` so agents keep frontend dependency installation containerized through Docker Compose instead of using host-local `npm install`.
- Added `dev-start.cmd`, `dev-build.cmd`, `dev-clean.cmd`, and `dev-fresh.cmd` wrappers for the common local lifecycle.
- Added `-RunChecks` and `-ChecksOnly` support to the local launcher so frontend dependency, lint, and build checks can run through the standard Docker workflow.

## Commands I Ran

```powershell
docker compose config --services
```

Expected services were present:

```text
db
backend
frontend
```

Container verification command for the human-in-the-loop pass:

```powershell
.\dev-build.cmd
```

Observed result:

```text
npm run lint passed
npm run build passed
```

## What I Learned

- A controlled input stores form text in React state and updates that state on every edit.
- A submit handler usually calls `event.preventDefault()` so the browser does not reload the page.
- The browser sends JSON to FastAPI by using `fetch` with `method: 'POST'`, a `Content-Type: application/json` header, and a serialized request body.
- The seeded-user selector supplies `author_id` so the form payload matches the existing API schema.
- After a successful write, the simplest correct state strategy is to reload the board snapshot from the backend.
- FastAPI validation errors can come back as structured JSON, so the API client should turn those responses into readable frontend messages.

## Good To Know

- The seeded-user selector is not security. It only supplies an author id for local development.
- Frontend validation improves user experience, but backend validation is still the source of truth.
- Refresh-after-write is easy to reason about because the backend remains the authority for ordering, IDs, and timestamps.
- Optimistic UI updates can feel faster, but they add rollback complexity and are not needed yet.
- The React app calls the backend over HTTP even though both projects live in the same repository.
- Frontend dependencies should be installed in the Compose `frontend` container and stored in the `frontend-node-modules` Docker volume.
- Local posts and comments are stored in the `sqlserver-data` Docker volume, so they persist when containers are stopped and recreated.
- A fresh review run is intentionally destructive: `dev-fresh.cmd` deletes local Docker volumes, runs checks, and starts from seeded data.

## Portfolio Talking Points

- The frontend now performs both read and write API calls against a FastAPI backend.
- The implementation uses controlled React forms for predictable form state.
- API errors and validation errors are surfaced in the UI instead of failing silently.
- The phase focuses on write flows instead of identity plumbing.
- The app keeps Docker Compose as the reproducible local development baseline.

## Quiz

### Conceptual

1. What makes a React form input "controlled"?
2. Why does a form submit handler call `event.preventDefault()`?
3. Why is a seeded-user selector acceptable in this phase but not acceptable as real authentication?
4. What is the difference between frontend validation and backend validation?

### Architecture

1. Why does the frontend send `author_id` in this phase?
2. Why does the frontend call `/api/posts` instead of connecting directly to SQL Server?
3. What does the Vite proxy do when the browser sends a POST request to `/api/comments`?
4. Why is refresh-after-write a good first state strategy for this app?

### Implementation

1. Which file contains the frontend API helper functions?
2. Which React state value stores the currently selected seeded user?
3. How does the create-post form prevent empty posts before calling the API?
4. How are FastAPI error responses converted into messages the UI can display?
5. What backend fields are required when creating a comment?

### Operations

1. Which command starts the normal local development stack?
2. Where are frontend dependencies installed during the normal Compose workflow?
3. Which command runs the containerized frontend lint and production build checks?
4. What should you check first if the frontend cannot reach `/api/posts`?
