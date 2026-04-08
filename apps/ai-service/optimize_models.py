import torch
from ultralytics import YOLO
import timm
import os

def export_to_onnx():
    """
    Export all models to ONNX for 2-3x faster inference on CPU
    """
    print("🚀 Starting Model Optimization (ONNX Export)...")
    
    # 1. Export YOLOv8
    yolo_model_path = 'yolov8_quality_best.pt'
    if os.path.exists(yolo_model_path):
        print(f"📦 Exporting {yolo_model_path}...")
        model = YOLO(yolo_model_path)
        model.export(format='onnx', imgsz=640)
    else:
        print(f"⚠ YOLO model {yolo_model_path} not found. Skipping.")

    # 2. Export EfficientNet
    eff_model_path = 'efficientnet_freshness.pt'
    if os.path.exists(eff_model_path):
        print(f"📦 Exporting {eff_model_path}...")
        model = timm.create_model('efficientnet_b0', pretrained=False, num_classes=3)
        model.load_state_dict(torch.load(eff_model_path, map_location='cpu'))
        model.eval()
        
        dummy_input = torch.randn(1, 3, 224, 224)
        torch.onnx.export(model, dummy_input, "efficientnet_freshness.onnx", 
                         opset_version=12, input_names=['input'], output_names=['output'])
        print("✅ EfficientNet exported to ONNX.")

    # 3. Export Moisture CNN
    from moisture_model import MoistureDetectionCNN
    moist_model_path = 'moisture_model_best.pt'
    if os.path.exists(moist_model_path):
        print(f"📦 Exporting {moist_model_path}...")
        model = MoistureDetectionCNN()
        model.load_state_dict(torch.load(moist_model_path, map_location='cpu'))
        model.eval()
        
        # Moisture model has 3 inputs: rgb, texture, hsv_stats
        dummy_rgb = torch.randn(1, 3, 128, 128)
        dummy_tex = torch.randn(1, 1, 128, 128)
        dummy_hsv = torch.randn(1, 10)
        
        torch.onnx.export(model, (dummy_rgb, dummy_tex, dummy_hsv), "moisture_model.onnx",
                         opset_version=12)
        print("✅ Moisture model exported to ONNX.")

if __name__ == "__main__":
    export_to_onnx()
