import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "@/lib/api";

export interface ProjectImage {
  _id: string;
  url: string;
  public_id?: string;
  title: string;
  order: number;
  isFeatured: boolean;
}

export const useProjectImages = (projectId: string) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(API_ENDPOINTS.PROJECT_IMAGES_LIST(projectId));
      if (result.success) {
        setImages(result.data);
      } else {
        setError(result.error || "Failed to fetch images");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchImages();
    }
  }, [fetchImages, projectId]);

  return { images, loading, error, refetch: fetchImages };
};

export const useProjectImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (projectId: string, file: File, metadata?: Partial<ProjectImage>) => {
      try {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", file);
        if (metadata?.title) formData.append("title", metadata.title);
        if (metadata?.isFeatured !== undefined)
          formData.append("isFeatured", metadata.isFeatured.toString());

        const result = await apiFetchFormData(
          API_ENDPOINTS.PROJECT_IMAGES_UPLOAD(projectId),
          formData,
        );

        if (result.success) {
          return result.data;
        } else {
          setError(result.error || "Failed to upload image");
          return null;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error uploading image:", err);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  return { uploadImage, uploading, error };
};

export const useProjectImageUpdate = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateImage = useCallback(
    async (projectId: string, imageId: string, metadata: Partial<ProjectImage>) => {
      try {
        setUpdating(true);
        setError(null);

        const result = await apiFetch(
          API_ENDPOINTS.PROJECT_IMAGE_UPDATE(projectId, imageId),
          {
            method: "PUT",
            body: JSON.stringify(metadata),
          },
        );

        if (result.success) {
          return result.data;
        } else {
          setError(result.error || "Failed to update image");
          return null;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error updating image:", err);
        return null;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  return { updateImage, updating, error };
};

export const useProjectImageDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteImage = useCallback(
    async (projectId: string, imageId: string) => {
      try {
        setDeleting(true);
        setError(null);

        const result = await apiFetch(
          API_ENDPOINTS.PROJECT_IMAGE_DELETE(projectId, imageId),
          {
            method: "DELETE",
          },
        );

        if (result.success) {
          return true;
        } else {
          setError(result.error || "Failed to delete image");
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error deleting image:", err);
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [],
  );

  return { deleteImage, deleting, error };
};

export const useProjectImageReorder = () => {
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reorderImages = useCallback(
    async (projectId: string, images: ProjectImage[]) => {
      try {
        setReordering(true);
        setError(null);

        const result = await apiFetch(
          API_ENDPOINTS.PROJECT_IMAGES_REORDER(projectId),
          {
            method: "POST",
            body: JSON.stringify({ images }),
          },
        );

        if (result.success) {
          return true;
        } else {
          setError(result.error || "Failed to reorder images");
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error reordering images:", err);
        return false;
      } finally {
        setReordering(false);
      }
    },
    [],
  );

  return { reorderImages, reordering, error };
};
