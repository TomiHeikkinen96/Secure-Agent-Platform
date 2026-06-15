const API_BASE = '/api'

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new Error(message)
  }

  return response.json()
}

async function readErrorMessage(response) {
  try {
    const body = await response.json()
    return body.detail ?? `${response.status} ${response.statusText}`
  } catch {
    return `${response.status} ${response.statusText}`
  }
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
