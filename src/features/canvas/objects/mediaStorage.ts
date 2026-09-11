/**
 * Native IndexedDB media storage engine (Phase 5.6).
 *
 * Persists image binary data (Data URLs) in IndexedDB so that the canvas
 * project metadata stored in localStorage remains lightweight (a few KB)
 * and never exceeds browser storage quotas (typically ~5MB).
 *
 * Zero external dependencies — uses native browser IndexedDB API.
 */

const DB_NAME = 'kcs-media-db'
const DB_VERSION = 1
const STORE_NAME = 'media'

export interface PersistedMediaRecord {
  assetId: string
  dataUrl: string
  mimeType: string
  createdAt: string
}

let dbPromise: Promise<IDBDatabase | null> | null = null

function getDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'assetId' })
        }
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.warn('Failed to open IndexedDB for media storage.')
        resolve(null)
      }
    } catch {
      resolve(null)
    }
  })

  return dbPromise
}

/** Save or update a media record in IndexedDB. */
export async function saveMediaRecord(record: PersistedMediaRecord): Promise<void> {
  const db = await getDb()
  if (!db) return

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.put(record)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    } catch (err) {
      reject(err)
    }
  })
}

/** Retrieve a media record by its unique assetId. */
export async function getMediaRecord(assetId: string): Promise<PersistedMediaRecord | null> {
  const db = await getDb()
  if (!db) return null

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(assetId)

      request.onsuccess = () => {
        resolve((request.result as PersistedMediaRecord) ?? null)
      }
      request.onerror = () => {
        resolve(null)
      }
    } catch {
      resolve(null)
    }
  })
}

/** Delete a media record by assetId. */
export async function deleteMediaRecord(assetId: string): Promise<void> {
  const db = await getDb()
  if (!db) return

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.delete(assetId)

      request.onsuccess = () => resolve()
      request.onerror = () => resolve()
    } catch {
      resolve()
    }
  })
}

/** Prune any media records not referenced by any active document. */
export async function pruneUnusedMedia(usedAssetIds: Set<string>): Promise<void> {
  const db = await getDb()
  if (!db) return

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      request.onsuccess = () => {
        const keys = request.result as string[]
        for (const key of keys) {
          if (!usedAssetIds.has(key)) {
            store.delete(key)
          }
        }
        resolve()
      }
      request.onerror = () => resolve()
    } catch {
      resolve()
    }
  })
}
