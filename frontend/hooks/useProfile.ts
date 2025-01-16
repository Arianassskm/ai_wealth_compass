import { useState, useEffect } from 'react';
import { useAuthContext } from '@/providers/auth-provider';
import { fetchApi } from '@/lib/api';
import { config } from '@/config';

export type ProfileBudgetCategory = {
  name: string;
  spent_amount: number;
  amount: number;
  color?: string;
  sub_categories: Array<{
    name: string;
    spent_amount: number;
  }>;
}

export type ProfileData = {
  ai_evaluation_details: {
    budget_settings: {
      total_budget: number;
      categories: ProfileBudgetCategory[];
    };
  };
  // 其他 profile 相关数据...
}

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchApi(config.apiEndpoints.user.profile, {
          token
        });

        if (!response.success) {
          throw new Error('获取用户数据失败');
        }

        const data = await response.data;
        setProfileData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('未知错误'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return { profileData, loading, error };
} 