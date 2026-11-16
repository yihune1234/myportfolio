/**
 * GitHub Context Provider for Portfolio AI Assistant
 * Provides compact, cached, and token-efficient verified GitHub context
 * to ground the AI assistant in real personal and organization engineering telemetry.
 */

import { fetchGitHubOverview, fetchGitHubLanguages, GitHubOverview, GitHubLanguagesResponse } from './githubApi';

interface CachedGitHubContext {
  overview: GitHubOverview | null;
  languages: GitHubLanguagesResponse | null;
  cachedAt: number;
}

// In-memory cache with 5-minute TTL to prevent redundant network calls during chat sessions
let contextCache: CachedGitHubContext = {
  overview: null,
  languages: null,
  cachedAt: 0,
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch or retrieve cached GitHub telemetry from existing backend endpoints.
 */
export async function getCachedGitHubData(): Promise<{
  overview: GitHubOverview | null;
  languages: GitHubLanguagesResponse | null;
}> {
  const now = Date.now();
  if (
    contextCache.overview &&
    contextCache.languages &&
    now - contextCache.cachedAt < CACHE_TTL_MS
  ) {
    return {
      overview: contextCache.overview,
      languages: contextCache.languages,
    };
  }

  try {
    const [overview, languages] = await Promise.all([
      fetchGitHubOverview().catch((err) => {
        console.warn('[GitHubContextProvider] Failed to fetch overview:', err);
        return null;
      }),
      fetchGitHubLanguages('ALL').catch((err) => {
        console.warn('[GitHubContextProvider] Failed to fetch languages:', err);
        return null;
      }),
    ]);

    contextCache = {
      overview,
      languages,
      cachedAt: now,
    };

    return { overview, languages };
  } catch (err) {
    console.warn('[GitHubContextProvider] Error refreshing cache:', err);
    return {
      overview: contextCache.overview,
      languages: contextCache.languages,
    };
  }
}

/**
 * Builds a compact, token-efficient GitHub context string tailored to the user query.
 *
 * @param query The latest user query to determine relevance and depth
 * @returns Compact markdown/plain-text formatted GitHub context block
 */
export async function getCompactGitHubContext(query: string = ''): Promise<string> {
  const { overview, languages } = await getCachedGitHubData();

  if (!overview && !languages) {
    return `VERIFIED GITHUB TELEMETRY: GitHub data is currently syncing or temporarily unavailable. Please reference standard portfolio project information.`;
  }

  const q = query.toLowerCase();
  const isGitHubSpecific =
    q.includes('github') ||
    q.includes('repo') ||
    q.includes('repository') ||
    q.includes('commit') ||
    q.includes('code') ||
    q.includes('open source') ||
    q.includes('language') ||
    q.includes('activity') ||
    q.includes('ariiti') ||
    q.includes('organization') ||
    q.includes('pulse');

  const lines: string[] = [];
  lines.push('=== VERIFIED GITHUB ENGINEERING TELEMETRY ===');
  lines.push(`(Grounded in real-time public GitHub data. Last sync: ${overview?.last_synchronized_at ? new Date(overview.last_synchronized_at).toLocaleString() : 'Recent'})`);

  // Personal Lab Summary
  if (overview?.accounts.personal) {
    const p = overview.accounts.personal;
    lines.push(`\nPERSONAL LAB (@${p.login}):`);
    lines.push(`- Profile: ${p.name || p.login} (${p.bio || 'Full-Stack Software Engineer'})`);
    lines.push(`- Public Repositories: ${p.public_repos} | Followers: ${p.followers}`);
    lines.push(`- Profile Link: ${p.html_url}`);
  }

  // Organization Summary
  if (overview?.accounts.organization) {
    const o = overview.accounts.organization;
    lines.push(`\nORGANIZATION (@${o.login}):`);
    lines.push(`- Name: ${o.name || o.login}`);
    lines.push(`- Description: ${o.bio || 'E-commerce and marketplace software organization.'}`);
    lines.push(`- Public Repositories: ${o.public_repos}`);
    lines.push(`- Org Link: ${o.html_url}`);
    lines.push(`- Note on Ownership: Organization repositories represent collaborative team platforms. Do NOT state that Yihune individually wrote 100% of organization code; he is a key contributor and architect.`);
  }

  // Codebase DNA (Byte Volume)
  if (languages?.languages && languages.languages.length > 0) {
    const topLangs = languages.languages
      .slice(0, 5)
      .map((l) => `${l.language}: ${l.percentage}% (${l.formatted_bytes})`)
      .join(', ');
    lines.push(`\nCODEBASE DNA (${languages.formatted_total_bytes} analyzed across ${languages.repos_analyzed} public repos):`);
    lines.push(`- Top Languages by byte volume: ${topLangs}`);
    lines.push(`- Clarification: Language percentages reflect physical source file bytes across repositories, not subjective proficiency ratings.`);
  }

  // Featured Repositories (Include if query is GitHub-specific, or compact 3 items otherwise)
  const repos = overview?.featured_repos || [];
  if (repos.length > 0) {
    const repoLimit = isGitHubSpecific ? 8 : 3;
    lines.push(`\nFEATURED PUBLIC REPOSITORIES:`);
    repos.slice(0, repoLimit).forEach((r, idx) => {
      const scopeLabel = r.source_scope === 'ORGANIZATION' ? 'ORGANIZATION' : 'PERSONAL';
      const lang = r.primary_language ? ` | Lang: ${r.primary_language}` : '';
      const desc = r.description ? ` - ${r.description}` : '';
      lines.push(`${idx + 1}. ${r.full_name} [${scopeLabel}]${lang}${desc} (Stars: ${r.stars || 0}, Forks: ${r.forks || 0}) URL: ${r.html_url}`);
    });
  }

  // Recent Public Activity
  const activity = overview?.recent_activity || [];
  if (isGitHubSpecific && activity.length > 0) {
    lines.push(`\nRECENT PUBLIC ACTIVITY (Latest Verified Events):`);
    activity.slice(0, 4).forEach((ev) => {
      lines.push(`- [${ev.source_scope}] ${ev.summary} (${new Date(ev.created_at).toLocaleDateString()})`);
    });
  }

  return lines.join('\n');
}
