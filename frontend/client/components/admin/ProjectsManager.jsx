import { useState, useEffect } from "react";
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
} from "lucide-react";
import CloudinaryImage from "../CloudinaryImage.jsx";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

export function ProjectsManager({ showAddProject, setShowAddProject }) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [projectImages, setProjectImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
    role: "Developer",
    isMini: false,
    image: null,
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("data:")) return imagePath;
    if (
      imagePath.startsWith("http") &&
      imagePath.includes("res.cloudinary.com")
    ) {
      return imagePath;
    }
    let originalUrl = imagePath;
    if (!imagePath.startsWith("http")) {
      const BASE_URL = "https://portfoliobackend-a6ah.onrender.com";
      const cleanPath = imagePath.startsWith("/")
        ? imagePath.substring(1)
        : imagePath;
      if (cleanPath.startsWith("uploads/")) {
        originalUrl = `${BASE_URL}/${cleanPath}`;
      } else {
        originalUrl = `${BASE_URL}/uploads/${cleanPath}`;
      }
    }
    return `https://res.cloudinary.com/dqcrqtzz6/image/fetch/f_auto,q_auto/${originalUrl}`;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (showAddProject) {
      openModal();
      setShowAddProject(false);
    }
  }, [showAddProject, setShowAddProject]);

  const fetchProjects = async () => {
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_LIST);
      if (result.success) {
        setProjects(result.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch projects.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "technologies",
      JSON.stringify(formData.technologies.split(",").map((t) => t.trim())),
    );
    formDataToSend.append("githubUrl", formData.githubUrl);
    formDataToSend.append("demoUrl", formData.demoUrl);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("isMini", formData.isMini);

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
        editingProject ? "PUT" : "POST",
      );

      if (result.success) {
        toast({
          title: editingProject ? "Updated" : "Created",
          description: `Project "${formData.title}" has been ${editingProject ? "updated" : "created"}.`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
        closeModal();

        // If project was just created, open image manager
        if (!editingProject && result.data?.project?._id) {
          setTimeout(() => {
            openImageManager(result.data.project);
          }, 300);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const result = await apiFetchFormData(
        API_ENDPOINTS.PROJECT_IMAGES_UPLOAD(editingProject._id),
        formData,
        "POST",
      );

      if (result.success) {
        toast({
          title: "Images Uploaded",
          description: `${files.length} image(s) uploaded successfully.`,
        });
        fetchProjectImages(editingProject._id);
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      } else {
        toast({
          title: "Upload Error",
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
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const result = await apiFetch(
        API_ENDPOINTS.PROJECT_IMAGE_DELETE(editingProject._id, imageId),
        { method: "DELETE" },
      );

      if (result.success) {
        toast({
          title: "Deleted",
          description: "Image has been removed.",
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
        },
      );

      if (result.success) {
        toast({
          title: "Featured Image Set",
          description: "Featured image has been updated.",
        });
        fetchProjectImages(editingProject._id);
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      }
    } catch (error) {
      console.error("Error setting featured image:", error);
    }
  };

  const handleUpdateImageTitle = async (imageId, title) => {
    try {
      const result = await apiFetch(
        API_ENDPOINTS.PROJECT_IMAGE_UPDATE(editingProject._id, imageId),
        {
          method: "PUT",
          body: JSON.stringify({ title }),
        },
      );

      if (result.success) {
        fetchProjectImages(editingProject._id);
      }
    } catch (error) {
      console.error("Error updating image title:", error);
    }
  };

  const handleReorder = async (reorderedImages) => {
    setProjectImages(reorderedImages);
    const imageOrder = reorderedImages.map((img) => img._id);

    try {
      await apiFetch(
        API_ENDPOINTS.PROJECT_IMAGES_REORDER(editingProject._id),
        {
          method: "PUT",
          body: JSON.stringify({ imageOrder }),
        },
      );
      fetchProjects();
      window.dispatchEvent(new Event("projectsUpdated"));
    } catch (error) {
      console.error("Error reordering images:", error);
    }
  };

  const handlePinToggle = async (id, currentlyPinned) => {
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_PIN_TOGGLE(id), {
        method: "PUT",
      });

      if (result.success) {
        toast({
          title: currentlyPinned ? "Unpinned" : "Pinned!",
          description: `Project has been ${currentlyPinned ? "unpinned" : "pinned to top"}.`,
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_DELETE(id), {
        method: "DELETE",
      });

      if (result.success) {
        toast({
          title: "Deleted",
          description: "Project has been removed.",
        });
        fetchProjects();
        window.dispatchEvent(new Event("projectsUpdated"));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(", "),
        githubUrl: project.githubUrl || "",
        demoUrl: project.demoUrl || "",
        role: project.role || "Developer",
        isMini: project.isMini || false,
        image: null,
      });
      setImagePreview(project.image ? getImageUrl(project.image) : null);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        demoUrl: "",
        role: "Developer",
        isMini: false,
        image: null,
      });
      setImagePreview(null);
    }
    setShowModal(true);
    setShowImageManager(false);
    setProjectImages([]);
  };

  const openImageManager = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      role: project.role || "Developer",
      isMini: project.isMini || false,
      image: null,
    });
    setImagePreview(project.image ? getImageUrl(project.image) : null);
    setShowModal(true);
    setShowImageManager(true);
    fetchProjectImages(project._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImagePreview(null);
    setShowImageManager(false);
    setProjectImages([]);
    setSelectedImage(null);
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] mb-1">
            Projects
          </h2>
          <p className="text-sm text-[#B7C0D1]">
            Manage your portfolio projects
          </p>
        </div>

        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] px-6 py-3 rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all flex items-center justify-center gap-2 w-full sm:w-fit"
        >
          <Plus size={18} />
          New Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-16 sm:py-20 rounded-xl border border-white/[0.06] bg-[#0B1637] flex flex-col items-center justify-center text-center space-y-4"
          >
            <FolderKanban size={40} className="text-[#FF8A00]/30" />
            <div>
              <p className="text-[#F5F7FA] font-bold mb-2">No projects yet</p>
              <p className="text-sm text-[#B7C0D1]">
                Create your first project to get started
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-6 py-2 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all"
            >
              Create Project
            </button>
          </motion.div>
        ) : (
          projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-xl border border-white/[0.06] bg-[#0B1637] overflow-hidden hover:border-[#FF8A00]/25 hover:shadow-lg hover:shadow-[#FF8A00]/5 transition-all flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-[#050816]">
                <CloudinaryImage
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={250}
                />
                {project.pinned && (
                  <div className="absolute top-3 left-3 bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] px-2.5 py-1 rounded-full text-[9px] font-black text-[#050816] uppercase tracking-wider shadow-lg shadow-[#FF8A00]/30 flex items-center gap-1">
                    <Pin size={10} className="fill-current" />
                    Pinned
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-[#050816]/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#B7C0D1] border border-white/[0.06]">
                  {project.images?.length || 0} images
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <h3 className="text-base sm:text-lg font-black text-[#F5F7FA] mb-2 group-hover:text-[#FF8A00] transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-[#B7C0D1] text-xs sm:text-sm line-clamp-2 mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 2).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-[#FF8A00]/10 text-[#FF8A00] rounded font-bold border border-[#FF8A00]/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 2 && (
                    <span className="text-[10px] px-2 py-1 bg-white/[0.04] text-[#B7C0D1] rounded font-bold border border-white/[0.06]">
                      +{project.technologies.length - 2}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-2 mb-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#B7C0D1] hover:text-[#FF8A00] transition-colors"
                    >
                      <Github size={12} />
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#B7C0D1] hover:text-[#FF8A00] transition-colors"
                    >
                      <ExternalLink size={12} />
                      Demo
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => handlePinToggle(project._id, project.pinned)}
                    className={`py-2 px-3 rounded-lg transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 ${
                      project.pinned
                        ? "bg-[#FF8A00] text-[#050816] shadow-[0_0_12px_rgba(255,138,0,0.25)]"
                        : "bg-white/[0.04] text-[#B7C0D1] hover:bg-[#FF8A00]/10 hover:text-[#FF8A00]"
                    }`}
                    title={
                      project.pinned ? "Unpin project" : "Pin project to top"
                    }
                  >
                    <Pin
                      size={14}
                      className={project.pinned ? "fill-current" : ""}
                    />
                  </button>
                  <button
                    onClick={() => openModal(project)}
                    className="flex-1 py-2 bg-[#FF8A00]/10 text-[#FF8A00] rounded-lg hover:bg-[#FF8A00] hover:text-[#050816] transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => openImageManager(project)}
                    className="py-2 px-3 bg-[#FF8A00]/10 text-[#FF8A00] rounded-lg hover:bg-[#FF8A00] hover:text-[#050816] transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                    title="Manage images"
                  >
                    <ImageIcon size={14} />
                    <span className="hidden sm:inline">Images</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="py-2 px-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold text-xs sm:text-sm flex items-center justify-center"
                    title="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl rounded-xl border border-white/[0.08] bg-[#0B1637] shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 p-4 sm:p-6 border-b border-white/[0.06] bg-[#0B1637] flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  {showImageManager && (
                    <button
                      onClick={() => setShowImageManager(false)}
                      className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors text-[#B7C0D1] hover:text-[#F5F7FA]"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h3 className="text-xl sm:text-2xl font-black text-[#F5F7FA]">
                    {showImageManager
                      ? `Manage Images — ${editingProject?.title}`
                      : editingProject
                      ? "Edit Project"
                      : "New Project"}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors flex-shrink-0 text-[#B7C0D1] hover:text-[#F5F7FA]"
                >
                  <X size={20} />
                </button>
              </div>

              {showImageManager ? (
                /* Image Manager View */
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Upload Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
                          <Layers size={18} className="text-[#FF8A00]" />
                          Project Screenshots
                        </h4>
                        <p className="text-sm text-[#B7C0D1] mt-1">
                          Upload, reorder, and manage project images. The first
                          image is used as the cover.
                        </p>
                      </div>
                    </div>

                    {/* Upload area */}
                    <label className="flex items-center justify-center p-8 bg-[#050816] border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-[#FF8A00]/30 hover:bg-[#FF8A00]/[0.02] transition-all group">
                      <div className="text-center space-y-3">
                        <Camera
                          size={36}
                          className="mx-auto text-[#FF8A00]/40 group-hover:text-[#FF8A00]/60 transition-colors"
                        />
                        <div>
                          <span className="text-sm font-bold text-[#B7C0D1] block">
                            {uploadingImages
                              ? "Uploading..."
                              : "Click to Upload Images"}
                          </span>
                          <span className="text-xs text-[#B7C0D1]/50">
                            PNG, JPG, WebP — Select multiple files
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleUploadImages}
                        disabled={uploadingImages}
                      />
                    </label>
                  </div>

                  {/* Images Grid — Reorderable */}
                  {projectImages.length === 0 ? (
                    <div className="text-center py-12 bg-[#050816] rounded-xl border border-white/[0.06]">
                      <ImageIcon
                        size={40}
                        className="mx-auto text-[#FF8A00]/20 mb-3"
                      />
                      <p className="text-[#B7C0D1] font-medium">
                        No images yet. Upload screenshots above.
                      </p>
                    </div>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={projectImages}
                      onReorder={handleReorder}
                      className="space-y-3"
                    >
                      {projectImages.map((img) => (
                        <Reorder.Item
                          key={img._id}
                          value={img}
                          className="bg-[#050816] border border-white/[0.08] rounded-xl overflow-hidden hover:border-[#FF8A00]/25 transition-all group/item"
                        >
                          <div className="flex items-center gap-4 p-3">
                            {/* Drag Handle */}
                            <div className="cursor-grab active:cursor-grabbing text-[#B7C0D1]/40 hover:text-[#FF8A00] transition-colors flex-shrink-0">
                              <GripVertical size={20} />
                            </div>

                            {/* Thumbnail */}
                            <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-[#0B1637] flex-shrink-0">
                              <img
                                src={img.url}
                                alt={img.title || "Project screenshot"}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info & Actions */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                defaultValue={img.title}
                                placeholder="Image title..."
                                onBlur={(e) =>
                                  handleUpdateImageTitle(img._id, e.target.value)
                                }
                                className="w-full bg-transparent text-sm font-bold text-[#F5F7FA] outline-none border-b border-transparent focus:border-[#FF8A00]/50 pb-1 placeholder-[#B7C0D1]/40"
                              />
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[#B7C0D1]/50">
                                  Order: {img.order + 1}
                                </span>
                                {img.isFeatured && (
                                  <span className="px-2 py-0.5 bg-[#FF8A00]/10 text-[#FF8A00] text-[9px] font-bold rounded border border-[#FF8A00]/20">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!img.isFeatured && (
                                <button
                                  onClick={() => handleSetFeatured(img._id)}
                                  className="p-2 text-[#B7C0D1] hover:text-[#FF8A00] hover:bg-[#FF8A00]/10 rounded-lg transition-all"
                                  title="Set as featured image"
                                >
                                  <Star size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteImage(img._id)}
                                className="p-2 text-[#B7C0D1] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete image"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>
              ) : (
                /* Project Edit/Create Form */
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                  {/* Title & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <InputField
                      label="Title"
                      placeholder="Project name"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                    <InputField
                      label="Role"
                      placeholder="e.g. Developer"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-[#B7C0D1] block mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-4 py-2.5 bg-[#050816] border border-white/[0.08] rounded-lg outline-none focus:border-[#FF8A00]/50 transition-all font-medium text-[#F5F7FA] placeholder-[#B7C0D1]/40 resize-none"
                      placeholder="Project description..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Technologies */}
                  <InputField
                    label="Technologies (comma-separated)"
                    placeholder="React, Node, MongoDB"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData({ ...formData, technologies: e.target.value })
                    }
                    required
                  />

                  {/* URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <InputField
                      label="GitHub URL"
                      placeholder="https://github.com/..."
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                    />
                    <InputField
                      label="Demo URL"
                      placeholder="https://..."
                      value={formData.demoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, demoUrl: e.target.value })
                      }
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-xs font-bold text-[#B7C0D1] block mb-2">
                      Project Cover Image
                    </label>
                    <label className="flex flex-col items-center justify-center aspect-video bg-[#050816] border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-[#FF8A00]/30 hover:bg-[#FF8A00]/[0.02] transition-all">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Preview"
                        />
                      ) : (
                        <div className="text-center space-y-2 py-8">
                          <Upload
                            size={28}
                            className="mx-auto text-[#FF8A00]/40"
                          />
                          <div>
                            <span className="text-sm font-bold text-[#B7C0D1] block">
                              Upload Cover Image
                            </span>
                            <span className="text-xs text-[#B7C0D1]/50">
                              PNG, JPG up to 5MB
                            </span>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  {/* Mini Project Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-[#050816] rounded-lg border border-white/[0.06]">
                    <input
                      type="checkbox"
                      id="isMini"
                      className="w-4 h-4 accent-[#FF8A00] rounded cursor-pointer"
                      checked={formData.isMini}
                      onChange={(e) =>
                        setFormData({ ...formData, isMini: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="isMini"
                      className="text-sm font-bold text-[#B7C0D1] cursor-pointer flex-1"
                    >
                      Mark as mini/experimental project
                    </label>
                  </div>

                  {/* Image count if editing */}
                  {editingProject && (editingProject.images?.length > 0) && (
                    <div className="flex items-center gap-2 p-3 bg-[#FF8A00]/5 rounded-lg border border-[#FF8A00]/15">
                      <ImageIcon size={16} className="text-[#FF8A00]" />
                      <span className="text-sm text-[#B7C0D1]">
                        {editingProject.images.length} screenshot(s) uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowImageManager(true)}
                        className="ml-auto text-xs font-bold text-[#FF8A00] hover:text-[#FF8B00]/80 transition-colors"
                      >
                        Manage Images →
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 bg-white/[0.04] text-[#B7C0D1] rounded-lg font-bold hover:bg-white/[0.08] transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {editingProject ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const InputField = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-[#B7C0D1] block">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2.5 bg-[#050816] border border-white/[0.08] rounded-lg outline-none focus:border-[#FF8A00]/50 transition-all font-medium text-[#F5F7FA] placeholder-[#B7C0D1]/40"
    />
  </div>
);