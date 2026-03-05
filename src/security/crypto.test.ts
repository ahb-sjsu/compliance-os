import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, isCryptoAvailable } from './crypto';

// Generate a test key directly (bypasses IndexedDB which happy-dom doesn't provide)
async function makeTestKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

describe('crypto', () => {
  describe('isCryptoAvailable', () => {
    it('returns true when SubtleCrypto exists', () => {
      expect(isCryptoAvailable()).toBe(true);
    });
  });

  describe('encrypt/decrypt round-trip', () => {
    it('encrypts and decrypts a simple string', async () => {
      const key = await makeTestKey();
      const plaintext = 'Hello, ComplianceOS!';
      const encrypted = await encrypt(plaintext, key);

      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain('.');

      const decrypted = await decrypt(encrypted, key);
      expect(decrypted).toBe(plaintext);
    });

    it('encrypts and decrypts JSON data', async () => {
      const key = await makeTestKey();
      const data = {
        vendors: [{ id: 'v1', company: 'Acme Corp', email: 'test@acme.com' }],
        settings: { orgName: 'Test Org' },
      };
      const plaintext = JSON.stringify(data);
      const encrypted = await encrypt(plaintext, key);
      const decrypted = await decrypt(encrypted, key);
      expect(JSON.parse(decrypted)).toEqual(data);
    });

    it('produces different ciphertext for same plaintext (random IV)', async () => {
      const key = await makeTestKey();
      const plaintext = 'same input';
      const enc1 = await encrypt(plaintext, key);
      const enc2 = await encrypt(plaintext, key);
      expect(enc1).not.toBe(enc2);
      expect(await decrypt(enc1, key)).toBe(plaintext);
      expect(await decrypt(enc2, key)).toBe(plaintext);
    });

    it('handles empty string', async () => {
      const key = await makeTestKey();
      const encrypted = await encrypt('', key);
      const decrypted = await decrypt(encrypted, key);
      expect(decrypted).toBe('');
    });

    it('handles unicode characters', async () => {
      const key = await makeTestKey();
      const plaintext = 'Compliance \u2014 \u00A9 2026 \uD83D\uDD12';
      const encrypted = await encrypt(plaintext, key);
      const decrypted = await decrypt(encrypted, key);
      expect(decrypted).toBe(plaintext);
    });

    it('handles large data (100KB)', async () => {
      const key = await makeTestKey();
      const plaintext = 'x'.repeat(100_000);
      const encrypted = await encrypt(plaintext, key);
      const decrypted = await decrypt(encrypted, key);
      expect(decrypted.length).toBe(100_000);
    });
  });

  describe('tamper detection', () => {
    it('throws on tampered ciphertext', async () => {
      const key = await makeTestKey();
      const encrypted = await encrypt('secret data', key);
      const tampered = encrypted.slice(0, -4) + 'XXXX';
      await expect(decrypt(tampered, key)).rejects.toThrow();
    });

    it('throws on missing dot separator', async () => {
      const key = await makeTestKey();
      await expect(decrypt('invalidpayloadwithoutdot', key)).rejects.toThrow('Invalid encrypted payload');
    });
  });

  describe('key isolation', () => {
    it('cannot decrypt with a different key', async () => {
      const key1 = await makeTestKey();
      const key2 = await makeTestKey();
      const encrypted = await encrypt('secret', key1);
      await expect(decrypt(encrypted, key2)).rejects.toThrow();
    });
  });
});
