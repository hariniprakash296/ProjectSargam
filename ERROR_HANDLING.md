# Error Handling Guide

## Overview

This document outlines the standardized approach to error handling, logging, and error response formats across the Sargam application.

## Error Categories

### HTTP Status Codes

| Category | Code Range | Meaning | Example |
|----------|-----------|---------|---------|
| **Client Errors** | 400-499 | Request is invalid or cannot be processed | 400 Bad Request, 404 Not Found |
| **Server Errors** | 500-599 | Server failed to process request | 500 Internal Server Error, 503 Service Unavailable |
| **Success** | 200-299 | Request processed successfully | 200 OK, 201 Created |

### Error Types

#### 1. Client Errors (400-499)

**400 Bad Request**
- Invalid file format
- Missing required parameters
- Invalid parameter values

**404 Not Found**
- Endpoint doesn't exist
- Resource not found

**413 Payload Too Large**
- File exceeds size limit (50MB)

**415 Unsupported Media Type**
- File type not supported

#### 2. Server Errors (500-599)

**500 Internal Server Error**
- Audio processing failure
- Transcription algorithm error
- Unexpected exception

**503 Service Unavailable**
- Service temporarily unavailable
- Database connection failure (future)

#### 3. Business Logic Errors

**E001 - Invalid Input**
- File validation failed
- Parameter validation failed

**E002 - Processing Timeout**
- Transcription takes too long
- Audio processing timeout

**E003 - No Results**
- No swarams detected
- No raaga detected

**E004 - Audio Processing Error**
- Corrupted audio file
- Unsupported audio codec

## Error Codes & Messages

### Standardized Error Codes

| Code | Category | Message | HTTP Status |
|------|----------|---------|-------------|
| `E001` | Validation | Invalid input parameters | 400 |
| `E002` | Processing | Processing timeout | 408 |
| `E003` | Business | No results found | 200 (with empty results) |
| `E004` | Processing | Audio processing failed | 500 |
| `E005` | File | File too large | 413 |
| `E006` | File | Unsupported file type | 415 |
| `E007` | System | Internal server error | 500 |
| `E008` | System | Service unavailable | 503 |

## Response Format

### Standard Error Response

```json
{
  "error": {
    "code": "E001",
    "message": "Invalid file type. Please upload MP3, WAV, or MIDI file.",
    "details": {
      "field": "file",
      "received": "audio.ogg",
      "expected": ["mp3", "wav", "mid", "midi"]
    },
    "timestamp": "2025-11-01T17:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### FastAPI Error Response

```json
{
  "detail": "Invalid file type. Please upload MP3, WAV, or MIDI file."
}
```

**Note:** FastAPI uses `detail` field. We'll standardize to `error` object in future versions.

## Logging Standards

### Log Levels

| Level | Usage | Example |
|-------|--------|---------|
| **DEBUG** | Detailed diagnostic information | Function entry/exit, variable values |
| **INFO** | General informational messages | Request received, processing started |
| **WARNING** | Warning messages | No swarams detected, low confidence |
| **ERROR** | Error conditions | Processing failed, exception caught |
| **CRITICAL** | Critical errors | System failure, data corruption |

### Log Format

**Structured Logging:**
```python
logger.info(
    "Transcription request received",
    extra={
        "file_name": file.filename,
        "file_size": file.size,
        "content_type": file.content_type,
        "request_id": request_id
    }
)
```

**Log Output:**
```
2025-11-01 17:30:00 - INFO - Transcription request received - file_name=audio.wav file_size=7340032 content_type=audio/wav request_id=req_abc123
```

### Log Locations

**Backend Logs:**
- Development: Console output
- Production: Log files in `/var/log/sargam/` or cloud logging service

**Frontend Logs:**
- Development: Browser console
- Production: Error tracking service (Sentry, LogRocket)

### Sensitive Data

**Never log:**
- API keys or secrets
- User authentication tokens
- Full file contents
- Personal information

**Sanitize before logging:**
- File paths (remove user directories)
- Error messages (remove stack traces in production)
- Request payloads (log only metadata)

## Error Handling Implementation

### Backend Error Handling

```python
# Standard exception handling
try:
    # Process request
    result = process_audio(file_path)
except ValueError as e:
    # Client error - invalid input
    logger.warning(f"Invalid input: {str(e)}", extra={"request_id": request_id})
    raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
except Exception as e:
    # Server error - unexpected
    logger.error(f"Processing failed: {str(e)}", exc_info=True, extra={"request_id": request_id})
    raise HTTPException(status_code=500, detail="Internal server error")
```

### Frontend Error Handling

```typescript
try {
  const response = await axios.post('/api/transcribe', formData)
  // Handle success
} catch (error: any) {
  // Log error
  console.error("Transcription error:", {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status
  })
  
  // Show user-friendly message
  const errorMessage = error.response?.data?.detail || 
    "Failed to transcribe audio. Please try again."
  toast.error(errorMessage)
}
```

## Error Escalation

### Escalation Levels

| Level | Condition | Action |
|-------|-----------|--------|
| **Level 1** | Single request fails | Log error, return error response |
| **Level 2** | Multiple requests fail (>5/min) | Log warning, alert monitoring |
| **Level 3** | Service unavailable | Alert on-call engineer, create incident |
| **Level 4** | Critical system failure | Escalate to team lead, create incident report |

### Monitoring & Alerts

**Metrics to Monitor:**
- Error rate (errors per minute)
- Response time (p95, p99)
- Success rate
- File processing time

**Alert Thresholds:**
- Error rate > 10%: Warning alert
- Error rate > 25%: Critical alert
- Response time > 30s: Warning alert
- Service down: Critical alert

**Alert Channels:**
- Slack: `#sargam-alerts`
- Email: `alerts@yourdomain.com`
- PagerDuty: For critical incidents

## Versioning & Maintenance

### Adding New Error Codes

1. **Add to Error Codes Table**
   - Update this document
   - Add to error code enum (if using)

2. **Update Error Handling**
   - Add handling in backend
   - Add user messages in frontend

3. **Update Tests**
   - Add test cases for new error
   - Verify error response format

4. **Update Documentation**
   - Add to `API_REFERENCE.md`
   - Update `TROUBLESHOOTING.md` if common

### Error Code Lifecycle

- **Draft**: New error code proposed
- **Active**: Error code in use
- **Deprecated**: Error code replaced, still supported
- **Removed**: Error code no longer used

## Error Recovery

### Automatic Recovery

- **Retry Logic**: Automatic retry for transient errors (5xx)
- **Circuit Breaker**: Stop requests if service is down
- **Fallback**: Return cached results if available

### Manual Recovery

- **Health Checks**: Monitor service health
- **Rollback**: Revert to previous version if needed
- **Data Recovery**: Restore from backups if corrupted

## Best Practices

1. **Always log errors** with context (request_id, user_id, etc.)
2. **Don't expose internal details** in error messages
3. **Use appropriate HTTP status codes**
4. **Provide actionable error messages** to users
5. **Monitor error rates** and set up alerts
6. **Document all error codes** and their meanings
7. **Test error handling** in your test suite
8. **Review error logs** regularly for patterns

## Examples

### Example 1: File Validation Error

**Backend:**
```python
if file_ext not in ['.mp3', '.wav', '.mid', '.midi']:
    logger.warning(f"Invalid file type: {file_ext}", extra={"request_id": request_id})
    raise HTTPException(
        status_code=400,
        detail="Invalid file type. Please upload MP3, WAV, or MIDI file."
    )
```

**Frontend:**
```typescript
catch (error: any) {
  if (error.response?.status === 400) {
    toast.error(error.response.data.detail)
  }
}
```

### Example 2: Processing Error

**Backend:**
```python
try:
    audio_array, sample_rate = audio_processor.process_audio(str(file_path))
except Exception as e:
    logger.error(f"Audio processing failed: {str(e)}", exc_info=True, extra={"request_id": request_id})
    raise HTTPException(
        status_code=500,
        detail="Failed to process audio file. Please try again."
    )
```

## References

- [FastAPI Error Handling](https://fastapi.tiangolo.com/tutorial/handling-errors/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Logging Best Practices](https://www.loggly.com/ultimate-guide/python-logging-basics/)

