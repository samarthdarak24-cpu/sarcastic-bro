"""
Quick API Test Script
Tests all endpoints of the AI Quality Shield
"""

import requests
import json
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8001"

def test_health():
    """Test health endpoint"""
    print("\n" + "="*50)
    print("Testing Health Endpoint")
    print("="*50)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_root():
    """Test root endpoint"""
    print("\n" + "="*50)
    print("Testing Root Endpoint")
    print("="*50)
    
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_quality_scan(image_path: str = None):
    """Test quality scan endpoint"""
    print("\n" + "="*50)
    print("Testing Quality Scan Endpoint")
    print("="*50)
    
    if not image_path:
        print("⚠️  No image provided. Skipping test.")
        print("Usage: Provide image path as argument")
        return False
    
    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        return False
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            f"{BASE_URL}/api/v1/trust/quality-scan?crop_type=Tomato",
            files=files
        )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Scan Successful!")
        print(f"Crop: {result.get('crop_type')}")
        print(f"Grade: {result.get('grade')}")
        print(f"Score: {result.get('health_score')}/100")
        print(f"Moisture: {result.get('moisture')}%")
        print(f"Certificate: {result.get('certificate_id')}")
        return True
    else:
        print(f"❌ Error: {response.text}")
        return False

def test_bulk_scan(image_path: str = None):
    """Test bulk scan endpoint"""
    print("\n" + "="*50)
    print("Testing Bulk Scan Endpoint")
    print("="*50)
    
    if not image_path:
        print("⚠️  No image provided. Skipping test.")
        print("Usage: Provide image path as argument")
        return False
    
    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        return False
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            f"{BASE_URL}/quality-shield/bulk-scan?return_visualization=true",
            files=files
        )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Bulk Scan Successful!")
        print(f"Crop: {result.get('crop_type')}")
        print(f"Total Items: {result.get('total_items')}")
        print(f"Good Items: {result.get('good_items')}")
        print(f"Defective Items: {result.get('defective_items')}")
        print(f"Quality: {result.get('quality_percentage')}%")
        print(f"Grade: {result.get('grade')}")
        
        if 'market_intelligence' in result:
            pricing = result['market_intelligence'].get('pricing', {})
            print(f"\n💰 Market Intelligence:")
            print(f"Recommended Price: ₹{pricing.get('recommended_price')}/kg")
            print(f"Total Value: ₹{pricing.get('total_value')}")
        
        if 'export_readiness' in result:
            export = result['export_readiness']
            print(f"\n🌍 Export Readiness:")
            print(f"Export Ready: {export.get('export_ready')}")
            print(f"Market: {export.get('export_market')}")
            print(f"Confidence: {export.get('confidence')}")
        
        return True
    else:
        print(f"❌ Error: {response.text}")
        return False

def run_all_tests(image_path: str = None):
    """Run all tests"""
    print("\n" + "="*60)
    print("AI QUALITY SHIELD - API TEST SUITE")
    print("="*60)
    
    results = {
        "Health Check": test_health(),
        "Root Endpoint": test_root(),
    }
    
    if image_path:
        results["Quality Scan"] = test_quality_scan(image_path)
        results["Bulk Scan"] = test_bulk_scan(image_path)
    else:
        print("\n⚠️  No image provided. Skipping scan tests.")
        print("To test scans, run: python test_api.py path/to/image.jpg")
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    import sys
    
    # Get image path from command line argument
    image_path = sys.argv[1] if len(sys.argv) > 1 else None
    
    try:
        run_all_tests(image_path)
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to AI service")
        print("Make sure the service is running at http://localhost:8001")
        print("Start it with: python main.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
