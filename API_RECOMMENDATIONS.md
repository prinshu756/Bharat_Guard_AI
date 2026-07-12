# Bharat Guardian AI - Real API Integration Guide

## Overview
This document maps each mock API endpoint to real-world services and provides integration details.

---

## 1. DISASTER ALERTS (Satellite Detection)

### Current Mock: `mockAPI.getDisasterAlerts()`
Detects: Floods, fires, road blockages, building collapses

### Real APIs to Use

#### **Primary: NASA FIRMS (Fire Information Management System)**
- **Purpose**: Detects active fires using satellite data
- **Endpoint**: `https://firms.modaps.eosdis.nasa.gov/api/area/csv`
- **Free Tier**: Yes (public data)
- **Rate Limit**: 1 request/second
- **Response Time**: Real-time (updated every 3 hours)
- **Coverage**: Global
- **Authentication**: None (API key optional for higher rate limits)

**Integration Code:**
```javascript
async function getFireAlerts(bbox) {
  // bbox format: [min_lon, min_lat, max_lon, max_lat]
  // Indore bounding box: [75.7, 22.6, 75.9, 22.9]
  
  const params = new URLSearchParams({
    source: 'VIIRS_SNPP', // or NOAA_20, LANDSAT_8
    country: 'IND',
    dayrange: 1, // Last 24 hours
    csv: true
  });
  
  const response = await fetch(
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/?${params}`,
    { headers: { 'Authorization': `Bearer ${NASA_API_KEY}` } }
  );
  
  const data = await response.text();
  return parseCSV(data).map(row => ({
    type: 'fire',
    location: row.location,
    lat: parseFloat(row.latitude),
    lng: parseFloat(row.longitude),
    confidence: parseInt(row.confidence),
    timestamp: row.acq_date
  }));
}
```

#### **Secondary: NOAA GEFS (Flood Prediction)**
- **Purpose**: 10-day flood forecasting
- **Endpoint**: `https://api.weather.gov/alerts/active?area=IN`
- **Free Tier**: Yes
- **Rate Limit**: Unlimited (generous)
- **Coverage**: USA focus (but has India coverage via regional partners)
- **Alternative**: India Meteorological Department (IMD) + NOAA

**Integration Code:**
```javascript
async function getFloodAlerts() {
  const response = await fetch(
    'https://api.weather.gov/alerts/active?area=IN,MP'
  );
  const data = await response.json();
  
  return data.features
    .filter(f => f.properties.event.includes('Flood'))
    .map(f => ({
      type: 'flood',
      location: f.properties.areaDesc,
      severity: f.properties.severity,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      confidence: 92, // Average
      timestamp: f.properties.effective
    }));
}
```

#### **Tertiary: ISRO Bhuvan (Indian Satellites)**
- **Purpose**: Real-time satellite imagery for India
- **Endpoint**: `https://bhuvan-ras.nrsc.gov.in/bhuvan/gwc`
- **Free Tier**: Yes
- **Authentication**: Registration required (free)
- **Coverage**: India-only (best resolution for Bharat Guardian)
- **Rate Limit**: 100 requests/hour for free tier

**Integration:**
```javascript
// ISRO Bhuvan returns georeferenced satellite imagery
// Use with your own computer vision model (YOLOv11) for flood/fire detection
async function getISROSatelliteImagery(lat, lng, date) {
  const params = {
    service: 'WCS',
    version: '2.0.1',
    request: 'GetCoverage',
    coverageId: 'Sentinel2_L2A', // 10m resolution
    bbox: `${lng-0.5},${lat-0.5},${lng+0.5},${lat+0.5}`,
    format: 'image/tiff',
    datetime: date
  };
  
  const url = 'https://bhuvan-ras.nrsc.gov.in/bhuvan/gwc?' + 
    new URLSearchParams(params);
  
  // Pass image to YOLOv11 model to detect floods/fires
  const imageResponse = await fetch(url);
  const imageBuffer = await imageResponse.arrayBuffer();
  
  // Process with YOLOv11
  const detections = await runYOLOv11(imageBuffer);
  return detections;
}
```

---

## 2. AI PREDICTIONS (Pre-Disaster Risk Assessment)

### Current Mock: `mockAPI.getAIPredictions()`
Predicts which villages face critical risk within 2-48 hours

### Integration Strategy

**Your Own ML Pipeline:**
1. Collect historical disaster data + satellite imagery
2. Train custom model (TensorFlow/PyTorch) on:
   - Weather patterns (temp, humidity, rainfall)
   - Topography (elevation, slope, water proximity)
   - Population density + infrastructure
   - Seasonal patterns

**Data Sources:**
- **Weather**: OpenWeatherMap API (INR ₹500-5000/month)
- **Historical Disasters**: NOAA, Indian Bureau of Civil Aviation
- **Topography**: USGS SRTM (free)
- **Population**: WorldPop API (free)

**Code Structure:**
```javascript
async function predictDisasterRisk(village) {
  const weatherData = await getOpenWeatherData(village.lat, village.lng);
  const historicalPattern = await queryHistoricalDB(village.id);
  const topography = await getTopoData(village.lat, village.lng);
  
  // Run through your trained model
  const riskScore = await runMLModel({
    weather: weatherData,
    history: historicalPattern,
    topo: topography,
    season: getCurrentSeason(),
    populationDensity: village.population / village.area_km2
  });
  
  return {
    village: village.name,
    riskLevel: riskScore > 0.8 ? 'critical' : riskScore > 0.5 ? 'high' : 'medium',
    confidence: riskScore,
    recommendation: getRecommendation(riskScore)
  };
}
```

---

## 3. RESOURCE ALLOCATION (Ambulance Routing)

### Current Mock: `mockAPI.getResourceAllocation()`

### Real APIs

#### **Ambulance Tracking: Your Own Backend**
- Build a simple Node.js/FastAPI server
- Store ambulance GPS, status, capacity
- Use for real-time routing

#### **Hospital Database: NIC India + Direct APIs**
- **National Health Mission (NHM) Database**: State-wise hospital inventory
- **Google Places API** (for coordinates, hours)
- **Your own PostgreSQL** with hospital data

**Integration:**
```javascript
async function getAmbulanceRoutes(patientLat, patientLng, severity) {
  // Step 1: Get nearby ambulances
  const ambulances = await queryDatabase(
    `SELECT * FROM ambulances 
     WHERE status = 'available' 
     AND distance(location, POINT(${patientLng}, ${patientLat})) < 5`
  );
  
  // Step 2: Get nearby hospitals
  const hospitals = await queryDatabase(
    `SELECT * FROM hospitals 
     WHERE distance(location, POINT(${patientLng}, ${patientLat})) < 50`
  );
  
  // Step 3: Use OSRM or Google Maps Directions API for optimal routing
  for (let amb of ambulances) {
    const routes = await getDirections(amb.location, hospitals);
    amb.optimalRoute = routes[0]; // Shortest route
    amb.eta = routes[0].duration;
  }
  
  return ambulances.sort((a, b) => a.eta - b.eta);
}
```

**Routing Engine Options:**
- **OSRM (Open Source Routing Machine)**: Free, self-hosted
- **Google Maps Directions API**: ₹12/1000 requests
- **Mapbox Directions API**: ₹0.50/request

---

## 4. DAMAGE MAPPING (Citizen Uploads + Computer Vision)

### Current Mock: `mockAPI.getDamageMaps()`

### Real Integration

#### **Image Upload Pipeline:**
```javascript
// Frontend
async function uploadDamagePhoto(file, location) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('lat', location.lat);
  formData.append('lng', location.lng);
  formData.append('description', location.description);
  
  const response = await fetch('/api/damage-reports', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}

// Backend (FastAPI)
@app.post("/api/damage-reports")
async def process_damage_report(image: UploadFile, lat: float, lng: float):
  # Save image to cloud storage (AWS S3 / GCS)
  image_url = await upload_to_s3(image)
  
  # Run YOLOv11 for damage detection
  detections = run_yolov11_inference(image.file)
  
  # Extract damage type: building_collapse, bridge_damage, road_damage, electrical_hazard
  damage_type = detections[0].label
  confidence = detections[0].confidence
  
  # Store in database
  db.damage_reports.insert({
    image_url: image_url,
    damage_type: damage_type,
    confidence: confidence,
    location: {"lat": lat, "lng": lng},
    timestamp: datetime.now(),
    reporter_id: current_user.id
  })
  
  # Alert nearby rescue teams
  alert_teams(lat, lng, damage_type, confidence)
  
  return {"status": "reported", "damage_type": damage_type, "confidence": confidence}
```

**Computer Vision Model:**
- **YOLOv11**: Real-time object detection (50ms per image)
- **SAM2**: Segmentation for precise damage area
- **Fine-tune** on damage imagery dataset

---

## 5. MISSING PERSON FINDER (Face Recognition)

### Current Mock: `mockAPI.getMissingPersons()`

### Real APIs

#### **Option 1: Azure Face API (Recommended)**
- **Accuracy**: 99.6%
- **Cost**: $1 per 1000 faces
- **Speed**: 200ms average
- **Privacy**: Enterprise-grade encryption

```javascript
const { FaceClient } = require("@azure/cognitiveservices-face");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

async function findMissingPerson(photoStream) {
  const credentials = new CognitiveServicesCredentials(AZURE_FACE_KEY);
  const client = new FaceClient(AZURE_ENDPOINT, credentials);
  
  // Detect faces in input image
  const detectedFaces = await client.face.detectWithStream(photoStream, {
    returnFaceId: true,
    returnFaceAttributes: ['age', 'gender', 'emotion']
  });
  
  if (detectedFaces.length === 0) return [];
  
  const inputFaceId = detectedFaces[0].faceId;
  
  // Query database of missing person photos
  const missingPersonFaces = await fetchMissingPersonFaceIds();
  
  // Find matches
  const results = await client.face.findSimilar(inputFaceId, {
    faceIds: missingPersonFaces,
    maxNumOfCandidatesReturned: 10,
    mode: 'matchPerson'
  });
  
  return results.map(r => ({
    personId: r.persistedFaceId,
    confidence: r.confidence * 100,
    notification: r.confidence > 0.85 ? 'High Match' : 'Review Manually'
  }));
}
```

#### **Option 2: AWS Rekognition**
- **Cost**: $1.60 per 1000 images
- **Features**: Real-time collection matching
- **Advantage**: Integrates with AWS infrastructure

#### **Option 3: Open Source: DeepFace**
- **Free & self-hosted**
- **Accuracy**: 97%+
- **Trade-off**: Requires GPU

---

## 6. CROWD DENSITY DETECTION

### Current Mock: `mockAPI.getCrowdDensity()`

### Real Integration

**Computer Vision Approach:**
```python
# Python backend
import cv2
from ultralytics import YOLO

def detect_crowd_density(video_stream_url):
    """
    Process CCTV feed to detect crowd density and stampede risk
    """
    model = YOLO('yolov11x.pt')  # Large model for accuracy
    
    cap = cv2.VideoCapture(video_stream_url)
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Detect people
        results = model.predict(frame, conf=0.5)
        person_detections = [r for r in results[0].boxes if r.cls == 0]
        
        people_count = len(person_detections)
        frame_area_m2 = estimate_frame_area(frame)
        density_per_m2 = people_count / frame_area_m2
        
        # Risk assessment
        if density_per_m2 > 6:  # > 6 people/m² = stampede risk
            risk_level = "critical"
            alert_authorities()
        elif density_per_m2 > 4:
            risk_level = "high"
        else:
            risk_level = "medium"
        
        frame_count += 1
        
        # Store metrics every 30 seconds
        if frame_count % 900 == 0:  # 30fps * 30 = 900 frames
            db.crowd_metrics.insert({
                location: "Relief Camp A",
                people_count: people_count,
                density_per_m2: density_per_m2,
                risk_level: risk_level,
                timestamp: datetime.now()
            })
```

**CCTV/Video Sources:**
- Government CCTV networks (approach state governments)
- Satellite video feeds (high-res satellite can provide crowd counts)
- Citizen reports + phone camera feeds

---

## 7. MULTILINGUAL SOS CALLS

### Current Mock: `mockAPI.getLiveSOSCalls()`

### Real Integration

#### **Telephony: Twilio or AWS Connect**
```python
from twilio.rest import Client
from google.cloud import speech_v1
from google.cloud import translate_v2

@app.post("/emergency-call")
async def handle_emergency_call(call_sid: str):
    """
    1. Receive emergency call
    2. Transcribe in real-time
    3. Translate to English
    4. Extract location + emergency type
    5. Route to nearest responder
    """
    
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    # Get call recording
    call = client.calls(call_sid).fetch()
    
    # Step 1: Speech-to-Text (Google Cloud Speech)
    speech_client = speech_v1.SpeechClient()
    audio = speech_v1.RecognitionAudio(
        uri=call.recording_url
    )
    config = speech_v1.RecognitionConfig(
        encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code="hi-IN",  # Hindi
        model="latest_long"
    )
    
    response = speech_client.recognize(config=config, audio=audio)
    transcript = response.results[0].alternatives[0].transcript
    
    # Step 2: Translate to English
    translate_client = translate_v2.Client()
    result = translate_client.translate_text(
        values=[transcript],
        source_language='hi',
        target_language='en'
    )
    english_transcript = result['translatedTexts'][0]
    
    # Step 3: Extract info using Claude API
    location_and_type = await extract_emergency_info(english_transcript)
    
    # Step 4: Route to responder
    responder = await find_nearest_responder(location_and_type['lat'], location_and_type['lng'])
    
    return {
        "call_sid": call_sid,
        "transcript": english_transcript,
        "location": location_and_type,
        "responder_assigned": responder
    }
```

**Services Needed:**
- **Twilio/AWS Connect**: Phone line + IVR (₹5-10/call)
- **Google Cloud Speech-to-Text**: Speech recognition (₹0.024/15 seconds)
- **Google Translate API**: Multilingual support (₹15 per million chars)
- **Claude API**: Emergency info extraction ($0.003 per call)

---

## 8. OFFLINE MESH COMMUNICATION

### Current Mock: Built-in

### Real Implementation

**Technology Stack:**
- **Library**: Bridgefy SDK (₹500K/year) or open-source Bluetooth Mesh
- **Hardware**: Smartphones (Bluetooth 5.0+)
- **Range**: 100m-300m per hop (extends with mesh)
- **Protocol**: Ad-hoc mesh network

```javascript
// Using open-source: React Native + TinyMesh
import { BluetoothMesh } from 'tiny-mesh';

const mesh = new BluetoothMesh({
  maxHops: 4,
  retransmissions: 3
});

// Broadcast emergency message
mesh.broadcast({
  type: 'SOS',
  lat: 22.7196,
  lng: 75.8577,
  message: 'Trapped building collapse',
  timestamp: Date.now()
});

// Listen for messages from nearby phones
mesh.onMessage((message) => {
  console.log('Received:', message);
  // Forward to central server when connection restored
});
```

---

## 9. SATELLITE IMAGERY INTEGRATION

### Real APIs Summary

| API | Purpose | Cost | Rate Limit | Best For |
|-----|---------|------|-----------|----------|
| **NASA FIRMS** | Fire detection | Free | 1/sec | Real-time fire spots |
| **ISRO Bhuvan** | Indian satellite data | Free | 100/hr | Floods, landslides |
| **Sentinel Hub** | Copernicus satellite | €90/month | Unlimited | High-res European data |
| **Planet Labs** | Daily satellite imagery | Custom | Custom | Premium accuracy |

---

## 10. COMPLETE BACKEND ARCHITECTURE

### Recommended Stack
```
Frontend (React)
   ↓
   ├─ Mapbox GL (maps)
   ├─ Vite (bundler)
   └─ TailwindCSS
   
API Gateway (FastAPI)
   ↓
   ├─ Authentication (JWT)
   ├─ Rate limiting
   └─ Request validation
   
Microservices
   ├─ Disaster Detection Service
   │   ├─ NASA FIRMS connector
   │   ├─ ISRO Bhuvan connector
   │   └─ YOLOv11 inference
   │
   ├─ Resource Optimization Service
   │   ├─ Vehicle routing (OSRM)
   │   ├─ Hospital capacity checker
   │   └─ Supply chain optimizer
   │
   ├─ Computer Vision Service
   │   ├─ Damage classification
   │   ├─ Face recognition (Azure)
   │   └─ Crowd density analysis
   │
   └─ Communication Service
       ├─ SOS call handler (Twilio)
       ├─ SMS/Push notifications
       └─ Mesh network gateway

Databases
   ├─ PostgreSQL (main)
   │   ├─ Disasters table
   │   ├─ Hospitals table
   │   ├─ Resources table
   │   ├─ Missing persons table
   │   └─ Reports table
   │
   ├─ Redis (real-time cache)
   │   └─ Live ambulance positions
   │   └─ Current alerts
   │
   └─ S3/GCS (storage)
       ├─ Damage photos
       ├─ Missing person photos
       └─ Satellite imagery

External APIs
   ├─ NASA (satellite)
   ├─ ISRO (satellite)
   ├─ Google Maps (routing)
   ├─ Azure Face (recognition)
   ├─ Twilio (calls)
   ├─ Google Cloud (speech/translate)
   └─ Weather APIs
```

---

## 11. COST ESTIMATION (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| NASA FIRMS | Unlimited | Free |
| ISRO Bhuvan | 1000 requests/day | Free |
| Google Maps Routing | 50K requests | ₹30K |
| Azure Face API | 5000 matches | ₹250 |
| Google Speech-to-Text | 10K minutes | ₹2400 |
| Twilio | 1000 calls | ₹3000 |
| AWS S3 (image storage) | 1TB | ₹2000 |
| Compute (VPS/Cloud Run) | - | ₹5000-10K |
| **Total** | | **₹43-48K/month** |

---

## 12. QUICK START: Mock → Real Transition

1. **Week 1**: NASA FIRMS + ISRO Bhuvan (satellite data)
2. **Week 2**: Google Maps API (routing)
3. **Week 3**: Twilio (calls) + Google Speech-to-Text
4. **Week 4**: Azure Face API + YOLOv11 (computer vision)
5. **Week 5**: Full database + production deployment

---

## Contact & Support
- NASA FIRMS: https://firms.modaps.eosdis.nasa.gov/
- ISRO: https://bhuvan.nrsc.gov.in/
- Google Cloud: https://cloud.google.com/
- Twilio: https://www.twilio.com/
