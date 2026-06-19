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
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

export default function EducationSection() {
  const studyAreas = [
    "Data Structures & Algorithms",
    "Database Systems",
    "Web Development",
    "Mobile App Development",
    "Network Security",
    "Software Architecture",
    "Cloud Computing",
    "System Design",
    "Software Testing",
  ];

  return (
    <section
      id="education"
      className="section-padding relative overflow-hidden bg-background border-t border-white/[0.06]"
    >
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#FF8A00]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-[#FFB020]/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mb-4">
            Education
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Academic foundation in software engineering with focus on modern
            development practices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:border-[#FF8A00]/20 transition-all duration-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] mb-2 leading-tight">
                  BSc in Software Engineering
                </h3>
                <p className="text-base font-bold text-[#B7C0D1]">
                  Haramaya University
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#FF8A00]/10 to-[#FF6B00]/10 border border-[#FF8A00]/10 w-fit group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-8 h-8 text-[#FF8A00]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-white/[0.08] mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <BookOpen className="w-5 h-5 text-[#FF8A00]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest mb-0.5">
                    Status
                  </p>
                  <p className="font-bold text-[#F5F7FA]">In Progress</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <Sparkles className="w-5 h-5 text-[#FF8A00]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest mb-0.5">
                    Focus
                  </p>
                  <p className="font-bold text-[#F5F7FA]">
                    Software Engineering
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#B7C0D1] leading-relaxed">
              Rigorous curriculum in foundational computer science, advanced
              software development methodologies, and system architecture.
            </p>
          </motion.div>

          {/* Areas of Study */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:border-[#FF8A00]/20 transition-all duration-500 h-fit"
          >
            <h4 className="text-base font-bold text-[#F5F7FA] mb-6">
              Core Focus Areas
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {studyAreas.map((area, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-[#FF8A00]/20 transition-all group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] shadow-lg shadow-[#FF8A00]/30" />
                  <span className="text-xs font-bold text-[#B7C0D1] group-hover:text-[#F5F7FA] transition-colors">
                    {area}
                  </span>
                </motion.div>
              ))}
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
        title: "Error",
        description: "Please fill in all fields",
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
          title: "Message Sent!",
          description: "I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia" },
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
  ];

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden bg-background border-t border-white/[0.06]"
    >
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#FF8A00]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-[#FFB020]/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mb-4">
            Let's Connect
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl mx-auto leading-relaxed">
            Open for full-time roles, freelance projects, and research
            collaborations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] space-y-6">
              <h3 className="text-lg font-bold text-[#F5F7FA]">
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactInfo.map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] group-hover:border-[#FF8A00]/20 transition-all duration-500">
                      <info.icon className="w-5 h-5 text-[#FF8A00]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest mb-0.5">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-bold text-[#F5F7FA] text-sm hover:text-[#FF8A00] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-bold text-[#F5F7FA] text-sm">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08]">
              <h4 className="font-bold text-[#F5F7FA] mb-3 uppercase tracking-[0.15em] text-xs">
                Availability
              </h4>
              <p className="text-sm text-[#B7C0D1] leading-relaxed">
                Open for full-time roles, freelance projects, and research
                collaborations.
                <br />
                <span className="text-[#FF8A00] font-bold">
                  Response: 24 hours
                </span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#0B1637] border border-white/[0.08] space-y-6 relative overflow-hidden hover:border-[#FF8A00]/20 transition-all duration-500"
            >
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-[#050816]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 rounded-2xl"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6 border border-[#FF8A00]/20"
                    >
                      <CheckCircle2 className="w-10 h-10 text-[#FF8A00]" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-[#F5F7FA] mb-2">
                      Message Received!
                    </h3>
                    <p className="text-[#B7C0D1] text-sm max-w-xs">
                      Thank you for reaching out. I'll get back to you shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest ml-1">
                    Name
                  </label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#FF8A00] focus:bg-white/[0.05] transition-all outline-none text-[#F5F7FA] placeholder:text-[#B7C0D1]/30 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#FF8A00] focus:bg-white/[0.05] transition-all outline-none text-[#F5F7FA] placeholder:text-[#B7C0D1]/30 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest ml-1">
                  Subject
                </label>
                <input
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#FF8A00] focus:bg-white/[0.05] transition-all outline-none text-[#F5F7FA] placeholder:text-[#B7C0D1]/30 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest ml-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#FF8A00] focus:bg-white/[0.05] transition-all outline-none resize-none text-[#F5F7FA] placeholder:text-[#B7C0D1]/30 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-xl font-bold hover:shadow-[0_0_40px_rgba(255,138,0,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
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
