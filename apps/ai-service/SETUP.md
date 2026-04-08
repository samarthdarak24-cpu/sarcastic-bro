# AI Quality Shield Setup Guide

## Overview
The AI Quality Shield uses YOLOv8 and EfficientNet for real-time crop quality detection and analysis.

## Features
- **Auto Crop Detection**: Automatically identifies crop type (Tomato, Grapes, Banana, Mango, Wheat, Rice, etc.)
- **Quality Grading**: Premium, Grade A, Grade B, Grade C, Rejected
- **Defect Detection**: Bruising, discoloration, surface damage, shape irregularity
- **Blockchain Certification**: Generates verifiable quality certificates

## Installation

### 1. Install Python Dependencies

```bash
cd apps/ai-service
pip install -r requirements.txt
```

### 2. Required Packages
- **FastAPI**: Web framework
- **Ultralytics**: YOLOv8 object detection
- **timm**: EfficientNet models
- **OpenCV**: Image processing
- **PyTorch**: Deep learning framework

### 3. Optional: GPU Support

For faster inference with NVIDIA GPU:

```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

## Running the Service

```bash
cd apps/ai-service
python main.py
```

The service will start on `http://localhost:8001`

## API Endpoints

### Health Check
```
GET /health
```

### Quality Scan
```
POST /api/v1/trust/quality-scan
Content-Type: multipart/form-data

Parameters:
- file: Image file (required)
- crop_type: "Auto" for auto-detection or specify crop name (optional)
```

### Response Format
```json
{
  "success": true,
  "certificate_id": "CERT-20260408123456-1234",
  "crop_type": "Grapes",
  "grade": "Premium",
  "health_score": 92.5,
  "confidence": 0.95,
  "moisture": 85.3,
  "blockchain_hash": "0x...",
  "defects": ["Bruising: 1", "Discoloration: 2"],
  "recommendation": "Excellent quality! Ready for premium export markets.",
  "detections": [{"box": [100, 100, 540, 540], "label": "Grapes", "confidence": 0.95}]
}
```

## Supported Crops

The system automatically detects:
- **Fruits**: Tomato, Grapes, Banana, Mango
- **Vegetables**: Cucumber, Cabbage, Cauliflower, Potato
- **Grains**: Wheat, Rice
- **Mixed Produce**: Generic detection

## Quality Grading System

- **Premium** (90-100): Export quality, premium markets
- **Grade A** (80-89): High quality, export and premium local
- **Grade B** (70-79): Good quality, local markets
- **Grade C** (60-69): Acceptable, quick sale recommended
- **Rejected** (<60): Not suitable for fresh market

## Troubleshooting

### Models Not Loading
- Check internet connection (models download on first run)
- Ensure sufficient disk space (~100MB for models)

### Slow Performance
- Use GPU if available (10-50x faster)
- Reduce image size before upload
- Use YOLOv8n (nano) instead of YOLOv8m for faster inference

### Wrong Crop Detection
- Ensure good lighting in images
- Crop should be clearly visible
- Avoid heavy shadows or reflections

## Performance

- **CPU**: ~2-5 seconds per image
- **GPU**: ~0.2-0.5 seconds per image
- **Model Size**: YOLOv8n (6MB), EfficientNet-B0 (20MB)

## Environment Variables

```bash
# Optional: Set HuggingFace token for faster downloads
export HF_TOKEN=your_token_here
```
