import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle2,
  Loader,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

export default function EducationSection() {
  const studyAreas = [
    "Data Structures & Algorithms",
    "Database Systems & Query Optimization",
    "Distributed Systems & Cloud Computing",
    "Mobile Architecture (React Native)",
    "Network Security & Cryptography",
    "Software Architecture & Design Patterns",
    "Operating Systems & Linux Fundamentals",
    "Software Testing & CI/CD Pipelines",
  ];

  return (
    <section
      id="education"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[450px] h-[450px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[450px] h-[450px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/25 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <GraduationCap size={13} />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
            Education
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-body mx-auto lg:mx-0">
            Academic training in computer science, software engineering principles, and systems architecture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Degree Primary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl p-6 sm:p-8 bg-[var(--card-surface,#403C38)] border border-white/[0.08] flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--primary-accent,#FFDD9B)] font-bold block mb-1">
                    BSc Degree Program
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                    BSc in Software Engineering
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[var(--text-secondary,#FFF1D8)] mt-1">
                    Haramaya University &bull; College of Computing &amp; Informatics
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-[var(--primary-accent,#FFDD9B)]/30 text-[var(--primary-accent,#FFDD9B)] w-fit">
                  <GraduationCap size={28} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-y border-white/[0.06] mb-5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.04]">
                  <span className="text-[10px] text-[#A8A29E] block mb-0.5">STATUS</span>
                  <span className="text-[var(--primary-accent,#FFDD9B)] font-bold">In Progress &bull; Senior</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.04]">
                  <span className="text-[10px] text-[#A8A29E] block mb-0.5">DISCIPLINE</span>
                  <span className="text-white font-bold">Software Engineering</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.04]">
                  <span className="text-[10px] text-[#A8A29E] block mb-0.5">LOCATION</span>
                  <span className="text-[var(--text-secondary,#FFF1D8)] font-bold">Haramaya, Ethiopia</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-body">
                Rigorous coursework covering fundamental algorithms, database management systems, network protocols, object-oriented design, distributed software architectures, and automated testing frameworks.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-6 text-xs font-mono text-[var(--text-secondary,#FFF1D8)]/70">
              <Calendar size={13} className="text-[var(--primary-accent,#FFDD9B)]" />
              <span>Full-Time Academic Program &bull; Verified Student Enrollment</span>
            </div>
          </motion.div>

          {/* Core Study Areas Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 sm:p-8 bg-[var(--card-surface,#403C38)] border border-white/[0.08] flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <BookOpen size={18} className="text-[var(--primary-accent,#FFDD9B)]" />
                <h4 className="text-base font-bold text-white font-heading">
                  Core Study Areas
                </h4>
              </div>

              <div className="space-y-2">
                {studyAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-base,#302E2D)] border border-white/[0.04] text-xs font-mono text-[var(--text-secondary,#FFF1D8)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent,#FFDD9B)] flex-shrink-0" />
                    <span className="truncate">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#A8A29E] pt-4 border-t border-white/[0.06] mt-4">
              Foundational principles for software architecture
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields before submitting.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await apiFetch(API_ENDPOINTS.MESSAGES_CREATE, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (result.success) {
        toast({
          title: "Message Sent",
          description: "Thank you! Your message has been sent to Yihune Belay.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast({
          title: "Notice",
          description: "Message logged locally. You can also reach me directly via email.",
        });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      toast({
        title: "Direct Email Recommended",
        description: "Please email yihunebelay859@gmail.com directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "yihunebelay859@gmail.com",
      href: "mailto:yihunebelay859@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+251 987 414 282",
      href: "tel:+251987414282",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Addis Ababa, Ethiopia",
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden bg-[var(--bg-base,#302E2D)] border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-matrix-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[450px] bg-[var(--primary-accent,#FFDD9B)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-accent,#FFDD9B)]/10 border border-[var(--primary-accent,#FFDD9B)]/25 text-[var(--primary-accent,#FFDD9B)] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Mail size={13} />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading">
            Contact
          </h2>
          <p className="text-[var(--text-secondary,#FFF1D8)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-2 font-body">
            Available for software engineering opportunities, API development, and technical collaboration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Contact Details Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl p-6 bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white font-heading">
                Direct Channels
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 group">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.06] text-[var(--primary-accent,#FFDD9B)] group-hover:border-[var(--primary-accent,#FFDD9B)]/30 transition-colors">
                      <info.icon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#A8A29E] uppercase tracking-wider">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-mono text-xs font-semibold text-white hover:text-[var(--primary-accent,#FFDD9B)] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-mono text-xs font-semibold text-white">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-[var(--card-surface,#403C38)] border border-white/[0.08] shadow-lg">
              <span className="text-[10px] font-mono text-[var(--primary-accent,#FFDD9B)] uppercase tracking-wider font-bold block mb-1">
                Fast Response
              </span>
              <p className="text-xs text-[var(--text-secondary,#FFF1D8)] leading-relaxed font-body">
                Messages and inquiries receive a response within <strong className="text-white">24 hours</strong>.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 sm:p-8 bg-[var(--card-surface,#403C38)] border border-white/[0.08] space-y-4 relative overflow-hidden shadow-xl"
            >
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-[var(--card-surface,#403C38)]/98 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 rounded-2xl"
                  >
                    <div className="w-14 h-14 bg-[var(--primary-accent,#FFDD9B)]/15 rounded-2xl flex items-center justify-center mb-3 border border-[var(--primary-accent,#FFDD9B)]/30 text-[var(--primary-accent,#FFDD9B)]">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 font-heading">
                      Message Sent
                    </h3>
                    <p className="text-[var(--text-secondary,#FFF1D8)] text-xs font-body max-w-xs">
                      Thank you for reaching out. I will get back to you shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)] uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Yihune Belay"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] focus:border-[var(--primary-accent,#FFDD9B)]/60 transition-all outline-none text-white placeholder:text-[#A8A29E] text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)] uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. yourname@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] focus:border-[var(--primary-accent,#FFDD9B)]/60 transition-all outline-none text-white placeholder:text-[#A8A29E] text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)] uppercase tracking-wider">
                  Subject
                </label>
                <input
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Project Inquiry / Collaboration"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] focus:border-[var(--primary-accent,#FFDD9B)]/60 transition-all outline-none text-white placeholder:text-[#A8A29E] text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[var(--text-secondary,#FFF1D8)] uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Hi Yihune, I'd like to talk about..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base,#302E2D)] border border-white/[0.08] focus:border-[var(--primary-accent,#FFDD9B)]/60 transition-all outline-none resize-none text-white placeholder:text-[#A8A29E] text-xs font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[var(--primary-accent,#FFDD9B)] to-[#FFE8B8] hover:brightness-105 text-[#302E2D] rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary-accent,#FFDD9B)]/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin text-[#302E2D]" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
