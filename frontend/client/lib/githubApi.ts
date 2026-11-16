/**
 * GitHub API Client & Types
 * Connects frontend directly to existing backend endpoints (/api/github/*).
 */

export type DualScope = 'ALL' | 'PERSONAL' | 'ORGANIZATION';

export interface GitHubOwner {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: 'User' | 'Organization';
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  primary_language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  visibility: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: GitHubOwner;
  source_scope: 'PERSONAL' | 'ORGANIZATION';
  is_fork: boolean;
  open_issues_count: number;
  default_branch: string;
}

export interface GitHubProfile {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  type: 'User' | 'Organization';
  source_scope: 'PERSONAL' | 'ORGANIZATION';
}

export interface GitHubActivityEvent {
  id: string;
  type: string;
  created_at: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  };
  repo: {
    id: number;
    name: string;
    html_url: string | null;
  };
  action: string | null;
  summary: string;
  source_scope: 'PERSONAL' | 'ORGANIZATION';
}

export interface LanguageStat {
  language: string;
  bytes: number;
  formatted_bytes: string;
  percentage: number;
}

export interface GitHubLanguagesResponse {
  scope: DualScope;
  languages: LanguageStat[];
  total_bytes: number;
  formatted_total_bytes: string;
  repos_analyzed: number;
  empty_repos_count: number;
  methodology: string;
  generated_at: string;
  cached: boolean;
}

export interface GitHubOverview {
  status: {
    personal: 'ok' | 'error';
    organization: 'ok' | 'unconfigured' | 'error';
    personal_error?: string;
    organization_error?: string;
  };
  accounts: {
    personal: GitHubProfile | null;
    organization: GitHubProfile | null;
  };
  metrics: {
    total_public_repos: number;
    personal_public_repos: number;
    organization_public_repos: number;
    total_stars: number;
    total_forks: number;
    top_languages: { language: string; count: number; percentage: number }[];
  };
  featured_repos: GitHubRepository[];
  recent_activity: GitHubActivityEvent[];
  last_synchronized_at: string;
  last_successful_update: string;
  cached: boolean;
  cache_status?: string;
}

export interface GitHubHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  sources: {
    personal: {
      username: string;
      status: 'ok' | 'error';
      last_synchronized: string | null;
      last_successful_update: string | null;
    };
    organization: {
      name: string | null;
      status: 'ok' | 'unconfigured' | 'error';
      last_synchronized: string | null;
      last_successful_update: string | null;
    };
  };
  scheduler: {
    enabled: boolean;
    status: string;
    interval_ms: number;
    last_sync_started_at: string | null;
    last_sync_completed_at: string | null;
    last_sync_success: boolean | null;
    sync_count: number;
    failure_count: number;
    last_error: string | null;
  };
  cache: {
    size: number;
    hits: number;
    misses: number;
    hit_ratio: number;
    ttls: {
      profile_ms: number;
      repos_ms: number;
      activity_ms: number;
      overview_ms: number;
    };
  };
  rate_limit: {
    limit: number;
    remaining: number;
    reset: number;
    reset_at: string;
  } | null;
  webhook: {
    configured: boolean;
    deliveries_tracked: number;
  };
  timestamp: string;
}

const getBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || '';
};

export async function fetchGitHubOverview(forceRefresh = false): Promise<GitHubOverview> {
  const url = `${getBaseUrl()}/api/github/overview${forceRefresh ? '?refresh=true' : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub overview: HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchGitHubPersonalRepos(params: { page?: number; per_page?: number } = {}): Promise<{ repos: GitHubRepository[] }> {
  const query = new URLSearchParams({
    page: String(params.page || 1),
    per_page: String(params.per_page || 100)
  });
  const res = await fetch(`${getBaseUrl()}/api/github/personal/repos?${query}`);
  if (!res.ok) throw new Error(`Failed to fetch personal repos: HTTP ${res.status}`);
  return res.json();
}

export async function fetchGitHubOrgRepos(params: { page?: number; per_page?: number } = {}): Promise<{ repos: GitHubRepository[] }> {
  const query = new URLSearchParams({
    page: String(params.page || 1),
    per_page: String(params.per_page || 100)
  });
  const res = await fetch(`${getBaseUrl()}/api/github/organization/repos?${query}`);
  if (!res.ok) throw new Error(`Failed to fetch organization repos: HTTP ${res.status}`);
  return res.json();
}

export async function fetchGitHubPersonalActivity(params: { per_page?: number } = {}): Promise<{ activity: GitHubActivityEvent[] }> {
  const query = new URLSearchParams({
    per_page: String(params.per_page || 30)
  });
  const res = await fetch(`${getBaseUrl()}/api/github/personal/activity?${query}`);
  if (!res.ok) throw new Error(`Failed to fetch personal activity: HTTP ${res.status}`);
  return res.json();
}

export async function fetchGitHubOrgActivity(params: { per_page?: number } = {}): Promise<{ activity: GitHubActivityEvent[] }> {
  const query = new URLSearchParams({
    per_page: String(params.per_page || 30)
  });
  const res = await fetch(`${getBaseUrl()}/api/github/organization/activity?${query}`);
  if (!res.ok) throw new Error(`Failed to fetch organization activity: HTTP ${res.status}`);
  return res.json();
}

export async function fetchGitHubLanguages(scope: DualScope = 'ALL', forceRefresh = false): Promise<GitHubLanguagesResponse> {
  const query = new URLSearchParams({
    scope,
    ...(forceRefresh ? { refresh: 'true' } : {})
  });
  const res = await fetch(`${getBaseUrl()}/api/github/languages?${query}`);
  if (!res.ok) throw new Error(`Failed to fetch language byte analysis: HTTP ${res.status}`);
  return res.json();
}

export async function fetchGitHubHealth(): Promise<GitHubHealthResponse> {
  const res = await fetch(`${getBaseUrl()}/api/github/health`);
  if (!res.ok) throw new Error(`Failed to fetch GitHub health: HTTP ${res.status}`);
  return res.json();
}

export interface GitHubPublicSettings {
  personalVisibility: boolean;
  orgVisibility: boolean;
  showHeroPulse: boolean;
  showSkillsIntegration: boolean;
  showEngineeringShowcase: boolean;
}

export async function fetchGitHubPublicSettings(): Promise<GitHubPublicSettings> {
  const res = await fetch(`${getBaseUrl()}/api/github/settings`);
  if (!res.ok) {
    return {
      personalVisibility: true,
      orgVisibility: true,
      showHeroPulse: true,
      showSkillsIntegration: true,
      showEngineeringShowcase: true,
    };
  }
  return res.json();
}
