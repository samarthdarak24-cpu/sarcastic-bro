"""
Integration test for Ollama AI Chat System
Tests the complete flow from user input to AI response
"""

import asyncio
import json
import sys
import os

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.ollama_service import OllamaService, OllamaMessage, OllamaConfig
from app.services.agricultural_knowledge import AgriculturalKnowledge
from app.routers.ollama_chat_router import AgriPromptBuilder, LanguageDetector

async def test_ollama_service():
    """Test basic Ollama service functionality"""
    print("🧪 Testing Ollama Service...")
    
    config = OllamaConfig(model="llama3.2")
    
    async with OllamaService(config) as ollama:
        # Test health check
        is_healthy = await ollama.health_check()
        print(f"   Health Check: {'✅ PASS' if is_healthy else '❌ FAIL'}")
        
        if not is_healthy:
            print("   ⚠️  Ollama service is not available. Please ensure Ollama is running.")
            return False
        
        # Test model availability
        models = await ollama.get_available_models()
        print(f"   Available Models: {models}")
        
        if "llama3.2" not in models:
            print("   ⚠️  llama3.2 model not found. Please run: ollama pull llama3.2")
            return False
        
        # Test simple chat
        messages = [
            OllamaMessage(role="system", content="You are a helpful assistant."),
            OllamaMessage(role="user", content="Hello, how are you?")
        ]
        
        print("   Testing chat completion...")
        result = await ollama.chat_complete(messages)
        
        if result["success"]:
            print(f"   Chat Response: {result['response'][:100]}...")
            print("   ✅ Chat completion test PASSED")
            return True
        else:
            print(f"   ❌ Chat completion test FAILED: {result['error']}")
            return False

async def test_agricultural_knowledge():
    """Test agricultural knowledge base"""
    print("\n🌾 Testing Agricultural Knowledge Base...")
    
    knowledge = AgriculturalKnowledge()
    await knowledge.initialize()
    
    # Test crop info
    tomato_info = await knowledge.get_crop_info("tomato")
    print(f"   Tomato Info: {'✅ PASS' if tomato_info else '❌ FAIL'}")
    
    # Test market prices
    prices = await knowledge.get_market_prices("Maharashtra")
    print(f"   Market Prices: {'✅ PASS' if prices else '❌ FAIL'}")
    
    # Test crop recommendations
    recommendations = await knowledge.get_crop_recommendations("Maharashtra", "kharif")
    print(f"   Crop Recommendations: {'✅ PASS' if recommendations else '❌ FAIL'}")
    
    # Test pest info
    pest_info = await knowledge.get_pest_info("aphids")
    print(f"   Pest Info: {'✅ PASS' if pest_info else '❌ FAIL'}")
    
    return True

async def test_language_detection():
    """Test language detection functionality"""
    print("\n🗣️  Testing Language Detection...")
    
    # Test English
    lang_en = LanguageDetector.detect_language("What crops should I grow?")
    print(f"   English Detection: {'✅ PASS' if lang_en == 'en' else '❌ FAIL'}")
    
    # Test Hindi
    lang_hi = LanguageDetector.detect_language("मुझे अच्छी फसल चाहिए")
    print(f"   Hindi Detection: {'✅ PASS' if lang_hi == 'hi' else '❌ FAIL'}")
    
    # Test Marathi
    lang_mr = LanguageDetector.detect_language("मला चांगले पीक आहे")
    print(f"   Marathi Detection: {'✅ PASS' if lang_mr == 'mr' else '❌ FAIL'}")
    
    return True

async def test_prompt_building():
    """Test agricultural prompt building"""
    print("\n📝 Testing Prompt Building...")
    
    knowledge = AgriculturalKnowledge()
    await knowledge.initialize()
    
    builder = AgriPromptBuilder(knowledge)
    
    # Test farmer context
    from app.routers.ollama_chat_router import UserContext
    farmer_context = UserContext(
        user_id="test_farmer",
        role="FARMER",
        location="Maharashtra",
        crops=["tomato", "onion"],
        language="en",
        session_id="test_session"
    )
    
    prompt = await builder.build_system_prompt(farmer_context, "What should I grow?")
    
    # Check if prompt contains expected elements
    has_role = "FARMER" in prompt
    has_location = "Maharashtra" in prompt
    has_crops = "tomato" in prompt or "onion" in prompt
    
    print(f"   Farmer Prompt Building: {'✅ PASS' if has_role and has_location and has_crops else '❌ FAIL'}")
    
    return True

async def test_complete_flow():
    """Test complete chat flow"""
    print("\n🔄 Testing Complete Chat Flow...")
    
    try:
        # Initialize services
        knowledge = AgriculturalKnowledge()
        await knowledge.initialize()
        
        config = OllamaConfig(model="llama3.2")
        
        async with OllamaService(config) as ollama:
            # Check if Ollama is available
            if not await ollama.health_check():
                print("   ⚠️  Skipping complete flow test - Ollama not available")
                return False
            
            # Build context
            builder = AgriPromptBuilder(knowledge)
            
            from app.routers.ollama_chat_router import UserContext
            user_context = UserContext(
                user_id="test_user",
                role="FARMER",
                location="Maharashtra",
                crops=["tomato"],
                language="en",
                session_id="test_session"
            )
            
            # Build prompt
            system_prompt = await builder.build_system_prompt(
                user_context, 
                "What is the best time to plant tomatoes?"
            )
            
            # Prepare messages
            messages = [
                OllamaMessage(role="system", content=system_prompt),
                OllamaMessage(role="user", content="What is the best time to plant tomatoes?")
            ]
            
            # Test streaming
            print("   Testing streaming response...")
            chunk_count = 0
            content_received = False
            
            async for chunk in ollama.chat_stream(messages):
                chunk_count += 1
                if chunk.type == "content" and chunk.content:
                    content_received = True
                elif chunk.type == "done":
                    break
                elif chunk.type == "error":
                    print(f"   ❌ Stream error: {chunk.error}")
                    return False
            
            success = chunk_count > 0 and content_received
            print(f"   Complete Flow: {'✅ PASS' if success else '❌ FAIL'}")
            print(f"   Chunks Received: {chunk_count}")
            
            return success
            
    except Exception as e:
        print(f"   ❌ Complete flow test FAILED: {str(e)}")
        return False

async def main():
    """Run all tests"""
    print("========================================")
    print("   OLLAMA AI CHAT SYSTEM TESTS")
    print("========================================")
    
    tests = [
        ("Ollama Service", test_ollama_service),
        ("Agricultural Knowledge", test_agricultural_knowledge),
        ("Language Detection", test_language_detection),
        ("Prompt Building", test_prompt_building),
        ("Complete Flow", test_complete_flow),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"   ❌ {test_name} test FAILED with exception: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n========================================")
    print("   TEST RESULTS SUMMARY")
    print("========================================")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n   Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Ollama AI Chat System is working correctly.")
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please check the issues above.")
    
    print("\n========================================")
    print("   NEXT STEPS")
    print("========================================")
    
    if passed == total:
        print("   1. Start all services: start-ollama-chat.bat")
        print("   2. Open browser: http://localhost:3000/ollama-chat")
        print("   3. Start chatting with your AI assistant!")
    else:
        print("   1. Ensure Ollama is installed and running")
        print("   2. Download required model: ollama pull llama3.2")
        print("   3. Run tests again: python test_ollama_integration.py")
    
    return passed == total

if __name__ == "__main__":
    asyncio.run(main())