const API_BASE = import.meta.env.VITE_API_BASE
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE

function normalizeMediaUrl(url) {
  if (!url) return url
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${SERVER_BASE}${url}`
  return url
}

function normalizeProperty(p) {
  const property = { ...p, id: p._id || p.id }
  
  if (property.image) property.image = normalizeMediaUrl(property.image)
  if (property.video) property.video = normalizeMediaUrl(property.video)
  if (property.floorPlan) property.floorPlan = normalizeMediaUrl(property.floorPlan)
  if (property.gallery) property.gallery = property.gallery.map(normalizeMediaUrl)
  if (property.agent && property.agent.photo) {
    property.agent.photo = normalizeMediaUrl(property.agent.photo)
  }
  
  return property
}

function normalizeArea(a) {
  const area = { ...a, id: a._id || a.id }
  if (area.image) area.image = normalizeMediaUrl(area.image)
  if (area.heroImage) area.heroImage = normalizeMediaUrl(area.heroImage)
  if (Array.isArray(area.locationImages)) {
    area.locationImages = area.locationImages.map(normalizeMediaUrl).filter(Boolean)
  }
  return area
}
export async function fetchProperties(params = {}) {
  try {
    const query = new URLSearchParams()
    if (params.featured) query.set('featured', 'true')
    if (params.search) query.set('search', params.search)
    if (params.type) query.set('type', params.type)
    if (params.location) query.set('location', params.location)
    if (params.sort) query.set('sort', params.sort)

    const url = `${API_BASE}/properties${query.toString() ? '?' + query.toString() : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    // Normalize _id to id for frontend compatibility and map upload paths to absolute URLs
    return data.map(normalizeProperty)
  } catch (error) {
    console.warn('API unavailable, using static data:', error.message)
    return null // Return null to signal fallback needed
  }
}

export async function fetchPropertyById(id) {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`)
    if (!res.ok) throw new Error('Not found')
    const data = await res.json()
    return normalizeProperty(data)
  } catch (error) {
    console.warn('API unavailable:', error.message)
    return null
  }
}

export async function fetchAreas() {
  try {
    const res = await fetch(`${API_BASE}/areas`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data.map(normalizeArea)
  } catch (error) {
    console.warn('API unavailable:', error.message)
    return null
  }
}

export async function fetchAreaBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/areas/${slug}`)
    if (!res.ok) throw new Error('Not found')
    const data = await res.json()
    return normalizeArea(data)
  } catch (error) {
    console.warn('API unavailable:', error.message)
    return null
  }
}

export async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`)
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch (error) {
    console.warn('API unavailable:', error.message)
    return null
  }
}

/** Admin only — includes SMTP app password for editing. */
export async function fetchAdminSettings() {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}/settings/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to load settings')
  }
  return await res.json()
}

export async function updateSettings(settings) {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update settings')
  }
  return await res.json()
}

export async function sendChatMessage(message, history = []) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    })
    if (!res.ok) throw new Error('Chat API error')
    return await res.json()
  } catch (error) {
    console.warn('Chat API error:', error.message)
    return { reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", properties: [], leadCollected: false }
  }
}
