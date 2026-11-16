/**
 * GitHub Response Mapper
 * Normalizes raw GitHub REST API responses into consistent, frontend-friendly shapes.
 * Strict public filtering and source scoping (PERSONAL vs ORGANIZATION).
 */

/**
 * Generates a clean human-readable summary for a GitHub event
 * @param {Object} event
 * @returns {string}
 */
function createEventSummary(event) {
    const actor = event.actor?.login || 'User';
    const repo = event.repo?.name || 'repository';

    switch (event.type) {
        case 'PushEvent': {
            const count = event.payload?.size || event.payload?.commits?.length || 1;
            const branch = (event.payload?.ref || '').replace('refs/heads/', '');
            return `${actor} pushed ${count} commit${count === 1 ? '' : 's'} to ${repo}${branch ? ` on ${branch}` : ''}`;
        }
        case 'CreateEvent': {
            const refType = event.payload?.ref_type || 'entity';
            const ref = event.payload?.ref;
            return `${actor} created ${refType}${ref ? ` "${ref}"` : ''} in ${repo}`;
        }
        case 'DeleteEvent': {
            const refType = event.payload?.ref_type || 'entity';
            const ref = event.payload?.ref;
            return `${actor} deleted ${refType}${ref ? ` "${ref}"` : ''} in ${repo}`;
        }
        case 'WatchEvent':
            return `${actor} starred ${repo}`;
        case 'ForkEvent':
            return `${actor} forked ${repo}`;
        case 'IssuesEvent': {
            const action = event.payload?.action || 'modified';
            const issueNum = event.payload?.issue?.number;
            return `${actor} ${action} issue #${issueNum} in ${repo}`;
        }
        case 'PullRequestEvent': {
            const action = event.payload?.action || 'modified';
            const prNum = event.payload?.pull_request?.number;
            return `${actor} ${action} pull request #${prNum} in ${repo}`;
        }
        case 'ReleaseEvent': {
            const tag = event.payload?.release?.tag_name || 'release';
            return `${actor} published ${tag} in ${repo}`;
        }
        default:
            return `${actor} performed ${event.type} on ${repo}`;
    }
}

/**
 * Normalize single repository
 * @param {Object} raw
 * @param {'PERSONAL'|'ORGANIZATION'} sourceScope
 * @returns {Object}
 */
function mapRepository(raw, sourceScope = 'PERSONAL') {
    if (!raw) return null;

    return {
        id: raw.id,
        name: raw.name,
        full_name: raw.full_name,
        description: raw.description || '',
        html_url: raw.html_url,
        homepage: raw.homepage || null,
        primary_language: raw.language || null,
        stars: raw.stargazers_count ?? 0,
        forks: raw.forks_count ?? 0,
        topics: Array.isArray(raw.topics) ? raw.topics : [],
        visibility: raw.visibility || (raw.private ? 'private' : 'public'),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        pushed_at: raw.pushed_at,
        owner: {
            id: raw.owner?.id,
            login: raw.owner?.login,
            avatar_url: raw.owner?.avatar_url,
            html_url: raw.owner?.html_url,
            type: raw.owner?.type || (sourceScope === 'ORGANIZATION' ? 'Organization' : 'User')
        },
        source_scope: sourceScope,
        is_fork: Boolean(raw.fork),
        open_issues_count: raw.open_issues_count ?? 0,
        default_branch: raw.default_branch || 'main'
    };
}

/**
 * Normalize repository list: strictly filters to public repositories only
 * @param {Array<Object>} list
 * @param {'PERSONAL'|'ORGANIZATION'} sourceScope
 * @returns {Array<Object>}
 */
function mapRepositories(list, sourceScope = 'PERSONAL') {
    if (!Array.isArray(list)) return [];

    return list
        .filter(repo => repo && !repo.private && (repo.visibility === 'public' || !repo.visibility))
        .map(repo => mapRepository(repo, sourceScope));
}

/**
 * Normalize user or organization profile
 * @param {Object} raw
 * @param {'PERSONAL'|'ORGANIZATION'} sourceScope
 * @returns {Object}
 */
function mapProfile(raw, sourceScope = 'PERSONAL') {
    if (!raw) return null;

    return {
        id: raw.id,
        login: raw.login,
        name: raw.name || raw.login,
        avatar_url: raw.avatar_url,
        html_url: raw.html_url,
        bio: raw.bio || raw.description || '',
        company: raw.company || null,
        blog: raw.blog || null,
        location: raw.location || null,
        email: raw.email || null,
        public_repos: raw.public_repos ?? 0,
        followers: raw.followers ?? 0,
        following: raw.following ?? 0,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        type: raw.type || (sourceScope === 'ORGANIZATION' ? 'Organization' : 'User'),
        source_scope: sourceScope
    };
}

/**
 * Normalize an activity event
 * @param {Object} raw
 * @param {'PERSONAL'|'ORGANIZATION'} sourceScope
 * @returns {Object}
 */
function mapEvent(raw, sourceScope = 'PERSONAL') {
    if (!raw) return null;

    const actorLogin = raw.actor?.login || 'unknown';
    const repoName = raw.repo?.name || '';

    return {
        id: raw.id,
        type: raw.type,
        created_at: raw.created_at,
        actor: {
            id: raw.actor?.id,
            login: actorLogin,
            avatar_url: raw.actor?.avatar_url,
            html_url: `https://github.com/${actorLogin}`
        },
        repo: {
            id: raw.repo?.id,
            name: repoName,
            html_url: repoName ? `https://github.com/${repoName}` : null
        },
        action: raw.payload?.action || null,
        summary: createEventSummary(raw),
        source_scope: sourceScope
    };
}

/**
 * Normalize event list
 * @param {Array<Object>} list
 * @param {'PERSONAL'|'ORGANIZATION'} sourceScope
 * @returns {Array<Object>}
 */
function mapEvents(list, sourceScope = 'PERSONAL') {
    if (!Array.isArray(list)) return [];
    return list.map(event => mapEvent(event, sourceScope));
}

module.exports = {
    mapRepository,
    mapRepositories,
    mapProfile,
    mapEvent,
    mapEvents,
    createEventSummary
};
