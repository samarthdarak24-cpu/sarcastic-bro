// Mock authentication service for development/fallback
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'FARMER' | 'BUYER' | 'FPO';
  };
}

// Mock users database
const mockUsers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'farmer@test.com',
    password: 'Farmer123',
    role: 'FARMER' as const,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'buyer@test.com',
    password: 'Buyer123',
    role: 'BUYER' as const,
  },
  {
    id: '3',
    name: 'Sahakari FPO',
    email: 'fpo@test.com',
    password: 'Fpo123',
    role: 'FPO' as const,
  },
];

export const mockAuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('🔧 Mock Auth: Login attempt', { email });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    console.log('✅ Mock Auth: Login successful', { user: user.name, role: user.role });
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'FARMER' | 'BUYER' | 'FPO';
    phone?: string;
  }): Promise<AuthResponse> {
    console.log('🔧 Mock Auth: Registration attempt', { email: data.email, role: data.role });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };
    
    mockUsers.push(newUser);
    
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    
    console.log('✅ Mock Auth: Registration successful', { user: newUser.name, role: newUser.role });
    
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  },
};
