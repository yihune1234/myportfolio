import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, GraduationCap, Calendar, BookOpen, Send, CheckCircle2, Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

export default function EducationSection() {
  const studyAreas = [
    "Data Structures & Algorithms",
    "Database Systems",
    "Web Development",
    "Mobile Application Dev",
    "Network Security",
    "Software Architecture",
    "Cloud Computing",
    "System Design",
    "Software Testing",
  ];

  return (
    <section id="education" className="section-padding bg-slate-50 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Education
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Education Main Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] group relative overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
                  Bachelor of Science in <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Computer Science</span>
                </h3>
                <p className="text-lg font-bold text-slate-500">
                  Haramaya University
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10 border-y border-slate-100">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-slate-900 text-lg">In Progress</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Focus</p>
                  <p className="font-bold text-slate-900 text-lg">Software Engineering</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-lg text-slate-600 leading-relaxed">
                Pursuing a rigorous curriculum focused on foundational computer science principles, advanced software development methodologies, and system architecture.
              </p>
            </div>
          </motion.div>

          {/* Areas of Study */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden h-fit"
          >
            <h4 className="text-xl font-black text-slate-900 mb-8">Core Focus Areas</h4>
            <div className="grid grid-cols-1 gap-3">
              {studyAreas.map((area, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-lg transition-all group flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                  <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{area}</span>
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
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const result = await apiFetch(API_ENDPOINTS.MESSAGES_CREATE, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (result.success) {
        toast({ title: "Message Sent!", description: "I'll get back to you soon." });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia" },
    { icon: Mail, label: "Email", value: "your-email@example.com", href: "mailto:your-email@example.com" },
    { icon: Phone, label: "Phone", value: "+251 XXX XXX XXX", href: "tel:+251900000000" },
  ];

  return (
    <section id="contact" className="section-padding bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Let's Connect
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-10 rounded-[2.5rem] space-y-10 border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">Contact Information</h3>
              <div className="space-y-8">
                {contactInfo.map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 group-hover:shadow-lg group-hover:border-primary transition-all duration-500">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-bold text-slate-900 text-lg hover:text-primary transition-colors">{info.value}</a>
                      ) : (
                        <p className="font-bold text-slate-900 text-lg">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <h4 className="font-black text-slate-900 mb-4 uppercase tracking-[0.2em] text-sm">Availability</h4>
              <p className="text-slate-600 leading-relaxed">
                Open for full-time roles, freelance projects, and research collaborations. Typical response time: <span className="text-primary font-bold">24 hours</span>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] space-y-8 relative overflow-hidden border border-slate-100 shadow-2xl">
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"
                    >
                      <CheckCircle2 className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">Message Received!</h3>
                    <p className="text-slate-600 max-w-xs text-lg">Thank you for reaching out. I'll get back to you shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white transition-all outline-none resize-none text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-200 text-lg"
              >
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
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
