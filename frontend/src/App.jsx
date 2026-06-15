import { useCallback, useEffect, useMemo, useState } from 'react'
import { createComment, createPost, fetchBoardSnapshot } from './api/client'
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
  const [selectedUserId, setSelectedUserId] = useState(null)

  const loadBoard = useCallback(async (options = {}) => {
    const { ignoreResult = () => false } = options

    try {
      const data = await fetchBoardSnapshot()

      if (ignoreResult()) {
        return
      }

      setSnapshot(data)
      setError(null)
      setStatus('ready')
    } catch (err) {
      if (ignoreResult()) {
        return
      }

      setError(err.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    let ignore = false

    fetchBoardSnapshot()
      .then((data) => {
        if (ignore) {
          return
        }

        setSnapshot(data)
        setError(null)
        setStatus('ready')
      })
      .catch((err) => {
        if (ignore) {
          return
        }

        setError(err.message)
        setStatus('error')
      })

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

  const selectedUserExists =
    selectedUserId !== null && usersById.has(selectedUserId)
  const activeUserId = selectedUserExists
    ? selectedUserId
    : (snapshot.users[0]?.id ?? null)
  const selectedUser = usersById.get(activeUserId)
  const canWrite = status === 'ready' && activeUserId !== null

  async function handleCreatePost(content) {
    if (activeUserId === null) {
      throw new Error('Select a seeded user before creating a post.')
    }

    await createPost({
      authorId: activeUserId,
      content,
    })
    await loadBoard()
  }

  async function handleCreateComment(postId, content) {
    if (activeUserId === null) {
      throw new Error('Select a seeded user before creating a comment.')
    }

    await createComment({
      postId,
      authorId: activeUserId,
      content,
    })
    await loadBoard()
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Full-stack training project</p>
          <h1>AI Community Board</h1>
          <p className="hero-copy">
            An interactive React board for creating posts and comments through
            the FastAPI and SQL Server foundation.
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
        <section className="panel people-panel">
          <div className="section-heading">
            <p className="eyebrow">People</p>
            <h2>Seeded users</h2>
          </div>
          <UserSelector
            selectedUserId={activeUserId}
            status={status}
            users={snapshot.users}
            onSelect={setSelectedUserId}
          />
          <UserList
            selectedUserId={activeUserId}
            status={status}
            users={snapshot.users}
          />
        </section>

        <section className="panel board-panel">
          <div className="section-heading">
            <p className="eyebrow">Board</p>
            <h2>Posts and comments</h2>
          </div>
          <CreatePostForm
            disabled={!canWrite}
            selectedUser={selectedUser}
            onCreate={handleCreatePost}
          />
          <PostList
            commentsByPostId={commentsByPostId}
            disabled={!canWrite}
            posts={snapshot.posts}
            selectedUser={selectedUser}
            status={status}
            usersById={usersById}
            onCreateComment={handleCreateComment}
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

function UserSelector({ selectedUserId, status, users, onSelect }) {
  const disabled = status !== 'ready' || users.length === 0

  return (
    <label className="field user-selector">
      <span>Acting as</span>
      <select
        disabled={disabled}
        value={selectedUserId ?? ''}
        onChange={(event) => onSelect(Number(event.target.value))}
      >
        {users.length === 0 && <option value="">No users available</option>}
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.display_name}
          </option>
        ))}
      </select>
    </label>
  )
}

function UserList({ selectedUserId, users, status }) {
  if (status === 'loading') {
    return <p className="empty-state">Loading users from FastAPI...</p>
  }

  if (users.length === 0) {
    return <p className="empty-state">No users are available yet.</p>
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li
          className={user.id === selectedUserId ? 'selected-user' : undefined}
          key={user.id}
        >
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

function CreatePostForm({ disabled, selectedUser, onCreate }) {
  const [content, setContent] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [error, setError] = useState(null)
  const isSubmitting = submitStatus === 'submitting'

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedContent = content.trim()
    if (trimmedContent.length === 0) {
      setError('Post content is required.')
      return
    }

    try {
      setSubmitStatus('submitting')
      setError(null)
      await onCreate(trimmedContent)
      setContent('')
      setSubmitStatus('idle')
    } catch (err) {
      setError(err.message)
      setSubmitStatus('idle')
    }
  }

  return (
    <form className="write-form create-post-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>New post</span>
        <textarea
          disabled={disabled || isSubmitting}
          maxLength={2000}
          placeholder={
            selectedUser
              ? `Post as ${selectedUser.display_name}`
              : 'Select a seeded user first'
          }
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      <FormFooter
        characterCount={content.length}
        disabled={disabled || isSubmitting}
        error={error}
        limit={2000}
        submitLabel={isSubmitting ? 'Posting...' : 'Post'}
      />
    </form>
  )
}

function PostList({
  commentsByPostId,
  disabled,
  posts,
  selectedUser,
  status,
  usersById,
  onCreateComment,
}) {
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
          <PostCard
            author={author}
            comments={comments}
            disabled={disabled}
            key={post.id}
            post={post}
            selectedUser={selectedUser}
            usersById={usersById}
            onCreateComment={onCreateComment}
          />
        )
      })}
    </div>
  )
}

function PostCard({
  author,
  comments,
  disabled,
  post,
  selectedUser,
  usersById,
  onCreateComment,
}) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false)

  return (
    <article className="post">
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
      <div className="comment-actions">
        <button
          className="secondary-button"
          disabled={disabled}
          type="button"
          onClick={() => setIsCommentFormOpen((isOpen) => !isOpen)}
        >
          {isCommentFormOpen ? 'Cancel' : 'Add comment'}
        </button>
      </div>
      {isCommentFormOpen && (
        <CreateCommentForm
          disabled={disabled}
          postId={post.id}
          selectedUser={selectedUser}
          onCreate={async (postId, content) => {
            await onCreateComment(postId, content)
            setIsCommentFormOpen(false)
          }}
        />
      )}
    </article>
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

function CreateCommentForm({ disabled, postId, selectedUser, onCreate }) {
  const [content, setContent] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [error, setError] = useState(null)
  const isSubmitting = submitStatus === 'submitting'

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedContent = content.trim()
    if (trimmedContent.length === 0) {
      setError('Comment content is required.')
      return
    }

    try {
      setSubmitStatus('submitting')
      setError(null)
      await onCreate(postId, trimmedContent)
      setContent('')
      setSubmitStatus('idle')
    } catch (err) {
      setError(err.message)
      setSubmitStatus('idle')
    }
  }

  return (
    <form className="write-form comment-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>New comment</span>
        <textarea
          disabled={disabled || isSubmitting}
          maxLength={1000}
          placeholder={
            selectedUser
              ? `Comment as ${selectedUser.display_name}`
              : 'Select a seeded user first'
          }
          rows={2}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      <FormFooter
        characterCount={content.length}
        disabled={disabled || isSubmitting}
        error={error}
        limit={1000}
        submitLabel={isSubmitting ? 'Saving...' : 'Comment'}
      />
    </form>
  )
}

function FormFooter({ characterCount, disabled, error, limit, submitLabel }) {
  return (
    <div className="form-footer">
      <span className="character-count">
        {characterCount}/{limit}
      </span>
      <button disabled={disabled} type="submit">
        {submitLabel}
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
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
