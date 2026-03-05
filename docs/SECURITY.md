# Security Architecture

ComplianceOS is designed to meet the data protection requirements of the compliance frameworks it tracks: CJIS, FedRAMP, StateRAMP, and CISA CPG.

## Encryption at Rest

All vendor data is encrypted before storage using **AES-256-GCM** via the Web Crypto API (SubtleCrypto).

| Requirement | Standard | Implementation |
|---|---|---|
| CJIS SP 5.10.1.2 | AES 256-bit encryption at rest | AES-256-GCM via Web Crypto API |
| FedRAMP SC-28 | Protection of information at rest | All data encrypted before localStorage/Drive write |
| FedRAMP SC-13 | FIPS-validated cryptography | Web Crypto API uses browser's FIPS 140-2 validated module |
| CISA CPG 3.1 | Strong encryption for sensitive data | AES-256-GCM with random IV per operation |

### How it works

1. On first use, a **256-bit AES-GCM key** is generated via `crypto.subtle.generateKey()`
2. The key is stored in **IndexedDB** as a **non-exportable CryptoKey** object
   - Cannot be read as raw bytes via JavaScript (extractable: false)
   - Protects against XSS key exfiltration
3. Every save operation encrypts data with a **fresh random 12-byte IV**
   - Same plaintext produces different ciphertext each time
   - Prevents ciphertext analysis
4. Stored format: `base64url(IV).base64url(ciphertext+authTag)`
5. GCM authentication tag detects any tampering with ciphertext

### Storage providers

- **localStorage**: Encrypted ciphertext stored under `complianceos_v2_enc` key
- **Google Drive**: Encrypted ciphertext uploaded as `complianceos-data.enc`
- **Legacy migration**: Unencrypted data from previous versions is automatically encrypted on first load

## Content Security Policy

A strict CSP is set via `<meta>` tag in `index.html`:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
connect-src https://www.googleapis.com https://oauth2.googleapis.com https://accounts.google.com;
img-src 'self' data: https://*.googleusercontent.com;
frame-src https://accounts.google.com;
```

This prevents:
- XSS via injected scripts (script-src 'self')
- Data exfiltration to unauthorized domains (connect-src whitelist)
- Clickjacking via unauthorized framing (frame-src whitelist)

## Authentication Security

### Token Management
- OAuth access tokens are stored **in React state only** (never persisted to storage)
- Token expiry is tracked and enforced (tokens auto-expire, checked every 30 seconds)
- On sign-out, tokens are **revoked** at Google's OAuth endpoint (`oauth2.googleapis.com/revoke`)
- Expired tokens are automatically cleared from state

### OAuth Scopes
- `openid email profile` — user identification only
- `drive.appdata` — hidden app-only folder; **zero access** to user's personal Drive files

## Cryptographic Identifiers

All entity IDs (vendors, documents, tasks) use `crypto.randomUUID()` (UUID v4) instead of sequential timestamps. This prevents:
- ID enumeration attacks
- Predictable resource references
- Timing-based information leakage

## Referrer Policy

`strict-origin-when-cross-origin` prevents URL leakage to third-party domains.

## Audit Logging

All mutations are logged with timestamp, actor, action, and entity type. Audit entries are stored alongside vendor data (encrypted at rest).

**Production recommendation**: Store audit logs with WORM (Write Once Read Many) protection and implement retention policies per your applicable compliance framework.

## Known Limitations

These are architectural limitations of a client-side SPA without a backend:

| Limitation | Mitigation | Production Fix |
|---|---|---|
| RBAC is client-side only | Acceptable for single-user; demo role bar clearly labeled | Server-enforced RBAC |
| No server-side session management | Token-based auth with expiry tracking | Backend session store |
| Encryption key in IndexedDB | Non-exportable key; XSS can use but not extract | HSM/KMS key management |
| No rate limiting on API calls | Debounced saves (2s) | Backend proxy with rate limits |
| Audit log stored with data | Encrypted; tamper-detected via GCM | Immutable log store (WORM) |

## Dependency Audit

All runtime dependencies use permissive (MIT) licenses:
- `react` / `react-dom` — MIT
- `@react-oauth/google` — MIT

No dependencies with known CVEs at time of release. Run `npm audit` to check.

## Reporting Security Issues

Report security vulnerabilities via GitHub Issues (private security advisories) or email compliance-os@example.com.
