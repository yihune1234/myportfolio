import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  Video,
  GripVertical,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from "../../lib/api";
import { toast } from "react-toastify";

export default function ProjectSectionsManager() {
  const [sections, setSections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showMediaUploader, setShowMediaUploader] = useState(null);
  const [mediaFiles, setMediaFiles] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchSections();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_LIST);
      if (result.success) {
        setProjects(result.data);
        if (result.data.length > 0 && !selectedProject) {
          setSelectedProject(result.data[0]._id);
        }
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error fetching projects");
    }
  };

  const fetchSections = async () => {
    if (!selectedProject) return;

    try {
      const result = await apiFetch(
        `/api/project-sections/project/${selectedProject}`,
      );
      if (result.success) {
        setSections(Array.isArray(result.data) ? result.data : []);
      } else {
        toast.error("Failed to fetch sections");
      }
    } catch (error) {
      toast.error("Error fetching sections");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const sectionData = {
      project: selectedProject,
      title: formData.get("title"),
      content: formData.get("content"),
      order: sections.length,
      isVisible: formData.get("isVisible") === "on",
      isDraft: formData.get("isDraft") === "on",
    };

    try {
      const result = await apiFetch("/api/project-sections", {
        method: "POST",
        body: JSON.stringify(sectionData),
      });

      if (result.success) {
        toast.success("Section created successfully");
        setShowAddSection(false);
        fetchSections();
        form.reset();
      } else {
        toast.error(result.error || "Failed to create section");
      }
    } catch (error) {
      toast.error("Error creating section");
    }
  };

  const handleUpdateSection = async function (e) {
    e.preventDefault();

    if (!editingSection) return;

    const form = e.target;
    const formData = new FormData(form);

    const sectionData = {
      title: formData.get("title"),
      content: formData.get("content"),
      order: parseInt(formData.get("order")),
      isVisible: formData.get("isVisible") === "on",
      isDraft: formData.get("isDraft") === "on",
    };

    try {
      const result = await apiFetch(
        `/api/project-sections/${editingSection._id}`,
        {
          method: "PUT",
          body: JSON.stringify(sectionData),
        },
      );

      if (result.success) {
        toast.success("Section updated successfully");
        setEditingSection(null);
        fetchSections();
      } else {
        toast.error(result.error || "Failed to update section");
      }
    } catch (error) {
      toast.error("Error updating section");
    }
  };

  const handleDeleteSection = async function (sectionId) {
    if (
      !confirm(
        "Are you sure you want to delete this section? This will also delete all associated media.",
      )
    ) {
      return;
    }

    try {
      const result = await apiFetch(`/api/project-sections/${sectionId}`, {
        method: "DELETE",
      });

      if (result.success) {
        toast.success("Section deleted successfully");
        fetchSections();
      } else {
        toast.error(result.error || "Failed to delete section");
      }
    } catch (error) {
      toast.error("Error deleting section");
    }
  };

  const handleReorderSections = async function (sections) {
    try {
      const result = await apiFetch(
        "/api/project-sections/reorder/" + selectedProject,
        {
          method: "PUT",
          body: JSON.stringify({ sections }),
        },
      );

      if (result.success) {
        toast.success("Sections reordered successfully");
        fetchSections();
      } else {
        toast.error(result.error || "Failed to reorder sections");
      }
    } catch (error) {
      toast.error("Error reordering sections");
    }
  };

  const handleMediaUpload = async function () {
    if (!showMediaUploader || !mediaFiles) return;

    const formData = new FormData();
    for (var i = 0; i < mediaFiles.length; i++) {
      formData.append("media", mediaFiles[i]);
    }

    try {
      const result = await apiFetchFormData(
        `/api/project-sections/${showMediaUploader}/media`,
        formData,
      );

      if (result.success) {
        toast.success("Media uploaded successfully");
        setShowMediaUploader(null);
        setMediaFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.error || "Failed to upload media");
      }
    } catch (error) {
      toast.error("Error uploading media");
    }
  };

  const handleUpdateMedia = async function (mediaId, e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const mediaData = {
      alt: formData.get("alt"),
      caption: formData.get("caption"),
      order: parseInt(formData.get("order")),
      isPrimary: formData.get("isPrimary") === "on",
    };

    try {
      const result = await apiFetch(`/api/project-sections/media/${mediaId}`, {
        method: "PUT",
        body: JSON.stringify(mediaData),
      });

      if (result.success) {
        toast.success("Media updated successfully");
        fetchSections();
      } else {
        toast.error(result.error || "Failed to update media");
      }
    } catch (error) {
      toast.error("Error updating media");
    }
  };

  const handleDeleteMedia = async function (mediaId) {
    if (!confirm("Are you sure you want to delete this media?")) {
      return;
    }

    try {
      const result = await apiFetch(`/api/project-sections/media/${mediaId}`, {
        method: "DELETE",
      });

      if (result.success) {
        toast.success("Media deleted successfully");
        fetchSections();
      } else {
        toast.error(result.error || "Failed to delete media");
      }
    } catch (error) {
      toast.error("Error deleting media");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0B1637] rounded-xl border border-white/[0.08] p-6">
        <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">
          Select Project
        </h2>
        <select
          value={selectedProject}
          onChange={function (e) {
            setSelectedProject(e.target.value);
          }}
          className="w-full px-4 py-2 bg-[#050816] border border-white/[0.08] rounded-lg text-[#F5F7FA] focus:outline-none focus:border-orange-500"
        >
          {projects.map(function (project) {
            return (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            );
          })}
        </select>
      </div>

      {selectedProject && (
        <div className="bg-[#0B1637] rounded-xl border border-white/[0.08] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#F5F7FA]">
              Project Sections
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={function () {
                setShowAddSection(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all"
            >
              <Plus size={16} />
              Add Section
            </motion.button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-12 text-[#B7C0D1]">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No sections found. Add your first section to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map(function (section, index) {
                return (
                  <motion.div
                    key={section._id}
                    layout
                    className="bg-[#050816] rounded-lg border border-white/[0.08] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/[0.05] rounded-lg">
                          <GripVertical size={16} className="text-[#B7C0D1]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#F5F7FA]">
                            {section.title}
                          </h3>
                          <p className="text-sm text-[#B7C0D1]">
                            Order: {section.order}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${section.isDraft ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}
                        >
                          {section.isDraft ? "Draft" : "Published"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${section.isVisible ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}`}
                        >
                          {section.isVisible ? "Visible" : "Hidden"}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={function () {
                            setEditingSection(section);
                          }}
                          className="p-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={function () {
                            handleDeleteSection(section._id);
                          }}
                          className="p-2 text-[#B7C0D1] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-[#B7C0D1] text-sm line-clamp-2">
                        {section.content.substring(0, 150)}...
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#B7C0D1]">
                        Created:{" "}
                        {new Date(section.createdAt).toLocaleDateString()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={function () {
                          setShowMediaUploader(section._id);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-sm text-[#B7C0D1] transition-colors"
                      >
                        <Upload size={14} />
                        Upload Media
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {showMediaUploader === section._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-white/[0.02] rounded-lg border border-white/[0.08]"
                        >
                          <h4 className="font-medium text-[#F5F7FA] mb-3">
                            Upload Media
                          </h4>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={function (e) {
                              setMediaFiles(e.target.files);
                            }}
                            className="hidden"
                          />
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={function () {
                                fileInputRef.current?.click();
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-sm text-[#B7C0D1] transition-colors"
                            >
                              <ImageIcon size={16} />
                              Select Files
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleMediaUpload}
                              disabled={!mediaFiles}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Upload size={16} />
                              Upload
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={function () {
                                setShowMediaUploader(null);
                                setMediaFiles(null);
                                if (fileInputRef.current)
                                  fileInputRef.current.value = "";
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-sm text-[#B7C0D1] transition-colors"
                            >
                              <X size={16} />
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {(showAddSection || editingSection) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B1637] rounded-xl border border-white/[0.08] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#F5F7FA]">
                  {editingSection ? "Edit Section" : "Add New Section"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={function () {
                    setShowAddSection(false);
                    setEditingSection(null);
                  }}
                  className="p-2 text-[#B7C0D1] hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <form
                onSubmit={
                  editingSection ? handleUpdateSection : handleAddSection
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#B7C0D1] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingSection?.title}
                    className="w-full px-4 py-2 bg-[#050816] border border-white/[0.08] rounded-lg text-[#F5F7FA] focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B7C0D1] mb-2">
                    Content
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={8}
                    defaultValue={editingSection?.content}
                    className="w-full px-4 py-2 bg-[#050816] border border-white/[0.08] rounded-lg text-[#F5F7FA] focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#B7C0D1] mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingSection?.order || 0}
                      className="w-full px-4 py-2 bg-[#050816] border border-white/[0.08] rounded-lg text-[#F5F7FA] focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isVisible"
                      id="isVisible"
                      defaultChecked={editingSection?.isVisible ?? true}
                      className="w-4 h-4 text-orange-500 bg-[#050816] border-white/[0.08] rounded focus:ring-orange-500"
                    />
                    <label
                      htmlFor="isVisible"
                      className="text-sm text-[#B7C0D1]"
                    >
                      Visible to public
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isDraft"
                      id="isDraft"
                      defaultChecked={editingSection?.isDraft ?? false}
                      className="w-4 h-4 text-orange-500 bg-[#050816] border-white/[0.08] rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isDraft" className="text-sm text-[#B7C0D1]">
                      Save as draft
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all"
                  >
                    <Save size={16} />
                    {editingSection ? "Update Section" : "Create Section"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={function () {
                      setShowAddSection(false);
                      setEditingSection(null);
                    }}
                    className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-sm text-[#B7C0D1] transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
