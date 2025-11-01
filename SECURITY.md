# Security Documentation

## Overview

This document outlines security practices, authentication methods, data handling, and security considerations for the Sargam application.

## Current Security Implementation

### File Upload Security

**Validation:**
- File type validation (client and server-side)
- File size limits (50MB maximum)
- File duration limits (5 minutes maximum)
- File extension whitelist (`.mp3`, `.wav`, `.mid`, `.midi`)

**Implementation:**
```python
# Server-side validation
if file_ext not in ['.mp3', '.wav', '.mid', '.midi']:
    raise HTTPException(status_code=400, detail="Invalid file type")

if file.size > 50 * 1024 * 1024:
    raise HTTPException(status_code=413, detail="File too large")
```

**Temporary File Handling:**
- Files stored temporarily in `uploads/` directory
- Files deleted immediately after processing
- Error handling ensures cleanup even on failures

### CORS Configuration

**Current Implementation:**
- Specific origins allowed (not wildcard)
- Credentials allowed for authenticated requests (future)
- Methods: All (`*`) - should be restricted in production

**Development:**
```python
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]
```

**Production:** Configure via environment variable:
```env
CORS_ORIGINS=https://yourdomain.com,https://staging.yourdomain.com
```

### Error Handling

**Information Disclosure Prevention:**
- Generic error messages to clients
- Detailed errors logged server-side only
- Stack traces not exposed in production

**Example:**
```python
# Don't expose internal details
raise HTTPException(status_code=500, detail="Internal server error")

# Log detailed error server-side
logger.error(f"Processing failed: {str(e)}", exc_info=True)
```

### Input Validation

**File Validation:**
- MIME type checking
- File extension validation
- File size validation
- Duration validation

**Parameter Validation:**
- Type checking (TypeScript/Pydantic)
- Range validation (sruti: 80-880 Hz)
- Format validation

## Future Security Enhancements

### Authentication & Authorization

**Planned Implementation:**

**JWT Tokens:**
- Access tokens (short-lived: 15 minutes)
- Refresh tokens (long-lived: 7 days)
- Token stored in HTTP-only cookies

**Endpoints:**
```
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

**Authorization Levels:**
- **Public**: Health check, public endpoints
- **User**: Transcription, own data access
- **Admin**: All endpoints, user management

### Rate Limiting

**Planned Limits:**
- 10 requests per minute per IP
- 100 requests per hour per IP
- 1000 requests per day per user

**Implementation:**
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/transcribe")
@limiter.limit("10/minute")
async def transcribe_audio(...):
    ...
```

### Data Encryption

**At Rest:**
- Database encryption (future)
- Encrypted file storage (future)

**In Transit:**
- HTTPS/TLS for all API communication
- HTTPS required in production

### File Security

**Virus Scanning:**
- Scan uploaded files before processing
- Quarantine suspicious files

**File Storage:**
- Encrypted storage (future)
- Access control (future)
- File retention policies

### API Security

**API Keys (Future):**
- Generate API keys for programmatic access
- Key rotation policies
- Key usage tracking

**Request Signing:**
- HMAC signature for sensitive requests
- Timestamp validation
- Nonce replay prevention

## Security Best Practices

### Code Security

**Dependencies:**
- Regularly update dependencies
- Use `pip audit` / `npm audit` to check vulnerabilities
- Pin dependency versions in production

**Secrets Management:**
- Never commit secrets to repository
- Use environment variables for secrets
- Use secret management services (AWS Secrets Manager, etc.)

**Example:**
```python
# Bad
API_KEY = "sk_live_1234567890"

# Good
API_KEY = os.getenv("API_KEY")
```

### Data Privacy

**Personal Data:**
- Minimize data collection
- Delete temporary files immediately
- Don't log personal information

**Audio Files:**
- Process and delete immediately
- No long-term storage
- No sharing of user files

### Logging Security

**What to Log:**
- Request metadata (timestamp, IP, endpoint)
- Error messages (sanitized)
- Performance metrics

**What NOT to Log:**
- API keys or secrets
- Authentication tokens
- File contents
- Personal information

**Example:**
```python
# Good
logger.info(f"File uploaded: {file.filename}, size: {file.size}")

# Bad
logger.info(f"File contents: {file_content}")
logger.info(f"API key: {api_key}")
```

### HTTPS/TLS

**Development:**
- HTTP acceptable for localhost

**Production:**
- HTTPS required
- TLS 1.2+ only
- Valid SSL certificates
- HSTS headers

### Dependency Security

**Regular Audits:**
```bash
# Python
pip audit

# Node.js
npm audit
npm audit fix
```

**Update Process:**
1. Review security advisories
2. Test updates in development
3. Update dependencies
4. Run tests
5. Deploy to staging
6. Monitor for issues
7. Deploy to production

## Security Headers

### Recommended Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### FastAPI Implementation

```python
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

## Incident Response

### Security Incident Procedure

1. **Detect**: Identify security incident
2. **Contain**: Isolate affected systems
3. **Eradicate**: Remove threat
4. **Recover**: Restore services
5. **Document**: Record incident details
6. **Review**: Post-incident review

### Contact Information

**Security Issues:**
- Email: security@yourdomain.com
- GitHub: Create security advisory
- PGP Key: (for encrypted communication)

## Compliance

### Data Protection

**GDPR Compliance (Future):**
- User data access
- Data deletion requests
- Privacy policy
- Cookie consent

**Data Retention:**
- Temporary files: Deleted immediately
- Logs: Retained for 30 days
- User data: Per user preference

## Security Testing

### Regular Testing

**Vulnerability Scanning:**
- Dependency scanning
- Static code analysis
- Penetration testing (annual)

**Tools:**
- OWASP ZAP
- Snyk
- GitHub Dependabot

### Security Checklist

**Before Deployment:**
- [ ] All dependencies updated
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Secrets in environment variables
- [ ] Error messages sanitized
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Logging configured (no secrets)
- [ ] CORS origins restricted
- [ ] File upload limits enforced

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated:** 2025-11-01  
**Version:** 1.0.0

