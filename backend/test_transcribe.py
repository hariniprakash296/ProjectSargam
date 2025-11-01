# Quick test script for backend transcription
# Run this to test if the backend is working

import requests
import sys

# Test file - replace with your actual audio file path
test_file = sys.argv[1] if len(sys.argv) > 1 else None

if not test_file:
    print("Usage: python test_transcribe.py <path_to_audio_file>")
    sys.exit(1)

print(f"Testing transcription with file: {test_file}")

try:
    with open(test_file, 'rb') as f:
        files = {'file': (test_file, f, 'audio/wav')}
        response = requests.post(
            'http://localhost:8000/api/transcribe',
            files=files,
            timeout=300
        )
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✓ Success!")
        print(f"  Swarams found: {len(data.get('swarams', []))}")
        print(f"  Raaga: {data.get('raaga', {}).get('name', 'None')}")
        if data.get('swarams'):
            print(f"\n  First few swarams:")
            for swaram in data['swarams'][:5]:
                print(f"    - {swaram.get('swaram')} ({swaram.get('start')}s - {swaram.get('end')}s)")
    else:
        print(f"\n✗ Error: {response.status_code}")
        print(f"  Response: {response.text}")
        
except Exception as e:
    print(f"\n✗ Error: {str(e)}")
    import traceback
    traceback.print_exc()

