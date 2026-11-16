import { useQuery } from '@tanstack/react-query';
import { fetchGitHubPublicSettings, GitHubPublicSettings } from '@/lib/githubApi';

export function useGitHubSettings() {
  return useQuery<GitHubPublicSettings>({
    queryKey: ['github', 'public-settings'],
    queryFn: fetchGitHubPublicSettings,
    staleTime: 60 * 1000,
  });
}
