/**
 * AgriAgent - Autonomous AI Agent for Agricultural Tasks
 * Inspired by AgentGPT but customized for agriculture
 */

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface AgentGoal {
  id: string;
  goal: string;
  tasks: AgentTask[];
  status: 'planning' | 'executing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

class AgriAgentService {
  private goals: Map<string, AgentGoal> = new Map();

  /**
   * Create a new goal and plan tasks
   */
  async createGoal(goalDescription: string, userRole: 'FARMER' | 'BUYER'): Promise<AgentGoal> {
    console.log(`🤖 [AGENT] Creating goal: "${goalDescription}"`);
    
    const goalId = `goal_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    // Plan tasks using AI
    const tasks = await this.planTasks(goalDescription, userRole);
    
    const goal: AgentGoal = {
      id: goalId,
      goal: goalDescription,
      tasks,
      status: 'planning',
      progress: 0,
      createdAt: new Date()
    };
    
    this.goals.set(goalId, goal);
    console.log(`✅ [AGENT] Goal created with ${tasks.length} tasks`);
    
    return goal;
  }

  /**
   * Plan tasks using AI
   */
  private async planTasks(goal: string, userRole: 'FARMER' | 'BUYER'): Promise<AgentTask[]> {
    console.log(`🧠 [AGENT] Planning tasks for goal...`);
    
    try {
      // Use AI to break down goal into tasks
      const response = await fetch('http://localhost:8001/api/v1/simple-chat/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are an agricultural AI agent. Break down this goal into 3-5 specific, actionable tasks:

Goal: ${goal}
User Role: ${userRole}

Return ONLY a numbered list of tasks, one per line. Example:
1. Check current market prices
2. Find available suppliers
3. Compare quality ratings

Tasks:`
        })
      });

      const data = await response.json();
      const aiResponse = data.response || '';
      
      console.log(`📝 [AGENT] AI response:`, aiResponse);
      
      // Parse tasks from AI response
      const tasks = this.parseTasksFromAI(aiResponse);
      
      if (tasks.length === 0) {
        // Fallback tasks if AI parsing fails
        return this.getFallbackTasks(goal, userRole);
      }
      
      return tasks;
    } catch (error) {
      console.error('❌ [AGENT] Task planning failed:', error);
      return this.getFallbackTasks(goal, userRole);
    }
  }

  /**
   * Parse tasks from AI response
   */
  private parseTasksFromAI(aiResponse: string): AgentTask[] {
    const tasks: AgentTask[] = [];
    const lines = aiResponse.split("\n");
    
    for (const line of lines) {
      // Match numbered tasks: "1. Task description" or "1) Task description"
      const match = line.match(/^\s*(\d+)[.)]\s*(.+)$/);
      if (match) {
        const description = match[2].trim();
        if (description) {
          tasks.push({
            id: `task_${Date.now()}_${tasks.length}`,
            description,
            status: 'pending'
          });
        }
      }
    }
    
    return tasks;
  }

  /**
   * Fallback tasks if AI fails
   */
  private getFallbackTasks(goal: string, userRole: 'FARMER' | 'BUYER'): AgentTask[] {
    const lowerGoal = goal.toLowerCase();
    
    if (userRole === 'FARMER') {
      if (lowerGoal.includes('price') || lowerGoal.includes('market')) {
        return [
          { id: 'task_1', description: 'Check current market prices', status: 'pending' },
          { id: 'task_2', description: 'Analyze price trends', status: 'pending' },
          { id: 'task_3', description: 'Find best selling locations', status: 'pending' }
        ];
      } else if (lowerGoal.includes('sell') || lowerGoal.includes('list')) {
        return [
          { id: 'task_1', description: 'Prepare product details', status: 'pending' },
          { id: 'task_2', description: 'Set competitive price', status: 'pending' },
          { id: 'task_3', description: 'List product on marketplace', status: 'pending' }
        ];
      }
    } else {
      if (lowerGoal.includes('find') || lowerGoal.includes('search')) {
        return [
          { id: 'task_1', description: 'Search available products', status: 'pending' },
          { id: 'task_2', description: 'Check supplier ratings', status: 'pending' },
          { id: 'task_3', description: 'Compare prices and quality', status: 'pending' }
        ];
      }
    }
    
    // Generic fallback
    return [
      { id: 'task_1', description: 'Analyze the request', status: 'pending' },
      { id: 'task_2', description: 'Gather relevant information', status: 'pending' },
      { id: 'task_3', description: 'Provide recommendations', status: 'pending' }
    ];
  }

  /**
   * Execute goal autonomously
   */
  async executeGoal(goalId: string, onProgress?: (goal: AgentGoal) => void): Promise<AgentGoal> {
    const goal = this.goals.get(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    console.log(`🚀 [AGENT] Executing goal: "${goal.goal}"`);
    goal.status = 'executing';

    for (let i = 0; i < goal.tasks.length; i++) {
      const task = goal.tasks[i];
      
      try {
        await this.executeTask(task, goal);
        
        // Update progress
        goal.progress = ((i + 1) / goal.tasks.length) * 100;
        
        // Notify progress
        if (onProgress) {
          onProgress({ ...goal });
        }
        
        // Small delay between tasks
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        console.error(`❌ [AGENT] Task failed:`, error);
        task.status = 'failed';
        task.error = error.message;
        goal.status = 'failed';
        break;
      }
    }

    if (goal.status !== 'failed') {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    console.log(`✅ [AGENT] Goal ${goal.status}: "${goal.goal}"`);
    return goal;
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: AgentTask, goal: AgentGoal): Promise<void> {
    console.log(`⚡ [AGENT] Executing task: "${task.description}"`);
    
    task.status = 'executing';
    task.startTime = new Date();

    try {
      // Use AI to execute the task
      const response = await fetch('http://localhost:8001/api/v1/simple-chat/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Execute this task for the goal "${goal.goal}":

Task: ${task.description}

Provide a brief result or recommendation.`
        })
      });

      const data = await response.json();
      task.result = data.response || 'Task completed';
      task.status = 'completed';
      task.endTime = new Date();
      
      console.log(`✅ [AGENT] Task completed: "${task.description}"`);
    } catch (error: any) {
      console.error(`❌ [AGENT] Task execution failed:`, error);
      task.status = 'failed';
      task.error = error.message;
      task.endTime = new Date();
      throw error;
    }
  }

  /**
   * Get goal by ID
   */
  getGoal(goalId: string): AgentGoal | undefined {
    return this.goals.get(goalId);
  }

  /**
   * Get all goals
   */
  getAllGoals(): AgentGoal[] {
    return Array.from(this.goals.values());
  }

  /**
   * Clear goal
   */
  clearGoal(goalId: string): void {
    this.goals.delete(goalId);
  }

  /**
   * Clear all goals
   */
  clearAllGoals(): void {
    this.goals.clear();
  }
}

export const agriAgent = new AgriAgentService();
export default agriAgent;

