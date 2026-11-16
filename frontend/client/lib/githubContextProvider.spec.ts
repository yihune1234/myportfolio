import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCompactGitHubContext } from './githubContextProvider';
import * as githubApi from './githubApi';

describe('GitHub Context Provider for AI Assistant', () => {
  const mockOverview = {
    status: { personal: 'ok' as const, organization: 'ok' as const },
    accounts: {
      personal: {
        id: 197728600,
        login: 'yihune1234',
        name: 'Yihune Belay',
        avatar_url: 'https://avatars.githubusercontent.com/u/197728600?v=4',
        html_url: 'https://github.com/yihune1234',
        bio: 'Full-Stack Software Engineer',
        company: null,
        blog: null,
        location: 'Addis Ababa',
        email: null,
        public_repos: 27,
        followers: 3,
        following: 5,
        created_at: '2024-01-01',
        updated_at: '2026-11-16',
        type: 'User' as const,
        source_scope: 'PERSONAL' as const,
      },
      organization: {
        id: 198900000,
        login: 'AriitiMarket',
        name: 'AriitiMarket',
        avatar_url: 'https://avatars.githubusercontent.com/u/org.png',
        html_url: 'https://github.com/AriitiMarket',
        bio: 'E-commerce marketplace platforms',
        company: null,
        blog: null,
        location: null,
        email: null,
        public_repos: 3,
        followers: 0,
        following: 0,
        created_at: '2024-01-01',
        updated_at: '2026-11-16',
        type: 'Organization' as const,
        source_scope: 'ORGANIZATION' as const,
      },
    },
    metrics: {
      total_public_repos: 30,
      personal_public_repos: 27,
      organization_public_repos: 3,
      total_stars: 11,
      total_forks: 4,
      top_languages: [{ language: 'JavaScript', count: 15, percentage: 50 }],
    },
    featured_repos: [
      {
        id: 1,
        name: 'myportfolio',
        full_name: 'yihune1234/myportfolio',
        description: 'Portfolio system with GitHub integration',
        html_url: 'https://github.com/yihune1234/myportfolio',
        homepage: null,
        primary_language: 'TypeScript',
        stars: 5,
        forks: 1,
        topics: ['portfolio', 'react'],
        visibility: 'public',
        created_at: '2024-01-01',
        updated_at: '2026-11-16',
        pushed_at: '2026-11-16',
        owner: { id: 1, login: 'yihune1234', avatar_url: '', html_url: '', type: 'User' as const },
        source_scope: 'PERSONAL' as const,
        is_fork: false,
        open_issues_count: 0,
        default_branch: 'main',
      },
      {
        id: 2,
        name: 'ariiti-market-api',
        full_name: 'AriitiMarket/ariiti-market-api',
        description: 'Multi-vendor marketplace API service',
        html_url: 'https://github.com/AriitiMarket/ariiti-market-api',
        homepage: null,
        primary_language: 'PHP',
        stars: 2,
        forks: 0,
        topics: ['ecommerce', 'marketplace'],
        visibility: 'public',
        created_at: '2024-01-01',
        updated_at: '2026-11-16',
        pushed_at: '2026-11-16',
        owner: { id: 2, login: 'AriitiMarket', avatar_url: '', html_url: '', type: 'Organization' as const },
        source_scope: 'ORGANIZATION' as const,
        is_fork: false,
        open_issues_count: 0,
        default_branch: 'main',
      },
    ],
    recent_activity: [
      {
        id: 'ev-1',
        type: 'PushEvent',
        created_at: '2026-11-16T18:00:00Z',
        actor: { id: 1, login: 'yihune1234', avatar_url: '', html_url: '' },
        repo: { id: 1, name: 'yihune1234/myportfolio', html_url: 'https://github.com/yihune1234/myportfolio' },
        action: null,
        summary: 'Pushed 1 commit to yihune1234/myportfolio',
        source_scope: 'PERSONAL' as const,
      },
    ],
    last_synchronized_at: '2026-11-16T19:00:00Z',
    last_successful_update: '2026-11-16T19:00:00Z',
    cached: true,
  };

  const mockLanguages = {
    scope: 'ALL' as const,
    languages: [
      { language: 'JavaScript', bytes: 12485168, formatted_bytes: '11.9 MB', percentage: 46.9 },
      { language: 'PHP', bytes: 7759267, formatted_bytes: '7.4 MB', percentage: 29.2 },
      { language: 'TypeScript', bytes: 4998383, formatted_bytes: '4.8 MB', percentage: 18.8 },
    ],
    total_bytes: 26596123,
    formatted_total_bytes: '25.4 MB',
    repos_analyzed: 30,
    empty_repos_count: 5,
    methodology: 'Language analysis byte counts across unique public repositories.',
    generated_at: '2026-11-16T19:00:00Z',
    cached: true,
  };

  beforeEach(() => {
    vi.spyOn(githubApi, 'fetchGitHubOverview').mockResolvedValue(mockOverview as any);
    vi.spyOn(githubApi, 'fetchGitHubLanguages').mockResolvedValue(mockLanguages as any);
  });

  it('should generate compact telemetry grounded in verified data', async () => {
    const context = await getCompactGitHubContext('What are your GitHub repositories?');

    expect(context).toContain('PERSONAL LAB (@yihune1234)');
    expect(context).toContain('ORGANIZATION (@AriitiMarket)');
    expect(context).toContain('yihune1234/myportfolio [PERSONAL]');
    expect(context).toContain('AriitiMarket/ariiti-market-api [ORGANIZATION]');
    expect(context).toContain('CODEBASE DNA (25.4 MB analyzed across 30 public repos)');
    expect(context).toContain('JavaScript: 46.9%');
  });

  it('should distinguish personal vs organization ownership clearly', async () => {
    const context = await getCompactGitHubContext('Tell me about AriitiMarket organization');

    expect(context).toContain('ORGANIZATION (@AriitiMarket)');
    expect(context).toContain('Organization repositories represent collaborative team platforms');
    expect(context).toContain('Do NOT state that Yihune individually wrote 100% of organization code');
  });

  it('should include recent verified activity when query is GitHub-specific', async () => {
    const context = await getCompactGitHubContext('Show recent public activity on GitHub');

    expect(context).toContain('RECENT PUBLIC ACTIVITY');
    expect(context).toContain('[PERSONAL] Pushed 1 commit to yihune1234/myportfolio');
  });

  it('should provide concise summary when query is general', async () => {
    const context = await getCompactGitHubContext('Tell me about yourself');

    expect(context).toContain('=== VERIFIED GITHUB ENGINEERING TELEMETRY ===');
    expect(context).toContain('@yihune1234');
    expect(context).toContain('@AriitiMarket');
    // General queries omit verbose activity logs to conserve AI context tokens
    expect(context).not.toContain('RECENT PUBLIC ACTIVITY');
  });
});
