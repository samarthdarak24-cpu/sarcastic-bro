const DUMMY_SECURITY_DATA = {
  securityScore: 85,
  activeProtections: 8,
  alerts: 3,
  blockedAttempts: 12,
  trustedDevices: 4,
  features: [
    {
      id: 'f1',
      name: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with 2FA',
      icon: '🔐',
      enabled: true
    },
    {
      id: 'f2',
      name: 'Biometric Login',
      description: 'Use fingerprint or face recognition',
      icon: '👆',
      enabled: true
    },
    {
      id: 'f3',
      name: 'Login Alerts',
      description: 'Get notified of new login attempts',
      icon: '📧',
      enabled: true
    },
    {
      id: 'f4',
      name: 'Transaction Verification',
      description: 'Verify all financial transactions',
      icon: '💳',
      enabled: true
    },
    {
      id: 'f5',
      name: 'IP Whitelisting',
      description: 'Restrict access to trusted IPs',
      icon: '🌐',
      enabled: false
    },
    {
      id: 'f6',
      name: 'Session Timeout',
      description: 'Auto-logout after inactivity',
      icon: '⏱️',
      enabled: true
    }
  ],
  recentActivity: [
    {
      id: 'a1',
      title: 'Successful Login',
      description: 'Login from Chrome on Windows',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'success',
      icon: '✅',
      severity: 'low'
    },
    {
      id: 'a2',
      title: 'Failed Login Attempt',
      description: 'Blocked login attempt from unknown device',
      timestamp: '2024-01-15T08:15:00Z',
      type: 'warning',
      icon: '⚠️',
      severity: 'medium'
    },
    {
      id: 'a3',
      title: 'Password Changed',
      description: 'Your password was successfully updated',
      timestamp: '2024-01-14T16:45:00Z',
      type: 'success',
      icon: '🔑',
      severity: 'low'
    },
    {
      id: 'a4',
      title: 'New Device Added',
      description: 'iPhone 13 added to trusted devices',
      timestamp: '2024-01-14T12:00:00Z',
      type: 'info',
      icon: '📱',
      severity: 'low'
    },
    {
      id: 'a5',
      title: 'Suspicious Activity Detected',
      description: 'Multiple failed login attempts from foreign IP',
      timestamp: '2024-01-13T22:30:00Z',
      type: 'error',
      icon: '🚨',
      severity: 'high'
    }
  ]
};

class SecurityService {
  async getSecurityOverview() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_SECURITY_DATA;
  }

  async toggleFeature(featureId: string, enabled: boolean) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, featureId, enabled };
  }

  async getActivityLog(days: number = 7) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return DUMMY_SECURITY_DATA.recentActivity;
  }
}

export const securityService = new SecurityService();
