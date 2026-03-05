/**
 * AES-256-GCM encryption for data at rest.
 *
 * Uses Web Crypto API (SubtleCrypto) which provides FIPS 140-2 validated
 * cryptography in modern browsers. Satisfies:
 * - CJIS SP 5.10.1.2 (encryption at rest)
 * - FedRAMP SC-28 / SC-13 (FIPS-validated crypto)
 * - CISA CPG 3.1 (strong encryption)
 *
 * Key is stored in IndexedDB as a non-exportable CryptoKey object.
 * This prevents extraction via XSS (attacker can use the key to encrypt/decrypt
 * but cannot exfiltrate the raw key material).
 */

const DB_NAME = 'complianceos_keystore';
const DB_VERSION = 1;
const STORE_NAME = 'keys';
const KEY_ID = 'master';

function openKeyDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function storeKey(key: CryptoKey): Promise<void> {
  const db = await openKeyDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(key, KEY_ID);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadKey(): Promise<CryptoKey | null> {
  const db = await openKeyDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(KEY_ID);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

/** Get or create the master encryption key. */
export async function getMasterKey(): Promise<CryptoKey> {
  let key = await loadKey();
  if (!key) {
    key = await generateKey();
    await storeKey(key);
  }
  return key;
}

/**
 * Encrypt plaintext to a string format: base64(iv).base64(ciphertext)
 * Uses AES-256-GCM with a random 12-byte IV per operation.
 */
export async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return b64(new Uint8Array(iv)) + '.' + b64(new Uint8Array(ciphertext));
}

/**
 * Decrypt from the format produced by encrypt().
 */
export async function decrypt(payload: string, key: CryptoKey): Promise<string> {
  const dotIdx = payload.indexOf('.');
  if (dotIdx === -1) throw new Error('Invalid encrypted payload');
  const iv = unb64(payload.slice(0, dotIdx));
  const ciphertext = unb64(payload.slice(dotIdx + 1));
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

/** Check if the Web Crypto API is available. */
export function isCryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}

// --- Base64 helpers (URL-safe, no padding) ---

function b64(buf: Uint8Array): string {
  let s = '';
  for (const byte of buf) s += String.fromCharCode(byte);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64(s: string): Uint8Array<ArrayBuffer> {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const buf = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return view;
}
