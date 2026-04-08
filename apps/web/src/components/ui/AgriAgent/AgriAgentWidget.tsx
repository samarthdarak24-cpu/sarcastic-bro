/**
 * AgriAgent Widget - Autonomous AI Agent Interface
 * Like AgentGPT but for agriculture
 */

'use client';

import React, { useState } from 'react';
import { Bot, Play, X, CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { agriAgent, AgentGoal, AgentTask } from '@/services/agriAgentService';
import toast from 'react-hot-toast';

interface AgriAgentWidgetProps {
  userRole: 'FARMER' | 'BUYER';
  isOpen: boolean;
  onClose: () => void;
}

export const AgriAgentWidget: React.FC<AgriAgentWidgetProps> = ({
  userRole,
  isOpen,
  onClose
}) => {
  const [goal, setGoal] = useState('');
  const [agentGoal, setAgentGoal] = useState<AgentGoal | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleStartAgent = async () => {
    if (!goal.trim()) {
      toast.error('Please enter a goal');
      return;
    }

    setIsExecuting(true);

    try {
      console.log('🤖 Starting AgriAgent...');
      
      // Create goal
      const newGoal = await agriAgent.createGoal(goal, userRole);
      setAgentGoal(newGoal);
      
      toast.success('Agent started! Watch it work...');
      
      // Execute autonomously with progress updates
      await agriAgent.executeGoal(newGoal.id, (updatedGoal) => {
        setAgentGoal({ ...updatedGoal });
      });
      
      toast.success('Agent completed all tasks!');
    } catch (error: any) {
      console.error('Agent error:', error);
      toast.error('Agent failed: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setGoal('');
    setAgentGoal(null);
    setIsExecuting(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Widget */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">AgriAgent</h2>
              <p className="text-sm text-white/80">Autonomous AI Assistant for {userRole === 'FARMER' ? 'Farmers' : 'Buyers'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!agentGoal ? (
            /* Goal Input */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  What would you like me to do?
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={
                    userRole === 'FARMER'
                      ? 'e.g., Find the best market to sell my tomatoes\ne.g., Help me list my wheat harvest\ne.g., Check current potato prices'
                      : 'e.g., Find reliable tomato suppliers in Pune\ne.g., Source 1000 kg organic wheat\ne.g., Compare prices for bulk vegetables'
                  }
                  className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-purple-500 resize-none"
                  disabled={isExecuting}
                />
              </div>

              <button
                onClick={handleStartAgent}
                disabled={isExecuting || !goal.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Agent Working...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Start Agent
                  </>
                )}
              </button>

              {/* Example Goals */}
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Example Goals:
                </p>
                <div className="space-y-2">
                  {(userRole === 'FARMER' ? [
                    'Find best prices for my tomatoes in Maharashtra',
                    'Help me create optimal product listings',
                    'Analyze market trends for wheat'
                  ] : [
                    'Find reliable organic vegetable suppliers',
                    'Compare prices for bulk rice purchase',
                    'Verify quality certifications for suppliers'
                  ]).map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGoal(example)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 transition-colors"
                    >
                      💡 {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Agent Progress */
            <div className="space-y-4">
              {/* Goal */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <Bot size={24} className="text-purple-600 shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                      Goal
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {agentGoal.goal}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-purple-600">
                    {Math.round(agentGoal.progress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                    style={{ width: `${agentGoal.progress}%` }}
                  />
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tasks
                </p>
                {agentGoal.tasks.map((task, idx) => (
                  <TaskItem key={task.id} task={task} index={idx + 1} />
                ))}
              </div>

              {/* Actions */}
              {agentGoal.status === 'completed' && (
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  Start New Goal
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 shrink-0">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <p className="text-xs text-purple-800">
              🤖 Powered by AgriAgent - Autonomous AI for Agriculture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{ task: AgentTask; index: number }> = ({ task, index }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle size={18} className="text-emerald-600" />;
      case 'executing':
        return <Loader size={18} className="text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-200';
      case 'executing':
        return 'bg-blue-50 border-blue-200 animate-pulse';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-3 rounded-xl border-2 transition-all ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {index}. {task.description}
          </p>
          {task.result && (
            <div className="mt-2 p-2 bg-white rounded-lg">
              <p className="text-xs text-gray-700">{task.result}</p>
            </div>
          )}
          {task.error && (
            <div className="mt-2 p-2 bg-red-100 rounded-lg">
              <p className="text-xs text-red-700">Error: {task.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgriAgentWidget;
