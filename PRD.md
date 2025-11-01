# 🎼 Sargam App – Product Requirements Document

# (PRD)

## 📌 1. Overview

This document outlines the product plan for **Sargam App** , a tool that enables two key user flows:

```
Audio → Transcription
Notation → Synthesized Audio with Gamakam
```
The app aims to support learners and professionals in Carnatic music by bridging the gap between audio
recordings and musical notation with intelligent, culturally rooted tools.

## 🚩 2. Problem to Be Solved

### Problem 1:

**Lack of accurate transcription tools for Carnatic vocal music.**

```
Traditional music transcription software performs poorly with the gamaka-laden and non-western
tuning system of Carnatic music.
```
### Problem 2:

**Need for auditory guidance from swaram notation.**

```
Users often have notation but cannot visualize how it should sound authentically, especially with
nuanced ornamentation.
```
## 🌟 3. Product Vision

To create a culturally intelligent, musically accurate, and usable system that:

```
Transcribes Carnatic vocals into swarams.
Converts notation into expressive Carnatic vocal-like audio.
Serves as a learning, teaching, and exploration tool for Indian classical music.
```
#### • • • • • • •


## 🗓️ 4. Target Release (V1)

### Scope

```
Audio transcription
Notation input to synthesized audio prototype
Minimal frontend MVP (Colour scheme should not be in purple, blue, shades of pastel and light pink, yellow and orange is preferred)
```
### Timeline

```
MVP Build Time : 1 Month
Platform : Web (Desktop-first)
```
### Stack

```
Frontend : Next.js (React framework) + Shadcn UI + Stitch AI for prototyping
Backend : FastAPI (Python)
Model Wrapping : To be chosen
Audio Engine : Custom pitch-shifted synthesis
```
## 👥 5. User Personas

```
Persona Needs
```
```
Carnatic Student Visualize and verify swarams + practice playback
Music Teacher Validate student recordings, generate practice clips
```
```
Composer Reverse engineer audio ideas
```
```
Technologist Experiment with Carnatic audio-AI flows
```
## 📋 6. Requirements

### 6.1 Audio-to-Swaram Transcription

**Description** : Transcribe monophonic Carnatic vocals into timestamped swaram notation.

**User Story** : As a student, I want to transcribe a vocal clip to understand the notes being sung.

**MVP Features and Detailed Specs:**

**1. File Upload (WAV/MP3)**

```
Support drag/drop or file selector for .wav, .mp
Auto convert to 44.1kHz mono WAV for model compatibility
```
#### • • • • • • • • • • •


```
Validate file duration (max 5 min for MVP)
Best Practice: Use client-side FFmpeg wrapper to preprocess before upload
```
**2. Omnizart Integration for Pitch Extraction**

```
Wrap any suitable library for our usecase as a Python module
Limit transcription to melody channel (monophonic vocal model)
Return frequency values with timestamp and confidence
Best Practice: Run the library in a containerized service (Docker) with caching
```
**3. Map Pitch to Nearest Swaram Using Sruti-Based Mapping**

```
Let users choose or detect the tonic (e.g., Sa = 131Hz)
Create a map of frequencies for each swaram across octaves
Match pitch to nearest swaram using windowed tolerance (±10 cents)
Best Practice: Cache tonic maps and allow UI override
```
**4. Add Octave, Duration, and Gamakam Estimation**

```
Estimate octave using frequency range buckets (e.g., Mandra, Madhya, Tara)
Detect gamakam by slope analysis on pitch contour:
E.g., if pitch oscillates >3 times per note, tag as "kampitam"
Best Practice: Visual inspection of pitch curve overlay for QA
```
**5. Display Swaram Grid with Playback-Linked Timestamps**

```
Render grid of swarams with time codes and playback sync
Highlight current swaram during playback
Enable hovering to preview pitch contour and gamakam label
Best Practice: Use canvas or SVG for scalable and performant drawing
```
**Acceptance Criteria:**

```
Accuracy of pitch detection within ±10 cents on sustained notes
Output available within 5 seconds for 30s clip
Transcription JSON format:
```
#### [

```
{"start": 0.0, "end": 0.5, "swaram":"Ri2", "octave": "Madhya", "gamakam":
"kampitam"},
...
]
```
```
Graceful error handling for unsupported audio or silence
```
#### • • • • • • • • • • • • • • • • • • • • • • •


**Backend Spec:**

```
Endpoint: POST /api/transcribe
Input: Audio file + optional sruti value
Output: JSON [{start, end, swaram, octave, gamakam?}]
```
**Development Best Practices:**

```
Use Python logging for model inference pipeline
Add retry + timeout logic to avoid long Omnizart hangs
Write unit tests for:
Sruti-based frequency mapping
Pitch-to-swaram conversion logic
Gamakam estimation classifier
```
**Future Enhancements:**

```
User-adjustable sruti detection
Confusion visualization (e.g., Ri2 vs Ga1)
Annotation of known compositions
REST + WebSocket support for progressive loading
```

```
### 6.3 Swaram-to-Audio Synthesis

**Description** : Convert text-based swaram notation to expressive audio playback.

#### • • • • • • • • • • • • • • • • • • • • •


**MVP Features:**

```
Accepts swaram string with optional gamakam tags
Allows tempo and sruti control
Playback through synthesized audio engine
```
**Backend Spec:**

```
Endpoint: POST /api/synthesize
Input: JSON { swaram[], tempo, sruti, voice: 'male/female' }
Output: MP3 buffer or streaming blob
```
**Future Enhancements:**

```
Real vocal synthesis using voicebank
Gamakam style toggles (e.g., Balamuralikrishna vs Semmangudi)
Export as audio lesson or tanpura-comped practice file
```
### 6.4 Dual Input UI

**Description** : Toggle-based interface for switching between audio and notation workflows.

**MVP Features:**

```
Upload audio file or paste notation
Mode selector ("Analyze Audio" | "Generate Audio")
Result display in synced swaram player or waveform
```
**UI Design with Shadcn + Stitch AI:**

```
Modular cards for input & output blocks
Scroll-syncable swaram and waveform timeline
Gamakam hints with tooltip explanation
```
## 🛏️ 7. Technical Architecture

### Frontend (Next.js + Shadcn UI + Stitch AI)

```
Upload handler
Swaram display grid component
Audio waveform with hover sync
Playback controls
Form for swaram entry
```
#### • • • • • • • • • • • • • • • • • • • •


### Backend (FastAPI)

```
/transcribe → sruti adjust, swaram map
/synthesize → Pitch + formant modulation engine
```
### Data Flow

```
Audio Upload → Transcription → Display
Notation Input → Gamakam Curves → Audio Synthesis → Playback
```
## 🔄 8. API and Connection Requirements

```
Endpoint Method Description
```
```
/api/transcribe POST Audio to swaram JSON
```
```
/api/synthesize POST Notation to audio
```
```
/api/status/:jobId GET Check long process jobs
```
## 📊 9. Metrics & Analytics

```
Transcription latency
Confidence scores for swarams
Gamakam coverage %
Drop-offs in transcription result review
User mode preference (audio vs swaram input)
```
## 📅 10. Timeline & Priorities

```
Feature Timeline
```
```
Audio-to-swaram (Omnizart backend + UI) Week 1–
```
```
Notation-to-audio synthesis prototype Week 2–
UI Polishing, testing Week 4
```
```
Beta Launch End of Month 1
```
```
Raga Classifier Integration Post-MVP Phase
```
#### • • • • • • •


## ✅ 11. Testing Requirements

```
Unit tests: backend transcription pipeline
Integration tests: end-to-end audio → swaram flow
Audio QA: gamakam detection spot checks
Usability test: click-path for switching modes
Benchmark set of Carnatic pieces (10 known compositions)
```
Would you like this exported as a GitHub README.md or integrated into a Notion doc next?

#### •

#### •

#### •

#### •

#### •
