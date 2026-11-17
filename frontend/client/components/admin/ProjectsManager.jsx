import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  FolderKanban,
  Github,
  ExternalLink,
  Pin,
  PinOff,
  Image as ImageIcon,
  Star,
  StarOff,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Layers,
  Save,
  Camera,
  RefreshCw,
  Search,
  Filter,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  User,
  Radio,
  FileText,
  Sparkles,
  GitFork,
  Calendar,
  Code2,
  Download,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";
import CloudinaryImage from "../CloudinaryImage.jsx";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { useGitHubSettings } from "../../hooks/useGitHubSettings";
import { fetchGitHubRepoDetails } from "../../lib/githubApi";

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
  const [projectStatusFilter, setProjectStatusFilter] = useState("ALL"); // ALL, PUBLISHED, DRAFT, PERSONAL, ORGANIZATION, MANUAL
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");
  const [syncingProjectId, setSyncingProjectId] = useState(null);

  // ==========================================
  // GitHub Browser State
  // ==========================================
  const [repoSource, setRepoSource] = useState("PERSONAL"); // 'PERSONAL' | 'ORGANIZATION'
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);
  const [repoSearch, setRepoSearch] = useState("");
  const [repoLanguageFilter, setRepoLanguageFilter] = useState("ALL");
  const [repoSort, setRepoSort] = useState("updated"); // 'updated' | 'pushed' | 'name' | 'stars'
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

  // Dynamic user and org names
  const currentUsername = gitHubSettings?.githubUsername || "yihune1234";
  const currentOrg = gitHubSettings?.githubOrg || "AriitiMarket";

  // Map of full_names that are already imported in the portfolio
  const importedRepoMap = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      if (p.githubRepoFullName) {
        map.set(p.githubRepoFullName.toLowerCase(), p);
      }
    });
    return map;
  }, [projects]);

  // Initial Data Loading
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (showAddProject) {
      openCreateModal();
      setShowAddProject(false);
    }
  }, [showAddProject, setShowAddProject]);

  // Fetch Repositories when switching to GitHub Browser or changing repo source
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
        // Fallback to standard projects list
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
    } catch (error) {
      console.error("Error fetching project images:", error);
    }
  };

  // ==========================================
  // Image URL Helper
  // ==========================================
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("data:")) return imagePath;
    if (imagePath.startsWith("http") && imagePath.includes("res.cloudinary.com")) {
      return imagePath;
    }
    let originalUrl = imagePath;
    if (!imagePath.startsWith("http")) {
      const BASE_URL = "https://portfoliobackend-a6ah.onrender.com";
      const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
      if (cleanPath.startsWith("uploads/")) {
        originalUrl = `${BASE_URL}/${cleanPath}`;
      } else {
        originalUrl = `${BASE_URL}/uploads/${cleanPath}`;
      }
    }
    return `https://res.cloudinary.com/dqcrqtzz6/image/fetch/f_auto,q_auto/${originalUrl}`;
  };

  // ==========================================
  // Filtering & Sorting
  // ==========================================
  // Available categories in existing projects
  const availableCategories = useMemo(() => {
    const set = new Set(["Full-Stack", "Backend Architecture", "Distributed Systems", "Mobile Engineering", "Security & DevOps"]);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  // Filtered Portfolio Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search
      if (projectSearch.trim()) {
        const query = projectSearch.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        const matchesRepo = p.githubRepoFullName?.toLowerCase().includes(query);
        const matchesTech = p.technologies?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesRepo && !matchesTech) return false;
      }

      // Status & Type Filter
      if (projectStatusFilter === "PUBLISHED" && p.status !== "published") return false;
      if (projectStatusFilter === "DRAFT" && p.status !== "draft") return false;
      if (projectStatusFilter === "UNDER_REVIEW" && p.status !== "under_review") return false;
      if (projectStatusFilter === "PROPOSALS" && p.projectType !== "proposed") return false;
      if (projectStatusFilter === "COMPLETED" && (p.projectType || "completed") !== "completed") return false;
      if (projectStatusFilter === "ONGOING" && p.projectType !== "ongoing") return false;
      if (projectStatusFilter === "PERSONAL" && (p.sourceType !== "personal" && p.githubSourceScope !== "PERSONAL")) return false;
      if (projectStatusFilter === "ORGANIZATION" && (p.sourceType !== "organization" && p.githubSourceScope !== "ORGANIZATION")) return false;
      if (projectStatusFilter === "MANUAL" && (p.sourceType !== "manual" || p.githubRepoFullName)) return false;

      // Category Filter
      if (projectCategoryFilter !== "ALL" && p.category !== projectCategoryFilter) return false;

      return true;
    });
  }, [projects, projectSearch, projectStatusFilter, projectCategoryFilter]);

  // Filtered & Sorted GitHub Repositories
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
        description: "Connect a GitHub repository to sync telemetry.",
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
          title: "Telemetry Synchronized",
          description: `Updated GitHub telemetry for "${project.githubRepoFullName}".`,
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
      // Check if already in portfolio
      const existing = importedRepoMap.get(repo.full_name.toLowerCase());
      if (existing) {
        if (!confirm(`"${repo.full_name}" is already linked to "${existing.title}". Do you want to edit that project instead?`)) {
          return;
        }
        openEditModal(existing);
        return;
      }

      // Fetch repo details to pre-populate form
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
        technologies: (suggested.technologies || []).join(", "),
        githubUrl: suggested.githubUrl || repo.html_url,
        demoUrl: suggested.demoUrl || repo.homepage || "",
        role: suggested.role || "Full-Stack Architect",
        category: suggested.category || (repo.source_scope === "ORGANIZATION" ? "Distributed Systems" : "Full-Stack"),
        highlights: detailsRes.data.readme?.summary
          ? detailsRes.data.readme.summary.slice(0, 300)
          : "",
        status: asDraft ? "draft" : "published",
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

  // Bulk Import Handlers
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
          description: `"${formData.title}" is saved as ${formData.status}.`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
        closeModal();
      } else {
        toast({
          title: "Save Failed",
          description: result.message || result.error || "Failed to save project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSavingProject(false);
    }
  };

  // ==========================================
  // Screenshots / Image Gallery Management
  // ==========================================
  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setUploadingImages(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const result = await apiFetchFormData(
        API_ENDPOINTS.PROJECT_IMAGES_UPLOAD(editingProject._id),
        formData,
        "POST"
      );

      if (result.success) {
        toast({
          title: "Images Uploaded",
          description: `${files.length} screenshot(s) saved.`,
        });
        fetchProjectImages(editingProject._id);
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload images.",
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
        <div className="space-y-6">
          {/* Filter Bar & Counters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
              {[
                { id: "ALL", label: `All (${projects.length})` },
                {
                  id: "PUBLISHED",
                  label: `Published (${projects.filter((p) => p.status === "published").length})`,
                },
                {
                  id: "COMPLETED",
                  label: `Completed (${projects.filter((p) => (p.projectType || "completed") === "completed").length})`,
                },
                {
                  id: "ONGOING",
                  label: `Ongoing (${projects.filter((p) => p.projectType === "ongoing").length})`,
                },
                {
                  id: "PROPOSALS",
                  label: `Proposals (${projects.filter((p) => p.projectType === "proposed").length})`,
                },
                {
                  id: "DRAFT",
                  label: `Drafts (${projects.filter((p) => p.status === "draft").length})`,
                },
                {
                  id: "UNDER_REVIEW",
                  label: `Review (${projects.filter((p) => p.status === "under_review").length})`,
                },
                {
                  id: "PERSONAL",
                  label: `Personal (${projects.filter((p) => p.sourceType === "personal" || p.githubSourceScope === "PERSONAL").length})`,
                },
                {
                  id: "ORGANIZATION",
                  label: `Ariiti Org (${projects.filter((p) => p.sourceType === "organization" || p.githubSourceScope === "ORGANIZATION").length})`,
                },
                {
                  id: "MANUAL",
                  label: `Manual (${projects.filter((p) => p.sourceType === "manual" && !p.githubRepoFullName).length})`,
                },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setProjectStatusFilter(chip.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    projectStatusFilter === chip.id
                      ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] shadow-sm"
                      : "text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60"
                />
                <input
                  type="text"
                  placeholder="Search projects or tags..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/50 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 transition-all"
                />
                {projectSearch && (
                  <button
                    onClick={() => setProjectSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={projectCategoryFilter}
                onChange={(e) => setProjectCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {projectsLoading ? (
            <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
              <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
                Loading portfolio projects...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-4">
              <FolderKanban className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
              <div>
                <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
                  No projects match your filter
                </p>
                <p className="text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto mt-1">
                  You can browse your real GitHub repositories and import them with one click, or create a project manually.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView("github-browser")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FFDD9B]/20"
                >
                  <Github size={14} />
                  <span>Browse GitHub Repositories</span>
                </button>
                <button
                  onClick={openCreateModal}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-bold text-xs flex items-center gap-2"
                >
                  <Plus size={14} />
                  <span>Create Project Manually</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => {
                const isPublished = project.status !== "draft";
                const isOrg =
                  project.sourceType === "organization" ||
                  project.githubSourceScope === "ORGANIZATION";
                const isPersonal =
                  project.sourceType === "personal" ||
                  project.githubSourceScope === "PERSONAL";
                const isManual = !project.githubRepoFullName;
                const isSyncing = syncingProjectId === project._id;

                return (
                  <motion.div
                    key={project._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`group rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all flex flex-col overflow-hidden shadow-lg ${
                      project.pinned
                        ? "border-[var(--primary-accent,#FFDD9B)]/40 ring-1 ring-[var(--primary-accent,#FFDD9B)]/20"
                        : "border-white/[0.08] hover:border-white/[0.2]"
                    }`}
                  >
                    {/* Media Cover */}
                    <div className="relative aspect-video bg-[var(--bg-base,#302E2D)] overflow-hidden">
                      {project.image ? (
                        <CloudinaryImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          width={400}
                          height={225}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#302E2D] to-[#252322]">
                          <Code2 className="w-10 h-10 text-[var(--primary-accent,#FFDD9B)]/40 mb-2" />
                          <span className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)]">
                            {project.githubRepoFullName || project.title}
                          </span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        {/* Project Type Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow-md backdrop-blur-md border ${
                            project.projectType === "proposed"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              : project.projectType === "ongoing"
                              ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {project.projectType === "proposed"
                            ? "Proposed"
                            : project.projectType === "ongoing"
                            ? "Ongoing"
                            : "Completed"}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow-md ${
                            project.status === "published"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md"
                              : project.status === "under_review"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-md"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md"
                          }`}
                        >
                          {project.status === "published"
                            ? "Published"
                            : project.status === "under_review"
                            ? "Under Review"
                            : "Draft"}
                        </span>

                        {/* Source Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border shadow-md backdrop-blur-md ${
                            isOrg
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : isPersonal
                              ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                              : "bg-white/10 text-white/80 border-white/20"
                          }`}
                        >
                          {isOrg ? "Ariiti Org" : isPersonal ? "Personal Lab" : "Manual"}
                        </span>
                      </div>

                      {/* Pinned & Image Count Badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {project.pinned && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] text-[9px] font-bold font-mono uppercase tracking-wider shadow-md flex items-center gap-1">
                            <Pin size={10} className="fill-current" />
                            Pinned
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10 text-[9px] font-mono font-bold">
                          {project.images?.length || 0} pics
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-heading font-black text-base text-[var(--text-primary,#FFFFFF)] group-hover:text-[var(--primary-accent,#FFDD9B)] transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.08] flex-shrink-0">
                          {project.category || "Full-Stack"}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-4 flex-1">
                        {project.description}
                      </p>

                      {/* Technologies Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(project.technologies || []).slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {(project.technologies || []).length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/60">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* GitHub Linkage & Live Metrics */}
                      {project.githubRepoFullName ? (
                        <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] mb-4 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-1.5 truncate text-[var(--text-primary,#FFFFFF)]">
                              <Github size={13} className="text-[var(--primary-accent,#FFDD9B)] flex-shrink-0" />
                              <span className="truncate font-bold">{project.githubRepoFullName}</span>
                            </div>

                            <a
                              href={project.githubUrl || `https://github.com/${project.githubRepoFullName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--text-secondary,#FFF1D8)]/60 hover:text-[var(--primary-accent,#FFDD9B)] ml-1"
                              title="Open on GitHub"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>

                          {project.githubMetadata && (
                            <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/80">
                              <span className="flex items-center gap-1">
                                <Star size={10} className="text-amber-400" />
                                {project.githubMetadata.stars ?? 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork size={10} className="text-sky-400" />
                                {project.githubMetadata.forks ?? 0}
                              </span>
                              {project.githubMetadata.primaryLanguage && (
                                <span className="truncate">
                                  {project.githubMetadata.primaryLanguage}
                                </span>
                              )}
                              {project.lastSyncedAt && (
                                <span className="ml-auto text-[9px] text-[var(--text-secondary,#FFF1D8)]/50">
                                  Synced {new Date(project.lastSyncedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)]/60 border border-dashed border-white/[0.08] mb-4 text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 flex items-center justify-between">
                          <span>Manual project &bull; No GitHub link</span>
                          <button
                            onClick={() => openEditModal(project)}
                            className="text-[var(--primary-accent,#FFDD9B)] hover:underline"
                          >
                            Link Repo
                          </button>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1">
                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            isPublished
                              ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
                          }`}
                          title={isPublished ? "Unpublish to draft" : "Publish to live portfolio"}
                        >
                          {isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span>{isPublished ? "Published" : "Draft"}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {/* Sync Button */}
                          {project.githubRepoFullName && (
                            <button
                              onClick={() => handleSyncProject(project)}
                              disabled={isSyncing}
                              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)] transition-colors"
                              title="Sync telemetry with GitHub"
                            >
                              <RefreshCw
                                size={14}
                                className={isSyncing ? "animate-spin text-[var(--primary-accent,#FFDD9B)]" : ""}
                              />
                            </button>
                          )}

                          {/* Pin Toggle */}
                          <button
                            onClick={() => handleTogglePin(project)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              project.pinned
                                ? "text-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)]/10"
                                : "text-[var(--text-secondary,#FFF1D8)] hover:bg-white/[0.08]"
                            }`}
                            title={project.pinned ? "Unpin from top" : "Pin to top of portfolio"}
                          >
                            <Pin size={14} />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => openEditModal(project)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-colors"
                            title="Edit Project"
                          >
                            <Edit3 size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteProject(project)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary,#FFF1D8)] hover:text-red-400 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: REAL GITHUB REPOSITORY BROWSER                                    */}
      {/* ========================================================================= */}
      {activeView === "github-browser" && (
        <div className="space-y-6">
          {/* Source Selector & Account Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Account Option */}
            <div
              onClick={() => setRepoSource("PERSONAL")}
              className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
                repoSource === "PERSONAL"
                  ? "bg-[var(--card-surface,#403C38)] border-[var(--primary-accent,#FFDD9B)] shadow-xl shadow-[var(--primary-accent,#FFDD9B)]/10"
                  : "bg-[var(--card-surface,#403C38)]/60 border-white/[0.08] hover:border-white/[0.2]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <User size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70 block">
                      Personal Account
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary,#FFFFFF)] font-mono">
                      @{currentUsername}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    repoSource === "PERSONAL"
                      ? "border-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                      : "border-white/20"
                  }`}
                >
                  {repoSource === "PERSONAL" && <Check size={12} className="stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                Personal engineering repositories, open-source utilities, and architectural research from your primary profile.
              </p>
            </div>

            {/* Organization Account Option */}
            <div
              onClick={() => setRepoSource("ORGANIZATION")}
              className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
                repoSource === "ORGANIZATION"
                  ? "bg-[var(--card-surface,#403C38)] border-[var(--primary-accent,#FFDD9B)] shadow-xl shadow-[var(--primary-accent,#FFDD9B)]/10"
                  : "bg-[var(--card-surface,#403C38)]/60 border-white/[0.08] hover:border-white/[0.2]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary,#FFF1D8)]/70 block">
                      Organization Platform
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary,#FFFFFF)] font-mono">
                      @{currentOrg}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    repoSource === "ORGANIZATION"
                      ? "border-[var(--primary-accent,#FFDD9B)] bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                      : "border-white/20"
                  }`}
                >
                  {repoSource === "ORGANIZATION" && <Check size={12} className="stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed">
                Production ecosystem microservices, multi-tenant ventures, and team platforms under the organization umbrella.
              </p>
            </div>
          </div>

          {/* Browser Filter & Search Controls */}
          <div className="p-4 rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary,#FFF1D8)]/60"
                />
                <input
                  type="text"
                  placeholder={`Search ${repoSource === "ORGANIZATION" ? currentOrg : currentUsername} repositories by name or description...`}
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-[var(--text-primary,#FFFFFF)] placeholder-[var(--text-secondary,#FFF1D8)]/40 focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 transition-all font-mono"
                />
                {repoSearch && (
                  <button
                    onClick={() => setRepoSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/40 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Language Filter */}
              <select
                value={repoLanguageFilter}
                onChange={(e) => setRepoLanguageFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
              >
                <option value="ALL">All Languages</option>
                {availableRepoLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={repoSort}
                onChange={(e) => setRepoSort(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono text-[var(--text-secondary,#FFF1D8)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
              >
                <option value="updated">Recently Updated</option>
                <option value="pushed">Recently Pushed</option>
                <option value="name">Name (A-Z)</option>
                <option value="stars">Most Stars</option>
              </select>

              {/* Force Refresh Button */}
              <button
                onClick={() => fetchRealGitHubRepos(true)}
                disabled={reposLoading}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] border border-white/[0.08] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                title="Bypass cache and force refresh from GitHub API"
              >
                <RefreshCw size={13} className={reposLoading ? "animate-spin text-[var(--primary-accent,#FFDD9B)]" : ""} />
                <span>Refresh Repos</span>
              </button>
            </div>

            {/* Bulk Selection Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAllFilteredRepos}
                  className="hover:text-white transition-colors underline underline-offset-4"
                >
                  {selectedRepoFullNames.size === filteredRepos.length && filteredRepos.length > 0
                    ? "Deselect All"
                    : `Select All Filtered (${filteredRepos.length})`}
                </button>
                <span>&bull;</span>
                <span>
                  {selectedRepoFullNames.size} repository(s) selected
                </span>
              </div>

              {selectedRepoFullNames.size > 0 && (
                <button
                  onClick={handleBulkImportSelected}
                  disabled={bulkImporting}
                  className="px-4 py-1.5 rounded-lg bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FFDD9B]/20 disabled:opacity-50"
                >
                  {bulkImporting ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    <Download size={12} />
                  )}
                  <span>
                    Bulk Import {selectedRepoFullNames.size} Repos as Drafts
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Repositories List / Grid */}
          {reposLoading ? (
            <div className="py-24 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08]">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-3" />
              <p className="text-sm font-mono text-[var(--text-secondary,#FFF1D8)]">
                Querying official GitHub REST API for @{repoSource === "ORGANIZATION" ? currentOrg : currentUsername}...
              </p>
            </div>
          ) : reposError ? (
            <div className="py-16 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-red-500/30 p-8 space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
              <div>
                <p className="text-lg font-bold text-red-400">
                  Failed to fetch GitHub repositories
                </p>
                <p className="text-sm text-[var(--text-secondary,#FFF1D8)] max-w-md mx-auto mt-1">
                  {reposError}
                </p>
              </div>
              <button
                onClick={() => fetchRealGitHubRepos(true)}
                className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 text-xs font-mono font-bold"
              >
                Retry Request
              </button>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.08] p-8 space-y-3">
              <Github className="w-12 h-12 mx-auto text-[var(--primary-accent,#FFDD9B)]/40" />
              <p className="text-lg font-bold text-[var(--text-primary,#FFFFFF)]">
                No repositories found
              </p>
              <p className="text-sm text-[var(--text-secondary,#FFF1D8)]">
                Try clearing your search query or language filter.
              </p>
              {(repoSearch || repoLanguageFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setRepoSearch("");
                    setRepoLanguageFilter("ALL");
                  }}
                  className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRepos.map((repo) => {
                const isSelected = selectedRepoFullNames.has(repo.full_name);
                const existingProject = importedRepoMap.get(repo.full_name.toLowerCase());

                return (
                  <div
                    key={repo.id}
                    className={`p-5 rounded-2xl bg-[var(--card-surface,#403C38)] border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[var(--primary-accent,#FFDD9B)] shadow-md shadow-[var(--primary-accent,#FFDD9B)]/10"
                        : "border-white/[0.08] hover:border-white/[0.18]"
                    }`}
                  >
                    <div>
                      {/* Top Row: Selection Checkbox, Avatar, Name & Badges */}
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRepo(repo.full_name)}
                          className="w-4 h-4 mt-1 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer flex-shrink-0"
                        />

                        <img
                          src={repo.owner?.avatar_url || "https://github.com/identicons/default.png"}
                          alt={repo.owner?.login}
                          className="w-9 h-9 rounded-xl border border-white/10 flex-shrink-0 object-cover"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-heading font-black text-sm text-[var(--text-primary,#FFFFFF)] truncate">
                              {repo.name}
                            </h4>

                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-[var(--text-secondary,#FFF1D8)] border border-white/10">
                              {repo.visibility || "public"}
                            </span>

                            {existingProject && (
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <Check size={10} />
                                In Portfolio ({existingProject.status})
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 truncate">
                            {repo.full_name}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed line-clamp-2 mb-3">
                        {repo.description || "No description provided for this repository."}
                      </p>

                      {/* Topics */}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {repo.topics.slice(0, 4).map((topic, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--primary-accent,#FFDD9B)]/10 text-[var(--primary-accent,#FFDD9B)] border border-[var(--primary-accent,#FFDD9B)]/20"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Metadata Chips: Language, Stars, Forks, Updated */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[var(--text-secondary,#FFF1D8)]/75 py-2 border-t border-white/[0.06]">
                        {repo.primary_language && (
                          <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary,#FFFFFF)]">
                            <span className="w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                            {repo.primary_language}
                          </span>
                        )}

                        <span className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400" />
                          {repo.stars ?? 0}
                        </span>

                        <span className="flex items-center gap-1">
                          <GitFork size={11} className="text-sky-400" />
                          {repo.forks ?? 0}
                        </span>

                        <span className="flex items-center gap-1 text-[10px] text-[var(--text-secondary,#FFF1D8)]/50 ml-auto">
                          <Calendar size={10} />
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] mt-2">
                      <button
                        onClick={() => handleImportRepo(repo, true)}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          existingProject
                            ? "bg-white/[0.08] hover:bg-white/[0.15] text-white"
                            : "bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] shadow-[#FFDD9B]/20"
                        }`}
                      >
                        <Download size={13} />
                        <span>{existingProject ? "Re-import / Edit" : "Import as Project"}</span>
                      </button>

                      <button
                        onClick={() => handleOpenPreview(repo)}
                        className="py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-mono font-bold flex items-center gap-1"
                        title="Preview README and languages"
                      >
                        <BookOpen size={13} />
                        <span>Preview</span>
                      </button>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[var(--text-secondary,#FFF1D8)] hover:text-white transition-colors"
                        title="View on GitHub"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPOSITORY PREVIEW MODAL (README + LANGUAGES BREAKDOWN)                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewRepo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[var(--bg-base,#302E2D)]">
                <div className="flex items-center gap-3">
                  <Github className="w-6 h-6 text-[var(--primary-accent,#FFDD9B)]" />
                  <div>
                    <h3 className="font-heading font-black text-lg text-[var(--text-primary,#FFFFFF)]">
                      {previewRepo.full_name}
                    </h3>
                    <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                      Telemetry & Documentation Preview
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClosePreview}
                  className="p-2 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[var(--text-secondary,#FFF1D8)]">
                {previewLoading ? (
                  <div className="py-20 text-center">
                    <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary-accent,#FFDD9B)] mb-2" />
                    <p className="font-mono text-xs text-[var(--text-secondary,#FFF1D8)]">
                      Fetching languages & README from GitHub API...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Repository Telemetry Overview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                        <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                          Primary Lang
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          {previewRepo.primary_language || "None"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                        <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                          Stars / Forks
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          {previewRepo.stars} / {previewRepo.forks}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                        <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                          Default Branch
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          {previewRepo.default_branch || "main"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06]">
                        <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/60 block">
                          Scope
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          {previewRepo.source_scope}
                        </span>
                      </div>
                    </div>

                    {/* Languages Breakdown */}
                    {previewDetails?.languages && Object.keys(previewDetails.languages).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider">
                          Languages Breakdown
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(previewDetails.languages).map(([lang, bytes]) => (
                            <span
                              key={lang}
                              className="px-3 py-1 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs font-mono flex items-center gap-2"
                            >
                              <span className="w-2 h-2 rounded-full bg-[var(--primary-accent,#FFDD9B)]" />
                              <span className="font-bold text-white">{lang}</span>
                              <span className="text-white/40 text-[10px]">
                                {(bytes / 1024).toFixed(1)} KB
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* README Content or Summary */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider">
                        README Documentation
                      </h4>
                      {previewDetails?.readme?.content ? (
                        <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] font-mono text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                          {previewDetails.readme.content}
                        </div>
                      ) : (
                        <p className="text-xs font-mono text-white/50 italic">
                          No README file detected in this repository default branch.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-white/[0.08] bg-[var(--bg-base,#302E2D)] flex items-center justify-end gap-3">
                <button
                  onClick={handleClosePreview}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-white text-xs font-bold font-mono hover:bg-white/[0.1]"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => handleImportRepo(previewRepo, true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-bold font-mono shadow-lg shadow-[#FFDD9B]/20"
                >
                  Import into Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CREATE / EDIT / IMPORT PROJECT MODAL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl bg-[var(--card-surface,#403C38)] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[var(--bg-base,#302E2D)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/30 flex items-center justify-center text-[var(--primary-accent,#FFDD9B)] font-bold">
                    {editingProject ? <Edit3 size={18} /> : <Plus size={18} />}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-[var(--text-primary,#FFFFFF)]">
                      {editingProject ? `Edit: ${editingProject.title}` : "Create Portfolio Project"}
                    </h3>
                    <p className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
                      {formData.githubRepoFullName
                        ? `Linked to GitHub: ${formData.githubRepoFullName}`
                        : "Manual portfolio entry"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => setShowImageManager(!showImageManager)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        showImageManager
                          ? "bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D]"
                          : "bg-white/[0.06] text-[var(--text-secondary,#FFF1D8)] hover:text-white"
                      }`}
                    >
                      <ImageIcon size={14} />
                      <span>{showImageManager ? "Back to Edit" : "Screenshots"}</span>
                    </button>
                  )}

                  <button
                    onClick={closeModal}
                    className="p-2 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 p-6">
                {showImageManager && editingProject ? (
                  /* Screenshot & Image Gallery Manager */
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Screenshot Gallery ({projectImages.length})
                        </h4>
                        <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/70 mt-0.5">
                          Upload high-resolution screenshots. Drag to reorder, star to feature.
                        </p>
                      </div>

                      <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#FFDD9B]/20">
                        <Upload size={14} />
                        <span>{uploadingImages ? "Uploading..." : "Upload Screenshots"}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleUploadImages}
                          disabled={uploadingImages}
                        />
                      </label>
                    </div>

                    {projectImages.length === 0 ? (
                      <div className="py-16 text-center rounded-xl bg-[var(--bg-base,#302E2D)] border border-dashed border-white/[0.08]">
                        <Camera className="w-10 h-10 mx-auto text-white/30 mb-2" />
                        <p className="text-sm font-bold text-white">No extra screenshots yet</p>
                        <p className="text-xs text-[var(--text-secondary,#FFF1D8)]/60 mt-1">
                          Upload platform previews, architecture diagrams, or UI captures.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projectImages.map((img) => (
                          <div
                            key={img._id}
                            className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] space-y-2 relative group"
                          >
                            <div className="aspect-video rounded-lg overflow-hidden bg-black/40 relative">
                              <img
                                src={img.url}
                                alt={img.title || "Screenshot"}
                                className="w-full h-full object-cover"
                              />
                              {img.isFeatured && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] text-[#302E2D] text-[9px] font-bold font-mono uppercase">
                                  Cover Image
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)] truncate">
                                {img.title || "Screenshot"}
                              </span>

                              <div className="flex items-center gap-1">
                                {!img.isFeatured && (
                                  <button
                                    onClick={() => handleSetFeatured(img._id)}
                                    className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[var(--text-secondary,#FFF1D8)] hover:text-[var(--primary-accent,#FFDD9B)]"
                                    title="Set as featured cover image"
                                  >
                                    <Star size={14} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteImage(img._id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
                                  title="Delete screenshot"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Main Project Form */
                  <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Publication & Status Bar */}
                    <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Publication Status Selector */}
                        <div>
                          <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 uppercase tracking-wider block mb-1">
                            Publication Lifecycle Status
                          </span>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-primary,#FFFFFF)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                          >
                            <option value="draft">Draft (Hidden from public)</option>
                            <option value="under_review">Under Review (Admin only)</option>
                            <option value="published">Published (Visible to public)</option>
                            <option value="unpublished">Unpublished (Hidden)</option>
                            <option value="archived">Archived (Internal record)</option>
                          </select>
                        </div>

                        {/* Project Type Selector */}
                        <div>
                          <span className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)]/70 uppercase tracking-wider block mb-1">
                            Project Classification
                          </span>
                          <select
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-[var(--text-primary,#FFFFFF)] focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                          >
                            <option value="completed">Completed Project</option>
                            <option value="ongoing">Ongoing Deployment</option>
                            <option value="proposed">Proposed Project (Proposal)</option>
                          </select>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/[0.06]">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                          <input
                            type="checkbox"
                            checked={formData.pinned}
                            onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                            className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                          />
                          <span>Pin to top (Featured)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                          <input
                            type="checkbox"
                            checked={formData.showGithubLink}
                            onChange={(e) => setFormData({ ...formData, showGithubLink: e.target.checked })}
                            className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                          />
                          <span>Show GitHub link publicly</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                          <input
                            type="checkbox"
                            checked={formData.isMini}
                            onChange={(e) => setFormData({ ...formData, isMini: e.target.checked })}
                            className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                          />
                          <span>Mini / Research utility</span>
                        </label>
                      </div>
                    </div>

                    {/* Proposal Specific Controls (When projectType === 'proposed') */}
                    {formData.projectType === "proposed" && (
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} />
                            <span>Proposal Governance & Details</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-purple-200">Review Status:</span>
                            <select
                              value={formData.proposalStatus}
                              onChange={(e) => setFormData({ ...formData, proposalStatus: e.target.value })}
                              className="px-2.5 py-1 rounded bg-[var(--bg-base,#302E2D)] border border-purple-500/30 text-xs font-mono text-purple-300 focus:outline-none"
                            >
                              <option value="pending">Pending Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-mono font-bold text-purple-200 block">
                              Objectives (one per line)
                            </label>
                            <textarea
                              rows={2}
                              value={formData.objectives}
                              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                              placeholder="Objective 1&#10;Objective 2"
                              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-mono font-bold text-purple-200 block">
                              Expected Outcomes (one per line)
                            </label>
                            <textarea
                              rows={2}
                              value={formData.expectedOutcomes}
                              onChange={(e) => setFormData({ ...formData, expectedOutcomes: e.target.value })}
                              placeholder="Outcome 1&#10;Outcome 2"
                              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-mono font-bold text-purple-200 block">
                              Challenge / Problem Statement
                            </label>
                            <textarea
                              rows={2}
                              value={formData.challenges}
                              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                              placeholder="Background and critical problem being solved..."
                              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-mono font-bold text-purple-200 block">
                              Proposed Solution Architecture
                            </label>
                            <textarea
                              rows={2}
                              value={formData.proposedSolution}
                              onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                              placeholder="Proposed technical solution and delivery plan..."
                              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-purple-500/20 text-xs text-white focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Title, Category & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g. Ariiti Marketplace"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Category
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. Distributed Systems"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Engineering Role
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          placeholder="e.g. Full-Stack Architect"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                        Portfolio Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Comprehensive summary of the problem, architecture, throughput, and impact..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 leading-relaxed resize-none"
                      />
                    </div>

                    {/* Short Summary */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                        Brief Executive Summary (for cards & quick view)
                      </label>
                      <input
                        type="text"
                        value={formData.shortSummary}
                        onChange={(e) => setFormData({ ...formData, shortSummary: e.target.value })}
                        placeholder="e.g. Multi-tenant retail engine processing 50k daily transactions with 99.98% uptime."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                      />
                    </div>

                    {/* Client, Location & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Client or Partner
                        </label>
                        <input
                          type="text"
                          value={formData.clientOrPartner}
                          onChange={(e) => setFormData({ ...formData, clientOrPartner: e.target.value })}
                          placeholder="e.g. Ariiti Tech Ltd"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Addis Ababa / Remote"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          placeholder="e.g. Jan 2024"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Completion Date
                        </label>
                        <input
                          type="text"
                          value={formData.completionDate}
                          onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                          placeholder="e.g. Present / Nov 2024"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                        />
                      </div>
                    </div>

                    {/* Technologies (Comma-Separated) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                        Technologies & Stack (comma-separated) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.technologies}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        placeholder="TypeScript, Node.js, Express, MongoDB, Docker, TailwindCSS"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                      />
                    </div>

                    {/* Results, Impact & Equipment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Results & Key Impact (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.resultsAndImpact}
                          onChange={(e) => setFormData({ ...formData, resultsAndImpact: e.target.value })}
                          placeholder="Reduced order checkout latency by 64%&#10;Onboarded 12,000 active merchants"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 leading-relaxed resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Tools, Hardware & Equipment (comma-separated)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.equipment}
                          onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                          placeholder="AWS EC2, Nginx, Redis Clusters, Docker Swarm, Linux Ubuntu Server"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 leading-relaxed resize-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Highlights / Bullet points */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                        Architectural Highlights (one per line)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.highlights}
                        onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                        placeholder="High-throughput GraphQL gateway with sub-15ms response times&#10;Integrated multi-tier role-based access control"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono text-xs leading-relaxed resize-none"
                      />
                    </div>

                    {/* URLs: GitHub & Live Demo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                          Live Demo / Production URL
                        </label>
                        <input
                          type="url"
                          value={formData.demoUrl}
                          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50 font-mono"
                        />
                      </div>
                    </div>

                    {/* GitHub Integration Drawer */}
                    <div className="p-4 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Github className="w-5 h-5 text-[var(--primary-accent,#FFDD9B)]" />
                          <h4 className="text-sm font-bold text-white font-mono">
                            GitHub Repository Linkage
                          </h4>
                        </div>

                        {formData.githubRepoFullName && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                githubRepoFullName: "",
                                githubOwnerLogin: "",
                                githubRepoId: null,
                                sourceType: "manual",
                              })
                            }
                            className="text-xs text-red-400 hover:text-red-300 font-mono font-bold"
                          >
                            Disconnect Repo
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80 block">
                            Repository full_name (owner/repo)
                          </label>
                          <input
                            type="text"
                            value={formData.githubRepoFullName}
                            onChange={(e) => {
                              const val = e.target.value.trim();
                              const [owner] = val.split("/");
                              const isOrg = owner && owner.toLowerCase().includes("ariiti");
                              setFormData({
                                ...formData,
                                githubRepoFullName: val,
                                githubOwnerLogin: owner || "",
                                githubSourceScope: isOrg ? "ORGANIZATION" : "PERSONAL",
                                sourceType: isOrg ? "organization" : val ? "personal" : "manual",
                              });
                            }}
                            placeholder="e.g. yihune1234/mybot or AriitiMarket/platform"
                            className="w-full px-3.5 py-2 rounded-lg bg-[var(--card-surface,#403C38)] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[var(--primary-accent,#FFDD9B)]/50"
                          />
                        </div>

                        {/* Source Scope */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/80 block">
                            Source Ownership Scope
                          </label>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  githubSourceScope: "PERSONAL",
                                  sourceType: "personal",
                                })
                              }
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                                formData.sourceType === "personal" || formData.githubSourceScope === "PERSONAL"
                                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                                  : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)]/60"
                              }`}
                            >
                              Personal Lab
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  githubSourceScope: "ORGANIZATION",
                                  sourceType: "organization",
                                })
                              }
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                                formData.sourceType === "organization" || formData.githubSourceScope === "ORGANIZATION"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)]/60"
                              }`}
                            >
                              Ariiti Org
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  githubSourceScope: null,
                                  sourceType: "manual",
                                })
                              }
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                                formData.sourceType === "manual" && !formData.githubRepoFullName
                                  ? "bg-white/20 text-white border border-white/40"
                                  : "bg-white/[0.04] text-[var(--text-secondary,#FFF1D8)]/60"
                              }`}
                            >
                              Manual
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                          <input
                            type="checkbox"
                            checked={formData.showGithubMetrics}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                showGithubMetrics: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                          />
                          <span>Show Live Stars, Forks & Language Badges</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-secondary,#FFF1D8)]">
                          <input
                            type="checkbox"
                            checked={formData.autoSyncMetrics}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                autoSyncMetrics: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-[var(--primary-accent,#FFDD9B)] rounded cursor-pointer"
                          />
                          <span>Auto-sync metrics on schedule</span>
                        </label>
                      </div>
                    </div>

                    {/* Primary Cover Image Upload */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-[var(--text-secondary,#FFF1D8)] block">
                        Project Cover Image
                      </label>
                      <label className="flex flex-col items-center justify-center aspect-video rounded-xl bg-[var(--bg-base,#302E2D)] border-2 border-dashed border-white/[0.1] hover:border-[var(--primary-accent,#FFDD9B)]/40 cursor-pointer overflow-hidden transition-all group">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-6 space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-[var(--primary-accent,#FFDD9B)]/40 group-hover:scale-110 transition-transform" />
                            <div>
                              <span className="text-xs font-bold text-white block">
                                Choose or drop cover image
                              </span>
                              <span className="text-[10px] text-white/40 font-mono">
                                PNG, JPG, WebP up to 10MB
                              </span>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </form>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/[0.08] bg-[var(--bg-base,#302E2D)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-white text-xs font-bold font-mono hover:bg-white/[0.1] transition-all"
                >
                  Cancel
                </button>

                {!showImageManager && (
                  <button
                    type="submit"
                    form="project-form"
                    disabled={savingProject}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] text-[#302E2D] text-xs font-bold font-mono shadow-lg shadow-[#FFDD9B]/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProject ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    <span>{editingProject ? "Update Project" : "Create Project"}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectsManager;
