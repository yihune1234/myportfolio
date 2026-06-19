import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

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

export const useProjectSections = (projectId: string) => {
  const [sections, setSections] = useState<ProjectSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(
        `/api/project-sections/project/${projectId}`,
      );
      if (result.success) {
        setSections(result.data);
      } else {
        setError(result.error || "Failed to fetch sections");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching sections:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchSections();
    }
  }, [fetchSections, projectId]);

  return { sections, loading, error, refetch: fetchSections };
};

export const useSectionMedia = (sectionId: string) => {
  const [media, setMedia] = useState<SectionMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(`/api/section-media/section/${sectionId}`);
      if (result.success) {
        setMedia(result.data);
      } else {
        setError(result.error || "Failed to fetch media");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    if (sectionId) {
      fetchMedia();
    }
  }, [fetchMedia, sectionId]);

  return { media, loading, error, refetch: fetchMedia };
};
