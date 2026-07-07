/**
 * Generate a unique room ID
 */
export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let roomId = '';
  for (let i = 0; i < 5; i++) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return roomId;
}

/**
 * Parse room ID from URL hash
 */
export function getRoomIdFromHash(): string | null {
  const hash = window.location.hash.substring(1);
  return hash || null;
}

/**
 * Set room ID in URL hash
 */
export function setRoomIdInHash(roomId: string): void {
  window.location.hash = roomId;
}

/**
 * Get or create room ID
 */
export function getOrCreateRoomId(): string {
  let roomId = getRoomIdFromHash();
  if (!roomId) {
    roomId = generateRoomId();
    setRoomIdInHash(roomId);
  }
  return roomId;
}
