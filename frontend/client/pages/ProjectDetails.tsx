import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";
import { toast } from "react-toastify";

interface ProjectSection {
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

interface SectionMedia {
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

interface Project {
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

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<ProjectSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mediaCache, setMediaCache] = useState<Record<string, SectionMedia[]>>(
    {},
  );
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video";
    alt: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (id) {
      fetchProjectAndSections();
    }
  }, [id]);

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0]._id);
    }
  }, [sections, activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = document.querySelectorAll("[data-section-id]");
      const scrollPosition = window.scrollY + 100;

      for (const element of sectionElements) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;

        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          const sectionId = element.getAttribute("data-section-id");
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProjectAndSections = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectResult, sectionsResult] = await Promise.all([
        apiFetch(API_ENDPOINTS.PROJECTS_GET(id!)),
        apiFetch(`/api/project-sections/project/${id}`),
      ]);

      if (projectResult.success) {
        setProject(projectResult.data);
      } else {
        setError("Failed to fetch project");
        return;
      }

      if (sectionsResult.success) {
        const visibleSections = sectionsResult.data.filter(
          (section) => section.isVisible && !section.isDraft,
        );
        setSections(visibleSections);

        // Pre-fetch media for each section
        for (const section of visibleSections) {
          fetchMediaForSection(section._id);
        }
      } else {
        setError("Failed to fetch sections");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaForSection = async (sectionId: string) => {
    try {
      const result = await apiFetch(`/api/section-media/section/${sectionId}`);
      if (result.success) {
        setMediaCache((prev) => ({
          ...prev,
          [sectionId]: result.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching media for section ${sectionId}:`, error);
    }
  };

  const handleMediaClick = (media: SectionMedia) => {
    setSelectedMedia({
      url: media.url,
      type: media.type,
      alt: media.alt || "",
    });
    setIsPlaying(false);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setIsPlaying(false);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    setVolume(isMuted ? 0.7 : 0);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const renderSectionContent = (section: ProjectSection) => {
    const media = mediaCache[section._id] || [];
    const images = media.filter((m) => m.type === "image");
    const videos = media.filter((m) => m.type === "video");

    return (
      <div className="space-y-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F7FA] mb-4">
            {section.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
        </div>

        {/* Rich Text Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-[#F5F7FA] prose-p:text-[#B7C0D1] prose-strong:text-orange-400 prose-a:text-orange-400 hover:prose-a:text-orange-300"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />

        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#F5F7FA] flex items-center gap-2">
              <ImageIcon size={24} className="text-orange-500" />
              Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((media, index) => (
                <motion.div
                  key={media._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleMediaClick(media)}
                >
                  <div className="aspect-video bg-[#050816] rounded-lg border border-white/[0.08] overflow-hidden">
                    <img
                      src={media.url}
                      alt={media.alt || ""}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {media.caption && (
                    <p className="text-sm text-[#B7C0D1] mt-2 line-clamp-2">
                      {media.caption}
                    </p>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2 size={24} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#F5F7FA] flex items-center gap-2">
              <VideoIcon size={24} className="text-orange-500" />
              Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((media, index) => (
                <motion.div
                  key={media._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleMediaClick(media)}
                >
                  <div className="aspect-video bg-[#050816] rounded-lg border border-white/[0.08] overflow-hidden relative">
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      poster={images.find((img) => img.isPrimary)?.url}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 bg-orange-500/80 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-[#050816] ml-1" />
                      </div>
                    </div>
                  </div>
                  {media.caption && (
                    <p className="text-sm text-[#B7C0D1] mt-2 line-clamp-2">
                      {media.caption}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-[#B7C0D1]">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">Error</h2>
          <p className="text-[#B7C0D1] mb-6">
            {error || "Project not found or sections are not available."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] rounded-lg font-bold mx-auto"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Projects</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-[#050816] font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-[#F5F7FA] text-lg truncate max-w-xs sm:max-w-none">
                {project.title}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {project.githubUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
              )}
              {project.demoUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#B7C0D1] hover:text-orange-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5F7FA] mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-[#B7C0D1] max-w-3xl mx-auto mb-6">
            {project.description}
          </p>
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full text-sm text-[#B7C0D1]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Sticky Navigation */}
        {sections.length > 0 && (
          <div className="sticky top-20 z-40 bg-[#050816]/95 backdrop-blur-xl border-b border-white/[0.06] mb-8">
            <div className="flex overflow-x-auto pb-4 hide-scrollbar">
              {sections.map((section) => (
                <motion.button
                  key={section._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const element = document.getElementById(section._id);
                    if (element) {
                      const navHeight = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - navHeight;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`flex-shrink-0 px-6 py-3 mx-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    activeSection === section._id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-[#050816] shadow-lg shadow-orange-500/25"
                      : "text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.05]"
                  }`}
                >
                  {section.title}
                  {activeSection === section._id && (
                    <ChevronRight size={16} className="inline ml-2" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Sections Content */}
        <div className="space-y-32">
          {sections.map((section, index) => (
            <motion.section
              key={section._id}
              id={section._id}
              data-section-id={section._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="scroll-mt-24"
            >
              {renderSectionContent(section)}
            </motion.section>
          ))}
        </div>

        {/* Related Projects Section */}
        {project.technologies && project.technologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 20 }}
            viewport={{ once: true }}
            className="mt-32 pt-16 border-t border-white/[0.06]"
          >
            <h2 className="text-3xl font-bold text-[#F5F7FA] mb-8 text-center">
              Related Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {project.technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 text-center hover:border-orange-500/30 transition-all"
                >
                  <div className="text-sm font-medium text-[#B7C0D1] hover:text-orange-400 transition-colors">
                    {tech}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeMediaModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeMediaModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/[0.1] hover:bg-white/[0.2] rounded-lg text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative">
                {selectedMedia.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={selectedMedia.url}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                    controls={false}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onVolumeChange={() =>
                      videoRef.current && setVolume(videoRef.current.volume)
                    }
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.alt}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                )}

                {/* Video Controls */}
                {selectedMedia.type === "video" && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="p-2 text-white hover:text-orange-400 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} className="ml-1" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMute}
                        className="p-2 text-white hover:text-orange-400 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </motion.button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) =>
                          changeVolume(parseFloat(e.target.value))
                        }
                        className="flex-1 h-2 bg-white/[0.2] rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #FF8A00 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
                        }}
                      />

                      <span className="text-white text-sm ml-2">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedMedia.alt && (
                <div className="mt-4 text-center">
                  <p className="text-[#B7C0D1]">{selectedMedia.alt}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
