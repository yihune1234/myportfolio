import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Upload, 
  ExternalLink, 
  FolderKanban, 
  Github,
  Globe,
  Search,
  Zap
} from 'lucide-react';
import CloudinaryImage from '../CloudinaryImage.jsx';
import { API_ENDPOINTS, apiFetch, apiFetchFormData } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

export function ProjectsManager({ showAddProject, setShowAddProject }) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
    role: 'Developer',
    isMini: false,
    image: null
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('data:')) return imagePath;
    
    if (imagePath.startsWith('http') && imagePath.includes('res.cloudinary.com')) {
      return imagePath;
    }

    let originalUrl = imagePath;
    if (!imagePath.startsWith('http')) {
      const BASE_URL = 'https://portfoliobackend-a6ah.onrender.com';
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      if (cleanPath.startsWith('uploads/')) {
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
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('technologies', JSON.stringify(formData.technologies.split(',').map(t => t.trim())));
    formDataToSend.append('githubUrl', formData.githubUrl);
    formDataToSend.append('demoUrl', formData.demoUrl);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('isMini', formData.isMini);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const url = editingProject
        ? API_ENDPOINTS.PROJECTS_UPDATE(editingProject._id)
        : API_ENDPOINTS.PROJECTS_CREATE;

      const result = await apiFetchFormData(
        url,
        formDataToSend,
        editingProject ? 'PUT' : 'POST'
      );

      if (result.success) {
        toast({
          title: editingProject ? "Updated" : "Created",
          description: `Project "${formData.title}" has been ${editingProject ? 'updated' : 'created'}.`
        });
        fetchProjects();
        window.dispatchEvent(new Event('projectsUpdated'));
        closeModal();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save project.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const result = await apiFetch(API_ENDPOINTS.PROJECTS_DELETE(id), {
        method: 'DELETE'
      });

      if (result.success) {
        toast({
          title: "Deleted",
          description: "Project has been removed."
        });
        fetchProjects();
        window.dispatchEvent(new Event('projectsUpdated'));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        role: project.role || 'Developer',
        isMini: project.isMini || false,
        image: null
      });
      setImagePreview(project.image ? getImageUrl(project.image) : null);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        demoUrl: '',
        role: 'Developer',
        isMini: false,
        image: null
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImagePreview(null);
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Projects</h2>
          <p className="text-sm text-slate-600">Manage your portfolio projects</p>
        </div>
        
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-fit"
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
            className="col-span-full py-16 sm:py-20 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-center space-y-4"
          >
            <FolderKanban size={40} className="text-slate-400" />
            <div>
              <p className="text-slate-600 font-bold mb-2">No projects yet</p>
              <p className="text-sm text-slate-500">Create your first project to get started</p>
            </div>
            <button 
              onClick={() => openModal()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all"
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
              className="group rounded-xl bg-white border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <CloudinaryImage
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={250}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700">
                  {project.technologies?.length || 0} tech
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 2).map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 rounded font-bold">
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-bold">
                      +{project.technologies.length - 2}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => openModal(project)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} /> 
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 p-4 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between z-10">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h3>
                <button 
                  onClick={closeModal} 
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                {/* Title & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <InputField
                    label="Title"
                    placeholder="Project name"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <InputField
                    label="Role"
                    placeholder="e.g. Developer"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Description</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-900 placeholder-slate-400 resize-none"
                    placeholder="Project description..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Technologies */}
                <InputField
                  label="Technologies (comma-separated)"
                  placeholder="React, Node, MongoDB"
                  value={formData.technologies}
                  onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                  required
                />

                {/* URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <InputField
                    label="GitHub URL"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                  <InputField
                    label="Demo URL"
                    placeholder="https://..."
                    value={formData.demoUrl}
                    onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Project Image</label>
                  <label className="flex flex-col items-center justify-center aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                      <div className="text-center space-y-2 py-8">
                        <Upload size={28} className="mx-auto text-slate-400" />
                        <div>
                          <span className="text-sm font-bold text-slate-600 block">Upload Image</span>
                          <span className="text-xs text-slate-500">PNG, JPG up to 5MB</span>
                        </div>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                {/* Mini Project Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="isMini"
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    checked={formData.isMini}
                    onChange={e => setFormData({ ...formData, isMini: e.target.checked })}
                  />
                  <label htmlFor="isMini" className="text-sm font-bold text-slate-700 cursor-pointer flex-1">
                    Mark as mini/experimental project
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="flex-1 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? <Zap size={16} className="animate-spin" /> : <Zap size={16} />}
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const InputField = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 block">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-900 placeholder-slate-400"
    />
  </div>
);
