import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "@/lib/api";

export interface ProjectImage {
  _id?: string;
  url: string;
  public_id?: string;
  title?: string;
  caption?: string;
  imageType?: 'overview' | 'installation' | 'infrastructure' | 'screenshot' | 'before_after' | 'implementation' | 'general';
  order: number;
  isFeatured: boolean;
}

export interface ContentSection {
  _id?: string;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
}

export interface Project {
  _id: string;
  title: string;
  ownership?: 'PERSONAL' | 'ARIITII_TECH';
  developmentStatus?: 'completed' | 'in_progress' | 'active' | 'maintenance';
  category?: string;
  shortSummary?: string;
  description: string;
  location?: string;
  clientOrPartner?: string;
  startDate?: string;
  completionDate?: string;
  projectType?: 'completed' | 'ongoing' | 'proposed';
  status?: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived';
  proposalStatus?: 'pending' | 'approved' | 'rejected';
  pinned?: boolean;
  isMini?: boolean;
  order?: number;
  objectives?: string[];
  challenges?: string;
  proposedSolution?: string;
  expectedOutcomes?: string[];
  resultsAndImpact?: string;
  technologies: string[];
  equipment?: string[];
  contentSections?: ContentSection[];
  image?: string;
  images?: ProjectImage[];
  demoUrl?: string;
  githubUrl?: string;
  showGithubLink?: boolean;
  role?: string;
  highlights?: string[];
  createdAt: string;
  updatedAt?: string;
  lastSyncedAt?: string;
  githubRepoId?: number;
  githubRepoFullName?: string;
  githubOwnerLogin?: string;
  githubRepoUrl?: string;
  githubSourceScope?: 'PERSONAL' | 'ORGANIZATION';
  sourceType?: 'personal' | 'organization' | 'manual';
  showGithubMetrics?: boolean;
  autoSyncMetrics?: boolean;
  relatedProjects?: Project[];
  githubMetadata?: {
    stars?: number;
    forks?: number;
    primaryLanguage?: string;
    languages?: Record<string, number>;
    topics?: string[];
    defaultBranch?: string;
    openIssues?: number;
    repoCreatedAt?: string;
    repoPushedAt?: string;
    readmeSummary?: string;
  };
}

export interface ProjectSection {
  _id: string;
  project: string;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionMedia {
  _id: string;
  projectSection: string;
  url: string;
  type: "image" | "video";
  alt: string;
  caption: string;
  order: number;
  isPrimary: boolean;
  createdAt: string;
}

export const useProjects = (ownershipFilter?: 'PERSONAL' | 'ARIITII_TECH') => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = ownershipFilter
        ? `${API_ENDPOINTS.PROJECTS_LIST}?ownership=${ownershipFilter}`
        : API_ENDPOINTS.PROJECTS_LIST;
      const result = await apiFetch(url);
      if (result.success) {
        if (Array.isArray(result.data)) {
          setProjects(result.data);
        } else if (result.data && Array.isArray(result.data.projects)) {
          setProjects(result.data.projects);
        } else {
          setProjects([]);
        }
      } else {
        setError(result.error || "Failed to fetch projects");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, [ownershipFilter]);

  useEffect(() => {
    fetchProjects();

    // Set up interval to refresh projects every 30 seconds
    const interval = setInterval(fetchProjects, 30000);

    // Listen for custom event when admin updates projects
    const handleProjectsUpdated = () => {
      fetchProjects();
    };

    window.addEventListener("projectsUpdated", handleProjectsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("projectsUpdated", handleProjectsUpdated);
    };
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_GET(id));
      if (result.success) {
        setProject(result.data);
      } else {
        setError(result.error || "Failed to fetch project");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [fetchProject, id]);

  return { project, loading, error, refetch: fetchProject };
};
