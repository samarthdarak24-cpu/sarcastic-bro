# AI Service Setup Guide

## Quick Start

### Step 1: Install Python Dependencies

```bash
cd apps/ai-service
pip install -r requirements.txt
```

### Step 2: Download Pre-trained Models

The models will be automatically downloaded on first run, but you can pre-download them:

```python
# Run this Python script to download models
from ultralytics import YOLO
from efficientnet_pytorch import EfficientNet

# Download YOLOv8
model = YOLO('yolov8n.pt')

# Download EfficientNet
model = EfficientNet.from_pretrained('efficientnet-b0')
```

### Step 3: Start the AI Service

```bash
cd apps/ai-service
python main.py
```

The service will start on `http://localhost:8000`

### Step 4: Install Frontend Dependencies

```bash
cd apps/web
npm install react-dropzone
```

### Step 5: Test the Service

Open your browser and go to:
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`

## Using the Frontend Component

### Add to your page:

```typescript
// apps/web/src/app/ai-analyzer/page.tsx
import { FruitVegetableAnalyzer } from '@/components/ai/FruitVegetableAnalyzer';

export default function AIAnalyzerPage() {
  return <FruitVegetableAnalyzer />;
}
```

## API Endpoints

### 1. Complete Analysis
```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"
```

### 2. Detection Only
```bash
curl -X POST "http://localhost:8000/api/detect" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"
```

### 3. Classification Only
```bash
curl -X POST "http://localhost:8000/api/classify" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"
```

### 4. Quality Assessment Only
```bash
curl -X POST "http://localhost:8000/api/quality" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"
```

## Docker Deployment

### Build and Run with Docker

```bash
cd apps/ai-service

# Build image
docker build -t agrivoice-ai .

# Run container
docker run -p 8000:8000 agrivoice-ai
```

### Using Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  ai-service:
    build: ./apps/ai-service
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models
    environment:
      - MODEL_PATH=/app/models
    restart: unless-stopped

  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    depends_on:
      - ai-service
    environment:
      - AI_SERVICE_URL=http://ai-service:8000
```

Run with:
```bash
docker-compose up -d
```

## Training Custom Models

### YOLOv8 Custom Training

1. **Prepare Dataset**
```
dataset/
  images/
    train/
    val/
  labels/
    train/
    val/
  data.yaml
```

2. **data.yaml**
```yaml
train: ./images/train
val: ./images/val

nc: 14  # number of classes
names: ['apple', 'banana', 'orange', ...]
```

3. **Train**
```python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model.train(
    data='dataset/data.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    name='fruit_detector'
)
```

### EfficientNet Fine-tuning

```python
import torch
from efficientnet_pytorch import EfficientNet

# Load pretrained model
model = EfficientNet.from_pretrained('efficientnet-b0', num_classes=120)

# Your training code here
# ...

# Save model
torch.save(model.state_dict(), 'efficientnet_fruits.pth')
```

## Recommended Datasets

1. **Fruits 360** (120 classes)
   - Download: https://www.kaggle.com/moltean/fruits
   - 90,000+ images

2. **Fresh and Rotten Classification**
   - Download: https://www.kaggle.com/sriramr/fruits-fresh-and-rotten-for-classification

3. **Plant Village** (Disease Detection)
   - Download: https://www.kaggle.com/emmarex/plantdisease

## Performance Optimization

### 1. Use ONNX for Faster Inference

```python
import torch.onnx

# Export to ONNX
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    opset_version=11,
    input_names=['input'],
    output_names=['output']
)

# Use ONNX Runtime
import onnxruntime as ort
session = ort.InferenceSession("model.onnx")
```

### 2. Batch Processing

```python
@app.post("/api/batch-analyze")
async def batch_analyze(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        # Process each image
        result = await analyze_image(file)
        results.append(result)
    return results
```

### 3. Caching

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=100)
def get_cached_result(image_hash: str):
    # Return cached result if available
    pass
```

## Troubleshooting

### Issue: Models not loading
**Solution**: Ensure you have internet connection for first-time download, or manually download models

### Issue: CUDA out of memory
**Solution**: Use smaller model (yolov8n instead of yolov8x) or reduce batch size

### Issue: Slow inference
**Solution**: 
- Use GPU if available
- Convert to ONNX
- Use smaller image size
- Enable model quantization

### Issue: CORS errors
**Solution**: Check CORS configuration in `main.py` and add your frontend URL

## Next Steps

1. **Collect Custom Data**: Take photos of your specific fruits/vegetables
2. **Annotate Data**: Use tools like LabelImg or Roboflow
3. **Train Custom Model**: Fine-tune on your dataset
4. **Deploy**: Use Docker or cloud services
5. **Monitor**: Add logging and analytics

## Resources

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [EfficientNet Paper](https://arxiv.org/abs/1905.11946)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PyTorch Tutorials](https://pytorch.org/tutorials/)

## Support

For issues or questions:
1. Check the documentation
2. Review GitHub issues in the referenced repositories
3. Join the Ultralytics Discord community

---

**Ready to start?** Run `python main.py` in the ai-service directory!
