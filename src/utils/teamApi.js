const API_BASE = import.meta.env.VITE_API_BASE

export async function fetchTeamPublic() {
  try {
    const res = await fetch(`${API_BASE}/team`)
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch (error) {
    console.warn('Team API unavailable:', error.message)
    return null
  }
}

export async function fetchTeamAdmin() {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}/team/admin`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to fetch team')
  }
  return await res.json()
}

export async function createTeamMember(payload) {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to create team member')
  return data
}

export async function updateTeamMember(id, payload) {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to update team member')
  return data
}

export async function deleteTeamMember(id) {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}/team/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to delete team member')
  return data
}

