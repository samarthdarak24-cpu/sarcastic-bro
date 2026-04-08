import requests
import os
import json
import numpy as np
import cv2
from PIL import Image
import io

def test_quality_shield_api():
    """
    Test script for the AI Quality Shield API
    Verifies that the API handles images correctly and returns the expected schema
    """
    print("🔍 Testing AI Quality Shield API...")
    
    url = "http://localhost:8001/api/v1/trust/quality-scan"
    
    # 1. Create a dummy image for testing if none exists
    dummy_img_path = "test_crop.jpg"
    img = np.zeros((640, 640, 3), dtype=np.uint8)
    # Draw some fake crop-like circles
    cv2.circle(img, (320, 320), 200, (200, 50, 50), -1) # Red "Tomato"
    cv2.imwrite(dummy_img_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    
    # 2. Call API
    print(f"📡 Sending request to {url}...")
    try:
        with open(dummy_img_path, "rb") as f:
            files = {"file": ("test.jpg", f, "image/jpeg")}
            params = {"crop_type": "Auto"}
            response = requests.post(url, files=files, params=params)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Call Successful!")
            print("\n📊 Scan Result Preview:")
            print(json.dumps(result, indent=2))
            
            # Verify required fields
            required_fields = ["crop", "grade", "quality_score", "moisture", "status"]
            missing = [f for f in required_fields if f not in result]
            
            if not missing:
                print("\n✅ SCHEMA VALIDATION PASSED")
            else:
                print(f"\n❌ SCHEMA VALIDATION FAILED. Missing: {missing}")
                
        else:
            print(f"❌ API Call Failed with status {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Error connecting to API: {e}")
        print("💡 Make sure the API is running (python main.py)")

if __name__ == "__main__":
    test_quality_shield_api()
