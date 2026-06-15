# AI Community Board Frontend

React frontend for the full-stack training project.

## Development

Use the root README for the standard local start, stop, and reset workflow. The launcher is the supported path because this frontend expects the backend API and local database setup to be available.

The Vite development server proxies browser requests from `/api/*` to the FastAPI backend. In Docker Compose, the proxy target is `http://backend:8000`.
