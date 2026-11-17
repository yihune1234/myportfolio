import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  FolderKanban,
  Github,
  RefreshCw,
  Search,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { useGitHubSettings } from "../../hooks/useGitHubSettings";
import { fetchGitHubRepoDetails } from "../../lib/githubApi";
import { ProjectCard } from "./projects/ProjectCard.jsx";
import PortfolioProjectsView from "./projects/PortfolioProjectsView.jsx";
import { GitHubRepoBrowser } from "./projects/GitHubRepoBrowser.jsx";
import { GitHubRepoPreviewModal } from "./projects/GitHubRepoPreviewModal.jsx";
import { ProjectFormModal } from "./projects/ProjectFormModal.jsx";

export function ProjectsManager({ showAddProject, setShowAddProject }) {
  const { toast } = useToast();
  const { data: gitHubSettings } = useGitHubSettings();

  // Active View: 'portfolio' | 'github-browser'
  const [activeView, setActiveView] = useState("portfolio");

  // ==========================================
  // Portfolio Projects State
  // ==========================================
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("ALL");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");
  const [syncingProjectId, setSyncingProjectId] = useState(null);

  // ==========================================
  // GitHub Browser State
  // ==========================================
  const [repoSource, setRepoSource] = useState("PERSONAL");
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);
  const [repoSearch, setRepoSearch] = useState("");
  const [repoLanguageFilter, setRepoLanguageFilter] = useState("ALL");
  const [repoSort, setRepoSort] = useState("updated");
  const [selectedRepoFullNames, setSelectedRepoFullNames] = useState(new Set());
  const [bulkImporting, setBulkImporting] = useState(false);

  // Preview Modal State
  const [previewRepo, setPreviewRepo] = useState(null);
  const [previewDetails, setPreviewDetails] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // ==========================================
  // Modal / Form State
  // ==========================================
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [savingProject, setSavingProject] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [projectImages, setProjectImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortSummary: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
    role: "Full-Stack Architect",
    category: "Full-Stack",
    highlights: "",
    status: "published",
    projectType: "completed",
    proposalStatus: "pending",
    clientOrPartner: "",
    location: "",
    startDate: "",
    completionDate: "",
    objectives: "",
    challenges: "",
    proposedSolution: "",
    expectedOutcomes: "",
    resultsAndImpact: "",
    equipment: "",
    showGithubLink: true,
    pinned: false,
    isMini: false,
    githubRepoId: null,
    githubRepoFullName: "",
    githubOwnerLogin: "",
    githubSourceScope: "PERSONAL",
    sourceType: "personal",
    showGithubMetrics: true,
    autoSyncMetrics: true,
    image: null,
  });

  const currentUsername = gitHubSettings?.githubUsername || "yihune1234";
  const currentOrg = gitHubSettings?.githubOrg || "AriitiMarket";

  const importedRepoMap = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      if (p.githubRepoFullName) {
        map.set(p.githubRepoFullName.toLowerCase(), p);
      }
    });
    return map;
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (showAddProject) {
      openCreateModal();
      setShowAddProject(false);
    }
  }, [showAddProject, setShowAddProject]);

  useEffect(() => {
    if (activeView === "github-browser") {
      fetchRealGitHubRepos();
    }
  }, [activeView, repoSource, currentUsername, currentOrg]);

  // ==========================================
  // API Fetch Functions
  // ==========================================
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_ADMIN_ALL);
      if (result.success && Array.isArray(result.projects)) {
        setProjects(result.projects);
      } else {
        const fallback = await apiFetch(`${API_ENDPOINTS.PROJECTS_LIST}?all=true`);
        if (fallback.success && Array.isArray(fallback.data)) {
          setProjects(fallback.data);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio projects.",
        variant: "destructive",
      });
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchRealGitHubRepos = async (forceRefresh = false) => {
    setReposLoading(true);
    setReposError(null);
    try {
      const endpoint =
        repoSource === "ORGANIZATION"
          ? API_ENDPOINTS.GITHUB_ORG_REPOS(
              `per_page=100&sort=${repoSort === 'name' ? 'full_name' : repoSort}${forceRefresh ? '&refresh=true' : ''}`
            )
          : API_ENDPOINTS.GITHUB_PERSONAL_REPOS(
              `per_page=100&sort=${repoSort === 'name' ? 'full_name' : repoSort}${forceRefresh ? '&refresh=true' : ''}`
            );

      const res = await apiFetch(endpoint);
      if (res.repos && Array.isArray(res.repos)) {
        setRepos(res.repos);
      } else if (res.data && Array.isArray(res.data.repos)) {
        setRepos(res.data.repos);
      } else if (Array.isArray(res.data)) {
        setRepos(res.data);
      } else {
        setRepos([]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load GitHub repositories";
      setReposError(msg);
      toast({
        title: "GitHub Connection Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setReposLoading(false);
    }
  };

  const fetchProjectImages = async (projectId) => {
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECT_IMAGES_LIST(projectId));
      if (result.success) {
        setProjectImages(result.data);
      }
    } catch (e) {
      console.error("Error fetching project images:", e);
    }
  };

  // Helper for image URLs
  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return `/uploads/${image}`;
    }
    return null;
  };

  const availableCategories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (projectSearch.trim()) {
        const query = projectSearch.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        const matchesRepo = p.githubRepoFullName?.toLowerCase().includes(query);
        const matchesTech = p.technologies?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesRepo && !matchesTech) return false;
      }

      if (projectStatusFilter === "PUBLISHED" && p.status !== "published") return false;
      if (projectStatusFilter === "DRAFT" && p.status !== "draft") return false;
      if (projectStatusFilter === "UNDER_REVIEW" && p.status !== "under_review") return false;
      if (projectStatusFilter === "PROPOSALS" && p.projectType !== "proposed") return false;
      if (projectStatusFilter === "COMPLETED" && (p.projectType || "completed") !== "completed") return false;
      if (projectStatusFilter === "ONGOING" && p.projectType !== "ongoing") return false;
      if (projectStatusFilter === "PERSONAL" && (p.sourceType !== "personal" && p.githubSourceScope !== "PERSONAL")) return false;
      if (projectStatusFilter === "ORGANIZATION" && (p.sourceType !== "organization" && p.githubSourceScope !== "ORGANIZATION")) return false;
      if (projectStatusFilter === "MANUAL" && (p.sourceType !== "manual" || p.githubRepoFullName)) return false;

      if (projectCategoryFilter !== "ALL" && p.category !== projectCategoryFilter) return false;

      return true;
    });
  }, [projects, projectSearch, projectStatusFilter, projectCategoryFilter]);

  const availableRepoLanguages = useMemo(() => {
    const set = new Set();
    repos.forEach((r) => {
      if (r.primary_language) set.add(r.primary_language);
    });
    return Array.from(set).sort();
  }, [repos]);

  const filteredRepos = useMemo(() => {
    let list = repos.filter((r) => {
      if (repoSearch.trim()) {
        const query = repoSearch.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(query);
        const matchesFull = r.full_name?.toLowerCase().includes(query);
        const matchesDesc = r.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesFull && !matchesDesc) return false;
      }

      if (repoLanguageFilter !== "ALL" && r.primary_language !== repoLanguageFilter) {
        return false;
      }

      return true;
    });

    list.sort((a, b) => {
      if (repoSort === "stars") return (b.stars || 0) - (a.stars || 0);
      if (repoSort === "pushed") return new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime();
      if (repoSort === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    });

    return list;
  }, [repos, repoSearch, repoLanguageFilter, repoSort]);

  // ==========================================
  // Quick Actions on Portfolio Projects
  // ==========================================
  const handleTogglePublish = async (project) => {
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_PUBLISH_TOGGLE(project._id), {
        method: "PUT",
      });
      if (result.success) {
        toast({
          title: result.status === "published" ? "Published" : "Moved to Draft",
          description: `Project "${project.title}" is now ${result.status}.`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to toggle status.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePin = async (project) => {
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_PIN_TOGGLE(project._id), {
        method: "PUT",
      });
      if (result.success) {
        toast({
          title: result.project.pinned ? "Pinned to Top" : "Unpinned",
          description: `Project "${project.title}" updated.`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncProject = async (project) => {
    if (!project.githubRepoFullName) {
      toast({
        title: "No Repository Linked",
        description: "Connect a GitHub repository to sync with GitHub.",
        variant: "destructive",
      });
      return;
    }

    setSyncingProjectId(project._id);
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_SYNC(project._id), {
        method: "POST",
      });
      if (result.success) {
        toast({
          title: "Synchronized",
          description: `Updated GitHub data for "${project.githubRepoFullName}".`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Could not sync with GitHub.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingProjectId(null);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!confirm(`Are you sure you want to permanently delete "${project.title}"?`)) return;

    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_DELETE(project._id), {
        method: "DELETE",
      });
      if (result.success) {
        toast({
          title: "Project Deleted",
          description: `"${project.title}" has been removed.`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete project.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // Preview Modal Handlers
  // ==========================================
  const handleOpenPreview = async (repo) => {
    setPreviewRepo(repo);
    setPreviewDetails(null);
    setPreviewLoading(true);
    try {
      const [owner, repoName] = repo.full_name.split("/");
      const res = await fetchGitHubRepoDetails(owner, repoName);
      setPreviewDetails(res.data);
    } catch (e) {
      console.warn("Could not load full repo details for preview", e);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewRepo(null);
    setPreviewDetails(null);
  };

  // ==========================================
  // Import Repository to Portfolio
  // ==========================================
  const handleImportRepo = async (repo, asDraft = true) => {
    try {
      const [owner, repoName] = repo.full_name.split("/");
      const existing = importedRepoMap.get(repo.full_name.toLowerCase());
      if (existing) {
        if (!confirm(`"${repo.full_name}" is already linked to "${existing.title}". Do you want to edit that project instead?`)) {
          return;
        }
        openEditModal(existing);
        return;
      }

      toast({
        title: "Fetching Details...",
        description: `Inspecting ${repo.full_name} metadata & README from GitHub.`,
      });

      const detailsRes = await fetchGitHubRepoDetails(owner, repoName);
      const suggested = detailsRes.data.suggested;

      setEditingProject(null);
      setFormData({
        title: suggested.title || repo.name,
        description: suggested.description || repo.description || "",
        shortSummary: (suggested.description || repo.description || "").slice(0, 150),
        technologies: (suggested.technologies || []).join(", "),
        githubUrl: suggested.githubUrl || repo.html_url,
        demoUrl: suggested.demoUrl || repo.homepage || "",
        role: suggested.role || "Full-Stack Architect",
        category: suggested.category || (repo.source_scope === "ORGANIZATION" ? "Distributed Systems" : "Full-Stack"),
        highlights: detailsRes.data.readme?.summary
          ? detailsRes.data.readme.summary.slice(0, 300)
          : "",
        status: asDraft ? "draft" : "published",
        projectType: "completed",
        proposalStatus: "pending",
        clientOrPartner: "",
        location: "",
        startDate: "",
        completionDate: "",
        objectives: "",
        challenges: "",
        proposedSolution: "",
        expectedOutcomes: "",
        resultsAndImpact: "",
        equipment: "",
        showGithubLink: true,
        pinned: false,
        isMini: false,
        githubRepoId: suggested.githubRepoId || repo.id,
        githubRepoFullName: suggested.githubRepoFullName || repo.full_name,
        githubOwnerLogin: suggested.githubOwnerLogin || owner,
        githubSourceScope: suggested.githubSourceScope || repo.source_scope,
        sourceType: suggested.sourceType || (repo.source_scope === "ORGANIZATION" ? "organization" : "personal"),
        showGithubMetrics: true,
        autoSyncMetrics: true,
        image: null,
      });

      setImagePreview(null);
      setShowModal(true);
      if (previewRepo) handleClosePreview();
    } catch (e) {
      console.error("Error importing repo:", e);
      toast({
        title: "Import Error",
        description: e instanceof Error ? e.message : "Failed to retrieve repository details",
        variant: "destructive",
      });
    }
  };

  const handleToggleSelectRepo = (fullName) => {
    setSelectedRepoFullNames((prev) => {
      const next = new Set(prev);
      if (next.has(fullName)) {
        next.delete(fullName);
      } else {
        next.add(fullName);
      }
      return next;
    });
  };

  const handleSelectAllFilteredRepos = () => {
    if (selectedRepoFullNames.size === filteredRepos.length) {
      setSelectedRepoFullNames(new Set());
    } else {
      setSelectedRepoFullNames(new Set(filteredRepos.map((r) => r.full_name)));
    }
  };

  const handleBulkImportSelected = async () => {
    if (selectedRepoFullNames.size === 0) return;
    if (
      !confirm(
        `Import ${selectedRepoFullNames.size} repositories as Draft portfolio projects? You can edit and publish each individually.`
      )
    )
      return;

    setBulkImporting(true);
    let successCount = 0;
    let failCount = 0;

    for (const fullName of Array.from(selectedRepoFullNames)) {
      const [owner, repoName] = fullName.split("/");
      try {
        const res = await apiFetch(API_ENDPOINTS.PROJECTS_IMPORT_GITHUB, {
          method: "POST",
          body: JSON.stringify({
            owner,
            repo: repoName,
            publishNow: false,
          }),
        });
        if (res.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
    }

    setBulkImporting(false);
    setSelectedRepoFullNames(new Set());
    toast({
      title: "Bulk Import Finished",
      description: `Successfully imported ${successCount} project(s)${failCount > 0 ? `, ${failCount} failed or skipped` : ""}.`,
    });
    fetchProjects();
    setActiveView("portfolio");
    window.dispatchEvent(new Event("projectsUpdated"));
  };

  // ==========================================
  // Modal Open & Close Handlers
  // ==========================================
  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      shortSummary: "",
      technologies: "",
      githubUrl: "",
      demoUrl: "",
      role: "Full-Stack Architect",
      category: "Full-Stack",
      highlights: "",
      status: "published",
      projectType: "completed",
      proposalStatus: "pending",
      clientOrPartner: "",
      location: "",
      startDate: "",
      completionDate: "",
      objectives: "",
      challenges: "",
      proposedSolution: "",
      expectedOutcomes: "",
      resultsAndImpact: "",
      equipment: "",
      showGithubLink: true,
      pinned: false,
      isMini: false,
      githubRepoId: null,
      githubRepoFullName: "",
      githubOwnerLogin: "",
      githubSourceScope: "PERSONAL",
      sourceType: "manual",
      showGithubMetrics: true,
      autoSyncMetrics: true,
      image: null,
    });
    setImagePreview(null);
    setShowImageManager(false);
    setProjectImages([]);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      shortSummary: project.shortSummary || "",
      technologies: (project.technologies || []).join(", "),
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      role: project.role || "Developer",
      category: project.category || "Full-Stack",
      highlights: Array.isArray(project.highlights)
        ? project.highlights.join("\n")
        : project.highlights || "",
      status: project.status || "published",
      projectType: project.projectType || "completed",
      proposalStatus: project.proposalStatus || "pending",
      clientOrPartner: project.clientOrPartner || "",
      location: project.location || "",
      startDate: project.startDate || "",
      completionDate: project.completionDate || "",
      objectives: Array.isArray(project.objectives)
        ? project.objectives.join("\n")
        : project.objectives || "",
      challenges: project.challenges || "",
      proposedSolution: project.proposedSolution || "",
      expectedOutcomes: Array.isArray(project.expectedOutcomes)
        ? project.expectedOutcomes.join("\n")
        : project.expectedOutcomes || "",
      resultsAndImpact: Array.isArray(project.resultsAndImpact)
        ? project.resultsAndImpact.join("\n")
        : project.resultsAndImpact || "",
      equipment: Array.isArray(project.equipment)
        ? project.equipment.join(", ")
        : project.equipment || "",
      showGithubLink: project.showGithubLink !== false,
      pinned: project.pinned || false,
      isMini: project.isMini || false,
      githubRepoId: project.githubRepoId || null,
      githubRepoFullName: project.githubRepoFullName || "",
      githubOwnerLogin: project.githubOwnerLogin || "",
      githubSourceScope: project.githubSourceScope || "PERSONAL",
      sourceType: project.sourceType || (project.githubSourceScope === "ORGANIZATION" ? "organization" : project.githubSourceScope === "PERSONAL" ? "personal" : "manual"),
      showGithubMetrics: project.showGithubMetrics !== false,
      autoSyncMetrics: project.autoSyncMetrics !== false,
      image: null,
    });
    setImagePreview(project.image ? getImageUrl(project.image) : null);
    setShowModal(true);
    setShowImageManager(false);
    fetchProjectImages(project._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImagePreview(null);
    setShowImageManager(false);
    setProjectImages([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // Form Submission Handler
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProject(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "technologies",
      JSON.stringify(
        formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
    formDataToSend.append("githubUrl", formData.githubUrl);
    formDataToSend.append("demoUrl", formData.demoUrl);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("projectType", formData.projectType || "completed");
    formDataToSend.append("proposalStatus", formData.proposalStatus || "pending");
    formDataToSend.append("shortSummary", formData.shortSummary || "");
    formDataToSend.append("clientOrPartner", formData.clientOrPartner || "");
    formDataToSend.append("location", formData.location || "");
    formDataToSend.append("startDate", formData.startDate || "");
    formDataToSend.append("completionDate", formData.completionDate || "");
    formDataToSend.append("challenges", formData.challenges || "");
    formDataToSend.append("proposedSolution", formData.proposedSolution || "");
    formDataToSend.append("showGithubLink", formData.showGithubLink !== false);
    formDataToSend.append("pinned", formData.pinned);
    formDataToSend.append("isMini", formData.isMini);
    formDataToSend.append("githubRepoFullName", formData.githubRepoFullName || "");
    formDataToSend.append("githubOwnerLogin", formData.githubOwnerLogin || "");
    formDataToSend.append("githubSourceScope", formData.githubSourceScope || "");
    formDataToSend.append("sourceType", formData.sourceType || "manual");
    formDataToSend.append("showGithubMetrics", formData.showGithubMetrics);
    formDataToSend.append("autoSyncMetrics", formData.autoSyncMetrics);

    if (formData.githubRepoId) {
      formDataToSend.append("githubRepoId", formData.githubRepoId);
    }

    if (formData.objectives) {
      const parsed = formData.objectives.split("\n").map((o) => o.trim()).filter(Boolean);
      formDataToSend.append("objectives", JSON.stringify(parsed));
    }

    if (formData.expectedOutcomes) {
      const parsed = formData.expectedOutcomes.split("\n").map((o) => o.trim()).filter(Boolean);
      formDataToSend.append("expectedOutcomes", JSON.stringify(parsed));
    }

    if (formData.resultsAndImpact) {
      const parsed = formData.resultsAndImpact.split("\n").map((r) => r.trim()).filter(Boolean);
      formDataToSend.append("resultsAndImpact", JSON.stringify(parsed));
    }

    if (formData.equipment) {
      const parsed = formData.equipment.split(",").map((e) => e.trim()).filter(Boolean);
      formDataToSend.append("equipment", JSON.stringify(parsed));
    }

    if (formData.highlights) {
      const parsedHighlights = formData.highlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);
      formDataToSend.append("highlights", JSON.stringify(parsedHighlights));
    }

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const url = editingProject
        ? API_ENDPOINTS.PROJECTS_UPDATE(editingProject._id)
        : API_ENDPOINTS.PROJECTS_CREATE;

      const result = await apiFetchFormData(
        url,
        formDataToSend,
        editingProject ? "PUT" : "POST"
      );

      if (result.success || result.project) {
        toast({
          title: editingProject ? "Project Updated" : "Project Created",
          description: `"${formData.title}" has been saved.`,
        });
        closeModal();
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Save Failed",
          description: result.error || result.message || "Failed to save project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Error saving project.",
        variant: "destructive",
      });
    } finally {
      setSavingProject(false);
    }
  };

  // Image Upload Handlers
  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !editingProject) return;

    setUploadingImages(true);
    const formDataImages = new FormData();
    files.forEach((f) => formDataImages.append("images", f));

    try {
      const result = await apiFetchFormData(
        API_ENDPOINTS.PROJECT_IMAGES_UPLOAD(editingProject._id),
        formDataImages,
        "POST"
      );

      if (result.success) {
        toast({
          title: "Images Uploaded",
          description: `Added ${result.data?.length || files.length} screenshot(s).`,
        });
        fetchProjectImages(editingProject._id);
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload screenshots.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Are you sure you want to delete this screenshot?")) return;

    try {
      const result = await apiFetch(
        API_ENDPOINTS.PROJECT_IMAGE_DELETE(editingProject._id, imageId),
        { method: "DELETE" }
      );

      if (result.success) {
        toast({
          title: "Screenshot Deleted",
          description: "Image removed from portfolio.",
        });
        fetchProjectImages(editingProject._id);
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSetFeatured = async (imageId) => {
    try {
      const result = await apiFetch(
        API_ENDPOINTS.PROJECT_IMAGE_UPDATE(editingProject._id, imageId),
        {
          method: "PUT",
          body: JSON.stringify({ isFeatured: true }),
        }
      );

      if (result.success) {
        toast({
          title: "Featured Image Set",
          description: "This screenshot will display as the primary cover.",
        });
        fetchProjectImages(editingProject._id);
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      }
    } catch (error) {
      console.error("Error setting featured image:", error);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-body">
      {/* View Switcher Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--primary-accent,#FFDD9B)] font-bold">
              Engineering Console
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
            <span className="text-xs text-[var(--text-secondary,#FFF1D8)] font-mono">
              Live GitHub Bridge
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary,#FFFFFF)] font-heading tracking-tight">
            Projects & GitHub Integration
          </h2>
        </div>

        {/* View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08]">
            <button
              onClick={() => setActiveView("portfolio")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeView === "portfolio"
                  ? "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] shadow-md shadow-[#FFDD9B]/20"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
              }`}
            >
              <FolderKanban size={14} />
              <span>Portfolio Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveView("github-browser")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                activeView === "github-browser"
                  ? "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] shadow-md shadow-[#FFDD9B]/20"
                  : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
              }`}
            >
              <Github size={14} />
              <span>Browse Real GitHub Repos</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[var(--text-primary,#FFFFFF)] border border-white/[0.1] text-xs font-bold transition-all"
          >
            <Plus size={14} className="text-[var(--primary-accent,#FFDD9B)]" />
            <span>New Manual Project</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PORTFOLIO PROJECTS MANAGEMENT                                     */}
      {/* ========================================================================= */}
      {activeView === "portfolio" && (
        <PortfolioProjectsView
          projects={projects}
          projectsLoading={projectsLoading}
          filteredProjects={filteredProjects}
          projectSearch={projectSearch}
          setProjectSearch={setProjectSearch}
          projectStatusFilter={projectStatusFilter}
          setProjectStatusFilter={setProjectStatusFilter}
          projectCategoryFilter={projectCategoryFilter}
          setProjectCategoryFilter={setProjectCategoryFilter}
          availableCategories={availableCategories}
          syncingProjectId={syncingProjectId}
          onTogglePublish={handleTogglePublish}
          onTogglePin={handleTogglePin}
          onSyncProject={handleSyncProject}
          onEditProject={openEditModal}
          onDeleteProject={handleDeleteProject}
          onSwitchToGithubBrowser={() => setActiveView("github-browser")}
          onOpenCreateModal={openCreateModal}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: REAL GITHUB REPOSITORY BROWSER                                    */}
      {/* ========================================================================= */}
      {activeView === "github-browser" && (
        <GitHubRepoBrowser
          repoSource={repoSource}
          setRepoSource={setRepoSource}
          currentUsername={currentUsername}
          currentOrg={currentOrg}
          repos={repos}
          reposLoading={reposLoading}
          reposError={reposError}
          repoSearch={repoSearch}
          setRepoSearch={setRepoSearch}
          repoLanguageFilter={repoLanguageFilter}
          setRepoLanguageFilter={setRepoLanguageFilter}
          repoSort={repoSort}
          setRepoSort={setRepoSort}
          availableRepoLanguages={availableRepoLanguages}
          filteredRepos={filteredRepos}
          selectedRepoFullNames={selectedRepoFullNames}
          onToggleSelectRepo={handleToggleSelectRepo}
          onSelectAllFilteredRepos={handleSelectAllFilteredRepos}
          onBulkImportSelected={handleBulkImportSelected}
          bulkImporting={bulkImporting}
          importedRepoMap={importedRepoMap}
          onOpenPreview={handleOpenPreview}
          onImportRepo={handleImportRepo}
          onForceRefresh={fetchRealGitHubRepos}
        />
      )}

      {/* REPOSITORY PREVIEW DETAILS MODAL */}
      <GitHubRepoPreviewModal
        previewRepo={previewRepo}
        previewDetails={previewDetails}
        previewLoading={previewLoading}
        onClose={handleClosePreview}
        onImport={handleImportRepo}
      />

      {/* CREATE / EDIT PROJECT MODAL */}
      <ProjectFormModal
        showModal={showModal}
        editingProject={editingProject}
        formData={formData}
        setFormData={setFormData}
        savingProject={savingProject}
        showImageManager={showImageManager}
        setShowImageManager={setShowImageManager}
        projectImages={projectImages}
        uploadingImages={uploadingImages}
        imagePreview={imagePreview}
        onSubmit={handleSubmit}
        onClose={closeModal}
        onImageChange={handleImageChange}
        onUploadImages={handleUploadImages}
        onSetFeatured={handleSetFeatured}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
}

export default ProjectsManager;
