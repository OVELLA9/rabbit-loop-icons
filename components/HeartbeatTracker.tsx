'use client'
import { useEffect } from 'react'

function getSessionId(): string {
  let id = sessionStorage.getItem('rl-presence-id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('rl-presence-id', id)
  }
  return id
}

async function sendHeartbeat() {
  try {
    await fetch('/api/heartbeat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ sessionId: getSessionId() }),
    })
  } catch {}
}

export default function HeartbeatTracker() {
  useEffect(() => {
    sendHeartbeat()
    const interval = setInterval(sendHeartbeat, 60_000)
    return () => clearInterval(interval)
  }, [])

  return null
}
