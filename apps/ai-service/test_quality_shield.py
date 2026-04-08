"""
Test script for AI Quality Shield Scanner
Verifies all components are working correctly
"""

import sys
import requests
import cv2
import numpy as np
from pathlib import Path
import json

def create_test_image():
    """Create a synthetic test image"""
    # Create a simple test image with a circular object
    img = np.ones((400, 400, 3), dtype=np.uint8) * 255
    
    # Draw a tomato-like circle
    cv2.circle(img, (200, 200), 80, (50, 50, 200), -1)  # Red circle
    
    # Add some texture
    noise = np.random.randint(-20, 20, img.shape, dtype=np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    # Save test image
    test_path = Path("test_crop.jpg")
    cv2.imwrite(str(test_path), img)
    return test_path

def test_scanner_import():
    """Test 1: Import scanner module"""
    print("Test 1: Importing scanner module...")
    try:
        from ml_models.quality_shield_scanner import get_scanner
        print("✅ Scanner module imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import scanner: {e}")
        return False

def test_scanner_initialization():
    """Test 2: Initialize scanner"""
    print("\nTest 2: Initializing scanner...")
    try:
        from ml_models.quality_shield_scanner import get_scanner
        scanner = get_scanner()
        print("✅ Scanner initialized successfully")
        print(f"   - YOLOv8 loaded: {scanner.yolo_model is not None}")
        print(f"   - EfficientNet loaded: {scanner.quality_classifier is not None}")
        return True, scanner
    except Exception as e:
        print(f"❌ Failed to initialize scanner: {e}")
        return False, None

def test_image_preprocessing(scanner):
    """Test 3: Image preprocessing"""
    print("\nTest 3: Testing image preprocessing...")
    try:
        # Create test image
        img = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
        processed = scanner.preprocess_image(img)
        
        assert processed.shape == img.shape, "Shape mismatch"
        print("✅ Image preprocessing works")
        return True
    except Exception as e:
        print(f"❌ Preprocessing failed: {e}")
        return False

def test_feature_extraction(scanner):
    """Test 4: Feature extraction"""
    print("\nTest 4: Testing feature extraction...")
    try:
        img = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
        features = scanner.extract_features(img)
        
        required_keys = ["color_uniformity", "texture_score", "shape_regularity", "defects"]
        for key in required_keys:
            assert key in features, f"Missing feature: {key}"
        
        print("✅ Feature extraction works")
        print(f"   - Color uniformity: {features['color_uniformity']:.2f}")
        print(f"   - Texture score: {features['texture_score']:.2f}")
        print(f"   - Shape regularity: {features['shape_regularity']:.2f}")
        return True
    except Exception as e:
        print(f"❌ Feature extraction failed: {e}")
        return False

def test_quality_classification(scanner):
    """Test 5: Quality classification"""
    print("\nTest 5: Testing quality classification...")
    try:
        img = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
        quality_class, confidence, probs = scanner.classify_quality(img)
        
        assert 0 <= quality_class <= 4, "Invalid quality class"
        assert 0 <= confidence <= 1, "Invalid confidence"
        assert len(probs) == 5, "Invalid probability array"
        
        print("✅ Quality classification works")
        print(f"   - Quality class: {quality_class} ({scanner.quality_grades[quality_class]})")
        print(f"   - Confidence: {confidence:.2%}")
        return True
    except Exception as e:
        print(f"❌ Quality classification failed: {e}")
        return False

def test_full_scan(scanner):
    """Test 6: Full scan pipeline"""
    print("\nTest 6: Testing full scan pipeline...")
    try:
        # Create test image
        test_path = create_test_image()
        
        # Run scan
        result = scanner.scan(str(test_path), return_visualization=True)
        
        assert result["success"], "Scan failed"
        assert "overall_quality_score" in result
        assert "overall_grade" in result
        assert "detections" in result
        
        print("✅ Full scan pipeline works")
        print(f"   - Overall grade: {result['overall_grade']}")
        print(f"   - Quality score: {result['overall_quality_score']:.2f}")
        print(f"   - Detections: {result['total_detections']}")
        
        # Cleanup
        test_path.unlink()
        return True
    except Exception as e:
        print(f"❌ Full scan failed: {e}")
        return False

def test_api_health():
    """Test 7: API health check"""
    print("\nTest 7: Testing API health endpoint...")
    try:
        response = requests.get("http://localhost:8001/quality-shield/health", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API is healthy")
            print(f"   - Status: {data.get('status')}")
            print(f"   - Device: {data.get('device')}")
            return True
        else:
            print(f"❌ API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("⚠️  API server not running (start with: uvicorn app.main:app --port 8001)")
        return False
    except Exception as e:
        print(f"❌ API health check failed: {e}")
        return False

def test_api_scan():
    """Test 8: API scan endpoint"""
    print("\nTest 8: Testing API scan endpoint...")
    try:
        # Create test image
        test_path = create_test_image()
        
        # Send request
        with open(test_path, 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            response = requests.post(
                "http://localhost:8001/quality-shield/scan?return_visualization=true",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API scan works")
            print(f"   - Grade: {data.get('overall_grade')}")
            print(f"   - Score: {data.get('overall_quality_score'):.2f}")
            print(f"   - Technology: {data.get('technology_stack', {}).get('detection')}")
        else:
            print(f"❌ API returned status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Cleanup
        test_path.unlink()
        return True
    except requests.exceptions.ConnectionError:
        print("⚠️  API server not running")
        return False
    except Exception as e:
        print(f"❌ API scan failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("AI Quality Shield Scanner - Test Suite")
    print("YOLOv8 + EfficientNet + Transfer Learning + OpenCV")
    print("=" * 60)
    
    results = []
    
    # Test 1: Import
    results.append(test_scanner_import())
    
    if not results[-1]:
        print("\n❌ Cannot proceed without scanner module")
        sys.exit(1)
    
    # Test 2: Initialization
    success, scanner = test_scanner_initialization()
    results.append(success)
    
    if not success:
        print("\n❌ Cannot proceed without scanner initialization")
        sys.exit(1)
    
    # Test 3-6: Core functionality
    results.append(test_image_preprocessing(scanner))
    results.append(test_feature_extraction(scanner))
    results.append(test_quality_classification(scanner))
    results.append(test_full_scan(scanner))
    
    # Test 7-8: API tests (optional)
    results.append(test_api_health())
    results.append(test_api_scan())
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total} ({100*passed/total:.1f}%)")
    
    if passed == total:
        print("\n🎉 All tests passed! AI Quality Shield is ready to use.")
    elif passed >= total - 2:
        print("\n✅ Core functionality works! API tests may require server to be running.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
