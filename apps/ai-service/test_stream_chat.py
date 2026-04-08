#!/usr/bin/env python3
"""
Test Stream AI Chat functionality
"""

import asyncio
import os
from app.services.agricultural_knowledge import AgricultureKnowledgeBase

async def test_knowledge_base():
    """Test the agricultural knowledge base"""
    print("🧪 Testing Agricultural Knowledge Base...")
    
    try:
        kb = AgricultureKnowledgeBase()
        print(f"✅ Knowledge Base loaded with {len(kb.knowledge_data)} entries")
        
        # Test search functionality
        results = await kb.search('wheat planting')
        print(f"✅ Search for 'wheat planting': {len(results)} results")
        
        if results:
            top_result = results[0]
            print(f"   Top result: {top_result.get('title', 'No title')}")
            print(f"   Relevance score: {top_result.get('relevance_score', 0)}")
        
        # Test categories
        categories = kb.get_categories()
        print(f"✅ Available categories: {len(categories)} total")
        print(f"   Categories: {', '.join(categories[:5])}...")
        
        # Test crops
        crops = kb.get_crops()
        print(f"✅ Available crops: {len(crops)} total")
        print(f"   Crops: {', '.join(crops[:5])}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Knowledge Base test failed: {e}")
        return False

def test_stream_imports():
    """Test Stream Chat imports"""
    print("🧪 Testing Stream Chat Imports...")
    
    try:
        from stream_chat import StreamChat
        print("✅ StreamChat imported successfully")
        
        import jwt
        print("✅ PyJWT imported successfully")
        
        import httpx
        print("✅ httpx imported successfully")
        
        import openai
        print("✅ openai imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False

def test_environment():
    """Test environment configuration"""
    print("🧪 Testing Environment Configuration...")
    
    # Check for Stream API credentials
    stream_key = os.getenv("STREAM_API_KEY")
    stream_secret = os.getenv("STREAM_API_SECRET")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if stream_key:
        print("✅ STREAM_API_KEY is configured")
    else:
        print("⚠️  STREAM_API_KEY is not configured")
    
    if stream_secret:
        print("✅ STREAM_API_SECRET is configured")
    else:
        print("⚠️  STREAM_API_SECRET is not configured")
    
    if openai_key:
        print("✅ OPENAI_API_KEY is configured")
    else:
        print("⚠️  OPENAI_API_KEY is not configured")
    
    return bool(stream_key and stream_secret and openai_key)

async def test_router_import():
    """Test router import"""
    print("🧪 Testing Router Import...")
    
    try:
        from app.routers.stream_chat_router import router
        print("✅ Stream Chat router imported successfully")
        return True
    except Exception as e:
        print(f"❌ Router import failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Stream AI Chat Test Suite")
    print("=" * 50)
    
    tests = [
        ("Stream Imports", test_stream_imports),
        ("Environment Config", test_environment),
        ("Knowledge Base", test_knowledge_base),
        ("Router Import", test_router_import),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        if asyncio.iscoroutinefunction(test_func):
            result = await test_func()
        else:
            result = test_func()
        results.append((test_name, result))
    
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 {passed}/{len(tests)} tests passed")
    
    if passed >= 3:  # Most tests passed
        print("\n🚀 Stream AI Chat is ready!")
        print("   Next steps:")
        print("   1. Configure Stream API credentials")
        print("   2. Start the AI service: python -m app.main")
        print("   3. Test endpoints: test-stream-chat.bat")
    else:
        print("\n⚠️  Some components need attention")
        print("   Run setup-stream-chat.bat for installation")

if __name__ == "__main__":
    asyncio.run(main())