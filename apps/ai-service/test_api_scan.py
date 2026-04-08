"""Test the Quality Shield API with a real image"""
import requests
import json

# Test the scan endpoint
url = "http://localhost:8001/quality-shield/scan?return_visualization=true"

try:
    with open('test_tomato.jpg', 'rb') as f:
        files = {'file': ('test_tomato.jpg', f, 'image/jpeg')}
        response = requests.post(url, files=files, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ SCAN SUCCESSFUL!")
        print(f"Overall Grade: {result.get('overall_grade')}")
        print(f"Quality Score: {result.get('overall_quality_score')}")
        print(f"Detections: {result.get('total_detections')}")
        print(f"Technology: {result.get('technology_stack')}")
        print("\nFull Response:")
        print(json.dumps(result, indent=2))
    else:
        print(f"\n❌ Error: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
