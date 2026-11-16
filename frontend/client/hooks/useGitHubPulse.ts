/**
 * useGitHubPulse Hook
 * React Query integration for real-time engineering showcases,
 * dual-identity filtering, background polling, and cache management.
 */

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DualScope,
  GitHubRepository,
  GitHubActivityEvent,
  fetchGitHubOverview,
  fetchGitHubPersonalRepos,
  fetchGitHubOrgRepos,
  fetchGitHubPersonalActivity,
  fetchGitHubOrgActivity,
  fetchGitHubLanguages,
  fetchGitHubHealth
} from '@/lib/githubApi';

export function useGitHubPulse(defaultScope: DualScope = 'ALL') {
  const [scope, setScope] = useState<DualScope>(defaultScope);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('stars');
  const queryClient = useQueryClient();

  // 1. Overview Query
  const overviewQuery = useQuery({
    queryKey: ['github', 'overview'],
    queryFn: () => fetchGitHubOverview(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  // 2. Personal Repos Query
  const personalReposQuery = useQuery({
    queryKey: ['github', 'repos', 'personal'],
    queryFn: () => fetchGitHubPersonalRepos({ per_page: 100 }),
    staleTime: 10 * 60 * 1000
  });

  // 3. Organization Repos Query
  const orgReposQuery = useQuery({
    queryKey: ['github', 'repos', 'organization'],
    queryFn: () => fetchGitHubOrgRepos({ per_page: 100 }),
    staleTime: 10 * 60 * 1000
  });

  // 4. Personal Activity Query
  const personalActivityQuery = useQuery({
    queryKey: ['github', 'activity', 'personal'],
    queryFn: () => fetchGitHubPersonalActivity({ per_page: 30 }),
    staleTime: 3 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000
  });

  // 5. Organization Activity Query
  const orgActivityQuery = useQuery({
    queryKey: ['github', 'activity', 'organization'],
    queryFn: () => fetchGitHubOrgActivity({ per_page: 30 }),
    staleTime: 3 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000
  });

  // 6. Codebase DNA (Exact byte counts)
  const languagesQuery = useQuery({
    queryKey: ['github', 'languages', scope],
    queryFn: () => fetchGitHubLanguages(scope),
    staleTime: 15 * 60 * 1000
  });

  // 7. System Health & Monitoring
  const healthQuery = useQuery({
    queryKey: ['github', 'health'],
    queryFn: () => fetchGitHubHealth(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000
  });

  // Scoped Repositories
  const allRepos = useMemo<GitHubRepository[]>(() => {
    const personal = personalReposQuery.data?.repos || [];
    const org = orgReposQuery.data?.repos || [];

    if (scope === 'PERSONAL') return personal;
    if (scope === 'ORGANIZATION') return org;

    // Merge and deduplicate by ID
    const map = new Map<number, GitHubRepository>();
    personal.forEach((r) => map.set(r.id, r));
    org.forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [personalReposQuery.data, orgReposQuery.data, scope]);

  // Scoped Activity Events (Deduplicated by event ID)
  const allActivity = useMemo<GitHubActivityEvent[]>(() => {
    const personal = personalActivityQuery.data?.activity || [];
    const org = orgActivityQuery.data?.activity || [];

    if (scope === 'PERSONAL') return personal;
    if (scope === 'ORGANIZATION') return org;

    // Deduplicate by event ID across personal and organization feeds
    const map = new Map<string, GitHubActivityEvent>();
    personal.forEach((ev) => map.set(String(ev.id), ev));
    org.forEach((ev) => {
      if (!map.has(String(ev.id))) {
        map.set(String(ev.id), ev);
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [personalActivityQuery.data, orgActivityQuery.data, scope]);

  // Filtered & Sorted Repositories for Explorer
  const explorerRepos = useMemo(() => {
    return allRepos
      .filter((repo) => {
        const matchesSearch =
          !searchQuery.trim() ||
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (repo.topics && repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesLang =
          selectedLanguage === 'ALL' ||
          (repo.primary_language && repo.primary_language.toLowerCase() === selectedLanguage.toLowerCase());

        return matchesSearch && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
        if (sortBy === 'updated') {
          return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
        }
        return a.name.localeCompare(b.name);
      });
  }, [allRepos, searchQuery, selectedLanguage, sortBy]);

  // Available languages across active repositories
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    allRepos.forEach((r) => {
      if (r.primary_language) langs.add(r.primary_language);
    });
    return Array.from(langs).sort();
  }, [allRepos]);

  // Aggregate stats across active scope
  const activeMetrics = useMemo(() => {
    const totalRepos = allRepos.length;
    const totalStars = allRepos.reduce((acc, r) => acc + (r.stars || 0), 0);
    const totalForks = allRepos.reduce((acc, r) => acc + (r.forks || 0), 0);
    return {
      totalRepos,
      totalStars,
      totalForks
    };
  }, [allRepos]);

  const isLoading =
    overviewQuery.isLoading ||
    personalReposQuery.isLoading ||
    orgReposQuery.isLoading ||
    languagesQuery.isLoading;

  const isError = overviewQuery.isError && personalReposQuery.isError;

  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['github'] }),
      fetchGitHubOverview(true),
      fetchGitHubLanguages(scope, true)
    ]);
  };

  return {
    scope,
    setScope,
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    sortBy,
    setSortBy,
    availableLanguages,
    overview: overviewQuery.data,
    personalProfile: overviewQuery.data?.accounts.personal,
    orgProfile: overviewQuery.data?.accounts.organization,
    allRepos,
    explorerRepos,
    orgRepos: orgReposQuery.data?.repos || [],
    orgActivity: orgActivityQuery.data?.activity || [],
    activity: allActivity,
    languages: languagesQuery.data,
    health: healthQuery.data,
    activeMetrics,
    isLoading,
    isRefreshing:
      overviewQuery.isFetching ||
      personalReposQuery.isFetching ||
      orgReposQuery.isFetching ||
      languagesQuery.isFetching,
    lastSync: overviewQuery.data?.last_synchronized_at || null,
    isError,
    refetchAll
  };
}
