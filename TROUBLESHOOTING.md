# Troubleshooting Guide

## Common Issues

### CORS Errors

**Symptom:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/transcribe' from origin 'http://localhost:3002' 
has been blocked by CORS policy
```

**Cause:** Backend not configured to allow requests from the frontend origin.

**Solution:**
1. Check backend CORS configuration in `backend/main.py`
2. Ensure your frontend port (3000, 3001, or 3002) is in allowed origins
3. Restart backend server after changing CORS settings
4. Check backend logs for CORS configuration message

**Verification:**
```bash
# Check backend logs for:
INFO - CORS configured for origins: ['http://localhost:3000', 'http://localhost:3001', ...]
```

**Prevention:** Use environment variable `CORS_ORIGINS` for flexible configuration.

---

### Audio File Upload Fails

**Symptom:**
- File upload button doesn't work
- Error: "Invalid file type" or "File too large"

**Causes & Solutions:**

**Invalid File Type:**
- **Cause:** File is not MP3, WAV, or MIDI
- **Solution:** Convert file to supported format using FFmpeg or audio converter

**File Too Large:**
- **Cause:** File exceeds 50MB limit
- **Solution:** 
  - Compress audio file
  - Trim audio to shorter duration
  - Split file into smaller segments

**File Duration Too Long:**
- **Cause:** Audio exceeds 5 minutes
- **Solution:** Trim audio to 5 minutes or less

**Prevention:** Client-side validation before upload.

---

### Transcription Returns Empty Results

**Symptom:**
- API call succeeds but `swarams` array is empty

**Causes & Solutions:**

**Silence or Noise:**
- **Cause:** Audio contains no detectable pitch
- **Solution:** 
  - Ensure audio contains vocals or melodic instruments
  - Check audio quality and volume levels
  - Try different audio file

**Audio Quality Issues:**
- **Cause:** Low quality audio, distortion, or heavy compression
- **Solution:**
  - Use higher quality audio (WAV format recommended)
  - Ensure sufficient bitrate (minimum 128kbps)
  - Remove background noise

**Pitch Detection Failure:**
- **Cause:** Audio outside pitch detection range (C2-C7)
- **Solution:** 
  - Use audio with pitch in vocal range (80Hz-880Hz)
  - Adjust sruti parameter if needed

**Prevention:** Add audio quality checks before transcription.

---

### Backend Server Won't Start

**Symptom:**
```
ModuleNotFoundError: No module named 'distutils'
```

**Cause:** Python 3.12 removed `distutils`, older numpy versions require it.

**Solution:**
1. Update numpy to version >= 1.26.0
   ```bash
   pip install "numpy>=1.26.0"
   ```
2. Upgrade pip and build tools:
   ```bash
   py -m pip install --upgrade pip setuptools wheel
   ```

**Other Start Issues:**

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill
```

**Missing Dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Python Version:**
- Ensure Python 3.12+ is installed
- Check: `python --version`

---

### Frontend Build Errors

**Symptom:**
```
Error: Cannot find module '@/components/file-upload'
```

**Causes & Solutions:**

**TypeScript Path Aliases:**
- **Cause:** `@/` alias not configured in `tsconfig.json`
- **Solution:** Ensure `tsconfig.json` has:
  ```json
  "paths": {
    "@/*": ["./*"]
  }
  ```

**Missing Dependencies:**
- **Cause:** Package not installed
- **Solution:** 
  ```bash
  npm install
  ```

**Module Resolution:**
- **Cause:** File path incorrect or file doesn't exist
- **Solution:** Check file exists and import path is correct

---

### API Timeout Errors

**Symptom:**
```
Request timeout after 300000ms
```

**Cause:** Transcription takes longer than 5 minutes (timeout limit).

**Solutions:**

**Shorten Audio:**
- Trim audio to shorter duration
- Process in segments

**Increase Timeout:**
```typescript
// Frontend: app/page.tsx
timeout: 600000, // 10 minutes
```

**Optimize Processing:**
- Use smaller audio files
- Reduce audio quality if acceptable

**Future Solution:** Implement async processing with job queue.

---

### Audio Player Not Working

**Symptom:**
- Play button doesn't work
- Audio doesn't play

**Causes & Solutions:**

**Browser Audio Autoplay Policy:**
- **Cause:** Browser blocks autoplay
- **Solution:** User interaction required before playing audio

**Missing Audio URL:**
- **Cause:** `audioUrl` not set in store
- **Solution:** Ensure file upload creates object URL

**File Format Issues:**
- **Cause:** Browser doesn't support audio format
- **Solution:** Use MP3 or WAV format (widely supported)

**Check Browser Console:**
```javascript
// Check for errors in browser console
console.log(useAppStore.getState().audioUrl)
```

---

### Raaga Detection Returns Null

**Symptom:**
- Transcription succeeds but `raaga` is `null`

**Causes & Solutions:**

**Insufficient Swarams:**
- **Cause:** Not enough swarams detected (< 5 swarams)
- **Solution:** Use longer audio with clear melody

**Pattern Doesn't Match:**
- **Cause:** Raaga not in database or pattern doesn't match
- **Solution:** 
  - Add more raagas to database
  - Improve pattern matching algorithm
  - Lower confidence threshold (currently 30%)

**Low Confidence:**
- **Cause:** Swaram detection confidence too low
- **Solution:** Improve audio quality and pitch detection

---

## Debugging Tips

### Backend Debugging

**Enable Debug Logging:**
```python
# backend/main.py
logging.basicConfig(level=logging.DEBUG)
```

**Check Logs:**
```bash
# Backend logs show:
INFO - Received file: audio.wav
INFO - Processing audio file...
INFO - Transcription complete. Found 25 swarams
```

**Test API Directly:**
```bash
curl -X POST http://localhost:8000/api/transcribe \
  -F "file=@test.wav" \
  -v
```

### Frontend Debugging

**Enable Console Logging:**
```typescript
// Check state
console.log(useAppStore.getState())

// Check API response
console.log("API Response:", response.data)
```

**Network Tab:**
- Check request/response in browser DevTools
- Verify CORS headers
- Check request payload

**React DevTools:**
- Inspect component state
- Check Zustand store state
- Monitor re-renders

---

## Performance Issues

### Slow Transcription

**Causes:**
- Large audio files (> 10MB)
- Long audio duration (> 2 minutes)
- Complex audio (multiple instruments)

**Solutions:**
- Compress audio files
- Trim to essential segments
- Use WAV format (faster processing than MP3)

### Frontend Slow Response

**Causes:**
- Large state updates
- Too many re-renders
- Large file uploads

**Solutions:**
- Optimize Zustand selectors
- Use React.memo for components
- Implement file chunking for large uploads

---

## Getting Help

### Before Asking for Help

1. **Check Logs:**
   - Backend console logs
   - Browser console logs
   - Network tab in DevTools

2. **Verify Setup:**
   - Dependencies installed
   - Environment variables set
   - Backend server running

3. **Reproduce Issue:**
   - Steps to reproduce
   - Error messages
   - Expected vs actual behavior

### Where to Get Help

1. **Documentation:**
   - Check `ARCHITECTURE.md`
   - Review `API_REFERENCE.md`
   - Read `ERROR_HANDLING.md`

2. **GitHub Issues:**
   - Search existing issues
   - Create new issue with details

3. **Community:**
   - Stack Overflow (tag: `sargam-app`)
   - Discord/Slack channel

---

## Prevention Checklist

**Before Deployment:**
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] CORS origins set correctly
- [ ] Error handling tested
- [ ] Logging configured
- [ ] File size limits tested
- [ ] Timeout values appropriate
- [ ] Documentation updated

**Regular Maintenance:**
- [ ] Review error logs weekly
- [ ] Monitor API response times
- [ ] Check for dependency updates
- [ ] Review and update error codes
- [ ] Update documentation as needed

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| CORS error | Restart backend, check CORS_ORIGINS |
| Empty transcription | Check audio quality, ensure vocals present |
| Server won't start | Update numpy, check Python version |
| File upload fails | Check file type, size, duration |
| Timeout error | Reduce audio length or increase timeout |
| Audio player broken | Check browser console, verify audio URL |

---

**Last Updated:** 2025-11-01  
**Version:** 1.0.0

