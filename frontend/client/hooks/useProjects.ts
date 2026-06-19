import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "@/lib/api";

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  role?: string;
  isMini?: boolean;
  pinned?: boolean;
  challenges?: string;
  createdAt: string;
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

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_LIST);
      if (result.success) {
        setProjects(result.data);
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
  }, []);

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
