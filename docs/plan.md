# Azure AI Community Board

## Goal

Build a small Azure-hosted social application that demonstrates:

* Full-stack development
* Authentication
* Authorization
* Azure cloud services
* Containerization
* AI integration
* RAG
* Monitoring
* Scalability concepts
* Kubernetes basics

The application is intentionally simple.

The goal is not business complexity.

The goal is learning Azure and understanding how modern AI applications are built.

---

# High-Level Architecture

Frontend:

* React

Backend:

* FastAPI

Database:

* Azure SQL

Authentication:

* Microsoft Entra ID

AI:

* Azure AI Foundry

RAG:

* Azure AI Search (later)

Monitoring:

* Azure Monitor
* Application Insights

Secrets:

* Azure Key Vault

Containerization:

* Docker

Orchestration:

* Kubernetes (final phase)

Source Control:

* GitHub

---

# Application Features

## Users

Users can:

* Login with Microsoft account
* View profile
* View other users

Stored information:

* Name
* Email
* Avatar
* Role

Roles:

* User
* Admin

---

## Community Feed

Every authenticated user can:

* Create post
* Like post
* Comment on post

Think:

Tiny Teams channel

Tiny Facebook feed

Tiny Reddit thread

---

## AI Button

Every post contains:

"Ask AI"

Examples:

* Summarize discussion
* Roast the author
* Generate a positive comment
* Generate a snarky comment

The response should be intentionally short.

Goal:

Learn AI Foundry API integration.

---

## RAG Feature

User clicks:

"Analyze Author"

Backend retrieves:

* Author profile
* Previous posts
* Previous comments

Prompt:

"Based on this user's activity, generate a humorous observation."

This teaches:

* Retrieval
* Context injection
* Prompt engineering

without requiring a large document system.

---

## Admin Dashboard

Admin can view:

* Total users
* Total posts
* Total comments
* AI requests
* Failed AI requests

Simple charts optional.

---

# Phase 0 – Local Development Setup

Goal:

No local installation outside Docker.

Everything runs in containers.

Repository:

/frontend
/backend
/database
/docker

Setup:

docker-compose up

Services:

* React
* FastAPI
* SQL Server container

Learning:

* Docker
* Networking
* Environment variables

Deliverable:

Entire application runs with one command.

---

# Phase 1 – Backend Foundation

Build FastAPI backend.

Learn:

* Routing
* Dependency injection
* Pydantic
* SQLAlchemy

Create:

POST /posts

GET /posts

POST /comments

GET /comments

GET /users

Deliverable:

Swagger UI works.

Database stores data.

---

# Phase 2 – React Frontend

Build:

* Login screen placeholder
* Feed page
* Post form
* Comments

No authentication yet.

Learning:

* React
* Components
* State management
* API calls

Deliverable:

Working feed.

---

# Phase 3 – Authentication

Add Microsoft Entra ID.

Learn:

* OAuth
* OpenID Connect
* Access tokens
* ID tokens

Backend:

Validate tokens.

Frontend:

Require login.

Store user information.

Deliverable:

User can sign in using Microsoft account.

---

# Phase 4 – Authorization

Create roles.

User:

* Create posts

Admin:

* View metrics

Learn:

* Claims
* Role checks
* Authorization policies

Deliverable:

Admin page hidden from normal users.

---

# Phase 5 – Azure Deployment

Deploy:

Frontend:

* Azure App Service

Backend:

* Azure App Service

Database:

* Azure SQL

Learning:

* Resource groups
* App services
* Networking
* Configuration

Deliverable:

Application accessible publicly.

---

# Phase 6 – Azure Key Vault

Move secrets:

* Database password
* AI keys

Learning:

* Secret management
* Managed identities

Deliverable:

No secrets stored in code.

---

# Phase 7 – AI Foundry

Create Foundry project.

Add:

POST /ai/comment

Prompt examples:

"Create a humorous reply."

"Create a positive reply."

"Summarize this discussion."

Learning:

* Azure AI Foundry
* Model deployment
* Prompting
* Cost awareness

Deliverable:

AI-generated comments.

---

# Phase 8 – RAG

Create retrieval flow.

Retrieve:

* User profile
* User posts
* User comments

Build prompt:

Context:
[retrieved information]

Question:
"What funny observation can you make?"

Learning:

* Retrieval
* Context windows
* Grounding

Deliverable:

Basic social-media RAG.

---

# Phase 9 – Rate Limiting

Implement:

5 requests per minute

Examples:

AI endpoints

Post creation endpoints

Learning:

* Abuse prevention
* API protection
* HTTP 429

Deliverable:

Rate limit visible and testable.

---

# Phase 10 – Monitoring

Add:

Application Insights

Track:

* Requests
* Errors
* AI calls
* AI failures

Learning:

* Observability
* Production diagnostics

Deliverable:

Metrics visible in Azure.

---

# Phase 11 – Basic Security Review

Review:

* OWASP Top 10
* Authentication flow
* SQL injection
* Secrets handling

Test:

* Invalid JWT
* Missing roles
* Rate-limit bypass attempts

Deliverable:

Security notes document.

---

# Phase 12 – Kubernetes

Only after everything works.

Deploy application to AKS.

Learn:

* Pods
* Deployments
* Services
* Ingress

Do NOT redesign application.

Simply migrate.

Learning goal:

Understand Kubernetes deployment model.

Not become a Kubernetes expert.

Deliverable:

Application running on AKS.

---

# Interview Talking Points

Authentication:

* OAuth
* Entra ID
* Token validation

Backend:

* FastAPI
* SQLAlchemy
* REST APIs

Cloud:

* Azure SQL
* App Service
* Key Vault
* Application Insights

AI:

* Azure AI Foundry
* Prompt engineering
* RAG

Security:

* Authorization
* Secret management
* Rate limiting

Containers:

* Docker
* Docker Compose

Scalability:

* Stateless backend
* Horizontal scaling
* AKS migration path

Monitoring:

* Application Insights
* Logging
* Metrics

---

# Success Criteria

If completed, I should be able to explain:

* How OAuth works
* How Azure authentication works
* How Docker containers communicate
* How APIs connect to databases
* How Azure SQL differs from local SQL
* How AI Foundry APIs are called
* How RAG works in production
* How rate limiting protects APIs
* How secrets should be stored
* Why Kubernetes exists
* How cloud applications scale