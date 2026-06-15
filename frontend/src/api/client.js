const API_BASE = '/api'

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new Error(message)
  }

  return response.json()
}

async function sendJson(path, payload) {
  return fetchJson(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

async function readErrorMessage(response) {
  try {
    const body = await response.json()
    return formatApiDetail(body.detail) ?? `${response.status} ${response.statusText}`
  } catch {
    return `${response.status} ${response.statusText}`
  }
}

function formatApiDetail(detail) {
  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg ?? item.message ?? JSON.stringify(item))
      .join(' ')
  }

  return null
}

export async function fetchBoardSnapshot() {
  const [health, metadata, users, posts, comments] = await Promise.all([
    fetchJson('/health'),
    fetchJson('/metadata'),
    fetchJson('/users'),
    fetchJson('/posts'),
    fetchJson('/comments'),
  ])

  return {
    health,
    metadata,
    users,
    posts,
    comments,
  }
}

export async function createPost({ authorId, content }) {
  return sendJson('/posts', {
    author_id: authorId,
    content,
  })
}

export async function createComment({ postId, authorId, content }) {
  return sendJson('/comments', {
    post_id: postId,
    author_id: authorId,
    content,
  })
}
