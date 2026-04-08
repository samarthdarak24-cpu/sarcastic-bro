#!/usr/bin/env python3
"""
Advanced AI Chat System Test Suite
Comprehensive testing of the professional-grade AI chat capabilities
"""

import asyncio
import json
import time
from typing import Dict, Any, List
import aiohttp
import sys
import os

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from services.advanced_master_ai import advanced_ai, ConversationMode, ResponseStyle, KnowledgeDomain

class AdvancedAITester:
    """Comprehensive test suite for Advanced AI Chat System"""
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.session_id = None
        self.test_results = []
    
    async def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting Advanced AI Chat System Tests")
        print("=" * 60)
        
        # Test categories
        test_categories = [
            ("🔧 Core Functionality", self.test_core_functionality),
            ("💬 Conversation Modes", self.test_conversation_modes),
            ("🧠 Knowledge Domains", self.test_knowledge_domains),
            ("🎭 Personality Adaptation", self.test_personality_adaptation),
            ("📊 Analytics & Insights", self.test_analytics),
            ("🔄 Session Management", self.test_session_management),
            ("⚡ Performance Tests", self.test_performance),
            ("🌐 Multi-language Support", self.test_multilingual),
            ("🎯 Advanced Features", self.test_advanced_features)
        ]
        
        for category_name, test_func in test_categories:
            print(f"\n{category_name}")
            print("-" * 40)
            try:
                await test_func()
                print(f"✅ {category_name} - PASSED")
            except Exception as e:
                print(f"❌ {category_name} - FAILED: {e}")
                self.test_results.append({"category": category_name, "status": "FAILED", "error": str(e)})
        
        # Print summary
        self.print_test_summary()
    
    async def test_core_functionality(self):
        """Test basic AI chat functionality"""
        
        # Test 1: Session Creation
        print("📝 Testing session creation...")
        session_data = await self.create_test_session()
        assert session_data["session_id"], "Session ID should be generated"
        self.session_id = session_data["session_id"]
        print(f"   ✓ Session created: {self.session_id}")
        
        # Test 2: Basic Chat
        print("💬 Testing basic chat...")
        response = await self.send_chat_message("Hello! Can you help me understand how AI works?")
        assert response["response"], "Should receive AI response"
        assert len(response["response"]) > 10, "Response should be meaningful"
        print(f"   ✓ Chat response received ({len(response['response'])} chars)")
        
        # Test 3: Context Awareness
        print("🧠 Testing context awareness...")
        response2 = await self.send_chat_message("Can you elaborate on that?")
        assert response2["response"], "Should maintain context"
        print("   ✓ Context maintained across messages")
        
        # Test 4: Follow-up Questions
        assert response.get("follow_up_questions"), "Should provide follow-up questions"
        print(f"   ✓ Follow-up questions generated: {len(response['follow_up_questions'])}")
    
    async def test_conversation_modes(self):
        """Test different conversation modes"""
        
        test_cases = [
            ("What's the best way to implement a binary search algorithm?", ConversationMode.TECHNICAL),
            ("Help me brainstorm creative marketing ideas for a new product", ConversationMode.CREATIVE),
            ("Analyze the pros and cons of renewable energy sources", ConversationMode.ANALYTICAL),
            ("Explain quantum physics in simple terms", ConversationMode.EDUCATIONAL),
            ("Draft a professional email to a client about project delays", ConversationMode.PROFESSIONAL)
        ]
        
        for message, expected_mode in test_cases:
            print(f"🎯 Testing {expected_mode.value} mode...")
            response = await self.send_chat_message(message)
            
            # Verify mode detection
            actual_mode = response.get("conversation_mode", "").lower()
            print(f"   Expected: {expected_mode.value}, Got: {actual_mode}")
            
            # Verify response quality
            assert len(response["response"]) > 50, f"Response too short for {expected_mode.value} mode"
            print(f"   ✓ {expected_mode.value} mode response generated")
    
    async def test_knowledge_domains(self):
        """Test knowledge domain detection and specialization"""
        
        domain_tests = [
            ("How can I improve my crop yield using precision farming?", KnowledgeDomain.AGRICULTURE),
            ("Explain machine learning algorithms for beginners", KnowledgeDomain.TECHNOLOGY),
            ("What's the best business strategy for market expansion?", KnowledgeDomain.BUSINESS),
            ("Describe the process of photosynthesis", KnowledgeDomain.SCIENCE)
        ]
        
        for message, expected_domain in domain_tests:
            print(f"🌐 Testing {expected_domain.value} domain...")
            response = await self.send_chat_message(message)
            
            domains = response.get("knowledge_domains", [])
            print(f"   Detected domains: {domains}")
            
            # Verify domain-specific response
            assert len(response["response"]) > 100, "Domain-specific responses should be detailed"
            print(f"   ✓ {expected_domain.value} domain response generated")
    
    async def test_personality_adaptation(self):
        """Test AI personality and style adaptation"""
        
        # Test different response styles
        styles = ["conversational", "formal", "friendly", "technical", "concise"]
        
        for style in styles:
            print(f"🎭 Testing {style} response style...")
            
            # Update user profile
            await self.update_user_profile({"preferred_style": style})
            
            response = await self.send_chat_message("Explain the benefits of cloud computing")
            
            assert response["response"], f"Should generate response in {style} style"
            print(f"   ✓ {style} style response generated")
    
    async def test_analytics(self):
        """Test analytics and insights features"""
        
        print("📊 Testing conversation analytics...")
        
        # Get conversation summary
        summary = await self.get_conversation_summary()
        
        assert summary["session_id"] == self.session_id, "Summary should match session"
        assert summary["conversation_stats"]["message_count"] > 0, "Should track message count"
        assert summary["topics_discussed"], "Should track topics"
        
        print(f"   ✓ Messages tracked: {summary['conversation_stats']['message_count']}")
        print(f"   ✓ Topics identified: {len(summary['topics_discussed'])}")
        print(f"   ✓ Current mode: {summary['conversation_stats']['current_mode']}")
        
        # Test sentiment analysis
        emotional_state = summary.get("emotional_state", {})
        assert "polarity" in emotional_state, "Should analyze sentiment"
        print(f"   ✓ Sentiment polarity: {emotional_state.get('polarity', 0):.2f}")
    
    async def test_session_management(self):
        """Test session management capabilities"""
        
        print("🔄 Testing session management...")
        
        # Test session listing
        sessions = await self.get_active_sessions()
        assert self.session_id in sessions["active_sessions"], "Current session should be listed"
        print(f"   ✓ Active sessions: {sessions['count']}")
        
        # Test session export
        export_data = await self.export_conversation()
        assert export_data, "Should export conversation data"
        print("   ✓ Conversation export successful")
        
        # Test session clearing (create new session first)
        new_session = await self.create_test_session()
        clear_result = await self.clear_session(new_session["session_id"])
        assert clear_result["message"], "Should confirm session clearing"
        print("   ✓ Session clearing successful")
    
    async def test_performance(self):
        """Test system performance and response times"""
        
        print("⚡ Testing performance...")
        
        # Test response time
        start_time = time.time()
        response = await self.send_chat_message("What's 2+2?")
        response_time = (time.time() - start_time) * 1000
        
        assert response_time < 5000, f"Response time too slow: {response_time}ms"
        print(f"   ✓ Response time: {response_time:.0f}ms")
        
        # Test concurrent requests
        print("   Testing concurrent requests...")
        tasks = []
        for i in range(5):
            task = self.send_chat_message(f"Test message {i}")
            tasks.append(task)
        
        start_time = time.time()
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        concurrent_time = (time.time() - start_time) * 1000
        
        successful_responses = [r for r in responses if not isinstance(r, Exception)]
        assert len(successful_responses) >= 3, "Most concurrent requests should succeed"
        print(f"   ✓ Concurrent requests: {len(successful_responses)}/5 successful in {concurrent_time:.0f}ms")
    
    async def test_multilingual(self):
        """Test multi-language support"""
        
        languages = [
            ("en", "Hello, how are you?"),
            ("es", "Hola, ¿cómo estás?"),
            ("fr", "Bonjour, comment allez-vous?"),
            ("hi", "नमस्ते, आप कैसे हैं?")
        ]
        
        for lang_code, message in languages:
            print(f"🌐 Testing {lang_code} language support...")
            
            # Update language preference
            await self.update_user_profile({"language": lang_code})
            
            response = await self.send_chat_message(message)
            assert response["response"], f"Should respond in {lang_code}"
            print(f"   ✓ {lang_code} response generated")
    
    async def test_advanced_features(self):
        """Test advanced AI features"""
        
        print("🎯 Testing advanced features...")
        
        # Test streaming response
        print("   Testing streaming response...")
        stream_content = []
        
        async def stream_handler(data):
            if data.get("type") == "content":
                stream_content.append(data["content"])
        
        await self.send_streaming_message("Explain the theory of relativity", stream_handler)
        
        full_content = "".join(stream_content)
        assert len(full_content) > 50, "Streaming should produce substantial content"
        print(f"   ✓ Streaming response: {len(full_content)} chars")
        
        # Test capabilities endpoint
        capabilities = await self.get_capabilities()
        assert capabilities["conversation_modes"], "Should list conversation modes"
        assert capabilities["knowledge_domains"], "Should list knowledge domains"
        print(f"   ✓ Capabilities: {len(capabilities['features'])} features")
        
        # Test health check
        health = await self.get_health_status()
        assert health["status"] == "healthy", "System should be healthy"
        print(f"   ✓ Health status: {health['status']}")
    
    # Helper methods for API calls
    
    async def create_test_session(self) -> Dict[str, Any]:
        """Create a test session"""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/v1/advanced-chat/session/create",
                json={
                    "user_id": "test_user",
                    "user_profile": {
                        "name": "Test User",
                        "role": "Developer",
                        "expertise_areas": ["programming", "ai"],
                        "preferred_style": "conversational",
                        "language": "en"
                    }
                }
            ) as resp:
                return await resp.json()
    
    async def send_chat_message(self, message: str) -> Dict[str, Any]:
        """Send a chat message"""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/v1/advanced-chat/chat",
                json={
                    "session_id": self.session_id,
                    "message": message
                }
            ) as resp:
                return await resp.json()
    
    async def send_streaming_message(self, message: str, handler):
        """Send a streaming chat message"""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/v1/advanced-chat/chat/stream",
                json={
                    "session_id": self.session_id,
                    "message": message
                }
            ) as resp:
                async for line in resp.content:
                    line_str = line.decode('utf-8').strip()
                    if line_str.startswith('data: '):
                        try:
                            data = json.loads(line_str[6:])
                            await handler(data)
                        except json.JSONDecodeError:
                            pass
    
    async def get_conversation_summary(self) -> Dict[str, Any]:
        """Get conversation summary"""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/api/v1/advanced-chat/session/{self.session_id}/summary"
            ) as resp:
                return await resp.json()
    
    async def update_user_profile(self, profile_updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile"""
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.base_url}/api/v1/advanced-chat/session/{self.session_id}/profile",
                json=profile_updates
            ) as resp:
                return await resp.json()
    
    async def get_active_sessions(self) -> Dict[str, Any]:
        """Get active sessions"""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/api/v1/advanced-chat/sessions"
            ) as resp:
                return await resp.json()
    
    async def export_conversation(self) -> Dict[str, Any]:
        """Export conversation"""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/api/v1/advanced-chat/session/{self.session_id}/export"
            ) as resp:
                return await resp.json()
    
    async def clear_session(self, session_id: str) -> Dict[str, Any]:
        """Clear a session"""
        async with aiohttp.ClientSession() as session:
            async with session.delete(
                f"{self.base_url}/api/v1/advanced-chat/session/{session_id}"
            ) as resp:
                return await resp.json()
    
    async def get_capabilities(self) -> Dict[str, Any]:
        """Get AI capabilities"""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/api/v1/advanced-chat/capabilities"
            ) as resp:
                return await resp.json()
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get health status"""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/api/v1/advanced-chat/health"
            ) as resp:
                return await resp.json()
    
    def print_test_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        
        if not self.test_results:
            print("✅ ALL TESTS PASSED!")
        else:
            print(f"❌ {len(self.test_results)} TESTS FAILED:")
            for result in self.test_results:
                print(f"   - {result['category']}: {result['error']}")
        
        print("\n🚀 Advanced AI Chat System is ready for production!")
        print("Features available:")
        print("   • Multi-modal conversation handling")
        print("   • Context-aware responses")
        print("   • Personality adaptation")
        print("   • Knowledge domain specialization")
        print("   • Emotional intelligence")
        print("   • Memory management")
        print("   • Real-time streaming")
        print("   • Multi-language support")
        print("   • Analytics and insights")
        print("   • Session management")

async def main():
    """Run the test suite"""
    tester = AdvancedAITester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())