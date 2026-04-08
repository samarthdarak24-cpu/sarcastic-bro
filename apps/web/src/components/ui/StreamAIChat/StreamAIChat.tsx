'use client';

import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
  LoadingIndicator,
  Avatar,
} from 'stream-chat-react';
import { Bot, Users, Settings, Zap, Brain, Leaf, TrendingUp, Bug, FlaskConical } from 'lucide-react';

import 'stream-chat-react/dist/css/v2/index.css';

// Types
interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  specialties: string[];
}

interface StreamAIChatProps {
  userId: string;
  userName: string;
  userRole?: string;
  className?: string;
}

const StreamAIChat: React.FC<StreamAIChatProps> = ({
  userId,
  userName,
  userRole = 'farmer',
  className = ''
}) => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [availableAgents] = useState<AgentType[]>([
    {
      id: 'crop_advisor',
      name: 'Crop Advisor',
      description: 'Expert in crop selection, planting, and cultivation',
      icon: <Leaf className="w-5 h-5" />,
      specialties: ['Crop selection', 'Planting schedules', 'Cultivation practices', 'Yield optimization']
    },
    {
      id: 'market_analyst',
      name: 'Market Analyst',
      description: 'Specialist in agricultural market trends and pricing',
      icon: <TrendingUp className="w-5 h-5" />,
      specialties: ['Price analysis', 'Market trends', 'Demand forecasting', 'Selling strategies']
    },
    {
      id: 'pest_expert',
      name: 'Pest & Disease Expert',
      description: 'Expert in pest control and disease management',
      icon: <Bug className="w-5 h-5" />,
      specialties: ['Pest identification', 'Disease diagnosis', 'IPM strategies', 'Treatment options']
    },
    {
      id: 'soil_scientist',
      name: 'Soil Scientist',
      description: 'Specialist in soil health and fertility management',
      icon: <FlaskConical className="w-5 h-5" />,
      specialties: ['Soil testing', 'Fertility management', 'Soil health', 'Nutrient planning']
    },
    {
      id: 'general_advisor',
      name: 'General Agricultural Advisor',
      description: 'All-round agricultural consultant',
      icon: <Brain className="w-5 h-5" />,
      specialties: ['General farming', 'Best practices', 'Problem solving', 'Resource guidance']
    }
  ]);

  useEffect(() => {
    initializeChat();
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      setLoading(true);

      // Initialize Stream Chat client
      const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);

      // Get authentication token
      const tokenResponse = await fetch('/api/stream-chat/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get authentication token');
      }

      const { token } = await tokenResponse.json();

      // Connect user
      await chatClient.connectUser(
        {
          id: userId,
          name: userName,
          role: userRole,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        },
        token
      );

      // Create or get channel
      const channelId = `agricultural_chat_${userId}`;
      const chatChannel = chatClient.channel('messaging', channelId, {
        name: `${userName}'s Agricultural Chat`,
        members: [userId],
        created_by_id: userId,
      });

      await chatChannel.create();

      setClient(chatClient);
      setChannel(chatChannel);
      setLoading(false);

    } catch (error) {
      console.error('Chat initialization error:', error);
      setLoading(false);
    }
  };

  const startAgent = async (agentType: string) => {
    try {
      const response = await fetch('/api/stream-chat/agents/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channel.id,
          agent_type: agentType,
          user_id: userId
        })
      });

      if (response.ok) {
        setActiveAgents(prev => [...prev.filter(id => id !== agentType), agentType]);
      }
    } catch (error) {
      console.error('Failed to start agent:', error);
    }
  };

  const stopAgent = async (agentType: string) => {
    try {
      const response = await fetch('/api/stream-chat/agents/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channel.id,
          agent_type: agentType
        })
      });

      if (response.ok) {
        setActiveAgents(prev => prev.filter(id => id !== agentType));
      }
    } catch (error) {
      console.error('Failed to stop agent:', error);
    }
  };

  const CustomMessage = (props: any) => {
    const { message } = props;
    
    if (message.type === 'agent_message' || message.type === 'agent_response') {
      return (
        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 my-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-green-700">
                {message.agent_name || 'AI Agent'}
              </span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {message.agent_type}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">Sources: </span>
                {message.sources.join(', ')}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <LoadingIndicator size={40} />
        <span className="ml-3 text-gray-600">Initializing AI Chat...</span>
      </div>
    );
  }

  if (!client || !channel) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Failed to initialize chat. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex ${className}`}>
      <Chat client={client} theme="str-chat__theme-light">
        {/* Sidebar with Agent Controls */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI Agricultural Agents</h3>
                <p className="text-sm text-gray-600">Choose your farming experts</p>
              </div>
            </div>
          </div>

          {/* Active Agents */}
          {activeAgents.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-green-500" />
                Active Agents ({activeAgents.length})
              </h4>
              <div className="space-y-2">
                {activeAgents.map(agentId => {
                  const agent = availableAgents.find(a => a.id === agentId);
                  return agent ? (
                    <div key={agentId} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {agent.icon}
                        <span className="text-sm font-medium text-green-700">{agent.name}</span>
                      </div>
                      <button
                        onClick={() => stopAgent(agentId)}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Available Agents */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Available Experts
            </h4>
            <div className="space-y-3">
              {availableAgents.map(agent => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {agent.icon}
                      <span className="font-medium text-gray-800">{agent.name}</span>
                    </div>
                    <button
                      onClick={() => startAgent(agent.id)}
                      disabled={activeAgents.includes(agent.id)}
                      className={`text-xs px-3 py-1 rounded transition-colors ${
                        activeAgents.includes(agent.id)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {activeAgents.includes(agent.id) ? 'Active' : 'Start'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{agent.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.slice(0, 2).map(specialty => (
                      <span key={specialty} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <Channel channel={channel} Message={CustomMessage}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </div>
      </Chat>
    </div>
  );
};

export default StreamAIChat;