// Mock authentication service for development/testing
// This simulates backend responses without needing a running server

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'FARMER' | 'BUYER';
  phone?: string;
}

// Mock database of users
const mockUsers: Record<string, { password: string; user: MockUser }> = {
  'farmer@test.com': {
    password: 'Farmer123',
    user: {
      id: 'farmer-001',
      name: 'Rajesh Kumar',
      email: 'farmer@test.com',
      role: 'FARMER',
      phone: '9876543210'
    }
  },
  'buyer@test.com': {
    password: 'Buyer123',
    user: {
      id: 'buyer-001',
      name: 'Priya Sharma',
      email: 'buyer@test.com',
      role: 'BUYER',
      phone: '9123456789'
    }
  }
};

export const mockAuthService = {
  async login(email: string, password: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers[email.toLowerCase()];
    
    if (!user) {
      throw {
        response: {
          status: 401,
          data: {
            message: 'Invalid email or password'
          }
        }
      };
    }

    if (user.password !== password) {
      throw {
        response: {
          status: 401,
          data: {
            message: 'Invalid email or password'
          }
        }
      };
    }

    // Generate mock tokens
    const accessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('✅ Mock login successful:', { 
      email: user.user.email, 
      role: user.user.role,
      name: user.user.name 
    });

    return {
      tokens: {
        accessToken,
        refreshToken
      },
      token: accessToken, // For backward compatibility
      user: user.user
    };
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'FARMER' | 'BUYER';
    phone?: string;
  }) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const email = data.email.toLowerCase();

    // Check if user already exists
    if (mockUsers[email]) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Email already registered'
          }
        }
      };
    }

    // Validate password format
    if (data.password.length < 8) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Password must be at least 8 characters'
          }
        }
      };
    }

    if (!/[A-Z]/.test(data.password)) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Password must contain at least one uppercase letter'
          }
        }
      };
    }

    if (!/[0-9]/.test(data.password)) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Password must contain at least one number'
          }
        }
      };
    }

    // Create new user
    const newUser: MockUser = {
      id: `${data.role.toLowerCase()}-${Date.now()}`,
      name: data.name,
      email: email,
      role: data.role,
      phone: data.phone
    };

    // Store in mock database
    mockUsers[email] = {
      password: data.password,
      user: newUser
    };

    // Generate mock tokens
    const accessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('✅ Mock registration successful:', { 
      email: newUser.email, 
      role: newUser.role,
      name: newUser.name 
    });

    return {
      tokens: {
        accessToken,
        refreshToken
      },
      token: accessToken, // For backward compatibility
      user: newUser
    };
  }
};
