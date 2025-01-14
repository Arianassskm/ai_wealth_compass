export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  apiEndpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register'
    },
    user: {
      profile: '/v1/user/profile',
      updateProfile: '/v1/user/profile',
      aiConfig: '/v1/user/ai-config'
    },
    onboarding: '/v1/onboarding'
  }
} as const 