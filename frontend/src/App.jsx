import { useEffect, useMemo, useState } from 'react'
import { fetchBoardSnapshot } from './api/client'
import './App.css'

const initialSnapshot = {
  health: null,
  metadata: null,
  users: [],
  posts: [],
  comments: [],
}

function App() {
  const [snapshot, setSnapshot] = useState(initialSnapshot)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadBoard() {
      try {
        setStatus('loading')
        setError(null)
        const data = await fetchBoardSnapshot()

        if (!ignore) {
          setSnapshot(data)
          setStatus('ready')
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          setStatus('error')
        }
      }
    }

    loadBoard()

    return () => {
      ignore = true
    }
  }, [])

  const usersById = useMemo(() => {
    return new Map(snapshot.users.map((user) => [user.id, user]))
  }, [snapshot.users])

  const commentsByPostId = useMemo(() => {
    return snapshot.comments.reduce((groups, comment) => {
      const group = groups.get(comment.post_id) ?? []
      group.push(comment)
      groups.set(comment.post_id, group)
      return groups
    }, new Map())
  }, [snapshot.comments])

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Full-stack training project</p>
          <h1>AI Community Board</h1>
          <p className="hero-copy">
            A read-only React explorer for the FastAPI, SQL Server, and Docker
            foundation that powers the portfolio app.
          </p>
        </div>
        <StatusPanel
          health={snapshot.health}
          metadata={snapshot.metadata}
          status={status}
        />
      </header>

      {status === 'error' && <ErrorBanner message={error} />}

      <section className="metrics" aria-label="Board snapshot">
        <Metric label="Users" value={snapshot.users.length} />
        <Metric label="Posts" value={snapshot.posts.length} />
        <Metric label="Comments" value={snapshot.comments.length} />
      </section>

      <section className="content-grid">
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">People</p>
            <h2>Seeded users</h2>
          </div>
          <UserList users={snapshot.users} status={status} />
        </section>

        <section className="panel board-panel">
          <div className="section-heading">
            <p className="eyebrow">Board</p>
            <h2>Posts and comments</h2>
          </div>
          <PostList
            commentsByPostId={commentsByPostId}
            posts={snapshot.posts}
            status={status}
            usersById={usersById}
          />
        </section>
      </section>
    </main>
  )
}

function StatusPanel({ health, metadata, status }) {
  return (
    <aside className="status-panel" aria-label="Backend status">
      <div>
        <span className={`status-dot status-${status}`}></span>
        <span>{status === 'ready' ? 'API connected' : status}</span>
      </div>
      <dl>
        <div>
          <dt>Environment</dt>
          <dd>{health?.app_env ?? 'unknown'}</dd>
        </div>
        <div>
          <dt>Database</dt>
          <dd>{metadata?.database ?? 'unknown'}</dd>
        </div>
        <div>
          <dt>Schema</dt>
          <dd>{metadata?.schema_version ?? 'pending'}</dd>
        </div>
      </dl>
    </aside>
  )
}

function ErrorBanner({ message }) {
  return (
    <section className="error-banner" role="alert">
      <strong>Frontend could not reach the API.</strong>
      <span>{message}</span>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function UserList({ users, status }) {
  if (status === 'loading') {
    return <p className="empty-state">Loading users from FastAPI...</p>
  }

  if (users.length === 0) {
    return <p className="empty-state">No users are available yet.</p>
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <div className="avatar" aria-hidden="true">
            {getInitials(user.display_name)}
          </div>
          <div>
            <strong>{user.display_name}</strong>
            <span>{user.role}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function PostList({ commentsByPostId, posts, status, usersById }) {
  if (status === 'loading') {
    return <p className="empty-state">Loading posts and comments...</p>
  }

  if (posts.length === 0) {
    return <p className="empty-state">No posts have been created yet.</p>
  }

  return (
    <div className="post-list">
      {posts.map((post) => {
        const author = usersById.get(post.author_id)
        const comments = commentsByPostId.get(post.id) ?? []

        return (
          <article className="post" key={post.id}>
            <header>
              <div>
                <p className="post-author">
                  {author?.display_name ?? `User ${post.author_id}`}
                </p>
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>
              <span>{comments.length} comments</span>
            </header>
            <p>{post.content}</p>
            <CommentList comments={comments} usersById={usersById} />
          </article>
        )
      })}
    </div>
  )
}

function CommentList({ comments, usersById }) {
  if (comments.length === 0) {
    return <p className="comment-empty">No comments yet.</p>
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => {
        const author = usersById.get(comment.author_id)

        return (
          <li key={comment.id}>
            <strong>{author?.display_name ?? `User ${comment.author_id}`}</strong>
            <span>{comment.content}</span>
          </li>
        )
      })}
    </ul>
  )
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default App
