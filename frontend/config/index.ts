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
      aiConfig: '/v1/user/ai-config',
      financeDashboard: '/v1/user/finance-dashboard',
      monthlyTrend: '/v1/user/monthly-trend'
    },
    onboarding: '/v1/onboarding',
    accounts: {
      list: '/v1/accounts',
      create: '/v1/accounts',
      update: (id: string) => `/v1/accounts/${id}`,
      delete: (id: string) => `/v1/accounts/${id}`
    },
    evaluations: {
      list: '/v1/evaluations',
      create: '/v1/evaluations',
      getById: (id: string) => `/v1/evaluations/${id}`
    },
    ai: {
      chat: '/v3/chat/completions'
    }
  }
} as const 