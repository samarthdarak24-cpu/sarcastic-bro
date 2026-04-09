"""
Simple test script to verify AI service endpoints
"""
import requests
import sys

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed!")
            print(f"   Status: {data['status']}")
            print(f"   YOLOv8: {data['models']['yolov8']}")
            print(f"   EfficientNet: {data['models']['efficientnet']}")
            print(f"   Device: {data['device']}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_with_sample_image():
    """Test with a sample image (if available)"""
    print("\nNote: To test image analysis, upload an image through the web interface at:")
    print("   http://localhost:3000/ai-analyzer")
    print("\nOr use curl:")
    print('   curl -X POST "http://localhost:8000/api/analyze" -F "file=@your_image.jpg"')

if __name__ == "__main__":
    print("=" * 60)
    print("AI Service Test Suite")
    print("=" * 60)
    
    if test_health_check():
        test_with_sample_image()
        print("\n✅ All tests passed! Service is ready.")
        sys.exit(0)
    else:
        print("\n❌ Tests failed. Make sure the service is running.")
        sys.exit(1)
