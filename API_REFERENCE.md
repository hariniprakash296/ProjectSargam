# API Reference

## Base URL

**Development:** `http://localhost:8000`  
**Staging:** `https://staging-api.yourdomain.com`  
**Production:** `https://api.yourdomain.com`

## Authentication

Currently, the API does not require authentication. Future versions will use JWT tokens.

**Future Authentication:**
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Health Check

#### `GET /api/health`

Check if the API is running and services are ready.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "audio_processor": "ready",
    "transcriber": "ready",
    "raaga_detector": "ready",
    "lyrics_extractor": "ready"
  }
}
```

**Status Codes:**
- `200 OK` - API is healthy
- `500 Internal Server Error` - Service unavailable

---

### Transcribe Audio

#### `POST /api/transcribe`

Transcribe an audio file (MP3, WAV, MIDI) to Carnatic swaram notation.

**Request:**

**Content-Type:** `multipart/form-data`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | Audio file (MP3, WAV, or MIDI). Max 50MB, 5 minutes |
| `sruti` | Float | No | Tonic frequency (Sa) in Hz. Default: 131.0 |

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/transcribe" \
  -F "file=@audio.wav" \
  -F "sruti=131.0"
```

**Response:**

**Success (`200 OK`):**
```json
{
  "swarams": [
    {
      "start": 0.0,
      "end": 0.5,
      "swaram": "Sa",
      "octave": "Madhya",
      "gamakam": "kampitam",
      "confidence": 0.95
    },
    {
      "start": 0.5,
      "end": 1.0,
      "swaram": "Ri2",
      "octave": "Madhya",
      "gamakam": null,
      "confidence": 0.88
    }
  ],
  "raaga": {
    "name": "Mayamalavagowla",
    "type": "Carnatic",
    "confidence": 0.85,
    "arohana": ["Sa", "Ri1", "Ga3", "Ma1", "Pa", "Da1", "Ni3", "Sa"],
    "avarohana": ["Sa", "Ni3", "Da1", "Pa", "Ma1", "Ga3", "Ri1", "Sa"],
    "characteristics": "A fundamental raaga used for teaching..."
  },
  "lyrics": null
}
```

**Response Fields:**

**swarams** (Array of objects):
- `start` (float): Start time in seconds
- `end` (float): End time in seconds
- `swaram` (string): Swaram name (Sa, Ri1, Ri2, Ga2, Ga3, Ma1, Ma2, Pa, Da1, Da2, Ni2, Ni3)
- `octave` (string): Octave classification ("Mandra", "Madhya", "Tara")
- `gamakam` (string|null): Ornamentation type ("kampitam", "janta", or null)
- `confidence` (float): Detection confidence (0.0 to 1.0)

**raaga** (object|null):
- `name` (string): Detected raaga name
- `type` (string): "Carnatic" or "Hindustani"
- `confidence` (float): Detection confidence (0.0 to 1.0)
- `arohana` (array): Ascending scale swarams
- `avarohana` (array): Descending scale swarams
- `characteristics` (string): Raaga description

**lyrics** (array|null):
- Currently returns `null` (placeholder for future implementation)
- Future: Array of `{text: string, start: float, end: float}`

**Status Codes:**

| Code | Description |
|------|-------------|
| `200 OK` | Transcription successful |
| `400 Bad Request` | Invalid file type or parameters |
| `413 Payload Too Large` | File exceeds size limit |
| `500 Internal Server Error` | Processing failed |

**Error Response:**
```json
{
  "detail": "Transcription failed: <error message>"
}
```

**Error Messages:**

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid file type` | File is not MP3, WAV, or MIDI | Use supported audio format |
| `File size exceeds limit` | File > 50MB | Reduce file size |
| `Audio duration exceeds maximum` | Audio > 5 minutes | Trim audio to 5 minutes |
| `Failed to process audio` | Audio file is corrupted | Verify audio file integrity |
| `No swarams detected` | Audio contains no detectable pitch | Check if audio has vocals/instruments |

---

## Rate Limiting

Currently, no rate limiting is implemented. Future versions will include:
- 10 requests per minute per IP
- 100 requests per hour per IP

**Rate Limit Headers (Future):**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1609459200
```

---

## Response Times

**Expected Response Times:**
- Health check: < 100ms
- Transcription (30s audio): 5-15 seconds
- Transcription (5min audio): 30-60 seconds

**Timeout:**
- Client timeout: 5 minutes (300 seconds)
- Server timeout: 5 minutes

---

## CORS

The API supports CORS for the following origins:
- Development: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`
- Configure via `CORS_ORIGINS` environment variable

---

## Webhooks (Future)

Future feature for async transcription:
- `POST /api/transcribe/async` - Submit transcription job
- `GET /api/transcribe/status/:jobId` - Check job status
- Webhook callback when transcription completes

---

## Versioning

**Current Version:** `1.0.0`

**Versioning Strategy:**
- Major version: Breaking changes
- Minor version: New features, backward compatible
- Patch version: Bug fixes, backward compatible

**Version Header:**
```
API-Version: 1.0.0
```

---

## SDKs (Future)

Future SDKs for:
- JavaScript/TypeScript
- Python
- Java

---

## Support

For API issues:
- Check `TROUBLESHOOTING.md`
- Open GitHub issue
- Email: support@yourdomain.com

