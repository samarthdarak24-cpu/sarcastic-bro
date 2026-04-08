// API Connection Test Utility
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function testAPIConnection(): Promise<{
  connected: boolean;
  message: string;
  details?: any;
}> {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000,
    });
    
    return {
      connected: true,
      message: 'API is reachable',
      details: response.data,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error.message || 'Cannot connect to API',
      details: {
        url: API_URL,
        error: error.code || error.message,
      },
    };
  }
}

export async function testLogin(email: string, password: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email: email.trim().toLowerCase(),
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    return {
      success: true,
      message: 'Login successful',
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login failed',
      error: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      },
    };
  }
}
